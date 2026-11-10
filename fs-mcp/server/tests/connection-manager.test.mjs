/**
 * Pruebas de la persistencia del archivo de conexiones.
 *
 * Cada caso carga una instancia nueva del gestor (el módulo exporta un singleton
 * que lee FS_CONNECTIONS_FILE al importarse) apuntando a un archivo temporal.
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

let instancia = 0;
const temporales = [];

test.after(() => {
  for (const dir of temporales) fs.rmSync(dir, { recursive: true, force: true });
});

/**
 * Crea un archivo de conexiones temporal con el contenido indicado y devuelve
 * un gestor recién construido que lo usa.
 *
 * @param {string|null} contenido Contenido inicial; null para no crear el archivo.
 */
async function nuevoGestor(contenido) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  const file = path.join(dir, 'connections.json');
  if (contenido !== null) {
    fs.writeFileSync(file, contenido, 'utf-8');
  }
  process.env.FS_CONNECTIONS_FILE = file;
  const { connectionManager } = await import(`${managerUrl}?caso=${++instancia}`);
  return { connectionManager, dir, file };
}

const conexion = { name: 'Pruebas', url: 'http://127.0.0.1:1', token: 'secreto' };

test('un archivo de conexiones ilegible no se sobrescribe al añadir una conexión', async () => {
  const corrupto = '{"default": "a", "connections": {"a": {"name": "A", ';
  const { connectionManager, file } = await nuevoGestor(corrupto);

  assert.throws(() => connectionManager.addConnection('nueva', conexion), /no es un JSON válido/);
  assert.equal(fs.readFileSync(file, 'utf-8'), corrupto);
});

test('un archivo que se corrompe después de cargarlo tampoco se sobrescribe', async () => {
  const { connectionManager, file } = await nuevoGestor(
    JSON.stringify({ default: 'a', connections: { a: conexion } })
  );
  fs.writeFileSync(file, 'no es json', 'utf-8');

  assert.throws(() => connectionManager.setDefault('a'), /no es un JSON válido/);
  assert.equal(fs.readFileSync(file, 'utf-8'), 'no es json');
});

test('guardar sustituye el archivo por rename y no deja temporales', async () => {
  const { connectionManager, dir, file } = await nuevoGestor(
    JSON.stringify({ default: '', connections: {} })
  );
  const inodoAntes = fs.statSync(file).ino;

  connectionManager.addConnection('a', conexion);

  assert.notEqual(fs.statSync(file).ino, inodoAntes);
  assert.deepEqual(fs.readdirSync(dir), ['connections.json']);
  assert.equal(JSON.parse(fs.readFileSync(file, 'utf-8')).connections.a.token, 'secreto');
});

test('guardar conserva el modo 0600 de un archivo existente', async () => {
  const anterior = process.umask(0o002);
  try {
    const { connectionManager, file } = await nuevoGestor(JSON.stringify({ default: '', connections: {} }));
    fs.chmodSync(file, 0o600);

    connectionManager.addConnection('a', conexion);

    assert.equal(fs.statSync(file).mode & 0o777, 0o600);
  } finally {
    process.umask(anterior);
  }
});

test('si no se puede guardar, el cambio no queda aplicado en memoria', async () => {
  const otra = { ...conexion, name: 'Otra' };
  const { connectionManager, file } = await nuevoGestor(
    JSON.stringify({ default: 'a', connections: { a: conexion, b: otra } })
  );
  fs.writeFileSync(file, 'no es json', 'utf-8');

  assert.throws(() => connectionManager.setDefault('b'), /no es un JSON válido/);
  assert.equal(connectionManager.getConnection().name, 'Pruebas');

  assert.throws(() => connectionManager.addConnection('c', otra), /no es un JSON válido/);
  assert.throws(() => connectionManager.getConnection('c'), /no encontrada/);
});

for (const contenido of ['[]', 'null', '5', '"texto"']) {
  test(`un archivo con JSON válido que no es un objeto (${contenido}) no se sobrescribe`, async () => {
    const { connectionManager, file } = await nuevoGestor(contenido);

    assert.throws(() => connectionManager.addConnection('nueva', conexion), /no es un objeto/);
    assert.equal(fs.readFileSync(file, 'utf-8'), contenido);
    assert.throws(() => connectionManager.getConnection('nueva'), /no encontrada/);
  });
}

test('el formato ~/.fs-claude.json también se niega con un array y conserva el archivo', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  const file = path.join(dir, '.fs-claude.json');
  fs.writeFileSync(file, '[]', 'utf-8');
  const homeOriginal = process.env.HOME;
  const ficheroOriginal = process.env.FS_CONNECTIONS_FILE;
  process.env.HOME = dir;
  delete process.env.FS_CONNECTIONS_FILE;
  try {
    const { connectionManager } = await import(`${managerUrl}?caso=${++instancia}`);
    assert.throws(() => connectionManager.addConnection('nueva', conexion), /no es un objeto/);
    assert.equal(fs.readFileSync(file, 'utf-8'), '[]');
    assert.throws(() => connectionManager.getConnection('nueva'), /no encontrada/);
  } finally {
    process.env.HOME = homeOriginal;
    if (ficheroOriginal !== undefined) process.env.FS_CONNECTIONS_FILE = ficheroOriginal;
  }
});

test('un enlace plantado en el nombre de temporal de antes no recibe el token', async () => {
  const { connectionManager, dir, file } = await nuevoGestor(JSON.stringify({ default: '', connections: {} }));
  const victima = path.join(dir, 'victima');
  fs.writeFileSync(victima, 'intacto', 'utf-8');
  fs.symlinkSync(victima, `${file}.${process.pid}.tmp`);

  connectionManager.addConnection('a', conexion);

  assert.equal(fs.readFileSync(victima, 'utf-8'), 'intacto');
  assert.equal(fs.lstatSync(file).isSymbolicLink(), false);
  assert.equal(fs.statSync(file).mode & 0o777, 0o600);
});

test('al arrancar no se trunca un archivo que otro proceso acaba de crear', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  const file = path.join(dir, 'connections.json');
  const contenido = JSON.stringify({ default: 'a', connections: { a: conexion } });
  fs.writeFileSync(file, contenido, 'utf-8');
  process.env.FS_CONNECTIONS_FILE = file;

  // El archivo aparece entre la comprobación de existencia y la escritura
  const existsSync = fs.existsSync;
  fs.existsSync = (p) => (p === file ? false : existsSync(p));
  try {
    const { connectionManager } = await import(`${managerUrl}?caso=${++instancia}`);
    assert.equal(connectionManager.getConnection().name, 'Pruebas');
  } finally {
    fs.existsSync = existsSync;
  }
  assert.equal(fs.readFileSync(file, 'utf-8'), contenido);
});

test('tras corregir un archivo roto, añadir una conexión conserva las demás, el default y los ajustes', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  const file = path.join(dir, '.fs-claude.json');
  fs.writeFileSync(file, '{"connections": {"default": "a", ', 'utf-8');
  const homeOriginal = process.env.HOME;
  const ficheroOriginal = process.env.FS_CONNECTIONS_FILE;
  process.env.HOME = dir;
  delete process.env.FS_CONNECTIONS_FILE;
  try {
    const { connectionManager } = await import(`${managerUrl}?caso=${++instancia}`);
    assert.throws(() => connectionManager.addConnection('nueva', conexion), /no es un JSON válido/);

    // El usuario corrige el archivo y reintenta sin reiniciar el servidor
    fs.writeFileSync(file, JSON.stringify({
      connections: { default: 'a', connections: { a: conexion, b: { ...conexion, name: 'B' } } },
      settings: { sortClassMembers: false },
    }), 'utf-8');
    connectionManager.addConnection('nueva', { ...conexion, name: 'Nueva' });

    const guardado = JSON.parse(fs.readFileSync(file, 'utf-8'));
    assert.deepEqual(Object.keys(guardado.connections.connections).sort(), ['a', 'b', 'nueva']);
    assert.equal(guardado.connections.default, 'a');
    assert.deepEqual(guardado.settings, { sortClassMembers: false });
    assert.equal(connectionManager.getConnection().name, 'Pruebas');
    assert.equal(connectionManager.getConnection('b').name, 'B');
  } finally {
    process.env.HOME = homeOriginal;
    if (ficheroOriginal !== undefined) process.env.FS_CONNECTIONS_FILE = ficheroOriginal;
  }
});

test('dos gestores sobre el mismo archivo no se pisan lo que guarda cada uno', async () => {
  const { connectionManager: uno, file } = await nuevoGestor(JSON.stringify({ default: '', connections: {} }));
  const { connectionManager: otro } = await import(`${managerUrl}?caso=${++instancia}`);

  uno.addConnection('a', conexion);
  otro.addConnection('b', { ...conexion, name: 'B' });
  let guardado = JSON.parse(fs.readFileSync(file, 'utf-8'));
  assert.deepEqual(Object.keys(guardado.connections).sort(), ['a', 'b']);
  assert.equal(guardado.default, 'a');

  // "uno" no ha visto "b" en memoria, pero está en el archivo
  uno.setDefault('b');
  guardado = JSON.parse(fs.readFileSync(file, 'utf-8'));
  assert.deepEqual(Object.keys(guardado.connections).sort(), ['a', 'b']);
  assert.equal(guardado.default, 'b');
  assert.equal(uno.getConnection().name, 'B');
});

test('un archivo de conexiones que es un enlace simbólico se conserva y su destino recibe la conexión', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  const dotfiles = path.join(dir, 'dotfiles');
  fs.mkdirSync(dotfiles);
  const destino = path.join(dotfiles, 'connections.json');
  fs.writeFileSync(destino, JSON.stringify({ default: '', connections: {} }), { mode: 0o600 });
  const enlace = path.join(dir, 'connections.json');
  fs.symlinkSync(destino, enlace);
  process.env.FS_CONNECTIONS_FILE = enlace;
  const { connectionManager } = await import(`${managerUrl}?caso=${++instancia}`);

  connectionManager.addConnection('a', conexion);

  assert.equal(fs.lstatSync(enlace).isSymbolicLink(), true);
  assert.equal(JSON.parse(fs.readFileSync(destino, 'utf-8')).connections.a.token, 'secreto');
  assert.equal(fs.statSync(destino).mode & 0o777, 0o600);
  assert.deepEqual(fs.readdirSync(dotfiles), ['connections.json']);
});

for (const contenido of ['', ' \n']) {
  test(`un archivo de conexiones vacío (${JSON.stringify(contenido)}) se rehace al añadir una conexión`, async () => {
    const { connectionManager, file } = await nuevoGestor(contenido);

    connectionManager.addConnection('a', conexion);

    assert.equal(JSON.parse(fs.readFileSync(file, 'utf-8')).connections.a.token, 'secreto');
    assert.equal(connectionManager.getConnection().name, 'Pruebas');
  });
}

test('el error de un archivo roto no cita su contenido, que puede llevar un token', async () => {
  const roto = "{\"default\": \"a\", \"connections\": {\"a\": {\"token\": 'SECRETO123'}}}";
  const avisos = [];
  const consoleError = console.error;
  console.error = (...args) => avisos.push(args.join(' '));
  let connectionManager;
  try {
    ({ connectionManager } = await nuevoGestor(roto));
  } finally {
    console.error = consoleError;
  }

  assert.match(avisos.join('\n'), /Error al cargar conexiones: JSON inválido/);
  assert.doesNotMatch(avisos.join('\n'), /SECRETO/);
  assert.throws(
    () => connectionManager.addConnection('nueva', conexion),
    (error) => /no es un JSON válido/.test(error.message) && !/SECRETO/.test(error.message)
  );
});

test('el error de un archivo roto conserva la posición cuando JSON.parse la da', async () => {
  const { connectionManager } = await nuevoGestor('{"a": 1,');

  assert.throws(() => connectionManager.addConnection('nueva', conexion), /JSON inválido en la posición \d+/);
});

test('el temporal se lleva a disco antes de renombrarlo sobre el archivo', async () => {
  const { connectionManager, file } = await nuevoGestor(JSON.stringify({ default: '', connections: {} }));
  const pasos = [];
  const { fsyncSync, renameSync } = fs;
  fs.fsyncSync = (fd) => { pasos.push('fsync'); return fsyncSync(fd); };
  fs.renameSync = (desde, hasta) => { pasos.push(hasta === file ? 'rename' : 'otro'); return renameSync(desde, hasta); };
  try {
    connectionManager.addConnection('a', conexion);
  } finally {
    fs.fsyncSync = fsyncSync;
    fs.renameSync = renameSync;
  }

  assert.deepEqual(pasos, ['fsync', 'rename']);
  assert.equal(JSON.parse(fs.readFileSync(file, 'utf-8')).connections.a.token, 'secreto');
});
