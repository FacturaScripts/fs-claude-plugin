/**
 * Pruebas de que los campos sensibles no llegan al modelo aunque la API los
 * devuelva, como hacen los cores anteriores a getApiFieldsToHide().
 *
 * El FacturaScripts de pega devuelve los registros completos.
 */

import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const usuario = { nick: 'admin', admin: true, password: 'HASH', logkey: 'LOGKEY', two_factor_secret_key: 'SEMILLA' };
const apikey = { id: 1, description: 'integración', apikey: 'CLAVE' };
const ajuste = { name: 'email', properties: JSON.stringify({ host: 'smtp.example.test', password: 'SMTP' }) };
const secretos = ['HASH', 'LOGKEY', 'SEMILLA', 'CLAVE', 'SMTP'];

const fs = await arrancarFsDePega((req) => {
  // Fuera de la base de la API, con «//» delante: se mira antes de pasarla por URL
  if (req.url === '//x/api/3/clientes') return [usuario];
  const ruta = new URL(req.url, 'http://x').pathname;
  if (req.method !== 'GET') return { ok: 'hecho', data: usuario };
  if (ruta === '/api/3/users' || ruta === '/api/3/users/' || ruta === '/api/users') return [usuario];
  if (ruta === '/api/3/users/admin') return usuario;
  if (ruta === '/api/3/apikeyes') return [apikey];
  if (ruta === '/api/3/settings') return [ajuste];
  // properties ya decodificado como objeto, en vez de como texto
  if (ruta === '/api/3/settings/objeto') return [{ ...ajuste, properties: JSON.parse(ajuste.properties) }];
  // Rutas con el recurso codificado o con parámetros de segmento
  if (['/api/3/%75sers', '/api/3/x%2F..%2Fusers', '/api/3/users;x'].includes(ruta)) return [usuario];
  if (ruta === '/api/3/clientes') return [{ codcliente: 'C1', password: 'NO-ES-SECRETO-AQUI' }];
  return [];
});
// Una instalación que manda texto antes del JSON, como un aviso de PHP con
// display_errors activo: axios entrega entonces un string y no un objeto
const crudo = http.createServer((req, res) => {
  const ruta = new URL(req.url, 'http://x').pathname;
  res.setHeader('Content-Type', 'application/json');
  if (ruta === '/api/3/users') return res.end(`Deprecated: aviso de PHP on line 3\n${JSON.stringify([usuario])}`);
  // Avisos con «{» o «[» en el texto, como los escribe PHP: cada uno acaba en un
  // salto de línea, con html_errors y sin él, y con la pila que añade Xdebug
  if (ruta === '/api/3/users/llaves') return res.end(`\nDeprecated: {closure}(): aviso in /app/x.php on line 4\n${JSON.stringify([usuario])}`);
  if (ruta === '/api/3/users/corchetes') return res.end(`\nWarning: Undefined array key [x] in /app/x.php on line 3\n${JSON.stringify([usuario])}`);
  if (ruta === '/api/3/users/html') return res.end(`<br />\n<b>Deprecated</b>:  {closure}(): aviso in <b>/app/x.php</b> on line <b>4</b><br />\n${JSON.stringify([usuario])}`);
  if (ruta === '/api/3/users/pila') return res.end(`Deprecated: aviso in /app/x.php on line 4\n\nCall Stack:\n    0.0002     354160   1. {main}() /app/x.php:0\n\n${JSON.stringify([usuario])}`);
  if (ruta === '/api/3/settings') return res.end(`\nWarning: Undefined array key [x] in /app/x.php on line 3\n${JSON.stringify([ajuste])}`);
  // Aviso sin salto de línea antes del JSON, sin «{» ni «[»
  if (ruta === '/api/3/users/sinsalto') return res.end(`Aviso sin salto de línea: ${JSON.stringify([usuario])}`);
  // El JSON se busca desde 20 principios de línea como mucho: en el vigésimo se
  // encuentra, en el vigesimoprimero no, y miles de ellos fallan sin tardar
  if (ruta === '/api/3/users/tope') return res.end(`aviso\n${'[x]\n'.repeat(19)}${JSON.stringify([usuario])}`);
  if (ruta === '/api/3/users/sobretope') return res.end(`aviso\n${'[x]\n'.repeat(20)}${JSON.stringify([usuario])}`);
  if (ruta === '/api/3/users/patologico') return res.end(`x\n${'[\n'.repeat(10000)}${JSON.stringify([usuario])}`);
  // «{» o «[» a principio de línea sin JSON válido detrás
  if (ruta === '/api/3/users/falso') return res.end(`[x] aviso con HASH\n{no es JSON`);
  if (ruta === '/api/3/apikeyes') return res.end('Warning: aviso de PHP sin JSON detrás, con CLAVE');
  return res.end('texto de un recurso sin campos sensibles');
});
await new Promise((resolve) => crudo.listen(0, '127.0.0.1', resolve));
const borrar = usarConexiones({
  default: 'pega',
  connections: {
    pega: { name: 'Pega', url: fs.url, token: 't' },
    cruda: { name: 'Cruda', url: `http://127.0.0.1:${crudo.address().port}`, token: 't' },
  },
});
const { handleSystemTool } = await import('../dist/modules/system/index.js');
const { handleConfigurationTool } = await import('../dist/modules/configuration/index.js');
const { handleAnalyticsTool } = await import('../dist/modules/analytics/index.js');
const { fsClient } = await import('../dist/fs/client.js');

test.after(async () => {
  await fs.cerrar();
  await new Promise((resolve) => crudo.close(() => resolve()));
  borrar();
});

for (const [handler, tool, args, conservado] of [
  [() => handleSystemTool, 'get_users', {}, 'admin'],
  [() => handleConfigurationTool, 'get_apikeyes', {}, 'integración'],
  [() => handleConfigurationTool, 'get_settings', {}, 'smtp.example.test'],
  [() => handleAnalyticsTool, 'get_mi_recurso', { recurso: 'users' }, 'admin'],
  [() => handleAnalyticsTool, 'get_mi_recurso', { recurso: 'users/admin' }, 'admin'],
  [() => handleAnalyticsTool, 'get_mi_recurso', { recurso: 'apikeyes' }, 'integración'],
  [() => handleAnalyticsTool, 'get_mi_recurso', { recurso: 'settings' }, 'smtp.example.test'],
  [() => handleSystemTool, 'create_user', { nick: 'nuevo' }, 'admin'],
  [() => handleSystemTool, 'update_user', { nick: 'admin', email: 'x' }, 'admin'],
  [() => handleSystemTool, 'delete_user', { nick: 'admin' }, 'admin'],
]) {
  test(`${tool} ${JSON.stringify(args)} no devuelve secretos y conserva el resto`, async () => {
    const resultado = await handler()(tool, { connection: 'pega', ...args });
    const texto = resultado.content[0].text;
    assert.deepEqual(secretos.filter((s) => texto.includes(s)), []);
    assert.ok(texto.includes(conservado), `falta ${conservado} en la respuesta`);
  });
}

test('los recursos sin campos sensibles no se tocan', async () => {
  const resultado = await handleAnalyticsTool('get_mi_recurso', { connection: 'pega', recurso: 'clientes' });
  assert.ok(resultado.content[0].text.includes('NO-ES-SECRETO-AQUI'));
});

// El recurso se decide sobre la ruta que llega a la API, no sobre la que se pide:
// la URL normaliza los segmentos «.» y «..» (también %2e%2e, que sale de /api/3).
for (const ruta of ['./users', 'x/../users', 'users/./', '%2e%2e/users']) {
  test(`el cliente oculta los secretos aunque la ruta pedida sea ${JSON.stringify(ruta)}`, async () => {
    const respuesta = JSON.stringify(await fsClient.get(ruta, {}, 'pega'));
    assert.deepEqual(secretos.filter((s) => respuesta.includes(s)), []);
  });
}

// Las barras iniciales se quitan, como hacía axios antes de validar el recurso
for (const [recurso, ruta] of [['/users', '/api/3/users'], ['//users', '/api/3/users'], ['/users/admin', '/api/3/users/admin']]) {
  test(`get_mi_recurso acepta ${JSON.stringify(recurso)}, pide ${ruta} y no devuelve secretos`, async () => {
    const desde = fs.peticiones.length;
    const resultado = await handleAnalyticsTool('get_mi_recurso', { connection: 'pega', recurso });
    const texto = resultado.content[0].text;
    assert.deepEqual(fs.peticiones.slice(desde).map((p) => p.path), [ruta]);
    assert.deepEqual(secretos.filter((s) => texto.includes(s)), []);
    assert.ok(texto.includes('admin'));
  });
}

for (const recurso of ['./users', 'x/../users', 'users/./', '%2e%2e/users', 'x\\..\\..\\..\\index.php', '..\\users', '\\..\\..\\deploy', '\\users',
  '/../users', '//../users', '/./users', '/%2e%2e/users', '/\\users', '/\\..\\deploy', '/x\\..\\..\\..\\index.php',
  // La URL quita \t, \r y \n en cualquier posición: «.\t.» llegaría como «..»
  '.\t./.\t./deploy', '/.\r./.\n./index.php', 'users\x00', 'users\x1f']) {
  test(`get_mi_recurso rechaza el recurso ${JSON.stringify(recurso)} sin llamar a la API`, async () => {
    const desde = fs.peticiones.length;
    const resultado = await handleAnalyticsTool('get_mi_recurso', { connection: 'pega', recurso });
    assert.equal(resultado.isError, true);
    assert.deepEqual(fs.peticiones.slice(desde), []);
  });
}

test('con texto antes del JSON, el registro se filtra igual', async () => {
  const respuesta = JSON.stringify(await fsClient.get('users', {}, 'cruda'));
  assert.deepEqual(secretos.filter((s) => respuesta.includes(s)), []);
  assert.ok(respuesta.includes('admin'));
});

for (const ruta of ['users/llaves', 'users/corchetes', 'users/html', 'users/pila', 'users/sinsalto']) {
  test(`con un aviso antes del JSON (${ruta}), el registro se filtra igual`, async () => {
    const respuesta = JSON.stringify(await fsClient.get(ruta, {}, 'cruda'));
    assert.deepEqual(secretos.filter((s) => respuesta.includes(s)), []);
    assert.ok(respuesta.includes('admin'));
  });
}

test('con un aviso con «[» antes del JSON, settings se filtra igual', async () => {
  const respuesta = JSON.stringify(await fsClient.get('settings', {}, 'cruda'));
  assert.ok(!respuesta.includes('SMTP'));
  assert.ok(respuesta.includes('smtp.example.test'));
});

test('el JSON se encuentra en el vigésimo principio de línea con «[»', async () => {
  const respuesta = JSON.stringify(await fsClient.get('users/tope', {}, 'cruda'));
  assert.deepEqual(secretos.filter((s) => respuesta.includes(s)), []);
  assert.ok(respuesta.includes('admin'));
});

test('pasado el vigésimo principio de línea con «[», se falla sin devolver el texto', async () => {
  await assert.rejects(fsClient.get('users/sobretope', {}, 'cruda'), /respuesta no JSON/);
});

test('miles de líneas que empiezan por «[» fallan en menos de un segundo', async () => {
  const inicio = performance.now();
  await assert.rejects(fsClient.get('users/patologico', {}, 'cruda'), /respuesta no JSON/);
  assert.ok(performance.now() - inicio < 1000, `tardó ${Math.round(performance.now() - inicio)} ms`);
});

test('con «{» o «[» a principio de línea y ningún JSON válido, da error sin devolver el texto', async () => {
  await assert.rejects(fsClient.get('users/falso', {}, 'cruda'), (error) =>
    /respuesta no JSON/.test(error.message) && !error.message.includes('HASH')
  );
});

test('una respuesta sin JSON de un recurso sensible da error y no devuelve el texto', async () => {
  await assert.rejects(fsClient.get('apikeyes', {}, 'cruda'), (error) =>
    /respuesta no JSON/.test(error.message) && !error.message.includes('CLAVE')
  );
});

test('una respuesta de texto de un recurso sin campos sensibles se devuelve tal cual', async () => {
  assert.equal(await fsClient.get('clientes', {}, 'cruda'), 'texto de un recurso sin campos sensibles');
});

test('properties como objeto tampoco devuelve la contraseña', async () => {
  const respuesta = JSON.stringify(await fsClient.get('settings/objeto', {}, 'pega'));
  assert.ok(!respuesta.includes('SMTP'));
  assert.ok(respuesta.includes('smtp.example.test'));
});

test('una ruta enviada que empieza por «//» oculta todos los campos', async () => {
  const desde = fs.peticiones.length;
  const respuesta = JSON.stringify(await fsClient.get('../..//x/api/3/clientes', {}, 'pega'));
  assert.deepEqual(fs.peticiones.slice(desde).map((p) => p.path), ['//x/api/3/clientes']);
  assert.deepEqual(secretos.filter((s) => respuesta.includes(s)), []);
});

for (const ruta of ['%75sers', 'x%2F..%2Fusers', 'users;x']) {
  test(`una ruta con el recurso codificado (${ruta}) oculta todos los campos`, async () => {
    const respuesta = JSON.stringify(await fsClient.get(ruta, {}, 'pega'));
    assert.deepEqual(secretos.filter((s) => respuesta.includes(s)), []);
  });
}
