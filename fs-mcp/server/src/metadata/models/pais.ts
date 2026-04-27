// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const paisMetadata: ModelMetadata = {
    "name": "pais",
    "table": "paises",
    "endpoint": "/paises",
    "primaryKey": "codpais",
    "description": "País con código ISO, alpha-3 y nombre. Asociado a contactos, empresas y zonas de impuestos.",
    "source": "core",
    "columns": [
        {
            "name": "alias",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Alias",
            "description": "Alias o nombres alternativos del país, separados por comas.",
            "widget": "textarea"
        },
        {
            "name": "codiso",
            "sqlType": "character varying(2)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Código alfa 2",
            "maxLength": 2,
            "description": "Código ISO 3166-1 alpha-3 del país (ej: ESP, USA, FRA).",
            "widget": "text"
        },
        {
            "name": "codpais",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código alfa 3",
            "maxLength": 20,
            "description": "Código corto interno del país, usado como FK en otras tablas.",
            "widget": "text"
        },
        {
            "name": "creation_date",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha de creación",
            "description": "Fecha y hora en la que se creó el registro del país.",
            "widget": "datetime"
        },
        {
            "name": "last_nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Último usuario",
            "maxLength": 50,
            "description": "Usuario que realizó la última modificación del registro.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "last_update",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Última modificación",
            "description": "Fecha y hora de la última modificación.",
            "widget": "datetime"
        },
        {
            "name": "latitude",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Latitud",
            "description": "Latitud geográfica del centroide del país.",
            "widget": "number"
        },
        {
            "name": "longitude",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Longitud",
            "description": "Longitud geográfica del centroide del país.",
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
            "description": "Usuario que creó el registro del país.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre oficial del país.",
            "widget": "text"
        },
        {
            "name": "telephone_prefix",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Prefijo telefónico",
            "maxLength": 10,
            "description": "Prefijo telefónico internacional del país (ej: +34, +1).",
            "widget": "text"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "last_nick",
            "remoteColumn": "nick"
        },
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "codigo_postal",
            "targetTable": "codigos_postales",
            "localColumn": "codpais",
            "remoteColumn": "codpais"
        },
        {
            "type": "hasMany",
            "targetModel": "provincia",
            "targetTable": "provincias",
            "localColumn": "codpais",
            "remoteColumn": "codpais"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default paisMetadata;
