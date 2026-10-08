// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const familiaMetadata: ModelMetadata = {
    "name": "familia",
    "table": "familias",
    "endpoint": "/familias",
    "primaryKey": "codfamilia",
    "description": "Familia o categoría de productos. Soporta jerarquía de familias padre/hijas.",
    "source": "core",
    "columns": [
        {
            "name": "codfamilia",
            "sqlType": "character varying(8)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 8,
            "description": "Código corto único de la familia de productos.",
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
            "name": "codsubcuentacom",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cuenta para compras",
            "maxLength": 15,
            "description": "Subcuenta contable a usar para compras de productos de esta familia.",
            "widget": "subcuenta",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "codsubcuentairpfcom",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cuenta retenciones ventas",
            "maxLength": 15,
            "description": "Subcuenta contable a usar para retenciones IRPF en compras.",
            "widget": "subcuenta",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "codsubcuentaven",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cuenta de ventas",
            "maxLength": 15,
            "description": "Subcuenta contable a usar para ventas de productos de esta familia.",
            "widget": "subcuenta",
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
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 100,
            "description": "Descripción legible de la familia.",
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
            "name": "madre",
            "sqlType": "character varying(8)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Padre",
            "maxLength": 8,
            "description": "Familia padre en la jerarquía. Vacío si es de primer nivel.",
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "numproductos",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Productos",
            "default": 0,
            "description": "Número de productos asociados a la familia (calculado).",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.51"
                }
            ]
        },
        {
            "name": "idattachedfile",
            "sqlType": "int",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Imagen",
            "description": "Archivo de imagen ilustrativa de la familia.",
            "widget": "text",
            "foreignKey": {
                "table": "attached_files",
                "column": "idfile",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2026.1"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "attached_file",
            "targetTable": "attached_files",
            "localColumn": "idattachedfile",
            "remoteColumn": "idfile"
        },
        {
            "type": "hasMany",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "codfamilia",
            "remoteColumn": "codfamilia"
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

export default familiaMetadata;
