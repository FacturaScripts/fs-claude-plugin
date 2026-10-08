// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const divisaMetadata: ModelMetadata = {
    "name": "divisa",
    "table": "divisas",
    "endpoint": "/divisas",
    "primaryKey": "coddivisa",
    "description": "Moneda usada en documentos. Lleva la tasa de conversión a la divisa principal.",
    "source": "core",
    "columns": [
        {
            "name": "coddivisa",
            "sqlType": "character varying(3)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 3,
            "description": "Código corto de la divisa (ej: EUR, USD, GBP).",
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
            "name": "codiso",
            "sqlType": "character varying(5)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "ISO",
            "maxLength": 5,
            "description": "Código ISO 4217 numérico de la divisa.",
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
            "name": "descripcion",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 100,
            "description": "Nombre completo de la divisa (ej: Euro, Dólar estadounidense).",
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
            "name": "simbolo",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Símbolo",
            "maxLength": 10,
            "description": "Símbolo monetario de la divisa (ej: €, $, £).",
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
            "name": "tasaconv",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Tasa de ventas",
            "description": "Tasa de conversión a la divisa principal (€) usada en operaciones de venta.",
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
            "name": "tasaconvcompra",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Tasa de compras",
            "description": "Tasa de conversión a la divisa principal (€) usada en operaciones de compra.",
            "widget": "number",
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
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_proveedor",
            "targetTable": "albaranesprov",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_proveedor",
            "targetTable": "pedidosprov",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_proveedor",
            "targetTable": "presupuestosprov",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "hasMany",
            "targetModel": "producto_proveedor",
            "targetTable": "productosprov",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "hasMany",
            "targetModel": "recibo_cliente",
            "targetTable": "recibospagoscli",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "hasMany",
            "targetModel": "recibo_proveedor",
            "targetTable": "recibospagosprov",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
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

export default divisaMetadata;
