// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const logMessageMetadata = {
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
            "description": "Canal del mensaje (audit, error, security, etc.).",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.11"
                }
            ]
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
            "widget": "textarea",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.51"
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
            "description": "Identificador interno autoincremental del mensaje.",
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
            "name": "idcontacto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idcontacto",
            "description": "ID del contacto asociado al evento, si aplica.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.51"
                }
            ]
        },
        {
            "name": "ip",
            "sqlType": "character varying(45)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "IP",
            "maxLength": 45,
            "description": "Dirección IP desde la que se originó el evento.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "description": "Nivel del mensaje (info, warning, error, critical, audit).",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "name": "model",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Modelo",
            "maxLength": 30,
            "description": "Nombre del modelo afectado por el evento, si aplica.",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.51"
                }
            ]
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
            "description": "Código del registro del modelo afectado.",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.51"
                }
            ]
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
            "description": "Usuario (nick) que generó el evento.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "name": "uri",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "uri",
            "maxLength": 200,
            "description": "URL/ruta de la petición HTTP que originó el evento.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        }
    ],
    "relations": [],
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
export default logMessageMetadata;
//# sourceMappingURL=log_message.js.map