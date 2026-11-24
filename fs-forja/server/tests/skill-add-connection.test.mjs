/**
 * Pruebas de cómo escribe ~/.fs-claude.json la skill fs-forja:add-connection.
 *
 * Cada caso extrae el bloque de Python que escribe el archivo del SKILL.md, sustituye los valores de ejemplo y lo
 * ejecuta con python3 en un HOME temporal.
 */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const skillFile = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'skills', 'add-connection', 'SKILL.md'
);

// Con la umask habitual un archivo nuevo saldría 0644, legible por todas las cuentas
process.umask(0o022);

const temporales = [];

test.after(() => {
  for (const dir of temporales) fs.rmSync(dir, { recursive: true, force: true });
});

/**
 * Bloque de Python del SKILL.md que escribe el archivo de conexiones, con los valores indicados.
 *
 * @param {{clave?: string, url?: string, sustituir?: boolean}} valores Valores que sustituyen a los de ejemplo.
 * @returns {string} Código Python.
 */
function bloque({ clave = 'forja-autor', url = 'https://facturascripts.com/api/3/forja/', sustituir = false } = {}) {
  const texto = fs.readFileSync(skillFile, 'utf-8');
  const escriben = [...texto.matchAll(/```python\n([\s\S]*?)```/g)]
    .map((m) => m[1])
    .filter((b) => b.includes('json.dumps(config'));
  assert.equal(escriben.length, 1, 'se esperaba un único bloque que escribe el archivo');
  return escriben[0]
    .replace('clave = "CLAVE"', `clave = ${JSON.stringify(clave)}`)
    .replace('"URL"', JSON.stringify(url))
    .replace('"NOMBRE"', '"Forja (autor)"')
    .replace('"TOKEN"', '"token-de-autor"')
    .replace('sustituir = False', `sustituir = ${sustituir ? 'True' : 'False'}`);
}

/**
 * Crea un HOME temporal, opcionalmente con un ~/.fs-claude.json.
 *
 * @param {object} [contenido] Contenido del archivo.
 * @returns {{home: string, file: string}} Rutas del HOME y del archivo.
 */
function crearHome(contenido) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-forja-skill-'));
  temporales.push(home);
  const file = path.join(home, '.fs-claude.json');
  if (contenido) fs.writeFileSync(file, JSON.stringify(contenido), { mode: 0o600 });
  return { home, file };
}

/**
 * Ejecuta el bloque con HOME en `home`.
 *
 * @param {string} home HOME temporal.
 * @param {object} [valores] Valores del bloque.
 * @returns {{status: number|null, stderr: string}} Resultado de python3.
 */
function ejecutar(home, valores) {
  try {
    execFileSync('python3', ['-I', '-c', bloque(valores)], {
      env: { PATH: process.env.PATH, HOME: home },
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { status: 0, stderr: '' };
  } catch (error) {
    return { status: error.status, stderr: String(error.stderr) };
  }
}

const inicial = {
  version: '1.0',
  connections: {
    default: 'erp',
    connections: {
      erp: { name: 'ERP', url: 'https://erp.example.com', token: 'token-api' },
      forja: { name: 'API de facturascripts.com', url: 'https://facturascripts.com', token: 'token-api-fs' },
    },
  },
  settings: { sortClassMembers: false },
};

test('añade la conexión de tipo forja sin cambiar la conexión por defecto ni el resto del archivo', () => {
  const { home, file } = crearHome(inicial);

  assert.equal(ejecutar(home).status, 0);

  const guardado = JSON.parse(fs.readFileSync(file, 'utf-8'));
  assert.deepEqual(guardado.connections.connections['forja-autor'], {
    name: 'Forja (autor)',
    url: 'https://facturascripts.com',
    token: 'token-de-autor',
    type: 'forja',
  });
  assert.equal(guardado.connections.default, 'erp');
  assert.deepEqual(guardado.connections.connections.erp, inicial.connections.connections.erp);
  assert.deepEqual(guardado.settings, inicial.settings);
  assert.equal(fs.statSync(file).mode & 0o777, 0o600);
  assert.deepEqual(fs.readdirSync(home).filter((n) => n.includes('.tmp')), []);
});

test('crea el archivo en 0600 sin conexión por defecto si no existe', () => {
  const { home, file } = crearHome();

  assert.equal(ejecutar(home).status, 0);

  const guardado = JSON.parse(fs.readFileSync(file, 'utf-8'));
  assert.equal(guardado.connections.default, '');
  assert.equal(guardado.connections.connections['forja-autor'].type, 'forja');
  assert.equal(fs.statSync(file).mode & 0o777, 0o600);
});

test('nunca sustituye una conexión de fs-mcp, ni confirmándolo', () => {
  for (const sustituir of [false, true]) {
    const { home, file } = crearHome(inicial);
    const antes = fs.readFileSync(file, 'utf-8');

    const resultado = ejecutar(home, { clave: 'forja', sustituir });

    assert.notEqual(resultado.status, 0);
    assert.match(resultado.stderr, /conexión de fs-mcp/);
    assert.equal(fs.readFileSync(file, 'utf-8'), antes);
  }
});

test('una conexión de tipo forja existente solo se sustituye confirmándolo', () => {
  const conForja = structuredClone(inicial);
  conForja.connections.connections['forja-autor'] = {
    name: 'Forja vieja', url: 'https://facturascripts.com', token: 'token-viejo', type: 'forja',
  };
  const { home, file } = crearHome(conForja);

  const resultado = ejecutar(home);
  assert.notEqual(resultado.status, 0);
  assert.match(resultado.stderr, /confirma que quieres sustituirla/);
  assert.equal(JSON.parse(fs.readFileSync(file, 'utf-8')).connections.connections['forja-autor'].token, 'token-viejo');

  assert.equal(ejecutar(home, { sustituir: true }).status, 0);
  assert.equal(JSON.parse(fs.readFileSync(file, 'utf-8')).connections.connections['forja-autor'].token, 'token-de-autor');
});

test('conserva el enlace simbólico y escribe en su destino', () => {
  const { home, file } = crearHome();
  const dotfiles = path.join(home, 'dotfiles');
  fs.mkdirSync(dotfiles);
  const destino = path.join(dotfiles, 'fs-claude.json');
  fs.writeFileSync(destino, JSON.stringify(inicial), { mode: 0o600 });
  fs.symlinkSync(destino, file);

  assert.equal(ejecutar(home).status, 0);

  assert.equal(fs.lstatSync(file).isSymbolicLink(), true);
  assert.ok('forja-autor' in JSON.parse(fs.readFileSync(destino, 'utf-8')).connections.connections);
  assert.deepEqual(fs.readdirSync(dotfiles), ['fs-claude.json']);
});
