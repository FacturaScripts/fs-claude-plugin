/**
 * Validación de los archivos locales que las tools de los plugins oficiales
 * suben a FacturaScripts.
 *
 * Una tool de subida lee un archivo del equipo y lo envía al ERP, donde lo puede
 * ver cualquiera con acceso al registro. Para que una instrucción maliciosa
 * (por ejemplo, el texto de una nota) o una ruta equivocada no acaben subiendo
 * credenciales, solo se aceptan archivos normales y visibles: se resuelven los
 * enlaces simbólicos y se rechazan los archivos y carpetas ocultos, la
 * configuración de fs-mcp, las carpetas del sistema y de datos de aplicaciones,
 * y las extensiones típicas de claves y certificados.
 */

import { realpath, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { CONFIG_FILE_NAME, LEGACY_CONFIG_FILE_NAME } from '../../utils/configPath.js';

/** Tamaño máximo por defecto de un archivo subido (25 MB). */
export const DEFAULT_MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/** Carpetas del sistema desde las que nunca se sube nada. */
const SYSTEM_DIRS = ['/etc', '/private/etc', '/proc', '/sys', '/dev', '/root'];

/** Carpetas del usuario (relativas a su home) con credenciales o datos de aplicaciones. */
const HOME_DIRS = [
    'Library/Keychains',
    'Library/Cookies',
    'Library/Application Support',
    'Library/Containers',
    'Library/Group Containers',
    'AppData',
];

/** Extensiones de claves, certificados y almacenes de contraseñas. */
const SENSITIVE_EXTENSIONS = new Set(['.pem', '.key', '.p12', '.pfx', '.jks', '.keystore', '.kdbx', '.ppk', '.gpg', '.asc']);

/** Prefijo de los nombres de las claves SSH (`id_rsa`, `id_ed25519`...). */
const SSH_KEY_PREFIX = 'id_';

/** Archivo local validado y listo para subir. */
export interface UploadFile {
    /** Ruta real del archivo, con los enlaces simbólicos resueltos. */
    path: string;
    /** Nombre del archivo que se envía al ERP (el de la ruta indicada). */
    name: string;
    /** Tamaño en bytes. */
    size: number;
}

/** Resultado de la validación: el archivo o el motivo del rechazo. */
export type UploadCheck = { ok: true; file: UploadFile } | { ok: false; error: string };

/** Opciones de la validación, pensadas sobre todo para los tests. */
export interface UploadOptions {
    /** Directorio home del usuario; por defecto, el del sistema. */
    home?: string;
    /** Tamaño máximo en bytes; por defecto, 25 MB. */
    maxBytes?: number;
}

/**
 * Normaliza una ruta para compararla: en macOS y Windows el sistema de archivos
 * no distingue mayúsculas, así que se comparan en minúsculas.
 *
 * @param value ruta absoluta.
 */
function comparable(value: string): string {
    const normalized = path.resolve(value);
    return process.platform === 'darwin' || process.platform === 'win32' ? normalized.toLowerCase() : normalized;
}

/**
 * Indica si una ruta está dentro de una carpeta (o es la propia carpeta).
 *
 * @param child ruta que se comprueba.
 * @param parent carpeta contenedora.
 */
function isInside(child: string, parent: string): boolean {
    const relative = path.relative(comparable(parent), comparable(child));
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

/**
 * Resuelve una ruta con sus enlaces simbólicos; si no existe, la devuelve tal cual.
 *
 * @param value ruta absoluta.
 */
async function realOrSelf(value: string): Promise<string> {
    return realpath(value).catch(() => path.resolve(value));
}

/**
 * Ruta del archivo de conexiones indicado en FS_CONNECTIONS_FILE, con la misma
 * regla que ConnectionManager: se ignoran los marcadores sin expandir (`${...}`)
 * y una ruta relativa se resuelve respecto al directorio de trabajo, que es
 * donde la abre el gestor de conexiones.
 *
 * @returns la ruta absoluta, o null si la variable no está definida.
 */
function connectionsFileFromEnv(): string | null {
    const value = process.env.FS_CONNECTIONS_FILE;
    if (!value || value.startsWith('${')) return null;
    return path.resolve(value);
}

/**
 * Devuelve el motivo por el que una ruta no se puede subir, o null si se puede.
 *
 * @param target ruta que se comprueba (la indicada o la real).
 * @param home directorio home del usuario.
 * @param protectedFiles archivos de configuración de fs-mcp, con sus rutas reales.
 */
function blockedReason(target: string, home: string, protectedFiles: string[]): string | null {
    if (protectedFiles.some((file) => comparable(file) === comparable(target))) {
        return 'es el archivo de configuración de fs-mcp, que contiene los tokens de las conexiones';
    }

    const segments = path.resolve(target).split(path.sep).filter((segment) => segment !== '');
    if (segments.some((segment) => segment.startsWith('.'))) {
        return 'está oculto o dentro de una carpeta oculta (por ejemplo .ssh, .aws o .env), donde suele haber credenciales';
    }

    const dirs = [...SYSTEM_DIRS, ...HOME_DIRS.map((dir) => path.join(home, dir))];
    const dir = dirs.find((candidate) => isInside(target, candidate));
    if (dir) return `está dentro de ${dir}, una carpeta del sistema o de datos de aplicaciones`;

    const name = path.basename(target).toLowerCase();
    if (SENSITIVE_EXTENSIONS.has(path.extname(name)) || name.startsWith(SSH_KEY_PREFIX)) {
        return 'parece una clave, un certificado o un almacén de contraseñas';
    }
    return null;
}

/**
 * Comprueba que una ruta local se puede subir a FacturaScripts y devuelve el
 * archivo real que hay que leer.
 *
 * Exige una ruta absoluta a un archivo normal que no supere el tamaño máximo. Se
 * comprueban tanto la ruta indicada como la ruta real tras resolver los enlaces
 * simbólicos, para que un enlace visible no sirva para leer un archivo protegido.
 *
 * @param raw ruta recibida en los argumentos de la tool.
 * @param options home del usuario y tamaño máximo.
 * @returns el archivo validado o el motivo del rechazo.
 */
export async function checkUploadPath(raw: unknown, options: UploadOptions = {}): Promise<UploadCheck> {
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (value === '' || !path.isAbsolute(value)) {
        return { ok: false, error: 'indica la ruta absoluta del archivo.' };
    }

    const home = await realOrSelf(options.home ?? os.homedir());
    const maxBytes = options.maxBytes ?? DEFAULT_MAX_UPLOAD_BYTES;
    const configFiles = [path.join(home, CONFIG_FILE_NAME), path.join(home, LEGACY_CONFIG_FILE_NAME)];
    const envFile = connectionsFileFromEnv();
    if (envFile) configFiles.push(envFile);
    const protectedFiles = await Promise.all(configFiles.map(realOrSelf));

    const given = path.resolve(value);
    const real = await realpath(given).catch(() => null);
    if (!real) return { ok: false, error: `no existe el archivo ${value}.` };

    for (const target of new Set([given, real])) {
        const reason = blockedReason(target, home, [...configFiles, ...protectedFiles]);
        if (reason) return { ok: false, error: `no se sube ${value} porque ${reason}.` };
    }

    const info = await stat(real).catch(() => null);
    if (!info?.isFile()) return { ok: false, error: `${value} no es un archivo normal.` };
    if (info.size > maxBytes) {
        return { ok: false, error: `el archivo ocupa más de ${Math.round(maxBytes / 1024 / 1024)} MB.` };
    }

    return { ok: true, file: { path: real, name: path.basename(given), size: info.size } };
}
