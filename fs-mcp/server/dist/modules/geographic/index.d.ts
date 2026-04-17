/**
 * Geographic Module for FacturaScripts MCP Server
 * Provides tools for accessing geographic and location data
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const geographicTools: Tool[];
export declare const geographicWriteTools: Tool[];
/**
 * Register all geographic tools with the MCP server
 */
export declare function registerGeographicTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Handle geographic tool calls
 */
export declare function handleGeographicTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map