/**
 * Configuration Module for FacturaScripts MCP Server
 * Provides tools for accessing system configuration and settings
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const configurationTools: Tool[];
export declare const configurationWriteTools: Tool[];
/**
 * Register all configuration tools with the MCP server
 */
export declare function registerConfigurationTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Handle configuration tool calls
 */
export declare function handleConfigurationTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map