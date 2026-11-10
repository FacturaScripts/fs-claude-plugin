/**
 * Pruebas de cómo llega a la ruta de la API el identificador de un registro.
 *
 * El core no decodifica la ruta de la API: index.php usa parse_url(),
 * Kernel::getRelativeUrl() sólo aplica FILTER_SANITIZE_URL y
 * ApiController::getUriParam() hace explode('/'). Lo que llega por la red es lo
 * que busca ModelClass::load(), así que el identificador tiene que ir tal cual:
 * «C+1» codificado como «C%2B1» no se encuentra.
 *
 * El FacturaScripts de pega registra la ruta exacta que llega por la red, sin
 * decodificarla, igual que el core.
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
const { handleSystemTool } = await import('../dist/modules/system/index.js');

test.after(async () => {
  await fs.cerrar();
  borrar();
});

/** Peticiones que llegan al FS de pega mientras se ejecuta `fn`. */
async function peticionesDe(fn) {
  const desde = fs.peticiones.length;
  await fn();
  return fs.peticiones.slice(desde).map((p) => `${p.method} ${p.path}`);
}

// Los códigos del core admiten «+» (/^[A-Z0-9_\+\.\-]{1,N}$/i) y el nick, además, «@»
test('update_cliente lleva un código con «+» tal cual a la ruta', async () => {
  const peticiones = await peticionesDe(() =>
    handleCoreBusinessTool('update_cliente', { connection: 'pega', codcliente: 'C+1', nombre: 'n' }));
  assert.deepEqual(peticiones, ['PUT /api/3/clientes/C+1']);
});

test('delete_cliente lleva un código con «+» tal cual a la ruta', async () => {
  const peticiones = await peticionesDe(() =>
    handleCoreBusinessTool('delete_cliente', { connection: 'pega', codcliente: 'C+1' }));
  assert.deepEqual(peticiones, ['DELETE /api/3/clientes/C+1']);
});

test('delete_user lleva un nick con «@» tal cual a la ruta', async () => {
  const peticiones = await peticionesDe(() =>
    handleSystemTool('delete_user', { connection: 'pega', nick: 'ana@example.com' }));
  assert.deepEqual(peticiones, ['DELETE /api/3/users/ana@example.com']);
});

// Lo que cambiaría el recurso o la query se rechaza sin llamar a la API. «\» y
// «.» van además de lo evidente porque la URL los normaliza: «..\users» acaba
// en /api/3/users y «.» en /api/3/clientes/. «%» porque «%2e%2e» se normaliza
// como «..». Tabuladores y saltos de línea, porque la URL los quita en silencio
// y «C\t1» llegaría como «C1», otro registro.
for (const id of ['../users/admin', 'a/b', '..\\users', 'a\\b', 'a?x=1', 'a#b', '%2e%2e', 'a%41', '.', '..', 'C\t1', 'C\n1']) {
  test(`delete_factura_cliente rechaza el id ${JSON.stringify(id)} sin llamar a la API`, async () => {
    const peticiones = await peticionesDe(() =>
      assert.rejects(
        handleSalesOrdersTool('delete_factura_cliente', { connection: 'pega', id }),
        /Identificador no válido para la ruta de la API/,
      ));
    assert.deepEqual(peticiones, []);
  });
}

test('update_cliente rechaza un código con barras sin llamar a la API', async () => {
  const peticiones = await peticionesDe(() =>
    assert.rejects(
      handleCoreBusinessTool('update_cliente', { connection: 'pega', codcliente: '../users/admin?x=1', nombre: 'n' }),
      /Identificador no válido para la ruta de la API/,
    ));
  assert.deepEqual(peticiones, []);
});
