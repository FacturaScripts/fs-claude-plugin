/**
 * Recorre las tools de todos los módulos y comprueba que ningún argumento llega
 * sin codificar a la ruta de la API.
 *
 * Cada tool se llama con todas sus propiedades string o number puestas a un
 * valor con «/», «?» y «#». Lleva «/» pero no «..», porque la URL normaliza
 * «..» y se llevaría la marca por delante. Si una tool mete el valor en la
 * ruta tal cual, el FacturaScripts de pega recibe una ruta con «ZZ/».
 *
 * Queda fuera get_mi_recurso, que mete en la ruta el recurso que recibe: es su
 * función. Los módulos analytics y schema entran en el recorrido aunque hoy no
 * componen rutas con argumentos (schema usa la ruta de los metadatos).
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const MARCA = 'ZZ/YY?q=1#h';
const MARCA_CODIFICADA = encodeURIComponent(MARCA);

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

test.after(async () => {
  await fs.cerrar();
  borrar();
});

test('ninguna tool salvo get_mi_recurso mete un argumento sin codificar en la ruta de la API', async () => {
  const sinCodificar = [];
  const codificadas = new Set();

  for (const [modulo, registrar, manejar] of modulos) {
    const m = await import(`../dist/modules/${modulo}/index.js`);
    const tools = new Map();
    await m[registrar](tools);
    for (const [nombre, tool] of tools) {
      if (EXCLUIDAS.has(nombre)) continue;
      const args = { connection: 'pega' };
      for (const [prop, esquema] of Object.entries(tool.inputSchema.properties ?? {})) {
        if (prop !== 'connection' && (esquema.type === 'string' || esquema.type === 'number')) args[prop] = MARCA;
      }
      const desde = fs.peticiones.length;
      try {
        await m[manejar](nombre, args);
      } catch {
        // Lo que importa es qué ruta llegó, no si la tool terminó bien
      }
      for (const { method, path } of fs.peticiones.slice(desde)) {
        if (path.includes('ZZ/')) sinCodificar.push(`${nombre}: ${method} ${path}`);
        if (path.split('?')[0].includes(MARCA_CODIFICADA)) codificadas.add(nombre);
      }
    }
  }

  assert.deepEqual(sinCodificar, []);
  // Control positivo: el recorrido alcanza de verdad las tools que llevan un id en
  // la ruta. Son 99, tantas como llamadas con encodeURIComponent en src/modules
  assert.ok(codificadas.size >= 99, `sólo ${codificadas.size} tools llevaron la marca codificada en la ruta`);
});
