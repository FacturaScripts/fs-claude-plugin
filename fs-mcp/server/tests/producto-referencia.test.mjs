/**
 * Pruebas de que update_producto y delete_producto nunca tocan un producto
 * distinto del pedido: sin referencia ni idproducto no llaman a la API, y si la
 * búsqueda por referencia devuelve otro producto no lo modifican ni lo eliminan.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

// Lo que responde la API de pega a GET /productos; cada test lo fija
let productos = [];
const fs = await arrancarFsDePega((req) => (req.method === 'GET' ? productos : { ok: true }));
const borrar = usarConexiones({
  default: 'pega',
  connections: { pega: { name: 'Pega', url: fs.url, token: 't' } },
});
const { handleCoreBusinessTool } = await import('../dist/modules/core-business/index.js');

test.after(async () => {
  await fs.cerrar();
  borrar();
});

/**
 * Llama a la tool y devuelve el error (lanzado o como isError) y las peticiones
 * que llegaron a la API.
 *
 * @param {string} nombre Nombre de la tool.
 * @param {Record<string, unknown>} args Argumentos de la tool.
 * @returns {Promise<{error: string, peticiones: string[]}>}
 */
async function llamar(nombre, args) {
  const desde = fs.peticiones.length;
  let error = '';
  try {
    const res = await handleCoreBusinessTool(nombre, { connection: 'pega', ...args });
    if (res?.isError) error = res.content.map((c) => c.text).join('\n');
  } catch (e) {
    error = e.message;
  }
  return { error, peticiones: fs.peticiones.slice(desde).map((p) => `${p.method} ${p.path}`) };
}

for (const nombre of ['update_producto', 'delete_producto']) {
  test(`${nombre} sin referencia ni idproducto no llama a la API`, async () => {
    productos = [{ idproducto: 1, referencia: 'PRIMERO' }];
    for (const args of [{}, { referencia: '' }, { referencia: '  ' }]) {
      const { error, peticiones } = await llamar(nombre, { ...args, descripcion: 'x' });
      assert.match(error, /referencia o el idproducto/);
      assert.deepEqual(peticiones, []);
    }
  });

  test(`${nombre} no toca otro producto si la API devuelve uno distinto del pedido`, async () => {
    productos = [{ idproducto: 1, referencia: 'PRIMERO' }];
    const { error, peticiones } = await llamar(nombre, { referencia: 'OTRA', descripcion: 'x' });
    assert.match(error, /ha devuelto otro producto/);
    assert.deepEqual(peticiones.filter((p) => !p.startsWith('GET ')), []);
  });

  test(`${nombre} usa el idproducto del producto con esa referencia`, async () => {
    productos = [{ idproducto: 7, referencia: 'REF-7' }];
    const { error, peticiones } = await llamar(nombre, { referencia: 'ref-7', descripcion: 'x' });
    assert.equal(error, '');
    assert.equal(peticiones.length, 2);
    assert.match(peticiones[0], /^GET \/api\/3\/productos\?.*filter%5Breferencia%5D=ref-7/);
    assert.match(peticiones[1], /^(PUT|DELETE) \/api\/3\/productos\/7$/);
  });
}
