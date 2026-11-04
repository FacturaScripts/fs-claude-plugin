/**
 * Empaquetado del zip de una versión de un plugin o del core de FacturaScripts, listo para subirlo a Forja.
 *
 * Reproduce las reglas con las que se empaquetan los plugins a mano (copia sin archivos ocultos y zip sin la
 * carpeta Test, con permisos 0755 en carpetas y 0644 en archivos, dentro de una carpeta raíz con el nombre del
 * plugin) y les suma lo que Forja quita al publicar: archivos de asistentes de IA, la carpeta Doc y los metadatos
 * del sistema. Así el zip llega a Forja tal y como lo recibirá quien lo descargue.
 *
 * - Plugin: carpeta con un facturascripts.ini; la carpeta raíz del zip es su name y la versión, su version.
 * - Core: carpeta con Core/Kernel.php y sin facturascripts.ini; la carpeta raíz es facturascripts (la que espera
 *   el actualizador) y la versión, la de Kernel::version(). Además quita Plugins, Dinamic, MyFiles y los config*.php.
 *
 * Con includeDocs, el zip conserva Doc/User, Doc/Dev, Doc/Assets y Doc/forja.json para que Forja importe la
 * documentación al publicar la versión; Forja la quita después del zip guardado. Doc/Context nunca se incluye.
 *
 * El zip se escribe sin dependencias externas (deflate de zlib y CRC-32 propio) en una carpeta temporal propia,
 * que es la única de la que forja_upload_build borra zips tras subirlos.
 */
/** Grupos de entradas que se quitan del zip, con el motivo que se muestra en el resumen. */
export declare const EXCLUDE_REASONS: {
    readonly hidden: "archivos y carpetas ocultos (.git, .github, .claude, .agents, .DS_Store, .gitignore...)";
    readonly test: "carpeta Test de la raíz";
    readonly doc: "carpeta Doc de la raíz, o lo que no es documentación publicable con include_docs (Forja no la reparte)";
    readonly ai: "archivos de asistentes de IA (CLAUDE.md, AGENTS.md...)";
    readonly system: "metadatos del sistema (__MACOSX, Thumbs.db, desktop.ini)";
    readonly symlink: "enlaces simbólicos (Forja no los admite)";
    readonly core: "carpetas y archivos locales del core (Plugins, Dinamic, MyFiles, config*.php)";
};
export type ExcludeReason = keyof typeof EXCLUDE_REASONS;
/**
 * Datos del proyecto que se empaqueta.
 */
export interface ProjectInfo {
    /** plugin o core. */
    type: 'plugin' | 'core';
    /** Nombre: el name del facturascripts.ini o facturascripts para el core. */
    name: string;
    /** Versión del facturascripts.ini o de Kernel::version(). */
    version: string;
    /** Carpeta raíz dentro del zip. */
    root: string;
}
/**
 * Resumen de lo excluido en un grupo.
 */
export interface ExcludedGroup {
    reason: string;
    count: number;
    /** Primeras rutas excluidas (relativas a la carpeta del proyecto); las carpetas acaban en /. */
    sample: string[];
}
/**
 * Resultado del empaquetado.
 */
export interface BuildZipResult extends ProjectInfo {
    /** Ruta absoluta del zip creado. */
    path: string;
    /** Carpeta de origen. */
    source: string;
    /** Archivos incluidos (sin contar carpetas). */
    files: number;
    /** Tamaño del zip en bytes. */
    bytes: number;
    /** Tamaño sin comprimir de los archivos incluidos. */
    uncompressed_bytes: number;
    /** Lo que se ha quitado, por grupo; solo aparecen los grupos con entradas. */
    excluded: Partial<Record<ExcludeReason, ExcludedGroup>>;
    /** Avisos que no impiden crear el zip. */
    warnings: string[];
}
/**
 * Carpeta temporal propia donde se crean los zips. forja_upload_build solo borra zips de dentro de ella.
 *
 * @returns Ruta de la carpeta (sin crear)
 */
export declare function buildZipBaseDir(): string;
/**
 * Indica si un archivo está dentro de la carpeta temporal de zips de la herramienta, comparando rutas reales.
 *
 * @param file - Ruta del archivo
 * @returns true si está dentro de esa carpeta
 */
export declare function isToolBuildZip(file: string): Promise<boolean>;
/**
 * Borra un zip creado por la herramienta y su carpeta temporal, si queda vacía.
 *
 * @param file - Ruta del zip
 * @returns true si se ha borrado; false si no es un zip de la herramienta
 */
export declare function removeToolBuildZip(file: string): Promise<boolean>;
/**
 * Lee un facturascripts.ini con el mismo criterio que parse_ini_string para las claves simples: `clave = valor`,
 * con comillas opcionales y comentarios con ; o #.
 *
 * @param content - Contenido del archivo
 * @returns Claves y valores
 */
export declare function parseIni(content: string): Record<string, string>;
/**
 * Identifica el proyecto de una carpeta: un plugin (facturascripts.ini) o el core (Core/Kernel.php).
 *
 * @param source - Carpeta del proyecto
 * @returns Tipo, nombre, versión y carpeta raíz del zip
 * @throws Error si la carpeta no es un plugin ni el core, o le faltan el nombre o la versión
 */
export declare function readProjectInfo(source: string): Promise<ProjectInfo>;
/**
 * Motivo por el que se excluye una entrada, o null si se incluye.
 *
 * @param parts - Partes de la ruta relativa a la carpeta del proyecto
 * @param isDirectory - Si la entrada es una carpeta
 * @param type - Tipo de proyecto
 * @param includeDocs - Si se conserva la documentación publicable de Doc
 * @returns Grupo de exclusión o null
 */
export declare function excludeReason(parts: string[], isDirectory: boolean, type: ProjectInfo['type'], includeDocs?: boolean): ExcludeReason | null;
/**
 * Calcula el CRC-32 de un contenido.
 *
 * @param data - Contenido
 * @returns CRC-32 sin signo
 */
export declare function crc32(data: Buffer): number;
/**
 * Crea el zip de una versión de un plugin o del core en una carpeta temporal propia.
 *
 * @param source - Carpeta absoluta del plugin o del core
 * @param includeDocs - Conserva Doc/User, Doc/Dev, Doc/Assets y Doc/forja.json para que Forja importe la documentación
 * @returns Ruta del zip, datos del proyecto y resumen de lo excluido
 * @throws Error si la carpeta no es válida o el zip no lo sería para Forja
 */
export declare function buildProjectZip(source: string, includeDocs?: boolean): Promise<BuildZipResult>;
//# sourceMappingURL=build-zip.d.ts.map