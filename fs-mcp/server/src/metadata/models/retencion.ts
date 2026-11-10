// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const retencionMetadata: ModelMetadata = {
    "name": "retencion",
    "table": "retenciones",
    "endpoint": "/retenciones",
    "primaryKey": "codretencion",
    "description": "Retención fiscal aplicable a documentos (IRPF, etc.). Lleva porcentaje y subcuenta.",
    "source": "core",
    "columns": [
        {
            "name": "activa",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "default": true,
            "description": "True si la retención está activa para asignar a documentos.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2024.9"
                }
            ]
        },
        {
            "name": "codretencion",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": false,
            "isRequired": true,
            "label": "Código",
            "maxLength": 10,
            "description": "Código corto único de la retención.",
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
            "name": "codsubcuentaret",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cuenta retenciones ventas",
            "maxLength": 15,
            "description": "Subcuenta contable de la retención en ventas (cliente).",
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
            "name": "codsubcuentaacr",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta de retenciones para compras",
            "maxLength": 15,
            "description": "Subcuenta contable de la retención en compras (proveedor).",
            "widget": "subcuenta",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.05"
                }
            ]
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 50,
            "description": "Descripción legible (ej: IRPF profesionales 15%).",
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
            "name": "porcentaje",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Porcentaje",
            "description": "Porcentaje de retención aplicable.",
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
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codretencion",
            "remoteColumn": "codretencion"
        },
        {
            "type": "hasMany",
            "targetModel": "proveedor",
            "targetTable": "proveedores",
            "localColumn": "codretencion",
            "remoteColumn": "codretencion"
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
    },
    "retiredColumns": [
        {
            "name": "codsubcuentaacre",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codsubcuentaacre",
            "maxLength": 15,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.04"
                }
            ]
        }
    ]
};

export default retencionMetadata;
