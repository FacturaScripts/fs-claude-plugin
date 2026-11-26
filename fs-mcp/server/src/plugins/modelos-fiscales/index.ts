/**
 * Plugins de modelos fiscales españoles de FacturaScripts: Modelo111 (111 y
 * 190), Modelo115 (115 y 180), Modelo130, Modelo303 (303 y 390), Modelo347,
 * Modelo349 y Modelo369.
 *
 * Cada modelo tiene su endpoint de solo lectura, `GET /api/3/modeloNNN` (también
 * los anuales: /modelo190, /modelo180 y /modelo390), que lo calcula para una
 * empresa y un periodo con la misma clase que usa la pantalla del plugin. fs-mcp
 * solo lee: no genera asientos, no guarda regularizaciones ni descarga los
 * ficheros de la AEAT.
 *
 * Cada plugin del ERP se registra como un plugin oficial aparte, con una tool
 * `get_modelo_NNN` por cada modelo que declara, para que los errores digan qué
 * plugin falta. La tool `get_resumen_modelos_fiscales` va con el primero y
 * consulta todos.
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';
import { connectionOf, isTrue, num, round2 } from '../shared/query.js';
import { CONNECTION_PROPERTY } from '../shared/resource.js';
import { fail, isMissingResource, ok } from '../shared/result.js';
import type { OfficialPlugin, ToolArgs, ToolResult } from '../types.js';

/** Respuesta de un endpoint de modelo fiscal (ver el contrato en el Docblock de cada ApiModeloNNN). */
type ModeloResponse = Record<string, unknown> & { resultado?: unknown; avisos?: unknown };

/** Periodos trimestrales. */
const QUARTERS = ['T1', 'T2', 'T3', 'T4'] as const;

/** Periodos mensuales. */
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] as const;

/** Definición de un modelo: plugin, endpoint, periodos admitidos y parámetros propios. */
interface ModeloDef {
    /** Número del modelo (y nombre de la tool: get_modelo_<numero>). */
    numero: string;
    /** Carpeta del plugin en FacturaScripts. */
    plugin: string;
    /** Primera versión del plugin que trae el endpoint. */
    version: string;
    /** Descripción de la tool. */
    description: string;
    /** Periodos que admite el endpoint. */
    periodos: readonly string[];
    /** true si `periodo` es opcional (los modelos anuales: 190, 180, 390 y 347). */
    periodoOpcional?: boolean;
    /** Parámetros propios del modelo, que se reenvían tal cual al endpoint. */
    props: Record<string, Record<string, unknown>>;
}

/** Texto común sobre cómo se elige la empresa y el ejercicio. */
const COMPANY_TEXT =
    'Indica la empresa y el año (idempresa + anio) o directamente el codejercicio; sin nada usa la empresa ' +
    'predeterminada y el año actual.';

/** Texto común sobre la naturaleza de los datos. */
const READ_ONLY_TEXT =
    'Solo lee: calcula con la misma clase que la pantalla del plugin, sin generar asientos ni guardar nada.';

export const MODELOS: ModeloDef[] = [
    {
        numero: '111',
        plugin: 'Modelo111',
        version: '2.52',
        description:
            'Modelo 111 (retenciones e ingresos a cuenta del trabajo y de actividades económicas) de un trimestre: ' +
            'casillas oficiales 01-03 (trabajo), 07-09 (actividades económicas) y 28-30 (total, ingresado antes y ' +
            'resultado). Las retenciones salen de las partidas contables de la cuenta de retenciones practicadas ' +
            '(4751), sin las de alquileres (modelo 115). El resumen anual es get_modelo_190.',
        periodos: QUARTERS,
        props: {
            ingresos_anteriores: {
                type: 'number',
                description:
                    'Importe ya ingresado en autoliquidaciones anteriores del mismo periodo (casilla 29, en una ' +
                    'complementaria): se resta del total a ingresar (por defecto 0)',
            },
        },
    },
    {
        numero: '190',
        plugin: 'Modelo111',
        version: '2.52',
        description:
            'Modelo 190 (resumen anual de retenciones e ingresos a cuenta del trabajo y de actividades económicas) de ' +
            'un ejercicio: detalle por perceptor (NIF, nombre, provincia, clave y subclave, percepción y retención), ' +
            'casillas 01-03 del resumen y los errores que impiden generar el fichero (NIF que falta, importes ' +
            'negativos...). Es informativo: no tiene resultado a ingresar (lo ingresado está en los modelos 111).',
        periodos: ['ANUAL'],
        periodoOpcional: true,
        props: {},
    },
    {
        numero: '115',
        plugin: 'Modelo115',
        version: '1.8',
        description:
            'Modelo 115 (retenciones de alquileres de inmuebles urbanos) de un trimestre: arrendadores, base, ' +
            'retenciones y resultado (casillas 01-05). Parte de las facturas de proveedor con retención de ' +
            'alquileres. El resumen anual es get_modelo_180.',
        periodos: QUARTERS,
        props: {
            codretencion: { type: 'string', description: 'Solo las facturas con esta retención (por defecto todas)' },
            a_deducir: {
                type: 'number',
                description: 'Importe a deducir de una declaración anterior del mismo periodo (complementaria)',
            },
        },
    },
    {
        numero: '180',
        plugin: 'Modelo115',
        version: '1.8',
        description:
            'Modelo 180 (resumen anual de retenciones de alquileres de inmuebles urbanos) de un ejercicio: desglose por ' +
            'arrendador e inmueble (referencia catastral y situación), los mismos registros del fichero, con las ' +
            'casillas 01-03 del resumen; avisa de los arrendadores sin inmueble o sin NIF. Es informativo: no tiene ' +
            'resultado a ingresar (lo ingresado está en los modelos 115).',
        periodos: ['ANUAL'],
        periodoOpcional: true,
        props: {
            codretencion: { type: 'string', description: 'Solo las facturas con esta retención (por defecto todas)' },
        },
    },
    {
        numero: '130',
        plugin: 'Modelo130',
        version: '5.1',
        description:
            'Modelo 130 (pago fraccionado del IRPF en estimación directa) de un trimestre. Es acumulativo: del 1 de ' +
            'enero al final del trimestre. Devuelve las casillas 01 a 19 (ingresos, gastos, rendimiento neto, 20 %, ' +
            'retenciones, pagos de trimestres anteriores y resultado) a partir de las partidas contables de las cuentas ' +
            'de ingresos y gastos configuradas en el plugin.',
        periodos: QUARTERS,
        props: {
            gastos_dificil_justificacion: {
                type: 'boolean',
                description: 'Aplicar la deducción de gastos de difícil justificación (por defecto false)',
            },
            porcentaje_gastos_dificil: {
                type: 'number',
                description: 'Porcentaje de gastos de difícil justificación (por defecto 5; máximo 2.000 € al año)',
            },
            porcentaje: { type: 'number', description: 'Porcentaje del pago fraccionado (casilla 04, por defecto 20)' },
        },
    },
    {
        numero: '303',
        plugin: 'Modelo303',
        version: '3.52',
        description:
            'Modelo 303 (autoliquidación de IVA) de un trimestre o mes: todas las casillas que calcula el plugin (IVA ' +
            'devengado, deducible, resultado del régimen general y resultado final, casilla 71). Parte de las ' +
            'partidas de IVA de la contabilidad y usa la regularización guardada del periodo (con sus casillas ' +
            'manuales: compensaciones, complementarias...); si no hay, hace un cálculo provisional sin guardarla. Es la ' +
            'cifra que se declara; get_impuestos_periodo, en cambio, es una orientación desde las facturas. El resumen ' +
            'anual es get_modelo_390.',
        periodos: [...QUARTERS, ...MONTHS],
        props: {},
    },
    {
        numero: '390',
        plugin: 'Modelo303',
        version: '3.52',
        description:
            'Modelo 390 (declaración-resumen anual de IVA) de un ejercicio: sus casillas oficiales (operaciones del ' +
            'año, deducciones, volumen de operaciones y resultado de las liquidaciones: 86, 95, 97, 98...), los datos ' +
            'de presentación de la regularización anual, la lista de periodos liquidados del año y un aviso si faltan ' +
            'regularizaciones o el resultado anual no cuadra con lo liquidado. resultado es la casilla 86, informativa: ' +
            'lo ingresado o devuelto está en los modelos 303 del año. Si no hay regularización anual guardada, hace un ' +
            'cálculo provisional sin guardarla.',
        periodos: ['ANUAL'],
        periodoOpcional: true,
        props: {},
    },
    {
        numero: '347',
        plugin: 'Modelo347',
        version: '3.62',
        description:
            'Modelo 347 (declaración anual de operaciones con terceros) de un ejercicio: clientes y proveedores que ' +
            'superan el importe (3.005,06 € por defecto) con su total anual y por trimestre, desde las facturas o desde ' +
            'la contabilidad. Es informativo: no tiene resultado a ingresar.',
        periodos: ['ANUAL'],
        periodoOpcional: true,
        props: {
            importe: { type: 'number', description: 'Importe mínimo anual por tercero (por defecto 3005.06)' },
            origen: {
                type: 'string',
                enum: ['facturas', 'contabilidad'],
                description: 'Calcular desde las facturas o desde las partidas contables (por defecto facturas)',
            },
            agrupar: {
                type: 'string',
                enum: ['tercero', 'cifnif'],
                description: 'Agrupar por cliente/proveedor o por CIF/NIF (por defecto tercero)',
            },
            excluir_irpf: { type: 'boolean', description: 'Excluir las facturas con retención de IRPF' },
        },
    },
    {
        numero: '349',
        plugin: 'Modelo349',
        version: '1.3',
        description:
            'Modelo 349 (operaciones intracomunitarias) de un trimestre o mes: operadores de la UE con su clave ' +
            '(E entregas, S servicios prestados, A adquisiciones, I servicios adquiridos) y base, desde las facturas ' +
            'intracomunitarias ya emitidas. Es informativo: no tiene resultado a ingresar.',
        periodos: [...QUARTERS, ...MONTHS],
        props: {
            codserie: { type: 'string', description: 'Solo las facturas de esta serie (por defecto todas)' },
        },
    },
    {
        numero: '369',
        plugin: 'Modelo369',
        version: '1.2',
        description:
            'Modelo 369 (IVA de ventanilla única OSS/IOSS) de un trimestre o mes: ventas a clientes de otros países de ' +
            'la UE con IVA, por país, tipo de IVA y bienes o servicios, y la cuota total a ingresar.',
        periodos: [...QUARTERS, ...MONTHS],
        props: {
            regimen: {
                type: 'string',
                enum: ['oss', 'external-oss', 'ioss'],
                description: 'Régimen: oss y external-oss se declaran por trimestres, ioss por meses (por defecto oss)',
            },
        },
    },
];

/**
 * Descripción del parámetro periodo según los periodos que admite el modelo.
 *
 * @param def definición del modelo.
 */
function periodDescription(def: ModeloDef): string {
    if (def.periodoOpcional) return 'Periodo (solo ANUAL, el valor por defecto)';
    return def.periodos.includes('01') ? 'Periodo: T1-T4 trimestres o 01-12 meses' : 'Periodo: T1-T4 trimestres';
}

/** Parámetros comunes de todas las tools de modelos. */
function commonProps(def: ModeloDef): Record<string, Record<string, unknown>> {
    return {
        connection: CONNECTION_PROPERTY,
        idempresa: { type: 'number', description: 'Empresa (por defecto la predeterminada)' },
        anio: { type: 'number', description: 'Año natural del ejercicio (por defecto el actual)' },
        codejercicio: { type: 'string', description: 'Código del ejercicio; si se indica, manda sobre idempresa y anio' },
        periodo: {
            type: 'string',
            enum: [...def.periodos],
            description: periodDescription(def),
        },
        detalle: {
            type: 'boolean',
            description: 'Incluir las listas de detalle (facturas, partidas...) además de totales y casillas',
        },
    };
}

/**
 * Construye la tool de un modelo.
 *
 * @param def definición del modelo.
 */
function buildTool(def: ModeloDef): Tool {
    return {
        name: `get_modelo_${def.numero}`,
        description: `${def.description} ${COMPANY_TEXT} ${READ_ONLY_TEXT} Requiere el plugin ${def.plugin} ${def.version} o posterior.`,
        inputSchema: {
            type: 'object',
            properties: { ...commonProps(def), ...def.props },
            required: def.periodoOpcional ? [] : ['periodo'],
        },
    };
}

/**
 * Normaliza el periodo que escribe el usuario o la IA al formato del endpoint.
 *
 * @param value periodo recibido (T1, 1T, 3, 03, ANUAL, annual, 390...).
 * @returns el periodo normalizado o el valor original en mayúsculas si no se reconoce.
 */
export function normalizePeriod(value: unknown): string {
    const text = String(value ?? '').trim().toUpperCase();
    if (/^[1-4]T$/.test(text)) return `T${text[0]}`;
    if (/^T[1-4]$/.test(text)) return text;
    if (/^(0?[1-9]|1[0-2])$/.test(text)) return text.padStart(2, '0');
    if (['ANUAL', 'ANNUAL', 'Y', 'A', '0A', 'AÑO', 'ANO'].includes(text)) return 'ANUAL';
    return text;
}

/**
 * Construye la ruta del endpoint con los parámetros en la query. El endpoint lee
 * los parámetros sueltos (`?periodo=T1`), no la sintaxis `filter[...]` de la API
 * genérica, por eso no se pasan como `params` al cliente.
 *
 * @param def  definición del modelo.
 * @param args argumentos de la tool.
 * @returns la ruta con su query o un mensaje de error de validación.
 */
export function buildModeloPath(def: ModeloDef, args: ToolArgs): string | { error: string } {
    const query = new URLSearchParams();

    const periodo = args.periodo === undefined || args.periodo === '' ? '' : normalizePeriod(args.periodo);
    if (periodo === '' && !def.periodoOpcional) {
        return { error: `Indica el periodo: ${def.periodos.join(', ')}.` };
    }
    if (periodo !== '' && !def.periodos.includes(periodo)) {
        return { error: `Periodo «${String(args.periodo)}» no válido para el modelo ${def.numero}. Usa ${def.periodos.join(', ')}.` };
    }
    if (periodo !== '') query.set('periodo', periodo);

    for (const key of ['idempresa', 'anio', 'codejercicio', ...Object.keys(def.props)]) {
        const value = args[key];
        if (value === undefined || value === null || value === '') continue;
        query.set(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
    }
    if (isTrue(args.detalle)) query.set('detalle', '1');

    const text = query.toString();
    return `/modelo${def.numero}${text === '' ? '' : `?${text}`}`;
}

/**
 * Mensaje de error de un modelo: si la instalación no expone el endpoint, explica
 * que falta el plugin o que es de una versión anterior.
 *
 * @param def   definición del modelo.
 * @param error excepción del cliente HTTP.
 */
function modeloError(def: ModeloDef, error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    if (isMissingResource(message)) {
        return (
            `${message}\nLa instalación no expone /api/3/modelo${def.numero}: el plugin ${def.plugin} no está activo o ` +
            `es anterior a la versión ${def.version}, la primera con este endpoint. Actualízalo para consultar el modelo.`
        );
    }
    if (message.includes('HTTP 403')) {
        return (
            `${message}\nLa clave de API de esta conexión no tiene permiso para el recurso modelo${def.numero} del ` +
            `plugin ${def.plugin}: hay que darle acceso desde la configuración de la API de FacturaScripts.`
        );
    }
    return message;
}

/**
 * Consulta el endpoint de un modelo.
 *
 * @param def  definición del modelo.
 * @param args argumentos de la tool.
 */
async function getModelo(def: ModeloDef, args: ToolArgs): Promise<ToolResult> {
    const path = buildModeloPath(def, args);
    if (typeof path !== 'string') return fail(`get_modelo_${def.numero}: ${path.error}`);
    try {
        const data = await fsClient.get<ModeloResponse>(path, undefined, connectionOf(args));
        return ok(data);
    } catch (error) {
        return fail(`Error en get_modelo_${def.numero}: ${modeloError(def, error)}`);
    }
}

/** Modelos trimestrales que entran en el resumen de un trimestre. */
const QUARTERLY_SUMMARY = ['303', '111', '115', '130', '349', '369'];

/** Modelos anuales que entran en el resumen anual. */
const ANNUAL_SUMMARY = ['390', '190', '180', '347'];

/** Tool que resume todos los modelos trimestrales de una empresa. */
export const RESUMEN_TOOL: Tool = {
    name: 'get_resumen_modelos_fiscales',
    description:
        'Resumen de los modelos trimestrales de una empresa para un trimestre (303, 111, 115, 130, 349 y 369, con el ' +
        'total a ingresar; con periodo ANUAL, los anuales 390, 190, 180 y 347, sin total porque lo ingresado está en ' +
        'los trimestrales): el resultado y los avisos de cada uno, y cuáles no se han podido calcular porque su plugin ' +
        'no está instalado o es antiguo. Para las casillas y el detalle de un modelo usa su tool get_modelo_NNN. ' +
        `${COMPANY_TEXT} ${READ_ONLY_TEXT}`,
    inputSchema: {
        type: 'object',
        properties: {
            connection: CONNECTION_PROPERTY,
            idempresa: { type: 'number', description: 'Empresa (por defecto la predeterminada)' },
            anio: { type: 'number', description: 'Año natural del ejercicio (por defecto el actual)' },
            codejercicio: { type: 'string', description: 'Código del ejercicio; si se indica, manda sobre idempresa y anio' },
            periodo: { type: 'string', enum: [...QUARTERS, 'ANUAL'], description: 'Trimestre T1-T4 o ANUAL' },
        },
        required: ['periodo'],
    },
};

/**
 * Resume los modelos de un trimestre (o los anuales) consultando cada endpoint.
 * Un modelo que falla no impide el resto: se devuelve su error.
 *
 * @param args argumentos de la tool.
 */
async function getResumen(args: ToolArgs): Promise<ToolResult> {
    const periodo = normalizePeriod(args.periodo);
    if (![...QUARTERS, 'ANUAL'].includes(periodo)) {
        return fail('get_resumen_modelos_fiscales: periodo no válido. Usa T1, T2, T3, T4 o ANUAL.');
    }
    const annual = periodo === 'ANUAL';
    const numeros = annual ? ANNUAL_SUMMARY : QUARTERLY_SUMMARY;
    const base: ToolArgs = { idempresa: args.idempresa, anio: args.anio, codejercicio: args.codejercicio, periodo };

    const modelos = [];
    let totalIngresar = 0;
    for (const numero of numeros) {
        const def = MODELOS.find((item) => item.numero === numero);
        if (!def) continue;
        const path = buildModeloPath(def, base);
        if (typeof path !== 'string') continue;
        try {
            const data = await fsClient.get<ModeloResponse>(path, undefined, connectionOf(args));
            const resultado = data.resultado === null || data.resultado === undefined ? null : round2(num(data.resultado));
            if (!annual && resultado !== null && resultado > 0) totalIngresar += resultado;
            modelos.push({
                modelo: typeof data.modelo === 'string' ? data.modelo : numero,
                plugin: def.plugin,
                resultado,
                resumen: data.resumen ?? null,
                avisos: Array.isArray(data.avisos) ? data.avisos : [],
                empresa: data.empresa ?? null,
                ejercicio: data.ejercicio ?? null,
            });
        } catch (error) {
            modelos.push({ modelo: numero, plugin: def.plugin, error: modeloError(def, error) });
        }
    }

    if (annual) {
        return ok({
            periodo,
            modelos,
            total_a_ingresar: null,
            nota:
                'Los modelos anuales son declaraciones resumen: lo ingresado está en los modelos trimestrales del año ' +
                '(303, 111 y 115), así que no se suma ningún total a ingresar. El 190, el 180 y el 347 son informativos ' +
                '(resultado null); el resultado del 390 es su casilla 86, el resultado de la liquidación anual.',
        });
    }

    return ok({
        periodo,
        modelos,
        total_a_ingresar: round2(totalIngresar),
        nota:
            'total_a_ingresar suma los resultados positivos de los modelos con resultado; los informativos (347, ' +
            '349) no tienen. Un resultado negativo es a devolver o compensar según el modelo.',
    });
}

/**
 * Crea el plugin oficial de un plugin del ERP, con una tool por cada modelo que declara.
 *
 * @param plugin nombre del plugin en FacturaScripts.
 * @param defs   definiciones de sus modelos.
 * @param extra  tools adicionales que aporta (el resumen va con el primero).
 */
function buildPlugin(plugin: string, defs: ModeloDef[], extra: Tool[] = []): OfficialPlugin {
    const modelTools = new Map(defs.map((def) => [buildTool(def), def] as const));
    const tools = [...modelTools.keys(), ...extra];
    return {
        name: plugin,
        description: `Modelos ${defs.map((def) => def.numero).join(' y ')} por sus endpoints de solo lectura`,
        models: [],
        tools,
        toolModels: {},
        async handleTool(name: string, args: ToolArgs): Promise<ToolResult | null> {
            for (const [tool, def] of modelTools) {
                if (name === tool.name) return getModelo(def, args);
            }
            if (name === RESUMEN_TOOL.name && extra.includes(RESUMEN_TOOL)) return getResumen(args);
            return null;
        },
    };
}

/** Plugins del ERP en el orden en que aparecen en MODELOS. */
const PLUGIN_NAMES = [...new Set(MODELOS.map((def) => def.plugin))];

/** Un plugin oficial por cada plugin de modelos fiscales del ERP; el primero aporta además el resumen. */
export const modelosFiscalesPlugins: OfficialPlugin[] = PLUGIN_NAMES.map((plugin, index) =>
    buildPlugin(
        plugin,
        MODELOS.filter((def) => def.plugin === plugin),
        index === 0 ? [RESUMEN_TOOL] : [],
    ),
);
