/**
 * Pruebas del mensaje de error que extrae el cliente HTTP de las respuestas de la API.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, respuesta, usarConexiones } from './fake-fs.mjs';

const fs = await arrancarFsDePega((req) => {
  if (req.url.startsWith('/api/3/modelo')) {
    return respuesta(400, { error: 'Ha ocurrido un error - La hora de inicio no puede ser posterior a la de fin', data: {} });
  }
  return respuesta(404, { status: 'error', message: 'Registro no encontrado' });
});
const borrar = usarConexiones({ default: 'pega', connections: { pega: { name: 'Pega', url: fs.url, token: 't' } } });
const { fsClient, apiErrorMessage } = await import('../build/fs/client.js');

test.after(async () => {
  await fs.cerrar();
  borrar();
});

test('apiErrorMessage usa message y, si no hay, el error de la API genérica', () => {
  assert.equal(apiErrorMessage({ message: 'uno', error: 'dos' }), 'uno');
  assert.equal(apiErrorMessage({ error: 'dos' }), 'dos');
  assert.equal(apiErrorMessage({ message: '', error: 'dos' }), 'dos');
  assert.equal(apiErrorMessage({ error: { anidado: true } }), undefined);
  assert.equal(apiErrorMessage('texto'), undefined);
  assert.equal(apiErrorMessage(null), undefined);
});

test('el error de guardado de un modelo llega al mensaje de la excepción', async () => {
  await assert.rejects(fsClient.put('/modelo/1', { campo: 'x' }, 'pega'), /HTTP 400\): Ha ocurrido un error - La hora de inicio/);
  await assert.rejects(fsClient.get('/otro/1', undefined, 'pega'), /HTTP 404\): Registro no encontrado/);
});
