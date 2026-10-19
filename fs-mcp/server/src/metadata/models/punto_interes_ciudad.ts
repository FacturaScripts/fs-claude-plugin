// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const puntoInteresCiudadMetadata: ModelMetadata = {
    "name": "punto_interes_ciudad",
    "table": "puntos_interes_ciudades",
    "endpoint": "/puntointeresciudades",
    "primaryKey": "id",
    "description": "Punto de interés geográfico asociado a una ciudad (referencia, no transaccional).",
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
            "description": "Alias o nombres alternativos del punto de interés.",
            "widget": "textarea",
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
            "description": "Fecha y hora en la que se creó el registro.",
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
            "description": "Identificador interno autoincremental.",
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
            "isReadonly": true,
            "isRequired": true,
            "label": "Ciudad",
            "description": "Ciudad donde se ubica el punto de interés.",
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
            "description": "Fecha y hora de la última modificación.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
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
            "description": "Latitud geográfica del punto de interés.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
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
            "description": "Longitud geográfica del punto de interés.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2024.3"
                }
            ]
        },
        {
            "name": "name",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre del punto de interés (monumento, plaza, edificio singular).",
            "widget": "text",
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
            "description": "Usuario que creó el registro del punto de interés.",
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
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "ciudad",
            "targetTable": "ciudades",
            "localColumn": "idciudad",
            "remoteColumn": "idciudad"
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

export default puntoInteresCiudadMetadata;
