// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const userMetadata = {
    "name": "user",
    "table": "users",
    "endpoint": "/users",
    "primaryKey": "nick",
    "description": "Usuario del sistema. Tiene credenciales, rol y empresa asignada.",
    "source": "core",
    "columns": [
        {
            "name": "admin",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Es administrador",
            "default": false,
            "description": "True si el usuario es administrador con acceso completo al sistema.",
            "widget": "checkbox"
        },
        {
            "name": "codagente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Agente",
            "maxLength": 10,
            "description": "Código del agente comercial vinculado al usuario, si aplica.",
            "widget": "select"
        },
        {
            "name": "codalmacen",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Almacén",
            "maxLength": 4,
            "description": "Almacén por defecto desde el que opera el usuario.",
            "widget": "select"
        },
        {
            "name": "codserie",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Serie",
            "maxLength": 4,
            "description": "Serie de numeración por defecto que el usuario aplica al crear documentos.",
            "widget": "select",
            "foreignKey": {
                "table": "series",
                "column": "codserie",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "creationdate",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha de creación",
            "description": "Fecha de creación del usuario.",
            "widget": "date"
        },
        {
            "name": "email",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Email",
            "maxLength": 100,
            "description": "Email del usuario para notificaciones y recuperación de contraseña.",
            "widget": "email"
        },
        {
            "name": "enabled",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "default": true,
            "description": "True si el usuario está activo; false si está deshabilitado.",
            "widget": "checkbox"
        },
        {
            "name": "homepage",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Página de inicio",
            "maxLength": 30,
            "description": "Página de inicio del usuario al hacer login en el sistema.",
            "widget": "select",
            "foreignKey": {
                "table": "pages",
                "column": "name",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Empresa",
            "description": "Empresa por defecto del usuario.",
            "widget": "select",
            "foreignKey": {
                "table": "empresas",
                "column": "idempresa",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "langcode",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Idioma",
            "maxLength": 10,
            "description": "Código de idioma preferido del usuario (es_ES, en_US, etc.).",
            "widget": "select"
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
            "description": "Fecha y hora de la última actividad del usuario en el sistema.",
            "widget": "datetime"
        },
        {
            "name": "lastbrowser",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Navegador",
            "maxLength": 200,
            "description": "Cadena User-Agent del navegador de la última conexión.",
            "widget": "textarea"
        },
        {
            "name": "lastip",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Última IP",
            "maxLength": 40,
            "description": "Dirección IP de la última conexión.",
            "widget": "text"
        },
        {
            "name": "level",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Nivel",
            "description": "Nivel de privilegios numérico del usuario (mayor número, más privilegios).",
            "widget": "number"
        },
        {
            "name": "logkey",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "logkey",
            "maxLength": 100,
            "description": "Clave de sesión actual del usuario, usada para la cookie de login."
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Nombre de usuario único usado para login.",
            "widget": "text"
        },
        {
            "name": "password",
            "sqlType": "character varying(255)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Contraseña",
            "maxLength": 255,
            "description": "Hash de la contraseña del usuario (no se guarda en texto plano)."
        },
        {
            "name": "two_factor_enabled",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "two_factor_enabled",
            "default": false,
            "description": "True si el usuario tiene activada la autenticación en dos pasos.",
            "widget": "checkbox"
        },
        {
            "name": "two_factor_secret_key",
            "sqlType": "character varying(32)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "two_factor_secret_key",
            "maxLength": 32,
            "description": "Clave secreta usada para generar los códigos TOTP del 2FA."
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "page",
            "targetTable": "pages",
            "localColumn": "homepage",
            "remoteColumn": "name"
        },
        {
            "type": "belongsTo",
            "targetModel": "empresa",
            "targetTable": "empresas",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "belongsTo",
            "targetModel": "serie",
            "targetTable": "series",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_proveedor",
            "targetTable": "albaranesprov",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "api_key",
            "targetTable": "api_keys",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "attached_file_relation",
            "targetTable": "attached_files_rel",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "ciudad",
            "targetTable": "ciudades",
            "localColumn": "nick",
            "remoteColumn": "last_nick"
        },
        {
            "type": "hasMany",
            "targetModel": "ciudad",
            "targetTable": "ciudades",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "codigo_postal",
            "targetTable": "codigos_postales",
            "localColumn": "nick",
            "remoteColumn": "last_nick"
        },
        {
            "type": "hasMany",
            "targetModel": "codigo_postal",
            "targetTable": "codigos_postales",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "email_sent",
            "targetTable": "emails_sent",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "page_filter",
            "targetTable": "pages_filters",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "page_option",
            "targetTable": "pages_options",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "pais",
            "targetTable": "paises",
            "localColumn": "nick",
            "remoteColumn": "last_nick"
        },
        {
            "type": "hasMany",
            "targetModel": "pais",
            "targetTable": "paises",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_proveedor",
            "targetTable": "pedidosprov",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_proveedor",
            "targetTable": "presupuestosprov",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "provincia",
            "targetTable": "provincias",
            "localColumn": "nick",
            "remoteColumn": "last_nick"
        },
        {
            "type": "hasMany",
            "targetModel": "provincia",
            "targetTable": "provincias",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "punto_interes_ciudad",
            "targetTable": "puntos_interes_ciudades",
            "localColumn": "nick",
            "remoteColumn": "last_nick"
        },
        {
            "type": "hasMany",
            "targetModel": "punto_interes_ciudad",
            "targetTable": "puntos_interes_ciudades",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "role_user",
            "targetTable": "roles_users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default userMetadata;
//# sourceMappingURL=user.js.map