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

import { readdirSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
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
 * Carga todos los módulos locales desde FS_LOCAL_MODULES_PATH (o fallback a dist/modules-local).
 * Registra sus tools en el mapa global y devuelve un array de handlers para el dispatcher.
 */
export async function loadLocalModules(toolsMap: Map<string, Tool>): Promise<LocalModuleHandler[]> {
  // Env var tiene prioridad; si está vacía o no definida, usa el fallback local
  const envPath = process.env['FS_LOCAL_MODULES_PATH'];
  const localModulesDir = (envPath !== undefined && envPath.trim() !== '')
    ? envPath.trim()
    : join(__dirname, 'modules-local');

  if (!existsSync(localModulesDir)) {
    if (process.env['FS_LOCAL_MODULES_PATH']) {
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
