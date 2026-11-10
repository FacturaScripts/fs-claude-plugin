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
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
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
            "description": "Identificador interno autoincremental de la asignación rol-usuario.",
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
export default roleUserMetadata;
//# sourceMappingURL=role_user.js.map