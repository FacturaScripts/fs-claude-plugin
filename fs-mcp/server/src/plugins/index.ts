/**
 * Plugins oficiales de FacturaScripts integrados en fs-mcp.
 *
 * Cada plugin vive en su carpeta (`src/plugins/<plugin>/`) con su metadata, sus
 * tools y sus informes, separado de los módulos del core. Para añadir otro
 * plugin oficial:
 *   1. Crea `src/plugins/<plugin>/metadata/manifest.json` (format "ts") y su
 *      `descriptions.json`, y genera la metadata con generate-metadata.
 *   2. Declara sus modelos con `ResourceDef` (shared/resource.ts) y sus
 *      informes, y exporta un `OfficialPlugin` desde su index.ts.
 *   3. Añádelo a la lista OFFICIAL_PLUGINS de este archivo.
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { registerToolModel } from '../metadata/enrich.js';
import { registerModelMetadata } from '../metadata/registry.js';
import { crmPlugin } from './crm/index.js';
import { proyectosPlugin } from './proyectos/index.js';
import { serviciosPlugin } from './servicios/index.js';
import type { OfficialPlugin, ToolArgs, ToolResult } from './types.js';

/** Plugins oficiales incluidos en fs-mcp. */
export const OFFICIAL_PLUGINS: OfficialPlugin[] = [serviciosPlugin, proyectosPlugin, crmPlugin];

/**
 * Registra la metadata y las tools de todos los plugins oficiales. Hay que
 * llamarla después de cargar la metadata del core y antes de enriquecer las
 * tools, para que sus esquemas se completen con la metadata de sus modelos.
 *
 * @param tools mapa global de tools del servidor.
 * @returns número de tools registradas.
 */
export function registerOfficialPluginTools(tools: Map<string, Tool>): number {
    let count = 0;
    for (const plugin of OFFICIAL_PLUGINS) {
        for (const meta of plugin.models) {
            registerModelMetadata(meta);
        }
        for (const [tool, model] of Object.entries(plugin.toolModels)) {
            registerToolModel(tool, model);
        }
        for (const tool of plugin.tools) {
            if (tools.has(tool.name)) {
                console.error(`[fs-mcp] Plugin ${plugin.name}: la tool ${tool.name} ya existe y se sustituye.`);
            }
            tools.set(tool.name, tool);
            count += 1;
        }
        console.error(
            `[fs-mcp] Plugin oficial ${plugin.name}: ${plugin.tools.length} tools, ${plugin.models.length} modelos.`,
        );
    }
    return count;
}

/**
 * Nombres de las tools de los plugins oficiales.
 */
export function officialPluginToolNames(): Set<string> {
    return new Set(OFFICIAL_PLUGINS.flatMap((plugin) => plugin.tools.map((tool) => tool.name)));
}

/**
 * Ejecuta una tool de un plugin oficial. Devuelve null si ninguno la tiene.
 *
 * @param name nombre de la tool.
 * @param args argumentos de la llamada.
 */
export async function handleOfficialPluginTool(name: string, args: ToolArgs): Promise<ToolResult | null> {
    for (const plugin of OFFICIAL_PLUGINS) {
        const result = await plugin.handleTool(name, args);
        if (result) return result;
    }
    return null;
}
