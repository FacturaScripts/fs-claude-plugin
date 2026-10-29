import type { ConnectionConfig, ConnectionType } from "./types/facturascripts.js";
/**
 * Normaliza la URL base de una instalación: quita las barras finales y, si se ha pegado la URL de la API,
 * su ruta final (`/api/3` o `/api/3/forja`), porque los clientes ya la añaden por su cuenta.
 *
 * @param url - URL indicada por el usuario o guardada en el archivo de conexiones
 * @returns URL base sin barra final, por ejemplo `https://facturascripts.com`
 */
export declare function normalizeBaseUrl(url: string): string;
/**
 * Gestor centralizado de conexiones multi-instancia a FacturaScripts
 * Lee y persiste configuración desde/hacia archivo JSON
 *
 * Prioridad de ubicación:
 * 1. ~/.fs-claude.json (automático, cross-platform, sin configuración necesaria)
 * 2. FS_CONNECTIONS_FILE env var (compatibilidad con configuraciones existentes)
 */
declare class ConnectionManager {
    private connectionsPath;
    private useFsClaudeFormat;
    private config;
    constructor();
    /**
     * Carga las conexiones desde el archivo JSON.
     * Si el archivo no existe, crea uno vacío y continúa sin lanzar error.
     * El servidor arranca siempre; el error se produce al intentar usar una conexión.
     */
    private loadConnections;
    /**
     * Crea el archivo de conexiones vacío con la estructura adecuada al formato
     */
    private createEmptyConnectionsFile;
    /**
     * Persiste la configuración actual al archivo JSON
     */
    private saveConnections;
    /**
     * Obtiene una conexión por clave o la conexión por defecto
     * @param key - Clave de la conexión (opcional, usa default si no se proporciona)
     * @returns Configuración de la conexión
     * @throws Error si la conexión no existe
     */
    getConnection(key?: string): ConnectionConfig;
    /**
     * Lista todas las conexiones disponibles
     * @returns Array de objetos con información resumida de cada conexión
     */
    listConnections(): Array<{
        key: string;
        name: string;
        url: string;
        type: ConnectionType;
        isDefault: boolean;
    }>;
    /**
     * Devuelve la clave de la primera conexión configurada de un tipo concreto.
     * Las conexiones sin `type` se consideran de tipo `api`.
     * @param type - Tipo de conexión buscado
     * @returns Clave de la conexión o undefined si no hay ninguna de ese tipo
     */
    findFirstKeyByType(type: ConnectionType): string | undefined;
    /**
     * Añade una conexión o, si se indica `overwrite`, sustituye la que tenga la misma clave.
     * La URL se guarda normalizada con `normalizeBaseUrl`.
     * @param key - Identificador único de la conexión
     * @param config - Configuración de la conexión
     * @param overwrite - Permite sustituir una conexión existente con la misma clave (por defecto, false)
     * @throws Error si la clave ya existe y no se permite sobrescribir, o si faltan datos
     */
    addConnection(key: string, config: ConnectionConfig, overwrite?: boolean): void;
    /**
     * Establece la conexión por defecto
     * @param key - Clave de la conexión a establecer como predeterminada
     * @throws Error si la conexión no existe
     */
    setDefault(key: string): void;
}
/**
 * Instancia singleton del gestor de conexiones
 */
export declare const connectionManager: ConnectionManager;
export default connectionManager;
//# sourceMappingURL=connection-manager.d.ts.map