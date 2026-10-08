// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const settingsMetadata: ModelMetadata = {
    "name": "settings",
    "table": "settings",
    "endpoint": "/settings",
    "primaryKey": "name",
    "description": "Configuración global agrupada por nombre. Valores en JSON serializado.",
    "source": "core",
    "columns": [
        {
            "name": "name",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 50,
            "description": "Nombre del grupo de configuración (ej: default, email, accounting).",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "properties",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "properties",
            "description": "Configuración del grupo en formato JSON.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        }
    ],
    "relations": [],
    "availability": [
        {
            "source": "core",
            "since": "2018.03",
            "sinceFirstTag": true
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

export default settingsMetadata;
