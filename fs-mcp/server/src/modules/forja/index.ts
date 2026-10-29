/**
 * Módulo Forja del servidor MCP de FacturaScripts.
 *
 * Herramientas `forja_*` para que el autor de un plugin publicado en facturascripts.com gestione sus plugins
 * mediante la API de autor (`/api/3/forja`): alta de plugins nuevos, datos e imágenes, traducciones, documentación,
 * versiones y publicaciones. Solo usan conexiones de tipo forja; por defecto, la primera configurada.
 *
 * El módulo solo transporta archivos: no descomprime ni interpreta el zip de documentación ni el de versiones.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { readdir, readFile, stat, mkdir, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { forjaClient } from '../../fs/forja-client.js';

/** Descripción común del parámetro `connection`. */
const CONNECTION_PROPERTY = {
  type: 'string',
  description:
    'Clave de una conexión de tipo forja (opcional; por defecto, la primera conexión de tipo forja configurada)',
};

/** Descripción común del parámetro `plugin`. */
const PLUGIN_PROPERTY = {
  type: 'string',
  description: 'Nombre (name) del plugin en Forja, por ejemplo "MiPlugin". Solo se admiten plugins de los que eres autor',
};

/** Tipos de publicación admitidos por la API. */
const PUBLICATION_TYPES = ['news', 'user', 'dev'];

/** Tipos de plugin que puede elegir el autor al crearlo. */
const PLUGIN_TYPES = ['free', 'for-sale', 'sponsor', 'private'];

/** Nombre válido de un plugin: empieza por una letra, solo letras, números, - y _, de 3 a 50 caracteres. */
const PLUGIN_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_-]{2,49}$/;

/** Código de idioma válido para un archivo de traducción (por ejemplo es_ES o pt_BR). */
const LANG_PATTERN = /^[A-Za-z]{2,3}_[A-Za-z]{2,3}$/;

/** Resultado que devuelve cada herramienta al servidor MCP. */
type ToolResult = { content: [{ type: 'text'; text: string }]; isError?: boolean };

export const forjaTools: Tool[] = [
  {
    name: 'forja_list_plugins',
    description: 'Forja: lista los plugins de facturascripts.com de los que eres autor',
    inputSchema: {
      type: 'object' as const,
      properties: { connection: CONNECTION_PROPERTY },
      required: [],
    },
  },
  {
    name: 'forja_get_plugin_options',
    description:
      'Forja: devuelve tu cupo de plugins (creados y máximo según tus instalaciones activas), si puedes crear uno nuevo ' +
      'y los tipos, licencias, colecciones y equipos privados admitidos al crearlo',
    inputSchema: {
      type: 'object' as const,
      properties: { connection: CONNECTION_PROPERTY },
      required: [],
    },
  },
  {
    name: 'forja_create_plugin',
    description:
      'Forja: crea un plugin nuevo en facturascripts.com con los mismos límites que la web (email verificado, cupo de plugins ' +
      'y nombre libre). Queda privado hasta que el personal lo apruebe. Consulta antes forja_get_plugin_options',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        name: {
          type: 'string',
          description: 'Nombre del plugin: el mismo que el name de su facturascripts.ini. Empieza por una letra; solo letras, números, - y _ (3-50)',
        },
        type: { type: 'string', enum: PLUGIN_TYPES, description: 'Tipo de plugin (por defecto: free)' },
        license: { type: 'string', description: 'Licencia, una de las de forja_get_plugin_options (por defecto: LGPL)' },
        description: { type: 'string', description: 'Descripción del plugin (opcional)' },
        idcoleccion: { type: 'integer', description: 'Colección del plugin (opcional)' },
        idteam: { type: 'integer', description: 'Equipo privado del plugin (opcional; por defecto, el primero de los tuyos)' },
        idteam_doc: { type: 'integer', description: 'Equipo privado adicional para la documentación (opcional)' },
      },
      required: ['name'],
    },
  },
  {
    name: 'forja_get_plugin',
    description: 'Forja: obtiene los datos de uno de tus plugins publicados en facturascripts.com',
    inputSchema: {
      type: 'object' as const,
      properties: { connection: CONNECTION_PROPERTY, plugin: PLUGIN_PROPERTY },
      required: ['plugin'],
    },
  },
  {
    name: 'forja_update_plugin',
    description:
      'Forja: modifica los datos públicos de uno de tus plugins (descripción, descripción corta, repositorio público, vídeo de YouTube)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        description: { type: 'string', description: 'Descripción larga del plugin' },
        description_short: { type: 'string', description: 'Descripción corta del plugin' },
        publicrepo: { type: 'string', description: 'URL del repositorio público' },
        youtube: { type: 'string', description: 'URL o identificador del vídeo de YouTube' },
      },
      required: ['plugin'],
    },
  },
  {
    name: 'forja_upload_plugin_image',
    description: 'Forja: sube una imagen de uno de tus plugins, opcionalmente en una posición concreta (1-3)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        image_path: { type: 'string', description: 'Ruta absoluta de la imagen local' },
        position: { type: 'integer', minimum: 1, maximum: 3, description: 'Posición de la imagen (1-3, opcional)' },
      },
      required: ['plugin', 'image_path'],
    },
  },
  {
    name: 'forja_delete_plugin_image',
    description: 'Forja: elimina la imagen de una posición (1-3) de uno de tus plugins',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        position: { type: 'integer', minimum: 1, maximum: 3, description: 'Posición de la imagen a eliminar (1-3)' },
      },
      required: ['plugin', 'position'],
    },
  },
  {
    name: 'forja_download_translations',
    description:
      'Forja: descarga las traducciones de uno de tus plugins y las escribe en <plugin_path>/Translation/<idioma>.json, sustituyendo los archivos existentes',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        plugin_path: { type: 'string', description: 'Ruta absoluta de la carpeta local del plugin' },
        lang: { type: 'string', description: 'Código de idioma a descargar, por ejemplo es_ES (opcional; por defecto, todos)' },
      },
      required: ['plugin', 'plugin_path'],
    },
  },
  {
    name: 'forja_upload_translations',
    description:
      'Forja: sube traducciones de uno de tus plugins, bien los archivos <plugin_path>/Translation/*.json (todos o solo lang), ' +
      'bien una sola clave con lang, key y value. Devuelve el informe del servidor',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        plugin_path: { type: 'string', description: 'Ruta absoluta de la carpeta local del plugin (para subir sus archivos de traducción)' },
        lang: { type: 'string', description: 'Código de idioma, por ejemplo es_ES. Obligatorio si se indica key' },
        key: { type: 'string', description: 'Clave de traducción a subir de forma individual' },
        value: { type: 'string', description: 'Texto traducido de la clave indicada en key' },
      },
      required: ['plugin'],
    },
  },
  {
    name: 'forja_download_docs',
    description:
      'Forja: descarga la documentación de uno de tus plugins como zip (User/*.md, Dev/*.md, Assets/ y forja.json) y lo guarda en output_zip. Devuelve solo un resumen',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        type: { type: 'string', enum: ['all', 'user', 'dev'], description: 'Documentación a descargar (por defecto: all)' },
        output_zip: { type: 'string', description: 'Ruta absoluta del zip de salida' },
      },
      required: ['plugin', 'output_zip'],
    },
  },
  {
    name: 'forja_upload_docs',
    description:
      'Forja: sube un zip de documentación de uno de tus plugins (misma estructura que la descarga). Devuelve las páginas creadas, actualizadas, sin cambios y los errores',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        zip_path: { type: 'string', description: 'Ruta absoluta del zip de documentación' },
      },
      required: ['plugin', 'zip_path'],
    },
  },
  {
    name: 'forja_list_builds',
    description: 'Forja: lista las versiones (builds) publicadas de uno de tus plugins',
    inputSchema: {
      type: 'object' as const,
      properties: { connection: CONNECTION_PROPERTY, plugin: PLUGIN_PROPERTY },
      required: ['plugin'],
    },
  },
  {
    name: 'forja_upload_build',
    description:
      'Forja: sube el zip de una nueva versión de uno de tus plugins. Devuelve la versión creada, los archivos quitados del zip y el informe de documentación',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        zip_path: { type: 'string', description: 'Ruta absoluta del zip del plugin' },
        version: { type: 'string', description: 'Número de versión (opcional; por defecto, el del facturascripts.ini del zip)' },
      },
      required: ['plugin', 'zip_path'],
    },
  },
  {
    name: 'forja_list_publications',
    description: 'Forja: lista las publicaciones de uno de tus plugins (noticias, documentación de usuario o de desarrollo)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        type: { type: 'string', enum: PUBLICATION_TYPES, description: 'Tipo de publicación (opcional): news, user o dev' },
      },
      required: ['plugin'],
    },
  },
  {
    name: 'forja_get_publication',
    description: 'Forja: obtiene una publicación de uno de tus plugins',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        id: { type: 'integer', description: 'Identificador de la publicación' },
      },
      required: ['plugin', 'id'],
    },
  },
  {
    name: 'forja_create_publication',
    description:
      'Forja: crea una publicación (noticia o página de documentación) de uno de tus plugins. El cuerpo en Markdown se indica con body o body_file',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        type: { type: 'string', enum: PUBLICATION_TYPES, description: 'Tipo de publicación: news, user o dev' },
        title: { type: 'string', description: 'Título' },
        body: { type: 'string', description: 'Cuerpo en Markdown (alternativa a body_file)' },
        body_file: { type: 'string', description: 'Ruta absoluta de un archivo Markdown con el cuerpo (alternativa a body)' },
        ordernum: { type: 'integer', description: 'Orden dentro de la documentación (opcional)' },
        idparent: { type: 'integer', description: 'Publicación padre (opcional)' },
        youtubeid: { type: 'string', description: 'Identificador de un vídeo de YouTube (opcional)' },
        images: {
          type: 'array',
          items: { type: 'string' },
          description: 'Rutas absolutas de imágenes a adjuntar (opcional)',
        },
      },
      required: ['plugin', 'type', 'title'],
    },
  },
  {
    name: 'forja_update_publication',
    description:
      'Forja: modifica una publicación de uno de tus plugins. Solo se envían los campos indicados; el cuerpo, con body o body_file',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        id: { type: 'integer', description: 'Identificador de la publicación' },
        type: { type: 'string', enum: PUBLICATION_TYPES, description: 'Tipo de publicación: news, user o dev' },
        title: { type: 'string', description: 'Título' },
        body: { type: 'string', description: 'Cuerpo en Markdown (alternativa a body_file)' },
        body_file: { type: 'string', description: 'Ruta absoluta de un archivo Markdown con el cuerpo (alternativa a body)' },
        ordernum: { type: 'integer', description: 'Orden dentro de la documentación' },
        idparent: { type: 'integer', description: 'Publicación padre' },
        youtubeid: { type: 'string', description: 'Identificador de un vídeo de YouTube' },
      },
      required: ['plugin', 'id'],
    },
  },
];

/**
 * Registra las herramientas del módulo Forja.
 *
 * @param tools - Mapa de herramientas del servidor MCP
 */
export async function registerForjaTools(tools: Map<string, Tool>): Promise<void> {
  forjaTools.forEach((tool) => tools.set(tool.name, tool));
}

/**
 * Atiende una llamada a una herramienta `forja_*`.
 *
 * @param name - Nombre de la herramienta
 * @param args - Argumentos recibidos
 * @returns Resultado de la herramienta, o null si no pertenece a este módulo
 */
export async function handleForjaTool(
  name: string,
  args: Record<string, unknown>
): Promise<ToolResult | null> {
  if (!forjaTools.some((tool) => tool.name === name)) {
    return null;
  }

  const connection = optionalString(args, 'connection');

  try {
    let result: unknown;

    switch (name) {
      case 'forja_list_plugins': {
        result = await forjaClient.get('/plugins', undefined, connection);
        break;
      }

      case 'forja_get_plugin_options': {
        result = await forjaClient.get('/plugin-options', undefined, connection);
        break;
      }

      case 'forja_create_plugin': {
        const data = pickDefined(args, ['name', 'type', 'license', 'description', 'idcoleccion', 'idteam', 'idteam_doc']);
        const pluginName = requiredString(args, 'name');
        if (!PLUGIN_NAME_PATTERN.test(pluginName)) {
          throw new Error(`"${pluginName}" no es un nombre válido: debe empezar por una letra y tener de 3 a 50 letras, números, - o _`);
        }
        if (data.type !== undefined && !PLUGIN_TYPES.includes(String(data.type))) {
          throw new Error(`El parámetro type debe ser ${PLUGIN_TYPES.join(', ')}`);
        }
        data.name = pluginName;
        result = await forjaClient.sendJson('POST', '/plugins', data, connection);
        break;
      }

      case 'forja_get_plugin': {
        result = await forjaClient.get(pluginEndpoint(args), undefined, connection);
        break;
      }

      case 'forja_update_plugin': {
        const data = pickDefined(args, ['description', 'description_short', 'publicrepo', 'youtube']);
        if (Object.keys(data).length === 0) {
          throw new Error('Indica al menos un campo a modificar: description, description_short, publicrepo o youtube');
        }
        result = await forjaClient.sendJson('PATCH', pluginEndpoint(args), data, connection);
        break;
      }

      case 'forja_upload_plugin_image': {
        const position = optionalPosition(args);
        result = await forjaClient.sendMultipart(
          'POST',
          `${pluginEndpoint(args)}/images`,
          { position },
          [{ field: 'image', path: absolutePath(args, 'image_path') }],
          connection
        );
        break;
      }

      case 'forja_delete_plugin_image': {
        const position = optionalPosition(args);
        if (position === undefined) {
          throw new Error('El parámetro position es obligatorio (1-3)');
        }
        result = await forjaClient.sendJson('DELETE', `${pluginEndpoint(args)}/images/${position}`, undefined, connection);
        break;
      }

      case 'forja_download_translations': {
        result = await downloadTranslations(args, connection);
        break;
      }

      case 'forja_upload_translations': {
        result = await uploadTranslations(args, connection);
        break;
      }

      case 'forja_download_docs': {
        const type = optionalString(args, 'type') ?? 'all';
        if (!['all', 'user', 'dev'].includes(type)) {
          throw new Error('El parámetro type debe ser all, user o dev');
        }
        const download = await forjaClient.download(
          `${pluginEndpoint(args)}/docs`,
          { type },
          absolutePath(args, 'output_zip'),
          connection
        );
        result = { plugin: requiredString(args, 'plugin'), type, ...download };
        break;
      }

      case 'forja_upload_docs': {
        result = await forjaClient.sendMultipart(
          'POST',
          `${pluginEndpoint(args)}/docs`,
          {},
          [{ field: 'docs', path: absolutePath(args, 'zip_path') }],
          connection
        );
        break;
      }

      case 'forja_list_builds': {
        result = await forjaClient.get(`${pluginEndpoint(args)}/builds`, undefined, connection);
        break;
      }

      case 'forja_upload_build': {
        result = await forjaClient.sendMultipart(
          'POST',
          `${pluginEndpoint(args)}/builds`,
          { version: optionalString(args, 'version') },
          [{ field: 'zip', path: absolutePath(args, 'zip_path') }],
          connection
        );
        break;
      }

      case 'forja_list_publications': {
        const type = optionalPublicationType(args);
        result = await forjaClient.get(`${pluginEndpoint(args)}/publications`, { type }, connection);
        break;
      }

      case 'forja_get_publication': {
        result = await forjaClient.get(publicationEndpoint(args), undefined, connection);
        break;
      }

      case 'forja_create_publication': {
        const data = await publicationData(args);
        if (!data.type || !data.title) {
          throw new Error('Los parámetros type y title son obligatorios');
        }
        if (data.body === undefined) {
          throw new Error('Indica el cuerpo de la publicación con body o body_file');
        }
        const images = imagePaths(args);
        const endpoint = `${pluginEndpoint(args)}/publications`;
        result = images.length > 0
          ? await forjaClient.sendMultipart('POST', endpoint, data, images.map((image) => ({ field: 'images[]', path: image })), connection)
          : await forjaClient.sendJson('POST', endpoint, data, connection);
        break;
      }

      case 'forja_update_publication': {
        const data = await publicationData(args);
        if (Object.keys(data).length === 0) {
          throw new Error('Indica al menos un campo a modificar: type, title, body, body_file, ordernum, idparent o youtubeid');
        }
        result = await forjaClient.sendJson('PATCH', publicationEndpoint(args), data, connection);
        break;
      }

      default:
        return null;
    }

    return { content: [{ type: 'text' as const, text: JSON.stringify(result ?? { ok: true }, null, 2) }] };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify({ error: errorMessage }, null, 2) }],
      isError: true,
    };
  }
}

/**
 * Descarga las traducciones del plugin y escribe un archivo JSON por idioma en `<plugin_path>/Translation`,
 * con el mismo formato que los archivos del core (4 espacios de sangría).
 *
 * @param args - Argumentos de la herramienta
 * @param connection - Clave de la conexión (opcional)
 * @returns Resumen de los archivos escritos
 */
async function downloadTranslations(args: Record<string, unknown>, connection?: string): Promise<unknown> {
  const pluginDir = await existingDirectory(absolutePath(args, 'plugin_path'));
  const lang = optionalLang(args);
  const data = await forjaClient.get(`${pluginEndpoint(args)}/translations`, { lang }, connection);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Respuesta inesperada del servidor: se esperaba un objeto {idioma: {clave: valor}}');
  }

  const translationDir = path.join(pluginDir, 'Translation');
  await mkdir(translationDir, { recursive: true });

  const files: Array<{ lang: string; path: string; keys: number }> = [];
  for (const [langcode, translations] of Object.entries(data as Record<string, unknown>)) {
    // El código de idioma forma parte de la ruta: se valida para no escribir fuera de Translation/.
    if (!LANG_PATTERN.test(langcode) || !translations || typeof translations !== 'object' || Array.isArray(translations)) {
      throw new Error(`Respuesta inesperada del servidor: idioma no válido "${langcode}"`);
    }
    const target = path.join(translationDir, `${langcode}.json`);
    await writeFile(target, JSON.stringify(translations, null, 4), 'utf-8');
    files.push({ lang: langcode, path: target, keys: Object.keys(translations).length });
  }

  return { plugin: requiredString(args, 'plugin'), directory: translationDir, files };
}

/**
 * Sube traducciones como JSON `{idioma: {clave: valor}}`: una sola clave (lang, key y value) o los archivos de
 * `<plugin_path>/Translation`, que se validan antes de enviarlos.
 *
 * @param args - Argumentos de la herramienta
 * @param connection - Clave de la conexión (opcional)
 * @returns Informe del servidor
 */
async function uploadTranslations(args: Record<string, unknown>, connection?: string): Promise<unknown> {
  const endpoint = `${pluginEndpoint(args)}/translations`;
  const lang = optionalLang(args);
  const key = optionalString(args, 'key');

  if (key !== undefined) {
    const value = args.value;
    if (lang === undefined || typeof value !== 'string') {
      throw new Error('Para subir una clave individual indica lang, key y value');
    }
    return await forjaClient.sendJson('POST', endpoint, { [lang]: { [key]: value } }, connection);
  }

  if (args.plugin_path === undefined) {
    throw new Error('Indica plugin_path para subir los archivos de traducción, o lang, key y value para una sola clave');
  }

  const translationDir = path.join(await existingDirectory(absolutePath(args, 'plugin_path')), 'Translation');
  const names = (await readdir(translationDir).catch(() => [] as string[]))
    .filter((file) => file.endsWith('.json'))
    .filter((file) => LANG_PATTERN.test(file.slice(0, -5)))
    .filter((file) => lang === undefined || file === `${lang}.json`)
    .sort();
  if (names.length === 0) {
    throw new Error(`No hay archivos de traducción${lang ? ` de ${lang}` : ''} en ${translationDir}`);
  }

  const payload: Record<string, Record<string, unknown>> = {};
  for (const file of names) {
    const filePath = path.join(translationDir, file);
    let parsed: unknown;
    try {
      parsed = JSON.parse(await readFile(filePath, 'utf-8'));
    } catch (error) {
      throw new Error(`JSON no válido en ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error(`${filePath} debe contener un objeto {clave: valor}`);
    }
    payload[file.slice(0, -5)] = parsed as Record<string, unknown>;
  }

  return await forjaClient.sendJson('POST', endpoint, payload, connection);
}

/**
 * Reúne los campos de una publicación presentes en los argumentos, leyendo el cuerpo de body_file si se indica.
 *
 * @param args - Argumentos de la herramienta
 * @returns Campos a enviar
 */
async function publicationData(args: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (args.type !== undefined) {
    optionalPublicationType(args);
  }
  const data = pickDefined(args, ['type', 'title', 'body', 'ordernum', 'idparent', 'youtubeid']);
  if (args.body_file !== undefined) {
    if (args.body !== undefined) {
      throw new Error('Indica el cuerpo con body o con body_file, no con los dos');
    }
    data.body = await readFile(absolutePath(args, 'body_file'), 'utf-8');
  }
  return data;
}

/**
 * Ruta de la API de un plugin, con el nombre codificado.
 *
 * @param args - Argumentos de la herramienta (debe incluir plugin)
 * @returns Ruta `/plugins/<name>`
 */
function pluginEndpoint(args: Record<string, unknown>): string {
  return `/plugins/${encodeURIComponent(requiredString(args, 'plugin'))}`;
}

/**
 * Ruta de la API de una publicación de un plugin.
 *
 * @param args - Argumentos de la herramienta (debe incluir plugin e id)
 * @returns Ruta `/plugins/<name>/publications/<id>`
 */
function publicationEndpoint(args: Record<string, unknown>): string {
  const id = Number(args.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El parámetro id debe ser un número entero positivo');
  }
  return `${pluginEndpoint(args)}/publications/${id}`;
}

/**
 * Devuelve un parámetro de texto obligatorio.
 *
 * @param args - Argumentos de la herramienta
 * @param key - Nombre del parámetro
 * @returns Valor sin espacios en los extremos
 */
function requiredString(args: Record<string, unknown>, key: string): string {
  const value = optionalString(args, key);
  if (value === undefined) {
    throw new Error(`El parámetro ${key} es obligatorio`);
  }
  return value;
}

/**
 * Devuelve un parámetro de texto opcional; las cadenas vacías se tratan como ausentes.
 *
 * @param args - Argumentos de la herramienta
 * @param key - Nombre del parámetro
 * @returns Valor o undefined
 */
function optionalString(args: Record<string, unknown>, key: string): string | undefined {
  const value = args[key];
  if (value === undefined || value === null) {
    return undefined;
  }
  const text = String(value).trim();
  return text === '' ? undefined : text;
}

/**
 * Devuelve el código de idioma del parámetro lang, validado.
 *
 * @param args - Argumentos de la herramienta
 * @returns Código de idioma o undefined
 */
function optionalLang(args: Record<string, unknown>): string | undefined {
  const lang = optionalString(args, 'lang');
  if (lang !== undefined && !LANG_PATTERN.test(lang)) {
    throw new Error(`Código de idioma no válido: "${lang}" (formato esperado: es_ES)`);
  }
  return lang;
}

/**
 * Devuelve el tipo de publicación validado.
 *
 * @param args - Argumentos de la herramienta
 * @returns news, user, dev o undefined
 */
function optionalPublicationType(args: Record<string, unknown>): string | undefined {
  const type = optionalString(args, 'type');
  if (type !== undefined && !PUBLICATION_TYPES.includes(type)) {
    throw new Error('El parámetro type debe ser news, user o dev');
  }
  return type;
}

/**
 * Devuelve la posición de imagen validada (1-3).
 *
 * @param args - Argumentos de la herramienta
 * @returns Posición o undefined
 */
function optionalPosition(args: Record<string, unknown>): number | undefined {
  if (args.position === undefined || args.position === null || args.position === '') {
    return undefined;
  }
  const position = Number(args.position);
  if (!Number.isInteger(position) || position < 1 || position > 3) {
    throw new Error('El parámetro position debe ser 1, 2 o 3');
  }
  return position;
}

/**
 * Copia de los argumentos indicados que no son undefined ni null.
 *
 * @param args - Argumentos de la herramienta
 * @param keys - Claves a copiar
 * @returns Objeto con los valores presentes
 */
function pickDefined(args: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const key of keys) {
    if (args[key] !== undefined && args[key] !== null) {
      data[key] = args[key];
    }
  }
  return data;
}

/**
 * Resuelve un parámetro de ruta local: admite `~` y exige una ruta absoluta, porque el directorio de trabajo
 * del servidor MCP es el del plugin, no el del proyecto del usuario.
 *
 * @param args - Argumentos de la herramienta
 * @param key - Nombre del parámetro
 * @returns Ruta absoluta normalizada
 */
function absolutePath(args: Record<string, unknown>, key: string): string {
  return toAbsolutePath(requiredString(args, key), key);
}

/**
 * Expande `~` y comprueba que la ruta es absoluta.
 *
 * @param value - Ruta indicada
 * @param key - Nombre del parámetro, para el mensaje de error
 * @returns Ruta absoluta normalizada
 */
function toAbsolutePath(value: string, key: string): string {
  const expanded = value === '~' || value.startsWith('~/') ? path.join(os.homedir(), value.slice(1)) : value;
  if (!path.isAbsolute(expanded)) {
    throw new Error(`El parámetro ${key} debe ser una ruta absoluta: ${value}`);
  }
  return path.normalize(expanded);
}

/**
 * Rutas absolutas de las imágenes del parámetro images.
 *
 * @param args - Argumentos de la herramienta
 * @returns Lista de rutas (vacía si no se indican)
 */
function imagePaths(args: Record<string, unknown>): string[] {
  if (args.images === undefined || args.images === null) {
    return [];
  }
  if (!Array.isArray(args.images)) {
    throw new Error('El parámetro images debe ser una lista de rutas');
  }
  return args.images.map((image) => toAbsolutePath(String(image), 'images'));
}

/**
 * Comprueba que una ruta es una carpeta existente.
 *
 * @param dir - Ruta de la carpeta
 * @returns La misma ruta
 */
async function existingDirectory(dir: string): Promise<string> {
  const info = await stat(dir).catch(() => null);
  if (!info || !info.isDirectory()) {
    throw new Error(`No existe la carpeta: ${dir}`);
  }
  return dir;
}
