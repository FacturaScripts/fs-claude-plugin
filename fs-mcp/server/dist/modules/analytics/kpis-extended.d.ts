/**
 * KPIs avanzados de FacturaScripts.
 *
 * Cada KPI es una tool MCP autosuficiente: recibe la conexión + parámetros y
 * devuelve datos ya agregados. Todos usan `fetchAllPaginated` para garantizar
 * que ven el universo completo de datos sin truncamiento.
 *
 * Las definiciones de negocio que aplican van comentadas en cada handler.
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const extendedAnalyticsTools: Tool[];
export declare function handleExtendedAnalyticsTool(name: string, args: Record<string, unknown>): Promise<{
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
} | null>;
//# sourceMappingURL=kpis-extended.d.ts.map