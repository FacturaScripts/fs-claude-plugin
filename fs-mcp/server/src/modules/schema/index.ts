/**
 * Schema Module - Tool describe_model para consultar metadata de modelos.
 *
 * Este tool duplica lo que exponen los MCP Resources (fs-schema://model/<name>)
 * para clientes MCP que prefieran invocar un tool antes que navegar resources,
 * y para que Claude pueda llamarlo directamente durante una tarea de reporting.
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getAllModelMetadata, getModelNames } from '../../metadata/registry.js';
import { getModelMetadata, renderMarkdown } from '../../resources/schema-resources.js';
import { fsClient } from '../../fs/client.js';

function buildSchemaTools(): Tool[] {
    // Snapshot de modelos disponibles en el momento de construcción.
    // Se llama tras cargar core + locales para que el enum incluya ambos.
    const names = getModelNames();
    return [
        {
            name: 'describe_model',
            description:
                'Devuelve la metadata completa de un modelo de FacturaScripts (columnas, tipos, relaciones, descripciones). ' +
                'Útil antes de construir consultas complejas o generar informes para entender qué campos existen y cómo se relacionan con otras tablas.',
            inputSchema: {
                type: 'object' as const,
                properties: {
                    model: {
                        type: 'string',
                        description: `Nombre del modelo a describir. Valores válidos: ${names.join(', ')}.`,
                        enum: names,
                    },
                    format: {
                        type: 'string',
                        description:
                            'Formato del resultado. "json" (por defecto) para procesamiento automático, "markdown" para lectura humana.',
                        enum: ['json', 'markdown'],
                    },
                },
                required: ['model'],
            },
        },
        {
            name: 'list_models',
            description:
                'Lista todos los modelos de FacturaScripts (core + módulos locales privados) con metadata disponible, con una breve descripción de cada uno. ' +
                'Ejecuta este tool primero cuando no sepas qué modelo consultar.',
            inputSchema: {
                type: 'object' as const,
                properties: {},
                required: [],
            },
        },
        {
            name: 'verify_model_columns',
            description:
                'Verifica que las columnas declaradas en la metadata local coinciden con las que devuelve la API REST de la instalación de FacturaScripts. ' +
                'Detecta drift: columnas eliminadas/renombradas (missing) y columnas añadidas por la versión instalada o por plugins (extra). ' +
                'Útil cuando un informe falla por un campo desconocido o cuando se quiere confirmar que la metadata sigue alineada.',
            inputSchema: {
                type: 'object' as const,
                properties: {
                    model: {
                        type: 'string',
                        description: 'Nombre del modelo a verificar.',
                        enum: names,
                    },
                    connection: {
                        type: 'string',
                        description: 'Clave de la conexión a usar. Si se omite, se usa la conexión por defecto.',
                    },
                },
                required: ['model'],
            },
        },
    ];
}

export async function registerSchemaTools(tools: Map<string, Tool>): Promise<void> {
    for (const tool of buildSchemaTools()) {
        tools.set(tool.name, tool);
    }
}

export async function handleSchemaTool(
    name: string,
    input: Record<string, unknown>,
): Promise<{ content: [{ type: 'text'; text: string }]; isError?: boolean } | null> {
    if (name === 'list_models') {
        const list = getAllModelMetadata().map((meta) => ({
            name: meta.name,
            table: meta.table,
            endpoint: meta.endpoint,
            primaryKey: meta.primaryKey,
            description: meta.description,
            source: meta.source,
            columnsCount: meta.columns.length,
            relationsCount: meta.relations.length,
        }));
        return {
            content: [{ type: 'text', text: JSON.stringify({ models: list }, null, 2) }],
        };
    }

    if (name === 'describe_model') {
        const modelName = typeof input['model'] === 'string' ? input['model'] : '';
        const format = typeof input['format'] === 'string' ? input['format'] : 'json';
        const meta = getModelMetadata(modelName);
        if (!meta) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Modelo "${modelName}" no encontrado. Modelos disponibles: ${getModelNames().join(', ')}.`,
                    },
                ],
                isError: true,
            };
        }
        if (format === 'markdown') {
            return { content: [{ type: 'text', text: renderMarkdown(meta) }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(meta, null, 2) }] };
    }

    if (name === 'verify_model_columns') {
        const modelName = typeof input['model'] === 'string' ? input['model'] : '';
        const connection = typeof input['connection'] === 'string' ? input['connection'] : undefined;
        const meta = getModelMetadata(modelName);
        if (!meta) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Modelo "${modelName}" no encontrado. Modelos disponibles: ${getModelNames().join(', ')}.`,
                    },
                ],
                isError: true,
            };
        }

        try {
            const response = await fsClient.get<unknown>(meta.endpoint, { limit: 1 }, connection);
            const sample = extractFirstRecord(response);

            if (!sample) {
                const report = {
                    model: meta.name,
                    endpoint: meta.endpoint,
                    connection: connection ?? '(default)',
                    expectedColumns: meta.columns.length,
                    receivedColumns: 0,
                    inSync: null,
                    warning: `No hay registros en ${meta.endpoint} para verificar columnas. Crea al menos un registro y vuelve a probar.`,
                    expectedColumnNames: meta.columns.map((c) => c.name).sort(),
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(report, null, 2) }],
                };
            }

            const received = new Set(Object.keys(sample));
            const expected = new Set(meta.columns.map((c) => c.name));
            const missing = [...expected].filter((c) => !received.has(c)).sort();
            const extra = [...received].filter((c) => !expected.has(c)).sort();
            const inSync = missing.length === 0 && extra.length === 0;

            const report = {
                model: meta.name,
                endpoint: meta.endpoint,
                connection: connection ?? '(default)',
                expectedColumns: expected.size,
                receivedColumns: received.size,
                inSync,
                missing,
                extra,
                warning: inSync
                    ? null
                    : `Drift detectado: ${missing.length} columna(s) en metadata sin reflejar en la API y ${extra.length} columna(s) nuevas en la API. ` +
                      'Si missing > 0, regenera la metadata con `npm run generate:metadata`. ' +
                      'Si extra > 0, suele indicar campos añadidos por plugins instalados o una versión más reciente del core.',
            };

            return {
                content: [{ type: 'text', text: JSON.stringify(report, null, 2) }],
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error al verificar columnas de "${modelName}" en ${meta.endpoint}: ${message}`,
                    },
                ],
                isError: true,
            };
        }
    }

    return null;
}

/**
 * Extrae el primer registro de una respuesta de la API REST de FacturaScripts.
 * La API devuelve typically un array de registros para los endpoints de lista.
 */
function extractFirstRecord(response: unknown): Record<string, unknown> | null {
    if (Array.isArray(response) && response.length > 0) {
        const first = response[0];
        if (first && typeof first === 'object') {
            return first as Record<string, unknown>;
        }
    }
    if (response && typeof response === 'object' && !Array.isArray(response)) {
        // Algunos endpoints devuelven un objeto con campo data o similar.
        const obj = response as Record<string, unknown>;
        if (Array.isArray(obj['data']) && obj['data'].length > 0) {
            const first = obj['data'][0];
            if (first && typeof first === 'object') {
                return first as Record<string, unknown>;
            }
        }
    }
    return null;
}
