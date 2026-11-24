// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const maquinaAtMetadata: ModelMetadata = {
    "name": "maquina_at",
    "table": "serviciosat_maquinas",
    "endpoint": "/maquinaates",
    "primaryKey": "idmaquina",
    "description": "Máquina o equipo de un cliente sobre el que se prestan servicios SAT, con número de serie, fabricante y referencia de producto.",
    "source": "plugin:Servicios",
    "columns": [
        {
            "name": "activo",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "default": true,
            "description": "Si la máquina sigue en uso. Las inactivas se conservan para el historial.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.3"
                }
            ]
        },
        {
            "name": "codagente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Agente",
            "maxLength": 10,
            "description": "Agente asociado a la máquina.",
            "widget": "select",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
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
            "description": "Cliente propietario de la máquina.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "clientes",
                "column": "codcliente",
                "onDelete": "RESTRICT",
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
            "name": "codfabricante",
            "sqlType": "character varying(8)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fabricante",
            "maxLength": 8,
            "description": "Fabricante de la máquina.",
            "widget": "select",
            "foreignKey": {
                "table": "fabricantes",
                "column": "codfabricante",
                "onDelete": "SET NULL",
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
            "name": "descripcion",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Descripción",
            "description": "Descripción de la máquina.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "fecha",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fecha",
            "description": "Fecha de alta de la máquina.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idmaquina",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Identificador de la máquina.",
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
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre o modelo de la máquina.",
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
            "name": "numserie",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Número de Serie",
            "maxLength": 100,
            "description": "Número de serie de la máquina.",
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
            "name": "referencia",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Referencia",
            "maxLength": 30,
            "description": "Referencia del producto del catálogo que corresponde a la máquina.",
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
            "type": "belongsTo",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "belongsTo",
            "targetModel": "fabricante",
            "targetTable": "fabricantes",
            "localColumn": "codfabricante",
            "remoteColumn": "codfabricante"
        },
        {
            "type": "hasMany",
            "targetModel": "servicio_at",
            "targetTable": "serviciosat",
            "localColumn": "idmaquina",
            "remoteColumn": "idmaquina"
        },
        {
            "type": "hasMany",
            "targetModel": "servicio_at",
            "targetTable": "serviciosat",
            "localColumn": "idmaquina",
            "remoteColumn": "idmaquina2"
        },
        {
            "type": "hasMany",
            "targetModel": "servicio_at",
            "targetTable": "serviciosat",
            "localColumn": "idmaquina",
            "remoteColumn": "idmaquina3"
        },
        {
            "type": "hasMany",
            "targetModel": "servicio_at",
            "targetTable": "serviciosat",
            "localColumn": "idmaquina",
            "remoteColumn": "idmaquina4"
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

export default maquinaAtMetadata;
