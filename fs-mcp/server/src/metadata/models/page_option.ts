// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const pageOptionMetadata: ModelMetadata = {
    "name": "page_option",
    "table": "pages_options",
    "endpoint": "/pageoptions",
    "primaryKey": "id",
    "description": "Configuración personalizada (columnas visibles, anchos…) de una página por usuario o rol.",
    "source": "core",
    "columns": [
        {
            "name": "columns",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Columnas",
            "description": "Configuración de columnas (visibilidad, anchos, orden) en formato JSON.",
            "widget": "textarea"
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
            "description": "Identificador interno autoincremental de la configuración.",
            "widget": "number"
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
            "description": "Fecha y hora de la última modificación de esta configuración.",
            "widget": "datetime"
        },
        {
            "name": "modals",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "modals",
            "description": "Configuración de modales asociados a la página, en formato JSON.",
            "widget": "textarea"
        },
        {
            "name": "name",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 40,
            "description": "Nombre del controlador/página al que aplica."
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
            "description": "Usuario al que pertenece la configuración personalizada (vacío si es global).",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "rows",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "rows",
            "description": "Configuración de filas adicionales (status, statistics, footer) en formato JSON.",
            "widget": "textarea"
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
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default pageOptionMetadata;
