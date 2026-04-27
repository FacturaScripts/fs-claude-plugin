// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const logMessageMetadata: ModelMetadata = {
    "name": "log_message",
    "table": "logs",
    "endpoint": "/logmessages",
    "primaryKey": "id",
    "description": "Mensaje de log del sistema (info, warning, error, audit). Útil para auditoría.",
    "source": "core",
    "columns": [
        {
            "name": "channel",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Canal",
            "maxLength": 40,
            "description": "Canal del mensaje (audit, error, security, etc.)."
        },
        {
            "name": "context",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Contexto",
            "description": "Información adicional en JSON con detalles del contexto del log.",
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
            "description": "Identificador interno autoincremental del mensaje.",
            "widget": "number"
        },
        {
            "name": "idcontacto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idcontacto",
            "description": "ID del contacto asociado al evento, si aplica.",
            "widget": "number"
        },
        {
            "name": "ip",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "IP",
            "maxLength": 40,
            "description": "Dirección IP desde la que se originó el evento."
        },
        {
            "name": "level",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nivel",
            "maxLength": 15,
            "description": "Nivel del mensaje (info, warning, error, critical, audit)."
        },
        {
            "name": "message",
            "sqlType": "text",
            "tsType": "text",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Mensaje",
            "description": "Texto del mensaje del log.",
            "widget": "textarea"
        },
        {
            "name": "model",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Modelo",
            "maxLength": 30,
            "description": "Nombre del modelo afectado por el evento, si aplica."
        },
        {
            "name": "modelcode",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "modelcode",
            "maxLength": 40,
            "description": "Código del registro del modelo afectado."
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Usuario (nick) que generó el evento."
        },
        {
            "name": "time",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Hora",
            "description": "Fecha y hora exacta del evento.",
            "widget": "datetime"
        },
        {
            "name": "uri",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "uri",
            "maxLength": 200,
            "description": "URL/ruta de la petición HTTP que originó el evento."
        }
    ],
    "relations": [],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default logMessageMetadata;
