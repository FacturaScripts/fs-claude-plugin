// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const crmCampaignMetadata: ModelMetadata = {
    "name": "crm_campaign",
    "table": "crm_campaigns",
    "endpoint": "/crmcampaignes",
    "primaryKey": "id",
    "description": "Campaña de email del CRM, con asunto, contenido, estado, días y horas de envío y estadísticas de emails enviados y abiertos.",
    "source": "plugin:CRM",
    "columns": [
        {
            "name": "content",
            "sqlType": "text",
            "tsType": "text",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Contenido del email",
            "maxLength": 5000,
            "description": "Contenido HTML de los emails.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.9"
                }
            ]
        },
        {
            "name": "creation_date",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Fecha creación",
            "description": "Fecha y hora de alta.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.9"
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
            "label": "Id.",
            "description": "Identificador de la campaña.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.9"
                }
            ]
        },
        {
            "name": "last_nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Último usuario",
            "maxLength": 50,
            "description": "Usuario que la modificó por última vez.",
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
                    "since": "2.9"
                }
            ]
        },
        {
            "name": "last_update",
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
                    "since": "2.9"
                }
            ]
        },
        {
            "name": "name",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre interno de la campaña.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.9"
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
            "description": "Usuario que creó la campaña.",
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
                    "since": "2.9"
                }
            ]
        },
        {
            "name": "num_emails",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Emails",
            "description": "Emails que tiene que enviar la campaña.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3"
                }
            ]
        },
        {
            "name": "num_sent",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Enviado",
            "description": "Emails ya enviados.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3"
                }
            ]
        },
        {
            "name": "num_opened",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "num_opened",
            "default": 0,
            "description": "Emails abiertos por los destinatarios.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.3"
                }
            ]
        },
        {
            "name": "status",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Estado",
            "default": 0,
            "description": "Estado de la campaña: 0 borrador (no se envía), 1 enviando (el cron la envía en su horario) y 2 enviada.",
            "widget": "select",
            "enumValues": [
                "0",
                "1",
                "2"
            ],
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3"
                }
            ]
        },
        {
            "name": "send_end_hour",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Hora fin",
            "description": "Hora hasta la que se envía.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.21"
                }
            ]
        },
        {
            "name": "send_friday",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Viernes",
            "default": false,
            "description": "Enviar los viernes.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.41"
                }
            ]
        },
        {
            "name": "send_monday",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Lunes",
            "default": false,
            "description": "Enviar los lunes.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.41"
                }
            ]
        },
        {
            "name": "send_saturday",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Sábado",
            "default": false,
            "description": "Enviar los sábados.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.41"
                }
            ]
        },
        {
            "name": "send_start_hour",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Hora de inicio",
            "description": "Hora a partir de la que se envía.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.21"
                }
            ]
        },
        {
            "name": "send_sunday",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Domingo",
            "default": false,
            "description": "Enviar los domingos.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.41"
                }
            ]
        },
        {
            "name": "send_thursday",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Jueves",
            "default": false,
            "description": "Enviar los jueves.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.41"
                }
            ]
        },
        {
            "name": "send_tuesday",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Martes",
            "default": false,
            "description": "Enviar los martes.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.41"
                }
            ]
        },
        {
            "name": "send_wednesday",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Miércoles",
            "default": false,
            "description": "Enviar los miércoles.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.41"
                }
            ]
        },
        {
            "name": "subject",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Asunto del email",
            "maxLength": 200,
            "description": "Asunto de los emails.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.9"
                }
            ]
        },
        {
            "name": "unsubscribe_link",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Incluir enlace de baja",
            "default": true,
            "description": "Si los emails incluyen el enlace para darse de baja.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "unreleased": true
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "last_nick",
            "remoteColumn": "nick"
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
            "targetModel": "crm_campaign_email",
            "targetTable": "crm_campaigns_emails",
            "localColumn": "id",
            "remoteColumn": "id_campaign"
        }
    ],
    "availability": [
        {
            "source": "plugin:CRM",
            "since": "2.9"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-11-25T11:43:24.209Z",
        "facturascriptsCommit": "49b30cf3a",
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
            "name": "completed",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Completado",
            "default": false,
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.9",
                    "until": "2.9"
                }
            ]
        }
    ]
};

export default crmCampaignMetadata;
