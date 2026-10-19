// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const codigoPostalMetadata: ModelMetadata = {
    "name": "codigo_postal",
    "table": "codigos_postales",
    "endpoint": "/codigopostales",
    "primaryKey": "id",
    "description": "Código postal con su ciudad/provincia/país asociados.",
    "source": "core",
    "columns": [
        {
            "name": "codpais",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "País",
            "maxLength": 20,
            "description": "País al que pertenece el código postal.",
            "widget": "select",
            "foreignKey": {
                "table": "paises",
                "column": "codpais",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
        },
        {
            "name": "creation_date",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha creación",
            "description": "Fecha y hora en la que se registró el código postal.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
        },
        {
            "name": "id",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental del registro.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
        },
        {
            "name": "idciudad",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Ciudad",
            "description": "Ciudad a la que pertenece el código postal.",
            "widget": "select",
            "foreignKey": {
                "table": "ciudades",
                "column": "idciudad",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
        },
        {
            "name": "idprovincia",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Provincia",
            "description": "Provincia a la que pertenece el código postal.",
            "widget": "select",
            "foreignKey": {
                "table": "provincias",
                "column": "idprovincia",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
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
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
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
            "description": "Fecha y hora de la última modificación del registro.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
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
            "description": "Usuario que creó el registro de código postal.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
        },
        {
            "name": "number",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Número",
            "description": "Número de código postal.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
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
            "type": "belongsTo",
            "targetModel": "pais",
            "targetTable": "paises",
            "localColumn": "codpais",
            "remoteColumn": "codpais"
        },
        {
            "type": "belongsTo",
            "targetModel": "provincia",
            "targetTable": "provincias",
            "localColumn": "idprovincia",
            "remoteColumn": "idprovincia"
        },
        {
            "type": "belongsTo",
            "targetModel": "ciudad",
            "targetTable": "ciudades",
            "localColumn": "idciudad",
            "remoteColumn": "idciudad"
        }
    ],
    "availability": [
        {
            "source": "core",
            "since": "2024.3"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-10-07T17:38:31.723Z",
        "facturascriptsCommit": "93a6a74ac",
        "versions": {
            "core": {
                "latest": "2026.7",
                "tags": 67
            }
        }
    }
};

export default codigoPostalMetadata;
