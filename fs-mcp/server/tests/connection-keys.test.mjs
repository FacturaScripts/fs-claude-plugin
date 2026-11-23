/**
 * Pruebas de las claves de conexión que llegan del modelo por add_connection.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-keys-'));
process.env.FS_CONNECTIONS_FILE = path.join(dir, 'connections.json');
const { connectionManager } = await import('../dist/connection-manager.js');

test.after(() => fs.rmSync(dir, { recursive: true, force: true }));

test('add_connection rechaza la clave __proto__ y no cambia el mapa de conexiones', () => {
  connectionManager.addConnection('a', { name: 'A', url: 'http://127.0.0.1:1', token: 'tok-a' });
  const mal = { name: 'Mal', url: 'http://127.0.0.1:2', token: 'tok-malo' };

  assert.throws(() => connectionManager.addConnection('__proto__', mal), /__proto__/);
  assert.throws(() => connectionManager.getConnection('token'), /no encontrada/);
  assert.deepEqual(connectionManager.listConnections().map((c) => c.key), ['a']);
});

test('una clave heredada de Object.prototype no es una conexión', () => {
  assert.throws(() => connectionManager.setDefault('toString'), /no existe/);
  assert.throws(() => connectionManager.getConnection('constructor'), /no encontrada/);
});

test('una conexión que se llama como una propiedad heredada sí es una conexión', () => {
  connectionManager.addConnection('toString', { name: 'T', url: 'http://127.0.0.1:3', token: 'tok-t' });

  connectionManager.setDefault('toString');

  assert.equal(connectionManager.getConnection().name, 'T');
  assert.equal(connectionManager.getConnection('toString').name, 'T');
  assert.equal(JSON.parse(fs.readFileSync(process.env.FS_CONNECTIONS_FILE, 'utf-8')).default, 'toString');
});
