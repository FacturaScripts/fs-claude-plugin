/**
 * Pruebas del filtrado de campos sensibles cuando la petición sale por un proxy
 * definido en el entorno (http_proxy sin no_proxy para el host). axios manda
 * entonces la URL absoluta como ruta de la petición (request.path), y el recurso
 * hay que sacarlo de ella.
 *
 * El FacturaScripts de pega hace de proxy: recibe la URL absoluta y responde
 * según su ruta. El host de la conexión no existe y nunca se resuelve.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const usuario = { nick: 'admin', password: 'HASH', logkey: 'LOGKEY', two_factor_secret_key: 'SEMILLA' };
const secretos = ['HASH', 'LOGKEY', 'SEMILLA'];

const proxy = await arrancarFsDePega((req) => {
  const ruta = new URL(req.url, 'http://x').pathname;
  if (ruta === '/api/3/users' || ruta === '/sub/api/3/users') return [usuario];
  if (ruta === '/api/3/contactos' || ruta === '/sub/api/3/contactos') return [{ idcontacto: 1, password: 'NO-ES-SECRETO-AQUI' }];
  // Texto en vez de JSON: el cliente lo recibe como string
  if (ruta === '/api/3/clientes') return 'texto de un recurso sin campos sensibles';
  return [];
});
for (const variable of ['no_proxy', 'NO_PROXY', 'npm_config_no_proxy', 'npm_config_noproxy']) {
  delete process.env[variable];
}
process.env.http_proxy = proxy.url;
const borrar = usarConexiones({
  default: 'raiz',
  connections: {
    raiz: { name: 'Raíz', url: 'http://fs.invalid', token: 't' },
    sub: { name: 'Subcarpeta', url: 'http://fs.invalid/sub', token: 't' },
  },
});
const { handleAnalyticsTool } = await import('../dist/modules/analytics/index.js');
const { fsClient } = await import('../dist/fs/client.js');

test.after(async () => {
  await proxy.cerrar();
  borrar();
});

test('la petición sale por el proxy con la URL absoluta', async () => {
  const desde = proxy.peticiones.length;
  await fsClient.get('contactos', {}, 'raiz');
  assert.deepEqual(proxy.peticiones.slice(desde).map((p) => p.path), ['http://fs.invalid/api/3/contactos']);
});

for (const conexion of ['raiz', 'sub']) {
  test(`con proxy, un recurso sin campos sensibles se devuelve entero (${conexion})`, async () => {
    const resultado = await handleAnalyticsTool('get_mi_recurso', { connection: conexion, recurso: 'contactos' });
    assert.ok(resultado.content[0].text.includes('NO-ES-SECRETO-AQUI'));
  });

  test(`con proxy, los campos sensibles se siguen ocultando (${conexion})`, async () => {
    const respuesta = JSON.stringify(await fsClient.get('users', {}, conexion));
    assert.deepEqual(secretos.filter((s) => respuesta.includes(s)), []);
    assert.ok(respuesta.includes('admin'));
  });
}

test('con proxy, una respuesta de texto de un recurso sin campos sensibles se devuelve tal cual', async () => {
  assert.equal(await fsClient.get('clientes', {}, 'raiz'), 'texto de un recurso sin campos sensibles');
});
