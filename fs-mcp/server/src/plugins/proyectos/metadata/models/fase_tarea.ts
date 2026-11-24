// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const faseTareaMetadata: ModelMetadata = {
    "name": "fase_tarea",
    "table": "tareas_fases",
    "endpoint": "/fasetareas",
    "primaryKey": "idfase",
    "description": "Fase de las tareas de proyecto (pendiente, en proceso, completada...). Su tipo marca las tareas completadas, canceladas o en proceso, y puede llevar asociado el estado al que pasa el proyecto.",
    "source": "plugin:Proyectos",
    "columns": [
        {
            "name": "idestado",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Estado",
            "description": "Estado al que pasa el proyecto cuando una tarea entra en esta fase (con tipo, cuando todas las tareas del proyecto están en ella).",
            "widget": "select",
            "foreignKey": {
                "table": "proyectos_estados",
                "column": "idestado",
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
            "name": "idfase",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Identificador de la fase.",
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
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre de la fase.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "predeterminado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Por defecto",
            "description": "Fase que reciben las tareas nuevas. Solo puede haber una.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "tipo",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Tipo",
            "description": "Tipo de fase: 0 completada, 1 cancelada, 2 en proceso, vacío sin tipo. Cada tipo solo puede estar en una fase.",
            "widget": "select",
            "enumValues": [
                "0",
                "1",
                "2"
            ],
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "estado_proyecto",
            "targetTable": "proyectos_estados",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "hasMany",
            "targetModel": "tarea_proyecto",
            "targetTable": "tareas",
            "localColumn": "idfase",
            "remoteColumn": "idfase"
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

export default faseTareaMetadata;
