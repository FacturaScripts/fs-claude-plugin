/**
 * Pruebas de la caché de instancias HTTP del cliente de FacturaScripts.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const fsA = await arrancarFsDePega();
const fsB = await arrancarFsDePega();
const borrar = usarConexiones({
  default: 'a',
  connections: {
    a: { name: 'A', url: fsA.url, token: 'token-a' },
    b: { name: 'B', url: fsB.url, token: 'token-b' },
  },
});
const { connectionManager } = await import('../dist/connection-manager.js');
const { fsClient } = await import('../dist/fs/client.js');

test.after(async () => {
  await fsA.cerrar();
  await fsB.cerrar();
  borrar();
});

test('cambiar la conexión por defecto surte efecto sin reiniciar', async () => {
  await fsClient.get('/clientes');
  assert.equal(fsA.peticiones.length, 1);

  connectionManager.setDefault('b');
  await fsClient.get('/clientes');

  assert.equal(fsA.peticiones.length, 1);
  assert.equal(fsB.peticiones.length, 1);
});

test('cambiar el token de una conexión surte efecto sin reiniciar', async () => {
  await fsClient.get('/clientes', {}, 'b');
  connectionManager.addConnection('b', { name: 'B', url: fsB.url, token: 'token-b-nuevo' }, true);
  await fsClient.get('/clientes', {}, 'b');

  assert.equal(fsB.peticiones.at(-2).headers.token, 'token-b');
  assert.equal(fsB.peticiones.at(-1).headers.token, 'token-b-nuevo');
});
