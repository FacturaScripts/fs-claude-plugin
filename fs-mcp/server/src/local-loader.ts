/**
 * Cargador dinámico de módulos locales privados.
 *
 * Lee módulos desde la ruta indicada por la variable de entorno FS_LOCAL_MODULES_PATH.
 * Si no está definida, intenta cargar desde dist/modules-local/ (útil en desarrollo local).
 *
 * Soporta dos estructuras:
 *
 *   1. Módulos en la raíz del directorio:
 *      <modules-dir>/mi-modulo/index.js
 *
 *   2. Módulos agrupados en subcarpetas:
 *      <modules-dir>/MiGrupo/mi-modulo/index.js
 *      <modules-dir>/MiGrupo/manifest.json     (opcional)
 *      <modules-dir>/MiGrupo/descriptions.json (opcional)
 *
 * En ambos casos, cada módulo debe ser una carpeta con un index.js que exporte:
 *   - registerTools(toolsMap: Map<string, Tool>): Promise<void>
 *   - handleTool(name: string, args: Record<string, unknown>, client: fsClient): Promise<ToolResult | null>
 */

import { readdirSync, existsSync, statSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath, pathToFileURL } from 'url';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from './fs/client.js';
import { registerModelMetadata } from './metadata/registry.js';
import type { ModelMetadata } from './metadata/types.js';

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
 * Lee la ruta de módulos privados desde ~/.fs-claude.json (settings.localModulesPath).
 * Es la fuente de verdad unificada para toda la configuración del plugin.
 */
function readLocalModulesPathFromFsConfig(): string | undefined {
  try {
    const fsClaudePath = join(homedir(), '.fs-claude.json');
    if (!existsSync(fsClaudePath)) return undefined;

    const config = JSON.parse(readFileSync(fsClaudePath, 'utf-8')) as Record<string, unknown>;
    const settings = config['settings'] as Record<string, unknown> | undefined;
    const localModulesPath = settings?.['localModulesPath'] as string | undefined;
    if (localModulesPath && localModulesPath.trim() !== '') return localModulesPath.trim();
  } catch {
    // Silencioso: si no puede leer la configuración, continúa sin módulos locales
  }
  return undefined;
}

/**
 * Carga un único módulo desde su directorio.
 * Registra sus tools en el mapa global y agrega su handler al array.
 */
async function loadSingleModule(
  entryPath: string,
  displayName: string,
  toolsMap: Map<string, Tool>,
  handlers: LocalModuleHandler[],
): Promise<void> {
  const indexPath = join(entryPath, 'index.js');
  if (!existsSync(indexPath)) {
    console.error(`[local-loader] Módulo "${displayName}" no tiene index.js — omitido`);
    return;
  }

  try {
    const moduleUrl = pathToFileURL(indexPath).href;
    // Dynamic import — los módulos locales son plain JS (ES modules)
    const mod = await import(moduleUrl) as Record<string, unknown>;

    if (typeof mod['registerTools'] !== 'function' || typeof mod['handleTool'] !== 'function') {
      console.error(
        `[local-loader] Módulo "${displayName}" debe exportar registerTools() y handleTool() — omitido`
      );
      return;
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

    // Si el módulo expone metadata de modelos (campo `modelMetadata`),
    // la registramos en el registry. Los modelos privados conviven con los
    // del core y son accesibles vía describe_model, list_models y los Resources.
    const exportedMetadata = mod['modelMetadata'];
    let metadataCount = 0;
    if (Array.isArray(exportedMetadata)) {
      for (const candidate of exportedMetadata) {
        if (isValidModelMetadata(candidate)) {
          registerModelMetadata(candidate);
          metadataCount += 1;
        } else {
          console.error(
            `[local-loader] Módulo "${displayName}": entrada de modelMetadata inválida — omitida.`,
          );
        }
      }
    }

    const metaSuffix = metadataCount > 0 ? ` (+${metadataCount} modelos)` : '';
    console.error(`[local-loader] ✓ Módulo local cargado: ${displayName}${metaSuffix}`);
  } catch (err) {
    console.error(`[local-loader] Error cargando módulo "${displayName}":`, err);
  }
}

/**
 * Comprueba si un directorio es un grupo de módulos (no tiene index.js propio
 * pero contiene subdirectorios que sí pueden tenerlo).
 */
function isModuleGroup(dirPath: string): boolean {
  let entries: string[];
  try {
    entries = readdirSync(dirPath, { encoding: 'utf8' });
  } catch {
    return false;
  }

  for (const entry of entries) {
    const entryPath = join(dirPath, entry);
    try {
      if (statSync(entryPath).isDirectory()) return true;
    } catch {
      // ignorar
    }
  }
  return false;
}

/**
 * Carga todos los módulos locales desde la ruta configurada en ~/.fs-claude.json
 * (settings.localModulesPath), con fallback a dist/modules-local si no está configurada.
 *
 * Soporta dos niveles de organización:
 *   - Módulos directamente en la raíz: <dir>/modulo/index.js
 *   - Módulos agrupados en subcarpetas: <dir>/Grupo/modulo/index.js
 */
export async function loadLocalModules(toolsMap: Map<string, Tool>): Promise<LocalModuleHandler[]> {
  // Prioridad 1: FS_LOCAL_MODULES_PATH env var (compatibilidad, solo si está interpolada)
  const envPath = process.env['FS_LOCAL_MODULES_PATH'];
  const isInterpolated = envPath !== undefined && envPath.trim() !== '' && !envPath.includes('${');

  // Prioridad 2: ~/.fs-claude.json → settings.localModulesPath
  const resolvedPath = isInterpolated
    ? envPath!.trim()
    : readLocalModulesPathFromFsConfig();

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

    if (existsSync(indexPath)) {
      // Módulo directo en la raíz
      await loadSingleModule(entryPath, entry, toolsMap, handlers);
    } else if (isModuleGroup(entryPath)) {
      // Grupo de módulos en subcarpeta — cargar cada módulo del grupo
      let subEntries: string[];
      try {
        subEntries = readdirSync(entryPath, { encoding: 'utf8' });
      } catch (err) {
        console.error(`[local-loader] No se pudo leer el grupo "${entry}":`, err);
        continue;
      }

      let groupCount = 0;
      for (const subEntry of subEntries) {
        const subEntryPath = join(entryPath, subEntry);

        try {
          if (!statSync(subEntryPath).isDirectory()) continue;
        } catch {
          continue;
        }

        const subIndexPath = join(subEntryPath, 'index.js');
        if (!existsSync(subIndexPath)) continue;

        // Nombre de display incluye el grupo para facilitar el diagnóstico
        await loadSingleModule(subEntryPath, `${entry}/${subEntry}`, toolsMap, handlers);
        groupCount += 1;
      }

      if (groupCount > 0) {
        console.error(`[local-loader] ✓ Grupo "${entry}": ${groupCount} módulo(s) cargado(s)`);
      } else {
        console.error(`[local-loader] Grupo "${entry}" sin módulos con index.js — omitido`);
      }
    } else {
      console.error(`[local-loader] Directorio "${entry}" sin index.js ni submódulos — omitido`);
    }
  }

  if (handlers.length > 0) {
    console.error(
      `[local-loader] ${handlers.length} módulo(s) local(es) cargado(s) desde: ${localModulesDir}`
    );
  }

  return handlers;
}

/**
 * Valida superficialmente que un objeto cumple con la forma de ModelMetadata.
 * No comprueba todos los campos opcionales, solo los obligatorios para que el
 * registry pueda usarlo sin romperse.
 */
function isValidModelMetadata(value: unknown): value is ModelMetadata {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['name'] === 'string' &&
    typeof v['table'] === 'string' &&
    typeof v['endpoint'] === 'string' &&
    typeof v['primaryKey'] === 'string' &&
    typeof v['description'] === 'string' &&
    typeof v['source'] === 'string' &&
    Array.isArray(v['columns']) &&
    Array.isArray(v['relations']) &&
    typeof v['generatedFrom'] === 'object' && v['generatedFrom'] !== null
  );
}
