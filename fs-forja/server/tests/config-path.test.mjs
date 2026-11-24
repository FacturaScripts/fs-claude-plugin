/**
 * Pruebas de la ruta del archivo de configuración compartido: `~/.fs-ai.json`, con el antiguo
 * `~/.fs-claude.json` como respaldo mientras sea el único que existe.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const moduleUrl = pathToFileURL(
  path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'dist', 'utils', 'configPath.js')
).href;
const { resolveConfigPath } = await import(moduleUrl);

/** Crea un HOME temporal que se borra al terminar la prueba. */
function homeTemporal(t) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-ai-config-'));
  t.after(() => fs.rmSync(home, { recursive: true, force: true }));
  return home;
}

test('sin archivos se usa ~/.fs-ai.json', (t) => {
  const home = homeTemporal(t);
  assert.equal(resolveConfigPath(home), path.join(home, '.fs-ai.json'));
});

test('si solo existe ~/.fs-claude.json se sigue usando', (t) => {
  const home = homeTemporal(t);
  fs.writeFileSync(path.join(home, '.fs-claude.json'), '{}');
  assert.equal(resolveConfigPath(home), path.join(home, '.fs-claude.json'));
});

test('si existen los dos manda ~/.fs-ai.json', (t) => {
  const home = homeTemporal(t);
  fs.writeFileSync(path.join(home, '.fs-claude.json'), '{}');
  fs.writeFileSync(path.join(home, '.fs-ai.json'), '{}');
  assert.equal(resolveConfigPath(home), path.join(home, '.fs-ai.json'));
});
