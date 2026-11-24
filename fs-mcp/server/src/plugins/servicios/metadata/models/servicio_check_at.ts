// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const servicioCheckAtMetadata: ModelMetadata = {
    "name": "servicio_check_at",
    "table": "serviciosat_serviciochecks",
    "endpoint": "/serviciocheckates",
    "primaryKey": "id",
    "description": "Verificación de un servicio SAT: una comprobación de la checklist, marcada o no, con la fecha en que se completó.",
    "source": "plugin:Servicios",
    "columns": [
        {
            "name": "completed",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Completado",
            "description": "Fecha y hora en que se marcó como hecha. Se rellena sola al marcarla.",
            "widget": "datetime",
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
            "label": "Código",
            "description": "Identificador de la verificación del servicio.",
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
            "name": "idcheck",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "idcheck",
            "description": "Comprobación de la checklist.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "serviciosat_checks",
                "column": "id",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idservice",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Servicio",
            "description": "Servicio SAT al que pertenece la verificación.",
            "widget": "text",
            "foreignKey": {
                "table": "serviciosat",
                "column": "idservicio",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "checked",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Comprobado",
            "description": "Si la comprobación está hecha.",
            "widget": "checkbox",
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
            "targetModel": "check_at",
            "targetTable": "serviciosat_checks",
            "localColumn": "idcheck",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "servicio_at",
            "targetTable": "serviciosat",
            "localColumn": "idservice",
            "remoteColumn": "idservicio"
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

export default servicioCheckAtMetadata;
