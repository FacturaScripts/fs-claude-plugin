/**
 * Cliente HTTP de la API de autor de Forja (facturascripts.com).
 *
 * La API vive en `<url>/api/3/forja` y se autentica con la cabecera `X-Forja-Token`, usando el token de autor
 * que cada contacto con el acuerdo de proveedor vigente obtiene en la pestaña «avanzado» de PortalForja.
 * A diferencia de la API REST estándar (`fs/client.ts`), envía JSON sin el envoltorio `filter[]`, sube
 * archivos en multipart y descarga binarios (zip de documentación) directamente a disco.
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, Method } from "axios";
import fs from "fs";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import https from "https";
import path from "path";
import { connectionManager, normalizeBaseUrl } from "../connection-manager.js";
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
export class ForjaApiError extends Error {
  /** Estado HTTP, o undefined si no hubo respuesta (error de red). */
  readonly status: number | undefined;
  /** Código de error que devuelve el servidor en el cuerpo, si lo hay. */
  readonly code: string | undefined;

  /**
   * @param message - Mensaje legible
   * @param status - Estado HTTP
   * @param code - Código de error del servidor
   */
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ForjaApiError";
    this.status = status;
    this.code = code;
  }
}

/** Tiempo máximo de cada petición: las subidas de zips grandes pueden tardar. */
const REQUEST_TIMEOUT_MS = 300_000;

/** Pistas que se añaden al mensaje según el estado HTTP, para orientar al usuario. */
const STATUS_HINTS: Record<number, string> = {
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
export function resolveForjaConnection(key?: string): ResolvedForjaConnection {
  if (key) {
    const config = connectionManager.getConnection(key);
    if (config.type !== "forja") {
      throw new Error(
        `La conexión "${key}" es de tipo ${config.type ?? "api"}; las herramientas forja_* necesitan una conexión de tipo forja.`
      );
    }
    return { key, config };
  }

  const firstKey = connectionManager.findFirstKeyByType("forja");
  if (!firstKey) {
    throw new Error(
      "No hay ninguna conexión de tipo forja configurada. Añade una con add_connection (type: \"forja\") " +
        "usando el token de autor de la pestaña «avanzado» de PortalForja."
    );
  }
  return { key: firstKey, config: connectionManager.getConnection(firstKey) };
}

/**
 * Convierte un cuerpo de error (JSON, texto o binario) en un objeto `{code, message}` si es posible.
 *
 * @param data - Cuerpo de la respuesta de error
 * @returns Código y mensaje encontrados
 */
function parseErrorBody(data: unknown): { code?: string; message?: string } {
  let body: unknown = data;
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
    } catch {
      return { message: text.slice(0, 500) };
    }
  }
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const message = record.message ?? record.error;
    const result: { code?: string; message?: string } = {};
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
async function fileToBlob(filePath: string): Promise<Blob> {
  const info = await stat(filePath).catch(() => null);
  if (!info || !info.isFile()) {
    throw new Error(`No existe el archivo: ${filePath}`);
  }
  const openAsBlob = (fs as { openAsBlob?: (p: string) => Promise<Blob> }).openAsBlob;
  if (typeof openAsBlob === "function") {
    return await openAsBlob(filePath);
  }
  return new Blob([await readFile(filePath)]);
}

/**
 * Cliente de la API de autor de Forja con soporte de varias conexiones de tipo forja.
 */
export class ForjaClient {
  private readonly resolver: ForjaConnectionResolver;
  private readonly instances: Map<string, AxiosInstance> = new Map();

  /**
   * @param resolver - Resolución de conexiones; por defecto, `resolveForjaConnection` sobre `~/.fs-claude.json`
   */
  constructor(resolver: ForjaConnectionResolver = resolveForjaConnection) {
    this.resolver = resolver;
  }

  /**
   * Devuelve (y cachea) la instancia de axios de una conexión de tipo forja.
   *
   * @param connectionKey - Clave de la conexión (opcional)
   * @returns Instancia de axios configurada
   */
  private getInstance(connectionKey?: string): AxiosInstance {
    const { key, config } = this.resolver(connectionKey);
    const cached = this.instances.get(key);
    if (cached) {
      return cached;
    }

    const rejectUnauthorized =
      config.rejectUnauthorized !== undefined
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

    instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const name = config.name || key;
        const status = error.response?.status;
        if (status === undefined) {
          throw new ForjaApiError(`Forja (${name}): ${error.message || "error de conexión"}`);
        }
        const { code, message } = parseErrorBody(error.response?.data);
        const hint = STATUS_HINTS[status];
        throw new ForjaApiError(
          `Forja (${name}, HTTP ${status}${code ? `, ${code}` : ""}): ${message || error.message}` +
            (hint ? ` (${hint})` : ""),
          status,
          code
        );
      }
    );

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
  private async request<T>(
    method: Method,
    endpoint: string,
    options: AxiosRequestConfig,
    connectionKey?: string
  ) {
    try {
      return await this.getInstance(connectionKey).request<T>({ method, url: endpoint, ...options });
    } catch (error) {
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
  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown>,
    connectionKey?: string
  ): Promise<T> {
    const response = await this.request<T>("GET", endpoint, { params: compact(params) }, connectionKey);
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
  async sendJson<T = unknown>(
    method: Method,
    endpoint: string,
    body?: unknown,
    connectionKey?: string
  ): Promise<T> {
    const options: AxiosRequestConfig =
      body === undefined ? {} : { data: body, headers: { "Content-Type": "application/json" } };
    const response = await this.request<T>(method, endpoint, options, connectionKey);
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
  async sendMultipart<T = unknown>(
    method: Method,
    endpoint: string,
    fields: Record<string, unknown>,
    files: ForjaUploadFile[],
    connectionKey?: string
  ): Promise<T> {
    const form = new FormData();
    for (const [name, value] of Object.entries(compact(fields))) {
      form.append(name, typeof value === "boolean" ? (value ? "1" : "0") : String(value));
    }
    for (const file of files) {
      form.append(file.field, await fileToBlob(file.path), file.filename ?? path.basename(file.path));
    }
    const response = await this.request<T>(method, endpoint, { data: form }, connectionKey);
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
  async download(
    endpoint: string,
    params: Record<string, unknown> | undefined,
    outputFile: string,
    connectionKey?: string
  ): Promise<ForjaDownloadResult> {
    const response = await this.request<ArrayBuffer>(
      "GET",
      endpoint,
      { params: compact(params), responseType: "arraybuffer", headers: { Accept: "*/*" } },
      connectionKey
    );
    const target = path.resolve(outputFile);
    const bytes = Buffer.from(response.data);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);

    const result: ForjaDownloadResult = { path: target, bytes: bytes.length };
    const contentType = response.headers["content-type"];
    if (typeof contentType === "string") {
      result.contentType = contentType;
    }
    return result;
  }

  /**
   * Limpia el caché de instancias de axios (por ejemplo, tras modificar una conexión).
   */
  clearCache(): void {
    this.instances.clear();
  }
}

/**
 * Quita de un objeto los valores undefined, null y cadenas vacías.
 *
 * @param values - Objeto de entrada
 * @returns Copia sin valores vacíos
 */
function compact(values?: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
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
