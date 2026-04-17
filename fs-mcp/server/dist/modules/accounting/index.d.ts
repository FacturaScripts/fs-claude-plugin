import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const accountingTools: Tool[];
export declare const accountingWriteTools: Tool[];
/**
 * Register all accounting tools with the MCP server
 */
export declare function registerAccountingTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Handle accounting tool calls
 */
export declare function handleAccountingTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map