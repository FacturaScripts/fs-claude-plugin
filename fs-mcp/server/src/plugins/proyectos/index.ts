/**
 * Plugin oficial Proyectos de FacturaScripts.
 *
 * Cubre los proyectos y sus tareas, fases, estados, notas, usuarios y stock,
 * los documentos de compra y venta y los asientos vinculados, los archivos del
 * proyecto y de sus tareas, los recibos de sus facturas, la configuración del
 * plugin, los cambios de estado y de fase por nombre y los informes de
 * proyectos, rentabilidad y tareas.
 */

import { buildResourceTools, handleResourceTool, resourceToolModels } from '../shared/resource.js';
import { failFromError } from '../shared/result.js';
import type { OfficialPlugin, ToolArgs, ToolResult } from '../types.js';
import { models } from './metadata/index.js';
import { PLUGIN, RESOURCES } from './resources.js';
import { handleProyectosTool, PROYECTOS_TOOLS } from './tools.js';

const tools = [...RESOURCES.flatMap(buildResourceTools), ...PROYECTOS_TOOLS];
const toolNames = new Set(tools.map((tool) => tool.name));

export const proyectosPlugin: OfficialPlugin = {
    name: PLUGIN,
    description: 'Proyectos, tareas, documentos y asientos vinculados, archivos, recibos, configuración, rentabilidad e informes',
    models,
    tools,
    toolModels: Object.assign({}, ...RESOURCES.map(resourceToolModels)),
    async handleTool(name: string, args: ToolArgs): Promise<ToolResult | null> {
        if (!toolNames.has(name)) return null;
        try {
            for (const def of RESOURCES) {
                const result = await handleResourceTool(def, name, args);
                if (result) return result;
            }
            return await handleProyectosTool(name, args);
        } catch (error) {
            return failFromError(PLUGIN, name, error);
        }
    },
};
