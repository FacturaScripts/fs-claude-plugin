/**
 * Publicación de una página de documentación local (Doc/User o Doc/Dev) como publicación de Forja.
 *
 * Forja no importa la carpeta Doc del zip de una versión: la documentación de un plugin son publicaciones de tipo
 * user o dev, que la API de autor permite crear y editar. Este módulo lleva una página de Doc a su publicación:
 *
 * - Los datos (título, orden, icono, controladores...) salen de su entrada en Doc/forja.json, y el tipo, de su
 *   carpeta (User → user, Dev → dev). La página padre se indica con `parent` y debe estar publicada antes.
 * - Las imágenes locales que enlaza (normalmente de Doc/Assets) se suben con la publicación. Forja las añade al
 *   final del texto, así que después se colocan en su sitio con una segunda petición. Su URL y su hash se guardan
 *   en la entrada de forja.json (`assets`) para no volver a subirlas mientras no cambien.
 * - Los enlaces a otras páginas de Doc se cambian por la URL de su publicación, si ya está publicada.
 * - El id de la publicación se guarda en la entrada de forja.json (`idpublication`) para actualizarla después.
 */

import { createHash } from 'crypto';
import { readFile, realpath, stat, writeFile } from 'fs/promises';
import path from 'path';
import { forjaClient } from '../../fs/forja-client.js';

/** Secciones de Doc que se publican y el tipo de publicación de cada una. */
export const DOC_SECTIONS: Record<string, 'user' | 'dev'> = { User: 'user', Dev: 'dev' };

/** Longitud mínima del cuerpo que acepta Forja. */
export const MIN_BODY_LENGTH = 300;

/** Extensiones de imagen que se pueden subir. */
const IMAGE_EXTENSIONS = ['.gif', '.jpeg', '.jpg', '.png', '.webp'];

/** Campos de forja.json que se envían tal cual a la API. */
const DIRECT_FIELDS = ['title', 'title_short', 'ordernum', 'icon', 'color', 'keywords', 'controllers'] as const;

/** Campos de forja.json que la API de autor no permite cambiar, con el motivo. */
const IGNORED_FIELDS: Record<string, string> = {
  permalink: 'la forja lo genera a partir del título al crear la publicación',
  imageurl: 'la API de autor no permite cambiar la imagen de cabecera; hazlo desde la web',
  visibility: 'la API de autor no permite cambiar la visibilidad; hazlo desde la web',
};

/** Imagen markdown: ![alt](ruta "título"), con la ruta opcionalmente entre <>. */
const IMAGE_PATTERN = /(!\[[^\]]*\]\(\s*<?)([^)\s>]+)(>?(?:\s+"[^"]*")?\s*\))/g;

/** Enlace markdown a una página .md (no imagen), con ancla opcional. */
const PAGE_LINK_PATTERN = /((?<!!)\[[^\]]*\]\(\s*<?)([^)\s>#]+\.md)(#[^)\s>]*)?(>?\s*\))/g;

/** Imagen que Forja añade al final del texto al subirla con la publicación. */
const APPENDED_IMAGE_PATTERN = /\n\n!\[\]\(([^)\n]+)\)$/;

/** Entrada de una página en Doc/forja.json. */
export interface ForjaPageEntry {
  title?: string;
  title_short?: string;
  permalink?: string;
  parent?: string;
  ordernum?: number;
  youtubeid?: string;
  imageurl?: string;
  icon?: string;
  color?: string;
  keywords?: string;
  controllers?: string;
  visibility?: boolean;
  /** Id de la publicación en Forja, que guarda esta herramienta al publicar. */
  idpublication?: number;
  /** Imágenes ya subidas, por su ruta relativa a Doc: URL en Forja y hash del archivo subido. */
  assets?: Record<string, { url: string; sha256: string }>;
  [key: string]: unknown;
}

/** Contenido de Doc/forja.json: páginas de cada sección por su nombre de archivo. */
export type ForjaJson = Record<string, Record<string, ForjaPageEntry>>;

/** Página local resuelta. */
export interface DocPageLocation {
  /** Carpeta Doc del plugin. */
  docDir: string;
  /** Sección: User o Dev. */
  section: string;
  /** Nombre del archivo de la página, con .md. */
  page: string;
  /** Ruta absoluta del archivo de la página. */
  file: string;
}

/** Imagen local enlazada desde la página. */
export interface DocImage {
  /** Ruta tal y como aparece en la página. */
  ref: string;
  /** Ruta relativa a Doc, que identifica la imagen en `assets`. */
  key: string;
  /** Ruta real del archivo. */
  file: string;
  /** Hash SHA-256 del archivo. */
  sha256: string;
}

/** Enlace de la página a otra página de Doc. */
export interface DocLink {
  /** Ruta tal y como aparece en la página. */
  ref: string;
  /** Sección de la página enlazada. */
  section: string;
  /** Nombre del archivo de la página enlazada. */
  page: string;
}

/**
 * Resuelve la página indicada dentro de la carpeta Doc del plugin. Admite `User/x.md`, `Doc/User/x.md` o la ruta
 * absoluta del archivo, que debe estar directamente en Doc/User o Doc/Dev.
 *
 * @param pluginPath - Carpeta absoluta del plugin o del core
 * @param page - Página indicada
 * @returns Ubicación de la página
 * @throws Error si la página no existe o no está en Doc/User o Doc/Dev
 */
export async function locateDocPage(pluginPath: string, page: string): Promise<DocPageLocation> {
  const docDir = await realpath(path.join(pluginPath, 'Doc')).catch(() => null);
  if (!docDir) {
    throw new Error(`No existe la carpeta Doc en ${pluginPath}`);
  }

  const relative = page.replace(/\\/g, '/').replace(/^\.?\//, '');
  const candidate = path.isAbsolute(page)
    ? page
    : path.join(pluginPath, relative.startsWith('Doc/') ? relative : `Doc/${relative}`);
  const file = await realpath(candidate).catch(() => null);
  const info = file ? await stat(file).catch(() => null) : null;
  if (!file || !info || !info.isFile()) {
    throw new Error(`No existe la página: ${candidate}`);
  }

  const [section, name, ...rest] = path.relative(docDir, file).split(path.sep);
  if (!section || !name || rest.length > 0 || !(section in DOC_SECTIONS) || path.extname(name).toLowerCase() !== '.md') {
    throw new Error(`La página debe ser un archivo .md de Doc/User o Doc/Dev: ${page}`);
  }
  return { docDir, section, page: name, file };
}

/**
 * Lee Doc/forja.json, o devuelve las secciones vacías si no existe.
 *
 * @param docDir - Carpeta Doc
 * @returns Contenido de forja.json
 * @throws Error si no es un JSON válido o no tiene la forma esperada
 */
export async function readForjaJson(docDir: string): Promise<ForjaJson> {
  const file = path.join(docDir, 'forja.json');
  const text = await readFile(file, 'utf-8').catch(() => null);
  if (text === null) {
    return { User: {}, Dev: {} };
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`Doc/forja.json no es un JSON válido: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Doc/forja.json debe ser un objeto con las secciones User y Dev');
  }
  for (const [section, pages] of Object.entries(data)) {
    if (!pages || typeof pages !== 'object' || Array.isArray(pages)) {
      throw new Error(`Doc/forja.json: la sección ${section} debe ser un objeto con las páginas`);
    }
  }
  return data as ForjaJson;
}

/**
 * Escribe Doc/forja.json con el mismo formato que create-doc-structure.py (4 espacios y salto final).
 *
 * @param docDir - Carpeta Doc
 * @param data - Contenido
 */
export async function writeForjaJson(docDir: string, data: ForjaJson): Promise<void> {
  await writeFile(path.join(docDir, 'forja.json'), JSON.stringify(data, null, 4) + '\n', 'utf-8');
}

/**
 * Indica si una ruta de la página es local, es decir, no es una URL, una ruta absoluta de la web ni un ancla.
 *
 * @param ref - Ruta tal y como aparece en la página
 * @returns true si apunta a un archivo local
 */
export function isLocalRef(ref: string): boolean {
  return !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(ref);
}

/**
 * Rutas locales de las imágenes markdown de la página, sin repetir y en orden de aparición.
 *
 * @param body - Texto de la página
 * @returns Rutas tal y como aparecen
 */
export function findImageRefs(body: string): string[] {
  const refs = new Set<string>();
  for (const [, , ref] of body.matchAll(IMAGE_PATTERN)) {
    if (ref !== undefined && isLocalRef(ref)) {
      refs.add(ref);
    }
  }
  return [...refs];
}

/**
 * Rutas locales de los enlaces a otras páginas .md, sin repetir y en orden de aparición.
 *
 * @param body - Texto de la página
 * @returns Rutas tal y como aparecen, sin ancla
 */
export function findPageLinks(body: string): string[] {
  const refs = new Set<string>();
  for (const [, , ref] of body.matchAll(PAGE_LINK_PATTERN)) {
    if (ref !== undefined && isLocalRef(ref)) {
      refs.add(ref);
    }
  }
  return [...refs];
}

/**
 * Cambia las rutas locales de imágenes y enlaces por sus URL. Las rutas sin URL se dejan como estaban.
 *
 * @param body - Texto de la página
 * @param images - URL de cada imagen, por su ruta en la página
 * @param links - URL de cada página enlazada, por su ruta en la página
 * @returns Texto con las rutas cambiadas
 */
export function replaceRefs(body: string, images: Map<string, string>, links: Map<string, string>): string {
  return body
    .replace(IMAGE_PATTERN, (all, start: string, ref: string, end: string) =>
      images.has(ref) ? `${start}${images.get(ref)}${end}` : all
    )
    .replace(PAGE_LINK_PATTERN, (all, start: string, ref: string, anchor: string | undefined, end: string) =>
      links.has(ref) ? `${start}${links.get(ref)}${anchor ?? ''}${end}` : all
    );
}

/**
 * Extrae del final del texto las URL de las imágenes que Forja ha añadido al subirlas, en el orden en que se
 * subieron.
 *
 * @param body - Texto devuelto por Forja
 * @param count - Número de imágenes subidas
 * @returns URL de cada imagen
 * @throws Error si el texto no termina con esas imágenes
 */
export function extractAppendedImages(body: string, count: number): string[] {
  const urls: string[] = [];
  let rest = body.replace(/\s+$/, '');
  for (let i = 0; i < count; i++) {
    const match = rest.match(APPENDED_IMAGE_PATTERN);
    if (!match || match[1] === undefined) {
      throw new Error('Forja no ha devuelto las imágenes subidas al final del texto de la publicación');
    }
    urls.unshift(match[1]);
    rest = rest.slice(0, rest.length - match[0].length);
  }
  return urls;
}

/**
 * Resuelve las imágenes locales de la página: deben existir dentro de Doc y ser imágenes.
 *
 * @param location - Página
 * @param refs - Rutas de las imágenes en la página
 * @returns Imágenes con su archivo real y su hash
 * @throws Error si alguna no existe, sale de Doc o no es una imagen
 */
export async function resolveImages(location: DocPageLocation, refs: string[]): Promise<DocImage[]> {
  const images: DocImage[] = [];
  for (const ref of refs) {
    const decoded = safeDecode(ref);
    const file = await realpath(path.resolve(path.dirname(location.file), decoded)).catch(() => null);
    if (!file) {
      throw new Error(`La imagen ${ref} de ${location.section}/${location.page} no existe`);
    }
    const key = path.relative(location.docDir, file);
    if (key.startsWith('..') || path.isAbsolute(key)) {
      throw new Error(`La imagen ${ref} de ${location.section}/${location.page} está fuera de Doc`);
    }
    if (!IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
      throw new Error(`${ref} no es una imagen (${IMAGE_EXTENSIONS.join(', ')})`);
    }
    const sha256 = createHash('sha256').update(await readFile(file)).digest('hex');
    images.push({ ref, key: key.split(path.sep).join('/'), file, sha256 });
  }
  return images;
}

/**
 * Resuelve los enlaces de la página a otras páginas de Doc/User o Doc/Dev.
 *
 * @param location - Página
 * @param refs - Rutas de los enlaces en la página
 * @returns Enlaces a páginas de Doc y avisos de los que apuntan a otro sitio
 */
export function resolveLinks(location: DocPageLocation, refs: string[]): { links: DocLink[]; warnings: string[] } {
  const links: DocLink[] = [];
  const warnings: string[] = [];
  for (const ref of refs) {
    const target = path.resolve(path.dirname(location.file), safeDecode(ref));
    const [section, page, ...rest] = path.relative(location.docDir, target).split(path.sep);
    if (!section || !page || rest.length > 0 || !(section in DOC_SECTIONS)) {
      warnings.push(`El enlace ${ref} no apunta a una página de Doc/User o Doc/Dev y se deja tal cual`);
      continue;
    }
    links.push({ ref, section, page });
  }
  return { links, warnings };
}

/**
 * Decodifica una ruta escrita con %20 y similares; si no es válida, la devuelve tal cual.
 *
 * @param ref - Ruta
 * @returns Ruta decodificada
 */
function safeDecode(ref: string): string {
  try {
    return decodeURI(ref);
  } catch {
    return ref;
  }
}

/**
 * Busca una imagen ya subida con el mismo archivo y el mismo contenido, primero en la página y después en las demás
 * páginas de forja.json.
 *
 * @param forjaJson - Contenido de forja.json
 * @param entry - Entrada de la página que se publica
 * @param image - Imagen local
 * @returns Imagen subida o undefined si hay que subirla
 */
export function findSavedAsset(
  forjaJson: ForjaJson,
  entry: ForjaPageEntry,
  image: DocImage
): { url: string; sha256: string } | undefined {
  const entries = [entry, ...Object.values(forjaJson).flatMap((pages) => Object.values(pages))];
  for (const candidate of entries) {
    const saved = candidate.assets?.[image.key];
    if (saved && saved.sha256 === image.sha256 && typeof saved.url === 'string' && saved.url !== '') {
      return saved;
    }
  }
  return undefined;
}

/** Publicación tal y como la lista la API (los campos que se usan aquí). */
interface PublicationSummary {
  id: number;
  url: string;
}

/** Opciones de forja_publish_doc_page. */
export interface PublishDocPageOptions {
  /** Nombre del plugin en Forja. */
  plugin: string;
  /** Ruta de la API del plugin (`/plugins/<name>`), ya validada. */
  pluginEndpoint: string;
  /** Carpeta absoluta del plugin o del core. */
  pluginPath: string;
  /** Página: `User/x.md`, `Doc/User/x.md` o su ruta absoluta. */
  page: string;
  /** true para calcular lo que se enviaría sin publicar ni tocar forja.json. */
  dryRun: boolean;
  /** Clave de la conexión de tipo forja. */
  connection?: string | undefined;
}

/**
 * Publica (crea o actualiza) una página de Doc como publicación de Forja y guarda su id y sus imágenes en
 * Doc/forja.json.
 *
 * @param options - Opciones
 * @returns Resumen de lo publicado
 */
export async function publishDocPage(options: PublishDocPageOptions): Promise<Record<string, unknown>> {
  const location = await locateDocPage(options.pluginPath, options.page);
  const forjaJson = await readForjaJson(location.docDir);
  const sectionPages = (forjaJson[location.section] ??= {});
  const entry: ForjaPageEntry = (sectionPages[location.page] ??= {});
  const pageName = `${location.section}/${location.page}`;
  const warnings: string[] = [];

  if (typeof entry.title !== 'string' || entry.title.trim() === '') {
    throw new Error(`Falta el title de ${pageName} en Doc/forja.json: es obligatorio para publicarla`);
  }
  const body = (await readFile(location.file, 'utf-8')).replace(/\s+$/, '') + '\n';
  if (body.trim().length < MIN_BODY_LENGTH) {
    throw new Error(`${pageName} tiene ${body.trim().length} caracteres y Forja exige al menos ${MIN_BODY_LENGTH}: únela a otra página`);
  }

  // Publicaciones ya existentes del plugin: para validar los ids de forja.json y obtener la URL de los enlaces.
  const list = await forjaClient.get<{ publications?: PublicationSummary[] }>(
    `${options.pluginEndpoint}/publications`,
    undefined,
    options.connection
  );
  const published = new Map<number, string>();
  for (const publication of list.publications ?? []) {
    published.set(Number(publication.id), publication.url);
  }

  const id = entry.idpublication;
  if (id !== undefined && !published.has(Number(id))) {
    throw new Error(
      `La publicación ${id} de ${pageName} ya no existe en la forja o no es de ${options.plugin}: ` +
        'quita idpublication de su entrada en Doc/forja.json para crearla de nuevo'
    );
  }

  // Datos de la publicación
  const data: Record<string, unknown> = { type: DOC_SECTIONS[location.section] ?? 'user' };
  for (const field of DIRECT_FIELDS) {
    if (entry[field] !== undefined && entry[field] !== null) {
      data[field] = entry[field];
    }
  }
  if (entry.youtubeid !== undefined) {
    data.youtube = entry.youtubeid;
  }
  if (entry.parent !== undefined) {
    const parentId = sectionPages[entry.parent]?.idpublication;
    if (parentId === undefined || !published.has(Number(parentId))) {
      throw new Error(`Publica antes la página padre ${location.section}/${entry.parent}: aún no tiene publicación en la forja`);
    }
    data.idparent = parentId;
  }
  const ignored: string[] = [];
  for (const [field, reason] of Object.entries(IGNORED_FIELDS)) {
    if (entry[field] !== undefined && !(field === 'visibility' && entry.visibility === true)) {
      ignored.push(`${field}: ${reason}`);
    }
  }

  // Enlaces a otras páginas
  const { links, warnings: linkWarnings } = resolveLinks(location, findPageLinks(body));
  warnings.push(...linkWarnings);
  const linkUrls = new Map<string, string>();
  const unresolved: string[] = [];
  for (const link of links) {
    const targetId = forjaJson[link.section]?.[link.page]?.idpublication;
    const url = targetId !== undefined ? published.get(Number(targetId)) : undefined;
    if (url) {
      linkUrls.set(link.ref, url);
    } else {
      unresolved.push(`${link.section}/${link.page}`);
    }
  }
  if (unresolved.length > 0) {
    warnings.push(
      `Enlaces a páginas sin publicar, que se dejan como están: ${unresolved.join(', ')}. ` +
        'Publícalas y vuelve a publicar esta página para enlazarlas'
    );
  }

  // Imágenes: se reutilizan las ya subidas que no han cambiado, por esta página o por otra
  const images = await resolveImages(location, findImageRefs(body));
  const imageUrls = new Map<string, string>();
  const toUpload: DocImage[] = [];
  for (const image of images) {
    const saved = findSavedAsset(forjaJson, entry, image);
    if (saved) {
      imageUrls.set(image.ref, saved.url);
    } else if (!toUpload.some((pending) => pending.key === image.key)) {
      toUpload.push(image);
    }
  }

  const summary = {
    plugin: options.plugin,
    page: pageName,
    action: id === undefined ? 'create' : 'update',
    id: id ?? null,
    fields: { ...data, body: `${body.length} caracteres` },
    images: {
      upload: toUpload.map((image) => image.key),
      reuse: images.filter((image) => imageUrls.has(image.ref)).map((image) => image.key),
    },
    links: { resolved: [...linkUrls.keys()], unresolved },
    ignored_fields: ignored,
    warnings,
  };
  if (options.dryRun) {
    return { dry_run: true, ...summary };
  }

  // Primera petición: crea o actualiza con las imágenes nuevas, que Forja añade al final del texto
  const firstBody = replaceRefs(body, imageUrls, linkUrls);
  const endpoint = id === undefined
    ? `${options.pluginEndpoint}/publications`
    : `${options.pluginEndpoint}/publications/${id}`;
  let response: { id?: number; url?: string; body?: string };
  if (toUpload.length > 0) {
    response = await forjaClient.sendMultipart(
      'POST',
      endpoint,
      { ...data, body: firstBody },
      toUpload.map((image) => ({ field: 'images[]', path: image.file })),
      options.connection
    );
  } else {
    response = await forjaClient.sendJson(id === undefined ? 'POST' : 'PATCH', endpoint, { ...data, body: firstBody }, options.connection);
  }

  const publicationId = Number(response.id ?? id);
  if (!Number.isInteger(publicationId) || publicationId <= 0) {
    throw new Error('Forja no ha devuelto el id de la publicación');
  }
  // El id se guarda antes de la segunda petición: si fallase, la siguiente publicación actualiza en vez de duplicar.
  entry.idpublication = publicationId;
  await writeForjaJson(location.docDir, forjaJson);

  let url = response.url ?? published.get(publicationId) ?? null;
  if (toUpload.length > 0) {
    const uploadedUrls = extractAppendedImages(String(response.body ?? ''), toUpload.length);
    toUpload.forEach((image, index) => {
      const uploaded = uploadedUrls[index];
      for (const same of images.filter((other) => other.key === image.key)) {
        if (uploaded !== undefined) {
          imageUrls.set(same.ref, uploaded);
        }
      }
    });
    const final = await forjaClient.sendJson<{ url?: string }>(
      'PATCH',
      `${options.pluginEndpoint}/publications/${publicationId}`,
      { body: replaceRefs(body, imageUrls, linkUrls) },
      options.connection
    );
    url = final.url ?? url;
  }

  // Solo se conservan las imágenes que la página sigue usando
  const assets: Record<string, { url: string; sha256: string }> = {};
  for (const image of images) {
    const imageUrl = imageUrls.get(image.ref);
    if (imageUrl) {
      assets[image.key] = { url: imageUrl, sha256: image.sha256 };
    }
  }
  if (Object.keys(assets).length > 0) {
    entry.assets = assets;
  } else {
    delete entry.assets;
  }
  await writeForjaJson(location.docDir, forjaJson);

  return {
    ...summary,
    action: id === undefined ? 'created' : 'updated',
    id: publicationId,
    url,
    forja_json: path.join(location.docDir, 'forja.json'),
  };
}
