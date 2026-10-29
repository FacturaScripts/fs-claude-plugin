/**
 * Pruebas de la validación de argumentos contra el inputSchema en el despacho
 * de tools del servidor, antes de llamar al handler.
 *
 * Arranca el servidor por stdio contra un FacturaScripts de pega en loopback y
 * mira qué peticiones llegan a la API para cada llamada.
 */

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { arrancarFsDePega } from './fake-fs.mjs';

const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const api = await arrancarFsDePega((req) => (req.method === 'GET' ? [{ idproducto: 5, referencia: 'R1' }] : { ok: 'hecho' }));
const home = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-validar-'));
fs.writeFileSync(
  path.join(home, 'connections.json'),
  JSON.stringify({ default: 'pega', connections: { pega: { name: 'Pega', url: api.url, token: 't' } } })
);

const servidor = spawn('node', [path.join(serverDirectory, 'dist', 'index.js')], {
  env: { ...process.env, HOME: home, FS_CONNECTIONS_FILE: path.join(home, 'connections.json') },
  stdio: ['pipe', 'pipe', 'ignore'],
});
const pendientes = new Map();
let siguienteId = 1;
let buffer = '';
servidor.stdout.setEncoding('utf8');
servidor.stdout.on('data', (trozo) => {
  buffer += trozo;
  let fin;
  while ((fin = buffer.indexOf('\n')) !== -1) {
    const mensaje = JSON.parse(buffer.slice(0, fin));
    buffer = buffer.slice(fin + 1);
    pendientes.get(mensaje.id)?.(mensaje);
  }
});

function rpc(method, params) {
  const id = siguienteId++;
  servidor.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  return new Promise((resolve) => pendientes.set(id, resolve));
}

await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'test', version: '0' } });
servidor.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

test.after(async () => {
  servidor.kill();
  await api.cerrar();
  fs.rmSync(home, { recursive: true, force: true });
});

/** Llama a la tool y devuelve el resultado y las peticiones que llegaron a la API. */
async function llamar(name, args) {
  const desde = api.peticiones.length;
  const { result } = await rpc('tools/call', { name, arguments: args });
  return { result, peticiones: api.peticiones.slice(desde).map((p) => `${p.method} ${p.path}`) };
}

test('un id que no es número se rechaza antes de llegar a la API', async () => {
  const { result, peticiones } = await llamar('delete_factura_cliente', { connection: 'pega', id: '../users/admin' });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /"id" debe ser de tipo number/);
  assert.deepEqual(peticiones, []);
});

test('falta un argumento obligatorio: se rechaza sin llamar a la API', async () => {
  const { result, peticiones } = await llamar('delete_factura_cliente', { connection: 'pega' });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /falta el argumento obligatorio "id"/);
  assert.deepEqual(peticiones, []);
});

test('un valor fuera del enum de una cadena se rechaza', async () => {
  const { result, peticiones } = await llamar('create_serie', { connection: 'pega', codserie: 'Z', descripcion: 'z', tipo: 'X' });
  assert.equal(result.isError, true);
  assert.deepEqual(peticiones, []);
});

test('un elemento de un array con el tipo equivocado se rechaza', async () => {
  const { result, peticiones } = await llamar('create_factura_cliente', { connection: 'pega', codcliente: 'C1', lineas: ['no-es-un-objeto'] });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /elementos de "lineas"/);
  assert.deepEqual(peticiones, []);
});

// Lo que tiene que seguir funcionando
test('un id válido llega a la API', async () => {
  const { peticiones } = await llamar('delete_factura_cliente', { connection: 'pega', id: 5 });
  assert.deepEqual(peticiones, ['DELETE /api/3/facturaclientes/5']);
});

test('sin connection se usa la conexión por defecto aunque el esquema la declare obligatoria', async () => {
  const { result, peticiones } = await llamar('delete_factura_cliente', { id: 5 });
  assert.notEqual(result.isError, true);
  assert.deepEqual(peticiones, ['DELETE /api/3/facturaclientes/5']);
});

for (const [tool, esperado] of [['update_producto', 'PUT /api/3/productos/5'], ['delete_producto', 'DELETE /api/3/productos/5']]) {
  test(`${tool} acepta idproducto sin referencia`, async () => {
    const { result, peticiones } = await llamar(tool, { connection: 'pega', idproducto: 5 });
    assert.notEqual(result.isError, true);
    assert.deepEqual(peticiones, [esperado]);
  });
}

for (const personafisica of [true, '1']) {
  test(`personafisica ${JSON.stringify(personafisica)} se acepta: boolean o un valor de su enum ["1", "0"]`, async () => {
    const { result } = await llamar('update_cliente', { connection: 'pega', codcliente: 'C1', personafisica });
    assert.notEqual(result.isError, true);
  });
}

test('las propiedades no declaradas se reenvían como hasta ahora', async () => {
  const { result, peticiones } = await llamar('update_cliente', { connection: 'pega', codcliente: 'C1', campo_libre: 'x' });
  assert.notEqual(result.isError, true);
  assert.deepEqual(peticiones, ['PUT /api/3/clientes/C1']);
});

// Producto sin identificador: sin filtro, la API devolvería el primer producto
for (const tool of ['update_producto', 'delete_producto']) {
  for (const [caso, args] of [
    ['sin idproducto ni referencia', {}],
    ['con la referencia vacía', { referencia: '' }],
  ]) {
    test(`${tool} ${caso} no llama a la API`, async () => {
      const { result, peticiones } = await llamar(tool, { connection: 'pega', ...args });
      assert.equal(result.isError, true);
      assert.deepEqual(peticiones, []);
    });
  }

  test(`${tool} con una referencia que no es la del producto devuelto no modifica ningún producto`, async () => {
    const { result, peticiones } = await llamar(tool, { connection: 'pega', referencia: 'R2' });
    assert.equal(result.isError, true);
    assert.deepEqual(peticiones.filter((p) => !p.startsWith('GET ')), []);
  });

  test(`${tool} por referencia usa el producto que la tiene`, async () => {
    const { result, peticiones } = await llamar(tool, { connection: 'pega', referencia: 'R1' });
    assert.notEqual(result.isError, true);
    assert.ok(peticiones.at(-1).endsWith(' /api/3/productos/5'));
  });
}
