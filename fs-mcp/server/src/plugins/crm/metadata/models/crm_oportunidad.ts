// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const crmOportunidadMetadata: ModelMetadata = {
    "name": "crm_oportunidad",
    "table": "crm_oportunidades",
    "endpoint": "/crmoportunidades",
    "primaryKey": "id",
    "description": "Oportunidad de negocio del CRM: posible venta a un contacto con estado, interés, fuente, usuario asignado, agente, importe aproximado y, cuando se presupuesta, el presupuesto de cliente vinculado con su neto.",
    "source": "plugin:CRM",
    "columns": [
        {
            "name": "precio_aprox",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Precio aproximado",
            "description": "Importe aproximado estimado de la venta, antes de presupuestarla.",
            "widget": "money",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.5"
                }
            ]
        },
        {
            "name": "asignado",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Asignado",
            "maxLength": 50,
            "description": "Usuario asignado para gestionar la oportunidad. Recibe un email al asignársela.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "1.6"
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
            "description": "Agente comercial de la oportunidad. Si se omite, el del contacto.",
            "widget": "select",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "coddivisa",
            "sqlType": "character varying(3)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "coddivisa",
            "maxLength": 3,
            "description": "Divisa del presupuesto vinculado.",
            "availability": [
                {
                    "source": "plugin:CRM",
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
            "description": "Descripción de la oportunidad: qué quiere el contacto.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:CRM",
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
            "description": "Si la oportunidad sigue abierta. Lo fija el estado.",
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
            "name": "fecha",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Fecha",
            "description": "Fecha de alta de la oportunidad.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "fechamod",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Última modificación",
            "description": "Fecha y hora de la última modificación.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "fecha_cierre",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha cierre",
            "description": "Fecha en que la oportunidad pasó a un estado cerrado (no editable).",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "hora",
            "sqlType": "time without time zone",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Hora",
            "description": "Hora de alta de la oportunidad.",
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
            "description": "Número de la oportunidad.",
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
            "name": "idcontacto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Contacto",
            "description": "Contacto al que se quiere vender. Su cliente asociado es el del presupuesto.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "contactos",
                "column": "idcontacto",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idestado",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Estado",
            "description": "Estado de la oportunidad. Al cambiarlo se actualizan editable y rechazado y, si el estado la cierra, la fecha de cierre.",
            "widget": "select",
            "foreignKey": {
                "table": "crm_oportunidades_estados",
                "column": "id",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idfuente",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idfuente",
            "description": "Fuente por la que llegó la oportunidad.",
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
            "name": "idinteres",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Interés",
            "description": "Interés del contacto en esta oportunidad. Se añade también a los intereses del contacto.",
            "widget": "select",
            "foreignKey": {
                "table": "crm_intereses",
                "column": "id",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idpresupuesto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idpresupuesto",
            "description": "Presupuesto de cliente vinculado a la oportunidad.",
            "widget": "number",
            "foreignKey": {
                "table": "presupuestoscli",
                "column": "idpresupuesto",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "neto",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "neto",
            "description": "Neto del presupuesto vinculado, en su divisa. Se actualiza al guardar el presupuesto.",
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
            "name": "netoeuros",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "netoeuros",
            "description": "Neto del presupuesto vinculado convertido a la divisa principal.",
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
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Usuario que creó la oportunidad.",
            "widget": "select",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "observaciones",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Observaciones",
            "description": "Observaciones internas.",
            "widget": "textarea",
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
            "label": "rechazado",
            "description": "Si la oportunidad se ha perdido o rechazado. Lo fija el estado.",
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
            "name": "tasaconv",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "tasaconv",
            "description": "Tasa de conversión de la divisa del presupuesto vinculado.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "asignado",
            "remoteColumn": "nick"
        },
        {
            "type": "belongsTo",
            "targetModel": "contacto",
            "targetTable": "contactos",
            "localColumn": "idcontacto",
            "remoteColumn": "idcontacto"
        },
        {
            "type": "belongsTo",
            "targetModel": "crm_oportunidad_estado",
            "targetTable": "crm_oportunidades_estados",
            "localColumn": "idestado",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "crm_interes",
            "targetTable": "crm_intereses",
            "localColumn": "idinteres",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "idpresupuesto",
            "remoteColumn": "idpresupuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "crm_nota",
            "targetTable": "crm_notas",
            "localColumn": "id",
            "remoteColumn": "idoportunidad"
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
    },
    "retiredColumns": [
        {
            "name": "approximate_price",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "approximate_price",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.4",
                    "until": "2.4"
                }
            ]
        }
    ]
};

export default crmOportunidadMetadata;
