// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const formaPagoMetadata: ModelMetadata = {
    "name": "forma_pago",
    "table": "formaspago",
    "endpoint": "/formapagos",
    "primaryKey": "codpago",
    "description": "Forma de pago configurada (transferencia, efectivo, tarjeta…). Define plazos y vencimientos.",
    "source": "core",
    "columns": [
        {
            "name": "activa",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "default": true,
            "description": "True si la forma de pago está disponible para usar en documentos.",
            "widget": "checkbox"
        },
        {
            "name": "codcuentabanco",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cuenta Bancaria",
            "maxLength": 10,
            "description": "Cuenta bancaria propia donde se domicilian los cobros generados con esta forma de pago.",
            "widget": "select",
            "foreignKey": {
                "table": "cuentasbanco",
                "column": "codcuenta",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codpago",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 10,
            "description": "Código corto único de la forma de pago.",
            "widget": "text"
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 100,
            "description": "Descripción legible (ej: Transferencia, Contado, Tarjeta).",
            "widget": "text"
        },
        {
            "name": "domiciliado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Domiciliado",
            "description": "True si la forma de pago genera recibos domiciliados (SEPA).",
            "widget": "checkbox"
        },
        {
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Empresa",
            "description": "Empresa propietaria de la forma de pago.",
            "widget": "select",
            "foreignKey": {
                "table": "empresas",
                "column": "idempresa",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "imprimir",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Imprimir cuenta bancaria",
            "default": true,
            "description": "True si la cuenta bancaria debe imprimirse en documentos con esta forma de pago.",
            "widget": "checkbox"
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
            "description": "True si los documentos creados con esta forma de pago se marcan automáticamente como pagados (ej: Contado).",
            "widget": "checkbox"
        },
        {
            "name": "plazovencimiento",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Vencimiento",
            "description": "Número de unidades (días/semanas/meses/años según `tipovencimiento`) hasta el vencimiento.",
            "widget": "number"
        },
        {
            "name": "tipovencimiento",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Tipo de vencimiento",
            "maxLength": 10,
            "description": "Unidad temporal del plazo de vencimiento (días, semanas, meses, años).",
            "widget": "select",
            "enumValues": [
                "days",
                "weeks",
                "months",
                "years"
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "cuenta_banco",
            "targetTable": "cuentasbanco",
            "localColumn": "codcuentabanco",
            "remoteColumn": "codcuenta"
        },
        {
            "type": "belongsTo",
            "targetModel": "empresa",
            "targetTable": "empresas",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_proveedor",
            "targetTable": "albaranesprov",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "hasMany",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_proveedor",
            "targetTable": "pedidosprov",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "hasMany",
            "targetModel": "proveedor",
            "targetTable": "proveedores",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default formaPagoMetadata;
