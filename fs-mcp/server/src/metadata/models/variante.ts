// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const varianteMetadata: ModelMetadata = {
    "name": "variante",
    "table": "variantes",
    "endpoint": "/variantes",
    "primaryKey": "idvariante",
    "description": "Variante de un producto (talla, color, etc.). Cada variante tiene su propia referencia, código de barras y precio.",
    "source": "core",
    "columns": [
        {
            "name": "codbarras",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Código de barras",
            "maxLength": 20,
            "description": "Código de barras EAN/UPC de la variante.",
            "widget": "text"
        },
        {
            "name": "coste",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Precio de coste",
            "default": 0,
            "description": "Precio de coste unitario de la variante.",
            "widget": "money"
        },
        {
            "name": "idatributovalor1",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Atributo 1",
            "description": "Valor del primer atributo de la variante (ej: talla S).",
            "widget": "select",
            "foreignKey": {
                "table": "atributos_valores",
                "column": "id",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idatributovalor2",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Atributo 2",
            "description": "Valor del segundo atributo de la variante (ej: color azul).",
            "widget": "select",
            "foreignKey": {
                "table": "atributos_valores",
                "column": "id",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idatributovalor3",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Atributo 3",
            "description": "Valor del tercer atributo de la variante.",
            "widget": "select",
            "foreignKey": {
                "table": "atributos_valores",
                "column": "id",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idatributovalor4",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Atributo 4",
            "description": "Valor del cuarto atributo de la variante.",
            "widget": "select",
            "foreignKey": {
                "table": "atributos_valores",
                "column": "id",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idproducto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Producto",
            "description": "Producto al que pertenece la variante.",
            "widget": "text",
            "foreignKey": {
                "table": "productos",
                "column": "idproducto",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idvariante",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idvariante",
            "description": "Identificador interno autoincremental de la variante.",
            "widget": "number"
        },
        {
            "name": "margen",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Margen",
            "default": 0,
            "description": "Margen porcentual aplicado al coste para calcular el precio de venta.",
            "widget": "text"
        },
        {
            "name": "precio",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Precio",
            "default": 0,
            "description": "Precio de venta unitario de la variante (sin IVA).",
            "widget": "money"
        },
        {
            "name": "referencia",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Referencia",
            "maxLength": 30,
            "description": "Referencia/SKU única de la variante.",
            "widget": "text"
        },
        {
            "name": "stockfis",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Stock",
            "default": 0,
            "description": "Stock físico actual de la variante sumado entre todos los almacenes.",
            "widget": "number"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "atributo_valor",
            "targetTable": "atributos_valores",
            "localColumn": "idatributovalor1",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "atributo_valor",
            "targetTable": "atributos_valores",
            "localColumn": "idatributovalor2",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "atributo_valor",
            "targetTable": "atributos_valores",
            "localColumn": "idatributovalor3",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "atributo_valor",
            "targetTable": "atributos_valores",
            "localColumn": "idatributovalor4",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "producto_imagen",
            "targetTable": "productos_imagenes",
            "localColumn": "referencia",
            "remoteColumn": "referencia"
        },
        {
            "type": "hasMany",
            "targetModel": "stock",
            "targetTable": "stocks",
            "localColumn": "referencia",
            "remoteColumn": "referencia"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default varianteMetadata;
