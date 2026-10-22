import axios, { AxiosInstance, AxiosResponse } from "axios";
import https from "https";
import { connectionManager } from "../connection-manager.js";
import { toApiQueryParams } from "../utils/filterParser.js";
import type { ConnectionConfig } from "../types/facturascripts.js";

/**
 * Campos que no deben llegar al modelo, por recurso de la API. Es la misma lista
 * que oculta el core con getApiFieldsToHide() (User, ApiKey y Settings); se aplica
 * también aquí porque los cores anteriores a ese método devuelven los registros
 * completos. "columna.clave" es una clave dentro de una columna JSON, como en el core.
 */
const API_FIELDS_TO_HIDE: Record<string, string[]> = {
  users: ["password", "logkey", "two_factor_secret_key"],
  apikeyes: ["apikey"],
  settings: ["properties.password"],
};

function hideFieldsInRecord(record: unknown, fields: string[]): unknown {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return record;
  }

  const result: Record<string, unknown> = { ...(record as Record<string, unknown>) };
  for (const field of fields) {
    const pos = field.indexOf(".");
    if (pos === -1) {
      delete result[field];
      continue;
    }

    // Clave dentro de una columna JSON, como texto (lo habitual) o ya decodificada
    const column = field.slice(0, pos);
    const key = field.slice(pos + 1);
    const value = result[column];
    if (typeof value === "string") {
      try {
        const json = JSON.parse(value);
        if (json && typeof json === "object" && Object.hasOwn(json, key)) {
          delete json[key];
          result[column] = JSON.stringify(json);
        }
      } catch {
        // No es JSON: no contiene la clave
      }
    } else if (value && typeof value === "object" && Object.hasOwn(value, key)) {
      const copy = { ...(value as Record<string, unknown>) };
      delete copy[key];
      result[column] = copy;
    }
  }
  return result;
}

const ALL_API_FIELDS_TO_HIDE = [...new Set(Object.values(API_FIELDS_TO_HIDE).flat())];

/**
 * Campos a ocultar según el recurso al que llegó de verdad la petición. Se mira
 * la ruta enviada y no la pedida, porque la URL normaliza los segmentos «.» y
 * «..» (también %2e%2e): «./users» o «x/../users» llegan a /users. Si no se
 * puede saber el recurso, o la ruta salió de la base de la API, se ocultan
 * todos los campos conocidos.
 */
function fieldsToHide(response: AxiosResponse): string[] | undefined {
  const sentPath = (response.request as { path?: unknown } | undefined)?.path;
  const basePath = new URL(response.config.baseURL ?? "", "http://localhost").pathname.replace(/\/+$/, "");
  const path = typeof sentPath === "string" ? sentPath.split("?")[0] ?? "" : "";
  if (!path.startsWith(`${basePath}/`)) {
    return ALL_API_FIELDS_TO_HIDE;
  }

  // Un segmento codificado (%) o con parámetros (;) no se interpreta: se oculta todo
  const segment = path.slice(basePath.length + 1).split("/")[0] ?? "";
  if (/[%;]/.test(segment)) {
    return ALL_API_FIELDS_TO_HIDE;
  }

  const resource = segment.toLowerCase();
  return Object.hasOwn(API_FIELDS_TO_HIDE, resource) ? API_FIELDS_TO_HIDE[resource] : undefined;
}

/**
 * Quita los campos indicados de la respuesta. Cubre las tres formas de respuesta
 * de la API: lista de registros, un registro y {ok, data}.
 */
function hideApiFields<T>(fields: string[] | undefined, data: T): T {
  if (!fields) {
    return data;
  }

  // Con texto delante del JSON (un aviso de PHP con display_errors activo),
  // axios entrega un string: se busca el JSON y se filtra, y si no lo hay se
  // falla sin devolver el texto, que puede contener los campos
  if (typeof data === "string") {
    const start = data.search(/[[{]/);
    let parsed: unknown;
    try {
      parsed = JSON.parse(start === -1 ? "" : data.slice(start));
    } catch {
      throw new Error("respuesta no JSON de un recurso con campos sensibles");
    }
    return hideApiFields(fields, parsed) as T;
  }

  if (Array.isArray(data)) {
    return data.map((record) => hideFieldsInRecord(record, fields)) as T;
  }
  if (data && typeof data === "object" && "data" in data) {
    return { ...data, data: hideApiFields(fields, (data as { data: unknown }).data) } as T;
  }
  return hideFieldsInRecord(data, fields) as T;
}

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
   * Realiza una petición GET a la API de FacturaScripts.
   * Los parámetros se serializan a la sintaxis de filtros que espera la API
   * (`filter[campo]=valor`); los parámetros sueltos serían ignorados por el servidor.
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    connectionKey?: string
  ): Promise<T> {
    try {
      const instance = this.getAxiosInstance(connectionKey);
      const response = await instance.get<T>(endpoint, {
        params: toApiQueryParams(params),
      });
      return hideApiFields(fieldsToHide(response), response.data);
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
      return hideApiFields(fieldsToHide(response), response.data);
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
      return hideApiFields(fieldsToHide(response), response.data);
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
      return hideApiFields(fieldsToHide(response), response.data);
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
