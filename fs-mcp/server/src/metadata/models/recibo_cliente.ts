// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const reciboClienteMetadata: ModelMetadata = {
    "name": "recibo_cliente",
    "table": "recibospagoscli",
    "endpoint": "/reciboclientes",
    "primaryKey": "idrecibo",
    "description": "Recibo de cobro a un cliente. Generado a partir de una factura, con vencimiento e importe.",
    "source": "core",
    "columns": [
        {
            "name": "codcliente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Cliente",
            "maxLength": 10,
            "description": "Cliente al que se le emite el recibo.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "clientes",
                "column": "codcliente",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "coddivisa",
            "sqlType": "character varying(3)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Divisa",
            "maxLength": 3,
            "description": "Divisa del recibo. Si es distinta a la principal se aplica `tasaconv`.",
            "widget": "select",
            "foreignKey": {
                "table": "divisas",
                "column": "coddivisa",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codigofactura",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codigofactura",
            "maxLength": 20,
            "description": "Código de la factura de la que se generó el recibo."
        },
        {
            "name": "codpago",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Forma de pago",
            "maxLength": 10,
            "description": "Forma de pago aplicable al recibo.",
            "widget": "select"
        },
        {
            "name": "fecha",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Fecha",
            "description": "Fecha de emisión del recibo.",
            "widget": "date"
        },
        {
            "name": "fechapago",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha de pago",
            "description": "Fecha en la que se cobró el recibo. Vacía si todavía no se ha cobrado.",
            "widget": "date"
        },
        {
            "name": "gastos",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Gastos",
            "default": 0,
            "description": "Gastos asociados al recibo (comisiones, devoluciones).",
            "widget": "money"
        },
        {
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Empresa",
            "description": "ID de la empresa emisora del recibo.",
            "widget": "select"
        },
        {
            "name": "idfactura",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Factura",
            "description": "Factura del cliente que origina el recibo.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "facturascli",
                "column": "idfactura",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idrecibo",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental del recibo.",
            "widget": "text"
        },
        {
            "name": "importe",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Importe",
            "default": 0,
            "description": "Importe a cobrar en el recibo.",
            "widget": "money"
        },
        {
            "name": "liquidado",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "liquidado",
            "default": 0,
            "description": "Importe ya liquidado/cobrado del recibo (puede ser parcial).",
            "widget": "number"
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Usuario que generó o gestionó el recibo.",
            "widget": "select"
        },
        {
            "name": "numero",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Número",
            "description": "Número correlativo del recibo dentro de la factura.",
            "widget": "number"
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
            "description": "Notas internas sobre el recibo.",
            "widget": "textarea"
        },
        {
            "name": "pagado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Pagado",
            "default": false,
            "description": "True si el recibo está totalmente cobrado.",
            "widget": "checkbox"
        },
        {
            "name": "vencido",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "vencido",
            "default": false,
            "description": "True si la fecha de vencimiento ya ha pasado y sigue sin cobrarse.",
            "widget": "checkbox"
        },
        {
            "name": "vencimiento",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Vencimiento",
            "description": "Fecha límite en la que el cliente debe pagar el recibo.",
            "widget": "date"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "belongsTo",
            "targetModel": "divisa",
            "targetTable": "divisas",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "belongsTo",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "idfactura",
            "remoteColumn": "idfactura"
        },
        {
            "type": "hasMany",
            "targetModel": "pago_cliente",
            "targetTable": "pagoscli",
            "localColumn": "idrecibo",
            "remoteColumn": "idrecibo"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default reciboClienteMetadata;
