/**
 * Lectura de las tablas XML de FacturaScripts (`Table/*.xml`, `Extension/Table/*.xml`).
 *
 * Vive aparte del generador porque lo usan dos sitios: el generador, para el estado
 * actual, y el cálculo de vigencia, para el mismo XML en cada versión publicada. Un
 * solo parser garantiza que los dos ven las mismas columnas.
 */
export function parseTableXml(xml) {
    const columns = [];
    const columnBlocks = xml.matchAll(/<column>([\s\S]*?)<\/column>/g);
    for (const block of columnBlocks) {
        const body = block[1] ?? '';
        const nameMatch = body.match(/<name>([^<]+)<\/name>/);
        const typeMatch = body.match(/<type>([^<]+)<\/type>/);
        if (!nameMatch || !typeMatch || !nameMatch[1] || !typeMatch[1])
            continue;
        const nullMatch = body.match(/<null>([^<]+)<\/null>/);
        const defaultMatch = body.match(/<default>([^<]*)<\/default>/);
        const col = {
            name: nameMatch[1].trim(),
            type: typeMatch[1].trim(),
            nullable: !(nullMatch && nullMatch[1]?.trim().toUpperCase() === 'NO'),
        };
        if (defaultMatch && defaultMatch[1] !== undefined) {
            col.default = defaultMatch[1].trim();
        }
        columns.push(col);
    }
    const primaryKey = [];
    const foreignKeys = [];
    const uniqueConstraints = [];
    const constraintBlocks = xml.matchAll(/<constraint>([\s\S]*?)<\/constraint>/g);
    for (const block of constraintBlocks) {
        const body = block[1] ?? '';
        const typeMatch = body.match(/<type>([^<]+)<\/type>/);
        const typeDef = typeMatch?.[1]?.trim();
        if (!typeDef)
            continue;
        const pkMatch = typeDef.match(/^PRIMARY\s+KEY\s*\(([^)]+)\)/i);
        if (pkMatch && pkMatch[1]) {
            primaryKey.push(...pkMatch[1].split(',').map((s) => s.trim()));
            continue;
        }
        const fkMatch = typeDef.match(/^FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+(\w+)\s*\(([^)]+)\)(?:\s+ON\s+DELETE\s+([A-Z\s]+?))?(?:\s+ON\s+UPDATE\s+([A-Z\s]+?))?\s*$/i);
        if (fkMatch && fkMatch[1] && fkMatch[2] && fkMatch[3]) {
            const localColumn = fkMatch[1].trim();
            const remoteTable = fkMatch[2].trim();
            const remoteColumn = fkMatch[3].trim();
            foreignKeys.push({
                localColumn,
                remoteTable,
                remoteColumn,
                onDelete: normalizeFkAction(fkMatch[4]),
                onUpdate: normalizeFkAction(fkMatch[5]),
            });
            continue;
        }
        const uniqMatch = typeDef.match(/^UNIQUE\s*\(([^)]+)\)/i);
        if (uniqMatch && uniqMatch[1]) {
            uniqueConstraints.push(uniqMatch[1].split(',').map((s) => s.trim()));
        }
    }
    return { columns, primaryKey, foreignKeys, uniqueConstraints };
}
function normalizeFkAction(raw) {
    if (!raw)
        return 'NO ACTION';
    const up = raw.trim().toUpperCase().replace(/\s+/g, ' ');
    if (up === 'SET NULL' || up === 'CASCADE' || up === 'RESTRICT' || up === 'NO ACTION') {
        return up;
    }
    return 'NO ACTION';
}
//# sourceMappingURL=table-xml.js.map