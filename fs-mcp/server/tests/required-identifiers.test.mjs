/**
 * Pruebas de las tools de los módulos contra un FacturaScripts de pega en
 * loopback: qué peticiones llegan a la API para cada llamada.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

// Cualquier listado devuelve un registro, como haría una instalación con datos:
// así una petición sin filtro "encuentra" el primero de la tabla.
const fs = await arrancarFsDePega((req) =>
  req.method === 'GET'
    ? [{ idproducto: 7, idfactura: 7, codcliente: 'C1', cifnif: 'X', fecha: '01-01-2025' }]
    : { ok: true }
);
const borrar = usarConexiones({
  default: 'pega',
  connections: { pega: { name: 'Pega', url: fs.url, token: 't' } },
});
const { handleAnalyticsTool } = await import('../dist/modules/analytics/index.js');

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

for (const [tool, falta] of [
  ['exportar_factura_cliente', 'idfactura'],
  ['get_facturas_cliente_por_cifnif', 'cifnif'],
  ['get_tiempo_beneficios_cliente', 'codcliente'],
]) {
  test(`${tool} sin ${falta} devuelve error en vez de usar el primer registro`, async () => {
    let resultado;
    const peticiones = await peticionesDe(async () => {
      resultado = await handleAnalyticsTool(tool, { connection: 'pega' });
    });
    assert.equal(resultado.isError, true);
    assert.match(resultado.content[0].text, new RegExp(falta));
    assert.deepEqual(peticiones, []);
  });
}

// La validación contra inputSchema rechaza el identificador que falta, pero no uno
// vacío: con él, la petición saldría con el filtro vacío
for (const [tool, falta, vacio] of [
  ['exportar_factura_cliente', 'idfactura', 0],
  ['get_facturas_cliente_por_cifnif', 'cifnif', ''],
  ['get_tiempo_beneficios_cliente', 'codcliente', ''],
]) {
  test(`${tool} con ${falta} vacío devuelve error sin llamar a la API`, async () => {
    let resultado;
    const peticiones = await peticionesDe(async () => {
      resultado = await handleAnalyticsTool(tool, { connection: 'pega', [falta]: vacio });
    });
    assert.equal(resultado.isError, true);
    assert.match(resultado.content[0].text, new RegExp(falta));
    assert.deepEqual(peticiones, []);
  });
}

// Sólo espacios tampoco es un identificador: la petición saldría con filter[cifnif]=+
for (const [tool, falta] of [
  ['exportar_factura_cliente', 'idfactura'],
  ['get_facturas_cliente_por_cifnif', 'cifnif'],
  ['get_tiempo_beneficios_cliente', 'codcliente'],
]) {
  test(`${tool} con ${falta} de sólo espacios devuelve error sin llamar a la API`, async () => {
    let resultado;
    const peticiones = await peticionesDe(async () => {
      resultado = await handleAnalyticsTool(tool, { connection: 'pega', [falta]: '  ' });
    });
    assert.equal(resultado.isError, true);
    assert.match(resultado.content[0].text, new RegExp(falta));
    assert.deepEqual(peticiones, []);
  });
}
