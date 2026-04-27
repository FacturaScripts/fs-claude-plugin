// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const apiAccessMetadata: ModelMetadata = {
    "name": "api_access",
    "table": "api_access",
    "endpoint": "/apiaccess",
    "primaryKey": "id",
    "description": "Permiso de acceso de una API key a un recurso (modelo) con CRUD configurable.",
    "source": "core",
    "columns": [
        {
            "name": "allowdelete",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "allowdelete",
            "description": "True si la API key puede ejecutar peticiones DELETE en el recurso.",
            "widget": "checkbox"
        },
        {
            "name": "allowget",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "allowget",
            "description": "True si la API key puede ejecutar peticiones GET (lectura) en el recurso.",
            "widget": "checkbox"
        },
        {
            "name": "allowpost",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "allowpost",
            "description": "True si la API key puede ejecutar peticiones POST (creación) en el recurso.",
            "widget": "checkbox"
        },
        {
            "name": "allowput",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "allowput",
            "description": "True si la API key puede ejecutar peticiones PUT (actualización) en el recurso.",
            "widget": "checkbox"
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
            "description": "Identificador interno autoincremental del registro de permiso.",
            "widget": "number"
        },
        {
            "name": "idapikey",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idapikey",
            "description": "API key a la que se concede el permiso sobre el recurso.",
            "widget": "number",
            "foreignKey": {
                "table": "api_keys",
                "column": "id",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "resource",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Recurso",
            "maxLength": 100,
            "description": "Nombre del recurso/endpoint de la API al que se aplica el permiso (ej: clientes, productos)."
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "api_key",
            "targetTable": "api_keys",
            "localColumn": "idapikey",
            "remoteColumn": "id"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default apiAccessMetadata;
