// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const estadoProyectoMetadata: ModelMetadata = {
    "name": "estado_proyecto",
    "table": "proyectos_estados",
    "endpoint": "/estadoproyectos",
    "primaryKey": "idestado",
    "description": "Estado de los proyectos (abierto, en curso, terminado...). Decide si el proyecto es editable; uno es el predeterminado de los proyectos nuevos.",
    "source": "plugin:Proyectos",
    "columns": [
        {
            "name": "color",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Color",
            "maxLength": 10,
            "description": "Color con el que se muestra el estado.",
            "widget": "select",
            "enumValues": [
                "primary",
                "secondary",
                "success",
                "danger",
                "warning",
                "info",
                "light",
                "dark"
            ],
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "3.92"
                }
            ]
        },
        {
            "name": "editable",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Editable",
            "description": "Si los proyectos en este estado se pueden modificar. Un estado no editable equivale a un proyecto cerrado.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idestado",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Identificador del estado.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre del estado.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.1",
                    "sinceFirstTag": true
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
            "description": "Estado que reciben los proyectos nuevos. Solo puede haber uno.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "proyecto",
            "targetTable": "proyectos",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "hasMany",
            "targetModel": "fase_tarea",
            "targetTable": "tareas_fases",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        }
    ],
    "availability": [
        {
            "source": "plugin:Proyectos",
            "since": "0.1",
            "sinceFirstTag": true
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

export default estadoProyectoMetadata;
