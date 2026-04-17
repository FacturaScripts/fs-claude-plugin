/**
 * Configuration Module for FacturaScripts MCP Server
 * Provides tools for accessing system configuration and settings
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
/**
 * Register all configuration tools with the MCP server
 */
export declare function registerConfigurationTools(server: Server, tools: Map<string, Tool>): Promise<void>;
//# sourceMappingURL=index.d.ts.map