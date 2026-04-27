// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const roleUserMetadata = {
    "name": "role_user",
    "table": "roles_users",
    "endpoint": "/roleusers",
    "primaryKey": "id",
    "description": "Asignación de un rol a un usuario.",
    "source": "core",
    "columns": [
        {
            "name": "codrole",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Grupo",
            "maxLength": 20,
            "description": "Rol de seguridad asignado.",
            "widget": "select",
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
            "description": "Identificador interno autoincremental de la asignación rol-usuario.",
            "widget": "number"
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Usuario al que se le asigna el rol.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "role",
            "targetTable": "roles",
            "localColumn": "codrole",
            "remoteColumn": "codrole"
        },
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
export default roleUserMetadata;
//# sourceMappingURL=role_user.js.map