// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const categoriaAtMetadata: ModelMetadata = {
    "name": "categoria_at",
    "table": "serviciosat_categorias",
    "endpoint": "/categoriaates",
    "primaryKey": "id",
    "description": "Categoría de verificaciones (checklist) de los servicios SAT. Agrupa las comprobaciones que hay que hacer en un servicio.",
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
            "label": "Código",
            "description": "Identificador de la categoría de verificaciones.",
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
            "name": "name",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 100,
            "description": "Nombre de la categoría de verificaciones.",
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
            "targetModel": "check_at",
            "targetTable": "serviciosat_checks",
            "localColumn": "id",
            "remoteColumn": "idcategory"
        },
        {
            "type": "hasMany",
            "targetModel": "servicio_categoria_at",
            "targetTable": "serviciosat_serviciocategorias",
            "localColumn": "id",
            "remoteColumn": "idcategory"
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

export default categoriaAtMetadata;
