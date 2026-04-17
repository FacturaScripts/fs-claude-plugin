/**
 * Sales Orders Module - Tools para gestión de pedidos, presupuestos, albaranes y facturas
 * Incluye: Presupuestos, Pedidos, Albaranes, Facturas y Recibos de clientes
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const salesOrdersTools: Tool[];
export declare const salesOrdersWriteTools: Tool[];
/**
 * Register all sales orders tools with the MCP server
 */
export declare function registerSalesOrdersTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Handle sales orders tool calls
 */
export declare function handleSalesOrdersTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map