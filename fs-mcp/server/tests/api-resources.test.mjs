/**
 * Recurso de la API al que llega cada tool, contra un FacturaScripts de pega
 * en loopback.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const fs = await arrancarFsDePega(() => ({ ok: true }));
const borrar = usarConexiones({
  default: 'pega',
  connections: { pega: { name: 'Pega', url: fs.url, token: 't' } },
});
const { handleCoreBusinessTool } = await import('../dist/modules/core-business/index.js');
const { handleSalesOrdersTool } = await import('../dist/modules/sales-orders/index.js');
const { handlePurchasingTool } = await import('../dist/modules/purchasing/index.js');

test.after(async () => {
  await fs.cerrar();
  borrar();
});

/** Peticiones que llegan al FS de pega mientras se ejecuta `fn`. */
async function peticionesDe(fn) {
  const desde = fs.peticiones.length;
  await fn();
  return fs.peticiones.slice(desde);
}

// El recurso de la API es el nombre del modelo en minúsculas y en plural
// (APIModel::pluralize del core): FacturaCliente -> facturaclientes.
for (const [handler, tool, args, esperado] of [
  [() => handleSalesOrdersTool, 'update_factura_cliente', { idfactura: 3 }, 'PUT /api/3/facturaclientes/3'],
  [() => handleSalesOrdersTool, 'update_albaran_cliente', { idalbaran: 3 }, 'PUT /api/3/albaranclientes/3'],
  [() => handleSalesOrdersTool, 'update_pedido_cliente', { idpedido: 3 }, 'PUT /api/3/pedidoclientes/3'],
  [() => handleSalesOrdersTool, 'update_presupuesto_cliente', { idpresupuesto: 3 }, 'PUT /api/3/presupuestoclientes/3'],
  [() => handlePurchasingTool, 'update_factura_proveedor', { idfactura: 3 }, 'PUT /api/3/facturaproveedores/3'],
  [() => handlePurchasingTool, 'update_albaran_proveedor', { idalbaran: 3 }, 'PUT /api/3/albaranproveedores/3'],
  [() => handlePurchasingTool, 'update_pedido_proveedor', { idpedido: 3 }, 'PUT /api/3/pedidoproveedores/3'],
  [() => handlePurchasingTool, 'update_presupuesto_proveedor', { idpresupuesto: 3 }, 'PUT /api/3/presupuestoproveedores/3'],
  [() => handleCoreBusinessTool, 'create_cuentabancocliente', { codcliente: 'C1' }, 'POST /api/3/cuentabancoclientes'],
  [() => handleCoreBusinessTool, 'update_cuentabancocliente', { codcuenta: '3' }, 'PUT /api/3/cuentabancoclientes/3'],
  [() => handleCoreBusinessTool, 'delete_cuentabancocliente', { codcuenta: '3' }, 'DELETE /api/3/cuentabancoclientes/3'],
]) {
  test(`${tool} usa el recurso real de la API`, async () => {
    const peticiones = await peticionesDe(() => handler()(tool, { connection: 'pega', ...args }));
    assert.deepEqual(peticiones.map((p) => `${p.method} ${p.path}`), [esperado]);
  });
}
