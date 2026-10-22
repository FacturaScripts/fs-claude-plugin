/**
 * Pruebas de que una ruta construida con datos del modelo no puede convertirse
 * en una URL absoluta hacia otro host, que recibiría el token.
 *
 * Se llama al cliente directamente: lo que se prueba es cómo resuelve él la
 * ruta, con independencia de lo que cada tool admita como argumento.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const instalacion = await arrancarFsDePega();
const ajeno = await arrancarFsDePega();
const hostAjeno = new URL(ajeno.url).host;

const borrar = usarConexiones({
  default: 'pega',
  connections: { pega: { name: 'Pega', url: instalacion.url, token: 'token-secreto' } },
});
const { fsClient } = await import('../dist/fs/client.js');

test.after(async () => {
  await instalacion.cerrar();
  await ajeno.cerrar();
  borrar();
});

for (const [ruta, esperada] of [
  [`//${hostAjeno}/x`, `/api/3/${hostAjeno}/x`],
  [`http://${hostAjeno}/x`, `/api/3/http://${hostAjeno}/x`],
]) {
  test(`una ruta «${ruta.replace(hostAjeno, 'host')}» se resuelve bajo la API de la instalación`, async () => {
    const desde = instalacion.peticiones.length;
    await fsClient.get(ruta);

    assert.deepEqual(ajeno.peticiones, []);
    assert.deepEqual(instalacion.peticiones.slice(desde).map((p) => p.path), [esperada]);
  });
}
