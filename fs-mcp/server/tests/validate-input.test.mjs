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

const { validateToolInput } = await import('../dist/utils/validateInput.js');

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

test('un id vacío se rechaza como no numérico', async () => {
  const { result, peticiones } = await llamar('delete_factura_cliente', { connection: 'pega', id: '' });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /"id" debe ser de tipo number/);
  assert.deepEqual(peticiones, []);
});

test('un id numérico escrito como texto llega a la API, como antes de validar', async () => {
  const { result, peticiones } = await llamar('delete_factura_cliente', { connection: 'pega', id: '5' });
  assert.notEqual(result.isError, true);
  assert.deepEqual(peticiones, ['DELETE /api/3/facturaclientes/5']);
});

test('falta un argumento obligatorio: se rechaza sin llamar a la API', async () => {
  const { result, peticiones } = await llamar('delete_factura_cliente', { connection: 'pega' });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /falta el argumento obligatorio "id"/);
  assert.deepEqual(peticiones, []);
});

test('un valor fuera de un enum escrito a mano se rechaza', async () => {
  const { result } = await llamar('describe_model', { model: 'producto', format: 'xml' });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /"format" debe ser uno de: json, markdown/);
});

test('un valor fuera de un enum de la metadata llega a la API: ese enum es orientativo', async () => {
  const { result, peticiones } = await llamar('get_estadodocumentos', { connection: 'pega', tipodoc: 'TicketPlugin' });
  assert.notEqual(result.isError, true);
  assert.equal(peticiones.length, 1);
  assert.match(peticiones[0], /^GET \/api\/3\/estadodocumentos/);
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

test('un booleano escrito como "1" llega a la API, como antes de validar', async () => {
  const { result, peticiones } = await llamar('update_cliente', { connection: 'pega', codcliente: 'C1', debaja: '1' });
  assert.notEqual(result.isError, true);
  assert.deepEqual(peticiones, ['PUT /api/3/clientes/C1']);
});

test('un booleano escrito como "true" se rechaza: la API lo guardaría como texto', async () => {
  const { result, peticiones } = await llamar('update_cliente', { connection: 'pega', codcliente: 'C1', debaja: 'true' });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /"debaja" debe ser true, false, 1 o 0/);
  assert.deepEqual(peticiones, []);
});

test('un número en una propiedad string llega a la API, como antes de validar', async () => {
  const { result, peticiones } = await llamar('update_secuenciadocumento', { connection: 'pega', idsecuencia: 1, codejercicio: 2025 });
  assert.notEqual(result.isError, true);
  assert.deepEqual(peticiones, ['PUT /api/3/secuenciadocumentos/1']);
});

for (const tool of ['update_producto', 'delete_producto']) {
  test(`${tool} con la referencia como número pide escribirla entre comillas y no llama a la API`, async () => {
    const { result, peticiones } = await llamar(tool, { connection: 'pega', referencia: 12345 });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /referencia va como texto, entre comillas/);
    assert.deepEqual(peticiones, []);
  });
}

test('un código de la ruta como número se rechaza: perdería los ceros a la izquierda', async () => {
  for (const tool of ['delete_cliente', 'update_cliente']) {
    const { result, peticiones } = await llamar(tool, { connection: 'pega', codcliente: 123 });
    assert.equal(result.isError, true, tool);
    assert.match(result.content[0].text, /"codcliente" va como texto, entre comillas/);
    assert.deepEqual(peticiones, [], tool);
  }
});

test('un código de la ruta como texto llega intacto, con sus ceros', async () => {
  const { result, peticiones } = await llamar('update_cliente', { connection: 'pega', codcliente: '00123', codpostal: 8001 });
  assert.notEqual(result.isError, true);
  assert.deepEqual(peticiones, ['PUT /api/3/clientes/00123']);
});

for (const [tool, prop] of [['add_connection', 'key'], ['add_connection', 'name'], ['add_connection', 'url'], ['add_connection', 'token'], ['add_connection', 'version'], ['set_default_connection', 'key']]) {
  test(`${tool} rechaza ${prop} como número y no toca el archivo de conexiones`, async () => {
    const archivo = path.join(home, 'connections.json');
    const antes = fs.readFileSync(archivo, 'utf8');
    const args = { key: 'nueva', name: 'Nueva', url: 'http://127.0.0.1:9', token: 't', [prop]: 5 };
    const { result } = await llamar(tool, tool === 'set_default_connection' ? { key: 5 } : args);
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, new RegExp(`"${prop}" va como texto, entre comillas`));
    assert.equal(fs.readFileSync(archivo, 'utf8'), antes);
  });
}

test('en una propiedad string se acepta un número finito, pero no NaN, Infinity ni un booleano', () => {
  const esquema = { properties: { codpostal: { type: 'string' } } };
  assert.equal(validateToolInput(esquema, { codpostal: 28001 }), null);
  for (const codpostal of [NaN, Infinity, true]) {
    assert.equal(validateToolInput(esquema, { codpostal }), 'el argumento "codpostal" debe ser de tipo string');
  }
});

test('integer acepta un entero, también escrito como texto, y rechaza los decimales', () => {
  const esquema = { properties: { position: { type: 'integer' } } };
  for (const position of [5, -3, '5', '-3']) {
    assert.equal(validateToolInput(esquema, { position }), null, JSON.stringify(position));
  }
  for (const position of [5.5, '5.5', 'abc', '', Infinity, true]) {
    assert.equal(validateToolInput(esquema, { position }), 'el argumento "position" debe ser de tipo integer', JSON.stringify(position));
  }
});

test('number sigue aceptando decimales', () => {
  const esquema = { properties: { precio: { type: 'number' } } };
  assert.equal(validateToolInput(esquema, { precio: 5.5 }), null);
  assert.equal(validateToolInput(esquema, { precio: '5.5' }), null);
});

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
