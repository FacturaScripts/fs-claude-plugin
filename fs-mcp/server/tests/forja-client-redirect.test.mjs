/**
 * Pruebas de que el token de autor de la forja (X-Forja-Token) no sale hacia
 * otro host por una redirección ni por una ruta absoluta.
 */

import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const TOKEN = 'token-de-autor';

// Otro host (otro puerto de loopback) que registra lo que le llega
const ajeno = await arrancarFsDePega();

// La forja configurada responde con una redirección hacia él
const forja = http.createServer((req, res) => {
  res.writeHead(301, { Location: `${ajeno.url}/robado` });
  res.end();
});
await new Promise((resolve) => forja.listen(0, '127.0.0.1', resolve));
const forjaUrl = `http://127.0.0.1:${forja.address().port}`;

// Archivo de conexiones aislado antes de importar dist/: el gestor lo lee al cargarse
const borrar = usarConexiones({
  default: 'forja',
  connections: {
    forja: { name: 'Forja', url: forjaUrl, token: TOKEN, type: 'forja' },
  },
});
const { ForjaClient, ForjaApiError } = await import('../dist/fs/forja-client.js');

/**
 * Cliente con una conexión de forja que apunta a la URL indicada.
 *
 * @param {string} url URL base de la conexión.
 * @returns {InstanceType<typeof ForjaClient>} Cliente de forja.
 */
function clienteHacia(url) {
  return new ForjaClient(() => ({ key: url, config: { name: 'Forja', url, token: TOKEN, type: 'forja' } }));
}

test.after(async () => {
  await ajeno.cerrar();
  await new Promise((resolve) => forja.close(() => resolve()));
  borrar();
});

test('una redirección de la forja no lleva el token de autor a otro host', async () => {
  // Sin seguir la redirección la llamada falla; lo que importa es qué le llegó al otro host
  await clienteHacia(forjaUrl).get('/plugins').catch(() => {});
  assert.deepEqual(ajeno.peticiones.map((p) => p.headers['x-forja-token']), []);
});

test('el error de una redirección de la forja dice adónde redirige', async () => {
  await assert.rejects(
    clienteHacia(forjaUrl).get('/plugins'),
    (error) =>
      error instanceof ForjaApiError &&
      error.status === 301 &&
      error.message.includes('HTTP 301') &&
      error.message.includes(`${ajeno.url}/robado`)
  );
});

test('una ruta absoluta no saca el token de autor de la URL de la conexión', async () => {
  const antes = ajeno.peticiones.length;
  await clienteHacia(forjaUrl).get(`${ajeno.url}/robado`).catch(() => {});
  await clienteHacia(forjaUrl).get(`//127.0.0.1:${new URL(ajeno.url).port}/robado`).catch(() => {});
  assert.equal(ajeno.peticiones.length, antes);
});
