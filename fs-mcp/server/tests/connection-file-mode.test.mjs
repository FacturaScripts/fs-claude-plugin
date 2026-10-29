/**
 * Pruebas de los permisos del archivo de conexiones, que guarda los tokens de la API.
 *
 * Cada caso carga una instancia nueva del gestor (singleton que lee la
 * ubicación al importarse) en un directorio temporal.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const managerUrl = pathToFileURL(
  path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'dist', 'connection-manager.js')
).href;

// Con la umask habitual un archivo nuevo saldría 0644, legible por todas las cuentas
process.umask(0o022);

let instancia = 0;
const temporales = [];
const homeOriginal = process.env.HOME;

test.after(() => {
  process.env.HOME = homeOriginal;
  for (const dir of temporales) fs.rmSync(dir, { recursive: true, force: true });
});

/** Gestor nuevo con el archivo en un directorio temporal, en uno de los dos formatos. */
async function nuevoGestor(formato) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-mode-'));
  temporales.push(dir);
  let file;
  if (formato === 'fs-claude') {
    process.env.HOME = dir;
    delete process.env.FS_CONNECTIONS_FILE;
    file = path.join(dir, '.fs-claude.json');
  } else {
    file = path.join(dir, 'connections.json');
    process.env.FS_CONNECTIONS_FILE = file;
  }
  const { connectionManager } = await import(`${managerUrl}?caso=${++instancia}`);
  return { connectionManager, file };
}

const modo = (file) => fs.statSync(file).mode & 0o777;

for (const formato of ['fs-claude', 'FS_CONNECTIONS_FILE']) {
  test(`el archivo de conexiones se crea 0600 al arrancar (${formato})`, async () => {
    const { file } = await nuevoGestor(formato);
    assert.equal(modo(file), 0o600);
  });

  test(`el archivo de conexiones se crea 0600 al guardar (${formato})`, async () => {
    const { connectionManager, file } = await nuevoGestor(formato);
    fs.rmSync(file);
    connectionManager.addConnection('a', { name: 'A', url: 'http://127.0.0.1:1', token: 'secreto' });
    assert.equal(modo(file), 0o600);
  });
}

for (const formato of ['fs-claude', 'FS_CONNECTIONS_FILE']) {
  test(`guardar deja en 0600 un archivo de conexiones que ya existía en 0644 (${formato})`, async () => {
    const { connectionManager, file } = await nuevoGestor(formato);
    fs.chmodSync(file, 0o644);
    connectionManager.addConnection('a', { name: 'A', url: 'http://127.0.0.1:1', token: 'secreto' });
    assert.equal(modo(file), 0o600);
  });
}

for (const formato of ['fs-claude', 'FS_CONNECTIONS_FILE']) {
  test(`el token no llega a escribirse en un archivo que ya existía en 0644 (${formato})`, async () => {
    const { connectionManager, file } = await nuevoGestor(formato);
    fs.chmodSync(file, 0o644);
    // Un enlace duro al archivo anterior: si el token se escribiera en él, aunque
    // fuera un instante antes de cambiarle el modo, quedaría aquí
    const anterior = `${file}.anterior`;
    fs.linkSync(file, anterior);

    connectionManager.addConnection('a', { name: 'A', url: 'http://127.0.0.1:1', token: 'secreto' });

    assert.doesNotMatch(fs.readFileSync(anterior, 'utf-8'), /secreto/);
    assert.match(fs.readFileSync(file, 'utf-8'), /secreto/);
    assert.equal(modo(file), 0o600);
  });
}

for (const formato of ['fs-claude', 'FS_CONNECTIONS_FILE']) {
  test(`al cargar queda en 0600 un archivo de conexiones que ya existía en 0644 (${formato})`, async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-mode-'));
    temporales.push(dir);
    let file;
    if (formato === 'fs-claude') {
      process.env.HOME = dir;
      delete process.env.FS_CONNECTIONS_FILE;
      file = path.join(dir, '.fs-claude.json');
      fs.writeFileSync(file, JSON.stringify({ connections: { default: '', connections: {} } }));
    } else {
      file = path.join(dir, 'connections.json');
      process.env.FS_CONNECTIONS_FILE = file;
      fs.writeFileSync(file, JSON.stringify({ default: '', connections: {} }));
    }
    fs.chmodSync(file, 0o644);

    await import(`${managerUrl}?caso=${++instancia}`);

    assert.equal(modo(file), 0o600);
  });
}
