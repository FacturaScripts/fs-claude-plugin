/**
 * Handlers de MCP Resources para exponer la metadata de modelos de FacturaScripts.
 *
 * URIs soportadas:
 *   - fs-schema://models             → índice resumido de todos los modelos (JSON)
 *   - fs-schema://model/<name>       → metadata completa de un modelo (JSON)
 *   - fs-schema://model/<name>.md    → metadata completa en markdown (legible)
 *   - fs-schema://relations/<name>   → solo las relaciones del modelo (JSON)
 */
import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import type { ModelMetadata, Relation } from '../metadata/types.js';
/**
 * Lista todos los resources disponibles. Se invoca al responder al
 * ListResourcesRequestSchema.
 */
export declare function listSchemaResources(): Resource[];
/**
 * Lee un resource dado su URI. Devuelve null si el URI no corresponde a un
 * resource de schema (para que otros handlers lo puedan intentar).
 */
export declare function readSchemaResource(uri: string): {
    uri: string;
    mimeType: string;
    text: string;
} | null;
export declare function renderMarkdown(meta: ModelMetadata): string;
/**
 * Exporta un helper para que el tool `describe_model` reutilice la misma lógica.
 */
export declare function getModelMetadata(name: string): ModelMetadata | undefined;
export declare function getRelations(name: string): Relation[] | undefined;
//# sourceMappingURL=schema-resources.d.ts.map