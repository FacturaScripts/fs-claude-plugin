/**
 * Pruebas de que el token de la API no sale hacia otro host por una redirección.
 */

import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

// Otro host (otro puerto de loopback) que registra lo que le llega
const ajeno = await arrancarFsDePega();

// La instalación configurada responde con una redirección hacia él
const instalacion = http.createServer((req, res) => {
  res.writeHead(302, { Location: `${ajeno.url}/robado` });
  res.end();
});
await new Promise((resolve) => instalacion.listen(0, '127.0.0.1', resolve));

const borrar = usarConexiones({
  default: 'pega',
  connections: {
    pega: { name: 'Pega', url: `http://127.0.0.1:${instalacion.address().port}`, token: 'token-secreto' },
  },
});
const { fsClient } = await import('../dist/fs/client.js');

test.after(async () => {
  await ajeno.cerrar();
  await new Promise((resolve) => instalacion.close(() => resolve()));
  borrar();
});

test('una redirección no lleva el token a otro host', async () => {
  // Sin seguir la redirección la llamada falla; lo que importa es qué le llegó al otro host
  await fsClient.get('/clientes').catch(() => {});
  assert.deepEqual(ajeno.peticiones.map((p) => p.headers.token), []);
});

test('el error de una redirección dice adónde redirige la API', async () => {
  await assert.rejects(
    fsClient.get('/clientes'),
    (error) => error.message.includes('HTTP 302') && error.message.includes(`${ajeno.url}/robado`)
  );
});
