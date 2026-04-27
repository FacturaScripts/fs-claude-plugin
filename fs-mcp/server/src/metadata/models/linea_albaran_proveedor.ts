// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const lineaAlbaranProveedorMetadata: ModelMetadata = {
    "name": "linea_albaran_proveedor",
    "table": "lineasalbaranesprov",
    "endpoint": "/lineaalbaranproveedores",
    "primaryKey": "idlinea",
    "description": "Línea de un albarán de proveedor.",
    "source": "core",
    "columns": [
        {
            "name": "actualizastock",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "actualizastock",
            "default": 0,
            "description": "Cómo afecta esta línea al stock al confirmar el documento.",
            "widget": "number"
        },
        {
            "name": "cantidad",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "cantidad",
            "description": "Cantidad del producto recibida en esta línea.",
            "widget": "number"
        },
        {
            "name": "codimpuesto",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codimpuesto",
            "maxLength": 10,
            "description": "Impuesto aplicado a la línea (suele coincidir con el del producto).",
            "foreignKey": {
                "table": "impuestos",
                "column": "codimpuesto",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "descripcion",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "descripcion",
            "description": "Descripción del producto en la línea.",
            "widget": "textarea"
        },
        {
            "name": "dtopor",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "dtopor",
            "default": 0,
            "description": "Primer descuento porcentual aplicado a la línea.",
            "widget": "number"
        },
        {
            "name": "dtopor2",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "dtopor2",
            "default": 0,
            "description": "Segundo descuento porcentual aplicado tras dtopor.",
            "widget": "number"
        },
        {
            "name": "excepcioniva",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "excepcioniva",
            "maxLength": 20,
            "description": "Excepción de IVA aplicada a esta línea."
        },
        {
            "name": "idalbaran",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idalbaran",
            "description": "Albarán de proveedor al que pertenece la línea.",
            "widget": "number",
            "foreignKey": {
                "table": "albaranesprov",
                "column": "idalbaran",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idlinea",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idlinea",
            "description": "Identificador interno autoincremental de la línea.",
            "widget": "number"
        },
        {
            "name": "idproducto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idproducto",
            "description": "Producto al que se refiere la línea.",
            "widget": "number",
            "foreignKey": {
                "table": "productos",
                "column": "idproducto",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "irpf",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "IRPF",
            "description": "Porcentaje de IRPF aplicado.",
            "widget": "number"
        },
        {
            "name": "iva",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "iva",
            "description": "Porcentaje de IVA aplicado a la línea.",
            "widget": "number"
        },
        {
            "name": "orden",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "orden",
            "default": 0,
            "description": "Posición de la línea en el documento.",
            "widget": "number"
        },
        {
            "name": "pvpsindto",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "pvpsindto",
            "description": "Subtotal de la línea antes de aplicar descuentos.",
            "widget": "number"
        },
        {
            "name": "pvptotal",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "pvptotal",
            "description": "Subtotal de la línea después de descuentos.",
            "widget": "number"
        },
        {
            "name": "pvpunitario",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "pvpunitario",
            "description": "Precio unitario sin IVA antes de descuentos.",
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
            "label": "recargo",
            "description": "Porcentaje de recargo de equivalencia.",
            "widget": "number"
        },
        {
            "name": "referencia",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "referencia",
            "maxLength": 30,
            "description": "Referencia de la variante de producto comprada."
        },
        {
            "name": "servido",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "servido",
            "default": 0,
            "description": "Cantidad ya recibida/contabilizada.",
            "widget": "number"
        },
        {
            "name": "suplido",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "suplido",
            "default": false,
            "description": "True si la línea es un suplido.",
            "widget": "checkbox"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "albaran_proveedor",
            "targetTable": "albaranesprov",
            "localColumn": "idalbaran",
            "remoteColumn": "idalbaran"
        },
        {
            "type": "belongsTo",
            "targetModel": "impuesto",
            "targetTable": "impuestos",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "belongsTo",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default lineaAlbaranProveedorMetadata;
