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
import { lstat, mkdir, mkdtemp, open, readdir, readFile, realpath, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { deflateRawSync } from 'zlib';
/** Grupos de entradas que se quitan del zip, con el motivo que se muestra en el resumen. */
export const EXCLUDE_REASONS = {
    hidden: 'archivos y carpetas ocultos (.git, .github, .claude, .agents, .DS_Store, .gitignore...)',
    test: 'carpeta Test de la raíz',
    doc: 'carpeta Doc de la raíz, o lo que no es documentación publicable con include_docs (Forja no la reparte)',
    ai: 'archivos de asistentes de IA (CLAUDE.md, AGENTS.md...)',
    system: 'metadatos del sistema (__MACOSX, Thumbs.db, desktop.ini)',
    symlink: 'enlaces simbólicos (Forja no los admite)',
    core: 'carpetas y archivos locales del core (Plugins, Dinamic, MyFiles, config*.php)',
};
/** Archivos de asistentes de IA que Forja quita en cualquier carpeta (en minúsculas). */
const AI_FILE_NAMES = ['agents.md', 'agents.override.md', 'claude.local.md', 'claude.md'];
/** Metadatos del sistema que Forja quita en cualquier carpeta (en minúsculas); los que empiezan por punto ya son ocultos. */
const SYSTEM_ENTRY_NAMES = ['__macosx', 'desktop.ini', 'thumbs.db'];
/** Carpetas y archivos de la raíz del core que son de la instalación local. */
const CORE_LOCAL_FOLDERS = ['Dinamic', 'MyFiles', 'Plugins'];
const CORE_CONFIG_PATTERN = /^config.*\.php$/i;
/** Contenido de Doc que Forja importa como documentación al publicar una versión. */
const PUBLISHABLE_DOC_ENTRIES = ['Assets', 'Dev', 'User', 'forja.json'];
/** Carpeta raíz del zip del core: la que el actualizador del core espera encontrar. */
const CORE_ZIP_FOLDER = 'facturascripts';
/** Límites de Forja al validar el zip de una versión. */
const FORJA_MAX_FILES = 10_000;
const FORJA_MAX_UNCOMPRESSED_SIZE = 200 * 1024 * 1024;
/** Máximo de rutas de ejemplo por grupo en el resumen. */
const SAMPLE_SIZE = 20;
/** Versión válida para Forja: números separados por puntos. */
const VERSION_PATTERN = /^[0-9]+(\.[0-9]+)*$/;
/** Nombre válido de la carpeta raíz: sin separadores ni rutas relativas. */
const ROOT_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
/**
 * Carpeta temporal propia donde se crean los zips. forja_upload_build solo borra zips de dentro de ella.
 *
 * @returns Ruta de la carpeta (sin crear)
 */
export function buildZipBaseDir() {
    return path.join(os.tmpdir(), 'fs-mcp-forja-builds');
}
/**
 * Indica si un archivo está dentro de la carpeta temporal de zips de la herramienta, comparando rutas reales.
 *
 * @param file - Ruta del archivo
 * @returns true si está dentro de esa carpeta
 */
export async function isToolBuildZip(file) {
    const base = await realpath(buildZipBaseDir()).catch(() => null);
    const real = await realpath(file).catch(() => null);
    if (!base || !real) {
        return false;
    }
    const relative = path.relative(base, real);
    return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}
/**
 * Borra un zip creado por la herramienta y su carpeta temporal, si queda vacía.
 *
 * @param file - Ruta del zip
 * @returns true si se ha borrado; false si no es un zip de la herramienta
 */
export async function removeToolBuildZip(file) {
    if (!(await isToolBuildZip(file))) {
        return false;
    }
    const real = await realpath(file);
    await rm(real, { force: true });
    const folder = path.dirname(real);
    const base = await realpath(buildZipBaseDir());
    if (folder !== base && (await readdir(folder)).length === 0) {
        await rm(folder, { recursive: true, force: true });
    }
    return true;
}
/**
 * Lee un facturascripts.ini con el mismo criterio que parse_ini_string para las claves simples: `clave = valor`,
 * con comillas opcionales y comentarios con ; o #.
 *
 * @param content - Contenido del archivo
 * @returns Claves y valores
 */
export function parseIni(content) {
    const values = {};
    for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (line === '' || line.startsWith(';') || line.startsWith('#') || line.startsWith('[')) {
            continue;
        }
        const match = line.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.*)$/);
        if (!match) {
            continue;
        }
        let value = (match[2] ?? '').trim();
        const quoted = value.match(/^"([^"]*)"|^'([^']*)'/);
        if (quoted) {
            value = quoted[1] ?? quoted[2] ?? '';
        }
        else {
            value = value.replace(/\s*;.*$/, '').trim();
        }
        values[match[1] ?? ''] = value;
    }
    return values;
}
/**
 * Identifica el proyecto de una carpeta: un plugin (facturascripts.ini) o el core (Core/Kernel.php).
 *
 * @param source - Carpeta del proyecto
 * @returns Tipo, nombre, versión y carpeta raíz del zip
 * @throws Error si la carpeta no es un plugin ni el core, o le faltan el nombre o la versión
 */
export async function readProjectInfo(source) {
    const ini = await readFile(path.join(source, 'facturascripts.ini'), 'utf-8').catch(() => null);
    if (ini !== null) {
        const values = parseIni(ini);
        const name = values.name ?? '';
        const version = values.version ?? '';
        if (!ROOT_NAME_PATTERN.test(name)) {
            throw new Error(`El facturascripts.ini de ${source} no tiene un name válido: "${name}"`);
        }
        if (!VERSION_PATTERN.test(version)) {
            throw new Error(`El facturascripts.ini de ${source} no tiene una version válida: "${version}" (debe ser numérica, por ejemplo 1.5)`);
        }
        return { type: 'plugin', name, version, root: name };
    }
    const kernel = await readFile(path.join(source, 'Core', 'Kernel.php'), 'utf-8').catch(() => null);
    if (kernel === null) {
        throw new Error(`${source} no es un plugin ni el core de FacturaScripts: falta el facturascripts.ini (plugin) o Core/Kernel.php (core)`);
    }
    const match = kernel.match(/function\s+version\s*\(\s*\)\s*:\s*float\s*\{\s*return\s+([0-9]+(?:\.[0-9]+)*)\s*;/);
    if (!match || !match[1]) {
        throw new Error(`No se ha podido leer la versión del core en ${path.join(source, 'Core', 'Kernel.php')}`);
    }
    return { type: 'core', name: CORE_ZIP_FOLDER, version: match[1], root: CORE_ZIP_FOLDER };
}
/**
 * Motivo por el que se excluye una entrada, o null si se incluye.
 *
 * @param parts - Partes de la ruta relativa a la carpeta del proyecto
 * @param isDirectory - Si la entrada es una carpeta
 * @param type - Tipo de proyecto
 * @param includeDocs - Si se conserva la documentación publicable de Doc
 * @returns Grupo de exclusión o null
 */
export function excludeReason(parts, isDirectory, type, includeDocs = false) {
    const name = parts[parts.length - 1] ?? '';
    const lower = name.toLowerCase();
    const isRoot = parts.length === 1;
    if (name.startsWith('.')) {
        return 'hidden';
    }
    if (SYSTEM_ENTRY_NAMES.includes(lower)) {
        return 'system';
    }
    if (isRoot && isDirectory && name === 'Test') {
        return 'test';
    }
    // sin include_docs se quita la carpeta Doc entera; con él, solo entra lo que Forja importa
    if (parts[0] === 'Doc') {
        const notPublishable = parts.length === 2 && !PUBLISHABLE_DOC_ENTRIES.includes(name);
        if (!includeDocs || (isRoot && !isDirectory) || notPublishable) {
            return 'doc';
        }
    }
    if (!isDirectory && AI_FILE_NAMES.includes(lower)) {
        return 'ai';
    }
    if (type === 'core' && isRoot && ((isDirectory && CORE_LOCAL_FOLDERS.includes(name)) || (!isDirectory && CORE_CONFIG_PATTERN.test(name)))) {
        return 'core';
    }
    return null;
}
/**
 * Recorre la carpeta del proyecto y reúne lo que entra en el zip y lo que se excluye.
 *
 * @param source - Carpeta del proyecto
 * @param info - Datos del proyecto
 * @param includeDocs - Si se conserva la documentación publicable de Doc
 * @returns Entradas del zip (con la carpeta raíz) y exclusiones por grupo
 */
async function collectEntries(source, info, includeDocs) {
    const entries = [];
    const excluded = {};
    const exclude = (reason, relative) => {
        const group = (excluded[reason] ??= { reason: EXCLUDE_REASONS[reason], count: 0, sample: [] });
        group.count++;
        if (group.sample.length < SAMPLE_SIZE) {
            group.sample.push(relative);
        }
    };
    const walk = async (dir, parts) => {
        const names = (await readdir(dir)).sort();
        for (const name of names) {
            const absolute = path.join(dir, name);
            const childParts = [...parts, name];
            const relative = childParts.join('/');
            const entryInfo = await lstat(absolute);
            if (entryInfo.isSymbolicLink()) {
                exclude('symlink', relative);
                continue;
            }
            if (!entryInfo.isDirectory() && !entryInfo.isFile()) {
                continue;
            }
            const reason = excludeReason(childParts, entryInfo.isDirectory(), info.type, includeDocs);
            if (reason) {
                exclude(reason, entryInfo.isDirectory() ? `${relative}/` : relative);
                continue;
            }
            if (entryInfo.isDirectory()) {
                entries.push({ name: `${info.root}/${relative}/`, mtime: entryInfo.mtime });
                await walk(absolute, childParts);
            }
            else {
                entries.push({ name: `${info.root}/${relative}`, file: absolute, mtime: entryInfo.mtime });
            }
        }
    };
    const rootInfo = await lstat(source);
    entries.push({ name: `${info.root}/`, mtime: rootInfo.mtime });
    await walk(source, []);
    return { entries, excluded };
}
/**
 * Comprueba lo que Forja o el actualizador del core exigen y no se puede arreglar quitando archivos.
 *
 * @param source - Carpeta del proyecto
 * @param info - Datos del proyecto
 * @param entries - Entradas del zip
 * @returns Avisos que no impiden crear el zip
 * @throws Error si el zip no sería válido
 */
async function checkRequirements(source, info, entries) {
    const warnings = [];
    const has = (relative) => entries.some((entry) => entry.name === `${info.root}/${relative}`);
    if (info.type === 'core') {
        // el actualizador del core sustituye Core, vendor y node_modules con los del zip
        for (const folder of ['Core', 'vendor', 'node_modules']) {
            if (!has(`${folder}/`)) {
                throw new Error(`Falta la carpeta ${folder} del core en ${source}: ejecuta composer install --no-dev y npm install antes de empaquetarlo`);
            }
        }
        if (has('vendor/phpunit/')) {
            warnings.push('vendor incluye dependencias de desarrollo (phpunit): ejecuta composer install --no-dev para un zip más ligero');
        }
    }
    else {
        // Forja rechaza un composer.json o un package.json en la raíz sin sus dependencias instaladas
        if (has('composer.json') && !has('vendor/')) {
            throw new Error('El plugin tiene composer.json en la raíz pero no la carpeta vendor: ejecuta composer install --no-dev, porque Forja rechaza el zip sin ella');
        }
        if (has('package.json') && !has('node_modules/')) {
            throw new Error('El plugin tiene package.json en la raíz pero no la carpeta node_modules: ejecuta npm install, porque Forja rechaza el zip sin ella');
        }
    }
    return warnings;
}
/** Tabla del CRC-32 (polinomio 0xEDB88320) que usa el formato zip. */
const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c >>> 0;
    }
    return table;
})();
/**
 * Calcula el CRC-32 de un contenido.
 *
 * @param data - Contenido
 * @returns CRC-32 sin signo
 */
export function crc32(data) {
    let crc = 0xffffffff;
    for (const byte of data) {
        crc = (CRC_TABLE[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}
/**
 * Fecha y hora en formato MS-DOS, el que guarda el zip.
 *
 * @param date - Fecha
 * @returns Hora y fecha DOS
 */
function dosDateTime(date) {
    const year = Math.max(1980, date.getFullYear());
    return {
        time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
        date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    };
}
/**
 * Escribe el zip en disco, entrada a entrada, con deflate o sin comprimir si no compensa.
 *
 * @param target - Ruta del zip
 * @param entries - Entradas en orden
 * @returns Archivos y tamaño sin comprimir
 */
async function writeZip(target, entries) {
    if (entries.length > 0xffff) {
        throw new Error('Demasiados archivos para un zip sin ZIP64');
    }
    const handle = await open(target, 'w');
    const central = [];
    let offset = 0;
    let files = 0;
    let uncompressed = 0;
    try {
        for (const entry of entries) {
            const isDirectory = entry.file === undefined;
            const content = isDirectory ? Buffer.alloc(0) : await readFile(entry.file);
            const deflated = isDirectory ? content : deflateRawSync(content, { level: 9 });
            const useDeflate = !isDirectory && deflated.length < content.length;
            const data = useDeflate ? deflated : content;
            const crc = crc32(content);
            const name = Buffer.from(entry.name, 'utf-8');
            const { time, date } = dosDateTime(entry.mtime);
            // bit 11: nombres en UTF-8
            const flags = 0x0800;
            const method = useDeflate ? 8 : 0;
            if (offset + data.length > 0xffffffff || content.length > 0xffffffff) {
                throw new Error('El zip supera 4 GB, el máximo sin ZIP64');
            }
            const local = Buffer.alloc(30);
            local.writeUInt32LE(0x04034b50, 0);
            local.writeUInt16LE(20, 4);
            local.writeUInt16LE(flags, 6);
            local.writeUInt16LE(method, 8);
            local.writeUInt16LE(time, 10);
            local.writeUInt16LE(date, 12);
            local.writeUInt32LE(crc, 14);
            local.writeUInt32LE(data.length, 18);
            local.writeUInt32LE(content.length, 22);
            local.writeUInt16LE(name.length, 26);
            local.writeUInt16LE(0, 28);
            await handle.write(local);
            await handle.write(name);
            await handle.write(data);
            // permisos Unix como al empaquetar a mano: 0755 en carpetas y 0644 en archivos
            const mode = isDirectory ? 0o040755 : 0o100644;
            const header = Buffer.alloc(46);
            header.writeUInt32LE(0x02014b50, 0);
            header.writeUInt16LE((3 << 8) | 20, 4);
            header.writeUInt16LE(20, 6);
            header.writeUInt16LE(flags, 8);
            header.writeUInt16LE(method, 10);
            header.writeUInt16LE(time, 12);
            header.writeUInt16LE(date, 14);
            header.writeUInt32LE(crc, 16);
            header.writeUInt32LE(data.length, 20);
            header.writeUInt32LE(content.length, 24);
            header.writeUInt16LE(name.length, 28);
            header.writeUInt16LE(0, 30);
            header.writeUInt16LE(0, 32);
            header.writeUInt16LE(0, 34);
            header.writeUInt16LE(0, 36);
            header.writeUInt32LE(((mode << 16) | (isDirectory ? 0x10 : 0)) >>> 0, 38);
            header.writeUInt32LE(offset, 42);
            central.push(header, name);
            offset += local.length + name.length + data.length;
            if (!isDirectory) {
                files++;
                uncompressed += content.length;
            }
        }
        const centralBuffer = Buffer.concat(central);
        const end = Buffer.alloc(22);
        end.writeUInt32LE(0x06054b50, 0);
        end.writeUInt16LE(0, 4);
        end.writeUInt16LE(0, 6);
        end.writeUInt16LE(entries.length, 8);
        end.writeUInt16LE(entries.length, 10);
        end.writeUInt32LE(centralBuffer.length, 12);
        end.writeUInt32LE(offset, 16);
        end.writeUInt16LE(0, 20);
        await handle.write(centralBuffer);
        await handle.write(end);
    }
    finally {
        await handle.close();
    }
    return { files, uncompressed };
}
/**
 * Crea el zip de una versión de un plugin o del core en una carpeta temporal propia.
 *
 * @param source - Carpeta absoluta del plugin o del core
 * @param includeDocs - Conserva Doc/User, Doc/Dev, Doc/Assets y Doc/forja.json para que Forja importe la documentación
 * @returns Ruta del zip, datos del proyecto y resumen de lo excluido
 * @throws Error si la carpeta no es válida o el zip no lo sería para Forja
 */
export async function buildProjectZip(source, includeDocs = false) {
    const sourceInfo = await lstat(source).catch(() => null);
    if (!sourceInfo || !sourceInfo.isDirectory()) {
        throw new Error(`No existe la carpeta: ${source}`);
    }
    const info = await readProjectInfo(source);
    const { entries, excluded } = await collectEntries(source, info, includeDocs);
    const warnings = await checkRequirements(source, info, entries);
    const fileCount = entries.filter((entry) => entry.file !== undefined).length;
    if (info.type === 'plugin' && fileCount > FORJA_MAX_FILES) {
        throw new Error(`El plugin tiene ${fileCount} archivos y Forja admite como máximo ${FORJA_MAX_FILES} por zip`);
    }
    const base = buildZipBaseDir();
    await mkdir(base, { recursive: true });
    const folder = await mkdtemp(path.join(base, `${info.name}-`));
    const target = path.join(folder, `${info.name}-${info.version}.zip`);
    let written;
    try {
        written = await writeZip(target, entries);
    }
    catch (error) {
        await rm(folder, { recursive: true, force: true });
        throw error;
    }
    if (info.type === 'plugin' && written.uncompressed > FORJA_MAX_UNCOMPRESSED_SIZE) {
        warnings.push(`El plugin ocupa ${Math.round(written.uncompressed / 1048576)} MB sin comprimir y Forja rechaza los zips de más de 200 MB`);
    }
    return {
        ...info,
        path: target,
        source,
        files: written.files,
        bytes: (await lstat(target)).size,
        uncompressed_bytes: written.uncompressed,
        excluded,
        warnings,
    };
}
//# sourceMappingURL=build-zip.js.map