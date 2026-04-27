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
            "label": "API key",
            "maxLength": 99,
            "description": "Token de la clave de API. Se envía en el header `Token` de las peticiones HTTP para autenticarse.",
            "widget": "password"
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
            "widget": "date"
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
            "widget": "text"
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
            "widget": "checkbox"
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
            "widget": "checkbox"
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
            "widget": "datetime"
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
            "widget": "text"
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Usuario al que pertenece la API key.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
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
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default apiKeyMetadata;
//# sourceMappingURL=api_key.js.map