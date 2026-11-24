/** Nombre del archivo de configuración actual. */
export declare const CONFIG_FILE_NAME = ".fs-ai.json";
/** Nombre del archivo de configuración antiguo, que se lee como respaldo. */
export declare const LEGACY_CONFIG_FILE_NAME = ".fs-claude.json";
/**
 * Devuelve la ruta del archivo de configuración compartido.
 *
 * Usa `~/.fs-ai.json`; si no existe y sí existe el antiguo `~/.fs-claude.json`, devuelve el antiguo. Si no
 * existe ninguno, devuelve `~/.fs-ai.json`, que es donde se creará.
 *
 * @param home - Directorio home del usuario; por defecto, el del sistema.
 * @returns Ruta absoluta del archivo de configuración.
 */
export declare function resolveConfigPath(home?: string): string;
//# sourceMappingURL=configPath.d.ts.map