import axios from "axios";
import { connectionManager } from "../connection-manager.js";
/**
 * Cliente HTTP para la API REST de FacturaScripts
 * Soporta múltiples conexiones y manejo de errores contextualizado
 */
class FacturaScriptsClient {
    defaultConnectionKey;
    axiosInstances = new Map();
    /**
     * Inicializa el cliente con una conexión por defecto opcional
     * @param connectionKey - Clave de la conexión a usar por defecto
     */
    constructor(connectionKey) {
        this.defaultConnectionKey = connectionKey;
    }
    /**
     * Obtiene o crea una instancia de Axios configurada para una conexión
     * @param connectionKey - Clave de la conexión (usa default del ConnectionManager si no se proporciona)
     * @returns Instancia de Axios configurada
     */
    getAxiosInstance(connectionKey) {
        const key = connectionKey || this.defaultConnectionKey;
        // Retorna instancia cacheada si existe
        if (this.axiosInstances.has(key || "default")) {
            return this.axiosInstances.get(key || "default");
        }
        // Obtiene configuración de conexión
        let connection;
        let resolvedKey;
        try {
            connection = connectionManager.getConnection(key);
            resolvedKey = key || connectionManager.listConnections().find(c => c.isDefault)?.key || "default";
        }
        catch (error) {
            throw new Error(`Error al obtener configuración de conexión: ${error instanceof Error ? error.message : String(error)}`);
        }
        // Crea nueva instancia de Axios
        const instance = axios.create({
            baseURL: `${connection.url}/api/3`,
            headers: {
                Token: connection.token,
                "Content-Type": "application/json",
            },
            timeout: 30000,
        });
        // Interceptor para manejo de errores
        instance.interceptors.response.use((response) => response, (error) => {
            const connectionName = connection.name || resolvedKey;
            const statusCode = error.response?.status || "desconocido";
            const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
            throw new Error(`Error en FacturaScripts (${connectionName}, HTTP ${statusCode}): ${errorMessage}`);
        });
        // Cachea la instancia
        this.axiosInstances.set(key || "default", instance);
        return instance;
    }
    /**
     * Realiza una petición GET a la API de FacturaScripts
     * @param endpoint - Ruta del endpoint (ej: "clientes")
     * @param params - Parámetros de query opcionales
     * @param connectionKey - Clave de conexión opcional
     * @returns Datos de tipo T
     */
    async get(endpoint, params, connectionKey) {
        try {
            const instance = this.getAxiosInstance(connectionKey);
            const response = await instance.get(endpoint, { params });
            return response.data;
        }
        catch (error) {
            throw new Error(`GET ${endpoint}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Realiza una petición POST a la API de FacturaScripts
     * @param endpoint - Ruta del endpoint
     * @param data - Datos a enviar en el body
     * @param connectionKey - Clave de conexión opcional
     * @returns Respuesta de tipo T
     */
    async post(endpoint, data, connectionKey) {
        try {
            const instance = this.getAxiosInstance(connectionKey);
            const response = await instance.post(endpoint, data);
            return response.data;
        }
        catch (error) {
            throw new Error(`POST ${endpoint}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Realiza una petición PUT a la API de FacturaScripts
     * @param endpoint - Ruta del endpoint
     * @param data - Datos a actualizar
     * @param connectionKey - Clave de conexión opcional
     * @returns Respuesta de tipo T
     */
    async put(endpoint, data, connectionKey) {
        try {
            const instance = this.getAxiosInstance(connectionKey);
            const response = await instance.put(endpoint, data);
            return response.data;
        }
        catch (error) {
            throw new Error(`PUT ${endpoint}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Realiza una petición DELETE a la API de FacturaScripts
     * @param endpoint - Ruta del endpoint
     * @param connectionKey - Clave de conexión opcional
     * @returns Respuesta de tipo T
     */
    async delete(endpoint, connectionKey) {
        try {
            const instance = this.getAxiosInstance(connectionKey);
            const response = await instance.delete(endpoint);
            return response.data;
        }
        catch (error) {
            throw new Error(`DELETE ${endpoint}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Limpia el caché de instancias de Axios
     * Útil para refrescar credenciales o cambios de configuración
     */
    clearCache() {
        this.axiosInstances.clear();
    }
}
/**
 * Instancia singleton del cliente de FacturaScripts
 */
export const fsClient = new FacturaScriptsClient();
export default fsClient;
//# sourceMappingURL=client.js.map