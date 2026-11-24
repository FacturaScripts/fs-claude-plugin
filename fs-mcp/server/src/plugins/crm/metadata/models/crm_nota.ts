// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const crmNotaMetadata: ModelMetadata = {
    "name": "crm_nota",
    "table": "crm_notas",
    "endpoint": "/crmnotas",
    "primaryKey": "id",
    "description": "Nota del CRM sobre un contacto, una oportunidad o un documento, con fecha, autor, interés y un aviso opcional (fecha y hora) que se notifica por email.",
    "source": "plugin:CRM",
    "columns": [
        {
            "name": "automatica",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "automatica",
            "description": "Si la nota la generó el sistema (por ejemplo, al enviar un documento por email).",
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
            "name": "documento",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "documento",
            "maxLength": 30,
            "description": "Código del documento al que se refiere la nota.",
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
            "description": "Fecha de la nota.",
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
            "name": "fechaaviso",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fecha de aviso",
            "description": "Fecha del aviso: ese día se envía un recordatorio por email al autor (o a todos si paratodos).",
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
            "name": "fecha_notificado",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha notificación",
            "description": "Fecha y hora en que se envió el aviso. Se vacía al cambiar la fecha de aviso.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.1"
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
            "description": "Hora de la nota.",
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
            "description": "Identificador de la nota.",
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
            "description": "Contacto al que se refiere la nota.",
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
            "name": "iddocumento",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Documento",
            "description": "Id del documento al que se refiere la nota.",
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
            "description": "Interés relacionado. Se añade también a los intereses del contacto.",
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
            "name": "idoportunidad",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Oportunidad",
            "description": "Oportunidad a la que pertenece la nota.",
            "widget": "select",
            "foreignKey": {
                "table": "crm_oportunidades",
                "column": "id",
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
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Autor de la nota.",
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
            "name": "notice_hour",
            "sqlType": "time",
            "tsType": "time",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Hora de aviso",
            "description": "Hora a partir de la que se envía el aviso.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.4"
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
            "isRequired": true,
            "label": "Observaciones",
            "description": "Texto de la nota.",
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
            "name": "paratodos",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Para todos",
            "description": "Si el aviso se envía a todos los usuarios y no solo al autor.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "1.4"
                }
            ]
        },
        {
            "name": "tipodocumento",
            "sqlType": "character varying(25)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Tipo",
            "maxLength": 25,
            "description": "Clase del documento al que se refiere la nota (ej. PresupuestoCliente).",
            "widget": "text",
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
            "targetModel": "contacto",
            "targetTable": "contactos",
            "localColumn": "idcontacto",
            "remoteColumn": "idcontacto"
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
            "targetModel": "crm_oportunidad",
            "targetTable": "crm_oportunidades",
            "localColumn": "idoportunidad",
            "remoteColumn": "id"
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
            "name": "avisar",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "avisar",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true,
                    "until": "2"
                }
            ]
        }
    ]
};

export default crmNotaMetadata;
