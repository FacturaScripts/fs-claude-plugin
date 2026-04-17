/**
 * System Module for FacturaScripts MCP Server
 * Provides tools for accessing system logs, tasks, and events
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
/**
 * Register all system tools with the MCP server
 */
export declare function registerSystemTools(server: Server, tools: Map<string, Tool>): Promise<void>;
//# sourceMappingURL=index.d.ts.map