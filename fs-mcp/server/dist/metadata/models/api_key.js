// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const apiKeyMetadata = {
    "name": "api_key",
    "table": "api_keys",
    "endpoint": "/apikeyes",
    "primaryKey": "id",
    "description": "Clave de API para autenticar peticiones REST contra FacturaScripts.",
    "source": "core",
    "columns": [
        {
            "name": "apikey",
            "sqlType": "character varying(99)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Clave API",
            "maxLength": 99,
            "description": "Token de la clave de API. Se envía en el header `Token` de las peticiones HTTP para autenticarse.",
            "widget": "password",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "creationdate",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Creado",
            "description": "Fecha de creación de la API key.",
            "widget": "date",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "description",
            "sqlType": "character varying(150)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 150,
            "description": "Descripción libre de la API key (uso, sistema al que pertenece).",
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
            "name": "enabled",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Activo",
            "description": "True si la API key está activa; false si se ha deshabilitado.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "fullaccess",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Acceso completo",
            "default": false,
            "description": "True si la API key tiene acceso completo (CRUD) sobre todos los recursos sin necesidad de api_access individuales.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.11"
                }
            ]
        },
        {
            "name": "lastactivity",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Última conexión",
            "description": "Fecha y hora de la última petición realizada con esta API key.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.1"
                }
            ]
        },
        {
            "name": "lastip",
            "sqlType": "character varying(45)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Última IP",
            "maxLength": 45,
            "description": "Dirección IP desde la que se usó la API key por última vez.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.3"
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
            "description": "Identificador interno autoincremental de la API key.",
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
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Creado por",
            "maxLength": 50,
            "description": "Usuario al que pertenece la API key.",
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
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "api_access",
            "targetTable": "api_access",
            "localColumn": "id",
            "remoteColumn": "idapikey"
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
export default apiKeyMetadata;
//# sourceMappingURL=api_key.js.map