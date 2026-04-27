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
const registry = new Map();
/**
 * Registra (o reemplaza) la metadata de un modelo.
 * Devuelve true si se reemplazó un modelo existente, false si era nuevo.
 */
export function registerModelMetadata(meta) {
    const existed = registry.has(meta.name);
    registry.set(meta.name, meta);
    return existed;
}
/**
 * Recupera la metadata de un modelo por nombre.
 */
export function getModelMetadata(name) {
    return registry.get(name);
}
/**
 * Lista los nombres de todos los modelos registrados, ordenados alfabéticamente.
 */
export function getModelNames() {
    return [...registry.keys()].sort();
}
/**
 * Devuelve todos los modelos registrados, ordenados por nombre.
 */
export function getAllModelMetadata() {
    return getModelNames().map((n) => registry.get(n));
}
/**
 * Vacía el registry. Solo se usa en tests.
 */
export function clearRegistry() {
    registry.clear();
}
/**
 * Carga los modelos del core en el registry. Llamar una sola vez al arrancar.
 */
export async function bootstrapCoreMetadata() {
    const { modelMetadata } = await import('./index.js');
    let count = 0;
    for (const meta of Object.values(modelMetadata)) {
        registry.set(meta.name, meta);
        count += 1;
    }
    return count;
}
//# sourceMappingURL=registry.js.map