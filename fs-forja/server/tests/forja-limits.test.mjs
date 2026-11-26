/**
 * Pruebas de los límites de la forja que respeta el cliente: 30 peticiones por minuto, 300 por hora, la pausa del
 * Retry-After y el corte por rechazos por token no válido en la ventana de 10 minutos.
 */

import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const buildDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'build');
const limits = await import(pathToFileURL(path.join(buildDirectory, 'fs', 'forja-limits.js')).href);

/**
 * Crea un reloj falso cuya espera avanza el tiempo sin esperar de verdad.
 *
 * @returns {{now: () => number, sleep: (ms: number) => Promise<void>, waited: number[]}} Reloj y esperas hechas.
 */
function fakeClock() {
  let time = 1_000_000;
  const waited = [];
  return {
    now: () => time,
    sleep: async (ms) => {
      waited.push(ms);
      time += ms;
    },
    waited,
  };
}

test('el limitador no espera mientras no llena el minuto', async () => {
  const clock = fakeClock();
  const limiter = new limits.ForjaRateLimiter({ ...clock, perMinute: 5 });
  for (let i = 0; i < 5; i++) {
    await limiter.acquire();
  }
  assert.deepEqual(clock.waited, []);
});

test('el limitador espera a que salga la petición más antigua del minuto', async () => {
  const clock = fakeClock();
  const limiter = new limits.ForjaRateLimiter({ ...clock, perMinute: 5 });
  for (let i = 0; i < 5; i++) {
    await limiter.acquire();
  }
  await limiter.acquire();
  assert.equal(clock.waited.length, 1);
  assert.ok(clock.waited[0] >= 60_000 && clock.waited[0] < 61_000, `espera de ${clock.waited[0]} ms`);
});

test('el limitador rechaza si el límite horario obliga a esperar demasiado', async () => {
  const clock = fakeClock();
  const limiter = new limits.ForjaRateLimiter({ ...clock, perMinute: 1000, perHour: 10 });
  for (let i = 0; i < 10; i++) {
    await limiter.acquire();
  }
  await assert.rejects(() => limiter.acquire(), (error) => {
    assert.ok(error instanceof limits.ForjaLimitError);
    assert.match(error.message, /por hora/);
    return true;
  });
});

test('por defecto deja un margen bajo los límites reales de la forja', async () => {
  const clock = fakeClock();
  const limiter = new limits.ForjaRateLimiter(clock);
  for (let i = 0; i < limits.FORJA_LIMIT_PER_MINUTE - 2; i++) {
    await limiter.acquire();
  }
  assert.deepEqual(clock.waited, []);
  await limiter.acquire();
  assert.equal(clock.waited.length, 1);
});

test('el limitador se pausa el tiempo que pide la forja con Retry-After', async () => {
  const clock = fakeClock();
  const limiter = new limits.ForjaRateLimiter(clock);
  limiter.pause(30_000);
  await limiter.acquire();
  assert.equal(clock.waited.length, 1);
  assert.ok(clock.waited[0] >= 30_000 && clock.waited[0] < 31_000, `espera de ${clock.waited[0]} ms`);

  limiter.pause(10 * 60_000);
  await assert.rejects(() => limiter.acquire(), /espera que ha pedido la forja/);
});

test('el guardián cuenta los 401 de 10 minutos aunque haya respuestas correctas entre medias', () => {
  const clock = fakeClock();
  const guard = new limits.ForjaAuthGuard(clock);
  // dos conexiones del mismo servidor: «buena» funciona y «mala» tiene el token mal
  guard.record(401, 'mala');
  guard.record(200, 'buena');
  guard.record(401, 'mala');
  guard.record(200, 'buena');
  guard.check('mala');
  guard.record(401, 'mala');
  assert.throws(() => guard.check('mala'), (error) => {
    assert.ok(error instanceof limits.ForjaLimitError);
    assert.match(error.message, /3 veces en los últimos 10 minutos/);
    assert.match(error.message, /reintenta en unos 10 minuto/);
    return true;
  });
  // un token ya aceptado sigue funcionando: no puede sumar intentos fallidos
  guard.check('buena');
  // y otro token sin comprobar tampoco se prueba
  assert.throws(() => guard.check('nueva'), limits.ForjaLimitError);
});

test('los 401 caducan a los 10 minutos, como en la forja', () => {
  const clock = fakeClock();
  const guard = new limits.ForjaAuthGuard(clock);
  for (let i = 0; i < 3; i++) {
    guard.record(401, 'mala');
  }
  assert.throws(() => guard.check('mala'), limits.ForjaLimitError);
  clock.sleep(10 * 60_000);
  guard.check('mala');
});

test('tras cambiar el token se permite un intento más, nunca el quinto', () => {
  const guard = new limits.ForjaAuthGuard(fakeClock());
  for (let i = 0; i < 3; i++) {
    guard.record(401, 'mala');
  }
  guard.allowRetry();
  guard.check('nueva');
  guard.record(401, 'nueva');
  assert.throws(() => guard.check('otra'), limits.ForjaLimitError);
  guard.allowRetry();
  assert.throws(() => guard.check('otra'), limits.ForjaLimitError);
});

test('un 403 tras rechazos por token se toma como bloqueo de la IP durante 10 minutos', () => {
  const clock = fakeClock();
  const guard = new limits.ForjaAuthGuard(clock);
  guard.record(200, 'buena');
  guard.record(401, 'mala');
  guard.record(403, 'mala');
  assert.throws(() => guard.check('buena'), /ha bloqueado esta IP/);
  clock.sleep(10 * 60_000);
  guard.check('buena');
});

test('un 403 sin rechazos por token (acceso no concedido) no bloquea', () => {
  const guard = new limits.ForjaAuthGuard(fakeClock());
  guard.record(403, 'sin-acceso');
  guard.check('sin-acceso');
});

test('un error de red no cuenta como token no válido', () => {
  const guard = new limits.ForjaAuthGuard(fakeClock());
  guard.record(401, 'mala');
  guard.record(undefined, 'mala');
  guard.record(401, 'mala');
  guard.check('mala');
  guard.record(401, 'mala');
  assert.throws(() => guard.check('mala'), limits.ForjaLimitError);
});
