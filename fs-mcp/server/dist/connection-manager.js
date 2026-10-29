import { randomUUID } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
/**
 * Gestor centralizado de conexiones multi-instancia a FacturaScripts
 * Lee y persiste configuración desde/hacia archivo JSON
 *
 * Prioridad de ubicación:
 * 1. ~/.fs-claude.json (automático, cross-platform, sin configuración necesaria)
 * 2. FS_CONNECTIONS_FILE env var (compatibilidad con configuraciones existentes)
 */
class ConnectionManager {
    connectionsPath;
    useFsClaudeFormat;
    config;
    constructor() {
        // Prioridad 1: ~/.fs-claude.json — encontrado automáticamente en cualquier SO
        const fsClaudePath = path.join(os.homedir(), ".fs-claude.json");
        // Prioridad 2: FS_CONNECTIONS_FILE env var (ignorar placeholders sin expandir)
        const rawConnectionsFile = process.env.FS_CONNECTIONS_FILE;
        const resolvedConnectionsFile = rawConnectionsFile && !rawConnectionsFile.startsWith("${")
            ? rawConnectionsFile
            : null;
        this.connectionsPath = resolvedConnectionsFile || fsClaudePath;
        this.useFsClaudeFormat = this.connectionsPath === fsClaudePath;
        if (resolvedConnectionsFile) {
            console.error(`[fs-mcp] Usando archivo de conexiones desde FS_CONNECTIONS_FILE: ${resolvedConnectionsFile}`);
        }
        else {
            console.error(`[fs-mcp] Usando archivo de configuración unificado: ${fsClaudePath}`);
        }
        this.config = this.loadConnections();
    }
    /**
     * Carga las conexiones desde el archivo JSON.
     * Si el archivo no existe, crea uno vacío y continúa sin lanzar error.
     * El servidor arranca siempre; el error se produce al intentar usar una conexión.
     */
    loadConnections() {
        const emptyConfig = { default: "", connections: {} };
        try {
            if (!fs.existsSync(this.connectionsPath)) {
                this.createEmptyConnectionsFile();
                console.error(`[fs-mcp] Archivo de conexiones no encontrado: ${this.connectionsPath}\n` +
                    "[fs-mcp] Usa fs-mcp:add-connection para configurar una conexión.");
                return emptyConfig;
            }
            const rawData = fs.readFileSync(this.connectionsPath, "utf-8");
            const parsed = JSON.parse(rawData);
            // Formato ~/.fs-claude.json: las conexiones están en la clave "connections"
            const connectionsData = this.useFsClaudeFormat
                ? parsed.connections ?? emptyConfig
                : parsed;
            if (!connectionsData || !connectionsData.connections) {
                return emptyConfig;
            }
            if (Object.keys(connectionsData.connections).length === 0) {
                console.error("[fs-mcp] No hay conexiones configuradas\n" +
                    "[fs-mcp] Usa fs-mcp:add-connection para añadir una conexión.");
            }
            return connectionsData;
        }
        catch (error) {
            console.error(`[fs-mcp] Error al cargar conexiones: ${error instanceof Error ? error.message : String(error)}`);
            return emptyConfig;
        }
    }
    /**
     * Crea el archivo de conexiones vacío con la estructura adecuada al formato.
     * Contiene los tokens de la API, así que se crea legible sólo por su dueño (0600).
     */
    createEmptyConnectionsFile() {
        const dir = path.dirname(this.connectionsPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (this.useFsClaudeFormat) {
            // Crear ~/.fs-claude.json con estructura completa
            const fsClaudeConfig = {
                version: "1.0",
                connections: { default: "", connections: {} },
                settings: { sortClassMembers: true, updateCopyright: true },
            };
            fs.writeFileSync(this.connectionsPath, JSON.stringify(fsClaudeConfig, null, 2), { encoding: "utf-8", mode: 0o600 });
        }
        else {
            // Formato plano legacy
            const emptyConfig = { default: "", connections: {} };
            fs.writeFileSync(this.connectionsPath, JSON.stringify(emptyConfig, null, 2), { encoding: "utf-8", mode: 0o600 });
        }
    }
    /**
     * Persiste en el archivo JSON la configuración indicada.
     *
     * Si el archivo existe pero no es un objeto JSON válido, no se escribe:
     * sobrescribirlo borraría las conexiones (y los ajustes) que contiene y que no
     * se pudieron interpretar.
     */
    saveConnections(config) {
        const dir = path.dirname(this.connectionsPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        let existingConfig = undefined;
        if (fs.existsSync(this.connectionsPath)) {
            try {
                existingConfig = JSON.parse(fs.readFileSync(this.connectionsPath, "utf-8"));
            }
            catch (error) {
                throw new Error(`No se guarda la conexión: ${this.connectionsPath} no es un JSON válido y se perdería su contenido. ` +
                    `Corrígelo a mano y vuelve a intentarlo (${error instanceof Error ? error.message : String(error)})`);
            }
            if (existingConfig === null || typeof existingConfig !== "object" || Array.isArray(existingConfig)) {
                throw new Error(`No se guarda la conexión: ${this.connectionsPath} no es un objeto JSON y se perdería su contenido. ` +
                    "Corrígelo a mano y vuelve a intentarlo");
            }
        }
        if (this.useFsClaudeFormat) {
            // Conservar "settings" y otras claves del archivo completo
            const fsClaudeConfig = existingConfig !== undefined
                ? existingConfig
                : {
                    version: "1.0",
                    connections: { default: "", connections: {} },
                    settings: { sortClassMembers: true, updateCopyright: true },
                };
            fsClaudeConfig.connections = config;
            this.writeFileAtomic(JSON.stringify(fsClaudeConfig, null, 2));
        }
        else {
            this.writeFileAtomic(JSON.stringify(config, null, 2));
        }
    }
    /**
     * Escribe el archivo de conexiones a través de un temporal en el mismo
     * directorio y un rename, para que una escritura interrumpida no lo deje a medias.
     * El rename sustituye el archivo por el temporal, con sus permisos: se crea
     * 0600 porque contiene los tokens de la API. El nombre es aleatorio y se abre
     * en exclusiva ("wx") para no escribir a través de un enlace ya plantado ahí.
     */
    writeFileAtomic(content) {
        const tmpPath = `${this.connectionsPath}.${randomUUID()}.tmp`;
        try {
            fs.writeFileSync(tmpPath, content, { encoding: "utf-8", mode: 0o600, flag: "wx" });
            fs.renameSync(tmpPath, this.connectionsPath);
        }
        catch (error) {
            fs.rmSync(tmpPath, { force: true });
            throw error;
        }
    }
    /**
     * Obtiene una conexión por clave o la conexión por defecto
     * @param key - Clave de la conexión (opcional, usa default si no se proporciona)
     * @returns Configuración de la conexión
     * @throws Error si la conexión no existe
     */
    getConnection(key) {
        const connectionKey = key || this.config.default;
        if (!connectionKey) {
            throw new Error("No hay conexión por defecto configurada y no se proporcionó ninguna clave");
        }
        const connection = this.config.connections[connectionKey];
        if (!connection) {
            throw new Error(`Conexión no encontrada: "${connectionKey}". Conexiones disponibles: ${Object.keys(this.config.connections).join(", ")}`);
        }
        return connection;
    }
    /**
     * Lista todas las conexiones disponibles
     * @returns Array de objetos con información resumida de cada conexión
     */
    listConnections() {
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
    addConnection(key, config) {
        if (!key || key.trim() === "") {
            throw new Error("La clave de conexión no puede estar vacía");
        }
        if (!config.name || !config.url || !config.token) {
            throw new Error("La configuración debe incluir: name, url y token");
        }
        // Se guarda antes de aplicarlo: si no se puede guardar, la sesión sigue
        // con la configuración anterior en vez de usar una que no consta en el archivo
        const next = {
            ...this.config,
            connections: { ...this.config.connections, [key]: config },
        };
        // Si es la primera conexión, establécela como predeterminada
        if (!next.default || next.default === "") {
            next.default = key;
        }
        this.saveConnections(next);
        this.config = next;
    }
    /**
     * Establece la conexión por defecto
     * @param key - Clave de la conexión a establecer como predeterminada
     * @throws Error si la conexión no existe
     */
    setDefault(key) {
        if (!this.config.connections[key]) {
            throw new Error(`No se puede establecer como predeterminada: conexión "${key}" no existe`);
        }
        const next = { ...this.config, default: key };
        this.saveConnections(next);
        this.config = next;
    }
}
/**
 * Instancia singleton del gestor de conexiones
 */
export const connectionManager = new ConnectionManager();
export default connectionManager;
//# sourceMappingURL=connection-manager.js.map