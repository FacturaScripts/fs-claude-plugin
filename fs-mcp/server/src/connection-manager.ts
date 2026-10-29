import fs from "fs";
import os from "os";
import path from "path";
import type {
  ConnectionConfig,
  ConnectionsConfig,
  ConnectionType,
} from "./types/facturascripts.js";

/**
 * Normaliza la URL base de una instalación: quita las barras finales y, si se ha pegado la URL de la API,
 * su ruta final (`/api/3` o `/api/3/forja`), porque los clientes ya la añaden por su cuenta.
 *
 * @param url - URL indicada por el usuario o guardada en el archivo de conexiones
 * @returns URL base sin barra final, por ejemplo `https://facturascripts.com`
 */
export function normalizeBaseUrl(url: string): string {
  return url
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api\/3(?:\/forja)?$/i, "")
    .replace(/\/+$/, "");
}

interface FsClaudeConfig {
  version?: string;
  connections?: ConnectionsConfig;
  settings?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Gestor centralizado de conexiones multi-instancia a FacturaScripts
 * Lee y persiste configuración desde/hacia archivo JSON
 *
 * Prioridad de ubicación:
 * 1. ~/.fs-claude.json (automático, cross-platform, sin configuración necesaria)
 * 2. FS_CONNECTIONS_FILE env var (compatibilidad con configuraciones existentes)
 */
class ConnectionManager {
  private connectionsPath: string;
  private useFsClaudeFormat: boolean;
  private config: ConnectionsConfig;

  constructor() {
    // Prioridad 1: ~/.fs-claude.json — encontrado automáticamente en cualquier SO
    const fsClaudePath = path.join(os.homedir(), ".fs-claude.json");

    // Prioridad 2: FS_CONNECTIONS_FILE env var (ignorar placeholders sin expandir)
    const rawConnectionsFile = process.env.FS_CONNECTIONS_FILE;
    const resolvedConnectionsFile =
      rawConnectionsFile && !rawConnectionsFile.startsWith("${")
        ? rawConnectionsFile
        : null;

    this.connectionsPath = resolvedConnectionsFile || fsClaudePath;
    this.useFsClaudeFormat = this.connectionsPath === fsClaudePath;

    if (resolvedConnectionsFile) {
      console.error(`[fs-mcp] Usando archivo de conexiones desde FS_CONNECTIONS_FILE: ${resolvedConnectionsFile}`);
    } else {
      console.error(`[fs-mcp] Usando archivo de configuración unificado: ${fsClaudePath}`);
    }

    this.config = this.loadConnections();
  }

  /**
   * Carga las conexiones desde el archivo JSON.
   * Si el archivo no existe, crea uno vacío y continúa sin lanzar error.
   * El servidor arranca siempre; el error se produce al intentar usar una conexión.
   */
  private loadConnections(): ConnectionsConfig {
    const emptyConfig: ConnectionsConfig = { default: "", connections: {} };

    try {
      if (!fs.existsSync(this.connectionsPath)) {
        this.createEmptyConnectionsFile();
        console.error(
          `[fs-mcp] Archivo de conexiones no encontrado: ${this.connectionsPath}\n` +
            "[fs-mcp] Usa fs-mcp:add-connection para configurar una conexión."
        );
        return emptyConfig;
      }

      const rawData = fs.readFileSync(this.connectionsPath, "utf-8");
      const parsed = JSON.parse(rawData);

      // Formato ~/.fs-claude.json: las conexiones están en la clave "connections"
      const connectionsData: ConnectionsConfig = this.useFsClaudeFormat
        ? (parsed as FsClaudeConfig).connections ?? emptyConfig
        : (parsed as ConnectionsConfig);

      if (!connectionsData || !connectionsData.connections) {
        return emptyConfig;
      }

      if (Object.keys(connectionsData.connections).length === 0) {
        console.error(
          "[fs-mcp] No hay conexiones configuradas\n" +
            "[fs-mcp] Usa fs-mcp:add-connection para añadir una conexión."
        );
      }

      return connectionsData;
    } catch (error) {
      console.error(`[fs-mcp] Error al cargar conexiones: ${error instanceof Error ? error.message : String(error)}`);
      return emptyConfig;
    }
  }

  /**
   * Crea el archivo de conexiones vacío con la estructura adecuada al formato
   */
  private createEmptyConnectionsFile(): void {
    const dir = path.dirname(this.connectionsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (this.useFsClaudeFormat) {
      // Crear ~/.fs-claude.json con estructura completa
      const fsClaudeConfig: FsClaudeConfig = {
        version: "1.0",
        connections: { default: "", connections: {} },
        settings: { sortClassMembers: true, updateCopyright: true },
      };
      fs.writeFileSync(
        this.connectionsPath,
        JSON.stringify(fsClaudeConfig, null, 2),
        "utf-8"
      );
    } else {
      // Formato plano legacy
      const emptyConfig: ConnectionsConfig = { default: "", connections: {} };
      fs.writeFileSync(
        this.connectionsPath,
        JSON.stringify(emptyConfig, null, 2),
        "utf-8"
      );
    }
  }

  /**
   * Persiste la configuración actual al archivo JSON
   */
  private saveConnections(): void {
    const dir = path.dirname(this.connectionsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (this.useFsClaudeFormat) {
      // Leer el archivo completo para preservar "settings" y otras claves
      let existingConfig: FsClaudeConfig = {
        version: "1.0",
        connections: { default: "", connections: {} },
        settings: { sortClassMembers: true, updateCopyright: true },
      };
      if (fs.existsSync(this.connectionsPath)) {
        try {
          existingConfig = JSON.parse(fs.readFileSync(this.connectionsPath, "utf-8")) as FsClaudeConfig;
        } catch {
          // Mantener estructura vacía si hay error de lectura
        }
      }
      existingConfig.connections = this.config;
      fs.writeFileSync(
        this.connectionsPath,
        JSON.stringify(existingConfig, null, 2),
        "utf-8"
      );
    } else {
      fs.writeFileSync(
        this.connectionsPath,
        JSON.stringify(this.config, null, 2),
        "utf-8"
      );
    }
  }

  /**
   * Obtiene una conexión por clave o la conexión por defecto
   * @param key - Clave de la conexión (opcional, usa default si no se proporciona)
   * @returns Configuración de la conexión
   * @throws Error si la conexión no existe
   */
  getConnection(key?: string): ConnectionConfig {
    const connectionKey = key || this.config.default;

    if (!connectionKey) {
      throw new Error(
        "No hay conexión por defecto configurada y no se proporcionó ninguna clave"
      );
    }

    const connection = this.config.connections[connectionKey];
    if (!connection) {
      throw new Error(
        `Conexión no encontrada: "${connectionKey}". Conexiones disponibles: ${Object.keys(this.config.connections).join(", ")}`
      );
    }

    return connection;
  }

  /**
   * Lista todas las conexiones disponibles
   * @returns Array de objetos con información resumida de cada conexión
   */
  listConnections(): Array<{
    key: string;
    name: string;
    url: string;
    type: ConnectionType;
    isDefault: boolean;
  }> {
    return Object.entries(this.config.connections).map(([key, config]) => ({
      key,
      name: config.name,
      url: config.url,
      type: config.type ?? "api",
      isDefault: key === this.config.default,
    }));
  }

  /**
   * Devuelve la clave de la primera conexión configurada de un tipo concreto.
   * Las conexiones sin `type` se consideran de tipo `api`.
   * @param type - Tipo de conexión buscado
   * @returns Clave de la conexión o undefined si no hay ninguna de ese tipo
   */
  findFirstKeyByType(type: ConnectionType): string | undefined {
    return Object.entries(this.config.connections).find(
      ([, config]) => (config.type ?? "api") === type
    )?.[0];
  }

  /**
   * Añade una conexión o, si se indica `overwrite`, sustituye la que tenga la misma clave.
   * La URL se guarda normalizada con `normalizeBaseUrl`.
   * @param key - Identificador único de la conexión
   * @param config - Configuración de la conexión
   * @param overwrite - Permite sustituir una conexión existente con la misma clave (por defecto, false)
   * @throws Error si la clave ya existe y no se permite sobrescribir, o si faltan datos
   */
  addConnection(key: string, config: ConnectionConfig, overwrite = false): void {
    if (!key || key.trim() === "") {
      throw new Error("La clave de conexión no puede estar vacía");
    }

    // Sustituir una conexión borraría su token sin posibilidad de recuperarlo, así que hay que pedirlo expresamente.
    const existing = this.config.connections[key];
    if (existing && !overwrite) {
      throw new Error(
        `Ya existe una conexión con la clave "${key}" (${existing.name}, tipo ${existing.type ?? "api"}, ${existing.url}). ` +
          "Usa otra clave o indica overwrite: true para sustituirla."
      );
    }

    if (!config.name || !config.url || !config.token) {
      throw new Error(
        "La configuración debe incluir: name, url y token"
      );
    }

    if (config.type !== undefined && config.type !== "api" && config.type !== "forja") {
      throw new Error(
        `Tipo de conexión no válido: "${String(config.type)}". Usa "api" o "forja".`
      );
    }

    this.config.connections[key] = { ...config, url: normalizeBaseUrl(config.url) };

    // Si es la primera conexión, establécela como predeterminada
    if (!this.config.default || this.config.default === "") {
      this.config.default = key;
    }

    this.saveConnections();
  }

  /**
   * Establece la conexión por defecto
   * @param key - Clave de la conexión a establecer como predeterminada
   * @throws Error si la conexión no existe
   */
  setDefault(key: string): void {
    if (!this.config.connections[key]) {
      throw new Error(
        `No se puede establecer como predeterminada: conexión "${key}" no existe`
      );
    }

    this.config.default = key;
    this.saveConnections();
  }
}

/**
 * Instancia singleton del gestor de conexiones
 */
export const connectionManager = new ConnectionManager();

export default connectionManager;
