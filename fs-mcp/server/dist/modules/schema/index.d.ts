/**
 * Schema Module - Tool describe_model para consultar metadata de modelos.
 *
 * Este tool duplica lo que exponen los MCP Resources (fs-schema://model/<name>)
 * para clientes MCP que prefieran invocar un tool antes que navegar resources,
 * y para que Claude pueda llamarlo directamente durante una tarea de reporting.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare function registerSchemaTools(tools: Map<string, Tool>): Promise<void>;
export declare function handleSchemaTool(name: string, input: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map