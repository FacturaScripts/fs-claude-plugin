/**
 * Pruebas de las analíticas contra un FacturaScripts de pega en loopback.
 *
 * Fija una zona horaria con desfase respecto a UTC: con UTC los errores de
 * conversión de fecha local a UTC no se ven.
 */

process.env.TZ = 'Europe/Madrid';

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

/** Fecha local en el formato d-m-Y de la API. */
function dmy(fecha) {
  return `${String(fecha.getDate()).padStart(2, '0')}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${fecha.getFullYear()}`;
}

// Un lunes dentro del horizonte de get_cash_flow_proyectado
const lunes = new Date();
lunes.setHours(0, 0, 0, 0);
lunes.setDate(lunes.getDate() + 7 + ((8 - lunes.getDay()) % 7));
const lunesIso = `${lunes.getFullYear()}-${String(lunes.getMonth() + 1).padStart(2, '0')}-${String(lunes.getDate()).padStart(2, '0')}`;

const respuestas = {
  '/api/3/reciboclientes': [{ vencimiento: dmy(lunes), importe: 100 }],
  // Columnas reales de facturascli (Core/Table/facturascli.xml)
  '/api/3/facturaclientes': [{ idfactura: 5, total: 121, neto: 100, totaliva: 21, pagada: true }],
};
const fs = await arrancarFsDePega((req) => respuestas[new URL(req.url, 'http://x').pathname] ?? []);
const borrar = usarConexiones({
  default: 'pega',
  connections: { pega: { name: 'Pega', url: fs.url, token: 't' } },
});
const { handleAnalyticsTool } = await import('../dist/modules/analytics/index.js');

test.after(async () => {
  await fs.cerrar();
  borrar();
});

test('get_cash_flow_proyectado agrupa por el lunes local, no por su fecha en UTC', async () => {
  const resultado = await handleAnalyticsTool('get_cash_flow_proyectado', { connection: 'pega', dias: 30 });
  const datos = JSON.parse(resultado.content[0].text);
  const semanas = datos.proyeccionSemanal.map((s) => s.semana);
  assert.deepEqual(semanas, [lunesIso]);
});

test('exportar_factura_cliente lee el IVA y el estado de pago de sus columnas reales', async () => {
  const resultado = await handleAnalyticsTool('exportar_factura_cliente', { connection: 'pega', idfactura: 5 });
  const factura = JSON.parse(resultado.content[0].text);
  assert.equal(factura.iva, 21);
  assert.equal(factura.pagado, true);
});
