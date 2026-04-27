// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const roleAccessMetadata = {
    "name": "role_access",
    "table": "roles_access",
    "endpoint": "/roleaccesses",
    "primaryKey": "id",
    "description": "Permiso de acceso de un rol a una página, con flags allowdelete/allowupdate/onlyownerdata.",
    "source": "core",
    "columns": [
        {
            "name": "allowdelete",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "allowdelete",
            "default": true,
            "description": "True si los usuarios del rol pueden eliminar registros en la página.",
            "widget": "checkbox"
        },
        {
            "name": "allowexport",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "allowexport",
            "default": true,
            "description": "True si los usuarios del rol pueden exportar los datos de la página.",
            "widget": "checkbox"
        },
        {
            "name": "allowimport",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "allowimport",
            "default": true,
            "description": "True si los usuarios del rol pueden importar datos en la página.",
            "widget": "checkbox"
        },
        {
            "name": "allowupdate",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "allowupdate",
            "default": true,
            "description": "True si los usuarios del rol pueden modificar registros en la página.",
            "widget": "checkbox"
        },
        {
            "name": "codrole",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "codrole",
            "maxLength": 20,
            "description": "Rol de seguridad al que se concede el permiso.",
            "foreignKey": {
                "table": "roles",
                "column": "codrole",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
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
            "description": "Identificador interno autoincremental del registro de permiso.",
            "widget": "number"
        },
        {
            "name": "onlyownerdata",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "onlyownerdata",
            "default": false,
            "description": "True si el usuario solo puede ver los registros que él mismo creó (filtro por propietario).",
            "widget": "checkbox"
        },
        {
            "name": "pagename",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre de página",
            "maxLength": 40,
            "description": "Nombre de la página/controlador al que se aplica el permiso."
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "role",
            "targetTable": "roles",
            "localColumn": "codrole",
            "remoteColumn": "codrole"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default roleAccessMetadata;
//# sourceMappingURL=role_access.js.map