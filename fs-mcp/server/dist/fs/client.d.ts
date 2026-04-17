/**
 * Cliente HTTP para la API REST de FacturaScripts
 * Soporta múltiples conexiones y manejo de errores contextualizado
 */
declare class FacturaScriptsClient {
    private defaultConnectionKey;
    private axiosInstances;
    /**
     * Inicializa el cliente con una conexión por defecto opcional
     * @param connectionKey - Clave de la conexión a usar por defecto
     */
    constructor(connectionKey?: string);
    /**
     * Obtiene o crea una instancia de Axios configurada para una conexión
     * @param connectionKey - Clave de la conexión (usa default del ConnectionManager si no se proporciona)
     * @returns Instancia de Axios configurada
     */
    private getAxiosInstance;
    /**
     * Realiza una petición GET a la API de FacturaScripts
     * @param endpoint - Ruta del endpoint (ej: "clientes")
     * @param params - Parámetros de query opcionales
     * @param connectionKey - Clave de conexión opcional
     * @returns Datos de tipo T
     */
    get<T>(endpoint: string, params?: Record<string, unknown>, connectionKey?: string): Promise<T>;
    /**
     * Realiza una petición POST a la API de FacturaScripts
     * @param endpoint - Ruta del endpoint
     * @param data - Datos a enviar en el body
     * @param connectionKey - Clave de conexión opcional
     * @returns Respuesta de tipo T
     */
    post<T>(endpoint: string, data: unknown, connectionKey?: string): Promise<T>;
    /**
     * Realiza una petición PUT a la API de FacturaScripts
     * @param endpoint - Ruta del endpoint
     * @param data - Datos a actualizar
     * @param connectionKey - Clave de conexión opcional
     * @returns Respuesta de tipo T
     */
    put<T>(endpoint: string, data: unknown, connectionKey?: string): Promise<T>;
    /**
     * Realiza una petición DELETE a la API de FacturaScripts
     * @param endpoint - Ruta del endpoint
     * @param connectionKey - Clave de conexión opcional
     * @returns Respuesta de tipo T
     */
    delete<T>(endpoint: string, connectionKey?: string): Promise<T>;
    /**
     * Limpia el caché de instancias de Axios
     * Útil para refrescar credenciales o cambios de configuración
     */
    clearCache(): void;
}
/**
 * Instancia singleton del cliente de FacturaScripts
 */
export declare const fsClient: FacturaScriptsClient;
export default fsClient;
//# sourceMappingURL=client.d.ts.map