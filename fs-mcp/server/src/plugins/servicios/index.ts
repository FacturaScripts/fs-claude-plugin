/**
 * Plugin oficial Servicios (SAT) de FacturaScripts.
 *
 * Cubre los servicios de asistencia técnica y sus trabajos, estados,
 * prioridades, tipos, máquinas, checklists de verificación e historial, más la
 * ficha completa de un servicio, el cambio de estado por nombre y los informes.
 */

import { buildResourceTools, handleResourceTool, resourceToolModels } from '../shared/resource.js';
import { failFromError } from '../shared/result.js';
import type { OfficialPlugin, ToolArgs, ToolResult } from '../types.js';
import { models } from './metadata/index.js';
import { PLUGIN, RESOURCES } from './resources.js';
import { handleServiciosTool, SERVICIOS_TOOLS } from './tools.js';

const tools = [...RESOURCES.flatMap(buildResourceTools), ...SERVICIOS_TOOLS];
const toolNames = new Set(tools.map((tool) => tool.name));

export const serviciosPlugin: OfficialPlugin = {
    name: PLUGIN,
    description: 'Servicios de asistencia técnica (SAT), trabajos, máquinas, checklists e informes',
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
            return await handleServiciosTool(name, args);
        } catch (error) {
            return failFromError(PLUGIN, name, error);
        }
    },
};
