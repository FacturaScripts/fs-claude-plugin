// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const atributoMetadata: ModelMetadata = {
    "name": "atributo",
    "table": "atributos",
    "endpoint": "/atributos",
    "primaryKey": "codatributo",
    "description": "Atributo configurable de productos (ej: talla, color). Agrupa los valores posibles.",
    "source": "core",
    "columns": [
        {
            "name": "codatributo",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 20,
            "description": "Código corto único del atributo (ej: TALLA, COLOR).",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre legible del atributo (ej: Talla, Color).",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "num_selector",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Selector",
            "default": 0,
            "description": "Número del selector visual asociado al atributo (orden de aparición en filtros).",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.08"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "atributo_valor",
            "targetTable": "atributos_valores",
            "localColumn": "codatributo",
            "remoteColumn": "codatributo"
        }
    ],
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

export default atributoMetadata;
