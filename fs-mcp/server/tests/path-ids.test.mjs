/**
 * Recorre las tools de todos los módulos y comprueba cómo llegan sus argumentos
 * a la ruta de la API.
 *
 * Cada tool se llama con todas sus propiedades string o number puestas al mismo
 * valor, dos veces:
 *
 * - con «ZZ/YY?q=1#h», que cambiaría el recurso: ninguna tool puede meterlo en
 *   la ruta, y las que llevan un identificador en ella lo rechazan;
 * - con «C+1», un código válido en el core: las que llevan un identificador en
 *   la ruta lo meten tal cual, porque el core no decodifica la ruta.
 *
 * Queda fuera get_mi_recurso, que mete en la ruta el recurso que recibe: es su
 * función. Los módulos analytics y schema entran en el recorrido aunque hoy no
 * componen rutas con argumentos (schema usa la ruta de los metadatos).
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const fs = await arrancarFsDePega(() => ({ ok: true }));
const borrar = usarConexiones({
  default: 'pega',
  connections: { pega: { name: 'Pega', url: fs.url, token: 't' } },
});

const modulos = [
  ['accounting', 'registerAccountingTools', 'handleAccountingTool'],
  ['communication', 'registerCommunicationTools', 'handleCommunicationTool'],
  ['configuration', 'registerConfigurationTools', 'handleConfigurationTool'],
  ['core-business', 'registerCoreBusinessTools', 'handleCoreBusinessTool'],
  ['finance', 'registerFinanceTools', 'handleFinanceTool'],
  ['geographic', 'registerGeographicTools', 'handleGeographicTool'],
  ['purchasing', 'registerPurchasingTools', 'handlePurchasingTool'],
  ['sales-orders', 'registerSalesOrdersTools', 'handleSalesOrdersTool'],
  ['system', 'registerSystemTools', 'handleSystemTool'],
  ['analytics', 'registerAnalyticsTools', 'handleAnalyticsTool'],
  ['schema', 'registerSchemaTools', 'handleSchemaTool'],
];

// Tools que meten un argumento en la ruta a propósito
const EXCLUIDAS = new Set(['get_mi_recurso']);

// Llamadas que llevan un identificador en la ruta en src/modules
const CON_ID_EN_RUTA = 99;

test.after(async () => {
  await fs.cerrar();
  borrar();
});

/**
 * Llama a cada tool con `valor` en todos sus argumentos string o number.
 * Devuelve, por tool, las rutas que llegaron y el mensaje de error si lo hubo,
 * lanzado o devuelto como resultado con isError (algunos módulos lo capturan).
 */
async function recorrer(valor) {
  const resultados = [];
  for (const [modulo, registrar, manejar] of modulos) {
    const m = await import(`../dist/modules/${modulo}/index.js`);
    const tools = new Map();
    await m[registrar](tools);
    for (const [nombre, tool] of tools) {
      if (EXCLUIDAS.has(nombre)) continue;
      const args = { connection: 'pega' };
      for (const [prop, esquema] of Object.entries(tool.inputSchema.properties ?? {})) {
        if (prop !== 'connection' && (esquema.type === 'string' || esquema.type === 'number')) args[prop] = valor;
      }
      const desde = fs.peticiones.length;
      let error = '';
      try {
        const res = await m[manejar](nombre, args);
        if (res?.isError) error = res.content.map((c) => c.text).join('\n');
      } catch (e) {
        error = e.message;
      }
      // Sólo la ruta: en la query los valores van codificados como parámetros
      const rutas = fs.peticiones.slice(desde).map(({ method, path }) => `${method} ${path.split('?')[0]}`);
      resultados.push({ nombre, rutas, error });
    }
  }
  return resultados;
}

test('ninguna tool salvo get_mi_recurso mete en la ruta un argumento que cambie el recurso', async () => {
  const resultados = await recorrer('ZZ/YY?q=1#h');
  const conMarca = resultados.flatMap(({ nombre, rutas }) => rutas.filter((r) => r.includes('ZZ')).map((r) => `${nombre}: ${r}`));
  assert.deepEqual(conMarca, []);
  // Control positivo: el recorrido alcanza de verdad las tools que llevan un id en la ruta
  const rechazadas = resultados.filter(({ error }) => /Identificador no válido para la ruta de la API/.test(error));
  assert.ok(rechazadas.length >= CON_ID_EN_RUTA, `sólo ${rechazadas.length} tools rechazaron el identificador`);
});

test('las tools que llevan un id en la ruta lo meten tal cual, sin codificar', async () => {
  const resultados = await recorrer('C+1');
  const codificadas = resultados.flatMap(({ nombre, rutas }) => rutas.filter((r) => r.includes('C%2B1')).map((r) => `${nombre}: ${r}`));
  assert.deepEqual(codificadas, []);
  const talCual = resultados.filter(({ rutas }) => rutas.some((r) => r.endsWith('/C+1')));
  assert.ok(talCual.length >= CON_ID_EN_RUTA, `sólo ${talCual.length} tools llevaron «C+1» tal cual a la ruta`);
});
