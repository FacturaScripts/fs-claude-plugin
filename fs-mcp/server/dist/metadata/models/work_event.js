// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const workEventMetadata = {
    "name": "work_event",
    "table": "work_events",
    "endpoint": "/workeventes",
    "primaryKey": "id",
    "description": "Evento de trabajo asíncrono encolado para que un worker lo procese (ej: creación de asiento).",
    "source": "core",
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
            "description": "Fecha y hora en la que se encoló el evento.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.16"
                }
            ]
        },
        {
            "name": "done",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Realizado",
            "default": false,
            "description": "True si el evento ya ha sido procesado por algún worker.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.16"
                }
            ]
        },
        {
            "name": "done_date",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha finalización",
            "description": "Fecha y hora en la que se completó el procesamiento.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.16"
                }
            ]
        },
        {
            "name": "execution_time",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Duración",
            "description": "Tiempo total de ejecución del evento (en segundos).",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2025.63"
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
            "description": "Identificador interno autoincremental del evento.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.16"
                }
            ]
        },
        {
            "name": "name",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre del evento (ej: 'Model.Insert.Cliente', 'Document.Approved').",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.16"
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
            "description": "Usuario que originó el evento.",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.16"
                }
            ]
        },
        {
            "name": "params",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "params",
            "description": "Parámetros del evento en formato JSON.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.16"
                }
            ]
        },
        {
            "name": "value",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Valor",
            "maxLength": 100,
            "description": "Valor identificativo del registro asociado al evento.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.16"
                }
            ]
        },
        {
            "name": "workers",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "workers",
            "description": "Número de workers que ya han procesado el evento.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.16"
                }
            ]
        },
        {
            "name": "worker_list",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "worker_list",
            "maxLength": 200,
            "description": "Lista (separada por comas) de los workers que han procesado el evento.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.16"
                }
            ]
        }
    ],
    "relations": [],
    "availability": [
        {
            "source": "core",
            "since": "2023.16"
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
export default workEventMetadata;
//# sourceMappingURL=work_event.js.map