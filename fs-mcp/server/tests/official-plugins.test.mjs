/**
 * Pruebas de los plugins oficiales (Servicios y Proyectos) contra un
 * FacturaScripts de pega en loopback: registro de tools, peticiones que llegan
 * a la API y cálculos de los informes.
 */

process.env.TZ = 'Europe/Madrid';

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, respuesta, usarConexiones } from './fake-fs.mjs';

/** Respuestas por ruta (sin query) y método; se cambian en cada prueba. */
let respuestas = {};

const fs = await arrancarFsDePega((req) => {
  const ruta = new URL(req.url, 'http://x').pathname.replace(/^\/api\/3/, '');
  const valor = respuestas[`${req.method} ${ruta}`] ?? respuestas[ruta];
  return typeof valor === 'function' ? valor(req) : valor ?? [];
});
const borrar = usarConexiones({
  default: 'pega',
  connections: { pega: { name: 'Pega', url: fs.url, token: 't' } },
});

const { OFFICIAL_PLUGINS, registerOfficialPluginTools, handleOfficialPluginTool } = await import('../build/plugins/index.js');
const { addDateRangeParams } = await import('../build/metadata/dateRange.js');
const { enrichAllTools, resolveModelFromToolName } = await import('../build/metadata/enrich.js');
const { parseFilterString, parseOrder, findByName } = await import('../build/plugins/shared/query.js');
const { isMissingResource } = await import('../build/plugins/shared/result.js');

const tools = new Map();
registerOfficialPluginTools(tools);
enrichAllTools(tools);
addDateRangeParams(tools);

test.after(async () => {
  await fs.cerrar();
  borrar();
});

test.beforeEach(() => {
  respuestas = {};
  fs.peticiones.length = 0;
});

/** Ejecuta una tool y devuelve el JSON de su resultado. */
async function llamar(nombre, args = {}) {
  const resultado = await handleOfficialPluginTool(nombre, { connection: 'pega', ...args });
  assert.ok(resultado, `la tool ${nombre} no existe`);
  assert.ok(!resultado.isError, resultado.content[0].text);
  return JSON.parse(resultado.content[0].text);
}

/** Query de una petición registrada, decodificada. */
function query(peticion) {
  return Object.fromEntries(new URL(peticion.path, 'http://x').searchParams);
}

test('cada plugin registra tools únicas, con modelo en la metadata y obligatorios declarados', () => {
  const nombres = OFFICIAL_PLUGINS.flatMap((p) => p.tools.map((t) => t.name));
  assert.equal(new Set(nombres).size, nombres.length, 'hay tools repetidas');

  for (const plugin of OFFICIAL_PLUGINS) {
    for (const [tool, modelo] of Object.entries(plugin.toolModels)) {
      assert.equal(resolveModelFromToolName(tool)?.name, modelo, `${tool} no resuelve a ${modelo}`);
    }
    for (const tool of plugin.tools) {
      for (const campo of tool.inputSchema.required ?? []) {
        assert.ok(tool.inputSchema.properties[campo], `${tool.name}: falta la propiedad obligatoria ${campo}`);
      }
    }
  }
});

test('los listados de los plugins reciben los filtros de rango de sus columnas de fecha', () => {
  const props = tools.get('get_servicios_at').inputSchema.properties;
  assert.ok(props.fecha_gte && props.fecha_lte);
  // la ficha no es un listado: no debe anunciar rangos que no reenvía
  assert.equal(tools.get('get_servicio_at').inputSchema.properties.fecha_gte, undefined);
});

test('get_servicios_at reenvía filtros, búsqueda, rango de fechas y orden', async () => {
  await llamar('get_servicios_at', {
    codcliente: 'CLI1',
    editable: true,
    descripcion_like: 'pantalla',
    fecha_gte: '2026-01-01',
    filter: 'neto_gt:100,asignado_null:',
    order: 'neto:desc',
    limit: 10,
  });
  const q = query(fs.peticiones[0]);
  assert.equal(new URL(fs.peticiones[0].path, 'http://x').pathname, '/api/3/servicioates');
  assert.equal(q['filter[codcliente]'], 'CLI1');
  assert.equal(q['filter[editable]'], '1');
  assert.equal(q['filter[descripcion_like]'], 'pantalla');
  assert.equal(q['filter[fecha_gte]'], '2026-01-01');
  assert.equal(q['filter[neto_gt]'], '100');
  assert.equal(q['filter[asignado_null]'], '1');
  assert.equal(q['sort[neto]'], 'DESC');
  assert.equal(q.limit, '10');
});

test('get_servicios_at ordena por fecha descendente si no se indica orden', async () => {
  await llamar('get_servicios_at');
  const q = query(fs.peticiones[0]);
  assert.equal(q['sort[fecha]'], 'DESC');
  assert.equal(q['sort[idservicio]'], 'DESC');
});

test('create_tarea_proyecto envía la cantidad por defecto y solo los campos del modelo', async () => {
  respuestas['POST /tareaproyectos'] = { ok: 'guardado', data: { idtarea: 1 } };
  await llamar('create_tarea_proyecto', { idproyecto: 3, nombre: 'Montaje', inventado: 'x' });
  const body = new URLSearchParams(fs.peticiones[0].body);
  assert.equal(fs.peticiones[0].method, 'POST');
  assert.equal(body.get('cantidad'), '1');
  assert.equal(body.get('idproyecto'), '3');
  assert.equal(body.get('nombre'), 'Montaje');
  assert.equal(body.get('inventado'), null);
  assert.equal(body.get('connection'), null);
});

test('update_servicio_at vacía los campos de clear_fields enviando «null»', async () => {
  await llamar('update_servicio_at', { idservicio: 7, observaciones: 'ok', clear_fields: ['asignado'] });
  const peticion = fs.peticiones[0];
  assert.equal(peticion.method, 'PUT');
  assert.equal(new URL(peticion.path, 'http://x').pathname, '/api/3/servicioates/7');
  const body = new URLSearchParams(peticion.body);
  assert.equal(body.get('asignado'), 'null');
  assert.equal(body.get('observaciones'), 'ok');
  assert.equal(body.get('idservicio'), null);
});

test('update_servicio_at rechaza vaciar un campo que no se puede escribir', async () => {
  const resultado = await handleOfficialPluginTool('update_servicio_at', { connection: 'pega', idservicio: 7, clear_fields: ['neto'] });
  assert.ok(resultado.isError);
  assert.equal(fs.peticiones.length, 0);
});

test('si la instalación no tiene el plugin, el error lo dice', async () => {
  respuestas['/proyectos'] = () => respuesta(404, { status: 'error', message: 'Invalid API resource' });
  const resultado = await handleOfficialPluginTool('get_proyectos', { connection: 'pega' });
  assert.ok(resultado.isError);
  assert.match(resultado.content[0].text, /plugin Proyectos está instalado y activo/);
  assert.ok(isMissingResource('Error en FacturaScripts (Pega, HTTP 404): Recurso de API no válido'));
  assert.ok(!isMissingResource('Error en FacturaScripts (Pega, HTTP 404): Registro no encontrado'));
});

test('set_estado_servicio_at busca el estado por nombre sin distinguir acentos ni mayúsculas', async () => {
  respuestas['/estadoates'] = [
    { id: 1, nombre: 'Pendiente', editable: true },
    { id: 4, nombre: 'Terminado', editable: false },
  ];
  respuestas['PUT /servicioates/9'] = { ok: 'guardado', data: { idservicio: 9, idestado: 4 } };
  const datos = await llamar('set_estado_servicio_at', { idservicio: 9, estado: 'terminado' });
  assert.equal(datos.estado.id, 4);
  const put = fs.peticiones.find((p) => p.method === 'PUT');
  assert.equal(new URLSearchParams(put.body).get('idestado'), '4');
});

test('set_fase_tarea_proyecto falla si el nombre de la fase es ambiguo', async () => {
  respuestas['/fasetareas'] = [
    { idfase: 1, nombre: 'En curso A' },
    { idfase: 2, nombre: 'En curso B' },
  ];
  const resultado = await handleOfficialPluginTool('set_fase_tarea_proyecto', { connection: 'pega', idtarea: 5, fase: 'en curso' });
  assert.ok(resultado.isError);
  assert.match(resultado.content[0].text, /varios/);
  assert.ok(!fs.peticiones.some((p) => p.method === 'PUT'));
});

test('get_trabajos_at_pendientes agrupa por servicio y acción con precio × cantidad', async () => {
  respuestas['/trabajoates'] = (req) => {
    const estado = new URL(req.url, 'http://x').searchParams.get('filter[estado]');
    if (estado === '1') return [
      { idtrabajo: 1, idservicio: 10, estado: 1, precio: 20, cantidad: 2 },
      { idtrabajo: 2, idservicio: 11, estado: 1, precio: 5, cantidad: 1 },
    ];
    if (estado === '3') return [{ idtrabajo: 3, idservicio: 10, estado: 3, precio: 10, cantidad: 3 }];
    return [];
  };
  respuestas['/servicioates/10'] = { idservicio: 10, codigo: 'SER-10', codcliente: 'A', editable: true };
  respuestas['/servicioates/11'] = { idservicio: 11, codigo: 'SER-11', codcliente: 'B', editable: false };

  const datos = await llamar('get_trabajos_at_pendientes');
  assert.equal(datos.resumen.importe, 75);
  assert.equal(datos.resumen.por_accion['hacer factura'].importe, 45);
  assert.equal(datos.resumen.por_accion['hacer albarán'].importe, 30);
  assert.equal(datos.servicios[0].codigo, 'SER-10');
  assert.equal(datos.servicios[0].importe, 70);

  const soloB = await llamar('get_trabajos_at_pendientes', { codcliente: 'B', accion: 'factura' });
  assert.equal(soloB.resumen.servicios, 1);
  assert.equal(soloB.resumen.importe, 5);
});

test('get_horas_trabajos_at suma horas por usuario y cuenta los trabajos sin hora de fin', async () => {
  respuestas['/trabajoates'] = [
    { idtrabajo: 1, idservicio: 1, nick: 'ana', fechainicio: '02-03-2026', horainicio: '09:00:00', fechafin: null, horafin: '11:30:00', precio: 10, cantidad: 1 },
    { idtrabajo: 2, idservicio: 2, nick: 'ana', fechainicio: '02-03-2026', horainicio: '22:00:00', fechafin: '03-03-2026', horafin: '01:00:00', precio: 0, cantidad: 1 },
    { idtrabajo: 3, idservicio: 2, nick: 'luis', fechainicio: '04-03-2026', horainicio: '10:00:00', fechafin: null, horafin: null, precio: 0, cantidad: 1 },
  ];
  const datos = await llamar('get_horas_trabajos_at', { fecha_desde: '2026-03-01', fecha_hasta: '2026-03-31' });
  const q = query(fs.peticiones[0]);
  assert.equal(q['filter[fechainicio_gte]'], '2026-03-01');
  assert.equal(q['filter[fechainicio_lte]'], '2026-03-31');
  const ana = datos.por_usuario.find((u) => u.nick === 'ana');
  assert.equal(ana.horas, 5.5);
  assert.equal(ana.servicios, 2);
  assert.equal(datos.resumen.sin_hora_fin, 1);
});

test('get_tareas_proyecto_vencidas descarta las completadas y canceladas y calcula el retraso', async () => {
  respuestas['/fasetareas'] = [
    { idfase: 1, nombre: 'Pendiente', tipo: null },
    { idfase: 2, nombre: 'Hecha', tipo: 0 },
    { idfase: 3, nombre: 'Cancelada', tipo: 1 },
  ];
  respuestas['/proyectos/8'] = { idproyecto: 8, nombre: 'Web' };
  respuestas['/tareaproyectos'] = [
    { idtarea: 1, idproyecto: 8, idfase: 1, nombre: 'A', nick: 'ana', fechafin: '10-03-2026' },
    { idtarea: 2, idproyecto: 8, idfase: 2, nombre: 'B', fechafin: '01-03-2026' },
    { idtarea: 3, idproyecto: 8, idfase: 3, nombre: 'C', fechafin: '01-03-2026' },
    { idtarea: 4, idproyecto: 8, idfase: 1, nombre: 'D', fechafin: '01-03-2026' },
  ];
  const datos = await llamar('get_tareas_proyecto_vencidas', { fecha_referencia: '2026-03-15' });
  const peticion = fs.peticiones.find((p) => p.path.includes('/tareaproyectos'));
  assert.equal(query(peticion)['filter[fechafin_lt]'], '2026-03-15');
  assert.deepEqual(datos.tareas.map((t) => [t.idtarea, t.dias_retraso]), [[4, 14], [1, 5]]);
  assert.equal(datos.tareas[0].proyecto, 'Web');
  assert.equal(datos.resumen.vencidas, 2);
});

test('get_rentabilidad_proyectos calcula el margen y ordena por el criterio pedido', async () => {
  respuestas['/estadoproyectos'] = [{ idestado: 1, nombre: 'Abierto' }];
  respuestas['/proyectos'] = [
    { idproyecto: 1, nombre: 'A', idestado: 1, editable: true, totalventas: 1000, totalcompras: 900, totalpendientefacturar: 0 },
    { idproyecto: 2, nombre: 'B', idestado: 1, editable: true, totalventas: 500, totalcompras: 100, totalpendientefacturar: 50 },
    { idproyecto: 3, nombre: 'C', idestado: 1, editable: false, totalventas: 0, totalcompras: 0, totalpendientefacturar: 0 },
  ];
  const datos = await llamar('get_rentabilidad_proyectos', { solo_con_movimientos: true });
  assert.deepEqual(datos.proyectos.map((p) => p.idproyecto), [2, 1]);
  assert.equal(datos.proyectos[0].margen_pct, 80);
  assert.equal(datos.totales.margen, 500);
  assert.equal(datos.totales.proyectos, 2);

  const porVentas = await llamar('get_rentabilidad_proyectos', { orden: 'ventas' });
  assert.deepEqual(porVentas.proyectos.map((p) => p.idproyecto), [1, 2, 3]);
});

test('set_proyecto_documento comprueba el proyecto y desvincula con «null»', async () => {
  respuestas['/proyectos/4'] = { idproyecto: 4 };
  await llamar('set_proyecto_documento', { tipo: 'factura_cliente', id: 12, idproyecto: 4 });
  const put = fs.peticiones.find((p) => p.method === 'PUT');
  assert.equal(new URL(put.path, 'http://x').pathname, '/api/3/facturaclientes/12');
  assert.equal(new URLSearchParams(put.body).get('idproyecto'), '4');

  fs.peticiones.length = 0;
  await llamar('set_proyecto_documento', { tipo: 'albaran_proveedor', id: 3, desvincular: true });
  assert.equal(fs.peticiones.length, 1);
  assert.equal(new URLSearchParams(fs.peticiones[0].body).get('idproyecto'), 'null');
});

test('get_proyecto omite los servicios SAT si el plugin Servicios no está activo', async () => {
  respuestas['/proyectos/2'] = { idproyecto: 2, nombre: 'Obra', idestado: 1, editable: true, totalventas: 100, totalcompras: 40 };
  respuestas['/servicioates'] = () => respuesta(404, { status: 'error', message: 'Invalid API resource' });
  respuestas['/tareaproyectos'] = [{ idtarea: 1, idproyecto: 2, idfase: 1, fechafin: '01-01-2020' }];
  respuestas['/fasetareas'] = [{ idfase: 1, nombre: 'Pendiente', tipo: null }];
  const datos = await llamar('get_proyecto', { idproyecto: 2 });
  assert.equal(datos.servicios_sat, undefined);
  assert.equal(datos.economia.margen, 60);
  assert.equal(datos.resumen_tareas.vencidas, 1);
  assert.equal(datos.documentos.length, 8);
});

test('parseFilterString y parseOrder validan los nombres de campo', () => {
  assert.deepEqual(parseFilterString('a:1, b_like:x:y'), { a: '1', b_like: 'x:y' });
  assert.throws(() => parseFilterString('a b:1'));
  assert.throws(() => parseFilterString('a:'));
  assert.deepEqual(parseOrder('fecha:desc,id'), { 'sort[fecha]': 'DESC', 'sort[id]': 'ASC' });
  assert.throws(() => parseOrder('fecha:abajo'));
  assert.equal(findByName([{ n: 'Reparación' }, { n: 'Instalación' }], 'n', 'reparacion').n, 'Reparación');
});

test('create_presupuesto_oportunidad_crm exige que el contacto tenga cliente', async () => {
  respuestas['/crmoportunidades/5'] = { id: 5, idcontacto: 9, idpresupuesto: null };
  respuestas['/contactos/9'] = { idcontacto: 9, nombre: 'Ana', codcliente: null };
  const resultado = await handleOfficialPluginTool('create_presupuesto_oportunidad_crm', { connection: 'pega', id: 5 });
  assert.ok(resultado.isError);
  assert.match(resultado.content[0].text, /no tiene un cliente/);
  assert.ok(!fs.peticiones.some((p) => p.method === 'POST'));
});

test('create_presupuesto_oportunidad_crm crea el presupuesto y lo vincula con su neto', async () => {
  respuestas['/crmoportunidades/5'] = { id: 5, idcontacto: 9, idpresupuesto: null, codagente: 'AG1' };
  respuestas['/contactos/9'] = { idcontacto: 9, nombre: 'Ana', codcliente: 'CLI9' };
  respuestas['POST /crearPresupuestoCliente'] = {
    doc: { idpresupuesto: 77, codigo: 'PRE77', codcliente: 'CLI9', neto: 200, total: 242, coddivisa: 'USD', tasaconv: 2 },
  };
  const lineas = [{ descripcion: 'Instalación', cantidad: 2, pvpunitario: 100 }];
  const datos = await llamar('create_presupuesto_oportunidad_crm', { id: 5, lineas, codserie: 'A' });
  assert.equal(datos.presupuesto.idpresupuesto, 77);

  const post = new URLSearchParams(fs.peticiones.find((p) => p.method === 'POST').body);
  assert.equal(post.get('codcliente'), 'CLI9');
  assert.equal(post.get('codagente'), 'AG1');
  assert.equal(post.get('codserie'), 'A');
  assert.deepEqual(JSON.parse(post.get('lineas')), lineas);

  const put = fs.peticiones.find((p) => p.method === 'PUT');
  assert.equal(new URL(put.path, 'http://x').pathname, '/api/3/crmoportunidades/5');
  const body = new URLSearchParams(put.body);
  assert.equal(body.get('idpresupuesto'), '77');
  assert.equal(body.get('neto'), '200');
  assert.equal(body.get('netoeuros'), '100');
  assert.equal(body.get('coddivisa'), 'USD');
});

test('set_presupuesto_oportunidad_crm no vincula un presupuesto que ya tiene otra oportunidad', async () => {
  respuestas['/crmoportunidades/5'] = { id: 5, idpresupuesto: null };
  respuestas['/presupuestoclientes/12'] = { idpresupuesto: 12, codigo: 'PRE12', neto: 10, tasaconv: 1 };
  respuestas['/crmoportunidades'] = [{ id: 3, idpresupuesto: 12 }];
  const resultado = await handleOfficialPluginTool('set_presupuesto_oportunidad_crm', { connection: 'pega', id: 5, idpresupuesto: 12 });
  assert.ok(resultado.isError);
  assert.match(resultado.content[0].text, /oportunidad 3/);
  assert.ok(!fs.peticiones.some((p) => p.method === 'PUT'));
});

test('get_informe_oportunidades_crm clasifica, calcula la conversión y ordena el embudo', async () => {
  respuestas['/crmoportunidadestados'] = [
    { id: 1, nombre: 'Nueva', orden: 10 },
    { id: 2, nombre: 'Ganada', orden: 90 },
    { id: 3, nombre: 'Perdida', orden: 99 },
  ];
  respuestas['/crmoportunidades'] = [
    { id: 1, idestado: 2, editable: false, rechazado: false, idpresupuesto: 4, netoeuros: 300, precio_aprox: 50, fecha: '01-02-2026', fecha_cierre: '11-02-2026' },
    { id: 2, idestado: 3, editable: false, rechazado: true, idpresupuesto: null, precio_aprox: 100, fecha: '01-02-2026', fecha_cierre: '05-02-2026' },
    { id: 3, idestado: 3, editable: false, rechazado: true, idpresupuesto: null, precio_aprox: 0, fecha: '01-03-2026', fecha_cierre: '01-03-2026' },
    { id: 4, idestado: 1, editable: true, rechazado: false, idpresupuesto: null, precio_aprox: 40, fecha: '02-03-2026' },
  ];
  const datos = await llamar('get_informe_oportunidades_crm', { fecha_desde: '2026-01-01' });
  assert.equal(datos.resumen.ganadas, 1);
  assert.equal(datos.resumen.perdidas, 2);
  assert.equal(datos.resumen.abiertas, 1);
  assert.equal(datos.resumen.importe_ganado, 300);
  assert.equal(datos.resumen.importe, 440);
  assert.equal(datos.resumen.conversion_pct, 33.33);
  assert.equal(datos.resumen.dias_medios_hasta_cierre, 4.67);
  assert.deepEqual(datos.embudo_por_estado.map((e) => e.estado), ['Nueva', 'Ganada', 'Perdida']);
  const q = query(fs.peticiones.find((p) => p.path.startsWith('/api/3/crmoportunidades?')));
  assert.equal(q['filter[fecha_gte]'], '2026-01-01');
});

test('get_avisos_crm pide los avisos sin notificar hasta la fecha indicada', async () => {
  respuestas['/crmnotas'] = [{ id: 1, fechaaviso: '01-01-2020', idcontacto: 4, observaciones: 'Llamar' }];
  respuestas['/contactos/4'] = { idcontacto: 4, nombre: 'Luis', apellidos: 'Pérez' };
  const datos = await llamar('get_avisos_crm', { fecha_hasta: '2026-12-31', nick: 'ana' });
  const q = query(fs.peticiones.find((p) => p.path.startsWith('/api/3/crmnotas')));
  assert.equal(q['filter[fechaaviso_lte]'], '2026-12-31');
  assert.equal(q['filter[fechaaviso_notnull]'], '1');
  assert.equal(q['filter[fecha_notificado_null]'], '1');
  assert.equal(q['filter[nick]'], 'ana');
  assert.equal(datos.avisos[0].contacto, 'Luis Pérez');
  assert.equal(datos.avisos[0].vencido, true);
});

test('create_archivo_oportunidad_crm sube el archivo y lo relaciona con la oportunidad', async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { tmpdir } = await import('node:os');
  const dir = mkdtempSync(join(tmpdir(), 'fs-mcp-archivo-'));
  const ruta = join(dir, 'oferta.txt');
  writeFileSync(ruta, 'contenido de prueba');
  try {
    respuestas['/crmoportunidades/6'] = { id: 6 };
    respuestas['POST /uploadFiles'] = { files: [{ idfile: 31, filename: 'oferta.txt', size: 19 }] };
    respuestas['POST /attachedfilerelations'] = { ok: 'guardado', data: { id: 8 } };
    const datos = await llamar('create_archivo_oportunidad_crm', { id: 6, ruta, nick: 'ana' });
    assert.equal(datos.archivo.idfile, 31);

    const subida = fs.peticiones.find((p) => p.path === '/api/3/uploadFiles');
    assert.match(subida.headers['content-type'], /^multipart\/form-data; boundary=/);
    assert.match(subida.body, /name="files\[\]"; filename="oferta.txt"/);
    assert.match(subida.body, /contenido de prueba/);

    const relacion = new URLSearchParams(fs.peticiones.find((p) => p.path === '/api/3/attachedfilerelations').body);
    assert.equal(relacion.get('idfile'), '31');
    assert.equal(relacion.get('model'), 'CrmOportunidad');
    assert.equal(relacion.get('modelid'), '6');
    assert.equal(relacion.get('nick'), 'ana');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('create_archivo_oportunidad_crm rechaza rutas relativas sin llamar a la API', async () => {
  const resultado = await handleOfficialPluginTool('create_archivo_oportunidad_crm', { connection: 'pega', id: 6, ruta: 'oferta.pdf' });
  assert.ok(resultado.isError);
  assert.equal(fs.peticiones.length, 0);
});

test('create_archivo_oportunidad_crm no lee archivos ocultos ni llama a la API', async () => {
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { tmpdir } = await import('node:os');
  const dir = mkdtempSync(join(tmpdir(), 'fs-mcp-archivo-'));
  mkdirSync(join(dir, '.ssh'));
  const ruta = join(dir, '.ssh', 'config');
  writeFileSync(ruta, 'secreto');
  try {
    const resultado = await handleOfficialPluginTool('create_archivo_oportunidad_crm', { connection: 'pega', id: 6, ruta });
    assert.ok(resultado.isError);
    assert.match(resultado.content[0].text, /oculto/);
    assert.equal(fs.peticiones.length, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

/**
 * Nombre del recurso de la API para una clase de modelo, con la misma regla que
 * APIModel::pluralize() del core.
 */
function pluralizar(clase) {
  const texto = clase.toLowerCase();
  if (clase.endsWith('s')) return texto;
  if (clase.endsWith('ser') || clase.endsWith('tion')) return `${texto}s`;
  if (['a', 'e', 'i', 'o', 'u', 'k'].includes(clase.slice(-1))) return `${texto}s`;
  return `${texto}es`;
}

test('el endpoint de cada modelo de los plugins oficiales es el que publica la API', () => {
  const clases = {
    servicio_at: 'ServicioAT', trabajo_at: 'TrabajoAT', estado_at: 'EstadoAT', prioridad_at: 'PrioridadAT',
    tipo_at: 'TipoAT', maquina_at: 'MaquinaAT', categoria_at: 'CategoriaAT', check_at: 'CheckAT',
    servicio_categoria_at: 'ServicioCategoriaAT', servicio_check_at: 'ServicioCheckAT', servicio_at_log: 'ServicioATLog',
    proyecto: 'Proyecto', tarea_proyecto: 'TareaProyecto', fase_tarea: 'FaseTarea', estado_proyecto: 'EstadoProyecto',
    nota_proyecto: 'NotaProyecto', user_proyecto: 'UserProyecto', stock_proyecto: 'StockProyecto',
    crm_oportunidad: 'CrmOportunidad', crm_oportunidad_estado: 'CrmOportunidadEstado', crm_nota: 'CrmNota',
    crm_fuente: 'CrmFuente', crm_interes: 'CrmInteres', crm_interes_contacto: 'CrmInteresContacto', crm_lista: 'CrmLista',
    crm_lista_contacto: 'CrmListaContacto', crm_position: 'CrmPosition', crm_campaign: 'CrmCampaign',
  };
  const modelos = OFFICIAL_PLUGINS.flatMap((p) => p.models);
  assert.deepEqual(modelos.map((m) => m.name).sort(), Object.keys(clases).sort());
  for (const meta of modelos) {
    assert.equal(meta.endpoint, `/${pluralizar(clases[meta.name])}`, meta.name);
  }
});
