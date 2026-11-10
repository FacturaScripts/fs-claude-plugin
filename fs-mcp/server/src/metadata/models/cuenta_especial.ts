// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const cuentaEspecialMetadata: ModelMetadata = {
    "name": "cuenta_especial",
    "table": "cuentasesp",
    "endpoint": "/cuentaespeciales",
    "primaryKey": "codcuentaesp",
    "description": "Cuenta especial: alias para que el sistema sepa qué cuenta usar (ventas, compras, IVA repercutido, etc.).",
    "source": "core",
    "columns": [
        {
            "name": "codcuentaesp",
            "sqlType": "character varying(6)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 6,
            "description": "Código corto único del alias contable (ej: VENTAS, COMPRAS, IVAREP).",
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
            "sqlType": "character varying(255)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 255,
            "description": "Descripción del propósito del alias contable.",
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
            "targetModel": "cuenta",
            "targetTable": "cuentas",
            "localColumn": "codcuentaesp",
            "remoteColumn": "codcuentaesp"
        },
        {
            "type": "hasMany",
            "targetModel": "subcuenta",
            "targetTable": "subcuentas",
            "localColumn": "codcuentaesp",
            "remoteColumn": "codcuentaesp"
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

export default cuentaEspecialMetadata;
