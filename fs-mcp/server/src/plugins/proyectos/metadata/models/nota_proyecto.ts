// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const notaProyectoMetadata: ModelMetadata = {
    "name": "nota_proyecto",
    "table": "proyectos_notas",
    "endpoint": "/notaproyectos",
    "primaryKey": "idnota",
    "description": "Nota de un proyecto o de una de sus tareas, con autor y fecha.",
    "source": "plugin:Proyectos",
    "columns": [
        {
            "name": "descripcion",
            "sqlType": "text",
            "tsType": "text",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "description": "Texto de la nota.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "1.21"
                }
            ]
        },
        {
            "name": "fecha",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Fecha",
            "description": "Fecha y hora de la nota.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "1.21"
                }
            ]
        },
        {
            "name": "idproyecto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Proyecto",
            "description": "Proyecto al que pertenece la nota.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "proyectos",
                "column": "idproyecto",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "1.21"
                }
            ]
        },
        {
            "name": "idtarea",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Tarea",
            "description": "Tarea del proyecto a la que se refiere la nota (opcional).",
            "widget": "select",
            "foreignKey": {
                "table": "tareas",
                "column": "idtarea",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "1.21"
                }
            ]
        },
        {
            "name": "idnota",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Identificador de la nota.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "1.21"
                }
            ]
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Autor de la nota.",
            "widget": "text",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "1.21"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "tarea_proyecto",
            "targetTable": "tareas",
            "localColumn": "idtarea",
            "remoteColumn": "idtarea"
        },
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "belongsTo",
            "targetModel": "proyecto",
            "targetTable": "proyectos",
            "localColumn": "idproyecto",
            "remoteColumn": "idproyecto"
        }
    ],
    "availability": [
        {
            "source": "plugin:Proyectos",
            "since": "1.21"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-11-24T12:34:05.273Z",
        "facturascriptsCommit": "7aa596470",
        "facturascriptsVersion": "plugin:Proyectos@bfa7881",
        "versions": {
            "plugin:Proyectos": {
                "latest": "4.2",
                "tags": 36
            }
        }
    }
};

export default notaProyectoMetadata;
