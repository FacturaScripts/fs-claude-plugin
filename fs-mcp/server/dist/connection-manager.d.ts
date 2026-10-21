import type { ConnectionConfig } from "./types/facturascripts.js";
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
     * Persiste la configuración actual al archivo JSON.
     *
     * Si el archivo existe pero no es JSON válido, no se escribe: sobrescribirlo
     * borraría las conexiones (y los ajustes) que contiene y que no se pudieron leer.
     */
    private saveConnections;
    /**
     * Escribe el archivo de conexiones a través de un temporal en el mismo
     * directorio y un rename, para que una escritura interrumpida no lo deje a medias.
     * El rename sustituye el archivo por el temporal, con sus permisos: se crea
     * 0600 porque contiene los tokens de la API.
     */
    private writeFileAtomic;
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
        isDefault: boolean;
    }>;
    /**
     * Añade o actualiza una conexión
     * @param key - Identificador único de la conexión
     * @param config - Configuración de la conexión
     */
    addConnection(key: string, config: ConnectionConfig): void;
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