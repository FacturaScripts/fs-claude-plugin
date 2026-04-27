// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const impuestoMetadata: ModelMetadata = {
    "name": "impuesto",
    "table": "impuestos",
    "endpoint": "/impuestos",
    "primaryKey": "codimpuesto",
    "description": "Tipo impositivo (IVA general, reducido, etc.) con su porcentaje y subcuentas asociadas.",
    "source": "core",
    "columns": [
        {
            "name": "activo",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "default": true,
            "description": "True si el impuesto está disponible para asignar a productos y documentos.",
            "widget": "checkbox"
        },
        {
            "name": "codimpuesto",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 10,
            "description": "Código corto único del impuesto (ej: IVA21, IVA10).",
            "widget": "text"
        },
        {
            "name": "codsubcuentarep",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta impuesto repercutido",
            "maxLength": 15,
            "description": "Subcuenta contable de IVA repercutido (ventas).",
            "widget": "subcuenta"
        },
        {
            "name": "codsubcuentarepintra",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta repercutido intracomunitarias",
            "maxLength": 15,
            "description": "Subcuenta de IVA repercutido para operaciones intracomunitarias.",
            "widget": "subcuenta"
        },
        {
            "name": "codsubcuentarepre",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta recargo repercutido",
            "maxLength": 15,
            "description": "Subcuenta del recargo de equivalencia repercutido.",
            "widget": "subcuenta"
        },
        {
            "name": "codsubcuentasop",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta impuesto soportado",
            "maxLength": 15,
            "description": "Subcuenta contable de IVA soportado (compras).",
            "widget": "subcuenta"
        },
        {
            "name": "codsubcuentasopintra",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta soportado Intracomunitaria",
            "maxLength": 15,
            "description": "Subcuenta de IVA soportado para operaciones intracomunitarias.",
            "widget": "subcuenta"
        },
        {
            "name": "codsubcuentasopre",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta recargo soportado",
            "maxLength": 15,
            "description": "Subcuenta del recargo de equivalencia soportado.",
            "widget": "subcuenta"
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 50,
            "description": "Descripción legible del impuesto (ej: IVA general 21%).",
            "widget": "text"
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
            "description": "Tipo de operación asociado al impuesto (interior, intracomunitario).",
            "widget": "select"
        },
        {
            "name": "tipo",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Tipo",
            "default": 1,
            "description": "Tipo de impuesto: 1 IVA estándar, 2 IGIC u otros impuestos similares.",
            "widget": "select",
            "enumValues": [
                "1",
                "2"
            ]
        },
        {
            "name": "iva",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "IVA",
            "description": "Porcentaje de IVA del impuesto.",
            "widget": "number"
        },
        {
            "name": "recargo",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Recargo",
            "description": "Porcentaje de recargo de equivalencia asociado.",
            "widget": "number"
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "impuesto_zona",
            "targetTable": "impuestoszonas",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "impuesto_zona",
            "targetTable": "impuestoszonas",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuestosel"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_albaran_cliente",
            "targetTable": "lineasalbaranescli",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_albaran_proveedor",
            "targetTable": "lineasalbaranesprov",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_factura_cliente",
            "targetTable": "lineasfacturascli",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_factura_proveedor",
            "targetTable": "lineasfacturasprov",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_pedido_cliente",
            "targetTable": "lineaspedidoscli",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_pedido_proveedor",
            "targetTable": "lineaspedidosprov",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_presupuesto_cliente",
            "targetTable": "lineaspresupuestoscli",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_presupuesto_proveedor",
            "targetTable": "lineaspresupuestosprov",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default impuestoMetadata;
