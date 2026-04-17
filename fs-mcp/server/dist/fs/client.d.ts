/**
 * Cliente HTTP para la API REST de FacturaScripts
 * Soporta múltiples conexiones y manejo de errores contextualizado
 */
declare class FacturaScriptsClient {
    private defaultConnectionKey;
    private axiosInstances;
    constructor(connectionKey?: string);
    private getAxiosInstance;
    /**
     * Serializa un objeto a URLSearchParams para application/x-www-form-urlencoded.
     * La API REST de FacturaScripts requiere este formato en POST y PUT.
     * Los valores null/undefined se omiten; los booleanos se convierten a 0/1.
     */
    private toFormData;
    /**
     * Realiza una petición GET a la API de FacturaScripts
     */
    get<T>(endpoint: string, params?: Record<string, unknown>, connectionKey?: string): Promise<T>;
    /**
     * Realiza una petición POST a la API de FacturaScripts.
     * Envía los datos como application/x-www-form-urlencoded (requerido por FacturaScripts).
     */
    post<T>(endpoint: string, data: unknown, connectionKey?: string): Promise<T>;
    /**
     * Realiza una petición PUT a la API de FacturaScripts.
     * Envía los datos como application/x-www-form-urlencoded (requerido por FacturaScripts).
     * El ID del registro debe incluirse en la URL (ej: /clientes/CLI001).
     */
    put<T>(endpoint: string, data: unknown, connectionKey?: string): Promise<T>;
    /**
     * Realiza una petición DELETE a la API de FacturaScripts.
     * El ID del registro debe incluirse en la URL (ej: /clientes/CLI001).
     */
    delete<T>(endpoint: string, connectionKey?: string): Promise<T>;
    /**
     * Limpia el caché de instancias de Axios
     */
    clearCache(): void;
}
/**
 * Instancia singleton del cliente de FacturaScripts
 */
export declare const fsClient: FacturaScriptsClient;
export default fsClient;
//# sourceMappingURL=client.d.ts.map