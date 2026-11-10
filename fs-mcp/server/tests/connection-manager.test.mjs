/**
 * Pruebas de la persistencia del archivo de conexiones.
 *
 * Cada caso carga una instancia nueva del gestor (el módulo exporta un singleton
 * que lee FS_CONNECTIONS_FILE al importarse) apuntando a un archivo temporal.
 */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
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
  // Se renombra sobre la ruta real: os.tmpdir() puede pasar por un enlace (/var en macOS)
  const destino = fs.realpathSync(file);
  fs.fsyncSync = (fd) => { pasos.push('fsync'); return fsyncSync(fd); };
  fs.renameSync = (desde, hasta) => { pasos.push(hasta === destino ? 'rename' : 'otro'); return renameSync(desde, hasta); };
  try {
    connectionManager.addConnection('a', conexion);
  } finally {
    fs.fsyncSync = fsyncSync;
    fs.renameSync = renameSync;
  }

  assert.deepEqual(pasos, ['fsync', 'rename']);
  assert.equal(JSON.parse(fs.readFileSync(file, 'utf-8')).connections.a.token, 'secreto');
});

test('al cargar se borran los temporales abandonados y no los de un guardado en curso', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  const file = path.join(dir, 'connections.json');
  fs.writeFileSync(file, JSON.stringify({ default: 'a', connections: { a: conexion } }), { mode: 0o600 });
  const hace = (minutos) => new Date(Date.now() - minutos * 60 * 1000);
  const abandonado = `connections.json.${'1'.repeat(8)}-1111-1111-1111-${'1'.repeat(12)}.tmp`;
  const enCurso = `connections.json.${'2'.repeat(8)}-2222-2222-2222-${'2'.repeat(12)}.tmp`;
  const ajenos = ['connections.json.bak', 'connections.json.123.tmp', `otro.json.${'3'.repeat(8)}-3333-3333-3333-${'3'.repeat(12)}.tmp`];
  for (const nombre of [abandonado, enCurso, ...ajenos]) {
    fs.writeFileSync(path.join(dir, nombre), 'token', { mode: 0o600 });
    if (nombre !== enCurso) fs.utimesSync(path.join(dir, nombre), hace(60), hace(60));
  }
  fs.utimesSync(path.join(dir, enCurso), hace(1), hace(1));
  process.env.FS_CONNECTIONS_FILE = file;

  const { connectionManager } = await import(`${managerUrl}?caso=${++instancia}`);

  assert.equal(connectionManager.getConnection().name, 'Pruebas');
  assert.deepEqual(fs.readdirSync(dir).sort(), ['connections.json', enCurso, ...ajenos].sort());
});

test('un temporal que no se puede borrar no impide borrar los que vienen detrás', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  const file = path.join(dir, 'connections.json');
  fs.writeFileSync(file, JSON.stringify({ default: 'a', connections: { a: conexion } }), { mode: 0o600 });
  const viejo = new Date(Date.now() - 60 * 60 * 1000);
  // Un directorio con nombre de temporal (rmSync falla) y uno que desaparece antes del lstat
  const directorio = `connections.json.${'4'.repeat(8)}-4444-4444-4444-${'4'.repeat(12)}.tmp`;
  const desaparecido = `connections.json.${'5'.repeat(8)}-5555-5555-5555-${'5'.repeat(12)}.tmp`;
  const abandonado = `connections.json.${'6'.repeat(8)}-6666-6666-6666-${'6'.repeat(12)}.tmp`;
  fs.mkdirSync(path.join(dir, directorio));
  fs.utimesSync(path.join(dir, directorio), viejo, viejo);
  fs.writeFileSync(path.join(dir, abandonado), 'token', { mode: 0o600 });
  fs.utimesSync(path.join(dir, abandonado), viejo, viejo);
  process.env.FS_CONNECTIONS_FILE = file;

  // El orden de readdir no está definido: se fija para que los que fallan vayan delante
  const { readdirSync } = fs;
  fs.readdirSync = (p, ...resto) =>
    p === dir ? [directorio, desaparecido, abandonado, 'connections.json'] : readdirSync(p, ...resto);
  const avisos = [];
  const consoleError = console.error;
  console.error = (...args) => avisos.push(args.join(' '));
  try {
    await import(`${managerUrl}?caso=${++instancia}`);
  } finally {
    fs.readdirSync = readdirSync;
    console.error = consoleError;
  }

  assert.equal(fs.existsSync(path.join(dir, abandonado)), false);
  assert.equal(fs.existsSync(path.join(dir, directorio)), true);
  assert.equal(avisos.filter((a) => a.includes('temporal')).length, 1);
  assert.match(avisos.join('\n'), new RegExp(directorio.replace(/\./g, '\\.')));
});

/** Gestor con el archivo de conexiones como enlace relativo roto a dotfiles/connections.json. */
async function gestorConEnlaceRoto({ crearDirectorio }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  const dotfiles = path.join(dir, 'dotfiles');
  if (crearDirectorio) fs.mkdirSync(dotfiles);
  const enlace = path.join(dir, 'connections.json');
  fs.symlinkSync(path.join('dotfiles', 'connections.json'), enlace);
  process.env.FS_CONNECTIONS_FILE = enlace;
  const { connectionManager } = await import(`${managerUrl}?caso=${++instancia}`);
  return { connectionManager, dotfiles, enlace };
}

test('con un enlace simbólico roto, la conexión se guarda en su destino y el enlace se conserva', async () => {
  const { connectionManager, dotfiles, enlace } = await gestorConEnlaceRoto({ crearDirectorio: true });

  connectionManager.addConnection('a', conexion);

  assert.equal(fs.lstatSync(enlace).isSymbolicLink(), true);
  const destino = path.join(dotfiles, 'connections.json');
  assert.equal(JSON.parse(fs.readFileSync(destino, 'utf-8')).connections.a.token, 'secreto');
  assert.equal(fs.statSync(destino).mode & 0o777, 0o600);
  assert.deepEqual(fs.readdirSync(dotfiles), ['connections.json']);
});

test('con un enlace simbólico roto a un directorio que no existe, no se guarda ni se sustituye el enlace', async () => {
  const { connectionManager, dotfiles, enlace } = await gestorConEnlaceRoto({ crearDirectorio: false });

  assert.throws(() => connectionManager.addConnection('a', conexion), { code: 'ENOENT' });

  assert.equal(fs.lstatSync(enlace).isSymbolicLink(), true);
  assert.equal(fs.existsSync(dotfiles), false);
  assert.throws(() => connectionManager.getConnection('a'), /no encontrada|No hay conexión/);
});

/**
 * Ejecuta `cuerpo` en otro proceso con el gestor cargado como `connectionManager`
 * y devuelve su salida. Con tope de tiempo: un bucle que no termina falla el
 * test en vez de colgar la batería.
 */
function enOtroProceso(file, cuerpo, prologo = '') {
  const script = `${prologo}\nconst { connectionManager } = await import(${JSON.stringify(managerUrl)});\n${cuerpo}`;
  return execFileSync(process.execPath, ['--input-type=module', '-e', script], {
    env: { ...process.env, FS_CONNECTIONS_FILE: file },
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'ignore'],
    timeout: 10000,
  });
}

const intentarGuardar = `
try {
  connectionManager.addConnection('a', { name: 'A', url: 'http://127.0.0.1:1', token: 'secreto' });
  console.log('guardado');
} catch (error) {
  console.log(error.code);
}`;

test('un enlace roto cuyo destino vuelve a él a través de un directorio que no existe no cuelga el servidor', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  // El sistema da ENOENT ("falta" no existe); quitando el ".." sobre el texto, vuelve a ser el propio enlace
  const enlace = path.join(dir, 'connections.json');
  fs.symlinkSync('falta/../connections.json', enlace);

  assert.equal(enOtroProceso(enlace, intentarGuardar).trim(), 'ENOENT');
  assert.equal(fs.lstatSync(enlace).isSymbolicLink(), true);
  assert.deepEqual(fs.readdirSync(dir), ['connections.json']);
});

test('un enlace roto con ".." dentro de un directorio enlazado se resuelve sobre el directorio real', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  // home/cfg -> ../real/cfg y real/cfg/link -> ../other/conn.json: para el sistema, real/other/conn.json
  for (const sub of ['real/cfg', 'real/other', 'home/other']) fs.mkdirSync(path.join(dir, sub), { recursive: true });
  fs.symlinkSync(path.join('..', 'real', 'cfg'), path.join(dir, 'home', 'cfg'));
  fs.symlinkSync(path.join('..', 'other', 'conn.json'), path.join(dir, 'real', 'cfg', 'link'));
  process.env.FS_CONNECTIONS_FILE = path.join(dir, 'home', 'cfg', 'link');
  const { connectionManager } = await import(`${managerUrl}?caso=${++instancia}`);

  connectionManager.addConnection('k1', conexion);
  connectionManager.addConnection('k2', conexion);

  const destino = path.join(dir, 'real', 'other', 'conn.json');
  assert.deepEqual(Object.keys(JSON.parse(fs.readFileSync(destino, 'utf-8')).connections).sort(), ['k1', 'k2']);
  assert.deepEqual(fs.readdirSync(path.join(dir, 'home', 'other')), []);
  assert.equal(fs.lstatSync(path.join(dir, 'real', 'cfg', 'link')).isSymbolicLink(), true);
});

test('una cadena de enlaces rotos que no se acaba se corta con ELOOP', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-conn-'));
  temporales.push(dir);
  // El sistema corta las cadenas reales con ELOOP antes que el tope; aquí se simula una que no lo hace
  const prologo = `
import fs from 'node:fs';
import path from 'node:path';
const { realpathSync } = fs;
let salto = 0;
fs.realpathSync = (p, ...resto) => {
  if (path.basename(p).startsWith('enlace')) throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
  return realpathSync(p, ...resto);
};
fs.readlinkSync = () => 'enlace' + ++salto;`;

  assert.equal(enOtroProceso(path.join(dir, 'enlace0'), intentarGuardar, prologo).trim(), 'ELOOP');
});
