/**
 * Contrato de los plugins oficiales de FacturaScripts que incluye fs-mcp.
 *
 * Cada plugin oficial (Servicios, Proyectos...) vive en su propia carpeta de
 * `src/plugins/<plugin>/`, separado de los módulos del core, y se registra en
 * `src/plugins/index.ts`. Aporta:
 *   - La metadata de sus modelos, generada desde sus `Table/*.xml` con
 *     `generate-metadata` en modo plugin oficial (`format: "ts"`).
 *   - Sus tools y el handler que las ejecuta contra la API REST del ERP.
 *
 * Las tools de un plugin funcionan con cualquier conexión: si la instalación no
 * tiene el plugin activo, la API responde que el recurso no existe y el error
 * lo indica (ver `shared/result.ts`).
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ModelMetadata } from '../metadata/types.js';

/**
 * Resultado de una tool en el formato del protocolo MCP.
 */
export type ToolResult = { content: [{ type: 'text'; text: string }]; isError?: boolean };

/**
 * Argumentos de una llamada a una tool.
 */
export type ToolArgs = Record<string, unknown>;

/**
 * Plugin oficial de FacturaScripts integrado en fs-mcp.
 */
export interface OfficialPlugin {
    /** Nombre del plugin en FacturaScripts (su carpeta en Plugins/). */
    name: string;
    /** Qué cubre la integración, para los registros del arranque. */
    description: string;
    /** Metadata de los modelos del plugin. */
    models: ModelMetadata[];
    /** Tools que expone el plugin. */
    tools: Tool[];
    /**
     * Modelo de la metadata que hay detrás de cada tool. Con él se completan los
     * esquemas (descripciones, enums) y se añaden los filtros de rango de fecha
     * a las tools `get_*` de listado.
     */
    toolModels: Record<string, string>;
    /**
     * Ejecuta una tool del plugin. Devuelve null si la tool no es suya.
     */
    handleTool(name: string, args: ToolArgs): Promise<ToolResult | null>;
}
