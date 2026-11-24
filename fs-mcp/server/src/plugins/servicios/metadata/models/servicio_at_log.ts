// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const servicioAtLogMetadata: ModelMetadata = {
    "name": "servicio_at_log",
    "table": "serviciosat_logs",
    "endpoint": "/servicioatloges",
    "primaryKey": "id",
    "description": "Historial de un servicio SAT: alta, cambios de estado, cliente, agente, asignado y trabajos, con usuario, IP y fecha.",
    "source": "plugin:Servicios",
    "columns": [
        {
            "name": "context",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Contexto",
            "description": "Datos del registro en el momento del cambio, en JSON.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "creationdate",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Fecha",
            "description": "Fecha y hora del cambio.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
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
            "description": "Identificador de la entrada del historial.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idservicio",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Servicio SAT al que se refiere la entrada.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "ip",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "IP",
            "maxLength": 40,
            "description": "Dirección IP desde la que se hizo el cambio.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "message",
            "sqlType": "text",
            "tsType": "text",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Mensaje",
            "description": "Texto del cambio registrado.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
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
            "description": "Usuario que hizo el cambio.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        }
    ],
    "relations": [
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
            "source": "plugin:Servicios",
            "since": "4.11",
            "sinceFirstTag": true
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-11-24T13:08:19.225Z",
        "facturascriptsCommit": "7aa596470",
        "facturascriptsVersion": "plugin:Servicios@124f8a2",
        "versions": {
            "plugin:Servicios": {
                "latest": "4.31",
                "tags": 5
            }
        }
    }
};

export default servicioAtLogMetadata;
