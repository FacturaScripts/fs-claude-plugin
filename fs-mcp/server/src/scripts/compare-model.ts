/**
 * Compara un modelo del registry actual con su definición en una ruta fuente
 * (carpeta del core de FacturaScripts o carpeta de un plugin) y reporta:
 *   - columnas añadidas (en la fuente pero no en el registry)
 *   - columnas eliminadas (en el registry pero no en la fuente)
 *   - columnas con cambios (tipo, nullable o default distinto)
 *
 * Lo usa la skill `sync-models` para detectar cambios entre versiones.
 *
 * Uso:
 *   node dist/scripts/compare-model.js \
 *     --model=cliente \
 *     --source=/ruta/a/facturascripts \
 *     --type=core
 *
 *   node dist/scripts/compare-model.js \
 *     --model=task \
 *     --source=/ruta/a/Plugins/Forja \
 *     --type=private
 *
 * Output: JSON por stdout con la estructura de comparación.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { bootstrapCoreMetadata, getModelMetadata } from '../metadata/registry.js';
import { loadLocalModules } from '../local-loader.js';
import type { ColumnMetadata } from '../metadata/types.js';

interface SourceColumn {
    name: string;
    sqlType: string;
    nullable: boolean;
    default?: string;
    isPrimaryKey: boolean;
    foreignKey?: { table: string; column: string };
}

interface ChangedColumn {
    column: string;
    field: 'sqlType' | 'nullable' | 'default' | 'isPrimaryKey' | 'foreignKey';
    before: unknown;
    after: unknown;
}

interface CompareOutput {
    model: string;
    type: 'core' | 'private';
    sourcePath: string;
    inRegistry: boolean;
    inSource: boolean;
    registryTable?: string;
    sourceTable?: string;
    summary: {
        added: number;
        removed: number;
        changed: number;
        unchanged: number;
    };
    added: SourceColumn[];
    removed: ColumnMetadata[];
    changed: ChangedColumn[];
    unchanged: string[];
    suggestedTableEntry?: {
        name: string;
        table: string;
        endpointHint: string;
        editViewHint?: string;
        primaryKey: string;
    };
    note?: string;
}

// ───────────────────────────────────────────────────────────────────────────
// Args
// ───────────────────────────────────────────────────────────────────────────

interface Args {
    model: string;
    source: string;
    type: 'core' | 'private';
}

function parseArgs(): Args {
    const args: Record<string, string> = {};
    for (const arg of process.argv.slice(2)) {
        const m = arg.match(/^--([^=]+)=(.*)$/);
        if (m && m[1]) args[m[1]] = m[2] ?? '';
    }
    if (!args['model']) die('Falta --model=<nombre_modelo>');
    if (!args['source']) die('Falta --source=<ruta>');
    if (args['type'] !== 'core' && args['type'] !== 'private') {
        die('--type debe ser "core" o "private"');
    }
    return { model: args['model'], source: args['source'], type: args['type'] };
}

function die(msg: string): never {
    console.error(`Error: ${msg}`);
    process.exit(1);
}

// ───────────────────────────────────────────────────────────────────────────
// Parsers (mismos patrones que generate-metadata, simplificados)
// ───────────────────────────────────────────────────────────────────────────

function parseTableXml(xml: string): { columns: SourceColumn[]; primaryKey: string[] } {
    const columns: SourceColumn[] = [];
    const fkByCol = new Map<string, { table: string; column: string }>();
    const primaryKey: string[] = [];

    for (const m of xml.matchAll(/<column>([\s\S]*?)<\/column>/g)) {
        const body = m[1] ?? '';
        const nameMatch = body.match(/<name>([^<]+)<\/name>/);
        const typeMatch = body.match(/<type>([^<]+)<\/type>/);
        if (!nameMatch?.[1] || !typeMatch?.[1]) continue;
        const nullMatch = body.match(/<null>([^<]+)<\/null>/);
        const defaultMatch = body.match(/<default>([^<]*)<\/default>/);
        const col: SourceColumn = {
            name: nameMatch[1].trim(),
            sqlType: typeMatch[1].trim(),
            nullable: !(nullMatch && nullMatch[1]?.trim().toUpperCase() === 'NO'),
            isPrimaryKey: false,
        };
        if (defaultMatch && defaultMatch[1] !== undefined) col.default = defaultMatch[1].trim();
        columns.push(col);
    }

    for (const m of xml.matchAll(/<constraint>([\s\S]*?)<\/constraint>/g)) {
        const body = m[1] ?? '';
        const typeMatch = body.match(/<type>([^<]+)<\/type>/);
        const def = typeMatch?.[1]?.trim();
        if (!def) continue;

        const pk = def.match(/^PRIMARY\s+KEY\s*\(([^)]+)\)/i);
        if (pk?.[1]) {
            primaryKey.push(...pk[1].split(',').map((s) => s.trim()));
            continue;
        }

        const fk = def.match(
            /^FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+(\w+)\s*\(([^)]+)\)/i,
        );
        if (fk?.[1] && fk[2] && fk[3]) {
            fkByCol.set(fk[1].trim(), { table: fk[2].trim(), column: fk[3].trim() });
        }
    }

    for (const c of columns) {
        if (primaryKey.includes(c.name)) c.isPrimaryKey = true;
        const fk = fkByCol.get(c.name);
        if (fk) c.foreignKey = fk;
    }

    return { columns, primaryKey };
}

// ───────────────────────────────────────────────────────────────────────────
// Heurística para sugerir tableName y endpoint en modelos nuevos
// ───────────────────────────────────────────────────────────────────────────

function findTableXmlPath(sourceRoot: string, type: 'core' | 'private', modelName: string): string | undefined {
    const tablesDir = type === 'core'
        ? join(sourceRoot, 'Core', 'Table')
        : join(sourceRoot, 'Table');

    if (!existsSync(tablesDir)) return undefined;

    const candidates = candidateTableNames(modelName);
    for (const tname of candidates) {
        const path = join(tablesDir, `${tname}.xml`);
        if (existsSync(path)) return path;
    }
    return undefined;
}

/**
 * Heurísticas para mapear el snake_case singular del modelo a posibles nombres
 * de tabla en FacturaScripts (que suelen ser plurales sin guiones bajos).
 *   cliente              → clientes
 *   producto             → productos
 *   factura_cliente      → facturascli, facturas_cli, factura_cliente
 *   linea_factura_cliente → lineasfacturascli, lineas_facturas_cli
 *   cuenta_banco_cliente → cuentasbcocli
 */
function candidateTableNames(modelName: string): string[] {
    const candidates = new Set<string>();
    candidates.add(modelName);
    candidates.add(modelName + 's');
    candidates.add(modelName.replace(/_/g, ''));
    candidates.add(modelName.replace(/_/g, '') + 's');

    // pluralizar la primera palabra: cliente_x → clientes_x
    const parts = modelName.split('_');
    if (parts.length > 1) {
        candidates.add(parts.map((p, i) => (i === 0 ? p + 's' : p)).join('_'));
        candidates.add(parts.map((p, i) => (i === 0 ? p + 's' : p)).join(''));
    }

    // sustituciones típicas de FS
    candidates.add(modelName.replace('_cliente', 'cli').replace('_proveedor', 'prov'));
    candidates.add(modelName.replace('_cliente', 'scli').replace('_proveedor', 'sprov'));
    candidates.add(modelName.replace('linea_', 'lineas').replace('_cliente', 'cli').replace('_proveedor', 'prov'));

    return [...candidates];
}

function suggestEditViewName(modelName: string): string {
    return 'Edit' + modelName.split('_').map((p) => p[0]?.toUpperCase() + p.slice(1)).join('');
}

function suggestEndpoint(tableName: string): string {
    return '/' + tableName.replace(/_/g, '');
}

// ───────────────────────────────────────────────────────────────────────────
// Main
// ───────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    const args = parseArgs();

    // Cargar registry: core + privados (necesario para conocer el estado actual).
    await bootstrapCoreMetadata();
    const dummyTools = new Map();
    await loadLocalModules(dummyTools);

    const currentMeta = getModelMetadata(args.model);
    const inRegistry = currentMeta !== undefined;

    // Resolver el XML de la tabla en la fuente. Si el modelo está en el
    // registry, usamos su `table`. Si no, hacemos heurística.
    let xmlPath: string | undefined;
    let resolvedTable: string | undefined;
    if (inRegistry) {
        const tablePath = args.type === 'core'
            ? join(args.source, 'Core', 'Table', `${currentMeta!.table}.xml`)
            : join(args.source, 'Table', `${currentMeta!.table}.xml`);
        if (existsSync(tablePath)) {
            xmlPath = tablePath;
            resolvedTable = currentMeta!.table;
        }
    }
    if (!xmlPath) {
        xmlPath = findTableXmlPath(args.source, args.type, args.model);
        if (xmlPath) {
            resolvedTable = xmlPath.split('/').pop()!.replace(/\.xml$/, '');
        }
    }

    const output: CompareOutput = {
        model: args.model,
        type: args.type,
        sourcePath: args.source,
        inRegistry,
        inSource: xmlPath !== undefined,
        summary: { added: 0, removed: 0, changed: 0, unchanged: 0 },
        added: [],
        removed: [],
        changed: [],
        unchanged: [],
    };
    if (resolvedTable) output.sourceTable = resolvedTable;
    if (currentMeta) output.registryTable = currentMeta.table;

    if (!xmlPath || !resolvedTable) {
        output.note = `No se encontró Table/${args.model}.xml ni variantes plausibles en ${args.source}. Si el modelo es nuevo, comprueba que la ruta es correcta y que el plugin/core contiene la tabla.`;
        emit(output);
        return;
    }

    // Parsear el XML de la fuente
    const xml = readFileSync(xmlPath, 'utf8');
    const sourceParsed = parseTableXml(xml);

    if (!inRegistry) {
        // Modelo NUEVO: todas las columnas son "added"
        output.added = sourceParsed.columns;
        output.summary.added = sourceParsed.columns.length;
        const editView = suggestEditViewName(args.model);
        const editViewPath = args.type === 'core'
            ? join(args.source, 'Core', 'XMLView', `${editView}.xml`)
            : join(args.source, 'XMLView', `${editView}.xml`);
        const tableEntry: NonNullable<CompareOutput['suggestedTableEntry']> = {
            name: args.model,
            table: resolvedTable,
            endpointHint: suggestEndpoint(resolvedTable),
            primaryKey: sourceParsed.primaryKey[0] ?? sourceParsed.columns[0]?.name ?? 'id',
        };
        if (existsSync(editViewPath)) tableEntry.editViewHint = editView;
        output.suggestedTableEntry = tableEntry;
        output.note = `Modelo nuevo: añade la entrada al MODEL_CATALOG (core) o al manifest.json (privado), redacta descripciones para todas las columnas y regenera.`;
        emit(output);
        return;
    }

    // Comparación: modelo presente en registry
    const currentByName = new Map(currentMeta!.columns.map((c) => [c.name, c]));
    const sourceByName = new Map(sourceParsed.columns.map((c) => [c.name, c]));

    for (const [name, src] of sourceByName) {
        const cur = currentByName.get(name);
        if (!cur) {
            output.added.push(src);
            continue;
        }
        const diffs: ChangedColumn[] = [];
        if (cur.sqlType !== src.sqlType) {
            diffs.push({ column: name, field: 'sqlType', before: cur.sqlType, after: src.sqlType });
        }
        if (cur.nullable !== src.nullable) {
            diffs.push({ column: name, field: 'nullable', before: cur.nullable, after: src.nullable });
        }
        const curDefault = cur.default !== undefined ? String(cur.default) : '';
        const srcDefault = src.default !== undefined ? String(src.default) : '';
        if (curDefault !== srcDefault) {
            diffs.push({ column: name, field: 'default', before: cur.default ?? null, after: src.default ?? null });
        }
        if (cur.isPrimaryKey !== src.isPrimaryKey) {
            diffs.push({ column: name, field: 'isPrimaryKey', before: cur.isPrimaryKey, after: src.isPrimaryKey });
        }
        const curFk = cur.foreignKey ? `${cur.foreignKey.table}.${cur.foreignKey.column}` : null;
        const srcFk = src.foreignKey ? `${src.foreignKey.table}.${src.foreignKey.column}` : null;
        if (curFk !== srcFk) {
            diffs.push({ column: name, field: 'foreignKey', before: curFk, after: srcFk });
        }
        if (diffs.length > 0) output.changed.push(...diffs);
        else output.unchanged.push(name);
    }

    for (const [name, cur] of currentByName) {
        if (!sourceByName.has(name)) output.removed.push(cur);
    }

    output.summary = {
        added: output.added.length,
        removed: output.removed.length,
        changed: output.changed.length,
        unchanged: output.unchanged.length,
    };

    emit(output);
}

function emit(output: CompareOutput): void {
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
