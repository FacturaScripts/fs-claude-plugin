/**
 * Geographic Module for FacturaScripts MCP Server
 * Provides tools for accessing geographic and location data
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
/**
 * Register all geographic tools with the MCP server
 */
export declare function registerGeographicTools(server: Server, tools: Map<string, Tool>): Promise<void>;
//# sourceMappingURL=index.d.ts.map