/**
 * Plugin oficial CRM de FacturaScripts.
 *
 * Cubre las oportunidades de negocio y sus estados, notas, archivos y presupuestos,
 * las fuentes, intereses, listas y cargos de los contactos, la ficha CRM de un
 * contacto y los informes de oportunidades, avisos y seguimiento.
 */

import { buildResourceTools, handleResourceTool, resourceToolModels } from '../shared/resource.js';
import { failFromError } from '../shared/result.js';
import type { OfficialPlugin, ToolArgs, ToolResult } from '../types.js';
import { models } from './metadata/index.js';
import { PLUGIN, RESOURCES } from './resources.js';
import { CRM_TOOLS, handleCrmTool } from './tools.js';

const tools = [...RESOURCES.flatMap(buildResourceTools), ...CRM_TOOLS];
const toolNames = new Set(tools.map((tool) => tool.name));

export const crmPlugin: OfficialPlugin = {
    name: PLUGIN,
    description: 'Oportunidades, notas, archivos, presupuestos, fuentes, intereses, listas e informes',
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
            return await handleCrmTool(name, args);
        } catch (error) {
            return failFromError(PLUGIN, name, error);
        }
    },
};
