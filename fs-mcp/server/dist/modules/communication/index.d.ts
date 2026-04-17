/**
 * Communication Module for FacturaScripts MCP Server
 * Provides tools for accessing communication and notification data
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
/**
 * Register all communication tools with the MCP server
 */
export declare function registerCommunicationTools(server: Server, tools: Map<string, Tool>): Promise<void>;
//# sourceMappingURL=index.d.ts.map