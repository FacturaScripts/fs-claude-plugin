// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const roleMetadata: ModelMetadata = {
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
            "widget": "text"
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
            "widget": "text"
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
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default roleMetadata;
