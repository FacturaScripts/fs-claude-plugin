/**
 * Contrato de los filtros de rango de fecha.
 *
 * El riesgo de este diseño es que el inputSchema anuncie `<columna>_gte`/`_lte`
 * pero el handler no los reenvíe: la llamada no fallaría, simplemente devolvería
 * TODO sin filtrar, y el usuario creería que ha filtrado. Es el mismo fallo
 * silencioso que tenían `get_logmessages` y `get_emailsentes`.
 *
 * Por eso este test recorre TODAS las tools que reciben parámetros de rango y
 * comprueba, con el cliente HTTP interceptado, que cada handler los propaga de
 * verdad hasta la petición. Si alguien añade una tool nueva con columnas de fecha
 * y olvida el reenvío, esto falla.
 */
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { fsClient } from '../fs/client.js';
import { handleAccountingTool, registerAccountingTools } from '../modules/accounting/index.js';
import { handleCommunicationTool, registerCommunicationTools } from '../modules/communication/index.js';
import { handleConfigurationTool, registerConfigurationTools } from '../modules/configuration/index.js';
import { handleCoreBusinessTool, registerCoreBusinessTools } from '../modules/core-business/index.js';
import { handleFinanceTool, registerFinanceTools } from '../modules/finance/index.js';
import { handleGeographicTool, registerGeographicTools } from '../modules/geographic/index.js';
import { handlePurchasingTool, registerPurchasingTools } from '../modules/purchasing/index.js';
import { handleSalesOrdersTool, registerSalesOrdersTools } from '../modules/sales-orders/index.js';
import { handleSystemTool, registerSystemTools } from '../modules/system/index.js';
import { addDateRangeParams, dateColumnsForTool, dateRangeFilters } from './dateRange.js';
import { bootstrapCoreMetadata } from './registry.js';
// bootstrapCoreMetadata es asíncrona: sin await el registro estaría vacío y
// dateColumnsForTool no resolvería ningún modelo.
await bootstrapCoreMetadata();
const MODULOS = [
    { nombre: 'accounting', registrar: registerAccountingTools, manejar: handleAccountingTool },
    { nombre: 'core-business', registrar: registerCoreBusinessTools, manejar: handleCoreBusinessTool },
    { nombre: 'sales-orders', registrar: registerSalesOrdersTools, manejar: handleSalesOrdersTool },
    { nombre: 'purchasing', registrar: registerPurchasingTools, manejar: handlePurchasingTool },
    { nombre: 'finance', registrar: registerFinanceTools, manejar: handleFinanceTool },
    { nombre: 'configuration', registrar: registerConfigurationTools, manejar: handleConfigurationTool },
    { nombre: 'geographic', registrar: registerGeographicTools, manejar: handleGeographicTool },
    { nombre: 'communication', registrar: registerCommunicationTools, manejar: handleCommunicationTool },
    { nombre: 'system', registrar: registerSystemTools, manejar: handleSystemTool },
];
/** Ejecuta el handler con el cliente HTTP interceptado y devuelve los params enviados. */
async function paramsEnviados(manejar, tool, args) {
    let capturado = {};
    const original = fsClient.get;
    fsClient.get = async (_endpoint, params) => {
        capturado = params ?? {};
        return [];
    };
    try {
        await manejar(tool, args);
    }
    finally {
        fsClient.get = original;
    }
    return capturado;
}
describe('dateColumnsForTool', () => {
    it('detecta las columnas de fecha del modelo de la tool', () => {
        assert.deepEqual(dateColumnsForTool('get_asientos'), ['fecha']);
        assert.ok(dateColumnsForTool('get_facturaclientes').includes('fecha'));
    });
    it('no devuelve nada para tools sin modelo o sin fechas', () => {
        assert.deepEqual(dateColumnsForTool('get_totalmodeles'), []);
        assert.deepEqual(dateColumnsForTool('create_cliente'), []);
        assert.deepEqual(dateColumnsForTool('list_models'), []);
    });
});
describe('dateRangeFilters', () => {
    it('extrae solo los pares de columnas de fecha reales', () => {
        const out = dateRangeFilters('get_facturaclientes', {
            fecha_gte: '2024-01-01',
            fecha_lte: '2024-01-31',
            inventado_gte: '2024-01-01', // no es columna: se descarta
            codcliente: '42',
        });
        assert.deepEqual(out, { fecha_gte: '2024-01-01', fecha_lte: '2024-01-31' });
    });
    it('ignora valores vacíos y tools sin fechas', () => {
        assert.deepEqual(dateRangeFilters('get_facturaclientes', { fecha_gte: '' }), {});
        assert.deepEqual(dateRangeFilters('get_totalmodeles', { fecha_gte: '2024-01-01' }), {});
        assert.deepEqual(dateRangeFilters('get_facturaclientes', undefined), {});
    });
});
describe('addDateRangeParams', () => {
    it('solo inyecta en las tools indicadas (las del core, que sí reenvían)', () => {
        const tools = new Map();
        registerAccountingTools(tools);
        // Simula una tool de módulo privado: resuelve modelo con fechas, pero su
        // handler genérico no reenviaría <columna>_gte, así que no debe tocarse.
        const privada = {
            name: 'get_facturaclientes_privada',
            description: 'simulada',
            inputSchema: { type: 'object', properties: { filter: { type: 'string' } } },
        };
        tools.set(privada.name, privada);
        addDateRangeParams(tools, new Set(['get_asientos']));
        const asientos = tools.get('get_asientos');
        const props = asientos.inputSchema.properties;
        assert.ok(props['fecha_gte'], 'get_asientos sí debe recibir el rango');
        const propsPrivada = privada.inputSchema.properties;
        assert.deepEqual(Object.keys(propsPrivada), ['filter'], 'la privada no debe tocarse');
    });
});
describe('contrato esquema <-> handler', () => {
    it('toda tool con parámetros de rango los reenvía a la API', async () => {
        const sinReenviar = [];
        let comprobadas = 0;
        for (const { registrar, manejar } of MODULOS) {
            const tools = new Map();
            registrar(tools);
            addDateRangeParams(tools);
            for (const tool of tools.values()) {
                const columnas = dateColumnsForTool(tool.name);
                if (columnas.length === 0)
                    continue;
                const columna = columnas[0];
                const props = tool.inputSchema.properties ?? {};
                // El esquema debe anunciar el par para esa columna.
                assert.ok(props[`${columna}_gte`], `${tool.name}: falta ${columna}_gte en el esquema`);
                assert.ok(props[`${columna}_lte`], `${tool.name}: falta ${columna}_lte en el esquema`);
                const enviados = await paramsEnviados(manejar, tool.name, {
                    connection: 'test',
                    [`${columna}_gte`]: '2024-01-01',
                    [`${columna}_lte`]: '2024-01-31',
                });
                comprobadas += 1;
                if (enviados[`${columna}_gte`] !== '2024-01-01' ||
                    enviados[`${columna}_lte`] !== '2024-01-31') {
                    sinReenviar.push(`${tool.name} (${columna})`);
                }
            }
        }
        assert.equal(sinReenviar.length, 0, `Estas tools anuncian filtros de rango pero NO los reenvían: ${sinReenviar.join(', ')}`);
        assert.ok(comprobadas >= 38, `se esperaban al menos 38 tools con rango, hay ${comprobadas}`);
    });
});
//# sourceMappingURL=dateRange.test.js.map