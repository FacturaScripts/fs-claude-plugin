/**
 * Registry mutable de metadata de modelos.
 *
 * En el arranque del servidor:
 *   1. Se cargan los modelos del core (vía `bootstrapCoreMetadata`).
 *   2. Los módulos locales privados pueden añadir sus propios modelos
 *      llamando a `registerModelMetadata` desde el local-loader.
 *
 * Esto permite que cada usuario tenga su propia metadata en su ruta privada
 * sin tocar el repositorio del MCP.
 */
import type { ModelMetadata } from './types.js';
/**
 * Registra (o reemplaza) la metadata de un modelo.
 * Devuelve true si se reemplazó un modelo existente, false si era nuevo.
 */
export declare function registerModelMetadata(meta: ModelMetadata): boolean;
/**
 * Recupera la metadata de un modelo por nombre.
 */
export declare function getModelMetadata(name: string): ModelMetadata | undefined;
/**
 * Lista los nombres de todos los modelos registrados, ordenados alfabéticamente.
 */
export declare function getModelNames(): string[];
/**
 * Devuelve todos los modelos registrados, ordenados por nombre.
 */
export declare function getAllModelMetadata(): ModelMetadata[];
/**
 * Vacía el registry. Solo se usa en tests.
 */
export declare function clearRegistry(): void;
/**
 * Carga los modelos del core en el registry. Llamar una sola vez al arrancar.
 */
export declare function bootstrapCoreMetadata(): Promise<number>;
//# sourceMappingURL=registry.d.ts.map