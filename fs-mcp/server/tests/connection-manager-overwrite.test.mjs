/**
 * Tests del gestor de conexiones: no sustituir una conexión existente sin pedirlo (tampoco una que solo está en el
 * archivo) y normalizar la URL base.
 *
 * Usa un archivo de conexiones temporal (FS_CONNECTIONS_FILE) para no tocar el ~/.fs-claude.json del usuario.
 */

import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const distDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

let tempDirectory;
let connectionsFile;
let managerModule;

before(async () => {
  tempDirectory = await mkdtemp(path.join(os.tmpdir(), 'fs-mcp-connections-'));
  connectionsFile = path.join(tempDirectory, 'connections.json');
  await writeFile(connectionsFile, JSON.stringify({
    default: 'forja',
    connections: {
      forja: { name: 'API de facturascripts.com', url: 'https://facturascripts.com', token: 'token-api' },
    },
  }));
  process.env.FS_CONNECTIONS_FILE = connectionsFile;

  managerModule = await import(pathToFileURL(path.join(distDirectory, 'connection-manager.js')).href);
});

after(async () => {
  await rm(tempDirectory, { recursive: true, force: true });
});

test('normalizeBaseUrl quita las barras finales y la ruta de la API', () => {
  const { normalizeBaseUrl } = managerModule;
  assert.equal(normalizeBaseUrl('https://forja.host/'), 'https://forja.host');
  assert.equal(normalizeBaseUrl('https://forja.host/api/3/forja'), 'https://forja.host');
  assert.equal(normalizeBaseUrl('https://forja.host/api/3/forja/'), 'https://forja.host');
  assert.equal(normalizeBaseUrl('https://erp.example.com/instancia/api/3'), 'https://erp.example.com/instancia');
  assert.equal(normalizeBaseUrl(' https://erp.example.com/API/3/ '), 'https://erp.example.com');
  // otras rutas que contienen "api" se respetan
  assert.equal(normalizeBaseUrl('https://example.com/api'), 'https://example.com/api');
  assert.equal(normalizeBaseUrl('https://example.com/api/3/otra'), 'https://example.com/api/3/otra');
});

test('no sustituye una conexión existente salvo con overwrite', async () => {
  const { connectionManager } = managerModule;

  // misma clave que la conexión api existente: falla y la conexión anterior queda intacta
  assert.throws(
    () => connectionManager.addConnection('forja', {
      name: 'Otra API',
      url: 'https://otra.host/api/3',
      token: 'token-otro',
    }),
    /Ya existe una conexión con la clave "forja".*overwrite: true/
  );
  assert.equal(connectionManager.getConnection('forja').token, 'token-api');
  assert.equal(connectionManager.getConnection('forja').type, undefined);

  // con otra clave se añade, con la URL normalizada
  connectionManager.addConnection('erp', {
    name: 'ERP',
    url: 'https://erp.example.com/api/3/',
    token: 'token-erp',
  });
  assert.equal(connectionManager.getConnection('erp').url, 'https://erp.example.com');

  // con overwrite se sustituye
  connectionManager.addConnection('forja', {
    name: 'API de facturascripts.com',
    url: 'https://facturascripts.com/',
    token: 'token-nuevo',
  }, true);
  assert.equal(connectionManager.getConnection('forja').token, 'token-nuevo');

  const saved = JSON.parse(await readFile(connectionsFile, 'utf-8'));
  assert.equal(saved.connections.erp.url, 'https://erp.example.com');
  assert.equal(saved.connections.forja.url, 'https://facturascripts.com');
  assert.equal(saved.default, 'forja');
});

test('las conexiones de tipo forja son de fs-forja: no las añade, no las sustituye ni las hace predeterminadas', async () => {
  const { connectionManager } = managerModule;

  assert.throws(
    () => connectionManager.addConnection('forja-nueva', {
      name: 'Forja autor',
      url: 'https://forja.host',
      token: 'token-autor',
      type: 'forja',
    }),
    /plugin fs-forja/
  );

  // fs-forja ha guardado una conexión de tipo forja en el archivo compartido
  const saved = JSON.parse(await readFile(connectionsFile, 'utf-8'));
  saved.connections['forja-autor'] = { name: 'Forja autor', url: 'https://forja.host', token: 'token-autor', type: 'forja' };
  await writeFile(connectionsFile, JSON.stringify(saved));

  for (const overwrite of [false, true]) {
    assert.throws(
      () => connectionManager.addConnection('forja-autor', { name: 'API', url: 'https://api.host', token: 't' }, overwrite),
      /conexión de tipo forja con la clave "forja-autor".*fs-forja/
    );
  }
  assert.throws(() => connectionManager.setDefault('forja-autor'), /tipo forja, del plugin fs-forja/);

  const after = JSON.parse(await readFile(connectionsFile, 'utf-8'));
  assert.equal(after.connections['forja-autor'].token, 'token-autor');
  assert.equal(after.default, 'forja');
  assert.equal(after.connections['forja-nueva'], undefined);
});

test('no sustituye sin overwrite una conexión que otro proceso añadió al archivo', async () => {
  const { connectionManager } = managerModule;

  // Otro proceso (otra sesión o la skill add-connection) añade «externa» al archivo; la memoria no la tiene
  const saved = JSON.parse(await readFile(connectionsFile, 'utf-8'));
  saved.connections.externa = { name: 'Externa', url: 'https://externa.host', token: 'token-externo' };
  await writeFile(connectionsFile, JSON.stringify(saved));
  assert.throws(() => connectionManager.getConnection('externa'), /no encontrada/);

  assert.throws(
    () => connectionManager.addConnection('externa', { name: 'Nueva', url: 'https://nueva.host', token: 'token-nuevo' }),
    /Ya existe una conexión con la clave "externa".*overwrite: true/
  );
  const after = JSON.parse(await readFile(connectionsFile, 'utf-8'));
  assert.equal(after.connections.externa.token, 'token-externo');
});
