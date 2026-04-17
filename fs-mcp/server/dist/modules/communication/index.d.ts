/**
 * Communication Module for FacturaScripts MCP Server
 * Provides tools for accessing communication and notification data
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const communicationTools: Tool[];
export declare const communicationWriteTools: Tool[];
/**
 * Register all communication tools with the MCP server
 */
export declare function registerCommunicationTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Handle communication tool calls
 */
export declare function handleCommunicationTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map