/**
 * Vuelca a un JSON todas las descripciones actuales de todas las columnas
 * de todos los modelos (core + privados). Útil para identificar descripciones
 * genéricas que merece la pena reescribir manualmente.
 *
 * Uso:
 *   node dist/scripts/dump-all-descriptions.js
 *
 * Output: /tmp/all-descriptions-dump.json
 */
import { writeFile } from 'node:fs/promises';
import { bootstrapCoreMetadata, getAllModelMetadata } from '../metadata/registry.js';
import { loadLocalModules } from '../local-loader.js';
async function main() {
    await bootstrapCoreMetadata();
    const dummyTools = new Map();
    await loadLocalModules(dummyTools);
    const models = getAllModelMetadata();
    // Volcado simple: { modelo: { campo: descripción_actual } }
    const dump = {};
    let total = 0;
    let generic = 0; // las "Referencia a X.Y."
    for (const meta of models) {
        dump[meta.name] = {};
        for (const col of meta.columns) {
            total += 1;
            const desc = col.description ?? null;
            dump[meta.name][col.name] = desc;
            if (desc && /^Referencia a [a-z_]+\.[a-z_]+\.$/.test(desc)) {
                generic += 1;
            }
        }
    }
    await writeFile('/tmp/all-descriptions-dump.json', JSON.stringify(dump, null, 2), 'utf8');
    console.log(`Total columnas: ${total}`);
    console.log(`Descripciones genéricas "Referencia a X.Y.": ${generic} (${((generic / total) * 100).toFixed(1)}%)`);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=dump-all-descriptions.js.map