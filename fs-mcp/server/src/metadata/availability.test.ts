/**
 * Contrato de la vigencia por versión.
 *
 * Las fixtures son repositorios git sintéticos creados en un temporal: un core,
 * un plugin que define una tabla y otro que la extiende. Cubren los casos que la
 * vigencia tiene que distinguir sin inventar: columna nueva, retirada, con hueco,
 * sin publicar, que cambia de plugin, y fuente sin historial.
 *
 * Los commits se crean con `commit-tree`, que no ejecuta hooks, y con la
 * configuración global aislada: la prueba no depende de la máquina que la corre.
 */

import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { after, describe, it } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { renderMarkdown } from '../resources/schema-resources.js';
import {
    columnAvailability,
    loadSourceHistory,
    modelAvailability,
    readTagVersions,
    retiredColumns,
} from './availability.js';
import type { ModelMetadata } from './types.js';

const GIT_ENV = {
    ...process.env,
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_AUTHOR_NAME: 'test',
    GIT_AUTHOR_EMAIL: 'test@example.com',
    GIT_COMMITTER_NAME: 'test',
    GIT_COMMITTER_EMAIL: 'test@example.com',
};

const root = mkdtempSync(join(tmpdir(), 'fs-mcp-availability-'));
after(() => rmSync(root, { recursive: true, force: true }));

function git(cwd: string, ...args: string[]): string {
    return execFileSync('git', args, { cwd, env: GIT_ENV, encoding: 'utf8' }).trim();
}

function table(columns: string[]): string {
    const body = columns
        .map((c) => `    <column>\n        <name>${c}</name>\n        <type>character varying(10)</type>\n    </column>`)
        .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<table>\n${body}\n</table>\n`;
}

/**
 * Repositorio de un plugin con un commit por estado (y su tag si lo lleva); deja
 * el último en el árbol y en HEAD. `from` hace nacer el commit de ese tag en vez
 * del anterior, para construir ramas laterales.
 */
function pluginRepo(
    dir: string,
    name: string,
    states: Array<{ tag?: string; from?: string; version: string; files: Record<string, string> }>,
): string {
    mkdirSync(dir, { recursive: true });
    git(dir, 'init', '-q');
    let parent: string | undefined;
    for (const { tag, from, version, files } of states) {
        if (from) parent = git(dir, 'rev-parse', `${from}^{commit}`);
        for (const entry of ['Table', 'Extension']) rmSync(join(dir, entry), { recursive: true, force: true });
        // min_version delante de version: comprueba que se lee la línea correcta.
        writeFileSync(join(dir, 'facturascripts.ini'), `name = '${name}'\nmin_version = 2025\nversion = ${version}\n`);
        for (const [path, content] of Object.entries(files)) {
            mkdirSync(dirname(join(dir, path)), { recursive: true });
            writeFileSync(join(dir, path), content);
        }
        git(dir, 'add', '-A');
        const tree = git(dir, 'write-tree');
        const commit = parent
            ? git(dir, 'commit-tree', tree, '-p', parent, '-m', tag ?? 'wip')
            : git(dir, 'commit-tree', tree, '-m', tag ?? 'wip');
        git(dir, 'update-ref', 'HEAD', commit);
        if (tag) git(dir, 'tag', tag, commit);
        parent = commit;
    }
    return dir;
}

// ── Fixtures ────────────────────────────────────────────────────────────────

const fsPath = join(root, 'facturascripts');
const kernel = (v: string): string => `<?php\nclass Kernel {\n    public static function version(): float\n    {\n        return ${v};\n    }\n}\n`;

// Core: el tag "v1" no tiene Kernel.php (cae al nombre del tag); "v2" declara 2.5.
mkdirSync(fsPath, { recursive: true });
git(fsPath, 'init', '-q');
{
    let parent: string | undefined;
    const states = [
        { tag: 'v1', files: { 'Core/Table/countries.xml': table(['code', 'name']) } },
        {
            tag: 'v2',
            files: { 'Core/Table/countries.xml': table(['code', 'name', 'iso']), 'Core/Kernel.php': kernel('2.5') },
        },
    ];
    for (const { tag, files } of states) {
        for (const [path, content] of Object.entries(files)) {
            mkdirSync(dirname(join(fsPath, path)), { recursive: true });
            writeFileSync(join(fsPath, path), content);
        }
        git(fsPath, 'add', '-A');
        const tree = git(fsPath, 'write-tree');
        const commit = parent ? git(fsPath, 'commit-tree', tree, '-p', parent, '-m', tag) : git(fsPath, 'commit-tree', tree, '-m', tag);
        git(fsPath, 'update-ref', 'HEAD', commit);
        git(fsPath, 'tag', tag, commit);
        parent = commit;
    }
}

// Plugin Alpha: define la tabla `things`.
//   keep  → en todas las versiones
//   later → nueva en 1.5
//   gone  → retirada después de 1.5
//   gap   → en 1.0, falta en 1.5, vuelve en 2.0
//   moved → en Alpha hasta 1.5; después la aporta Beta por extensión
//   draft → solo en el árbol: sin publicar
const alphaDir = pluginRepo(join(fsPath, 'Plugins', 'Alpha'), 'Alpha', [
    { tag: 'v1.0', version: '1.0', files: { 'Table/things.xml': table(['keep', 'gone', 'gap', 'moved']) } },
    { tag: 'v1.5', version: '1.5', files: { 'Table/things.xml': table(['keep', 'later', 'gone', 'moved']) } },
    { tag: 'v2.0', version: '2.0', files: { 'Table/things.xml': table(['keep', 'later', 'gap']) } },
    { version: '2.0', files: { 'Table/things.xml': table(['keep', 'later', 'gap', 'draft']) } },
]);

// Plugin Beta: extiende `things` con `moved` desde su primera versión.
const betaDir = pluginRepo(join(fsPath, 'Plugins', 'Beta'), 'Beta', [
    { tag: 'v0.1', version: '0.1', files: { 'Extension/Table/things.xml': table(['moved']) } },
]);

// Plugin Gamma: sin git, así que sin historial.
const gammaDir = join(fsPath, 'Plugins', 'Gamma');
mkdirSync(join(gammaDir, 'Extension', 'Table'), { recursive: true });
writeFileSync(join(gammaDir, 'Extension', 'Table', 'things.xml'), table(['nohistory']));

mkdirSync(join(fsPath, 'MyFiles'), { recursive: true });
writeFileSync(
    join(fsPath, 'MyFiles', 'plugins.json'),
    JSON.stringify([
        { name: 'Alpha', enabled: true, order: 1 },
        { name: 'Beta', enabled: true, order: 2 },
        { name: 'Gamma', enabled: true, order: 3 },
    ]),
);

// ── Unidad ──────────────────────────────────────────────────────────────────

describe('readTagVersions', () => {
    it('lee la versión de facturascripts.ini, no min_version', () => {
        assert.deepEqual(
            readTagVersions(alphaDir, 'plugin').map((v) => v.version),
            ['1.0', '1.5', '2.0'],
        );
    });

    it('en el core usa Kernel::version() y, sin él, el nombre del tag', () => {
        assert.deepEqual(
            readTagVersions(fsPath, 'core').map((v) => [v.tag, v.version]),
            [['v1', '1'], ['v2', '2.5']],
        );
    });

    it('ordena como decimales: 1.10 es anterior a 1.9', () => {
        const dir = pluginRepo(join(root, 'decimal'), 'Decimal', [
            // Publicadas en orden decimal: 1.10 (= 1.1) va antes que 1.9.
            { tag: 'v1.10', version: '1.10', files: {} },
            { tag: 'v1.9', version: '1.9', files: {} },
            // Y 10.0 tras 2.0, que en orden alfabético irían al revés.
            { tag: 'v2.0', version: '2.0', files: {} },
            { tag: 'v10.0', version: '10.0', files: {} },
        ]);
        assert.deepEqual(readTagVersions(dir, 'plugin').map((v) => v.version), ['1.10', '1.9', '2.0', '10.0']);
    });

    it('cuenta una versión publicada en una rama lateral y ninguna por encima de la de HEAD', () => {
        // 1.0 → 2.0 → HEAD (declara 2.0) en la línea principal; 1.1 es un parche
        // sobre 1.0 publicado en una rama lateral; 3.0 se publicó después, en otra.
        const dir = pluginRepo(join(root, 'lateral'), 'Lateral', [
            { tag: 'v1.0', version: '1.0', files: { 'Table/t.xml': table(['a']) } },
            { tag: 'v2.0', version: '2.0', files: { 'Table/t.xml': table(['a']) } },
            { tag: 'v1.1', from: 'v1.0', version: '1.1', files: { 'Table/t.xml': table(['a', 'patch']) } },
            { tag: 'v3.0', from: 'v2.0', version: '3.0', files: { 'Table/t.xml': table(['a', 'later']) } },
            { from: 'v2.0', version: '2.0', files: { 'Table/t.xml': table(['a']) } },
        ]);
        // La fixture es lo que dice: v1.1 no es ancestro de HEAD.
        assert.throws(() => git(dir, 'merge-base', '--is-ancestor', 'v1.1', 'HEAD'));

        assert.deepEqual(readTagVersions(dir, 'plugin').map((v) => v.version), ['1.0', '1.1', '2.0']);
        const history = loadSourceHistory(dir, 'plugin:Lateral', 'plugin');
        assert.deepEqual(columnAvailability('t', 'patch', [history]), [
            { source: 'plugin:Lateral', since: '1.1', until: '1.1' },
        ]);
        assert.equal(history.columns.get('t')?.has('later'), false);
    });

    it('una carpeta dentro de otro repositorio no tiene historial propio', () => {
        assert.deepEqual(readTagVersions(join(fsPath, 'Core'), 'core'), []);
    });
});

describe('columnAvailability', () => {
    const alpha = loadSourceHistory(alphaDir, 'plugin:Alpha', 'plugin');
    const beta = loadSourceHistory(betaDir, 'plugin:Beta', 'plugin');
    const histories = [alpha, beta];

    it('columna presente desde la primera versión: since es un "como muy tarde"', () => {
        assert.deepEqual(columnAvailability('things', 'keep', histories, 'plugin:Alpha'), [
            { source: 'plugin:Alpha', since: '1.0', sinceFirstTag: true },
        ]);
    });

    it('columna nueva', () => {
        assert.deepEqual(columnAvailability('things', 'later', histories, 'plugin:Alpha'), [
            { source: 'plugin:Alpha', since: '1.5' },
        ]);
    });

    it('columna con hueco: dos tramos', () => {
        assert.deepEqual(columnAvailability('things', 'gap', histories, 'plugin:Alpha'), [
            { source: 'plugin:Alpha', since: '1.0', sinceFirstTag: true, until: '1.0' },
            { source: 'plugin:Alpha', since: '2.0' },
        ]);
    });

    it('columna que cambia de plugin: el tramo cerrado de uno y el abierto del otro', () => {
        assert.deepEqual(columnAvailability('things', 'moved', histories, 'plugin:Beta'), [
            { source: 'plugin:Alpha', since: '1.0', sinceFirstTag: true, until: '1.5' },
            { source: 'plugin:Beta', since: '0.1', sinceFirstTag: true },
        ]);
    });

    it('columna sin publicar', () => {
        assert.deepEqual(columnAvailability('things', 'draft', histories, 'plugin:Alpha'), [
            { source: 'plugin:Alpha', unreleased: true },
        ]);
    });

    it('fuente sin historial: rango desconocido', () => {
        const gamma = loadSourceHistory(gammaDir, 'plugin:Gamma', 'plugin');
        assert.deepEqual(columnAvailability('things', 'nohistory', [...histories, gamma], 'plugin:Gamma'), [
            { source: 'plugin:Gamma', unknown: true },
        ]);
    });

    it('retiradas: solo las que no están en el código actual, con su último tramo cerrado', () => {
        const current = new Set(['keep', 'later', 'gap', 'draft', 'moved']);
        const retired = retiredColumns('things', current, histories);
        assert.deepEqual(
            retired.map((r) => [r.column.name, r.availability]),
            [['gone', [{ source: 'plugin:Alpha', since: '1.0', sinceFirstTag: true, until: '1.5' }]]],
        );
    });

    it('vigencia del modelo según quien define la tabla', () => {
        assert.deepEqual(modelAvailability('things', 'plugin:Alpha', histories), [
            { source: 'plugin:Alpha', since: '1.0', sinceFirstTag: true },
        ]);
    });
});

// ── Extremo a extremo: el generador real sobre las fixtures ──────────────────

describe('generate-metadata en modo plugin', () => {
    const serverRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
    const outputBase = join(root, 'out');
    const manifest = join(root, 'manifest.json');
    writeFileSync(
        manifest,
        JSON.stringify({
            moduleName: 'Alpha',
            fsPath,
            pluginPath: alphaDir,
            outputBase,
            models: [{ name: 'thing', outputDir: 'things', table: 'things', endpoint: '/things', description: 'Cosa.' }],
        }),
    );
    execFileSync('node', [join(serverRoot, 'dist', 'scripts', 'generate-metadata.js'), `--manifest=${manifest}`], {
        stdio: 'ignore',
    });

    it('cada columna lleva su vigencia, y las retiradas van aparte', async () => {
        const mod = (await import(pathToFileURL(join(outputBase, 'things', 'metadata.js')).href)) as {
            default: ModelMetadata;
        };
        const meta = mod.default;
        const byName = Object.fromEntries(meta.columns.map((c) => [c.name, c.availability]));

        assert.deepEqual(Object.keys(byName).sort(), ['draft', 'gap', 'keep', 'later', 'moved', 'nohistory']);
        assert.deepEqual(byName['moved'], [
            { source: 'plugin:Alpha', since: '1.0', sinceFirstTag: true, until: '1.5' },
            { source: 'plugin:Beta', since: '0.1', sinceFirstTag: true },
        ]);
        assert.deepEqual(byName['draft'], [{ source: 'plugin:Alpha', unreleased: true }]);
        assert.deepEqual(byName['nohistory'], [{ source: 'plugin:Gamma', unknown: true }]);
        assert.deepEqual(meta.retiredColumns?.map((c) => c.name), ['gone']);
        assert.deepEqual(meta.generatedFrom.versions, {
            'plugin:Alpha': { latest: '2.0', tags: 3 },
            'plugin:Beta': { latest: '0.1', tags: 1 },
            'plugin:Gamma': { unknown: true },
        });

        const md = renderMarkdown(meta);
        assert.match(md, /\| Vigencia \|/);
        assert.match(md, /Alpha ≤1\.0–1\.5 → Beta desde ≤0\.1/);
        assert.match(md, /## Columnas retiradas[\s\S]*`gone`/);
        assert.match(md, /sin publicar/);
        assert.match(md, /rango desconocido/);
    });
});

describe('renderMarkdown sin vigencia', () => {
    it('la metadata antigua se enseña igual que antes, sin columna Vigencia', () => {
        const md = renderMarkdown({
            name: 'x',
            table: 'x',
            endpoint: '/x',
            primaryKey: 'id',
            description: 'X.',
            source: 'core',
            columns: [{ name: 'id', sqlType: 'serial', tsType: 'number', nullable: false, isPrimaryKey: true, isReadonly: true, isRequired: false, label: 'id' }],
            relations: [],
            generatedFrom: { generatedAt: '2026-01-01T00:00:00Z' },
        });
        assert.match(md, /\| Campo \| Tipo \| Requerido \| Label \| Descripción \|/);
        assert.doesNotMatch(md, /Vigencia|retiradas|Versiones publicadas/);
    });
});
