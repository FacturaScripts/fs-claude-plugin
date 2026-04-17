import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';

interface PaginationParams {
  connection: string;
  offset?: number;
  limit?: number;
}

interface EjerciciosParams extends PaginationParams {
  codejercicio?: string;
  estado?: string;
}

interface AsientosParams extends PaginationParams {
  codejercicio?: string;
  descripcion?: string;
  fecha?: string;
}

interface PartidasParams extends PaginationParams {
  idasiento?: string;
  codsubcuenta?: string;
}

interface CuentasParams extends PaginationParams {
  codcuenta?: string;
  codejercicio?: string;
  descripcion?: string;
}

interface SubcuentasParams extends PaginationParams {
  codsubcuenta?: string;
  codejercicio?: string;
  descripcion?: string;
}

interface ConceptoPartidasParams extends PaginationParams {
  // No additional filters beyond pagination
}

interface DiariosParams extends PaginationParams {
  coddiario?: string;
}

interface CuentaEspecialesParams extends PaginationParams {
  // No additional filters beyond pagination
}

export const accountingTools: Tool[] = [
  {
    name: 'get_ejercicios',
    description: 'Obtiene ejercicios contables con filtros opcionales de código y estado',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Identificador de conexión a la base de datos',
        },
        offset: {
          type: 'number',
          description: 'Número de registros a saltar',
        },
        limit: {
          type: 'number',
          description: 'Número máximo de registros a retornar',
        },
        codejercicio: {
          type: 'string',
          description: 'Código del ejercicio',
        },
        estado: {
          type: 'string',
          description: 'Estado del ejercicio',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_asientos',
    description:
      'Obtiene asientos contables con filtros opcionales de ejercicio, descripción y fecha',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Identificador de conexión a la base de datos',
        },
        offset: {
          type: 'number',
          description: 'Número de registros a saltar',
        },
        limit: {
          type: 'number',
          description: 'Número máximo de registros a retornar',
        },
        codejercicio: {
          type: 'string',
          description: 'Código del ejercicio',
        },
        descripcion: {
          type: 'string',
          description: 'Descripción del asiento',
        },
        fecha: {
          type: 'string',
          description: 'Fecha del asiento (formato YYYY-MM-DD)',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_partidas',
    description:
      'Obtiene partidas contables con filtros opcionales de ID de asiento y código de subcuenta',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Identificador de conexión a la base de datos',
        },
        offset: {
          type: 'number',
          description: 'Número de registros a saltar',
        },
        limit: {
          type: 'number',
          description: 'Número máximo de registros a retornar',
        },
        idasiento: {
          type: 'string',
          description: 'ID del asiento',
        },
        codsubcuenta: {
          type: 'string',
          description: 'Código de la subcuenta',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_cuentas',
    description:
      'Obtiene cuentas contables con filtros opcionales de código, ejercicio y descripción',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Identificador de conexión a la base de datos',
        },
        offset: {
          type: 'number',
          description: 'Número de registros a saltar',
        },
        limit: {
          type: 'number',
          description: 'Número máximo de registros a retornar',
        },
        codcuenta: {
          type: 'string',
          description: 'Código de la cuenta',
        },
        codejercicio: {
          type: 'string',
          description: 'Código del ejercicio',
        },
        descripcion: {
          type: 'string',
          description: 'Descripción de la cuenta',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_subcuentas',
    description:
      'Obtiene subcuentas contables con filtros opcionales de código, ejercicio y descripción',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Identificador de conexión a la base de datos',
        },
        offset: {
          type: 'number',
          description: 'Número de registros a saltar',
        },
        limit: {
          type: 'number',
          description: 'Número máximo de registros a retornar',
        },
        codsubcuenta: {
          type: 'string',
          description: 'Código de la subcuenta',
        },
        codejercicio: {
          type: 'string',
          description: 'Código del ejercicio',
        },
        descripcion: {
          type: 'string',
          description: 'Descripción de la subcuenta',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_conceptopartidas',
    description: 'Obtiene conceptos de partidas con opciones de paginación',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Identificador de conexión a la base de datos',
        },
        offset: {
          type: 'number',
          description: 'Número de registros a saltar',
        },
        limit: {
          type: 'number',
          description: 'Número máximo de registros a retornar',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_diarios',
    description: 'Obtiene diarios contables con filtros opcionales de código de diario',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Identificador de conexión a la base de datos',
        },
        offset: {
          type: 'number',
          description: 'Número de registros a saltar',
        },
        limit: {
          type: 'number',
          description: 'Número máximo de registros a retornar',
        },
        coddiario: {
          type: 'string',
          description: 'Código del diario',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_cuentaespeciales',
    description: 'Obtiene cuentas especiales con opciones de paginación',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Identificador de conexión a la base de datos',
        },
        offset: {
          type: 'number',
          description: 'Número de registros a saltar',
        },
        limit: {
          type: 'number',
          description: 'Número máximo de registros a retornar',
        },
      },
      required: ['connection'],
    },
  },
];


// ========== INTERFACES DE ESCRITURA ==========

interface CreateAsientoParams {
  connection?: string;
  concepto: string;
  fecha: string;
  iddiario?: number;
  idempresa?: number;
  importe?: number;
  numero?: string;
  documento?: string;
  canal?: string;
}

interface UpdateAsientoParams extends CreateAsientoParams {
  idasiento: number;
}

interface DeleteAsientoParams {
  connection?: string;
  idasiento: number;
}

interface CreatePartidaParams {
  connection?: string;
  idasiento: number;
  codsubcuenta: string;
  concepto?: string;
  debe?: number;
  haber?: number;
  codcontrapartida?: string;
  documento?: string;
  factura?: string;
  iva?: number;
  recargo?: number;
  baseimponible?: number;
}

interface UpdatePartidaParams extends CreatePartidaParams {
  idpartida: number;
}

interface DeletePartidaParams {
  connection?: string;
  idpartida: number;
}

interface CreateDiarioParams {
  connection?: string;
  descripcion: string;
}

interface UpdateDiarioParams extends CreateDiarioParams {
  iddiario: number;
}

interface DeleteDiarioParams {
  connection?: string;
  iddiario: number;
}

interface CreateEjercicioParams {
  connection?: string;
  codejercicio: string;
  nombre: string;
  estado?: string;
  fechainicio: string;
  fechafin: string;
  idempresa?: number;
  longsubcuenta?: number;
}

interface UpdateEjercicioParams extends CreateEjercicioParams {}

interface DeleteEjercicioParams {
  connection?: string;
  codejercicio: string;
}

interface CreateCuentaParams {
  connection?: string;
  codcuenta: string;
  descripcion: string;
  codejercicio: string;
  idempresa?: number;
  parent_codcuenta?: string;
}

interface UpdateCuentaParams extends CreateCuentaParams {
  idcuenta: number;
}

interface DeleteCuentaParams {
  connection?: string;
  idcuenta: number;
}

interface CreateSubcuentaParams {
  connection?: string;
  codsubcuenta: string;
  descripcion: string;
  codcuenta: string;
  codejercicio: string;
  idempresa?: number;
  idcuenta?: number;
}

interface UpdateSubcuentaParams extends CreateSubcuentaParams {
  idsubcuenta: number;
}

interface DeleteSubcuentaParams {
  connection?: string;
  idsubcuenta: number;
}

export const accountingWriteTools: Tool[] = [
  {
    name: 'create_asiento',
    description: 'Crea un nuevo asiento contable en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        concepto: { type: 'string', description: 'Concepto del asiento (obligatorio)' },
        fecha: { type: 'string', description: 'Fecha del asiento (YYYY-MM-DD, obligatorio)' },
        iddiario: { type: 'number', description: 'ID del diario contable' },
        idempresa: { type: 'number', description: 'ID de la empresa' },
        importe: { type: 'number', description: 'Importe total del asiento' },
        numero: { type: 'string', description: 'Número del asiento' },
        documento: { type: 'string', description: 'Documento relacionado' },
        canal: { type: 'string', description: 'Canal del asiento' },
      },
      required: ['concepto', 'fecha'],
    },
  },
  {
    name: 'update_asiento',
    description: 'Actualiza un asiento contable existente en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        idasiento: { type: 'number', description: 'ID del asiento a actualizar (obligatorio)' },
        concepto: { type: 'string', description: 'Concepto del asiento' },
        fecha: { type: 'string', description: 'Fecha del asiento (YYYY-MM-DD)' },
        iddiario: { type: 'number', description: 'ID del diario contable' },
        idempresa: { type: 'number', description: 'ID de la empresa' },
        importe: { type: 'number', description: 'Importe total del asiento' },
        documento: { type: 'string', description: 'Documento relacionado' },
        canal: { type: 'string', description: 'Canal del asiento' },
      },
      required: ['idasiento'],
    },
  },
  {
    name: 'delete_asiento',
    description: 'Elimina un asiento contable de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        idasiento: { type: 'number', description: 'ID del asiento a eliminar' },
      },
      required: ['idasiento'],
    },
  },
  {
    name: 'create_partida',
    description: 'Crea una nueva partida contable en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        idasiento: { type: 'number', description: 'ID del asiento al que pertenece (obligatorio)' },
        codsubcuenta: { type: 'string', description: 'Código de la subcuenta (obligatorio)' },
        concepto: { type: 'string', description: 'Concepto de la partida' },
        debe: { type: 'number', description: 'Importe en el debe' },
        haber: { type: 'number', description: 'Importe en el haber' },
        codcontrapartida: { type: 'string', description: 'Código de la contrapartida' },
        documento: { type: 'string', description: 'Documento relacionado' },
        factura: { type: 'string', description: 'Número de factura relacionada' },
        iva: { type: 'number', description: 'Porcentaje de IVA' },
        recargo: { type: 'number', description: 'Porcentaje de recargo' },
        baseimponible: { type: 'number', description: 'Base imponible' },
      },
      required: ['idasiento', 'codsubcuenta'],
    },
  },
  {
    name: 'update_partida',
    description: 'Actualiza una partida contable existente en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        idpartida: { type: 'number', description: 'ID de la partida a actualizar (obligatorio)' },
        idasiento: { type: 'number', description: 'ID del asiento al que pertenece' },
        codsubcuenta: { type: 'string', description: 'Código de la subcuenta' },
        concepto: { type: 'string', description: 'Concepto de la partida' },
        debe: { type: 'number', description: 'Importe en el debe' },
        haber: { type: 'number', description: 'Importe en el haber' },
        codcontrapartida: { type: 'string', description: 'Código de la contrapartida' },
        baseimponible: { type: 'number', description: 'Base imponible' },
        iva: { type: 'number', description: 'Porcentaje de IVA' },
        recargo: { type: 'number', description: 'Porcentaje de recargo' },
      },
      required: ['idpartida'],
    },
  },
  {
    name: 'delete_partida',
    description: 'Elimina una partida contable de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        idpartida: { type: 'number', description: 'ID de la partida a eliminar' },
      },
      required: ['idpartida'],
    },
  },
  {
    name: 'create_diario',
    description: 'Crea un nuevo diario contable en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        descripcion: { type: 'string', description: 'Descripción del diario (obligatorio)' },
      },
      required: ['descripcion'],
    },
  },
  {
    name: 'update_diario',
    description: 'Actualiza un diario contable existente en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        iddiario: { type: 'number', description: 'ID del diario a actualizar (obligatorio)' },
        descripcion: { type: 'string', description: 'Nueva descripción del diario' },
      },
      required: ['iddiario'],
    },
  },
  {
    name: 'delete_diario',
    description: 'Elimina un diario contable de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        iddiario: { type: 'number', description: 'ID del diario a eliminar' },
      },
      required: ['iddiario'],
    },
  },
  {
    name: 'create_ejercicio',
    description: 'Crea un nuevo ejercicio contable en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        codejercicio: { type: 'string', description: 'Código del ejercicio (obligatorio)' },
        nombre: { type: 'string', description: 'Nombre del ejercicio (obligatorio)' },
        estado: { type: 'string', description: 'Estado del ejercicio (ABIERTO/CERRADO/ESTIMADO)' },
        fechainicio: { type: 'string', description: 'Fecha de inicio (YYYY-MM-DD, obligatorio)' },
        fechafin: { type: 'string', description: 'Fecha de fin (YYYY-MM-DD, obligatorio)' },
        idempresa: { type: 'number', description: 'ID de la empresa' },
        longsubcuenta: { type: 'number', description: 'Longitud de la subcuenta' },
      },
      required: ['codejercicio', 'nombre', 'fechainicio', 'fechafin'],
    },
  },
  {
    name: 'update_ejercicio',
    description: 'Actualiza un ejercicio contable existente en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        codejercicio: { type: 'string', description: 'Código del ejercicio a actualizar (obligatorio)' },
        nombre: { type: 'string', description: 'Nombre del ejercicio' },
        estado: { type: 'string', description: 'Estado del ejercicio' },
        fechainicio: { type: 'string', description: 'Fecha de inicio (YYYY-MM-DD)' },
        fechafin: { type: 'string', description: 'Fecha de fin (YYYY-MM-DD)' },
        idempresa: { type: 'number', description: 'ID de la empresa' },
        longsubcuenta: { type: 'number', description: 'Longitud de la subcuenta' },
      },
      required: ['codejercicio'],
    },
  },
  {
    name: 'delete_ejercicio',
    description: 'Elimina un ejercicio contable de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        codejercicio: { type: 'string', description: 'Código del ejercicio a eliminar' },
      },
      required: ['codejercicio'],
    },
  },
  {
    name: 'create_cuenta',
    description: 'Crea una nueva cuenta contable en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        codcuenta: { type: 'string', description: 'Código de la cuenta (obligatorio)' },
        descripcion: { type: 'string', description: 'Descripción de la cuenta (obligatorio)' },
        codejercicio: { type: 'string', description: 'Código del ejercicio (obligatorio)' },
        idempresa: { type: 'number', description: 'ID de la empresa' },
        parent_codcuenta: { type: 'string', description: 'Código de la cuenta padre' },
      },
      required: ['codcuenta', 'descripcion', 'codejercicio'],
    },
  },
  {
    name: 'update_cuenta',
    description: 'Actualiza una cuenta contable existente en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        idcuenta: { type: 'number', description: 'ID de la cuenta a actualizar (obligatorio)' },
        codcuenta: { type: 'string', description: 'Código de la cuenta' },
        descripcion: { type: 'string', description: 'Descripción de la cuenta' },
        codejercicio: { type: 'string', description: 'Código del ejercicio' },
        idempresa: { type: 'number', description: 'ID de la empresa' },
        parent_codcuenta: { type: 'string', description: 'Código de la cuenta padre' },
      },
      required: ['idcuenta'],
    },
  },
  {
    name: 'delete_cuenta',
    description: 'Elimina una cuenta contable de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        idcuenta: { type: 'number', description: 'ID de la cuenta a eliminar' },
      },
      required: ['idcuenta'],
    },
  },
  {
    name: 'create_subcuenta',
    description: 'Crea una nueva subcuenta contable en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        codsubcuenta: { type: 'string', description: 'Código de la subcuenta (obligatorio)' },
        descripcion: { type: 'string', description: 'Descripción de la subcuenta (obligatorio)' },
        codcuenta: { type: 'string', description: 'Código de la cuenta padre (obligatorio)' },
        codejercicio: { type: 'string', description: 'Código del ejercicio (obligatorio)' },
        idempresa: { type: 'number', description: 'ID de la empresa' },
        idcuenta: { type: 'number', description: 'ID de la cuenta padre' },
      },
      required: ['codsubcuenta', 'descripcion', 'codcuenta', 'codejercicio'],
    },
  },
  {
    name: 'update_subcuenta',
    description: 'Actualiza una subcuenta contable existente en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        idsubcuenta: { type: 'number', description: 'ID de la subcuenta a actualizar (obligatorio)' },
        codsubcuenta: { type: 'string', description: 'Código de la subcuenta' },
        descripcion: { type: 'string', description: 'Descripción de la subcuenta' },
        codcuenta: { type: 'string', description: 'Código de la cuenta padre' },
        codejercicio: { type: 'string', description: 'Código del ejercicio' },
        idempresa: { type: 'number', description: 'ID de la empresa' },
        idcuenta: { type: 'number', description: 'ID de la cuenta padre' },
      },
      required: ['idsubcuenta'],
    },
  },
  {
    name: 'delete_subcuenta',
    description: 'Elimina una subcuenta contable de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Identificador de conexión' },
        idsubcuenta: { type: 'number', description: 'ID de la subcuenta a eliminar' },
      },
      required: ['idsubcuenta'],
    },
  },
];

/**
 * Register all accounting tools with the MCP server
 */
export async function registerAccountingTools(tools: Map<string, Tool>): Promise<void> {
  accountingTools.forEach((tool) => tools.set(tool.name, tool));
  accountingWriteTools.forEach((tool) => tools.set(tool.name, tool));
}

/**
 * Handle accounting tool calls
 */
export async function handleAccountingTool(
  name: string,
  args: Record<string, unknown>
): Promise<{ content: [{ type: 'text'; text: string }]; isError?: boolean } | null> {
  const input = args;

  switch (name) {
    case 'get_ejercicios': {
      const params = input as any as EjerciciosParams;
      const result = await fsClient.get(
        '/ejercicios',
        {
          offset: params.offset,
          limit: params.limit,
          codejercicio: params.codejercicio,
          estado: params.estado,
        },
        params.connection,
      );
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'get_asientos': {
      const params = input as any as AsientosParams;
      const result = await fsClient.get(
        '/asientos',
        {
          offset: params.offset,
          limit: params.limit,
          codejercicio: params.codejercicio,
          descripcion: params.descripcion,
          fecha: params.fecha,
        },
        params.connection,
      );
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'get_partidas': {
      const params = input as any as PartidasParams;
      const result = await fsClient.get(
        '/partidas',
        {
          offset: params.offset,
          limit: params.limit,
          idasiento: params.idasiento,
          codsubcuenta: params.codsubcuenta,
        },
        params.connection,
      );
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'get_cuentas': {
      const params = input as any as CuentasParams;
      const result = await fsClient.get(
        '/cuentas',
        {
          offset: params.offset,
          limit: params.limit,
          codcuenta: params.codcuenta,
          codejercicio: params.codejercicio,
          descripcion: params.descripcion,
        },
        params.connection,
      );
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'get_subcuentas': {
      const params = input as any as SubcuentasParams;
      const result = await fsClient.get(
        '/subcuentas',
        {
          offset: params.offset,
          limit: params.limit,
          codsubcuenta: params.codsubcuenta,
          codejercicio: params.codejercicio,
          descripcion: params.descripcion,
        },
        params.connection,
      );
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'get_conceptopartidas': {
      const params = input as any as ConceptoPartidasParams;
      const result = await fsClient.get(
        '/conceptopartidas',
        {
          offset: params.offset,
          limit: params.limit,
        },
        params.connection,
      );
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'get_diarios': {
      const params = input as any as DiariosParams;
      const result = await fsClient.get(
        '/diarios',
        {
          offset: params.offset,
          limit: params.limit,
          coddiario: params.coddiario,
        },
        params.connection,
      );
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'get_cuentaespeciales': {
      const params = input as any as CuentaEspecialesParams;
      const result = await fsClient.get(
        '/cuentaespeciales',
        {
          offset: params.offset,
          limit: params.limit,
        },
        params.connection,
      );
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }


    case 'create_asiento': {
      const params = input as any as CreateAsientoParams;
      const { connection, ...data } = params;
      const result = await fsClient.post('/asientos', data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'update_asiento': {
      const params = input as any as UpdateAsientoParams;
      const { connection, idasiento, ...data } = params;
      const result = await fsClient.put(`/asientos/${idasiento}`, data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'delete_asiento': {
      const params = input as any as DeleteAsientoParams;
      const result = await fsClient.delete(`/asientos/${params.idasiento}`, params.connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'create_partida': {
      const params = input as any as CreatePartidaParams;
      const { connection, ...data } = params;
      const result = await fsClient.post('/partidas', data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'update_partida': {
      const params = input as any as UpdatePartidaParams;
      const { connection, idpartida, ...data } = params;
      const result = await fsClient.put(`/partidas/${idpartida}`, data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'delete_partida': {
      const params = input as any as DeletePartidaParams;
      const result = await fsClient.delete(`/partidas/${params.idpartida}`, params.connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'create_diario': {
      const params = input as any as CreateDiarioParams;
      const { connection, ...data } = params;
      const result = await fsClient.post('/diarios', data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'update_diario': {
      const params = input as any as UpdateDiarioParams;
      const { connection, iddiario, ...data } = params;
      const result = await fsClient.put(`/diarios/${iddiario}`, data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'delete_diario': {
      const params = input as any as DeleteDiarioParams;
      const result = await fsClient.delete(`/diarios/${params.iddiario}`, params.connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'create_ejercicio': {
      const params = input as any as CreateEjercicioParams;
      const { connection, ...data } = params;
      const result = await fsClient.post('/ejercicios', data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'update_ejercicio': {
      const params = input as any as UpdateEjercicioParams;
      const { connection, codejercicio, ...data } = params;
      const result = await fsClient.put(`/ejercicios/${codejercicio}`, data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'delete_ejercicio': {
      const params = input as any as DeleteEjercicioParams;
      const result = await fsClient.delete(`/ejercicios/${params.codejercicio}`, params.connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'create_cuenta': {
      const params = input as any as CreateCuentaParams;
      const { connection, ...data } = params;
      const result = await fsClient.post('/cuentas', data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'update_cuenta': {
      const params = input as any as UpdateCuentaParams;
      const { connection, idcuenta, ...data } = params;
      const result = await fsClient.put(`/cuentas/${idcuenta}`, data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'delete_cuenta': {
      const params = input as any as DeleteCuentaParams;
      const result = await fsClient.delete(`/cuentas/${params.idcuenta}`, params.connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'create_subcuenta': {
      const params = input as any as CreateSubcuentaParams;
      const { connection, ...data } = params;
      const result = await fsClient.post('/subcuentas', data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'update_subcuenta': {
      const params = input as any as UpdateSubcuentaParams;
      const { connection, idsubcuenta, ...data } = params;
      const result = await fsClient.put(`/subcuentas/${idsubcuenta}`, data, connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    case 'delete_subcuenta': {
      const params = input as any as DeleteSubcuentaParams;
      const result = await fsClient.delete(`/subcuentas/${params.idsubcuenta}`, params.connection);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    }

    default:
      return null;
  }
}
