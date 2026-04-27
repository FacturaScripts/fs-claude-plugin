// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const serieMetadata: ModelMetadata = {
    "name": "serie",
    "table": "series",
    "endpoint": "/series",
    "primaryKey": "codserie",
    "description": "Serie de numeración para documentos (ej: A, R, RECT). Cada documento tiene una serie y un número correlativo.",
    "source": "core",
    "columns": [
        {
            "name": "canal",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Canal",
            "description": "Canal contable opcional asociado a los documentos de esta serie.",
            "widget": "number"
        },
        {
            "name": "codserie",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 4,
            "description": "Código corto único de la serie (ej: A, R, RECT).",
            "widget": "text"
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 100,
            "description": "Descripción legible de la serie.",
            "widget": "text"
        },
        {
            "name": "iddiario",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Diario",
            "description": "Diario contable por defecto al que van los asientos de los documentos de esta serie.",
            "widget": "select",
            "foreignKey": {
                "table": "diarios",
                "column": "iddiario",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "siniva",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Sin impuestos",
            "default": false,
            "description": "True si los documentos de esta serie no llevan IVA (ej: serie de exportación).",
            "widget": "checkbox"
        },
        {
            "name": "tipo",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Tipo",
            "maxLength": 4,
            "description": "Tipo de serie: S estándar, R rectificativa.",
            "widget": "select",
            "enumValues": [
                "S",
                "R"
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "diario",
            "targetTable": "diarios",
            "localColumn": "iddiario",
            "remoteColumn": "iddiario"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_proveedor",
            "targetTable": "albaranesprov",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "formato_documento",
            "targetTable": "formatos_documentos",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_proveedor",
            "targetTable": "pedidosprov",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_proveedor",
            "targetTable": "presupuestosprov",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "proveedor",
            "targetTable": "proveedores",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "secuencia_documento",
            "targetTable": "secuencias_documentos",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default serieMetadata;
