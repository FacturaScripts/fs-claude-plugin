/**
 * Tipos de las conexiones guardadas en el archivo compartido `~/.fs-ai.json`.
 *
 * El archivo lo comparten fs-mcp y fs-forja: fs-mcp usa las conexiones de tipo `api` y fs-forja, solo las de tipo
 * `forja`. Las conexiones sin `type` son de tipo `api`.
 */
/**
 * Tipos de conexión que puede haber en el archivo.
 *
 * - `api`: API REST estándar de una instalación de FacturaScripts (`/api/3`); la usa fs-mcp.
 * - `forja`: API de autor de facturascripts.com (`/api/3/forja`), autenticada con `X-Forja-Token`; la usa fs-forja.
 */
export type ConnectionType = 'api' | 'forja';
/**
 * Configuración de una conexión.
 */
export interface ConnectionConfig {
    /** Nombre descriptivo de la conexión. */
    name: string;
    /** URL base de la web, sin `/api/3` ni `/api/3/forja`. */
    url: string;
    /** Token de autor de la forja (o de la API estándar en las conexiones `api`). */
    token: string;
    /** Tipo de conexión; si se omite se trata como `api`. */
    type?: ConnectionType;
    /** Versión de FacturaScripts (informativa). */
    version?: string;
    /** Si es `false`, acepta certificados HTTPS autofirmados o no verificables. */
    rejectUnauthorized?: boolean;
}
/**
 * Bloque `connections` del archivo: conexión por defecto (de fs-mcp) y mapa de conexiones.
 */
export interface ConnectionsConfig {
    /** Clave de la conexión por defecto de fs-mcp; fs-forja nunca la cambia. */
    default: string;
    /** Conexiones configuradas, por clave. */
    connections: Record<string, ConnectionConfig>;
}
//# sourceMappingURL=connections.d.ts.map