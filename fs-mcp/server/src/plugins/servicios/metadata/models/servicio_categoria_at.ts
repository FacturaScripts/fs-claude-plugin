// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const servicioCategoriaAtMetadata: ModelMetadata = {
    "name": "servicio_categoria_at",
    "table": "serviciosat_serviciocategorias",
    "endpoint": "/serviciocategoriaates",
    "primaryKey": "id",
    "description": "Categoría de verificaciones asignada a un servicio SAT. Al crearla se generan las verificaciones del servicio de esa categoría.",
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
            "description": "Identificador de la asignación.",
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
            "name": "idcategory",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Categoría",
            "description": "Categoría de verificaciones asignada.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "serviciosat_categorias",
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
            "description": "Servicio SAT al que se asigna la categoría.",
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
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "categoria_at",
            "targetTable": "serviciosat_categorias",
            "localColumn": "idcategory",
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

export default servicioCategoriaAtMetadata;
