import fs from "fs";
import path from "path";
import type {
  ConnectionConfig,
  ConnectionsConfig,
} from "./types/facturascripts.js";

/**
 * Gestor centralizado de conexiones multi-instancia a FacturaScripts
 * Lee y persiste configuración desde/hacia archivo JSON
 */
class ConnectionManager {
  private connectionsPath: string;
  private config: ConnectionsConfig;

  constructor() {
    const connectionsFile =
      process.env.FS_CONNECTIONS_FILE ||
      path.join(process.env.CLAUDE_PLUGIN_DATA || "./", "connections.json");

    this.connectionsPath = connectionsFile;
    this.config = this.loadConnections();
  }

  /**
   * Carga las conexiones desde el archivo JSON
   * Si el archivo no existe, crea uno vacío y lanza error
   */
  private loadConnections(): ConnectionsConfig {
    try {
      if (!fs.existsSync(this.connectionsPath)) {
        this.createEmptyConnectionsFile();
        throw new Error(
          `Archivo de configuración no encontrado: ${this.connectionsPath}\n` +
            "Por favor, configura al menos una conexión usando: fs-mcp:add-connection\n" +
            "Se ha creado un archivo connections.json vacío. Actualízalo con tus credenciales."
        );
      }

      const rawData = fs.readFileSync(this.connectionsPath, "utf-8");
      const parsed = JSON.parse(rawData) as ConnectionsConfig;

      if (!parsed.connections || Object.keys(parsed.connections).length === 0) {
        throw new Error(
          "No hay conexiones configuradas en connections.json\n" +
            "Por favor, añade al menos una conexión usando: fs-mcp:add-connection"
        );
      }

      return parsed;
    } catch (error) {
      if (error instanceof Error && error.message.includes("no hay conexiones")) {
        throw error;
      }
      if (
        error instanceof Error &&
        error.message.includes("Por favor, configura")
      ) {
        throw error;
      }
      throw new Error(`Error al cargar conexiones: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Crea un archivo connections.json vacío con estructura base
   */
  private createEmptyConnectionsFile(): void {
    const emptyConfig: ConnectionsConfig = {
      default: "",
      connections: {},
    };

    const dir = path.dirname(this.connectionsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      this.connectionsPath,
      JSON.stringify(emptyConfig, null, 2),
      "utf-8"
    );
  }

  /**
   * Persiste la configuración actual al archivo JSON
   */
  private saveConnections(): void {
    const dir = path.dirname(this.connectionsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      this.connectionsPath,
      JSON.stringify(this.config, null, 2),
      "utf-8"
    );
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
    isDefault: boolean;
  }> {
    return Object.entries(this.config.connections).map(([key, config]) => ({
      key,
      name: config.name,
      url: config.url,
      isDefault: key === this.config.default,
    }));
  }

  /**
   * Añade o actualiza una conexión
   * @param key - Identificador único de la conexión
   * @param config - Configuración de la conexión
   */
  addConnection(key: string, config: ConnectionConfig): void {
    if (!key || key.trim() === "") {
      throw new Error("La clave de conexión no puede estar vacía");
    }

    if (!config.name || !config.url || !config.token) {
      throw new Error(
        "La configuración debe incluir: name, url y token"
      );
    }

    this.config.connections[key] = config;

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
