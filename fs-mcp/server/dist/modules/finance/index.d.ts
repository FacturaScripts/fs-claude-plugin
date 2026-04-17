import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const financeTools: Tool[];
export declare const financeWriteTools: Tool[];
/**
 * Register all finance tools with the MCP server
 */
export declare function registerFinanceTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Handle finance tool calls
 */
export declare function handleFinanceTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map