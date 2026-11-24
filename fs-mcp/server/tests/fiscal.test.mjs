/**
 * Pruebas de los informes contables y fiscales (cuenta de resultados, balance,
 * IVA del periodo y ventas por zona) y de los documentos de venta pendientes,
 * contra un FacturaScripts de pega en loopback.
 */

process.env.TZ = 'Europe/Madrid';

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

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
const { handleAnalyticsTool } = await import('../build/modules/analytics/index.js');

test.after(async () => {
  await fs.cerrar();
  borrar();
});

test.beforeEach(() => {
  respuestas = {};
  fs.peticiones.length = 0;
});

/** Query de una petición, decodificada. */
function query(req) {
  return Object.fromEntries(new URL(req.url ?? req.path, 'http://x').searchParams);
}

/** Ejecuta una tool de analítica y devuelve su JSON. */
async function llamar(nombre, args = {}) {
  const resultado = await handleAnalyticsTool(nombre, { connection: 'pega', ...args });
  assert.ok(resultado, `la tool ${nombre} no existe`);
  assert.notEqual(resultado.isError, true, resultado.content[0].text);
  return JSON.parse(resultado.content[0].text);
}

/** Plan de cuentas de pega con un asiento de regularización y otro de cierre. */
function contabilidadDePega() {
  respuestas['/subcuentas'] = [
    // los saldos incluyen la regularización (129 contra 6 y 7) y el cierre
    { codsubcuenta: '7000000000', debe: 1000, haber: 1000 },
    { codsubcuenta: '6000000000', debe: 600, haber: 600 },
    { codsubcuenta: '6290000000', debe: 100, haber: 100 },
    { codsubcuenta: '1290000000', debe: 300, haber: 300 },
    { codsubcuenta: '1000000000', debe: 3000, haber: 3000 },
    { codsubcuenta: '5720000000', debe: 3500, haber: 3500 },
    { codsubcuenta: '4300000000', debe: 200, haber: 200 },
    { codsubcuenta: '4000000000', debe: 0, haber: 0 },
    { codsubcuenta: '4750000000', debe: 400, haber: 400 },
  ];
  respuestas['/cuentas'] = [
    { codcuenta: '70', descripcion: 'Ventas' },
    { codcuenta: '700', descripcion: 'Ventas de mercaderías' },
    { codcuenta: '60', descripcion: 'Compras' },
    { codcuenta: '62', descripcion: 'Servicios exteriores' },
  ];
  respuestas['/asientos'] = (req) => {
    const operacion = query(req)['filter[operacion]'];
    if (operacion === 'R') return [{ idasiento: 90, numero: 90, fecha: '31-12-2026', operacion: 'R' }];
    if (operacion === 'C') return [{ idasiento: 91, numero: 91, fecha: '31-12-2026', operacion: 'C' }];
    return [];
  };
  respuestas['/partidas'] = (req) => {
    const idasiento = query(req)['filter[idasiento]'];
    if (idasiento === '90') {
      // regularización: salda 6 y 7 contra la 129 (beneficio 300)
      return [
        { codsubcuenta: '7000000000', debe: 1000, haber: 0 },
        { codsubcuenta: '6000000000', debe: 0, haber: 600 },
        { codsubcuenta: '6290000000', debe: 0, haber: 100 },
        { codsubcuenta: '1290000000', debe: 0, haber: 300 },
      ];
    }
    if (idasiento === '91') {
      // cierre: salda las cuentas de balance
      return [
        { codsubcuenta: '1290000000', debe: 300, haber: 0 },
        { codsubcuenta: '1000000000', debe: 3000, haber: 0 },
        { codsubcuenta: '5720000000', debe: 0, haber: 3500 },
        { codsubcuenta: '4300000000', debe: 0, haber: 200 },
        { codsubcuenta: '4750000000', debe: 400, haber: 0 },
      ];
    }
    return [];
  };
}

test('get_cuenta_resultados descuenta la regularización y el cierre', async () => {
  contabilidadDePega();
  const datos = await llamar('get_cuenta_resultados', { codejercicio: '2026' });
  assert.equal(datos.resumen.ingresos, 1000);
  assert.equal(datos.resumen.gastos, 700);
  assert.equal(datos.resumen.resultado, 300);
  assert.equal(datos.ingresos[0].descripcion, 'Ventas');
  assert.deepEqual(datos.gastos.map((g) => [g.grupo, g.importe]), [['60', 600], ['62', 100]]);
  assert.equal(datos.asientos_excluidos.length, 2);
  const subcuentas = fs.peticiones.find((p) => p.path.includes('/subcuentas'));
  assert.equal(query(subcuentas)['filter[codejercicio]'], '2026');
});

test('get_balance_situacion cuadra activo con patrimonio neto y pasivo', async () => {
  contabilidadDePega();
  const datos = await llamar('get_balance_situacion', { codejercicio: '2026' });
  assert.equal(datos.activo.total, 3700);
  assert.equal(datos.activo.corriente.tesoreria_e_inversiones[0].importe, 3500);
  assert.equal(datos.activo.corriente.deudores[0].importe, 200);
  // capital 3000 + resultado regularizado en la 129 (300)
  assert.equal(datos.patrimonio_neto_y_pasivo.patrimonio_neto.total, 3300);
  assert.equal(datos.patrimonio_neto_y_pasivo.patrimonio_neto.resultado_sin_regularizar, 0);
  assert.equal(datos.patrimonio_neto_y_pasivo.pasivo_corriente.total, 400);
  assert.equal(datos.descuadre, 0);
});

test('get_balance_situacion suma el resultado si el ejercicio no está regularizado', async () => {
  respuestas['/subcuentas'] = [
    { codsubcuenta: '7000000000', debe: 0, haber: 500 },
    { codsubcuenta: '6000000000', debe: 200, haber: 0 },
    { codsubcuenta: '5720000000', debe: 300, haber: 0 },
  ];
  const datos = await llamar('get_balance_situacion', { codejercicio: '2026' });
  assert.equal(datos.patrimonio_neto_y_pasivo.patrimonio_neto.resultado_sin_regularizar, 300);
  assert.equal(datos.descuadre, 0);
});

test('get_cuenta_resultados avisa si el ejercicio no tiene subcuentas', async () => {
  const resultado = await handleAnalyticsTool('get_cuenta_resultados', { connection: 'pega', codejercicio: 'X' });
  assert.equal(resultado.isError, true);
  assert.match(resultado.content[0].text, /no tiene subcuentas/);
});

test('get_impuestos_periodo totaliza las facturas y desglosa por tipo con descuentos globales', async () => {
  respuestas['/facturaclientes'] = [
    { idfactura: 10, neto: 180, totaliva: 37.8, totalrecargo: 0, totalirpf: 0, totalsuplidos: 0, total: 217.8, dtopor1: 10, dtopor2: 0, tasaconv: 1 },
    { idfactura: 11, neto: 100, totaliva: 10, totalrecargo: 0, totalirpf: 15, totalsuplidos: 50, total: 145, dtopor1: 0, dtopor2: 0, tasaconv: 1 },
  ];
  respuestas['/facturaproveedores'] = [
    { idfactura: 7, neto: 50, totaliva: 10.5, totalrecargo: 0, totalirpf: 0, totalsuplidos: 0, total: 60.5, dtopor1: 0, dtopor2: 0, tasaconv: 1 },
  ];
  respuestas['/lineafacturaclientes'] = [
    { idfactura: 10, pvptotal: 200, iva: 21, recargo: 0 },
    { idfactura: 11, pvptotal: 100, iva: 10, recargo: 0 },
    { idfactura: 11, pvptotal: 50, iva: 0, recargo: 0, suplido: true },
    // línea de otra factura dentro del rango de ids: se descarta
    { idfactura: 12, pvptotal: 999, iva: 21, recargo: 0 },
  ];
  respuestas['/lineafacturaproveedores'] = [{ idfactura: 7, pvptotal: 50, iva: 21, recargo: 0 }];

  const datos = await llamar('get_impuestos_periodo', { fecha_desde: '2026-07-01', fecha_hasta: '2026-09-30' });
  assert.equal(datos.repercutido.totales.base, 280);
  assert.equal(datos.repercutido.totales.irpf, 15);
  assert.equal(datos.repercutido.totales.suplidos, 50);
  assert.deepEqual(datos.repercutido.por_tipo.map((t) => [t.iva, t.base, t.cuota_iva]), [[21, 180, 37.8], [10, 100, 10]]);
  assert.equal(datos.repercutido.diferencia_iva_desglose, 0);
  assert.equal(datos.soportado.totales.iva, 10.5);
  assert.equal(datos.liquidacion_orientativa.diferencia, 37.3);
  assert.equal(datos.liquidacion_orientativa.resultado, 'a ingresar');

  const lineas = fs.peticiones.find((p) => p.path.includes('/lineafacturaclientes'));
  assert.equal(query(lineas)['filter[idfactura_gte]'], '10');
  assert.equal(query(lineas)['filter[idfactura_lte]'], '11');
});

test('get_impuestos_periodo exige las fechas', async () => {
  const resultado = await handleAnalyticsTool('get_impuestos_periodo', { connection: 'pega', fecha_desde: '2026-07-01' });
  assert.equal(resultado.isError, true);
  assert.match(resultado.content[0].text, /fecha_hasta/);
});

test('get_ventas_por_zona une provincias sin distinguir mayúsculas ni acentos', async () => {
  respuestas['/facturaclientes'] = [
    { codcliente: 'A', provincia: 'Málaga', neto: 100, total: 121, tasaconv: 1 },
    { codcliente: 'B', provincia: 'MALAGA', neto: 50, total: 60.5, tasaconv: 1 },
    { codcliente: 'A', provincia: 'Málaga', neto: 50, total: 60.5, tasaconv: 1 },
    { codcliente: 'C', provincia: '', neto: 100, total: 121, tasaconv: 2 },
  ];
  const datos = await llamar('get_ventas_por_zona', { fecha_desde: '2026-01-01', fecha_hasta: '2026-12-31' });
  assert.equal(datos.zonas[0].zona, 'Málaga');
  assert.equal(datos.zonas[0].facturas, 3);
  assert.equal(datos.zonas[0].clientes, 2);
  assert.equal(datos.zonas[0].neto, 200);
  // la factura en otra divisa se convierte con su tasa
  assert.equal(datos.zonas[1].zona, '(sin datos)');
  assert.equal(datos.zonas[1].neto, 50);
  assert.equal(datos.resumen.neto, 250);
});

test('los documentos pendientes devuelven el neto y filtran por cliente', async () => {
  respuestas['/albaranclientes'] = [
    { idalbaran: 1, codcliente: 'A', fecha: '01-01-2026', neto: 100, total: 121 },
    { idalbaran: 2, codcliente: 'A', fecha: '02-01-2026', neto: 50.5, total: 61.1 },
  ];
  const datos = await llamar('get_albaranes_pendientes_facturar', { codcliente: 'A' });
  assert.equal(datos.netoPendienteFacturar, 150.5);
  assert.equal(datos.detalle[0].neto, 100);
  const peticion = fs.peticiones.find((p) => p.path.includes('/albaranclientes'));
  assert.equal(query(peticion)['filter[codcliente]'], 'A');
  assert.equal(query(peticion)['filter[editable]'], '1');

  respuestas['/pedidoclientes'] = [{ idpedido: 3, codcliente: 'B', fecha: '01-01-2026', neto: 10, total: 12.1 }];
  const pedidos = await llamar('get_pedidos_pendientes_servir');
  assert.equal(pedidos.netoAcumulado, 10);

  respuestas['/presupuestoclientes'] = [{ idpresupuesto: 4, codcliente: 'B', fecha: '01-01-2026', neto: 20, total: 24.2 }];
  const presupuestos = await llamar('get_presupuestos_pendientes');
  assert.equal(presupuestos.netoAcumulado, 20);
});

test('get_facturas_con_errores no marca las rectificativas por tener importes negativos', async () => {
  respuestas['/facturaclientes'] = [
    // correcta con retención: el total es menor que la base y no es un error
    { idfactura: 1, neto: 100, totaliva: 0, totalrecargo: 0, totalirpf: 15, totalsuplidos: 0, total: 85, totalbeneficio: 10 },
    // rectificativa correcta
    { idfactura: 2, idfacturarect: 1, neto: -100, totaliva: -21, totalrecargo: 0, totalirpf: 0, totalsuplidos: 0, total: -121, totalbeneficio: -10 },
    // negativa sin ser rectificativa
    { idfactura: 3, neto: -50, totaliva: -10.5, totalrecargo: 0, totalirpf: 0, totalsuplidos: 0, total: -60.5, totalbeneficio: 0 },
    // total que no cuadra
    { idfactura: 4, neto: 100, totaliva: 21, totalrecargo: 0, totalirpf: 0, totalsuplidos: 0, total: 150, totalbeneficio: 5 },
  ];
  const datos = await llamar('get_facturas_con_errores');
  assert.deepEqual(datos.map((f) => f.idfactura), [3, 4]);
  assert.match(datos[0].error, /negativo sin ser rectificativa/);
  assert.match(datos[1].error, /no cuadra/);
});

test('get_clientes_perdidos solo cuenta clientes activos que compraron alguna vez', async () => {
  const hace = (meses) => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - meses);
    return `${String(fecha.getDate()).padStart(2, '0')}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${fecha.getFullYear()}`;
  };
  respuestas['/clientes'] = [
    { codcliente: 'A', nombre: 'Antiguo' },
    { codcliente: 'B', nombre: 'Reciente' },
    { codcliente: 'C', nombre: 'Nunca' },
    { codcliente: 'D', nombre: 'De baja', debaja: true },
  ];
  respuestas['/facturaclientes'] = [
    { codcliente: 'A', fecha: hace(20) },
    { codcliente: 'A', fecha: hace(15) },
    { codcliente: 'B', fecha: hace(2) },
    { codcliente: 'D', fecha: hace(30) },
  ];
  const datos = await llamar('get_clientes_perdidos', { meses: 12 });
  assert.deepEqual(datos.map((c) => c.codcliente), ['A']);
  assert.equal(datos[0].ultimaCompra, hace(15));
});

test('un asiento R sin la cuenta 129 es un ajuste y no se descuenta', async () => {
  respuestas['/subcuentas'] = [
    { codsubcuenta: '7000000000', debe: 0, haber: 500 },
    { codsubcuenta: '6290000000', debe: 80, haber: 0 },
    { codsubcuenta: '5720000000', debe: 420, haber: 0 },
  ];
  respuestas['/asientos'] = (req) => (query(req)['filter[operacion]'] === 'R'
    ? [{ idasiento: 5, numero: 5, fecha: '10-06-2026', operacion: 'R', concepto: 'Ajuste manual' }]
    : []);
  respuestas['/partidas'] = [
    { codsubcuenta: '6290000000', debe: 80, haber: 0 },
    { codsubcuenta: '5720000000', debe: 0, haber: 80 },
  ];
  const datos = await llamar('get_cuenta_resultados', { codejercicio: '2026' });
  assert.equal(datos.resumen.gastos, 80);
  assert.equal(datos.resumen.resultado, 420);
  assert.equal(datos.asientos_excluidos.length, 0);
  assert.equal(datos.asientos_r_incluidos[0].concepto, 'Ajuste manual');
});

test('get_impuestos_periodo avisa si suma facturas de varias empresas y filtra por idempresa', async () => {
  respuestas['/facturaclientes'] = [
    { idfactura: 1, idempresa: 1, neto: 100, totaliva: 21, total: 121, tasaconv: 1 },
    { idfactura: 2, idempresa: 2, neto: 100, totaliva: 21, total: 121, tasaconv: 1 },
  ];
  const datos = await llamar('get_impuestos_periodo', { fecha_desde: '2026-01-01', fecha_hasta: '2026-03-31', desglose: false });
  assert.match(datos.aviso, /2 empresas/);

  fs.peticiones.length = 0;
  const filtrado = await llamar('get_impuestos_periodo', { fecha_desde: '2026-01-01', fecha_hasta: '2026-03-31', desglose: false, idempresa: 1 });
  const peticion = fs.peticiones.find((p) => p.path.includes('/facturaclientes'));
  assert.equal(query(peticion)['filter[idempresa]'], '1');
  assert.equal(filtrado.aviso, undefined);
});

test('get_clientes_sin_compras devuelve solo los datos de contacto de los clientes sin facturas', async () => {
  respuestas['/clientes'] = [
    { codcliente: 'A', nombre: 'Con compras', observaciones: 'x' },
    { codcliente: 'B', nombre: 'Sin compras', email: 'b@ejemplo.test', observaciones: 'texto largo', fechaalta: '01-01-2026' },
  ];
  respuestas['/facturaclientes'] = [{ codcliente: 'A', fecha: '01-02-2026' }];
  const datos = await llamar('get_clientes_sin_compras');
  assert.deepEqual(datos.map((c) => c.codcliente), ['B']);
  assert.equal(datos[0].email, 'b@ejemplo.test');
  assert.equal(datos[0].observaciones, undefined);
});
