/**
 * El cliente no lanza más de 4 peticiones simultáneas contra una misma conexión:
 * las demás esperan su turno y todas terminan.
 */

import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { usarConexiones } from './fake-fs.mjs';

let activas = 0;
let maximo = 0;
const server = http.createServer((req, res) => {
  activas += 1;
  maximo = Math.max(maximo, activas);
  setTimeout(() => {
    activas -= 1;
    res.setHeader('Content-Type', 'application/json');
    res.end('[]');
  }, 30);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}`;
const borrar = usarConexiones({
  default: 'a',
  connections: { a: { name: 'A', url, token: 't' }, b: { name: 'B', url, token: 't' } },
});
const { fsClient } = await import('../build/fs/client.js');

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  borrar();
});

test('limita a 4 las peticiones simultáneas de una conexión y las completa todas', async () => {
  maximo = 0;
  const resultados = await Promise.all(Array.from({ length: 12 }, () => fsClient.get('/clientes', {}, 'a')));
  assert.equal(resultados.length, 12);
  assert.equal(maximo, 4);
});

test('el límite es por conexión', async () => {
  maximo = 0;
  await Promise.all([
    ...Array.from({ length: 6 }, () => fsClient.get('/clientes', {}, 'a')),
    ...Array.from({ length: 6 }, () => fsClient.get('/clientes', {}, 'b')),
  ]);
  assert.equal(maximo, 8);
});

test('una petición que falla libera su turno', async () => {
  const fallos = await Promise.allSettled(Array.from({ length: 6 }, () => fsClient.get('/x', {}, 'inexistente')));
  assert.ok(fallos.every((r) => r.status === 'rejected'));
  const ok = await Promise.all(Array.from({ length: 5 }, () => fsClient.get('/clientes', {}, 'a')));
  assert.equal(ok.length, 5);
});
