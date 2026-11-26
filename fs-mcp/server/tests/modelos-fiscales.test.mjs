/**
 * Pruebas de las tools de los modelos fiscales (get_modelo_NNN y
 * get_resumen_modelos_fiscales) contra un FacturaScripts de pega en loopback:
 * registro de las tools, query que llega a cada endpoint, validación del periodo,
 * error cuando falta el plugin y resumen de varios modelos.
 */

process.env.TZ = 'Europe/Madrid';

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, respuesta, usarConexiones } from './fake-fs.mjs';

/** Respuestas por ruta (sin /api/3 ni query); pueden ser funciones de la petición. */
let respuestas = {};

const fs = await arrancarFsDePega((req) => {
  const ruta = new URL(req.url, 'http://x').pathname.replace(/^\/api\/3/, '');
  const valor = respuestas[ruta];
  return typeof valor === 'function' ? valor(req) : valor ?? [];
});
const borrar = usarConexiones({
  default: 'pega',
  connections: { pega: { name: 'Pega', url: fs.url, token: 't' } },
});

const { OFFICIAL_PLUGINS, registerOfficialPluginTools, handleOfficialPluginTool } = await import('../build/plugins/index.js');
const { normalizePeriod } = await import('../build/plugins/modelos-fiscales/index.js');

const tools = new Map();
registerOfficialPluginTools(tools);

test.after(async () => {
  await fs.cerrar();
  borrar();
});

test.beforeEach(() => {
  respuestas = {};
  fs.peticiones.length = 0;
});

/** Query de una petición registrada, decodificada. */
function query(peticion) {
  return Object.fromEntries(new URL(peticion.path, 'http://x').searchParams);
}

/** Ejecuta una tool y devuelve el resultado MCP. */
function ejecutar(nombre, args = {}) {
  return handleOfficialPluginTool(nombre, { connection: 'pega', ...args });
}

test('hay una tool por modelo, cada una en el plugin del ERP que la declara, y el resumen', () => {
  const plugins = {
    111: 'Modelo111', 190: 'Modelo111', 115: 'Modelo115', 180: 'Modelo115', 130: 'Modelo130',
    303: 'Modelo303', 390: 'Modelo303', 347: 'Modelo347', 349: 'Modelo349', 369: 'Modelo369',
  };
  for (const [numero, nombre] of Object.entries(plugins)) {
    const tool = tools.get(`get_modelo_${numero}`);
    assert.ok(tool, `falta get_modelo_${numero}`);
    const plugin = OFFICIAL_PLUGINS.find((p) => p.tools.includes(tool));
    assert.equal(plugin.name, nombre, tool.name);
    for (const prop of ['connection', 'idempresa', 'anio', 'codejercicio', 'periodo', 'detalle']) {
      assert.ok(tool.inputSchema.properties[prop], `${tool.name}: falta ${prop}`);
    }
  }
  // un solo plugin oficial por plugin del ERP
  const nombres = OFFICIAL_PLUGINS.map((p) => p.name).filter((n) => n.startsWith('Modelo'));
  assert.deepEqual(nombres, [...new Set(nombres)]);
  assert.ok(tools.get('get_resumen_modelos_fiscales'));
  // los anuales tienen el periodo opcional y solo admiten ANUAL; los trimestrales lo exigen y no admiten ANUAL
  for (const numero of ['190', '180', '390', '347']) {
    assert.deepEqual(tools.get(`get_modelo_${numero}`).inputSchema.required, [], numero);
    assert.deepEqual(tools.get(`get_modelo_${numero}`).inputSchema.properties.periodo.enum, ['ANUAL'], numero);
  }
  for (const numero of ['111', '115', '303']) {
    assert.deepEqual(tools.get(`get_modelo_${numero}`).inputSchema.required, ['periodo'], numero);
    assert.ok(!tools.get(`get_modelo_${numero}`).inputSchema.properties.periodo.enum.includes('ANUAL'), numero);
  }
});

test('normaliza el periodo que escribe el usuario', () => {
  assert.equal(normalizePeriod('1t'), 'T1');
  assert.equal(normalizePeriod(' t4 '), 'T4');
  assert.equal(normalizePeriod('3'), '03');
  assert.equal(normalizePeriod(12), '12');
  assert.equal(normalizePeriod('annual'), 'ANUAL');
  assert.equal(normalizePeriod('Y'), 'ANUAL');
});

test('get_modelo_303 envía los parámetros sueltos en la query, sin filter[...]', async () => {
  respuestas['/modelo303'] = { modelo: '303', resultado: 1259.7, casillas: { 71: 1259.7 } };
  const resultado = await ejecutar('get_modelo_303', { idempresa: 1, anio: 2026, periodo: '1T', detalle: true });
  assert.ok(!resultado.isError, resultado.content[0].text);
  assert.equal(JSON.parse(resultado.content[0].text).resultado, 1259.7);

  assert.equal(fs.peticiones.length, 1);
  const peticion = fs.peticiones[0];
  assert.equal(peticion.method, 'GET');
  assert.equal(new URL(peticion.path, 'http://x').pathname, '/api/3/modelo303');
  assert.deepEqual(query(peticion), { periodo: 'T1', idempresa: '1', anio: '2026', detalle: '1' });
});

test('los parámetros propios de cada modelo llegan al endpoint y los booleanos como 1/0', async () => {
  respuestas['/modelo130'] = { modelo: '130' };
  await ejecutar('get_modelo_130', {
    codejercicio: 'GE25',
    periodo: 'T4',
    gastos_dificil_justificacion: true,
    porcentaje: 20,
  });
  assert.deepEqual(query(fs.peticiones[0]), {
    periodo: 'T4',
    codejercicio: 'GE25',
    gastos_dificil_justificacion: '1',
    porcentaje: '20',
  });
});

test('el 347 no necesita periodo y rechaza uno trimestral sin llamar a la API', async () => {
  respuestas['/modelo347'] = { modelo: '347', resultado: null };
  const ok = await ejecutar('get_modelo_347', { anio: 2026, importe: 3005.06 });
  assert.ok(!ok.isError, ok.content[0].text);
  assert.deepEqual(query(fs.peticiones[0]), { anio: '2026', importe: '3005.06' });

  fs.peticiones.length = 0;
  const mal = await ejecutar('get_modelo_347', { periodo: 'T1' });
  assert.ok(mal.isError);
  assert.match(mal.content[0].text, /no válido para el modelo 347/);
  assert.equal(fs.peticiones.length, 0);
});

test('los anuales 190, 180 y 390 van a su propio endpoint sin periodo y rechazan un trimestre', async () => {
  for (const numero of ['190', '180', '390']) {
    respuestas[`/modelo${numero}`] = { modelo: numero, resultado: null };
    fs.peticiones.length = 0;
    const ok = await ejecutar(`get_modelo_${numero}`, { anio: 2025, detalle: true });
    assert.ok(!ok.isError, ok.content[0].text);
    assert.equal(new URL(fs.peticiones[0].path, 'http://x').pathname, `/api/3/modelo${numero}`);
    assert.deepEqual(query(fs.peticiones[0]), { anio: '2025', detalle: '1' });

    fs.peticiones.length = 0;
    const mal = await ejecutar(`get_modelo_${numero}`, { periodo: 'T1' });
    assert.ok(mal.isError);
    assert.match(mal.content[0].text, new RegExp(`no válido para el modelo ${numero}`));
    assert.equal(fs.peticiones.length, 0);
  }

  respuestas['/modelo180'] = { modelo: '180' };
  fs.peticiones.length = 0;
  await ejecutar('get_modelo_180', { periodo: 'annual', codretencion: 'IRPF19' });
  assert.deepEqual(query(fs.peticiones[0]), { periodo: 'ANUAL', codretencion: 'IRPF19' });
});

test('el 111, el 115 y el 303 ya no admiten el periodo ANUAL', async () => {
  for (const numero of ['111', '115', '303']) {
    const mal = await ejecutar(`get_modelo_${numero}`, { periodo: 'ANUAL' });
    assert.ok(mal.isError, numero);
    assert.match(mal.content[0].text, new RegExp(`no válido para el modelo ${numero}`));
  }
  assert.equal(fs.peticiones.length, 0);
});

test('sin periodo o con uno que el modelo no admite, avisa sin llamar a la API', async () => {
  const sin = await ejecutar('get_modelo_111', {});
  assert.ok(sin.isError);
  assert.match(sin.content[0].text, /Indica el periodo/);

  const mes = await ejecutar('get_modelo_130', { periodo: '05' });
  assert.ok(mes.isError);
  assert.match(mes.content[0].text, /T1, T2, T3, T4/);
  assert.equal(fs.peticiones.length, 0);
});

test('si la instalación no tiene el endpoint, dice qué plugin y versión hace falta', async () => {
  respuestas['/modelo115'] = () => respuesta(404, { status: 'error', message: 'Invalid API resource' });
  const resultado = await ejecutar('get_modelo_115', { periodo: 'T1' });
  assert.ok(resultado.isError);
  assert.match(resultado.content[0].text, /plugin Modelo115 no está activo o es anterior a la versión 1\.8/);
});

test('los errores propios del endpoint llegan tal cual', async () => {
  respuestas['/modelo111'] = () => respuesta(404, { status: 'error', message: 'exercise-not-found' });
  const resultado = await ejecutar('get_modelo_111', { anio: 1999, periodo: 'T1' });
  assert.ok(resultado.isError);
  assert.match(resultado.content[0].text, /exercise-not-found/);
  assert.doesNotMatch(resultado.content[0].text, /no está activo/);
});

test('el resumen junta los modelos del trimestre y sigue aunque falte un plugin', async () => {
  respuestas['/modelo303'] = { modelo: '303', resultado: 1259.7, resumen: { resultado: 1259.7 }, avisos: [] };
  respuestas['/modelo111'] = { modelo: '111', resultado: 185, avisos: ['aviso 111'] };
  respuestas['/modelo115'] = { modelo: '115', resultado: -15, avisos: [] };
  respuestas['/modelo130'] = { modelo: '130', resultado: 0, avisos: [] };
  respuestas['/modelo349'] = { modelo: '349', resultado: null, avisos: [] };
  respuestas['/modelo369'] = () => respuesta(404, { status: 'error', message: 'Invalid API resource' });

  const resultado = await ejecutar('get_resumen_modelos_fiscales', { idempresa: 1, anio: 2026, periodo: 't1' });
  assert.ok(!resultado.isError, resultado.content[0].text);
  const datos = JSON.parse(resultado.content[0].text);

  assert.equal(datos.periodo, 'T1');
  assert.deepEqual(datos.modelos.map((m) => m.modelo), ['303', '111', '115', '130', '349', '369']);
  assert.equal(datos.total_a_ingresar, 1444.7);
  assert.deepEqual(datos.modelos[1].avisos, ['aviso 111']);
  assert.match(datos.modelos[5].error, /Modelo369/);
  for (const peticion of fs.peticiones) {
    assert.deepEqual(query(peticion), { periodo: 'T1', idempresa: '1', anio: '2026' });
  }
});

test('el resumen anual consulta los endpoints del 390, 190, 180 y 347 y no suma un total a ingresar', async () => {
  respuestas['/modelo390'] = { modelo: '390', resultado: 10 };
  respuestas['/modelo190'] = { modelo: '190', resultado: null };
  respuestas['/modelo180'] = { modelo: '180', resultado: null };
  respuestas['/modelo347'] = { modelo: '347', resultado: null };

  const resultado = await ejecutar('get_resumen_modelos_fiscales', { anio: 2025, periodo: 'ANUAL' });
  const datos = JSON.parse(resultado.content[0].text);
  assert.deepEqual(datos.modelos.map((m) => m.modelo), ['390', '190', '180', '347']);
  assert.deepEqual(datos.modelos.map((m) => m.plugin), ['Modelo303', 'Modelo111', 'Modelo115', 'Modelo347']);
  assert.equal(datos.modelos[0].resultado, 10);
  assert.equal(datos.total_a_ingresar, null);
  assert.match(datos.nota, /declaraciones resumen/);
  assert.deepEqual(
    fs.peticiones.map((p) => new URL(p.path, 'http://x').pathname),
    ['/api/3/modelo390', '/api/3/modelo190', '/api/3/modelo180', '/api/3/modelo347'],
  );
  for (const peticion of fs.peticiones) {
    assert.deepEqual(query(peticion), { periodo: 'ANUAL', anio: '2025' });
  }
});
