/**
 * Módulo Forja del servidor MCP de FacturaScripts.
 *
 * Herramientas `forja_*` para que el autor de un plugin publicado en facturascripts.com (o un miembro aceptado de su
 * equipo) lo gestione mediante la API de autor (`/api/3/forja`): datos e imágenes, traducciones, versiones,
 * publicaciones (noticias y documentación), informes de error e issues. Solo usan conexiones de tipo forja; por
 * defecto, la primera configurada.
 *
 * Además, forja_build_zip crea en local el zip de una versión de un plugin o del core (ver build-zip.ts),
 * forja_upload_build borra tras subirlo los zips que creó esa herramienta, salvo que se pida conservarlos, y
 * forja_publish_doc_page publica una página de Doc/User o Doc/Dev como publicación (ver doc-page.ts).
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
/** Resultado que devuelve cada herramienta al servidor MCP. */
type ToolResult = {
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
};
export declare const forjaTools: Tool[];
/**
 * Registra las herramientas del módulo Forja.
 *
 * @param tools - Mapa de herramientas del servidor MCP
 */
export declare function registerForjaTools(tools: Map<string, Tool>): Promise<void>;
/**
 * Atiende una llamada a una herramienta `forja_*`.
 *
 * @param name - Nombre de la herramienta
 * @param args - Argumentos recibidos
 * @returns Resultado de la herramienta, o null si no pertenece a este módulo
 */
export declare function handleForjaTool(name: string, args: Record<string, unknown>): Promise<ToolResult | null>;
export {};
//# sourceMappingURL=index.d.ts.map