import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const purchasingTools: Tool[];
export declare const purchasingWriteTools: Tool[];
/**
 * Register all purchasing tools with the MCP server
 */
export declare function registerPurchasingTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Handle purchasing tool calls
 */
export declare function handlePurchasingTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map