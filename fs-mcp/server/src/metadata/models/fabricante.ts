// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const fabricanteMetadata: ModelMetadata = {
    "name": "fabricante",
    "table": "fabricantes",
    "endpoint": "/fabricantes",
    "primaryKey": "codfabricante",
    "description": "Fabricante de productos. Catálogo simple de marca/proveedor de origen.",
    "source": "core",
    "columns": [
        {
            "name": "codfabricante",
            "sqlType": "character varying(8)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 8,
            "description": "Código corto único del fabricante.",
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
            "description": "Nombre comercial del fabricante.",
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
            "name": "numproductos",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Productos",
            "default": 0,
            "description": "Número de productos asociados al fabricante (calculado).",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.51"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "codfabricante",
            "remoteColumn": "codfabricante"
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

export default fabricanteMetadata;
