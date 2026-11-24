// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const userProyectoMetadata: ModelMetadata = {
    "name": "user_proyecto",
    "table": "proyectos_users",
    "endpoint": "/userproyectos",
    "primaryKey": "id",
    "description": "Usuario con acceso a un proyecto. Da acceso a los proyectos privados y a los de otras empresas.",
    "source": "plugin:Proyectos",
    "columns": [
        {
            "name": "fecha",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "fecha",
            "description": "Fecha en que se añadió el usuario.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.3"
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
            "description": "Identificador de la asignación.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.3"
                }
            ]
        },
        {
            "name": "idproyecto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Proyecto",
            "description": "Proyecto al que tiene acceso el usuario.",
            "widget": "select",
            "foreignKey": {
                "table": "proyectos",
                "column": "idproyecto",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.3"
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
            "description": "Usuario con acceso al proyecto.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.3"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "proyecto",
            "targetTable": "proyectos",
            "localColumn": "idproyecto",
            "remoteColumn": "idproyecto"
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
            "source": "plugin:Proyectos",
            "since": "0.3"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-11-24T12:34:05.273Z",
        "facturascriptsCommit": "7aa596470",
        "facturascriptsVersion": "plugin:Proyectos@bfa7881",
        "versions": {
            "plugin:Proyectos": {
                "latest": "4.2",
                "tags": 36
            }
        }
    }
};

export default userProyectoMetadata;
