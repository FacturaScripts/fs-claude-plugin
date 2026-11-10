import { randomUUID } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import type {
  ConnectionConfig,
  ConnectionsConfig,
} from "./types/facturascripts.js";

interface FsClaudeConfig {
  version?: string;
  connections?: ConnectionsConfig;
  settings?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Tope de enlaces simbólicos encadenados que se siguen, el SYMLOOP_MAX de Linux. */
const MAX_SYMLINK_HOPS = 40;

/** Antigüedad a partir de la cual un temporal del archivo de conexiones se da por abandonado. */
const STALE_TMP_MS = 10 * 60 * 1000;

/** Sufijo de los temporales que crea writeFileAtomic: `<archivo>.<uuid>.tmp`. */
const TMP_SUFFIX = /^\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp$/;

/**
 * Describe un error sin citar el contenido del archivo de conexiones: el
 * mensaje de JSON.parse incluye un fragmento del texto, que puede ser un token.
 */
function describeError(error: unknown): string {
  if (error instanceof SyntaxError) {
    const position = /at position (\d+)/.exec(error.message);
    return position ? `JSON inválido en la posición ${position[1]}` : "JSON inválido";
  }
  return error instanceof Error ? error.message : String(error);
}

/**
 * Gestor centralizado de conexiones multi-instancia a FacturaScripts
 * Lee y persiste configuración desde/hacia archivo JSON
 *
 * Prioridad de ubicación:
 * 1. ~/.fs-claude.json (automático, cross-platform, sin configuración necesaria)
 * 2. FS_CONNECTIONS_FILE env var (compatibilidad con configuraciones existentes)
 */
class ConnectionManager {
  private connectionsPath: string;
  private useFsClaudeFormat: boolean;
  private config: ConnectionsConfig;

  constructor() {
    // Prioridad 1: ~/.fs-claude.json — encontrado automáticamente en cualquier SO
    const fsClaudePath = path.join(os.homedir(), ".fs-claude.json");

    // Prioridad 2: FS_CONNECTIONS_FILE env var (ignorar placeholders sin expandir)
    const rawConnectionsFile = process.env.FS_CONNECTIONS_FILE;
    const resolvedConnectionsFile =
      rawConnectionsFile && !rawConnectionsFile.startsWith("${")
        ? rawConnectionsFile
        : null;

    this.connectionsPath = resolvedConnectionsFile || fsClaudePath;
    this.useFsClaudeFormat = this.connectionsPath === fsClaudePath;

    if (resolvedConnectionsFile) {
      console.error(`[fs-mcp] Usando archivo de conexiones desde FS_CONNECTIONS_FILE: ${resolvedConnectionsFile}`);
    } else {
      console.error(`[fs-mcp] Usando archivo de configuración unificado: ${fsClaudePath}`);
    }

    this.config = this.loadConnections();
  }

  /**
   * Carga las conexiones desde el archivo JSON.
   * Si el archivo no existe, crea uno vacío y continúa sin lanzar error.
   * El servidor arranca siempre; el error se produce al intentar usar una conexión.
   */
  private loadConnections(): ConnectionsConfig {
    const emptyConfig: ConnectionsConfig = { default: "", connections: {} };

    this.removeStaleTemporaries();

    try {
      if (!fs.existsSync(this.connectionsPath) && this.createEmptyConnectionsFile()) {
        console.error(
          `[fs-mcp] Archivo de conexiones no encontrado: ${this.connectionsPath}\n` +
            "[fs-mcp] Usa fs-mcp:add-connection para configurar una conexión."
        );
        return emptyConfig;
      }

      this.restrictPermissions();
      const rawData = fs.readFileSync(this.connectionsPath, "utf-8");
      const parsed = JSON.parse(rawData);

      // Formato ~/.fs-claude.json: las conexiones están en la clave "connections"
      const connectionsData: ConnectionsConfig = this.useFsClaudeFormat
        ? (parsed as FsClaudeConfig).connections ?? emptyConfig
        : (parsed as ConnectionsConfig);

      if (!connectionsData || !connectionsData.connections) {
        return emptyConfig;
      }

      if (Object.keys(connectionsData.connections).length === 0) {
        console.error(
          "[fs-mcp] No hay conexiones configuradas\n" +
            "[fs-mcp] Usa fs-mcp:add-connection para añadir una conexión."
        );
      }

      return connectionsData;
    } catch (error) {
      console.error(`[fs-mcp] Error al cargar conexiones: ${describeError(error)}`);
      return emptyConfig;
    }
  }

  /**
   * Borra los temporales de guardados que no terminaron (el proceso murió entre
   * la escritura y el rename), que contienen los tokens. Sólo los que tienen
   * más de unos minutos, para no llevarse el de un guardado en curso de otro
   * proceso. Si uno no se puede borrar, se avisa y se sigue con los demás; uno
   * que ya no está (lo ha borrado otro proceso) no es un error.
   */
  private removeStaleTemporaries(): void {
    let target: string;
    let names: string[];
    try {
      target = this.realConnectionsPath();
      names = fs.readdirSync(path.dirname(target));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
      console.error(`[fs-mcp] No se pudieron borrar los temporales de ${this.connectionsPath}: ${describeError(error)}`);
      return;
    }

    const base = path.basename(target);
    const limit = Date.now() - STALE_TMP_MS;
    for (const name of names) {
      if (!name.startsWith(base) || !TMP_SUFFIX.test(name.slice(base.length))) continue;
      const tmpPath = path.join(path.dirname(target), name);
      try {
        if (fs.lstatSync(tmpPath).mtimeMs < limit) {
          fs.rmSync(tmpPath, { force: true });
        }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
        console.error(`[fs-mcp] No se pudo borrar el temporal ${tmpPath}: ${describeError(error)}`);
      }
    }
  }

  /**
   * Deja en 0600 un archivo de conexiones que otras cuentas pueden leer: uno
   * creado antes de que se crearan así seguiría legible hasta el primer guardado.
   * Si no se puede (el archivo es de otra cuenta), se avisa y se sigue cargando.
   */
  private restrictPermissions(): void {
    try {
      if (fs.statSync(this.connectionsPath).mode & 0o077) {
        fs.chmodSync(this.connectionsPath, 0o600);
      }
    } catch (error) {
      console.error(
        `[fs-mcp] No se pudo dejar en 0600 ${this.connectionsPath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Crea el archivo de conexiones vacío con la estructura adecuada al formato.
   * Contiene los tokens de la API, así que se crea legible sólo por su dueño (0600).
   *
   * Se crea en exclusiva ("wx"): si otro proceso lo ha creado entre la
   * comprobación y la escritura (la skill add-connection mientras arranca el
   * servidor), no se trunca y devuelve false para que se lea el suyo.
   */
  private createEmptyConnectionsFile(): boolean {
    const dir = path.dirname(this.connectionsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    }

    const crear = (contenido: string): boolean => {
      try {
        fs.writeFileSync(this.connectionsPath, contenido, { encoding: "utf-8", mode: 0o600, flag: "wx" });
        return true;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "EEXIST") return false;
        throw error;
      }
    };

    if (this.useFsClaudeFormat) {
      // Crear ~/.fs-claude.json con estructura completa
      const fsClaudeConfig: FsClaudeConfig = {
        version: "1.0",
        connections: { default: "", connections: {} },
        settings: { sortClassMembers: true, updateCopyright: true },
      };
      return crear(JSON.stringify(fsClaudeConfig, null, 2));
    } else {
      // Formato plano legacy
      const emptyConfig: ConnectionsConfig = { default: "", connections: {} };
      return crear(JSON.stringify(emptyConfig, null, 2));
    }
  }

  /**
   * Aplica un cambio sobre las conexiones recién leídas del archivo, lo guarda
   * y devuelve la configuración resultante.
   *
   * El cambio se aplica sobre lo que hay en el archivo y no sobre la copia en
   * memoria, que puede estar vacía (el archivo estaba roto al arrancar y se ha
   * corregido después) o desfasada (otra sesión o la skill add-connection lo ha
   * modificado). Guardar la copia en memoria borraría esas conexiones.
   *
   * Si el archivo existe pero no es un objeto JSON válido, no se escribe:
   * sobrescribirlo borraría las conexiones (y los ajustes) que contiene y que no
   * se pudieron interpretar. Un archivo vacío no tiene nada que perder y se
   * rehace como si no existiera.
   */
  private saveConnections(change: (current: ConnectionsConfig) => ConnectionsConfig): ConnectionsConfig {
    const dir = path.dirname(this.connectionsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    }

    let existingConfig: unknown = undefined;
    // Se lee de la misma ruta en la que se va a escribir
    const target = this.realConnectionsPath();
    const rawData = fs.existsSync(target) ? fs.readFileSync(target, "utf-8") : "";
    if (rawData.trim() !== "") {
      try {
        existingConfig = JSON.parse(rawData);
      } catch (error) {
        throw new Error(
          `No se guarda la conexión: ${this.connectionsPath} no es un JSON válido y se perdería su contenido. ` +
            `Corrígelo a mano y vuelve a intentarlo (${describeError(error)})`
        );
      }

      if (existingConfig === null || typeof existingConfig !== "object" || Array.isArray(existingConfig)) {
        throw new Error(
          `No se guarda la conexión: ${this.connectionsPath} no es un objeto JSON y se perdería su contenido. ` +
            "Corrígelo a mano y vuelve a intentarlo"
        );
      }
    }

    if (this.useFsClaudeFormat) {
      // Conservar "settings" y otras claves del archivo completo
      const fsClaudeConfig: FsClaudeConfig =
        existingConfig !== undefined
          ? (existingConfig as FsClaudeConfig)
          : {
              version: "1.0",
              connections: { default: "", connections: {} },
              settings: { sortClassMembers: true, updateCopyright: true },
            };
      const next = change(this.withDefaults(fsClaudeConfig.connections));
      fsClaudeConfig.connections = next;
      this.writeFileAtomic(target, JSON.stringify(fsClaudeConfig, null, 2));
      return next;
    }

    const next = change(this.withDefaults(existingConfig as ConnectionsConfig | undefined));
    this.writeFileAtomic(target, JSON.stringify(next, null, 2));
    return next;
  }

  /** Completa con valores vacíos lo que falte de una configuración leída del archivo. */
  private withDefaults(config: Partial<ConnectionsConfig> | undefined): ConnectionsConfig {
    return { ...config, default: config?.default ?? "", connections: config?.connections ?? {} };
  }

  /**
   * Escribe el archivo de conexiones a través de un temporal en el mismo
   * directorio y un rename, para que una escritura interrumpida no lo deje a medias.
   * El rename sustituye el archivo por el temporal, con sus permisos: se crea
   * 0600 porque contiene los tokens de la API. El nombre es aleatorio y se abre
   * en exclusiva ("wx") para no escribir a través de un enlace ya plantado ahí.
   *
   * Si el archivo es un enlace simbólico (gestionado desde un repositorio de
   * dotfiles, por ejemplo), se escribe en su destino: el rename sustituiría el
   * enlace por un archivo normal y el destino no recibiría el cambio.
   *
   * El temporal se lleva a disco (fsync) antes del rename: sin eso, un corte de
   * luz puede dejar el archivo renombrado con 0 bytes, y uno vacío se rehace.
   */
  private writeFileAtomic(target: string, content: string): void {
    const tmpPath = `${target}.${randomUUID()}.tmp`;
    try {
      const fd = fs.openSync(tmpPath, "wx", 0o600);
      try {
        fs.writeFileSync(fd, content, "utf-8");
        fs.fsyncSync(fd);
      } finally {
        fs.closeSync(fd);
      }
      fs.renameSync(tmpPath, target);
    } catch (error) {
      fs.rmSync(tmpPath, { force: true });
      throw error;
    }
  }

  /**
   * Ruta del archivo de conexiones con los enlaces simbólicos resueltos; la
   * misma si aún no existe. Un enlace roto se sigue hasta su destino, como hacen
   * las skills (Path.resolve()): el guardado crea allí el archivo en vez de
   * sustituir el enlace, y si falta el directorio del destino, falla.
   */
  private realConnectionsPath(): string {
    let current = this.connectionsPath;
    for (let hops = 0; hops <= MAX_SYMLINK_HOPS; hops++) {
      try {
        return fs.realpathSync.native(current);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }

      let target: string;
      try {
        target = fs.readlinkSync(current);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return current;
        throw error;
      }
      // El destino relativo se une al directorio real del enlace sin normalizar
      // sus "..": los resuelve el sistema sobre los directorios reales, como al
      // seguir el enlace. path.resolve los quitaría sobre el texto, y daría otra
      // ruta (o la del propio enlace, sin terminar nunca). Por lo mismo se usa
      // realpathSync.native: la versión en JavaScript también los quita antes.
      current = path.isAbsolute(target)
        ? target
        : `${fs.realpathSync.native(path.dirname(current))}${path.sep}${target}`;
    }
    throw Object.assign(new Error(`Demasiados enlaces simbólicos encadenados en ${this.connectionsPath}`), {
      code: "ELOOP",
    });
  }

  /**
   * Obtiene una conexión por clave o la conexión por defecto
   * @param key - Clave de la conexión (opcional, usa default si no se proporciona)
   * @returns Configuración de la conexión
   * @throws Error si la conexión no existe
   */
  getConnection(key?: string): ConnectionConfig {
    const connectionKey = key || this.config.default;

    if (!connectionKey) {
      throw new Error(
        "No hay conexión por defecto configurada y no se proporcionó ninguna clave"
      );
    }

    const connection = Object.hasOwn(this.config.connections, connectionKey)
      ? this.config.connections[connectionKey]
      : undefined;
    if (!connection) {
      throw new Error(
        `Conexión no encontrada: "${connectionKey}". Conexiones disponibles: ${Object.keys(this.config.connections).join(", ")}`
      );
    }

    return connection;
  }

  /**
   * Lista todas las conexiones disponibles
   * @returns Array de objetos con información resumida de cada conexión
   */
  listConnections(): Array<{
    key: string;
    name: string;
    url: string;
    isDefault: boolean;
  }> {
    return Object.entries(this.config.connections).map(([key, config]) => ({
      key,
      name: config.name,
      url: config.url,
      isDefault: key === this.config.default,
    }));
  }

  /**
   * Añade o actualiza una conexión
   * @param key - Identificador único de la conexión
   * @param config - Configuración de la conexión
   */
  addConnection(key: string, config: ConnectionConfig): void {
    if (!key || key.trim() === "") {
      throw new Error("La clave de conexión no puede estar vacía");
    }

    // "__proto__" se guardaría en el archivo como una clave más, y quien lo lea
    // y copie las conexiones asignando clave a clave (Object.assign, obj[k] = v)
    // cambiaría el prototipo del objeto en vez de añadir una conexión
    if (key === "__proto__") {
      throw new Error('La clave de conexión no puede ser "__proto__"');
    }

    if (!config.name || !config.url || !config.token) {
      throw new Error(
        "La configuración debe incluir: name, url y token"
      );
    }

    // Se guarda antes de aplicarlo: si no se puede guardar, la sesión sigue
    // con la configuración anterior en vez de usar una que no consta en el archivo
    this.config = this.saveConnections((current) => {
      const next: ConnectionsConfig = {
        ...current,
        connections: { ...current.connections, [key]: config },
      };

      // Si es la primera conexión, establécela como predeterminada
      if (!next.default || next.default === "") {
        next.default = key;
      }

      return next;
    });
  }

  /**
   * Establece la conexión por defecto
   * @param key - Clave de la conexión a establecer como predeterminada
   * @throws Error si la conexión no existe
   */
  setDefault(key: string): void {
    this.config = this.saveConnections((current) => {
      if (!Object.hasOwn(current.connections, key)) {
        throw new Error(
          `No se puede establecer como predeterminada: conexión "${key}" no existe`
        );
      }

      return { ...current, default: key };
    });
  }
}

/**
 * Instancia singleton del gestor de conexiones
 */
export const connectionManager = new ConnectionManager();

export default connectionManager;
