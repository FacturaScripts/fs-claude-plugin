// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const ciudadMetadata: ModelMetadata = {
    "name": "ciudad",
    "table": "ciudades",
    "endpoint": "/ciudades",
    "primaryKey": "idciudad",
    "description": "Ciudad asociada a un país y provincia.",
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
            "description": "Alias o variantes de nombre de la ciudad, separados por comas.",
            "widget": "textarea"
        },
        {
            "name": "ciudad",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Ciudad",
            "maxLength": 100,
            "description": "Nombre oficial de la ciudad.",
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
            "description": "Fecha y hora en la que se registró la ciudad en el sistema.",
            "widget": "datetime"
        },
        {
            "name": "codeid",
            "sqlType": "character varying(5)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Código",
            "maxLength": 5,
            "description": "Código corto interno de la ciudad (referencia abreviada).",
            "widget": "text"
        },
        {
            "name": "idciudad",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental de la ciudad.",
            "widget": "text"
        },
        {
            "name": "idprovincia",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Provincia",
            "description": "Provincia a la que pertenece la ciudad.",
            "widget": "select",
            "foreignKey": {
                "table": "provincias",
                "column": "idprovincia",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
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
            "description": "Usuario que realizó la última modificación del registro de ciudad.",
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
            "description": "Fecha y hora de la última modificación del registro de ciudad.",
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
            "description": "Latitud geográfica de la ciudad en grados decimales.",
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
            "description": "Longitud geográfica de la ciudad en grados decimales.",
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
            "description": "Usuario que creó el registro de ciudad.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "provincia",
            "targetTable": "provincias",
            "localColumn": "idprovincia",
            "remoteColumn": "idprovincia"
        },
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
            "localColumn": "idciudad",
            "remoteColumn": "idciudad"
        },
        {
            "type": "hasMany",
            "targetModel": "punto_interes_ciudad",
            "targetTable": "puntos_interes_ciudades",
            "localColumn": "idciudad",
            "remoteColumn": "idciudad"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default ciudadMetadata;
