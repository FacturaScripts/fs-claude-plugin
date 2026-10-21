/**
 * Pruebas de que un identificador no puede cambiar el recurso de la URL.
 *
 * El FacturaScripts de pega registra la ruta exacta que llega por la red.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const fs = await arrancarFsDePega(() => ({ ok: true }));
const borrar = usarConexiones({
  default: 'pega',
  connections: { pega: { name: 'Pega', url: fs.url, token: 't' } },
});
const { handleSalesOrdersTool } = await import('../dist/modules/sales-orders/index.js');
const { handleCoreBusinessTool } = await import('../dist/modules/core-business/index.js');

test.after(async () => {
  await fs.cerrar();
  borrar();
});

test('delete_factura_cliente con un id que sube de directorio no alcanza otro recurso', async () => {
  const desde = fs.peticiones.length;
  await handleSalesOrdersTool('delete_factura_cliente', { connection: 'pega', id: '../users/admin' });
  const [peticion] = fs.peticiones.slice(desde);
  assert.equal(`${peticion.method} ${peticion.path}`, 'DELETE /api/3/facturaclientes/..%2Fusers%2Fadmin');
});

test('update_cliente codifica el código del cliente en la ruta', async () => {
  const desde = fs.peticiones.length;
  await handleCoreBusinessTool('update_cliente', { connection: 'pega', codcliente: '../users/admin?x=1', nombre: 'n' });
  const [peticion] = fs.peticiones.slice(desde);
  assert.equal(`${peticion.method} ${peticion.path}`, 'PUT /api/3/clientes/..%2Fusers%2Fadmin%3Fx%3D1');
});
