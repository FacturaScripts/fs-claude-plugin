import axios from "axios";
import https from "https";
import { connectionManager } from "../connection-manager.js";
/**
 * Cliente HTTP para la API REST de FacturaScripts
 * Soporta múltiples conexiones y manejo de errores contextualizado
 */
class FacturaScriptsClient {
    defaultConnectionKey;
    axiosInstances = new Map();
    constructor(connectionKey) {
        this.defaultConnectionKey = connectionKey;
    }
    getAxiosInstance(connectionKey) {
        const key = connectionKey || this.defaultConnectionKey;
        if (this.axiosInstances.has(key || "default")) {
            return this.axiosInstances.get(key || "default");
        }
        let connection;
        let resolvedKey;
        try {
            connection = connectionManager.getConnection(key);
            resolvedKey = key || connectionManager.listConnections().find(c => c.isDefault)?.key || "default";
        }
        catch (error) {
            throw new Error(`Error al obtener configuración de conexión: ${error instanceof Error ? error.message : String(error)}`);
        }
        const shouldRejectUnauthorized = connection.rejectUnauthorized !== undefined
            ? connection.rejectUnauthorized
            : process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0";
        const httpsAgent = new https.Agent({
            rejectUnauthorized: shouldRejectUnauthorized,
        });
        const instance = axios.create({
            baseURL: `${connection.url}/api/3`,
            headers: {
                Token: connection.token,
                "Content-Type": "application/json",
            },
            timeout: 30000,
            httpsAgent,
        });
        instance.interceptors.response.use((response) => response, (error) => {
            const connectionName = connection.name || resolvedKey;
            const statusCode = error.response?.status || "desconocido";
            const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
            throw new Error(`Error en FacturaScripts (${connectionName}, HTTP ${statusCode}): ${errorMessage}`);
        });
        this.axiosInstances.set(key || "default", instance);
        return instance;
    }
    /**
     * Serializa un objeto a URLSearchParams para application/x-www-form-urlencoded.
     * La API REST de FacturaScripts requiere este formato en POST y PUT.
     * Los valores null/undefined se omiten; los booleanos se convierten a 0/1.
     */
    toFormData(data) {
        const params = new URLSearchParams();
        if (data && typeof data === 'object') {
            for (const [key, value] of Object.entries(data)) {
                if (value === undefined || value === null)
                    continue;
                if (typeof value === 'boolean') {
                    params.append(key, value ? '1' : '0');
                }
                else {
                    params.append(key, String(value));
                }
            }
        }
        return params;
    }
    /**
     * Realiza una petición GET a la API de FacturaScripts
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
     * Realiza una petición POST a la API de FacturaScripts.
     * Envía los datos como application/x-www-form-urlencoded (requerido por FacturaScripts).
     */
    async post(endpoint, data, connectionKey) {
        try {
            const instance = this.getAxiosInstance(connectionKey);
            const formData = this.toFormData(data);
            const response = await instance.post(endpoint, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`POST ${endpoint}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Realiza una petición PUT a la API de FacturaScripts.
     * Envía los datos como application/x-www-form-urlencoded (requerido por FacturaScripts).
     * El ID del registro debe incluirse en la URL (ej: /clientes/CLI001).
     */
    async put(endpoint, data, connectionKey) {
        try {
            const instance = this.getAxiosInstance(connectionKey);
            const formData = this.toFormData(data);
            const response = await instance.put(endpoint, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`PUT ${endpoint}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Realiza una petición DELETE a la API de FacturaScripts.
     * El ID del registro debe incluirse en la URL (ej: /clientes/CLI001).
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