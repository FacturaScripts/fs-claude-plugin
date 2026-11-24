import type { ConnectionConfig, ConnectionType } from "./types/facturascripts.js";
/**
 * Normaliza la URL base de una instalación: quita las barras finales y, si se ha pegado la URL de la API,
 * su ruta final (`/api/3` o `/api/3/forja`), porque los clientes ya la añaden por su cuenta.
 *
 * @param url - URL indicada por el usuario o guardada en el archivo de conexiones
 * @returns URL base sin barra final, por ejemplo `https://facturascripts.com`
 */
export declare function normalizeBaseUrl(url: string): string;
/**
 * Gestor centralizado de conexiones multi-instancia a FacturaScripts
 * Lee y persiste configuración desde/hacia archivo JSON
 *
 * Prioridad de ubicación:
 * 1. ~/.fs-claude.json (automático, cross-platform, sin configuración necesaria)
 * 2. FS_CONNECTIONS_FILE env var (compatibilidad con configuraciones existentes)
 */
declare class ConnectionManager {
    private connectionsPath;
    private useFsClaudeFormat;
    private config;
    constructor();
    /**
     * Carga las conexiones desde el archivo JSON.
     * Si el archivo no existe, crea uno vacío y continúa sin lanzar error.
     * El servidor arranca siempre; el error se produce al intentar usar una conexión.
     */
    private loadConnections;
    /**
     * Borra los temporales de guardados que no terminaron (el proceso murió entre
     * la escritura y el rename), que contienen los tokens. Sólo los que tienen
     * más de unos minutos, para no llevarse el de un guardado en curso de otro
     * proceso. Si uno no se puede borrar, se avisa y se sigue con los demás; uno
     * que ya no está (lo ha borrado otro proceso) no es un error.
     */
    private removeStaleTemporaries;
    /**
     * Deja en 0600 un archivo de conexiones que otras cuentas pueden leer: uno
     * creado antes de que se crearan así seguiría legible hasta el primer guardado.
     * Si no se puede (el archivo es de otra cuenta), se avisa y se sigue cargando.
     */
    private restrictPermissions;
    /**
     * Crea el archivo de conexiones vacío con la estructura adecuada al formato.
     * Contiene los tokens de la API, así que se crea legible sólo por su dueño (0600).
     *
     * Se crea en exclusiva ("wx"): si otro proceso lo ha creado entre la
     * comprobación y la escritura (la skill add-connection mientras arranca el
     * servidor), no se trunca y devuelve false para que se lea el suyo.
     */
    private createEmptyConnectionsFile;
    /**
     * Aplica un cambio sobre las conexiones recién leídas del archivo, lo guarda
     * y devuelve la configuración resultante.
     *
     * El cambio se aplica sobre lo que hay en el archivo y no sobre la copia en
     * memoria, que puede estar vacía (el archivo estaba roto al arrancar y se ha
     * corregido después) o desfasada (otra sesión o la skill add-connection lo ha
     * modificado). Guardar la copia en memoria borraría esas conexiones.
     *
     * Si el archivo existe pero no es un objeto JSON válido, no se escribe:
     * sobrescribirlo borraría las conexiones (y los ajustes) que contiene y que no
     * se pudieron interpretar. Un archivo vacío no tiene nada que perder y se
     * rehace como si no existiera.
     */
    private saveConnections;
    /** Completa con valores vacíos lo que falte de una configuración leída del archivo. */
    private withDefaults;
    /**
     * Escribe el archivo de conexiones a través de un temporal en el mismo
     * directorio y un rename, para que una escritura interrumpida no lo deje a medias.
     * El rename sustituye el archivo por el temporal, con sus permisos: se crea
     * 0600 porque contiene los tokens de la API. El nombre es aleatorio y se abre
     * en exclusiva ("wx") para no escribir a través de un enlace ya plantado ahí.
     *
     * Si el archivo es un enlace simbólico (gestionado desde un repositorio de
     * dotfiles, por ejemplo), se escribe en su destino: el rename sustituiría el
     * enlace por un archivo normal y el destino no recibiría el cambio.
     *
     * El temporal se lleva a disco (fsync) antes del rename: sin eso, un corte de
     * luz puede dejar el archivo renombrado con 0 bytes, y uno vacío se rehace.
     */
    private writeFileAtomic;
    /**
     * Ruta del archivo de conexiones con los enlaces simbólicos resueltos; la
     * misma si aún no existe. Un enlace roto se sigue hasta su destino, como hacen
     * las skills (Path.resolve()): el guardado crea allí el archivo en vez de
     * sustituir el enlace, y si falta el directorio del destino, falla.
     */
    private realConnectionsPath;
    /**
     * Obtiene una conexión por clave o la conexión por defecto
     * @param key - Clave de la conexión (opcional, usa default si no se proporciona)
     * @returns Configuración de la conexión
     * @throws Error si la conexión no existe
     */
    getConnection(key?: string): ConnectionConfig;
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
    }>;
    /**
     * Devuelve la clave de la primera conexión configurada de un tipo concreto.
     * Las conexiones sin `type` se consideran de tipo `api`.
     * @param type - Tipo de conexión buscado
     * @returns Clave de la conexión o undefined si no hay ninguna de ese tipo
     */
    findFirstKeyByType(type: ConnectionType): string | undefined;
    /**
     * Añade una conexión o, si se indica `overwrite`, sustituye la que tenga la misma clave.
     * La URL se guarda normalizada con `normalizeBaseUrl`.
     * @param key - Identificador único de la conexión
     * @param config - Configuración de la conexión
     * @param overwrite - Permite sustituir una conexión existente con la misma clave (por defecto, false)
     * @throws Error si la clave ya existe y no se permite sobrescribir, o si faltan datos
     */
    addConnection(key: string, config: ConnectionConfig, overwrite?: boolean): void;
    /**
     * Establece la conexión por defecto
     * @param key - Clave de la conexión a establecer como predeterminada
     * @throws Error si la conexión no existe
     */
    setDefault(key: string): void;
}
/**
 * Instancia singleton del gestor de conexiones
 */
export declare const connectionManager: ConnectionManager;
export default connectionManager;
//# sourceMappingURL=connection-manager.d.ts.map