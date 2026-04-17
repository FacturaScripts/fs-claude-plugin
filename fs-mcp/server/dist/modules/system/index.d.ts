/**
 * System Module for FacturaScripts MCP Server
 * Provides tools for accessing system logs, tasks, and events
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const systemTools: Tool[];
export declare const systemWriteTools: Tool[];
/**
 * Register all system tools with the MCP server
 */
export declare function registerSystemTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Handle system tool calls
 */
export declare function handleSystemTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map