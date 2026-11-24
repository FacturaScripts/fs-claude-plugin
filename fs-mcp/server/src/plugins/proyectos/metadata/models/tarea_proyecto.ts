// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const tareaProyectoMetadata: ModelMetadata = {
    "name": "tarea_proyecto",
    "table": "tareas",
    "endpoint": "/tareaproyectos",
    "primaryKey": "idtarea",
    "description": "Tarea de un proyecto, con fase, usuario asignado, fechas de inicio, fin y completado. Al cambiar de fase puede cambiar el estado del proyecto.",
    "source": "plugin:Proyectos",
    "columns": [
        {
            "name": "cantidad",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Cantidad",
            "description": "Cantidad o unidades de la tarea (por ejemplo, horas estimadas).",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "descripcion",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Descripción",
            "description": "Descripción de la tarea.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "fecha",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Fecha",
            "description": "Fecha de alta de la tarea.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "fechacompletado",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha de completado",
            "description": "Fecha y hora en que la tarea pasó a una fase de tipo completada. Se rellena sola.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "unreleased": true
                }
            ]
        },
        {
            "name": "fechafin",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fecha fin",
            "description": "Fecha límite o de fin. Una tarea abierta con fecha fin pasada está vencida.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "fechainicio",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fecha inicio",
            "description": "Fecha de inicio prevista o real.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "idfase",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Fase",
            "description": "Fase de la tarea. Al cambiarla puede cambiar el estado del proyecto.",
            "widget": "select",
            "foreignKey": {
                "table": "tareas_fases",
                "column": "idfase",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
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
            "description": "Proyecto al que pertenece la tarea.",
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
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "idtarea",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Identificador de la tarea.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
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
            "label": "Título",
            "maxLength": 100,
            "description": "Nombre de la tarea.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
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
            "description": "Usuario asignado a la tarea. Recibe un email al asignársela y al cambiar de fase.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "unreleased": true
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "proyecto",
            "targetTable": "proyectos",
            "localColumn": "idproyecto",
            "remoteColumn": "idproyecto"
        },
        {
            "type": "belongsTo",
            "targetModel": "fase_tarea",
            "targetTable": "tareas_fases",
            "localColumn": "idfase",
            "remoteColumn": "idfase"
        },
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "nota_proyecto",
            "targetTable": "proyectos_notas",
            "localColumn": "idtarea",
            "remoteColumn": "idtarea"
        }
    ],
    "availability": [
        {
            "source": "plugin:Proyectos",
            "since": "0.7"
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

export default tareaProyectoMetadata;
