/**
 * Módulo Forja del servidor MCP de FacturaScripts.
 *
 * Herramientas `forja_*` para que el autor de un plugin publicado en facturascripts.com (o un miembro aceptado de su
 * equipo) lo gestione mediante la API de autor (`/api/3/forja`): datos e imágenes, traducciones, versiones,
 * publicaciones (noticias y documentación), informes de error e issues. Solo usan conexiones de tipo forja; por
 * defecto, la primera configurada.
 *
 * Además, forja_build_zip crea en local el zip de una versión de un plugin o del core (ver build-zip.ts),
 * forja_upload_build borra tras subirlo los zips que creó esa herramienta, salvo que se pida conservarlos, y
 * forja_publish_doc_page publica una página de Doc/User o Doc/Dev como publicación (ver doc-page.ts).
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { open, readdir, readFile, realpath, stat, mkdir, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { forjaClient } from '../../fs/forja-client.js';
import { pathId } from '../../utils/pathId.js';
import { buildProjectZip, isToolBuildZip, removeToolBuildZip } from './build-zip.js';
import { publishDocPage } from './doc-page.js';

/** Descripción común del parámetro `connection`. */
const CONNECTION_PROPERTY = {
  type: 'string',
  description:
    'Clave de una conexión de tipo forja (opcional; por defecto, la primera conexión de tipo forja configurada)',
};

/** Descripción común del parámetro `plugin`. */
const PLUGIN_PROPERTY = {
  type: 'string',
  description:
    'Nombre (name) del plugin en Forja, por ejemplo "MiPlugin". Solo se admiten tus plugins y los de los equipos en los que estás aceptado',
};

/** Parámetros comunes de paginación de los listados de errores e issues. */
const PAGINATION_PROPERTIES = {
  limit: { type: 'integer', minimum: 1, maximum: 200, description: 'Número máximo de resultados (opcional; por defecto 50, máximo 200)' },
  offset: { type: 'integer', minimum: 0, description: 'Resultados que se saltan, para paginar (opcional; por defecto 0)' },
};

/** Tipos de publicación admitidos por la API. */
const PUBLICATION_TYPES = ['news', 'user', 'dev'];

/** Estados de una versión que se pueden fijar. */
const BUILD_STATUSES = ['beta', 'stable', 'disabled'];

/** Estados por los que se filtran los informes de error. */
const ERROR_STATUSES = ['investigating', 'solved'];

/** Estados por los que se filtran las issues. */
const ISSUE_STATUSES = ['open', 'closed'];

/** Colores de Bootstrap admitidos en una publicación. */
const PUBLICATION_COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];

/** Campos opcionales de una publicación que se envían tal cual. */
const PUBLICATION_FIELDS = ['type', 'title', 'title_short', 'body', 'ordernum', 'idparent', 'youtube', 'icon', 'color', 'keywords', 'controllers'];

/** Código de idioma válido para un archivo de traducción (por ejemplo es_ES o pt_BR). */
const LANG_PATTERN = /^[A-Za-z]{2,3}_[A-Za-z]{2,3}$/;

/** Número de versión de un plugin, como lo admite la ruta de builds. */
const VERSION_PATTERN = /^[0-9]+(\.[0-9]+)?$/;

/** Extensiones de los archivos locales que se pueden subir, según su uso. */
const IMAGE_EXTENSIONS = ['.gif', '.jpeg', '.jpg', '.png', '.webp'];
const MARKDOWN_EXTENSIONS = ['.markdown', '.md', '.txt'];
const ZIP_EXTENSIONS = ['.zip'];

/** Tamaño máximo de un cuerpo leído de body_file: 1 MB. */
const MAX_BODY_FILE_SIZE = 1024 * 1024;

/** Resultado que devuelve cada herramienta al servidor MCP. */
type ToolResult = { content: [{ type: 'text'; text: string }]; isError?: boolean };

/** Propiedades comunes de crear y modificar una publicación. */
const PUBLICATION_PROPERTIES = {
  type: { type: 'string', enum: PUBLICATION_TYPES, description: 'Tipo: news (noticia), user (documentación de uso) o dev (documentación de programación)' },
  title: { type: 'string', description: 'Título (máximo 200 caracteres)' },
  title_short: { type: 'string', description: 'Título corto (máximo 100; por defecto, el título recortado)' },
  body: { type: 'string', description: 'Cuerpo en Markdown, de al menos 300 caracteres (alternativa a body_file)' },
  body_file: { type: 'string', description: 'Ruta absoluta de un archivo .md, .markdown o .txt con el cuerpo (alternativa a body)' },
  ordernum: { type: 'integer', description: 'Orden dentro de la documentación' },
  idparent: { type: 'integer', description: 'Publicación padre, del mismo plugin; 0 la quita. Al crear con padre, se hereda su tipo' },
  youtube: { type: 'string', description: 'URL o identificador de un vídeo de YouTube; vacío lo quita' },
  icon: { type: 'string', description: 'Icono de Font Awesome, por ejemplo "fa-solid fa-gear" (máximo 50)' },
  color: { type: 'string', enum: PUBLICATION_COLORS, description: 'Color de Bootstrap' },
  keywords: { type: 'string', description: 'Palabras clave (máximo 300)' },
  controllers: { type: 'string', description: 'Controladores donde se muestra como ayuda, separados por comas y sin espacios (máximo 300)' },
  images: {
    type: 'array',
    items: { type: 'string' },
    description: 'Rutas absolutas de imágenes (gif, jpeg, jpg, png o webp) que Forja añade al final del texto (opcional)',
  },
};

export const forjaTools: Tool[] = [
  {
    name: 'forja_list_plugins',
    description:
      'Forja: lista tus plugins de facturascripts.com y los de los equipos en los que estás aceptado, con su tipo, versiones, salud y tu papel (author o team)',
    inputSchema: {
      type: 'object' as const,
      properties: { connection: CONNECTION_PROPERTY },
      required: [],
    },
  },
  {
    name: 'forja_get_plugin',
    description:
      'Forja: obtiene la ficha de uno de tus plugins: descripción, repositorio, vídeo, imágenes, salud y los requisitos de catálogo que le faltan (health_requirements)',
    inputSchema: {
      type: 'object' as const,
      properties: { connection: CONNECTION_PROPERTY, plugin: PLUGIN_PROPERTY },
      required: ['plugin'],
    },
  },
  {
    name: 'forja_update_plugin',
    description:
      'Forja: modifica la descripción, el repositorio público o el vídeo de YouTube de uno de tus plugins. La descripción corta no se edita: ' +
      'la forja la vuelve a generar al cambiar la descripción',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        description: { type: 'string', description: 'Descripción larga del plugin' },
        publicrepo: { type: 'string', description: 'URL http(s) del repositorio público; vacío lo quita' },
        youtube: { type: 'string', description: 'URL o identificador del vídeo de YouTube; vacío lo quita' },
      },
      required: ['plugin'],
    },
  },
  {
    name: 'forja_upload_plugin_image',
    description:
      'Forja: sube una imagen de uno de tus plugins a una posición (1-3, la 1 es la portada), sustituyendo la que hubiera, o al primer hueco libre',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        image_path: { type: 'string', description: 'Ruta absoluta de la imagen local (gif, jpeg, jpg, png o webp)' },
        position: { type: 'integer', minimum: 1, maximum: 3, description: 'Posición de la imagen (1-3, opcional)' },
      },
      required: ['plugin', 'image_path'],
    },
  },
  {
    name: 'forja_delete_plugin_image',
    description: 'Forja: quita la imagen de una posición (1-3) de uno de tus plugins; la forja compacta las demás',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        position: { type: 'integer', minimum: 1, maximum: 3, description: 'Posición de la imagen a quitar (1-3)' },
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
      'Forja: sube traducciones de uno de tus plugins, bien los archivos <plugin_path>/Translation/*.json (todos o solo lang), bien una sola ' +
      'clave con lang, key y value. Sigue las reglas de la web: cada idioma enviado cuesta puntos (no se cobran si nada cambia), hay topes ' +
      'diarios y semanales de claves nuevas y los textos quedan pendientes de revisión. Las claves nuevas se crean en todos los idiomas. ' +
      'Las traducciones no se pueden borrar por la API. Devuelve created, updated, unchanged, skipped, points_spent y points',
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
    name: 'forja_list_builds',
    description: 'Forja: lista las versiones de uno de tus plugins con su estado (beta, stable o disabled), versiones de core y PHP y descargas',
    inputSchema: {
      type: 'object' as const,
      properties: { connection: CONNECTION_PROPERTY, plugin: PLUGIN_PROPERTY },
      required: ['plugin'],
    },
  },
  {
    name: 'forja_set_build_status',
    description:
      'Forja: cambia el estado de una versión de uno de tus plugins: beta, stable o disabled. La forja puede dejarla en beta si la versión ' +
      'del core que necesita no es estable; devuelve la versión como ha quedado y los avisos',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        version: { type: 'string', description: 'Número de versión, por ejemplo "1.5"' },
        status: { type: 'string', enum: BUILD_STATUSES, description: 'Nuevo estado: beta, stable o disabled' },
      },
      required: ['plugin', 'version', 'status'],
    },
  },
  {
    name: 'forja_build_zip',
    description:
      'Forja: crea en una carpeta temporal el zip de una versión de un plugin o del core de FacturaScripts a partir de su carpeta local, ' +
      'listo para forja_upload_build. Lee name y version del facturascripts.ini (o, en el core, de Kernel::version()), mete todo en una ' +
      'carpeta raíz con ese nombre (facturascripts en el core) y quita lo que no se reparte: archivos ocultos (.git, .claude...), Test, ' +
      'Doc, archivos de asistentes de IA, phpunit*.xml, metadatos del sistema y enlaces simbólicos; en el core, también Plugins, Dinamic, ' +
      'MyFiles y config*.php. No necesita conexión. Devuelve la ruta del zip y un resumen de lo excluido',
    inputSchema: {
      type: 'object' as const,
      properties: {
        source_path: {
          type: 'string',
          description: 'Ruta absoluta de la carpeta del plugin (con su facturascripts.ini) o del core de FacturaScripts',
        },
      },
      required: ['source_path'],
    },
  },
  {
    name: 'forja_upload_build',
    description:
      'Forja: publica el zip de una nueva versión de uno de tus plugins, que queda en beta. Devuelve la versión creada y los avisos (por ' +
      'ejemplo, los archivos de desarrollo que la forja ha quitado). Si el zip lo creó forja_build_zip, lo borra tras subirlo con éxito ' +
      'salvo que se indique keep_zip; los demás zips nunca se borran',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        zip_path: { type: 'string', description: 'Ruta absoluta del zip del plugin (.zip)' },
        version: { type: 'string', description: 'Número de versión (opcional; por defecto, el del facturascripts.ini del zip)' },
        keep_zip: {
          type: 'boolean',
          description: 'true para conservar el zip creado por forja_build_zip después de subirlo (por defecto se borra)',
        },
      },
      required: ['plugin', 'zip_path'],
    },
  },
  {
    name: 'forja_list_publications',
    description: 'Forja: lista las publicaciones de uno de tus plugins (noticias y documentación de uso o de programación), con su id y su URL',
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
    description: 'Forja: obtiene una publicación de uno de tus plugins con su texto en Markdown',
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
      'Forja: crea una publicación (noticia o página de documentación) de uno de tus plugins. Exige el email verificado y tiene los mismos ' +
      'máximos diarios y semanales que la web. Para publicar una página de Doc/User o Doc/Dev usa forja_publish_doc_page',
    inputSchema: {
      type: 'object' as const,
      properties: { connection: CONNECTION_PROPERTY, plugin: PLUGIN_PROPERTY, ...PUBLICATION_PROPERTIES },
      required: ['plugin', 'title'],
    },
  },
  {
    name: 'forja_update_publication',
    description:
      'Forja: modifica una publicación de uno de tus plugins. Solo se envían los campos indicados; si la editas sin ser su autor, quedas ' +
      'como coautor',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        id: { type: 'integer', description: 'Identificador de la publicación' },
        ...PUBLICATION_PROPERTIES,
      },
      required: ['plugin', 'id'],
    },
  },
  {
    name: 'forja_delete_publication',
    description:
      'Forja: borra una publicación de uno de tus plugins. Solo puede hacerlo quien la escribió y no se puede deshacer: pide confirmación al usuario antes',
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
    name: 'forja_publish_doc_page',
    description:
      'Forja: publica una página local de Doc/User o Doc/Dev como publicación de uno de tus plugins (user o dev), o la actualiza si ya se ' +
      'publicó. Toma título, orden, icono, controladores y página padre de Doc/forja.json; sube las imágenes locales que enlaza y las ' +
      'coloca en su sitio; cambia los enlaces a otras páginas ya publicadas por su ruta en la web (/publicaciones/...), y guarda en forja.json el idpublication y las ' +
      'imágenes subidas. Publica antes las páginas padre. Con dry_run solo dice qué haría',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        plugin_path: { type: 'string', description: 'Ruta absoluta de la carpeta local del plugin o del core' },
        page: { type: 'string', description: 'Página a publicar: "User/archivo.md", "Dev/archivo.md" o su ruta absoluta' },
        dry_run: { type: 'boolean', description: 'true para ver lo que se enviaría sin publicar ni cambiar forja.json' },
      },
      required: ['plugin', 'plugin_path', 'page'],
    },
  },
  {
    name: 'forja_list_errors',
    description:
      'Forja: lista los informes de error que las instalaciones envían de uno de tus plugins, del más reciente al más antiguo, con su huella (hash)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        status: { type: 'string', enum: ERROR_STATUSES, description: 'Filtra por estado (opcional): investigating o solved' },
        ...PAGINATION_PROPERTIES,
      },
      required: ['plugin'],
    },
  },
  {
    name: 'forja_get_error',
    description:
      'Forja: obtiene un informe de error de uno de tus plugins por su hash: mensaje completo, archivo y línea, versiones de core y PHP, plugins activos y solución',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        hash: { type: 'string', description: 'Huella (hash) del error, de forja_list_errors' },
      },
      required: ['plugin', 'hash'],
    },
  },
  {
    name: 'forja_list_issues',
    description: 'Forja: lista las issues de uno de tus plugins, de la más reciente a la más antigua (solo lectura)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        status: { type: 'string', enum: ISSUE_STATUSES, description: 'Filtra por estado (opcional): open o closed' },
        ...PAGINATION_PROPERTIES,
      },
      required: ['plugin'],
    },
  },
  {
    name: 'forja_get_issue',
    description:
      'Forja: obtiene una issue de uno de tus plugins con su conversación. Solo si puedes verla en la web: la creaste, eres de su equipo de soporte o has comentado en ella',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: CONNECTION_PROPERTY,
        plugin: PLUGIN_PROPERTY,
        id: { type: 'integer', description: 'Identificador de la issue' },
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

      case 'forja_get_plugin': {
        result = await forjaClient.get(pluginEndpoint(args), undefined, connection);
        break;
      }

      case 'forja_update_plugin': {
        const data = pickDefined(args, ['description', 'publicrepo', 'youtube']);
        if (Object.keys(data).length === 0) {
          throw new Error('Indica al menos un campo a modificar: description, publicrepo o youtube');
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
          [{ field: 'image', path: await localFile(args, 'image_path', IMAGE_EXTENSIONS) }],
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

      case 'forja_list_builds': {
        result = await forjaClient.get(`${pluginEndpoint(args)}/builds`, undefined, connection);
        break;
      }

      case 'forja_set_build_status': {
        const version = requiredString(args, 'version');
        if (!VERSION_PATTERN.test(version)) {
          throw new Error(`Número de versión no válido: "${version}"`);
        }
        const status = requiredString(args, 'status');
        if (!BUILD_STATUSES.includes(status)) {
          throw new Error(`El parámetro status debe ser ${BUILD_STATUSES.join(', ')}`);
        }
        result = await forjaClient.sendJson('PATCH', `${pluginEndpoint(args)}/builds/${version}`, { status }, connection);
        break;
      }

      case 'forja_build_zip': {
        result = await buildProjectZip(await existingDirectory(absolutePath(args, 'source_path')));
        break;
      }

      case 'forja_upload_build': {
        result = await uploadBuild(args, connection);
        break;
      }

      case 'forja_list_publications': {
        const type = optionalEnum(args, 'type', PUBLICATION_TYPES);
        result = await forjaClient.get(`${pluginEndpoint(args)}/publications`, { type }, connection);
        break;
      }

      case 'forja_get_publication': {
        result = await forjaClient.get(publicationEndpoint(args), undefined, connection);
        break;
      }

      case 'forja_create_publication': {
        const data = await publicationData(args);
        if (!data.title) {
          throw new Error('El parámetro title es obligatorio');
        }
        if (data.type === undefined && data.idparent === undefined) {
          throw new Error('Indica el tipo de publicación (type) o su publicación padre (idparent), de la que hereda el tipo');
        }
        if (data.body === undefined) {
          throw new Error('Indica el cuerpo de la publicación con body o body_file');
        }
        result = await savePublication(args, `${pluginEndpoint(args)}/publications`, 'POST', data, connection);
        break;
      }

      case 'forja_update_publication': {
        const data = await publicationData(args);
        if (Object.keys(data).length === 0 && args.images === undefined) {
          throw new Error(`Indica al menos un campo a modificar: ${PUBLICATION_FIELDS.join(', ')}, body_file o images`);
        }
        result = await savePublication(args, publicationEndpoint(args), 'PATCH', data, connection);
        break;
      }

      case 'forja_delete_publication': {
        result = await forjaClient.sendJson('DELETE', publicationEndpoint(args), undefined, connection);
        break;
      }

      case 'forja_publish_doc_page': {
        result = await publishDocPage({
          plugin: requiredString(args, 'plugin'),
          pluginEndpoint: pluginEndpoint(args),
          pluginPath: await existingDirectory(absolutePath(args, 'plugin_path')),
          page: requiredString(args, 'page'),
          dryRun: args.dry_run === true || args.dry_run === '1' || args.dry_run === 'true',
          connection,
        });
        break;
      }

      case 'forja_list_errors': {
        const params = { status: optionalEnum(args, 'status', ERROR_STATUSES), ...pagination(args) };
        result = await forjaClient.get(`${pluginEndpoint(args)}/errors`, params, connection);
        break;
      }

      case 'forja_get_error': {
        result = await forjaClient.get(`${pluginEndpoint(args)}/errors/${pathId(requiredString(args, 'hash'))}`, undefined, connection);
        break;
      }

      case 'forja_list_issues': {
        const params = { status: optionalEnum(args, 'status', ISSUE_STATUSES), ...pagination(args) };
        result = await forjaClient.get(`${pluginEndpoint(args)}/issues`, params, connection);
        break;
      }

      case 'forja_get_issue': {
        result = await forjaClient.get(`${pluginEndpoint(args)}/issues/${positiveId(args, 'id')}`, undefined, connection);
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
 * con el mismo formato que los archivos del core (4 espacios de sangría). Con lang se pide
 * `/translations/<idioma>`, que devuelve directamente `{clave: texto}`.
 *
 * @param args - Argumentos de la herramienta
 * @param connection - Clave de la conexión (opcional)
 * @returns Resumen de los archivos escritos
 */
async function downloadTranslations(args: Record<string, unknown>, connection?: string): Promise<unknown> {
  const pluginDir = await existingDirectory(absolutePath(args, 'plugin_path'));
  const lang = optionalLang(args);
  const endpoint = `${pluginEndpoint(args)}/translations${lang ? `/${lang}` : ''}`;
  let data = await forjaClient.get(endpoint, undefined, connection);
  // sin traducciones, un PHP que no fuerce el objeto serializa el array vacío como []
  if (Array.isArray(data) && data.length === 0) {
    data = {};
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Respuesta inesperada del servidor: se esperaba un objeto JSON');
  }
  const byLang = (lang ? { [lang]: data } : data) as Record<string, unknown>;

  const translationDir = path.join(pluginDir, 'Translation');
  await mkdir(translationDir, { recursive: true });

  const files: Array<{ lang: string; path: string; keys: number }> = [];
  const empty: string[] = [];
  for (const [langcode, translations] of Object.entries(byLang)) {
    // El código de idioma forma parte de la ruta: se valida para no escribir fuera de Translation/.
    if (!LANG_PATTERN.test(langcode) || !translations || typeof translations !== 'object') {
      throw new Error(`Respuesta inesperada del servidor: idioma no válido "${langcode}"`);
    }
    // Un idioma sin traducciones en la forja no vacía el archivo local
    if (Object.keys(translations).length === 0) {
      empty.push(langcode);
      continue;
    }
    if (Array.isArray(translations)) {
      throw new Error(`Respuesta inesperada del servidor: las traducciones de "${langcode}" no son un objeto`);
    }
    const target = path.join(translationDir, `${langcode}.json`);
    await writeFile(target, JSON.stringify(translations, null, 4), 'utf-8');
    files.push({ lang: langcode, path: target, keys: Object.keys(translations).length });
  }

  return {
    plugin: requiredString(args, 'plugin'),
    directory: translationDir,
    files,
    ...(empty.length > 0 ? { empty_languages: empty } : {}),
  };
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
    // Un archivo vacío no se envía: la forja rechaza la subida entera si un idioma no trae claves.
    if (Object.keys(parsed).length > 0) {
      payload[file.slice(0, -5)] = parsed as Record<string, unknown>;
    }
  }
  if (Object.keys(payload).length === 0) {
    throw new Error(`Los archivos de traducción de ${translationDir} no tienen claves`);
  }

  return await forjaClient.sendJson('POST', endpoint, payload, connection);
}

/**
 * Sube el zip de una versión y, si lo creó forja_build_zip y la subida va bien, lo borra salvo que se pida
 * conservarlo con keep_zip. Un zip del usuario, fuera de la carpeta temporal de la herramienta, nunca se borra.
 *
 * @param args - Argumentos de la herramienta
 * @param connection - Clave de la conexión (opcional)
 * @returns Respuesta del servidor y qué se ha hecho con el zip local
 */
async function uploadBuild(args: Record<string, unknown>, connection?: string): Promise<unknown> {
  const zipPath = await localZip(args, 'zip_path');
  const keepZip = args.keep_zip === true || args.keep_zip === '1' || args.keep_zip === 'true';
  const response = await forjaClient.sendMultipart(
    'POST',
    `${pluginEndpoint(args)}/builds`,
    { version: optionalString(args, 'version') },
    [{ field: 'zip', path: zipPath }],
    connection
  );

  let localZipResult: { path: string; deleted: boolean; reason: string };
  if (!(await isToolBuildZip(zipPath))) {
    localZipResult = { path: zipPath, deleted: false, reason: 'no lo creó forja_build_zip: los zips del usuario no se borran' };
  } else if (keepZip) {
    localZipResult = { path: zipPath, deleted: false, reason: 'se ha pedido conservarlo (keep_zip)' };
  } else {
    const deleted = await removeToolBuildZip(zipPath);
    localZipResult = { path: zipPath, deleted, reason: deleted ? 'zip temporal de forja_build_zip borrado tras subirlo' : 'no se ha podido borrar' };
  }

  const body = response && typeof response === 'object' && !Array.isArray(response) ? response : { response };
  return { ...body, local_zip: localZipResult };
}

/**
 * Crea o modifica una publicación. Con imágenes se envía en multipart y siempre por POST, porque PHP no lee los
 * archivos de un PATCH; la forja admite POST sobre una publicación existente para editarla.
 *
 * @param args - Argumentos de la herramienta
 * @param endpoint - Ruta de la colección (crear) o de la publicación (modificar)
 * @param method - Método sin imágenes: POST para crear, PATCH para modificar
 * @param data - Campos de la publicación
 * @param connection - Clave de la conexión (opcional)
 * @returns Publicación como ha quedado
 */
async function savePublication(
  args: Record<string, unknown>,
  endpoint: string,
  method: 'POST' | 'PATCH',
  data: Record<string, unknown>,
  connection?: string
): Promise<unknown> {
  const images = await imagePaths(args);
  if (images.length === 0) {
    return await forjaClient.sendJson(method, endpoint, data, connection);
  }
  return await forjaClient.sendMultipart('POST', endpoint, data, images.map((image) => ({ field: 'images[]', path: image })), connection);
}

/**
 * Reúne los campos de una publicación presentes en los argumentos, leyendo el cuerpo de body_file si se indica.
 *
 * @param args - Argumentos de la herramienta
 * @returns Campos a enviar
 */
async function publicationData(args: Record<string, unknown>): Promise<Record<string, unknown>> {
  optionalEnum(args, 'type', PUBLICATION_TYPES);
  optionalEnum(args, 'color', PUBLICATION_COLORS);
  const data = pickDefined(args, PUBLICATION_FIELDS);
  if (args.body_file !== undefined) {
    if (args.body !== undefined) {
      throw new Error('Indica el cuerpo con body o con body_file, no con los dos');
    }
    const bodyFile = await localFile(args, 'body_file', MARKDOWN_EXTENSIONS);
    if ((await stat(bodyFile)).size > MAX_BODY_FILE_SIZE) {
      throw new Error(`El archivo ${bodyFile} supera 1 MB: no parece el cuerpo de una publicación`);
    }
    data.body = await readFile(bodyFile, 'utf-8');
  }
  return data;
}

/**
 * Parámetros de paginación presentes en los argumentos.
 *
 * @param args - Argumentos de la herramienta
 * @returns limit y offset, si se indican
 */
function pagination(args: Record<string, unknown>): Record<string, unknown> {
  return pickDefined(args, ['limit', 'offset']);
}

/**
 * Devuelve un parámetro de texto opcional validado contra sus valores admitidos.
 *
 * @param args - Argumentos de la herramienta
 * @param key - Nombre del parámetro
 * @param values - Valores admitidos
 * @returns Valor o undefined
 */
function optionalEnum(args: Record<string, unknown>, key: string, values: string[]): string | undefined {
  const value = optionalString(args, key);
  if (value !== undefined && !values.includes(value)) {
    throw new Error(`El parámetro ${key} debe ser ${values.join(', ')}`);
  }
  return value;
}

/**
 * Devuelve un identificador numérico positivo.
 *
 * @param args - Argumentos de la herramienta
 * @param key - Nombre del parámetro
 * @returns Identificador
 */
function positiveId(args: Record<string, unknown>, key: string): number {
  const id = Number(args[key]);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`El parámetro ${key} debe ser un número entero positivo`);
  }
  return id;
}

/**
 * Ruta de la API de un plugin.
 *
 * El nombre va tal cual, validado con pathId: la forja es una instalación de
 * FacturaScripts y tampoco decodifica la ruta, y encodeURIComponent dejaría
 * pasar «..» y «.», que harían salir del recurso del plugin.
 *
 * @param args - Argumentos de la herramienta (debe incluir plugin)
 * @returns Ruta `/plugins/<name>`
 * @throws Error si falta el nombre o no puede ir en la ruta
 */
function pluginEndpoint(args: Record<string, unknown>): string {
  return `/plugins/${pathId(requiredString(args, 'plugin'))}`;
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
 * Rutas reales de las imágenes del parámetro images, comprobadas con `checkLocalFile`.
 *
 * @param args - Argumentos de la herramienta
 * @returns Lista de rutas (vacía si no se indican)
 */
async function imagePaths(args: Record<string, unknown>): Promise<string[]> {
  if (args.images === undefined || args.images === null) {
    return [];
  }
  if (!Array.isArray(args.images)) {
    throw new Error('El parámetro images debe ser una lista de rutas');
  }
  return await Promise.all(
    args.images.map((image) => checkLocalFile(toAbsolutePath(String(image), 'images'), 'images', IMAGE_EXTENSIONS))
  );
}

/**
 * Archivo local que se va a subir o publicar, comprobado con `checkLocalFile`.
 *
 * @param args - Argumentos de la herramienta
 * @param key - Nombre del parámetro con la ruta
 * @param extensions - Extensiones admitidas, en minúsculas y con punto
 * @returns Ruta real del archivo
 */
async function localFile(args: Record<string, unknown>, key: string, extensions: string[]): Promise<string> {
  return await checkLocalFile(absolutePath(args, key), key, extensions);
}

/**
 * Comprueba un archivo local antes de enviarlo a la web, donde puede quedar publicado: debe existir, se resuelven
 * sus enlaces simbólicos y la extensión del archivo real debe ser de las admitidas. Así una ruta manipulada no
 * puede publicar, por ejemplo, el archivo de conexiones con los tokens o una clave privada.
 *
 * @param file - Ruta absoluta indicada
 * @param key - Nombre del parámetro, para el mensaje de error
 * @param extensions - Extensiones admitidas, en minúsculas y con punto
 * @returns Ruta real del archivo
 */
async function checkLocalFile(file: string, key: string, extensions: string[]): Promise<string> {
  const real = await realpath(file).catch(() => null);
  const info = real ? await stat(real).catch(() => null) : null;
  if (!real || !info || !info.isFile()) {
    throw new Error(`No existe el archivo: ${file}`);
  }
  if (!extensions.includes(path.extname(real).toLowerCase())) {
    throw new Error(`El parámetro ${key} debe ser un archivo ${extensions.join(', ')}: ${file}`);
  }
  return real;
}

/**
 * Zip local que se va a subir: además de la extensión, comprueba que empieza por la firma de un zip.
 *
 * @param args - Argumentos de la herramienta
 * @param key - Nombre del parámetro con la ruta
 * @returns Ruta real del zip
 */
async function localZip(args: Record<string, unknown>, key: string): Promise<string> {
  const file = await localFile(args, key, ZIP_EXTENSIONS);
  if (!(await hasZipSignature(file))) {
    throw new Error(`${file} no es un archivo zip`);
  }
  return file;
}

/**
 * Indica si un archivo empieza por la firma de un zip (PK).
 *
 * @param file - Ruta del archivo
 * @returns true si es un zip
 */
async function hasZipSignature(file: string): Promise<boolean> {
  const handle = await open(file, 'r');
  try {
    const buffer = Buffer.alloc(2);
    const { bytesRead } = await handle.read(buffer, 0, 2, 0);
    return bytesRead === 2 && buffer.toString('latin1') === 'PK';
  } finally {
    await handle.close();
  }
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
