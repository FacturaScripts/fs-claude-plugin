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

for (const recurso of ['./users', 'x/../users', 'users/./', '%2e%2e/users', '/users', 'x\\..\\..\\..\\index.php', '..\\users', '\\..\\..\\deploy', '\\users']) {
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

for (const ruta of ['%75sers', 'x%2F..%2Fusers', 'users;x']) {
  test(`una ruta con el recurso codificado (${ruta}) oculta todos los campos`, async () => {
    const respuesta = JSON.stringify(await fsClient.get(ruta, {}, 'pega'));
    assert.deepEqual(secretos.filter((s) => respuesta.includes(s)), []);
  });
}
