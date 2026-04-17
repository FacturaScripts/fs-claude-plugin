/**
 * Core Business Module - Tools para gestión de datos maestros de FacturaScripts
 * Incluye: Clientes, Proveedores, Productos, Familias, Fabricantes, Almacenes, etc.
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const coreBusinessTools: Tool[];
export declare const coreBusinessWriteTools: Tool[];
/**
 * Register all core business tools with the MCP server
 */
export declare function registerCoreBusinessTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Handle core business tool calls
 */
export declare function handleCoreBusinessTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map