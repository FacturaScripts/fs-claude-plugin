// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const proyectoMetadata: ModelMetadata = {
    "name": "proyecto",
    "table": "proyectos",
    "endpoint": "/proyectos",
    "primaryKey": "idproyecto",
    "description": "Proyecto del plugin Proyectos: trabajo para un cliente con estado, fechas, responsable, usuarios, tareas, notas y los documentos de compra y venta vinculados, con sus totales de ventas, compras y pendiente de facturar.",
    "source": "plugin:Proyectos",
    "columns": [
        {
            "name": "codcliente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cliente",
            "maxLength": 10,
            "description": "Cliente para el que se hace el proyecto.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "clientes",
                "column": "codcliente",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.1",
                    "sinceFirstTag": true
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
            "isRequired": true,
            "label": "Descripción",
            "description": "Descripción del proyecto.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.1",
                    "sinceFirstTag": true
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
            "description": "Si el proyecto se puede modificar. Lo fija el estado: un proyecto no editable está cerrado.",
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
            "name": "fecha",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Fecha",
            "description": "Fecha de alta del proyecto.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.1",
                    "sinceFirstTag": true
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
            "description": "Fecha prevista o real de fin.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.1",
                    "sinceFirstTag": true
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
            "description": "Fecha prevista o real de inicio.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Empresa",
            "description": "Empresa del proyecto.",
            "widget": "select",
            "foreignKey": {
                "table": "empresas",
                "column": "idempresa",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
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
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Estado",
            "description": "Estado del proyecto. Decide si es editable.",
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
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idproyecto",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Identificador del proyecto.",
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
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Administrador",
            "maxLength": 50,
            "description": "Usuario responsable o creador del proyecto.",
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
            "isReadonly": true,
            "isRequired": false,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre del proyecto. Si se deja vacío se genera con el patrón de código configurado.",
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
            "name": "numdocs",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "numdocs",
            "default": 0,
            "description": "Número de documentos de compra y venta vinculados al proyecto.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "unreleased": true
                }
            ]
        },
        {
            "name": "privado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Privado",
            "description": "Si es privado: solo lo ven su responsable, los administradores y los usuarios añadidos al proyecto.",
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
            "name": "totalcompras",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Total compras",
            "default": 0,
            "description": "Total de las compras del proyecto (facturas, albaranes y pedidos de proveedor sin duplicar los ya servidos).",
            "widget": "money",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "2.2"
                }
            ]
        },
        {
            "name": "totalpendientefacturar",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Pendiente facturar",
            "default": 0,
            "description": "Neto de presupuestos, pedidos y albaranes de cliente del proyecto todavía sin facturar.",
            "widget": "money",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "3.4"
                }
            ]
        },
        {
            "name": "totalventas",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Total ventas",
            "default": 0,
            "description": "Total de las ventas del proyecto (facturas, albaranes, pedidos y presupuestos de cliente sin duplicar los ya servidos).",
            "widget": "money",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "2.2"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "belongsTo",
            "targetModel": "empresa",
            "targetTable": "empresas",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "belongsTo",
            "targetModel": "estado_proyecto",
            "targetTable": "proyectos_estados",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
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
            "localColumn": "idproyecto",
            "remoteColumn": "idproyecto"
        },
        {
            "type": "hasMany",
            "targetModel": "stock_proyecto",
            "targetTable": "proyectos_stocks",
            "localColumn": "idproyecto",
            "remoteColumn": "idproyecto"
        },
        {
            "type": "hasMany",
            "targetModel": "user_proyecto",
            "targetTable": "proyectos_users",
            "localColumn": "idproyecto",
            "remoteColumn": "idproyecto"
        },
        {
            "type": "hasMany",
            "targetModel": "tarea_proyecto",
            "targetTable": "tareas",
            "localColumn": "idproyecto",
            "remoteColumn": "idproyecto"
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
    },
    "retiredColumns": [
        {
            "name": "codalmacen",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codalmacen",
            "maxLength": 4,
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.1",
                    "sinceFirstTag": true,
                    "until": "0.5"
                }
            ]
        }
    ]
};

export default proyectoMetadata;
