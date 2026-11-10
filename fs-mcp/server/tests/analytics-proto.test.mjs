/**
 * Pruebas de que un código del ERP con nombre de propiedad heredada
 * (__proto__, constructor, toString) ni desaparece de los informes ni
 * contamina Object.prototype en el proceso.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const codigos = ['__proto__', 'constructor', 'toString'];
const respuestas = {
  '/api/3/lineafacturaclientes': codigos.map((referencia) => ({ referencia, cantidad: 1, pvptotal: 10 })),
  '/api/3/facturaclientes': codigos.map((codagente) => ({ codagente, total: 10 })),
};
const fs = await arrancarFsDePega((req) => respuestas[new URL(req.url, 'http://x').pathname] ?? []);
const borrar = usarConexiones({
  default: 'pega',
  connections: { pega: { name: 'Pega', url: fs.url, token: 't' } },
});
const { handleAnalyticsTool } = await import('../dist/modules/analytics/index.js');

test.after(async () => {
  await fs.cerrar();
  borrar();
});

test('get_productos_mas_vendidos lista las referencias con nombre de propiedad heredada', async () => {
  const resultado = await handleAnalyticsTool('get_productos_mas_vendidos', { connection: 'pega' });
  const referencias = JSON.parse(resultado.content[0].text).map((p) => p.referencia);
  assert.deepEqual(referencias.sort(), [...codigos].sort());
  assert.equal(({}).cantidadVendida, undefined);
});

test('get_ventas_por_agente lista los agentes con nombre de propiedad heredada', async () => {
  const resultado = await handleAnalyticsTool('get_ventas_por_agente', { connection: 'pega' });
  const agentes = JSON.parse(resultado.content[0].text).map((a) => a.codagente);
  assert.deepEqual(agentes.sort(), [...codigos].sort());
  assert.equal(({}).totalFacturado, undefined);
});
