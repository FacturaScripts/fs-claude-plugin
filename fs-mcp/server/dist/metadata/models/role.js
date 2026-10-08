// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const roleMetadata = {
    "name": "role",
    "table": "roles",
    "endpoint": "/roles",
    "primaryKey": "codrole",
    "description": "Rol de seguridad. Agrupa permisos sobre páginas y acciones.",
    "source": "core",
    "columns": [
        {
            "name": "codrole",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 20,
            "description": "Código corto único del rol de seguridad.",
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
            "name": "descripcion",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 200,
            "description": "Descripción del rol y los permisos que agrupa.",
            "widget": "text",
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
            "type": "hasMany",
            "targetModel": "role_access",
            "targetTable": "roles_access",
            "localColumn": "codrole",
            "remoteColumn": "codrole"
        },
        {
            "type": "hasMany",
            "targetModel": "role_user",
            "targetTable": "roles_users",
            "localColumn": "codrole",
            "remoteColumn": "codrole"
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
export default roleMetadata;
//# sourceMappingURL=role.js.map