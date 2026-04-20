/**
 * Cargador dinámico de módulos locales privados.
 *
 * Lee módulos desde la ruta indicada por la variable de entorno FS_LOCAL_MODULES_PATH.
 * Si no está definida, intenta cargar desde dist/modules-local/ (útil en desarrollo local).
 *
 * Cada módulo debe ser una carpeta con un index.js que exporte:
 *   - registerTools(toolsMap: Map<string, Tool>): Promise<void>
 *   - handleTool(name: string, args: Record<string, unknown>, client: fsClient): Promise<ToolResult | null>
 */

import { readdirSync, existsSync, statSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath, pathToFileURL } from 'url';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from './fs/client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type ToolResult = { content: [{ type: 'text'; text: string }]; isError?: boolean };

/**
 * Interfaz que expone el handler de cada módulo local ya cargado.
 * El client queda capturado en el closure del loader.
 */
export interface LocalModuleHandler {
  handleTool(name: string, args: Record<string, unknown>): Promise<ToolResult | null>;
}

/**
 * Claude Code no interpola las opciones de usuario (FS_LOCAL_MODULES_PATH) en las variables de
 * entorno del MCP. Las pasa como template literal sin resolver (ej: "${FS_LOCAL_MODULES_PATH}").
 * Este helper lee el valor real desde ~/.claude/settings.json como fallback.
 */
function readLocalModulesPathFromSettings(): string | undefined {
  try {
    const settingsPath = join(homedir(), '.claude', 'settings.json');
    if (!existsSync(settingsPath)) return undefined;

    const settings = JSON.parse(readFileSync(settingsPath, 'utf-8')) as Record<string, unknown>;
    const pluginConfigs = settings['pluginConfigs'] as Record<string, unknown> | undefined;
    if (!pluginConfigs) return undefined;

    // Buscar en todas las entradas de pluginConfigs la opción FS_LOCAL_MODULES_PATH
    for (const config of Object.values(pluginConfigs)) {
      const options = (config as Record<string, unknown>)['options'] as Record<string, unknown> | undefined;
      const path = options?.['FS_LOCAL_MODULES_PATH'] as string | undefined;
      if (path && path.trim() !== '') return path.trim();
    }
  } catch {
    // Silencioso: si no puede leer la configuración, continúa sin módulos locales
  }
  return undefined;
}

/**
 * Carga todos los módulos locales desde FS_LOCAL_MODULES_PATH (o fallback a dist/modules-local).
 * Registra sus tools en el mapa global y devuelve un array de handlers para el dispatcher.
 */
export async function loadLocalModules(toolsMap: Map<string, Tool>): Promise<LocalModuleHandler[]> {
  // Claude Code no interpola las variables de usuario en el entorno del MCP (las pasa como
  // "${FS_LOCAL_MODULES_PATH}" literalmente). Detectamos ese caso y leemos desde settings.json.
  const envPath = process.env['FS_LOCAL_MODULES_PATH'];
  const isInterpolated = envPath !== undefined && envPath.trim() !== '' && !envPath.includes('${');

  const resolvedPath = isInterpolated
    ? envPath!.trim()
    : readLocalModulesPathFromSettings();

  const localModulesDir = resolvedPath ?? join(__dirname, 'modules-local');

  if (!existsSync(localModulesDir)) {
    if (resolvedPath) {
      console.error(
        `[local-loader] FS_LOCAL_MODULES_PATH apunta a un directorio que no existe: ${localModulesDir}`
      );
    }
    return [];
  }

  let entries: string[];
  try {
    entries = readdirSync(localModulesDir, { encoding: 'utf8' });
  } catch (err) {
    console.error('[local-loader] No se pudo leer el directorio de módulos locales:', err);
    return [];
  }

  const handlers: LocalModuleHandler[] = [];

  for (const entry of entries) {
    const entryPath = join(localModulesDir, entry);

    // Solo procesar subdirectorios
    try {
      if (!statSync(entryPath).isDirectory()) continue;
    } catch {
      continue;
    }

    const indexPath = join(entryPath, 'index.js');

    if (!existsSync(indexPath)) {
      console.error(`[local-loader] Módulo "${entry}" no tiene index.js — omitido`);
      continue;
    }

    try {
      const moduleUrl = pathToFileURL(indexPath).href;
      // Dynamic import — los módulos locales son plain JS (ES modules)
      const mod = await import(moduleUrl) as Record<string, unknown>;

      if (typeof mod['registerTools'] !== 'function' || typeof mod['handleTool'] !== 'function') {
        console.error(
          `[local-loader] Módulo "${entry}" debe exportar registerTools() y handleTool() — omitido`
        );
        continue;
      }

      const registerFn = mod['registerTools'] as (map: Map<string, Tool>) => Promise<void>;
      const handleFn = mod['handleTool'] as (
        name: string,
        args: Record<string, unknown>,
        client: typeof fsClient
      ) => Promise<ToolResult | null>;

      await registerFn(toolsMap);

      // Capturamos el client en el closure para que los módulos no necesiten importarlo
      handlers.push({
        handleTool: (name, args) => handleFn(name, args, fsClient),
      });

      console.error(`[local-loader] ✓ Módulo local cargado: ${entry}`);
    } catch (err) {
      console.error(`[local-loader] Error cargando módulo "${entry}":`, err);
    }
  }

  if (handlers.length > 0) {
    console.error(
      `[local-loader] ${handlers.length} módulo(s) local(es) cargado(s) desde: ${localModulesDir}`
    );
  }

  return handlers;
}
