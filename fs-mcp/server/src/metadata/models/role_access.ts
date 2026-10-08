// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const roleAccessMetadata: ModelMetadata = {
    "name": "role_access",
    "table": "roles_access",
    "endpoint": "/roleaccess",
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
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2022.4"
                }
            ]
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
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2022.4"
                }
            ]
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
            "description": "Identificador interno autoincremental del registro de permiso.",
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
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.4"
                }
            ]
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
            "description": "Nombre de la página/controlador al que se aplica el permiso.",
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

export default roleAccessMetadata;
