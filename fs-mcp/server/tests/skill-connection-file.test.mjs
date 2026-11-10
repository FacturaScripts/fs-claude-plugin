/**
 * Pruebas de cómo escriben ~/.fs-claude.json las skills add-connection y
 * configure-local-modules.
 *
 * Cada caso extrae el bloque de Python que escribe el archivo del SKILL.md y lo
 * ejecuta con python3 en un HOME temporal.
 */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const skillsDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'skills');

// Con la umask habitual un archivo nuevo saldría 0644, legible por todas las cuentas
process.umask(0o022);

const temporales = [];

test.after(() => {
  for (const dir of temporales) fs.rmSync(dir, { recursive: true, force: true });
});

/** Bloque de Python del SKILL.md que escribe el archivo de conexiones. */
function bloqueQueEscribe(skill) {
  const texto = fs.readFileSync(path.join(skillsDir, skill, 'SKILL.md'), 'utf-8');
  const bloques = [...texto.matchAll(/```python\n([\s\S]*?)```/g)].map((m) => m[1]);
  const escriben = bloques.filter((b) => b.includes('json.dumps(config'));
  assert.equal(escriben.length, 1, `${skill}: se esperaba un único bloque que escribe el archivo`);
  return escriben[0];
}

/** Ejecuta el bloque de la skill con HOME en `home`; `prologo` va delante. */
function ejecutar(skill, home, prologo = '') {
  return execFileSync('python3', ['-I', '-c', prologo + bloqueQueEscribe(skill)], {
    env: { PATH: process.env.PATH, HOME: home },
    encoding: 'utf-8',
  });
}

const conexion = { name: 'Pruebas', url: 'http://127.0.0.1:1', token: 'secreto' };
const contenidoInicial = JSON.stringify({
  connections: { default: 'uno', connections: { uno: conexion, dos: conexion } },
  settings: {},
});
const modo = (file) => fs.statSync(file).mode & 0o777;

for (const skill of ['add-connection', 'configure-local-modules']) {
  test(`${skill} no escribe sobre el archivo en el sitio, que lo dejaría vacío mientras lo hace`, () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-skill-'));
    temporales.push(home);
    const file = path.join(home, '.fs-claude.json');
    fs.writeFileSync(file, contenidoInicial, { mode: 0o644 });
    fs.chmodSync(file, 0o644);
    // Un enlace duro al archivo de antes: si la skill escribiera en el sitio, cambiaría
    const anterior = path.join(home, 'anterior');
    fs.linkSync(file, anterior);

    ejecutar(skill, home);

    assert.equal(fs.readFileSync(anterior, 'utf-8'), contenidoInicial);
    const guardado = JSON.parse(fs.readFileSync(file, 'utf-8'));
    assert.ok(['uno', 'dos'].every((k) => k in guardado.connections.connections));
    assert.equal(guardado.connections.default, 'uno');
    assert.equal(modo(file), 0o600);
    assert.deepEqual(
      fs.readdirSync(home).filter((n) => n.includes('.tmp')),
      []
    );
  });

  test(`${skill} crea el archivo en 0600 si no existe`, () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-skill-'));
    temporales.push(home);

    ejecutar(skill, home);

    assert.equal(modo(path.join(home, '.fs-claude.json')), 0o600);
  });

  test(`${skill} conserva el enlace simbólico y escribe en su destino`, () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-skill-'));
    temporales.push(home);
    const dotfiles = path.join(home, 'dotfiles');
    fs.mkdirSync(dotfiles);
    const destino = path.join(dotfiles, 'fs-claude.json');
    fs.writeFileSync(destino, contenidoInicial, { mode: 0o600 });
    const file = path.join(home, '.fs-claude.json');
    fs.symlinkSync(destino, file);

    ejecutar(skill, home);

    assert.equal(fs.lstatSync(file).isSymbolicLink(), true);
    assert.ok('dos' in JSON.parse(fs.readFileSync(destino, 'utf-8')).connections.connections);
    assert.equal(modo(destino), 0o600);
    assert.deepEqual(fs.readdirSync(dotfiles), ['fs-claude.json']);
  });

  test(`${skill} lleva el temporal a disco antes de renombrarlo`, () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-skill-'));
    temporales.push(home);
    fs.writeFileSync(path.join(home, '.fs-claude.json'), contenidoInicial, { mode: 0o600 });
    const prologo = [
      'import os',
      '_fsync, _replace = os.fsync, os.replace',
      'def _f(fd): print("PASO fsync"); _fsync(fd)',
      'def _r(a, b): print("PASO replace"); _replace(a, b)',
      'os.fsync, os.replace = _f, _r',
      '',
    ].join('\n');

    const salida = ejecutar(skill, home, prologo);

    assert.deepEqual(salida.split('\n').filter((l) => l.startsWith('PASO')), ['PASO fsync', 'PASO replace']);
  });
}
