// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from './types.js';

import agenciaTransporteMetadata from './models/agencia_transporte.js';
import agenteMetadata from './models/agente.js';
import albaranClienteMetadata from './models/albaran_cliente.js';
import albaranProveedorMetadata from './models/albaran_proveedor.js';
import almacenMetadata from './models/almacen.js';
import apiAccessMetadata from './models/api_access.js';
import apiKeyMetadata from './models/api_key.js';
import asientoMetadata from './models/asiento.js';
import atributoMetadata from './models/atributo.js';
import atributoValorMetadata from './models/atributo_valor.js';
import attachedFileMetadata from './models/attached_file.js';
import attachedFileRelationMetadata from './models/attached_file_relation.js';
import ciudadMetadata from './models/ciudad.js';
import clienteMetadata from './models/cliente.js';
import codigoPostalMetadata from './models/codigo_postal.js';
import conceptoPartidaMetadata from './models/concepto_partida.js';
import contactoMetadata from './models/contacto.js';
import cronJobMetadata from './models/cron_job.js';
import cuentaMetadata from './models/cuenta.js';
import cuentaBancoMetadata from './models/cuenta_banco.js';
import cuentaBancoClienteMetadata from './models/cuenta_banco_cliente.js';
import cuentaBancoProveedorMetadata from './models/cuenta_banco_proveedor.js';
import cuentaEspecialMetadata from './models/cuenta_especial.js';
import diarioMetadata from './models/diario.js';
import divisaMetadata from './models/divisa.js';
import docTransformationMetadata from './models/doc_transformation.js';
import ejercicioMetadata from './models/ejercicio.js';
import emailNotificationMetadata from './models/email_notification.js';
import emailSentMetadata from './models/email_sent.js';
import empresaMetadata from './models/empresa.js';
import estadoDocumentoMetadata from './models/estado_documento.js';
import fabricanteMetadata from './models/fabricante.js';
import facturaClienteMetadata from './models/factura_cliente.js';
import facturaProveedorMetadata from './models/factura_proveedor.js';
import familiaMetadata from './models/familia.js';
import formaPagoMetadata from './models/forma_pago.js';
import formatoDocumentoMetadata from './models/formato_documento.js';
import grupoClientesMetadata from './models/grupo_clientes.js';
import identificadorFiscalMetadata from './models/identificador_fiscal.js';
import impuestoMetadata from './models/impuesto.js';
import impuestoZonaMetadata from './models/impuesto_zona.js';
import lineaAlbaranClienteMetadata from './models/linea_albaran_cliente.js';
import lineaAlbaranProveedorMetadata from './models/linea_albaran_proveedor.js';
import lineaFacturaClienteMetadata from './models/linea_factura_cliente.js';
import lineaFacturaProveedorMetadata from './models/linea_factura_proveedor.js';
import lineaPedidoClienteMetadata from './models/linea_pedido_cliente.js';
import lineaPedidoProveedorMetadata from './models/linea_pedido_proveedor.js';
import lineaPresupuestoClienteMetadata from './models/linea_presupuesto_cliente.js';
import lineaPresupuestoProveedorMetadata from './models/linea_presupuesto_proveedor.js';
import logMessageMetadata from './models/log_message.js';
import pageMetadata from './models/page.js';
import pageFilterMetadata from './models/page_filter.js';
import pageOptionMetadata from './models/page_option.js';
import pagoClienteMetadata from './models/pago_cliente.js';
import pagoProveedorMetadata from './models/pago_proveedor.js';
import paisMetadata from './models/pais.js';
import partidaMetadata from './models/partida.js';
import pedidoClienteMetadata from './models/pedido_cliente.js';
import pedidoProveedorMetadata from './models/pedido_proveedor.js';
import presupuestoClienteMetadata from './models/presupuesto_cliente.js';
import presupuestoProveedorMetadata from './models/presupuesto_proveedor.js';
import productoMetadata from './models/producto.js';
import productoImagenMetadata from './models/producto_imagen.js';
import productoProveedorMetadata from './models/producto_proveedor.js';
import proveedorMetadata from './models/proveedor.js';
import provinciaMetadata from './models/provincia.js';
import puntoInteresCiudadMetadata from './models/punto_interes_ciudad.js';
import reciboClienteMetadata from './models/recibo_cliente.js';
import reciboProveedorMetadata from './models/recibo_proveedor.js';
import regularizacionImpuestoMetadata from './models/regularizacion_impuesto.js';
import retencionMetadata from './models/retencion.js';
import roleMetadata from './models/role.js';
import roleAccessMetadata from './models/role_access.js';
import roleUserMetadata from './models/role_user.js';
import secuenciaDocumentoMetadata from './models/secuencia_documento.js';
import serieMetadata from './models/serie.js';
import settingsMetadata from './models/settings.js';
import stockMetadata from './models/stock.js';
import subcuentaMetadata from './models/subcuenta.js';
import tarifaMetadata from './models/tarifa.js';
import userMetadata from './models/user.js';
import varianteMetadata from './models/variante.js';
import workEventMetadata from './models/work_event.js';

/**
 * Catálogo de metadata indexado por nombre de modelo.
 */
export const modelMetadata: Record<string, ModelMetadata> = {
    agencia_transporte: agenciaTransporteMetadata,
    agente: agenteMetadata,
    albaran_cliente: albaranClienteMetadata,
    albaran_proveedor: albaranProveedorMetadata,
    almacen: almacenMetadata,
    api_access: apiAccessMetadata,
    api_key: apiKeyMetadata,
    asiento: asientoMetadata,
    atributo: atributoMetadata,
    atributo_valor: atributoValorMetadata,
    attached_file: attachedFileMetadata,
    attached_file_relation: attachedFileRelationMetadata,
    ciudad: ciudadMetadata,
    cliente: clienteMetadata,
    codigo_postal: codigoPostalMetadata,
    concepto_partida: conceptoPartidaMetadata,
    contacto: contactoMetadata,
    cron_job: cronJobMetadata,
    cuenta: cuentaMetadata,
    cuenta_banco: cuentaBancoMetadata,
    cuenta_banco_cliente: cuentaBancoClienteMetadata,
    cuenta_banco_proveedor: cuentaBancoProveedorMetadata,
    cuenta_especial: cuentaEspecialMetadata,
    diario: diarioMetadata,
    divisa: divisaMetadata,
    doc_transformation: docTransformationMetadata,
    ejercicio: ejercicioMetadata,
    email_notification: emailNotificationMetadata,
    email_sent: emailSentMetadata,
    empresa: empresaMetadata,
    estado_documento: estadoDocumentoMetadata,
    fabricante: fabricanteMetadata,
    factura_cliente: facturaClienteMetadata,
    factura_proveedor: facturaProveedorMetadata,
    familia: familiaMetadata,
    forma_pago: formaPagoMetadata,
    formato_documento: formatoDocumentoMetadata,
    grupo_clientes: grupoClientesMetadata,
    identificador_fiscal: identificadorFiscalMetadata,
    impuesto: impuestoMetadata,
    impuesto_zona: impuestoZonaMetadata,
    linea_albaran_cliente: lineaAlbaranClienteMetadata,
    linea_albaran_proveedor: lineaAlbaranProveedorMetadata,
    linea_factura_cliente: lineaFacturaClienteMetadata,
    linea_factura_proveedor: lineaFacturaProveedorMetadata,
    linea_pedido_cliente: lineaPedidoClienteMetadata,
    linea_pedido_proveedor: lineaPedidoProveedorMetadata,
    linea_presupuesto_cliente: lineaPresupuestoClienteMetadata,
    linea_presupuesto_proveedor: lineaPresupuestoProveedorMetadata,
    log_message: logMessageMetadata,
    page: pageMetadata,
    page_filter: pageFilterMetadata,
    page_option: pageOptionMetadata,
    pago_cliente: pagoClienteMetadata,
    pago_proveedor: pagoProveedorMetadata,
    pais: paisMetadata,
    partida: partidaMetadata,
    pedido_cliente: pedidoClienteMetadata,
    pedido_proveedor: pedidoProveedorMetadata,
    presupuesto_cliente: presupuestoClienteMetadata,
    presupuesto_proveedor: presupuestoProveedorMetadata,
    producto: productoMetadata,
    producto_imagen: productoImagenMetadata,
    producto_proveedor: productoProveedorMetadata,
    proveedor: proveedorMetadata,
    provincia: provinciaMetadata,
    punto_interes_ciudad: puntoInteresCiudadMetadata,
    recibo_cliente: reciboClienteMetadata,
    recibo_proveedor: reciboProveedorMetadata,
    regularizacion_impuesto: regularizacionImpuestoMetadata,
    retencion: retencionMetadata,
    role: roleMetadata,
    role_access: roleAccessMetadata,
    role_user: roleUserMetadata,
    secuencia_documento: secuenciaDocumentoMetadata,
    serie: serieMetadata,
    settings: settingsMetadata,
    stock: stockMetadata,
    subcuenta: subcuentaMetadata,
    tarifa: tarifaMetadata,
    user: userMetadata,
    variante: varianteMetadata,
    work_event: workEventMetadata,
};

/**
 * Lista de nombres de modelos disponibles.
 */
export const modelNames: string[] = Object.keys(modelMetadata);

export type { ModelMetadata, ColumnMetadata, Relation, ForeignKey, TsType, WidgetType } from './types.js';
