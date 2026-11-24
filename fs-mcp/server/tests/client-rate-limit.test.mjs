/**
 * El cliente reintenta los GET que la API rechaza con HTTP 429 (límite de
 * peticiones por minuto) y se rinde tras agotar las esperas configuradas.
 * Las demás peticiones y errores no se reintentan, ni un 429 que anuncia un
 * bloqueo de varios minutos.
 */

// esperas cortas para que la prueba no tarde: deben fijarse antes de importar build/
process.env.FS_RETRY_429_DELAYS = '5,5';

import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { usarConexiones } from './fake-fs.mjs';

/** Respuestas pendientes por ruta: códigos HTTP que se devuelven en orden y después 200. */
let guion = {};
let llamadas = {};

const server = http.createServer((req, res) => {
  const ruta = new URL(req.url, 'http://x').pathname.replace(/^\/api\/3/, '');
  llamadas[`${req.method} ${ruta}`] = (llamadas[`${req.method} ${ruta}`] ?? 0) + 1;
  const status = guion[ruta]?.shift() ?? 200;
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  const message = ruta === '/bloqueado' ? 'Por motivos de seguridad se ha bloqueado durante 10 minutos' : `estado ${status}`;
  res.end(JSON.stringify(status === 200 ? [{ ok: true }] : { message }));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}`;
const borrar = usarConexiones({ default: 'a', connections: { a: { name: 'A', url, token: 't' } } });
const { fsClient } = await import('../build/fs/client.js');

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  borrar();
});

test.beforeEach(() => {
  guion = {};
  llamadas = {};
});

test('un GET con HTTP 429 se reintenta hasta que la API responde', async () => {
  guion['/clientes'] = [429, 429];
  const datos = await fsClient.get('/clientes', {}, 'a');
  assert.deepEqual(datos, [{ ok: true }]);
  assert.equal(llamadas['GET /clientes'], 3);
});

test('tras agotar los reintentos devuelve el error de límite de peticiones', async () => {
  guion['/clientes'] = [429, 429, 429];
  await assert.rejects(fsClient.get('/clientes', {}, 'a'), /HTTP 429/);
  assert.equal(llamadas['GET /clientes'], 3);
});

test('otros errores no se reintentan', async () => {
  guion['/clientes'] = [500];
  await assert.rejects(fsClient.get('/clientes', {}, 'a'), /HTTP 500/);
  assert.equal(llamadas['GET /clientes'], 1);
});

test('las escrituras no se reintentan aunque la API responda 429', async () => {
  guion['/clientes'] = [429];
  await assert.rejects(fsClient.post('/clientes', { nombre: 'x' }, 'a'), /HTTP 429/);
  assert.equal(llamadas['POST /clientes'], 1);
});

test('si la API ha bloqueado la IP durante minutos no se reintenta', async () => {
  guion['/bloqueado'] = [429, 429, 429];
  await assert.rejects(fsClient.get('/bloqueado', {}, 'a'), /bloqueado durante 10 minutos/);
  assert.equal(llamadas['GET /bloqueado'], 1);
});
