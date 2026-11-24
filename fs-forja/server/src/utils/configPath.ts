/**
 * Resolución de la ruta del archivo de configuración compartido por los plugins fs-ai.
 *
 * El archivo actual es `~/.fs-ai.json`. Las instalaciones anteriores al cambio de nombre del marketplace
 * (fs-claude-plugin → fs-ai-plugin) lo tienen en `~/.fs-claude.json`, que se sigue usando mientras no exista
 * el nuevo para no perder sus conexiones ni sus ajustes.
 */
import fs from "fs";
import os from "os";
import path from "path";

/** Nombre del archivo de configuración actual. */
export const CONFIG_FILE_NAME = ".fs-ai.json";

/** Nombre del archivo de configuración antiguo, que se lee como respaldo. */
export const LEGACY_CONFIG_FILE_NAME = ".fs-claude.json";

/**
 * Devuelve la ruta del archivo de configuración compartido.
 *
 * Usa `~/.fs-ai.json`; si no existe y sí existe el antiguo `~/.fs-claude.json`, devuelve el antiguo. Si no
 * existe ninguno, devuelve `~/.fs-ai.json`, que es donde se creará.
 *
 * @param home - Directorio home del usuario; por defecto, el del sistema.
 * @returns Ruta absoluta del archivo de configuración.
 */
export function resolveConfigPath(home: string = os.homedir()): string {
  const current = path.join(home, CONFIG_FILE_NAME);
  const legacy = path.join(home, LEGACY_CONFIG_FILE_NAME);
  if (!fs.existsSync(current) && fs.existsSync(legacy)) {
    return legacy;
  }
  return current;
}
