/**
 * Vigencia por versión de modelos y columnas.
 *
 * Responde a "¿para qué versión publicada es válida esta información?" leyendo
 * las tablas XML en cada tag del repositorio que las aporta (el core o un
 * plugin). Se lee de los objetos de git, nunca del árbol de trabajo, así que un
 * cambio sin publicar no se confunde con una versión.
 *
 * Decisiones que conviene no deshacer sin motivo:
 *
 *   - Barrido de TODOS los tags, no bisección. La bisección supone que una
 *     columna vive en un único intervalo; el barrido no supone nada y cuesta
 *     poco (todas las tablas del core en todos sus tags se leen en menos de un
 *     segundo, porque van en una sola llamada a `git cat-file --batch`).
 *   - La versión de cada tag es la que declara su código: `Kernel::version()` en
 *     el core y `version` del `facturascripts.ini` en un plugin, con el nombre
 *     del tag como respaldo. Se compara como decimal (2025.11 es anterior a
 *     2025.2), igual que hace el core.
 *   - Cuentan los tags cuya versión es menor o igual que la que declara HEAD.
 *     Se acota por versión y no por ascendencia porque una versión publicada
 *     puede vivir en una rama lateral (un parche sobre una versión anterior) y
 *     no ser ancestro de HEAD; aun así es historia publicada. Y si se genera
 *     desde un commit antiguo, las versiones posteriores siguen quedando fuera.
 *   - Sin historial no se inventa: el tramo sale como `unknown`.
 */
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { parseTableXml } from './table-xml.js';
const LAYOUTS = {
    core: {
        tables: 'Core/Table',
        versionFile: 'Core/Kernel.php',
        versionPattern: /function\s+version\s*\(\s*\)\s*:\s*float\s*\{\s*return\s+(\d+(?:\.\d+)?)\s*;/,
    },
    plugin: {
        tables: 'Table',
        extensions: 'Extension/Table',
        versionFile: 'facturascripts.ini',
        // Anclado al principio de línea: sin el ancla casa también con `min_version`.
        versionPattern: /^\s*version\s*=\s*['"]?(\d+(?:\.\d+)?)/m,
    },
};
const TAG_VERSION_PATTERN = /^v?(\d+(?:\.\d+)?)$/;
function git(cwd, args, input) {
    return execFileSync('git', args, {
        cwd,
        input,
        maxBuffer: 1024 * 1024 * 1024,
        stdio: ['pipe', 'pipe', 'ignore'],
    });
}
/**
 * Lee varios objetos de git en una sola llamada. Devuelve el contenido de cada
 * `<rev>:<ruta>` pedido, o undefined si no existe.
 */
function readBlobs(cwd, specs) {
    const result = new Map();
    if (specs.length === 0)
        return result;
    const out = git(cwd, ['cat-file', '--batch'], specs.join('\n') + '\n');
    let pos = 0;
    for (const spec of specs) {
        const eol = out.indexOf(0x0a, pos);
        const header = out.toString('utf8', pos, eol);
        pos = eol + 1;
        const size = header.endsWith(' missing') ? -1 : Number(header.split(' ')[2]);
        if (size < 0 || Number.isNaN(size)) {
            result.set(spec, undefined);
            continue;
        }
        result.set(spec, out.toString('utf8', pos, pos + size));
        pos += size + 1;
    }
    return result;
}
/** El directorio es la raíz de su propio repositorio git (no una carpeta dentro de otro). */
function isRepoRoot(dir) {
    try {
        const top = git(dir, ['rev-parse', '--show-toplevel']).toString('utf8').trim();
        return realpathSync(top) === realpathSync(dir);
    }
    catch {
        return false;
    }
}
/**
 * Las versiones publicadas de un repositorio hasta la que declara HEAD,
 * ordenadas como decimales. Un tag cuya versión no se puede leer ni deducir de
 * su nombre se omite. Si HEAD no declara versión, no hay tope.
 */
export function readTagVersions(dir, layout) {
    if (!isRepoRoot(dir))
        return [];
    const { versionFile, versionPattern } = LAYOUTS[layout];
    const tags = git(dir, ['tag']).toString('utf8').split('\n').filter(Boolean);
    const files = readBlobs(dir, [`HEAD:${versionFile}`, ...tags.map((tag) => `${tag}:${versionFile}`)]);
    const head = files.get(`HEAD:${versionFile}`)?.match(versionPattern)?.[1];
    const ceiling = head === undefined ? Infinity : Number.parseFloat(head);
    const versions = [];
    for (const tag of tags) {
        const declared = files.get(`${tag}:${versionFile}`)?.match(versionPattern)?.[1];
        const version = declared ?? tag.match(TAG_VERSION_PATTERN)?.[1];
        if (version === undefined)
            continue;
        const value = Number.parseFloat(version);
        if (value > ceiling)
            continue;
        versions.push({ tag, version, value });
    }
    return versions.sort((a, b) => a.value - b.value);
}
/**
 * Recorre las tablas (propias y extensiones) de un repositorio en todas sus
 * versiones publicadas.
 */
export function loadSourceHistory(dir, source, layout) {
    const versions = readTagVersions(dir, layout);
    const history = { source, versions, tables: new Map(), columns: new Map() };
    if (versions.length === 0)
        return history;
    const { tables: tablesDir, extensions } = LAYOUTS[layout];
    const dirs = extensions ? [tablesDir, extensions] : [tablesDir];
    const specs = [];
    versions.forEach(({ tag }, index) => {
        const paths = git(dir, ['ls-tree', '-r', '--name-only', tag, '--', ...dirs])
            .toString('utf8')
            .split('\n')
            .filter((p) => p.endsWith('.xml'));
        for (const path of paths) {
            const table = path.slice(path.lastIndexOf('/') + 1, -'.xml'.length);
            specs.push({ index, own: path.startsWith(`${tablesDir}/`), table, spec: `${tag}:${path}` });
        }
    });
    const blobs = readBlobs(dir, specs.map((s) => s.spec));
    const empty = () => new Array(versions.length).fill(false);
    for (const { index, own, table, spec } of specs) {
        const xml = blobs.get(spec);
        if (xml === undefined)
            continue;
        if (own) {
            const present = history.tables.get(table) ?? empty();
            present[index] = true;
            history.tables.set(table, present);
        }
        const byColumn = history.columns.get(table) ?? new Map();
        history.columns.set(table, byColumn);
        for (const column of parseTableXml(xml).columns) {
            const entry = byColumn.get(column.name) ?? { present: empty(), last: column };
            entry.present[index] = true;
            entry.last = column; // las versiones se recorren en orden: queda la última
            byColumn.set(column.name, entry);
        }
    }
    return history;
}
/** Cada racha continua de presencia es un tramo. */
function spansOf(present, history) {
    const spans = [];
    const last = present.length - 1;
    for (let i = 0; i <= last; i++) {
        if (!present[i])
            continue;
        let j = i;
        while (j < last && present[j + 1])
            j++;
        const span = { source: history.source, since: history.versions[i].version };
        if (i === 0)
            span.sinceFirstTag = true;
        if (j < last)
            span.until = history.versions[j].version;
        spans.push(span);
        i = j;
    }
    return spans;
}
/** Primero los tramos cerrados y después los que siguen abiertos. */
function closedFirst(spans) {
    return [...spans].sort((a, b) => Number(a.until === undefined) - Number(b.until === undefined));
}
/**
 * Qué decir del estado actual según el historial de quien lo aporta: nada si
 * está en su última versión publicada, `unreleased` si no, y `unknown` si esa
 * fuente no tiene historial.
 */
function currentState(present, source, history) {
    if (!history || history.versions.length === 0)
        return [{ source, unknown: true }];
    if (present?.[present.length - 1])
        return [];
    return [{ source, unreleased: true }];
}
function historyOf(histories, source) {
    return histories.find((h) => h.source === source);
}
/**
 * Tramos de una columna. `current` es quien la aporta en el código generado; se
 * omite para una columna retirada.
 */
export function columnAvailability(table, column, histories, current) {
    const spans = [];
    for (const history of histories) {
        const entry = history.columns.get(table)?.get(column);
        if (entry)
            spans.push(...spansOf(entry.present, history));
    }
    if (current !== undefined) {
        const history = historyOf(histories, current);
        spans.push(...currentState(history?.columns.get(table)?.get(column)?.present, current, history));
    }
    return closedFirst(spans);
}
/** Tramos de la tabla de un modelo, según la fuente que la define. */
export function modelAvailability(table, owner, histories) {
    const history = historyOf(histories, owner);
    const present = history?.tables.get(table);
    const spans = history && present ? spansOf(present, history) : [];
    return closedFirst([...spans, ...currentState(present, owner, history)]);
}
/**
 * Columnas que alguna fuente tuvo en una versión publicada y ya no están en el
 * código generado, con su definición en la última versión que las tenía.
 */
export function retiredColumns(table, current, histories) {
    const last = new Map();
    for (const history of histories) {
        for (const [name, entry] of history.columns.get(table) ?? []) {
            if (!current.has(name))
                last.set(name, entry.last);
        }
    }
    return [...last.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, column]) => ({ column, availability: columnAvailability(table, name, histories) }));
}
/** El historial de cada fuente que aparece en unos tramos. */
export function versionsSummary(spans, histories) {
    const summary = {};
    for (const { source } of spans) {
        const history = historyOf(histories, source);
        const latest = history?.versions[history.versions.length - 1];
        summary[source] = latest ? { latest: latest.version, tags: history.versions.length } : { unknown: true };
    }
    return summary;
}
//# sourceMappingURL=availability.js.map