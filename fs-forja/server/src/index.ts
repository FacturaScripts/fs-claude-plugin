/**
 * Servidor MCP fs-forja.
 *
 * Expone las herramientas `forja_*` para que el autor de un plugin publicado en facturascripts.com (o un miembro
 * aceptado de su equipo) lo gestione con la API de autor de la forja (`/api/3/forja`), y las herramientas para
 * añadir y listar sus conexiones de tipo forja.
 *
 * Las conexiones se guardan en el mismo archivo que las de fs-mcp (`~/.fs-ai.json`), pero este servidor solo usa
 * las de tipo `forja`; las de tipo `api` (instalaciones del ERP) son de fs-mcp.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, Tool } from '@modelcontextprotocol/sdk/types.js';
import { connectionManager } from './connection-manager.js';
import { forjaClient } from './fs/forja-client.js';
import { handleForjaTool, registerForjaTools } from './modules/forja/index.js';
import { validateToolInput } from './utils/validateInput.js';

/** Resultado que devuelve cada herramienta al servidor MCP. */
type ToolResult = { content: [{ type: 'text'; text: string }]; isError?: boolean };

/** Herramientas registradas, por nombre. */
const tools = new Map<string, Tool>();

/** Herramientas de conexión: guardan sus argumentos en el archivo de conexiones tal como llegan. */
const CONNECTION_TOOLS = new Set(['forja_add_connection']);

/**
 * Servidor MCP.
 */
const server = new Server(
  {
    name: 'fs-forja',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Registra las herramientas de gestión de las conexiones de tipo forja.
 */
function registerConnectionTools(): void {
  tools.set('forja_add_connection', {
    name: 'forja_add_connection',
    description:
      'Añade una conexión de tipo forja con el token de autor de la API de la forja de facturascripts.com ' +
      '(se genera en la pestaña «avanzado» de PortalForja). Se guarda en ~/.fs-ai.json junto a las conexiones ' +
      'de fs-mcp, sin cambiar su conexión por defecto.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        key: {
          type: 'string',
          description: 'Identificador único de la conexión, por ejemplo "forja-autor"',
        },
        name: {
          type: 'string',
          description: 'Nombre descriptivo de la conexión, por ejemplo "Forja (autor)"',
        },
        url: {
          type: 'string',
          description:
            'URL base de la forja, normalmente https://facturascripts.com (sin www. ni http://). ' +
            'Si termina en /api/3 o /api/3/forja, se quita',
        },
        token: {
          type: 'string',
          description: 'Token de autor de la pestaña «avanzado» de PortalForja',
        },
        rejectUnauthorized: {
          type: 'boolean',
          description: 'false para aceptar certificados HTTPS autofirmados o no verificables (solo forjas locales)',
        },
        overwrite: {
          type: 'boolean',
          description:
            'Sustituye una conexión de tipo forja con la misma clave (por defecto false: añadir una clave existente ' +
            'falla). Solo tras confirmarlo el usuario, porque el token anterior se pierde. Nunca sustituye una ' +
            'conexión de fs-mcp',
        },
      },
      required: ['key', 'name', 'url', 'token'],
    },
  });

  tools.set('forja_list_connections', {
    name: 'forja_list_connections',
    description:
      'Lista las conexiones de tipo forja configuradas. Las herramientas forja_* usan la primera si no se indica ' +
      'otra en el parámetro connection',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  });
}

/**
 * Comprueba que los argumentos de texto de una herramienta de conexión no llegan como número: se guardarían así
 * en el archivo de conexiones.
 *
 * @param toolName - Nombre de la herramienta
 * @param schema - Esquema de entrada de la herramienta
 * @param input - Argumentos recibidos
 * @returns Motivo del rechazo, o null si son válidos
 */
function connectionArgsAsText(
  toolName: string,
  schema: Tool['inputSchema'],
  input: Record<string, unknown> | undefined
): string | null {
  if (!CONNECTION_TOOLS.has(toolName)) return null;
  for (const [name, value] of Object.entries(input ?? {})) {
    const property = schema.properties?.[name] as { type?: string } | undefined;
    if (property?.type === 'string' && typeof value === 'number') {
      return `el argumento "${name}" va como texto, entre comillas`;
    }
  }
  return null;
}

/**
 * Devuelve un resultado de texto.
 *
 * @param text - Texto de la respuesta
 * @param isError - Si es un error
 * @returns Resultado para el servidor MCP
 */
function textResult(text: string, isError = false): ToolResult {
  return isError ? { content: [{ type: 'text', text }], isError: true } : { content: [{ type: 'text', text }] };
}

/**
 * Atiende las herramientas de conexión.
 *
 * @param toolName - Nombre de la herramienta
 * @param input - Argumentos ya validados
 * @returns Resultado, o null si la herramienta no es de conexión
 */
function handleConnectionTool(toolName: string, input: Record<string, unknown>): ToolResult | null {
  // La validación acepta "1" y "0" como booleanos, y "0" es verdadero en JS: solo true y "1" cuentan como verdadero
  const isTrue = (value: unknown): boolean => value === true || value === '1';

  switch (toolName) {
    case 'forja_add_connection': {
      const { key, name, url, token, rejectUnauthorized, overwrite } = input as {
        key: string;
        name: string;
        url: string;
        token: string;
        rejectUnauthorized?: boolean | '1' | '0';
        overwrite?: boolean | '1' | '0';
      };
      const replace = isTrue(overwrite);
      connectionManager.addConnection(
        key,
        {
          name,
          url,
          token,
          ...(rejectUnauthorized !== undefined ? { rejectUnauthorized: isTrue(rejectUnauthorized) } : {}),
        },
        replace
      );
      // Al sustituir una conexión, la instancia de axios cacheada quedaría obsoleta.
      forjaClient.clearCache();
      return textResult(
        `Conexión de tipo forja "${name}" (${key}, ${connectionManager.getConnection(key).url}) ` +
          `${replace ? 'guardada' : 'añadida'} correctamente`
      );
    }

    case 'forja_list_connections': {
      const connections = connectionManager.listConnections();
      if (connections.length === 0) {
        return textResult(
          'No hay conexiones de tipo forja configuradas. Añade una con forja_add_connection o la skill ' +
            'fs-forja:add-connection.'
        );
      }
      const list = connections
        .map((conn, index) => `- ${conn.name} (${conn.key}): ${conn.url}${index === 0 ? ' (se usa por defecto)' : ''}`)
        .join('\n');
      return textResult(`Conexiones de tipo forja:\n${list}`);
    }

    default:
      return null;
  }
}

/**
 * Lista de herramientas.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: Array.from(tools.values()) };
});

/**
 * Llamada a una herramienta.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const toolInput = (request.params.arguments ?? {}) as Record<string, unknown>;

  // Los handlers no validan sus argumentos: se rechaza lo que no case con el inputSchema antes de llamarlos
  const tool = tools.get(toolName);
  const invalid = tool
    ? validateToolInput(tool.inputSchema, toolInput) ?? connectionArgsAsText(toolName, tool.inputSchema, toolInput)
    : null;
  if (invalid) {
    return textResult(`Argumentos no válidos para ${toolName}: ${invalid}`, true);
  }

  try {
    const result = handleConnectionTool(toolName, toolInput) ?? (await handleForjaTool(toolName, toolInput));
    return result ?? textResult(`Herramienta desconocida: ${toolName}`, true);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return textResult(`Error al ejecutar ${toolName}: ${message}`, true);
  }
});

/**
 * Registra las herramientas y conecta el servidor por stdio.
 */
async function main(): Promise<void> {
  registerConnectionTools();
  await registerForjaTools(tools);

  await server.connect(new StdioServerTransport());
  console.error(`[fs-forja] Herramientas registradas: ${tools.size}`);
  console.error('[fs-forja] Server started successfully');
}

process.on('uncaughtException', (error) => {
  console.error('[fs-forja] Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[fs-forja] Unhandled rejection:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error('[fs-forja] Failed to start server:', error);
  process.exit(1);
});
