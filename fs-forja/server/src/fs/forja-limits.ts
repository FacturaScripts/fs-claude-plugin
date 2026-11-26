/**
 * Límites de la API de autor de Forja que el cliente respeta por su cuenta para no agotarlos. Reproducen cómo los
 * cuenta el servidor (`ApiForja` y `RequestLimiter` del plugin Forja):
 *
 * - 30 peticiones por minuto y 300 por hora **por IP**, en ventanas que empiezan con la primera petición. Cuentan
 *   todas las peticiones, también las que se rechazan con 429, que llevan la cabecera `Retry-After`.
 * - Cada petición con un token no válido (401) se apunta como intento fallido de la IP durante 10 minutos; con 5
 *   intentos en esa ventana, aunque haya peticiones correctas entre medias, la IP queda bloqueada y todas sus
 *   peticiones reciben 403 hasta que caducan.
 *
 * `ForjaRateLimiter` espacia las peticiones con una ventana deslizante (más estricta que la fija del servidor) y un
 * pequeño margen, y se pausa cuando la forja responde 429 con `Retry-After`. `ForjaAuthGuard` cuenta los 401 de la
 * misma ventana de 10 minutos y deja de enviar peticiones antes de llegar al bloqueo. Como el servidor cuenta por
 * IP, el cliente los comparte entre las conexiones del mismo servidor; otros procesos (otra sesión de Claude Code o
 * de Codex) llevan su propia cuenta, y por eso se atiende el `Retry-After` de la forja.
 */

/** Peticiones por minuto que permite la forja. */
export const FORJA_LIMIT_PER_MINUTE = 30;

/** Peticiones por hora que permite la forja. */
export const FORJA_LIMIT_PER_HOUR = 300;

/** Intentos con token no válido dentro de la ventana tras los que la forja bloquea la IP. */
export const FORJA_INVALID_TOKEN_LIMIT = 5;

/** Minutos que cuenta cada intento fallido y que dura el bloqueo de la IP. */
export const FORJA_IP_BLOCK_MINUTES = 10;

/** Rechazos por token no válido en la ventana tras los que el cliente deja de enviar peticiones (margen de 2). */
const AUTH_FAILURES_BEFORE_STOP = FORJA_INVALID_TOKEN_LIMIT - 2;

/** Rechazos tolerados tras cambiar el token: permite probar el nuevo dejando aún un intento de margen. */
const AUTH_FAILURES_AFTER_RETRY = FORJA_INVALID_TOKEN_LIMIT - 1;

/** Ventana de un minuto en milisegundos. */
const MINUTE_MS = 60_000;

/** Ventana de una hora en milisegundos. */
const HOUR_MS = 3_600_000;

/** Ventana de los intentos fallidos y duración del bloqueo de la IP, en milisegundos. */
const INCIDENT_WINDOW_MS = FORJA_IP_BLOCK_MINUTES * MINUTE_MS;

/**
 * Error de un límite aplicado por el cliente antes de enviar la petición.
 */
export class ForjaLimitError extends Error {
  /**
   * @param message - Mensaje legible con lo que ocurre y cuándo se puede reintentar
   */
  constructor(message: string) {
    super(message);
    this.name = "ForjaLimitError";
  }
}

/**
 * Reloj inyectable para las pruebas.
 */
export interface ForjaClockOptions {
  /** Reloj en milisegundos. */
  now?: () => number;
}

/**
 * Opciones del limitador; sirven para ajustar los márgenes y para inyectar el reloj en las pruebas.
 */
export interface ForjaRateLimiterOptions extends ForjaClockOptions {
  /** Peticiones por minuto que se permiten (por defecto, 28: dos menos que la forja). */
  perMinute?: number;
  /** Peticiones por hora que se permiten (por defecto, 290: diez menos que la forja). */
  perHour?: number;
  /** Espera máxima en milisegundos; si hace falta más, se rechaza la petición (por defecto, 90 s). */
  maxWaitMs?: number;
  /** Espera en milisegundos. */
  sleep?: (ms: number) => Promise<void>;
}

/**
 * Minutos (redondeados hacia arriba, mínimo 1) que faltan para un instante.
 *
 * @param ms - Milisegundos que faltan
 * @returns Minutos
 */
function minutesLeft(ms: number): number {
  return Math.max(1, Math.ceil(ms / MINUTE_MS));
}

/**
 * Limitador de ventana deslizante: reserva un hueco antes de cada petición, esperando si la ventana del minuto
 * está llena o la forja ha pedido esperar, y rechazando si habría que esperar más de `maxWaitMs`.
 */
export class ForjaRateLimiter {
  /** Espera máxima en milisegundos antes de rechazar una petición. */
  readonly maxWaitMs: number;
  private readonly perMinute: number;
  private readonly perHour: number;
  private readonly now: () => number;
  private readonly sleep: (ms: number) => Promise<void>;
  /** Marcas de tiempo de las peticiones de la última hora, de la más antigua a la más reciente. */
  private stamps: number[] = [];
  /** Instante hasta el que la forja ha pedido no enviar peticiones (Retry-After de un 429). */
  private pausedUntil = 0;

  /**
   * @param options - Márgenes y reloj (opcional)
   */
  constructor(options: ForjaRateLimiterOptions = {}) {
    this.perMinute = options.perMinute ?? FORJA_LIMIT_PER_MINUTE - 2;
    this.perHour = options.perHour ?? FORJA_LIMIT_PER_HOUR - 10;
    this.maxWaitMs = options.maxWaitMs ?? 90_000;
    this.now = options.now ?? (() => Date.now());
    this.sleep = options.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  }

  /**
   * Reserva un hueco para una petición: espera lo necesario para no pasar de los límites.
   *
   * @throws ForjaLimitError si habría que esperar más de la espera máxima (normalmente, por el límite horario)
   */
  async acquire(): Promise<void> {
    for (;;) {
      const now = this.now();
      this.stamps = this.stamps.filter((stamp) => now - stamp < HOUR_MS);

      let wait = 0;
      let reason = "el límite de peticiones por minuto de la forja (30 por minuto y 300 por hora)";
      if (this.stamps.length >= this.perHour) {
        wait = this.stamps[this.stamps.length - this.perHour]! + HOUR_MS - now;
        reason = "el límite de peticiones por hora de la forja (30 por minuto y 300 por hora)";
      }
      const lastMinute = this.stamps.filter((stamp) => now - stamp < MINUTE_MS);
      if (lastMinute.length >= this.perMinute) {
        const minuteWait = lastMinute[lastMinute.length - this.perMinute]! + MINUTE_MS - now;
        if (minuteWait > wait) {
          wait = minuteWait;
          reason = "el límite de peticiones por minuto de la forja (30 por minuto y 300 por hora)";
        }
      }
      if (this.pausedUntil - now > wait) {
        wait = this.pausedUntil - now;
        reason = "la espera que ha pedido la forja tras responder 429 (demasiadas peticiones desde esta IP)";
      }

      if (wait <= 0) {
        this.stamps.push(now);
        return;
      }
      if (wait > this.maxWaitMs) {
        throw new ForjaLimitError(
          `Se ha alcanzado ${reason}; no se envía la petición. Reintenta en unos ${minutesLeft(wait)} minuto(s)`
        );
      }
      await this.sleep(Math.ceil(wait) + 50);
    }
  }

  /**
   * Deja de enviar peticiones durante el tiempo que ha pedido la forja con la cabecera `Retry-After`.
   *
   * @param ms - Milisegundos que hay que esperar
   */
  pause(ms: number): void {
    if (Number.isFinite(ms) && ms > 0) {
      this.pausedUntil = Math.max(this.pausedUntil, this.now() + ms);
    }
  }
}

/**
 * Cuenta los rechazos por token no válido contra un servidor, en la misma ventana de 10 minutos que la forja, y
 * corta las peticiones de los tokens no comprobados antes de que la forja bloquee la IP. Un token que ya ha
 * funcionado sigue pudiendo enviar peticiones: no suma intentos fallidos mientras no lo retiren.
 */
export class ForjaAuthGuard {
  private readonly now: () => number;
  /** Instantes de los 401 recibidos en la ventana, de cualquier token de este servidor. */
  private failures: number[] = [];
  /** Instante hasta el que se considera bloqueada la IP. */
  private blockedUntil = 0;
  /** Tokens (por su identificador) que la forja ha aceptado. */
  private readonly validTokens: Set<string> = new Set();
  /** Si se ha cambiado un token y se permite probarlo aunque se haya llegado al corte. */
  private retryAllowed = false;

  /**
   * @param options - Reloj (opcional; sirve para las pruebas)
   */
  constructor(options: ForjaClockOptions = {}) {
    this.now = options.now ?? (() => Date.now());
  }

  /**
   * Comprueba que se puede enviar otra petición con un token.
   *
   * @param tokenId - Identificador del token que se va a usar
   * @throws ForjaLimitError si la IP está bloqueada o, con un token no comprobado, si hay demasiados rechazos por
   *   token no válido en la ventana
   */
  check(tokenId: string): void {
    const now = this.prune();
    if (this.blockedUntil > now) {
      throw new ForjaLimitError(
        "La forja ha bloqueado esta IP tras varias peticiones con un token no válido y la desbloquea en unos " +
          `${minutesLeft(this.blockedUntil - now)} minuto(s); no se envían peticiones hasta entonces`
      );
    }
    if (this.validTokens.has(tokenId)) {
      return;
    }

    const stop = this.retryAllowed ? AUTH_FAILURES_AFTER_RETRY : AUTH_FAILURES_BEFORE_STOP;
    if (this.failures.length >= stop) {
      // hasta que caduque el fallo que haría bajar la cuenta por debajo del corte
      const wait = this.failures[this.failures.length - stop]! + INCIDENT_WINDOW_MS - now;
      throw new ForjaLimitError(
        `La forja ha rechazado el token ${this.failures.length} veces en los últimos ${FORJA_IP_BLOCK_MINUTES} ` +
          `minutos y no se envían más peticiones: con ${FORJA_INVALID_TOKEN_LIMIT} intentos fallidos en ` +
          `${FORJA_IP_BLOCK_MINUTES} minutos bloquea la IP. Corrige el token con forja_add_connection (overwrite) ` +
          `o reintenta en unos ${minutesLeft(wait)} minuto(s)`
      );
    }
  }

  /**
   * Anota el resultado de una petición. Un 401 suma un intento fallido y, como en la forja, una respuesta
   * correcta no borra los anteriores. Un 403 con intentos fallidos recientes se toma como el bloqueo de la IP.
   * Cualquier otra respuesta confirma que el token es válido.
   *
   * @param status - Estado HTTP de la respuesta, o undefined si no hubo respuesta
   * @param tokenId - Identificador del token usado
   */
  record(status: number | undefined, tokenId: string): void {
    if (status === undefined) {
      return;
    }
    const now = this.prune();
    this.retryAllowed = false;
    if (status === 401) {
      this.failures.push(now);
      this.validTokens.delete(tokenId);
    } else if (status === 403 && this.failures.length > 0 && !this.validTokens.has(tokenId)) {
      this.blockedUntil = now + INCIDENT_WINDOW_MS;
    } else if (status !== 403) {
      this.validTokens.add(tokenId);
    }
  }

  /**
   * Permite probar un token nuevo aunque se haya llegado al corte, siempre que quede margen antes del bloqueo.
   * Los intentos fallidos anteriores se conservan porque la forja los sigue contando para la IP.
   */
  allowRetry(): void {
    this.retryAllowed = true;
  }

  /**
   * Quita los intentos fallidos que ya han salido de la ventana.
   *
   * @returns Instante actual
   */
  private prune(): number {
    const now = this.now();
    this.failures = this.failures.filter((stamp) => now - stamp < INCIDENT_WINDOW_MS);
    return now;
  }
}
