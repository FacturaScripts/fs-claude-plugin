// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const crmOportunidadEstadoMetadata: ModelMetadata = {
    "name": "crm_oportunidad_estado",
    "table": "crm_oportunidades_estados",
    "endpoint": "/crmoportunidadestados",
    "primaryKey": "id",
    "description": "Estado de las oportunidades del CRM (nueva, en negociación, ganada, perdida...). Decide si la oportunidad sigue abierta (editable) y si cuenta como rechazada; su orden es el del embudo de ventas.",
    "source": "plugin:CRM",
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
            "description": "Color con el que se muestra.",
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
                    "source": "plugin:CRM",
                    "since": "1.6"
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
            "description": "Si las oportunidades en este estado siguen abiertas. false equivale a cerrada (ganada o perdida).",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "icon",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Icono",
            "maxLength": 50,
            "description": "Icono con el que se muestra.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "id",
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
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "nombre",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 50,
            "description": "Nombre del estado.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "orden",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Orden",
            "description": "Posición del estado en el embudo de ventas.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:CRM",
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
            "description": "Estado de las oportunidades nuevas.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "rechazado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Rechazado",
            "description": "Si las oportunidades en este estado cuentan como perdidas o rechazadas.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "tab",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Mostrar pestaña",
            "default": true,
            "description": "Si el estado tiene su propia pestaña en el listado de oportunidades.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "1.6"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "crm_oportunidad",
            "targetTable": "crm_oportunidades",
            "localColumn": "id",
            "remoteColumn": "idestado"
        }
    ],
    "availability": [
        {
            "source": "plugin:CRM",
            "since": "0.1",
            "sinceFirstTag": true
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-11-24T12:56:34.504Z",
        "facturascriptsCommit": "7aa596470",
        "facturascriptsVersion": "plugin:CRM@16399b9",
        "versions": {
            "plugin:CRM": {
                "latest": "3.44",
                "tags": 33
            }
        }
    }
};

export default crmOportunidadEstadoMetadata;
