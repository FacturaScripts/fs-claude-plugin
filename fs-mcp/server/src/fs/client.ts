import axios, { AxiosInstance } from "axios";
import https from "https";
import { connectionManager } from "../connection-manager.js";
import type { ConnectionConfig } from "../types/facturascripts.js";

/**
 * Cliente HTTP para la API REST de FacturaScripts
 * Soporta múltiples conexiones y manejo de errores contextualizado
 */
class FacturaScriptsClient {
  private defaultConnectionKey: string | undefined;
  private axiosInstances: Map<string, AxiosInstance> = new Map();

  constructor(connectionKey?: string) {
    this.defaultConnectionKey = connectionKey;
  }

  private getAxiosInstance(connectionKey?: string): AxiosInstance {
    const key = connectionKey || this.defaultConnectionKey;

    if (this.axiosInstances.has(key || "default")) {
      return this.axiosInstances.get(key || "default")!;
    }

    let connection: ConnectionConfig;
    let resolvedKey: string;

    try {
      connection = connectionManager.getConnection(key);
      resolvedKey = key || connectionManager.listConnections().find(c => c.isDefault)?.key || "default";
    } catch (error) {
      throw new Error(
        `Error al obtener configuración de conexión: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    const shouldRejectUnauthorized =
      connection.rejectUnauthorized !== undefined
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

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const connectionName = connection.name || resolvedKey;
        const statusCode = error.response?.status || "desconocido";
        const errorMessage = error.response?.data?.message || error.message || "Error desconocido";

        throw new Error(
          `Error en FacturaScripts (${connectionName}, HTTP ${statusCode}): ${errorMessage}`
        );
      }
    );

    this.axiosInstances.set(key || "default", instance);

    return instance;
  }

  /**
   * Serializa un objeto a URLSearchParams para application/x-www-form-urlencoded.
   * La API REST de FacturaScripts requiere este formato en POST y PUT.
   * Los valores null/undefined se omiten; los booleanos se convierten a 0/1.
   */
  private toFormData(data: unknown): URLSearchParams {
    const params = new URLSearchParams();
    if (data && typeof data === 'object') {
      for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        if (value === undefined || value === null) continue;
        if (typeof value === 'boolean') {
          params.append(key, value ? '1' : '0');
        } else {
          params.append(key, String(value));
        }
      }
    }
    return params;
  }

  /**
   * Realiza una petición GET a la API de FacturaScripts
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    connectionKey?: string
  ): Promise<T> {
    try {
      const instance = this.getAxiosInstance(connectionKey);
      const response = await instance.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      throw new Error(
        `GET ${endpoint}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Realiza una petición POST a la API de FacturaScripts.
   * Envía los datos como application/x-www-form-urlencoded (requerido por FacturaScripts).
   */
  async post<T>(
    endpoint: string,
    data: unknown,
    connectionKey?: string
  ): Promise<T> {
    try {
      const instance = this.getAxiosInstance(connectionKey);
      const formData = this.toFormData(data);
      const response = await instance.post<T>(endpoint, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `POST ${endpoint}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Realiza una petición PUT a la API de FacturaScripts.
   * Envía los datos como application/x-www-form-urlencoded (requerido por FacturaScripts).
   * El ID del registro debe incluirse en la URL (ej: /clientes/CLI001).
   */
  async put<T>(
    endpoint: string,
    data: unknown,
    connectionKey?: string
  ): Promise<T> {
    try {
      const instance = this.getAxiosInstance(connectionKey);
      const formData = this.toFormData(data);
      const response = await instance.put<T>(endpoint, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `PUT ${endpoint}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Realiza una petición DELETE a la API de FacturaScripts.
   * El ID del registro debe incluirse en la URL (ej: /clientes/CLI001).
   */
  async delete<T>(
    endpoint: string,
    connectionKey?: string
  ): Promise<T> {
    try {
      const instance = this.getAxiosInstance(connectionKey);
      const response = await instance.delete<T>(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(
        `DELETE ${endpoint}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Limpia el caché de instancias de Axios
   */
  clearCache(): void {
    this.axiosInstances.clear();
  }
}

/**
 * Instancia singleton del cliente de FacturaScripts
 */
export const fsClient = new FacturaScriptsClient();

export default fsClient;
