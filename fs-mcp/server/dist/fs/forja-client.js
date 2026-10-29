/**
 * Cliente HTTP de la API de autor de Forja (facturascripts.com).
 *
 * La API vive en `<url>/api/3/forja` y se autentica con la cabecera `X-Forja-Token`, usando el token de autor
 * que cada contacto con el acuerdo de proveedor vigente obtiene en la pestaña «avanzado» de PortalForja.
 * A diferencia de la API REST estándar (`fs/client.ts`), envía JSON sin el envoltorio `filter[]`, sube
 * archivos en multipart y descarga binarios (zip de documentación) directamente a disco.
 */
import axios from "axios";
import fs from "fs";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import https from "https";
import path from "path";
import { connectionManager, normalizeBaseUrl } from "../connection-manager.js";
/**
 * Error devuelto por la API de Forja, con el estado HTTP y el código `{code, message}` del servidor.
 */
export class ForjaApiError extends Error {
    /** Estado HTTP, o undefined si no hubo respuesta (error de red). */
    status;
    /** Código de error que devuelve el servidor en el cuerpo, si lo hay. */
    code;
    /**
     * @param message - Mensaje legible
     * @param status - Estado HTTP
     * @param code - Código de error del servidor
     */
    constructor(message, status, code) {
        super(message);
        this.name = "ForjaApiError";
        this.status = status;
        this.code = code;
    }
}
/** Tiempo máximo de cada petición: las subidas de zips grandes pueden tardar. */
const REQUEST_TIMEOUT_MS = 300_000;
/** Pistas que se añaden al mensaje según el estado HTTP, para orientar al usuario. */
const STATUS_HINTS = {
    401: "revisa el token de autor de la pestaña «avanzado» de PortalForja",
    403: "el contacto no tiene un acuerdo de proveedor vigente",
    404: "el plugin no existe o no eres su autor",
};
/**
 * Resolución por defecto: la conexión indicada, que debe ser de tipo forja, o la primera conexión de tipo
 * forja configurada. Nunca usa la conexión por defecto global, que normalmente es de tipo api.
 *
 * @param key - Clave de la conexión (opcional)
 * @returns Conexión de tipo forja
 * @throws Error si la conexión no existe, no es de tipo forja o no hay ninguna de ese tipo
 */
export function resolveForjaConnection(key) {
    if (key) {
        const config = connectionManager.getConnection(key);
        if (config.type !== "forja") {
            throw new Error(`La conexión "${key}" es de tipo ${config.type ?? "api"}; las herramientas forja_* necesitan una conexión de tipo forja.`);
        }
        return { key, config };
    }
    const firstKey = connectionManager.findFirstKeyByType("forja");
    if (!firstKey) {
        throw new Error("No hay ninguna conexión de tipo forja configurada. Añade una con add_connection (type: \"forja\") " +
            "usando el token de autor de la pestaña «avanzado» de PortalForja.");
    }
    return { key: firstKey, config: connectionManager.getConnection(firstKey) };
}
/**
 * Convierte un cuerpo de error (JSON, texto o binario) en un objeto `{code, message}` si es posible.
 *
 * @param data - Cuerpo de la respuesta de error
 * @returns Código y mensaje encontrados
 */
function parseErrorBody(data) {
    let body = data;
    if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
        const bytes = body instanceof ArrayBuffer
            ? Buffer.from(body)
            : Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        body = bytes.toString("utf-8");
    }
    if (typeof body === "string") {
        const text = body.trim();
        if (text === "") {
            return {};
        }
        try {
            body = JSON.parse(text);
        }
        catch {
            return { message: text.slice(0, 500) };
        }
    }
    if (body && typeof body === "object") {
        const record = body;
        const message = record.message ?? record.error;
        const result = {};
        if (record.code !== undefined && record.code !== null) {
            result.code = String(record.code);
        }
        if (typeof message === "string") {
            result.message = message;
        }
        return result;
    }
    return {};
}
/**
 * Crea un Blob a partir de un archivo local. Usa `fs.openAsBlob` (Node ≥ 19.8) para no cargar el archivo en
 * memoria y, en versiones anteriores, lo lee completo.
 *
 * @param filePath - Ruta del archivo
 * @returns Blob con el contenido del archivo
 */
async function fileToBlob(filePath) {
    const info = await stat(filePath).catch(() => null);
    if (!info || !info.isFile()) {
        throw new Error(`No existe el archivo: ${filePath}`);
    }
    const openAsBlob = fs.openAsBlob;
    if (typeof openAsBlob === "function") {
        return await openAsBlob(filePath);
    }
    return new Blob([await readFile(filePath)]);
}
/**
 * Cliente de la API de autor de Forja con soporte de varias conexiones de tipo forja.
 */
export class ForjaClient {
    resolver;
    instances = new Map();
    /**
     * @param resolver - Resolución de conexiones; por defecto, `resolveForjaConnection` sobre `~/.fs-claude.json`
     */
    constructor(resolver = resolveForjaConnection) {
        this.resolver = resolver;
    }
    /**
     * Devuelve (y cachea) la instancia de axios de una conexión de tipo forja.
     *
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Instancia de axios configurada
     */
    getInstance(connectionKey) {
        const { key, config } = this.resolver(connectionKey);
        const cached = this.instances.get(key);
        if (cached) {
            return cached;
        }
        const rejectUnauthorized = config.rejectUnauthorized !== undefined
            ? config.rejectUnauthorized
            : process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0";
        const instance = axios.create({
            baseURL: `${normalizeBaseUrl(config.url)}/api/3/forja`,
            headers: {
                "X-Forja-Token": config.token,
                Accept: "application/json",
            },
            timeout: REQUEST_TIMEOUT_MS,
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            httpsAgent: new https.Agent({ rejectUnauthorized }),
        });
        instance.interceptors.response.use((response) => response, (error) => {
            const name = config.name || key;
            const status = error.response?.status;
            if (status === undefined) {
                throw new ForjaApiError(`Forja (${name}): ${error.message || "error de conexión"}`);
            }
            const { code, message } = parseErrorBody(error.response?.data);
            const hint = STATUS_HINTS[status];
            throw new ForjaApiError(`Forja (${name}, HTTP ${status}${code ? `, ${code}` : ""}): ${message || error.message}` +
                (hint ? ` (${hint})` : ""), status, code);
        });
        this.instances.set(key, instance);
        return instance;
    }
    /**
     * Ejecuta una petición y antepone el método y la ruta al mensaje de error.
     *
     * @param method - Método HTTP
     * @param endpoint - Ruta relativa a `/api/3/forja`
     * @param options - Opciones adicionales de axios
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Respuesta de axios
     */
    async request(method, endpoint, options, connectionKey) {
        try {
            return await this.getInstance(connectionKey).request({ method, url: endpoint, ...options });
        }
        catch (error) {
            const message = `${method.toUpperCase()} ${endpoint}: ${error instanceof Error ? error.message : String(error)}`;
            if (error instanceof ForjaApiError) {
                throw new ForjaApiError(message, error.status, error.code);
            }
            throw new Error(message);
        }
    }
    /**
     * Petición GET que devuelve JSON. Los parámetros se envían tal cual en la query, sin `filter[]`.
     *
     * @param endpoint - Ruta relativa a `/api/3/forja`
     * @param params - Parámetros de la query; se omiten los vacíos
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Cuerpo de la respuesta
     */
    async get(endpoint, params, connectionKey) {
        const response = await this.request("GET", endpoint, { params: compact(params) }, connectionKey);
        return response.data;
    }
    /**
     * Envía un cuerpo JSON (POST, PATCH, PUT o DELETE).
     *
     * @param method - Método HTTP
     * @param endpoint - Ruta relativa a `/api/3/forja`
     * @param body - Cuerpo que se serializa como JSON (opcional)
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Cuerpo de la respuesta
     */
    async sendJson(method, endpoint, body, connectionKey) {
        const options = body === undefined ? {} : { data: body, headers: { "Content-Type": "application/json" } };
        const response = await this.request(method, endpoint, options, connectionKey);
        return response.data;
    }
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
    async sendMultipart(method, endpoint, fields, files, connectionKey) {
        const form = new FormData();
        for (const [name, value] of Object.entries(compact(fields))) {
            form.append(name, typeof value === "boolean" ? (value ? "1" : "0") : String(value));
        }
        for (const file of files) {
            form.append(file.field, await fileToBlob(file.path), file.filename ?? path.basename(file.path));
        }
        const response = await this.request(method, endpoint, { data: form }, connectionKey);
        return response.data;
    }
    /**
     * Descarga un binario y lo escribe en disco, creando la carpeta de destino si no existe.
     *
     * @param endpoint - Ruta relativa a `/api/3/forja`
     * @param params - Parámetros de la query
     * @param outputFile - Ruta del archivo de salida
     * @param connectionKey - Clave de la conexión (opcional)
     * @returns Ruta, tamaño y tipo del archivo escrito
     */
    async download(endpoint, params, outputFile, connectionKey) {
        const response = await this.request("GET", endpoint, { params: compact(params), responseType: "arraybuffer", headers: { Accept: "*/*" } }, connectionKey);
        const target = path.resolve(outputFile);
        const bytes = Buffer.from(response.data);
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, bytes);
        const result = { path: target, bytes: bytes.length };
        const contentType = response.headers["content-type"];
        if (typeof contentType === "string") {
            result.contentType = contentType;
        }
        return result;
    }
    /**
     * Limpia el caché de instancias de axios (por ejemplo, tras modificar una conexión).
     */
    clearCache() {
        this.instances.clear();
    }
}
/**
 * Quita de un objeto los valores undefined, null y cadenas vacías.
 *
 * @param values - Objeto de entrada
 * @returns Copia sin valores vacíos
 */
function compact(values) {
    const result = {};
    for (const [key, value] of Object.entries(values ?? {})) {
        if (value !== undefined && value !== null && value !== "") {
            result[key] = value;
        }
    }
    return result;
}
/**
 * Instancia singleton del cliente de Forja.
 */
export const forjaClient = new ForjaClient();
export default forjaClient;
//# sourceMappingURL=forja-client.js.map