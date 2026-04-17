/**
 * Analytics Module - Advanced analytics tools for FacturaScripts
 * Provides tools for analyzing customer behavior, product sales, billing trends, and business metrics
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const analyticsTools: Tool[];
/**
 * Register all analytics tools with the MCP server
 */
export declare function registerAnalyticsTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Handle analytics tool calls
 */
export declare function handleAnalyticsTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=index.d.ts.map