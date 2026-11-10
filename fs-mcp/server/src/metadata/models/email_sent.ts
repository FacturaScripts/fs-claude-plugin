// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const emailSentMetadata: ModelMetadata = {
    "name": "email_sent",
    "table": "emails_sent",
    "endpoint": "/emailsentes",
    "primaryKey": "id",
    "description": "Registro histórico de emails enviados desde el sistema.",
    "source": "core",
    "columns": [
        {
            "name": "addressee",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Para",
            "maxLength": 100,
            "description": "Dirección de email del destinatario.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "attachment",
            "sqlType": "bool",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "attachment",
            "default": "false",
            "description": "Lista de archivos adjuntos del email.",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.08"
                }
            ]
        },
        {
            "name": "body",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Mensaje",
            "description": "Cuerpo del email enviado (texto plano).",
            "widget": "textarea",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "date",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Fecha",
            "description": "Fecha y hora de envío del email.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "email_from",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Desde",
            "maxLength": 100,
            "description": "Dirección de email del remitente.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.08"
                }
            ]
        },
        {
            "name": "html",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "html",
            "description": "Cuerpo del email en formato HTML.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.08"
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
            "description": "Identificador interno autoincremental del email enviado.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
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
            "description": "Usuario que envió el email.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
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
            "description": "True si el email ha sido abierto por el destinatario (tracking).",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.11"
                }
            ]
        },
        {
            "name": "notification",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Notificación",
            "maxLength": 100,
            "description": "Nombre de la notificación por email que originó el envío. Vacío si el email se envió manualmente.",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.65"
                }
            ]
        },
        {
            "name": "subject",
            "sqlType": "character varying(300)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Asunto",
            "maxLength": 300,
            "description": "Asunto del email enviado.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "uuid",
            "sqlType": "character varying(13)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "uuid",
            "maxLength": 13,
            "description": "Identificador único corto del email para tracking de aperturas y respuestas.",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.08"
                }
            ]
        },
        {
            "name": "verificode",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "verificode",
            "maxLength": 20,
            "description": "Código de verificación generado para confirmar acciones desde el email.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.11"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        }
    ],
    "availability": [
        {
            "source": "core",
            "since": "2018.03",
            "sinceFirstTag": true
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-10-07T17:38:31.723Z",
        "facturascriptsCommit": "93a6a74ac",
        "versions": {
            "core": {
                "latest": "2026.7",
                "tags": 67
            }
        }
    }
};

export default emailSentMetadata;
