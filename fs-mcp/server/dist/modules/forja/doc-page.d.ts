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
/** Secciones de Doc que se publican y el tipo de publicación de cada una. */
export declare const DOC_SECTIONS: Record<string, 'user' | 'dev'>;
/** Longitud mínima del cuerpo que acepta Forja. */
export declare const MIN_BODY_LENGTH = 300;
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
    assets?: Record<string, {
        url: string;
        sha256: string;
    }>;
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
export declare function locateDocPage(pluginPath: string, page: string): Promise<DocPageLocation>;
/**
 * Lee Doc/forja.json, o devuelve las secciones vacías si no existe.
 *
 * @param docDir - Carpeta Doc
 * @returns Contenido de forja.json
 * @throws Error si no es un JSON válido o no tiene la forma esperada
 */
export declare function readForjaJson(docDir: string): Promise<ForjaJson>;
/**
 * Escribe Doc/forja.json con el mismo formato que create-doc-structure.py (4 espacios y salto final).
 *
 * @param docDir - Carpeta Doc
 * @param data - Contenido
 */
export declare function writeForjaJson(docDir: string, data: ForjaJson): Promise<void>;
/**
 * Indica si una ruta de la página es local, es decir, no es una URL, una ruta absoluta de la web ni un ancla.
 *
 * @param ref - Ruta tal y como aparece en la página
 * @returns true si apunta a un archivo local
 */
export declare function isLocalRef(ref: string): boolean;
/**
 * Rutas locales de las imágenes markdown de la página, sin repetir y en orden de aparición.
 *
 * @param body - Texto de la página
 * @returns Rutas tal y como aparecen
 */
export declare function findImageRefs(body: string): string[];
/**
 * Rutas locales de los enlaces a otras páginas .md, sin repetir y en orden de aparición.
 *
 * @param body - Texto de la página
 * @returns Rutas tal y como aparecen, sin ancla
 */
export declare function findPageLinks(body: string): string[];
/**
 * Cambia las rutas locales de imágenes y enlaces por sus URL. Las rutas sin URL se dejan como estaban.
 *
 * @param body - Texto de la página
 * @param images - URL de cada imagen, por su ruta en la página
 * @param links - URL de cada página enlazada, por su ruta en la página
 * @returns Texto con las rutas cambiadas
 */
export declare function replaceRefs(body: string, images: Map<string, string>, links: Map<string, string>): string;
/**
 * Extrae del final del texto las URL de las imágenes que Forja ha añadido al subirlas, en el orden en que se
 * subieron.
 *
 * @param body - Texto devuelto por Forja
 * @param count - Número de imágenes subidas
 * @returns URL de cada imagen
 * @throws Error si el texto no termina con esas imágenes
 */
export declare function extractAppendedImages(body: string, count: number): string[];
/**
 * Resuelve las imágenes locales de la página: deben existir dentro de Doc y ser imágenes.
 *
 * @param location - Página
 * @param refs - Rutas de las imágenes en la página
 * @returns Imágenes con su archivo real y su hash
 * @throws Error si alguna no existe, sale de Doc o no es una imagen
 */
export declare function resolveImages(location: DocPageLocation, refs: string[]): Promise<DocImage[]>;
/**
 * Resuelve los enlaces de la página a otras páginas de Doc/User o Doc/Dev.
 *
 * @param location - Página
 * @param refs - Rutas de los enlaces en la página
 * @returns Enlaces a páginas de Doc y avisos de los que apuntan a otro sitio
 */
export declare function resolveLinks(location: DocPageLocation, refs: string[]): {
    links: DocLink[];
    warnings: string[];
};
/**
 * Busca una imagen ya subida con el mismo archivo y el mismo contenido, primero en la página y después en las demás
 * páginas de forja.json.
 *
 * @param forjaJson - Contenido de forja.json
 * @param entry - Entrada de la página que se publica
 * @param image - Imagen local
 * @returns Imagen subida o undefined si hay que subirla
 */
export declare function findSavedAsset(forjaJson: ForjaJson, entry: ForjaPageEntry, image: DocImage): {
    url: string;
    sha256: string;
} | undefined;
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
export declare function publishDocPage(options: PublishDocPageOptions): Promise<Record<string, unknown>>;
//# sourceMappingURL=doc-page.d.ts.map