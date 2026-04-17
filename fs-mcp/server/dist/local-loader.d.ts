/**
 * Cargador dinámico de módulos locales privados.
 *
 * Lee módulos desde la ruta indicada por la variable de entorno FS_LOCAL_MODULES_PATH.
 * Si no está definida, intenta cargar desde dist/modules-local/ (útil en desarrollo local).
 *
 * Cada módulo debe ser una carpeta con un index.js que exporte:
 *   - registerTools(toolsMap: Map<string, Tool>): Promise<void>
 *   - handleTool(name: string, args: Record<string, unknown>, client: fsClient): Promise<ToolResult | null>
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
type ToolResult = {
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
};
/**
 * Interfaz que expone el handler de cada módulo local ya cargado.
 * El client queda capturado en el closure del loader.
 */
export interface LocalModuleHandler {
    handleTool(name: string, args: Record<string, unknown>): Promise<ToolResult | null>;
}
/**
 * Carga todos los módulos locales desde FS_LOCAL_MODULES_PATH (o fallback a dist/modules-local).
 * Registra sus tools en el mapa global y devuelve un array de handlers para el dispatcher.
 */
export declare function loadLocalModules(toolsMap: Map<string, Tool>): Promise<LocalModuleHandler[]>;
export {};
//# sourceMappingURL=local-loader.d.ts.map