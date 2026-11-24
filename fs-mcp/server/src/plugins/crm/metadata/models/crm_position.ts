// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const crmPositionMetadata: ModelMetadata = {
    "name": "crm_position",
    "table": "crm_positions",
    "endpoint": "/crmpositions",
    "primaryKey": "id",
    "description": "Cargo del catálogo del CRM (gerente, comprador, técnico...). Son las opciones que se sugieren en el campo cargo de los contactos.",
    "source": "plugin:CRM",
    "columns": [
        {
            "name": "creation_date",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "creation_date",
            "description": "Fecha y hora de alta.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.4"
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
            "description": "Identificador del cargo.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.4"
                }
            ]
        },
        {
            "name": "last_nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "last_nick",
            "maxLength": 50,
            "description": "Usuario que lo modificó por última vez.",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.4"
                }
            ]
        },
        {
            "name": "last_update",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "last_update",
            "description": "Fecha y hora de la última modificación.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.4"
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
            "isRequired": false,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre del cargo.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.4"
                }
            ]
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Usuario que creó el cargo.",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.4"
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
        }
    ],
    "availability": [
        {
            "source": "plugin:CRM",
            "since": "2.4"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-11-24T12:56:34.504Z",
        "facturascriptsCommit": "7aa596470",
        "facturascriptsVersion": "plugin:CRM@16399b9",
        "versions": {
            "plugin:CRM": {
                "latest": "3.44",
                "tags": 33
            }
        }
    }
};

export default crmPositionMetadata;
