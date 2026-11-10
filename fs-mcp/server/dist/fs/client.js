import axios from "axios";
import https from "https";
import { connectionManager, normalizeBaseUrl } from "../connection-manager.js";
import { toApiQueryParams } from "../utils/filterParser.js";
/**
 * Campos que no deben llegar al modelo, por recurso de la API. Es la misma lista
 * que oculta el core con getApiFieldsToHide() (User, ApiKey y Settings); se aplica
 * también aquí porque los cores anteriores a ese método devuelven los registros
 * completos. "columna.clave" es una clave dentro de una columna JSON, como en el core.
 */
const API_FIELDS_TO_HIDE = {
    users: ["password", "logkey", "two_factor_secret_key"],
    apikeyes: ["apikey"],
    settings: ["properties.password"],
};
function hideFieldsInRecord(record, fields) {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
        return record;
    }
    const result = { ...record };
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
            }
            catch {
                // No es JSON: no contiene la clave
            }
        }
        else if (value && typeof value === "object" && Object.hasOwn(value, key)) {
            const copy = { ...value };
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
function fieldsToHide(response) {
    const sentPath = response.request?.path;
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
function hideApiFields(fields, data) {
    if (!fields) {
        return data;
    }
    // Con texto delante del JSON (un aviso de PHP con display_errors activo),
    // axios entrega un string: se busca el JSON y se filtra, y si no lo hay se
    // falla sin devolver el texto, que puede contener los campos
    if (typeof data === "string") {
        const start = data.search(/[[{]/);
        let parsed;
        try {
            parsed = JSON.parse(start === -1 ? "" : data.slice(start));
        }
        catch {
            throw new Error("respuesta no JSON de un recurso con campos sensibles");
        }
        return hideApiFields(fields, parsed);
    }
    if (Array.isArray(data)) {
        return data.map((record) => hideFieldsInRecord(record, fields));
    }
    if (data && typeof data === "object" && "data" in data) {
        return { ...data, data: hideApiFields(fields, data.data) };
    }
    return hideFieldsInRecord(data, fields);
}
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
        // Las conexiones de tipo forja usan otra API (/api/3/forja) y otra autenticación.
        if (connection.type === "forja") {
            throw new Error(`La conexión "${resolvedKey}" es de tipo forja (API de autor de facturascripts.com) ` +
                "y no sirve para la API REST /api/3. Usa las herramientas forja_* con ella " +
                "o indica una conexión de tipo api en el parámetro connection.");
        }
        const shouldRejectUnauthorized = connection.rejectUnauthorized !== undefined
            ? connection.rejectUnauthorized
            : process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0";
        const httpsAgent = new https.Agent({
            rejectUnauthorized: shouldRejectUnauthorized,
        });
        const instance = axios.create({
            baseURL: `${normalizeBaseUrl(connection.url)}/api/3`,
            headers: {
                Token: connection.token,
                "Content-Type": "application/json",
            },
            timeout: 30000,
            httpsAgent,
            // La API no redirige en uso normal, y al seguir una redirección a otro
            // host follow-redirects sólo quita Authorization y Cookie: la cabecera
            // Token se reenviaría al destino.
            maxRedirects: 0,
            // Toda ruta va bajo baseURL: una ruta absoluta («http://…» o «//host/…»)
            // construida con datos del modelo no puede llevar el token a otro host.
            allowAbsoluteUrls: false,
        });
        instance.interceptors.response.use((response) => response, (error) => {
            const connectionName = connection.name || resolvedKey;
            const statusCode = error.response?.status || "desconocido";
            const location = error.response?.headers?.location;
            // Las redirecciones no se siguen (maxRedirects: 0): se dice adónde iban
            // para que se pueda corregir la URL de la conexión, p. ej. de http a https
            const errorMessage = location
                ? `la API ha redirigido a ${location} y no se sigue la redirección para no enviar el token a otra dirección; si es la dirección de la instalación, corrige la URL de la conexión`
                : error.response?.data?.message || error.message || "Error desconocido";
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
     * Realiza una petición GET a la API de FacturaScripts.
     * Los parámetros se serializan a la sintaxis de filtros que espera la API
     * (`filter[campo]=valor`); los parámetros sueltos serían ignorados por el servidor.
     */
    async get(endpoint, params, connectionKey) {
        try {
            const instance = this.getAxiosInstance(connectionKey);
            const response = await instance.get(endpoint, {
                params: toApiQueryParams(params),
            });
            return hideApiFields(fieldsToHide(response), response.data);
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
            return hideApiFields(fieldsToHide(response), response.data);
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
            return hideApiFields(fieldsToHide(response), response.data);
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
            return hideApiFields(fieldsToHide(response), response.data);
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