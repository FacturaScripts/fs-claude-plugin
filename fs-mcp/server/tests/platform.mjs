/**
 * Ayudas de las pruebas para que se ejecuten igual en Linux, macOS y Windows.
 *
 * - El directorio personal: `os.homedir()` lee HOME en Linux y macOS, pero
 *   USERPROFILE en Windows. Una prueba que solo cambie HOME escribiría en
 *   Windows en el `~/.fs-ai.json` real del usuario, así que se fijan las dos.
 * - Python: en Windows `python3` suele ser el alias de la Microsoft Store, que
 *   no ejecuta nada; se prueba `python3`, `python` y `py -3` por ese orden.
 * - Los permisos POSIX (0600, 0700) no existen en Windows, y crear enlaces
 *   simbólicos exige allí el modo de desarrollador o permisos de administrador.
 *
 * @author Esteban Sánchez Martínez <esteban@factura.city>
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** Variables de entorno con el directorio personal según el sistema. */
const HOME_VARIABLES = ['HOME', 'USERPROFILE'];

/** Indica si el sistema aplica los permisos POSIX de archivos y carpetas. */
export const POSIX_MODES = process.platform !== 'win32';

/**
 * Apunta el directorio personal del proceso a `dir` en todos los sistemas.
 *
 * @param {string} dir carpeta temporal que hace de home.
 */
export function fijarHome(dir) {
  for (const variable of HOME_VARIABLES) process.env[variable] = dir;
}

/**
 * Guarda el directorio personal actual y devuelve la función que lo restaura,
 * borrando las variables que no estaban definidas.
 *
 * @returns {() => void} función que restaura HOME y USERPROFILE.
 */
export function guardarHome() {
  const copia = HOME_VARIABLES.map((variable) => [variable, process.env[variable]]);
  return () => {
    for (const [variable, valor] of copia) {
      if (valor === undefined) delete process.env[variable];
      else process.env[variable] = valor;
    }
  };
}

/**
 * Entorno mínimo para un proceso hijo con el directorio personal en `dir`.
 * Conserva PATH y, en Windows, SystemRoot, sin el que Python no arranca bien.
 *
 * @param {string} dir carpeta temporal que hace de home.
 * @returns {Record<string, string>} variables de entorno.
 */
export function entornoConHome(dir) {
  const env = { PATH: process.env.PATH ?? '', HOME: dir, USERPROFILE: dir };
  if (process.env.SystemRoot) env.SystemRoot = process.env.SystemRoot;
  return env;
}

/** Intérprete de Python encontrado, o null si no hay ninguno. */
let pythonEncontrado;

/**
 * Devuelve el comando de Python 3 que funciona en este equipo, con sus
 * argumentos previos (por ejemplo, `py -3`), o null si no hay ninguno.
 *
 * @returns {{command: string, args: string[]} | null}
 */
export function python() {
  if (pythonEncontrado !== undefined) return pythonEncontrado;
  const candidatos = [['python3'], ['python'], ['py', '-3']];
  pythonEncontrado = null;
  for (const [command, ...args] of candidatos) {
    try {
      execFileSync(command, [...args, '-c', 'import sys; sys.exit(0 if sys.version_info[0] == 3 else 1)'], {
        stdio: 'ignore',
      });
      pythonEncontrado = { command, args };
      break;
    } catch {
      // Sin este intérprete (o es el alias de la Microsoft Store): se prueba el siguiente.
    }
  }
  return pythonEncontrado;
}

/** Resultado de la comprobación de enlaces simbólicos. */
let enlacesPermitidos;

/**
 * Indica si el usuario puede crear enlaces simbólicos (en Windows exige el
 * modo de desarrollador o permisos de administrador).
 *
 * @returns {boolean}
 */
export function enlacesSimbolicos() {
  if (enlacesPermitidos !== undefined) return enlacesPermitidos;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-enlace-'));
  try {
    fs.writeFileSync(path.join(dir, 'destino'), '');
    fs.symlinkSync(path.join(dir, 'destino'), path.join(dir, 'enlace'));
    enlacesPermitidos = true;
  } catch {
    enlacesPermitidos = false;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  return enlacesPermitidos;
}

/** Motivo para omitir una prueba que necesita enlaces simbólicos, o false. */
export const SIN_ENLACES = enlacesSimbolicos() ? false : 'el sistema no permite crear enlaces simbólicos a este usuario';

/** Motivo para omitir una prueba de permisos POSIX, o false. */
export const SIN_MODOS = POSIX_MODES ? false : 'Windows no tiene permisos POSIX (0600, 0700)';
