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
export {};
//# sourceMappingURL=compare-model.d.ts.map