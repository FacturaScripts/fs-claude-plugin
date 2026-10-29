/**
 * Cliente HTTP de la API de autor de Forja (facturascripts.com).
 *
 * La API vive en `<url>/api/3/forja` y se autentica con la cabecera `X-Forja-Token`, usando el token de autor
 * que cada contacto con el acuerdo de proveedor vigente obtiene en la pestaña «avanzado» de PortalForja.
 * A diferencia de la API REST estándar (`fs/client.ts`), envía JSON sin el envoltorio `filter[]`, sube
 * archivos en multipart y descarga binarios (zip de documentación) directamente a disco.
 */
import { Method } from "axios";
import type { ConnectionConfig } from "../types/facturascripts.js";
/**
 * Conexión de tipo forja ya resuelta, con su clave.
 */
export interface ResolvedForjaConnection {
    key: string;
    config: ConnectionConfig;
}
/**
 * Función que resuelve una clave de conexión (opcional) a una conexión de tipo forja.
 */
export type ForjaConnectionResolver = (key?: string) => ResolvedForjaConnection;
/**
 * Archivo local que se adjunta a una petición multipart.
 */
export interface ForjaUploadFile {
    /** Nombre del campo del formulario (por ejemplo `zip`, `docs` o `images[]`). */
    field: string;
    /** Ruta del archivo en disco. */
    path: string;
    /** Nombre con el que se envía; por defecto, el nombre del archivo. */
    filename?: string;
}
/**
 * Resultado de una descarga escrita en disco.
 */
export interface ForjaDownloadResult {
    /** Ruta absoluta del archivo escrito. */
    path: string;
    /** Tamaño en bytes. */
    bytes: number;
    /** Content-Type devuelto por el servidor, si lo hay. */
    contentType?: string;
}
/**
 * Error devuelto por la API de Forja, con el estado HTTP y el código `{code, message}` del servidor.
 */
export declare class ForjaApiError extends Error {
    /** Estado HTTP, o undefined si no hubo respuesta (error de red). */
    readonly status: number | undefined;
    /** Código de error que devuelve el servidor en el cuerpo, si lo hay. */
    readonly code: string | undefined;
    /**
     * @param message - Mensaje legible
     * @param status - Estado HTTP
     * @param code - Código de error del servidor
     */
    constructor(message: string, status?: number, code?: string);
}
/**
 * Resolución por defecto: la conexión indicada, que debe ser de tipo forja, o la primera conexión de tipo
 * forja configurada. Nunca usa la conexión por defecto global, que normalmente es de tipo api.
 *
 * @param key - Clave de la conexión (opcional)
 * @returns Conexión de tipo forja
 * @throws Error si la conexión no existe, no es de tipo forja o no hay ninguna de ese tipo
 */
export declare function resolveForjaConnection(key?: string): ResolvedForjaConnection;
/**
 * Cliente de la API de autor de Forja con soporte de varias conexiones de tipo forja.
 */
export declare class ForjaClient {
    private readonly resolver;
    private readonly instances;
    /**
     * @param resolver - Resolución de conexiones; por defecto, `resolveForjaConnection` sobre `~/.fs-claude.json`
     */
    constructor(resolver?: ForjaConnectionResolver);
    /**
     * Devuelve (y cachea) la instancia de axios de una conexión de tipo forja.
     *
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Instancia de axios configurada
     */
    private getInstance;
    /**
     * Ejecuta una petición y antepone el método y la ruta al mensaje de error.
     *
     * @param method - Método HTTP
     * @param endpoint - Ruta relativa a `/api/3/forja`
     * @param options - Opciones adicionales de axios
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Respuesta de axios
     */
    private request;
    /**
     * Petición GET que devuelve JSON. Los parámetros se envían tal cual en la query, sin `filter[]`.
     *
     * @param endpoint - Ruta relativa a `/api/3/forja`
     * @param params - Parámetros de la query; se omiten los vacíos
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Cuerpo de la respuesta
     */
    get<T = unknown>(endpoint: string, params?: Record<string, unknown>, connectionKey?: string): Promise<T>;
    /**
     * Envía un cuerpo JSON (POST, PATCH, PUT o DELETE).
     *
     * @param method - Método HTTP
     * @param endpoint - Ruta relativa a `/api/3/forja`
     * @param body - Cuerpo que se serializa como JSON (opcional)
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Cuerpo de la respuesta
     */
    sendJson<T = unknown>(method: Method, endpoint: string, body?: unknown, connectionKey?: string): Promise<T>;
    /**
     * Envía un formulario multipart con campos de texto y archivos locales.
     *
     * @param method - Método HTTP (normalmente POST)
     * @param endpoint - Ruta relativa a `/api/3/forja`
     * @param fields - Campos de texto; se omiten los vacíos
     * @param files - Archivos que se adjuntan
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Cuerpo de la respuesta
     */
    sendMultipart<T = unknown>(method: Method, endpoint: string, fields: Record<string, unknown>, files: ForjaUploadFile[], connectionKey?: string): Promise<T>;
    /**
     * Descarga un binario y lo escribe en disco, creando la carpeta de destino si no existe.
     *
     * @param endpoint - Ruta relativa a `/api/3/forja`
     * @param params - Parámetros de la query
     * @param outputFile - Ruta del archivo de salida
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Ruta, tamaño y tipo del archivo escrito
     */
    download(endpoint: string, params: Record<string, unknown> | undefined, outputFile: string, connectionKey?: string): Promise<ForjaDownloadResult>;
    /**
     * Limpia el caché de instancias de axios (por ejemplo, tras modificar una conexión).
     */
    clearCache(): void;
}
/**
 * Instancia singleton del cliente de Forja.
 */
export declare const forjaClient: ForjaClient;
export default forjaClient;
//# sourceMappingURL=forja-client.d.ts.map