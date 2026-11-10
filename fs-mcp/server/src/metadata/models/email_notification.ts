// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const emailNotificationMetadata: ModelMetadata = {
    "name": "email_notification",
    "table": "emails_notifications",
    "endpoint": "/emailnotifications",
    "primaryKey": "name",
    "description": "Plantilla de notificación por email (asunto, cuerpo) usada para envíos automáticos.",
    "source": "core",
    "columns": [
        {
            "name": "body",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Mensaje",
            "description": "Cuerpo de la plantilla de email. Admite variables tipo {{nombre}}, {{total}}.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.81"
                }
            ]
        },
        {
            "name": "creationdate",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha",
            "description": "Fecha de creación de la plantilla.",
            "widget": "date",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.81"
                }
            ]
        },
        {
            "name": "enabled",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "description": "True si la plantilla está activa y disponible para envíos.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.81"
                }
            ]
        },
        {
            "name": "name",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre identificador de la plantilla (ej: 'invoice-sent').",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.81"
                }
            ]
        },
        {
            "name": "subject",
            "sqlType": "character varying(150)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Asunto",
            "maxLength": 150,
            "description": "Asunto del email. Admite variables tipo {{numero}}.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.81"
                }
            ]
        }
    ],
    "relations": [],
    "availability": [
        {
            "source": "core",
            "since": "2021.81"
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

export default emailNotificationMetadata;
