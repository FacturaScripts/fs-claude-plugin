// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const crmCampaignEmailMetadata: ModelMetadata = {
    "name": "crm_campaign_email",
    "table": "crm_campaigns_emails",
    "endpoint": "/crmcampaignemailes",
    "primaryKey": "id",
    "description": "Destinatario de una campaña de email del CRM: email, contacto, cuenta de salida, si ya se ha enviado (fecha) y si lo ha abierto.",
    "source": "plugin:CRM",
    "columns": [
        {
            "name": "creation_date",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Fecha creación",
            "description": "Fecha y hora en que se añadió a la campaña.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.9"
                }
            ]
        },
        {
            "name": "email",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Email",
            "maxLength": 100,
            "description": "Email al que se envía.",
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
            "description": "Identificador del destinatario en la campaña.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.9"
                }
            ]
        },
        {
            "name": "id_campaign",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "id_campaign",
            "description": "Campaña.",
            "widget": "number",
            "foreignKey": {
                "table": "crm_campaigns",
                "column": "id",
                "onDelete": "CASCADE",
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
            "name": "id_contacto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "id_contacto",
            "description": "Contacto del destinatario.",
            "widget": "number",
            "foreignKey": {
                "table": "contactos",
                "column": "idcontacto",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3"
                }
            ]
        },
        {
            "name": "outgoing_email",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "outgoing_email",
            "maxLength": 100,
            "description": "Cuenta de correo de salida con la que se envía (vacío: la predeterminada).",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.9"
                }
            ]
        },
        {
            "name": "sent",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Enviado",
            "description": "Fecha y hora de envío; vacío si aún no se ha enviado.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "2.9"
                }
            ]
        },
        {
            "name": "opened",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Abierto",
            "default": false,
            "description": "Si el destinatario ha abierto el email.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.3"
                }
            ]
        },
        {
            "name": "verificode",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "verificode",
            "maxLength": 100,
            "description": "Código de seguimiento del email enviado.",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "3.3"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "crm_campaign",
            "targetTable": "crm_campaigns",
            "localColumn": "id_campaign",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "contacto",
            "targetTable": "contactos",
            "localColumn": "id_contacto",
            "remoteColumn": "idcontacto"
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
    }
};

export default crmCampaignEmailMetadata;
