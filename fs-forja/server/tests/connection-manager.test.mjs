/**
 * Tests del gestor de conexiones de fs-forja sobre el archivo compartido con fs-mcp: solo usa las conexiones de
 * tipo forja, nunca sustituye una conexión de fs-mcp ni cambia su conexión por defecto, conserva el resto del
 * archivo y normaliza la URL base.
 *
 * Usa un archivo temporal con el formato de ~/.fs-ai.json (HOME apunta a una carpeta temporal) para no tocar
 * el del usuario.
 */

import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const buildDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'build');
const homeOriginal = process.env.HOME;

let tempDirectory;
let configFile;
let managerModule;

before(async () => {
  tempDirectory = await mkdtemp(path.join(os.tmpdir(), 'fs-forja-connections-'));
  configFile = path.join(tempDirectory, '.fs-ai.json');
  await writeFile(configFile, JSON.stringify({
    version: '1.0',
    connections: {
      default: 'erp',
      connections: {
        erp: { name: 'ERP', url: 'https://erp.example.com', token: 'token-api' },
        forja: { name: 'API de facturascripts.com', url: 'https://facturascripts.com', token: 'token-api-fs' },
      },
    },
    settings: { sortClassMembers: true, localModulesPath: '/ruta/privada' },
  }), { mode: 0o600 });
  process.env.HOME = tempDirectory;
  delete process.env.FS_CONNECTIONS_FILE;

  managerModule = await import(pathToFileURL(path.join(buildDirectory, 'connection-manager.js')).href);
});

after(async () => {
  process.env.HOME = homeOriginal;
  await rm(tempDirectory, { recursive: true, force: true });
});

test('normalizeBaseUrl quita las barras finales y la ruta de la API', () => {
  const { normalizeBaseUrl } = managerModule;
  assert.equal(normalizeBaseUrl('https://forja.host/'), 'https://forja.host');
  assert.equal(normalizeBaseUrl('https://forja.host/api/3/forja'), 'https://forja.host');
  assert.equal(normalizeBaseUrl('https://forja.host/api/3/forja/'), 'https://forja.host');
});

test('sin conexiones de tipo forja no lista ninguna ni devuelve las de fs-mcp', () => {
  const { connectionManager } = managerModule;
  assert.deepEqual(connectionManager.listConnections(), []);
  assert.equal(connectionManager.findFirstKey(), undefined);
  assert.throws(() => connectionManager.getConnection('erp'), /tipo api y pertenece a fs-mcp/);
  assert.throws(() => connectionManager.getConnection('nada'), /no encontrada/);
});

test('nunca sustituye una conexión de fs-mcp, ni con overwrite', () => {
  const { connectionManager } = managerModule;
  for (const overwrite of [false, true]) {
    assert.throws(
      () => connectionManager.addConnection('forja', { name: 'Forja autor', url: 'https://forja.host', token: 't' }, overwrite),
      /conexión de fs-mcp con la clave "forja"/
    );
  }
});

test('añade la conexión de tipo forja sin cambiar la conexión por defecto ni el resto del archivo', async () => {
  const { connectionManager } = managerModule;
  connectionManager.addConnection('forja-autor', {
    name: 'Forja autor',
    url: 'https://forja.host/api/3/forja/',
    token: 'token-autor',
    // Un tipo que llegue de fuera no se respeta: siempre se guarda como forja
    type: 'api',
  });

  assert.deepEqual(connectionManager.listConnections(), [
    { key: 'forja-autor', name: 'Forja autor', url: 'https://forja.host' },
  ]);
  assert.equal(connectionManager.findFirstKey(), 'forja-autor');

  const saved = JSON.parse(await readFile(configFile, 'utf8'));
  assert.equal(saved.connections.default, 'erp');
  assert.deepEqual(saved.connections.connections['forja-autor'], {
    name: 'Forja autor',
    url: 'https://forja.host',
    token: 'token-autor',
    type: 'forja',
  });
  assert.equal(saved.connections.connections.erp.token, 'token-api');
  assert.equal(saved.connections.connections.forja.token, 'token-api-fs');
  assert.deepEqual(saved.settings, { sortClassMembers: true, localModulesPath: '/ruta/privada' });
  assert.equal((await stat(configFile)).mode & 0o777, 0o600);
});

test('una conexión de tipo forja existente solo se sustituye con overwrite', async () => {
  const { connectionManager } = managerModule;
  assert.throws(
    () => connectionManager.addConnection('forja-autor', { name: 'Otra', url: 'https://otra.host', token: 'x' }),
    /overwrite: true/
  );
  assert.equal(connectionManager.getConnection('forja-autor').token, 'token-autor');

  connectionManager.addConnection('forja-autor', { name: 'Forja autor', url: 'https://forja.host', token: 'token-nuevo' }, true);
  assert.equal(connectionManager.getConnection('forja-autor').token, 'token-nuevo');
  const saved = JSON.parse(await readFile(configFile, 'utf8'));
  assert.equal(saved.connections.connections['forja-autor'].token, 'token-nuevo');
  assert.equal(saved.connections.default, 'erp');
});

test('rechaza claves vacías, __proto__ y datos incompletos', () => {
  const { connectionManager } = managerModule;
  assert.throws(() => connectionManager.addConnection(' ', { name: 'a', url: 'https://a', token: 't' }), /vacía/);
  assert.throws(() => connectionManager.addConnection('__proto__', { name: 'a', url: 'https://a', token: 't' }), /__proto__/);
  assert.throws(() => connectionManager.addConnection('k', { name: 'a', url: '', token: 't' }), /name, url y token/);
});
