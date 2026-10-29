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
const { handleCoreBusinessTool } = await import('../dist/modules/core-business/index.js');
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

for (const tool of ['update_producto', 'delete_producto']) {
  test(`${tool} sin idproducto ni referencia no toca el primer producto`, async () => {
    const peticiones = await peticionesDe(() =>
      assert.rejects(handleCoreBusinessTool(tool, { connection: 'pega', descripcion: 'x' }), /referencia/)
    );
    assert.deepEqual(peticiones, []);
  });
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
