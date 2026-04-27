// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const clienteMetadata: ModelMetadata = {
    "name": "cliente",
    "table": "clientes",
    "endpoint": "/clientes",
    "primaryKey": "codcliente",
    "description": "Cliente de la empresa. Puede tener una o más direcciones y cuentas bancarias asociadas.",
    "source": "core",
    "columns": [
        {
            "name": "cifnif",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Núm. fiscal",
            "maxLength": 30,
            "description": "CIF/NIF/NIE del cliente. Identificador fiscal según el tipo indicado en `tipoidfiscal`.",
            "widget": "text"
        },
        {
            "name": "codagente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Agente",
            "maxLength": 10,
            "description": "Agente comercial asignado al cliente. Cobra comisiones por sus compras.",
            "widget": "select",
            "foreignKey": {
                "table": "agentes",
                "column": "codagente",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codcliente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 10,
            "description": "Código corto único del cliente, asignado al darlo de alta. Se usa como referencia en facturas, recibos y documentos.",
            "widget": "text"
        },
        {
            "name": "codgrupo",
            "sqlType": "character varying(6)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Grupo",
            "maxLength": 6,
            "description": "Grupo de clientes al que pertenece. Se usa para reporting y descuentos masivos.",
            "widget": "select",
            "foreignKey": {
                "table": "gruposclientes",
                "column": "codgrupo",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codpago",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Forma de pago",
            "maxLength": 10,
            "description": "Forma de pago habitual del cliente (transferencia, recibo domiciliado, etc.).",
            "widget": "select",
            "foreignKey": {
                "table": "formaspago",
                "column": "codpago",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codproveedor",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codproveedor",
            "maxLength": 10,
            "description": "Código del proveedor asociado, si la misma entidad actúa también como proveedor."
        },
        {
            "name": "codretencion",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Retención",
            "maxLength": 10,
            "description": "Retención fiscal (IRPF) aplicable a sus facturas.",
            "widget": "select",
            "foreignKey": {
                "table": "retenciones",
                "column": "codretencion",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codserie",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Serie",
            "maxLength": 4,
            "description": "Serie de numeración por defecto para los documentos del cliente.",
            "widget": "select",
            "foreignKey": {
                "table": "series",
                "column": "codserie",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codsubcuenta",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta",
            "maxLength": 15,
            "description": "Indique una subcuenta a usar o deje el campo en blanco para asignar una automáticamente.",
            "widget": "text"
        },
        {
            "name": "codtarifa",
            "sqlType": "character varying(6)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Tarifa",
            "maxLength": 6,
            "description": "Tarifa de precios aplicable al cliente.",
            "widget": "select",
            "foreignKey": {
                "table": "tarifas",
                "column": "codtarifa",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "debaja",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "debaja",
            "default": false,
            "description": "True si el cliente está dado de baja; false si sigue activo.",
            "widget": "checkbox"
        },
        {
            "name": "diaspago",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Días de pago",
            "maxLength": 10,
            "description": "Días del mes preferidos para el cobro. Lista separada por comas (ej: 1,15,31).",
            "widget": "text"
        },
        {
            "name": "excepcioniva",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Excepción de IVA",
            "maxLength": 20,
            "description": "Excepción aplicable al IVA (operación intracomunitaria, exportación, etc.). Modifica el cálculo de IVA en sus facturas.",
            "widget": "select"
        },
        {
            "name": "email",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Email",
            "maxLength": 100,
            "description": "Email principal del cliente para envío de facturas y comunicaciones.",
            "widget": "email"
        },
        {
            "name": "fax",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fax",
            "maxLength": 30,
            "description": "Número de fax del cliente.",
            "widget": "text"
        },
        {
            "name": "fechaalta",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha de creación",
            "description": "Fecha de alta del cliente en el sistema.",
            "widget": "date"
        },
        {
            "name": "fechabaja",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fecha de baja",
            "description": "Fecha de baja del cliente. Si está vacía, el cliente sigue activo.",
            "widget": "date"
        },
        {
            "name": "idcontactoenv",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Dirección de envío",
            "description": "Identificador del contacto que actúa como dirección de envío por defecto.",
            "widget": "select"
        },
        {
            "name": "idcontactofact",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Dirección de facturación",
            "description": "Identificador del contacto que actúa como dirección de facturación por defecto.",
            "widget": "select"
        },
        {
            "name": "langcode",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Idioma",
            "maxLength": 10,
            "description": "Código de idioma del cliente (es_ES, en_US, etc.). Usado en plantillas de email y documentos.",
            "widget": "select"
        },
        {
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre por el cual el cliente es conocido. Para uso interno.",
            "widget": "text"
        },
        {
            "name": "observaciones",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Observaciones",
            "description": "Notas internas sobre el cliente. No aparecen en documentos.",
            "widget": "textarea"
        },
        {
            "name": "operacion",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Operación",
            "maxLength": 20,
            "description": "Tipo de operación fiscal por defecto en sus facturas (interior, intracomunitaria, etc.).",
            "widget": "select"
        },
        {
            "name": "personafisica",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Tipo",
            "default": true,
            "description": "True si es persona física, false si es empresa o persona jurídica.",
            "widget": "select",
            "enumValues": [
                "1",
                "0"
            ]
        },
        {
            "name": "razonsocial",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Razón Social",
            "maxLength": 100,
            "description": "Nombre oficial del cliente, para las facturas y otros documentos.",
            "widget": "text"
        },
        {
            "name": "regimeniva",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Régimen impuestos",
            "maxLength": 50,
            "description": "Régimen de IVA del cliente (general, simplificado, recargo de equivalencia, etc.).",
            "widget": "select"
        },
        {
            "name": "riesgoalcanzado",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Riesgo actual",
            "description": "Importe pendiente de cobro acumulado por el cliente, calculado desde facturas no pagadas.",
            "widget": "money"
        },
        {
            "name": "riesgomax",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Riesgo máximo",
            "description": "Límite máximo de riesgo permitido. El sistema avisa al crear documentos si se supera.",
            "widget": "money"
        },
        {
            "name": "telefono1",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Teléfono",
            "maxLength": 30,
            "description": "Teléfono principal del cliente.",
            "widget": "text"
        },
        {
            "name": "telefono2",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Teléfono 2",
            "maxLength": 30,
            "description": "Teléfono secundario o móvil del cliente.",
            "widget": "text"
        },
        {
            "name": "tipoidfiscal",
            "sqlType": "character varying(25)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Id. Fiscal",
            "maxLength": 25,
            "description": "Tipo de identificador fiscal (NIF, CIF, NIE, VAT…). Determina el formato esperado en `cifnif`.",
            "widget": "select"
        },
        {
            "name": "web",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Web",
            "maxLength": 100,
            "description": "URL de la página web del cliente.",
            "widget": "link"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "agente",
            "targetTable": "agentes",
            "localColumn": "codagente",
            "remoteColumn": "codagente"
        },
        {
            "type": "belongsTo",
            "targetModel": "forma_pago",
            "targetTable": "formaspago",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "belongsTo",
            "targetModel": "grupo_clientes",
            "targetTable": "gruposclientes",
            "localColumn": "codgrupo",
            "remoteColumn": "codgrupo"
        },
        {
            "type": "belongsTo",
            "targetModel": "retencion",
            "targetTable": "retenciones",
            "localColumn": "codretencion",
            "remoteColumn": "codretencion"
        },
        {
            "type": "belongsTo",
            "targetModel": "serie",
            "targetTable": "series",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "belongsTo",
            "targetModel": "tarifa",
            "targetTable": "tarifas",
            "localColumn": "codtarifa",
            "remoteColumn": "codtarifa"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "hasMany",
            "targetModel": "contacto",
            "targetTable": "contactos",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "hasMany",
            "targetModel": "cuenta_banco_cliente",
            "targetTable": "cuentasbcocli",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "hasMany",
            "targetModel": "recibo_cliente",
            "targetTable": "recibospagoscli",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default clienteMetadata;
