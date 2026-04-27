// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const provinciaMetadata = {
    "name": "provincia",
    "table": "provincias",
    "endpoint": "/provincias",
    "primaryKey": "idprovincia",
    "description": "Provincia o región dentro de un país.",
    "source": "core",
    "columns": [
        {
            "name": "alias",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Alias",
            "description": "Alias o nombres alternativos de la provincia, separados por comas.",
            "widget": "textarea"
        },
        {
            "name": "codeid",
            "sqlType": "character varying(2)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Código",
            "maxLength": 2,
            "description": "Código corto interno de 2 caracteres.",
            "widget": "text"
        },
        {
            "name": "codisoprov",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "ISO",
            "maxLength": 10,
            "description": "Código ISO 3166-2 de la provincia/región (ej: ES-M para Madrid).",
            "widget": "text"
        },
        {
            "name": "codpais",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "País",
            "maxLength": 20,
            "description": "País al que pertenece la provincia.",
            "widget": "select",
            "foreignKey": {
                "table": "paises",
                "column": "codpais",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "creation_date",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha de creación",
            "description": "Fecha y hora en la que se registró la provincia.",
            "widget": "datetime"
        },
        {
            "name": "idprovincia",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental.",
            "widget": "text"
        },
        {
            "name": "last_nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Último usuario",
            "maxLength": 50,
            "description": "Usuario que realizó la última modificación del registro.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "last_update",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Última modificación",
            "description": "Fecha y hora de la última modificación.",
            "widget": "datetime"
        },
        {
            "name": "latitude",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Latitud",
            "description": "Latitud geográfica del centroide de la provincia.",
            "widget": "number"
        },
        {
            "name": "longitude",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Longitud",
            "description": "Longitud geográfica del centroide.",
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
            "description": "Usuario que creó el registro de provincia.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "provincia",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Provincia",
            "maxLength": 100,
            "description": "Nombre oficial de la provincia o región.",
            "widget": "text"
        },
        {
            "name": "telephone_prefix",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Prefijo telefónico",
            "maxLength": 10,
            "description": "Prefijo telefónico interno de la provincia, si aplica.",
            "widget": "text"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "pais",
            "targetTable": "paises",
            "localColumn": "codpais",
            "remoteColumn": "codpais"
        },
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "last_nick",
            "remoteColumn": "nick"
        },
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "ciudad",
            "targetTable": "ciudades",
            "localColumn": "idprovincia",
            "remoteColumn": "idprovincia"
        },
        {
            "type": "hasMany",
            "targetModel": "codigo_postal",
            "targetTable": "codigos_postales",
            "localColumn": "idprovincia",
            "remoteColumn": "idprovincia"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default provinciaMetadata;
//# sourceMappingURL=provincia.js.map