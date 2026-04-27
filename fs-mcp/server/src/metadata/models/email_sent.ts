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
            "widget": "text"
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
            "description": "Lista de archivos adjuntos del email."
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
            "widget": "textarea"
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
            "widget": "datetime"
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
            "widget": "text"
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
            "widget": "textarea"
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
            "widget": "number"
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
            }
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
            "widget": "checkbox"
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
            "widget": "text"
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
            "description": "Identificador único corto del email para tracking de aperturas y respuestas."
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
            "description": "Código de verificación generado para confirmar acciones desde el email."
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
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default emailSentMetadata;
