// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const tipoAtMetadata: ModelMetadata = {
    "name": "tipo_at",
    "table": "serviciosat_tipos",
    "endpoint": "/tipoates",
    "primaryKey": "id",
    "description": "Tipo de servicio SAT (reparación, instalación, mantenimiento...). Uno de ellos es el predeterminado para los servicios nuevos.",
    "source": "plugin:Servicios",
    "columns": [
        {
            "name": "id",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador del tipo de servicio.",
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
            "name": "default",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Por defecto",
            "description": "Tipo que reciben los servicios nuevos. Solo puede haber uno.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "name",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 50,
            "description": "Nombre del tipo de servicio.",
            "widget": "text",
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
            "type": "hasMany",
            "targetModel": "servicio_at",
            "targetTable": "serviciosat",
            "localColumn": "id",
            "remoteColumn": "idtipo"
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

export default tipoAtMetadata;
