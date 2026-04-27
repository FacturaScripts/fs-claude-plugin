/**
 * Generador de metadata de modelos de FacturaScripts.
 *
 * Soporta dos modos:
 *
 *   1. Modo CORE (por defecto): lee Core/Table/*.xml, Core/XMLView/*.xml,
 *      Core/Translation/es_ES.json y escribe TS en server/src/metadata/models/.
 *      Estos archivos se commitean en el repo del MCP.
 *
 *      Uso:
 *        npm run generate:metadata -- --fs-path=/ruta/a/facturascripts [--only=cliente,producto]
 *
 *   2. Modo PLUGIN: genera metadata para los modelos de un plugin de FS y la
 *      escribe como JS en la ruta de módulos privados del usuario. Cada
 *      módulo privado pasa a tener un metadata.js que su index.js puede
 *      reexportar como `export const modelMetadata = [...]` para que el MCP
 *      lo registre dinámicamente al arrancar.
 *
 *      Uso (manifest):
 *        npm run generate:metadata -- --manifest=/ruta/manifest.json
 *
 *      Estructura del manifest.json:
 *        {
 *          "moduleName": "forja",
 *          "fsPath": "/Users/.../facturascripts",
 *          "pluginPath": "/Users/.../facturascripts/Plugins/Forja",
 *          "outputBase": "/Users/.../fs-mcp-modules-private",
 *          "models": [
 *            { "name": "task", "outputDir": "tasks", "table": "tasks",
 *              "endpoint": "/tasks", "editView": "CardTask",
 *              "description": "Tarea del plugin Forja..." }
 *          ]
 *        }
 *      Por cada modelo se escribe `<outputBase>/<outputDir>/metadata.js`.
 */
export {};
//# sourceMappingURL=generate-metadata.d.ts.map