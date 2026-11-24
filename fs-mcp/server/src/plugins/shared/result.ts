/**
 * Construcción de los resultados de las tools de los plugins oficiales.
 */

import type { ToolResult } from '../types.js';

/**
 * Devuelve un resultado correcto con los datos serializados en JSON.
 *
 * @param data datos a devolver.
 */
export function ok(data: unknown): ToolResult {
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

/**
 * Devuelve un resultado de error con un mensaje para el usuario.
 *
 * @param message texto del error.
 */
export function fail(message: string): ToolResult {
    return { content: [{ type: 'text', text: message }], isError: true };
}

/**
 * Indica si un error de la API significa que el recurso no existe en la
 * instalación, es decir, que el plugin no está instalado o activo. El core
 * responde HTTP 404 con «Invalid API resource» (traducido según el idioma), a
 * diferencia de «record-not-found», que es un registro concreto que no existe.
 *
 * @param message mensaje del error que lanza el cliente HTTP.
 */
export function isMissingResource(message: string): boolean {
    if (!message.includes('HTTP 404')) return false;
    return /api resource|recurso de api|api-resource-invalid/i.test(message);
}

/**
 * Convierte una excepción en un resultado de error. Si la API dice que el recurso
 * no existe, añade que probablemente el plugin no está activo en la instalación;
 * si responde HTTP 403, que la clave de API no tiene permiso para sus recursos.
 *
 * @param plugin nombre del plugin de FacturaScripts que aporta la tool.
 * @param tool   nombre de la tool que falló.
 * @param error  excepción capturada.
 */
export function failFromError(plugin: string, tool: string, error: unknown): ToolResult {
    const message = error instanceof Error ? error.message : String(error);
    if (isMissingResource(message)) {
        return fail(
            `Error en ${tool}: ${message}\n` +
                `La instalación no expone este recurso: comprueba que el plugin ${plugin} está instalado y activo ` +
                'en ella y que la clave de API tiene acceso a sus recursos.',
        );
    }
    if (message.includes('HTTP 403')) {
        return fail(
            `Error en ${tool}: ${message}\n` +
                `La clave de API de esta conexión no tiene permiso para los recursos del plugin ${plugin}: el plugin ` +
                'está instalado, pero hay que darle acceso a la clave desde la configuración de la API de FacturaScripts.',
        );
    }
    return fail(`Error en ${tool}: ${message}`);
}
