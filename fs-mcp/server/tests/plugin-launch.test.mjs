/**
 * Pruebas del arranque portable del servidor MCP desde Claude Code y Codex.
 */

import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pluginDirectory = path.resolve(serverDirectory, '..');
const manifestPath = path.join(pluginDirectory, '.claude-plugin', 'plugin.json');

/**
 * Inicia el servidor y espera la confirmación escrita en stderr.
 *
 * @param {'claude'|'codex'} host Host que se quiere simular.
 * @param {{command: string, args: string[]}} config Configuración MCP del manifiesto.
 * @returns {Promise<string>} Salida de diagnóstico producida durante el arranque.
 */
async function startServer(host, config) {
  return await new Promise((resolve, reject) => {
    const env = { ...process.env };
    const cwd = host === 'claude' ? serverDirectory : pluginDirectory;
    if (host === 'claude') {
      env.CLAUDE_PLUGIN_ROOT = pluginDirectory;
    } else {
      delete env.CLAUDE_PLUGIN_ROOT;
    }

    const child = spawn(config.command, config.args, {
      cwd,
      env,
      stdio: ['pipe', 'ignore', 'pipe'],
    });
    let stderr = '';

    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`El servidor no arrancó para ${host}. Salida: ${stderr}`));
    }, 10_000);

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
      if (stderr.includes('[fs-mcp] Server started successfully')) {
        clearTimeout(timeout);
        child.kill();
        resolve(stderr);
      }
    });
    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on('exit', (code, signal) => {
      if (code !== 0 && signal !== 'SIGTERM') {
        clearTimeout(timeout);
        reject(new Error(`El servidor terminó con código ${code}. Salida: ${stderr}`));
      }
    });
  });
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const config = manifest.mcpServers.facturascripts;

for (const host of ['claude', 'codex']) {
  test(`el servidor MCP arranca con la raíz proporcionada por ${host}`, async () => {
    const stderr = await startServer(host, config);
    assert.match(stderr, /Server started successfully/);
  });
}

for (const [caso, raiz] of [['sin CLAUDE_PLUGIN_ROOT', undefined], ['con CLAUDE_PLUGIN_ROOT relativo', '.']]) {
  test(`${caso} no arranca un server/dist/index.js de otra carpeta`, async () => {
    const proyecto = await mkdtemp(path.join(os.tmpdir(), 'fs-mcp-senuelo-'));
    const marca = path.join(proyecto, 'senuelo-ejecutado');
    try {
      await mkdir(path.join(proyecto, 'server', 'dist'), { recursive: true });
      await writeFile(
        path.join(proyecto, 'server', 'dist', 'index.js'),
        `require('node:fs').writeFileSync(${JSON.stringify(marca)}, 'si');`
      );
      await writeFile(path.join(proyecto, 'package.json'), '{"type":"commonjs"}');

      const env = { ...process.env };
      delete env.CLAUDE_PLUGIN_ROOT;
      if (raiz !== undefined) env.CLAUDE_PLUGIN_ROOT = raiz;
      const resultado = spawnSync(config.command, config.args, { cwd: proyecto, env, encoding: 'utf8', timeout: 10_000 });

      assert.equal(existsSync(marca), false, 'se ejecutó el index.js de la carpeta del proyecto');
      assert.notEqual(resultado.status, 0);
      assert.match(resultado.stderr, /falta CLAUDE_PLUGIN_ROOT/);
    } finally {
      await rm(proyecto, { recursive: true, force: true });
    }
  });
}
