// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const tarifaMetadata: ModelMetadata = {
    "name": "tarifa",
    "table": "tarifas",
    "endpoint": "/tarifas",
    "primaryKey": "codtarifa",
    "description": "Tarifa de precios aplicable a clientes. Define márgenes o descuentos sobre el precio base.",
    "source": "core",
    "columns": [
        {
            "name": "aplicar",
            "sqlType": "character varying(12)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Fórmula a aplicar",
            "maxLength": 12,
            "description": "Sobre qué precio base se aplica la fórmula de la tarifa: pvp (precio de venta) o coste.",
            "widget": "select",
            "enumValues": [
                "pvp",
                "coste"
            ],
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "codtarifa",
            "sqlType": "character varying(6)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 6,
            "description": "Código corto único de la tarifa.",
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
            "name": "maxpvp",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "No vender por encima de PVP",
            "default": false,
            "description": "True si los precios calculados no pueden superar nunca el PVP base del producto.",
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
            "name": "mincoste",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "No vender por debajo de coste",
            "default": false,
            "description": "True si los precios calculados no pueden caer nunca por debajo del coste.",
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
            "name": "nombre",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 50,
            "description": "Nombre legible de la tarifa.",
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
            "name": "valorx",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Valor X",
            "description": "Valor X de la fórmula de cálculo de precio (típicamente porcentaje de margen o descuento).",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.05"
                }
            ]
        },
        {
            "name": "valory",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Valor Y",
            "description": "Valor Y de la fórmula de cálculo de precio (importe fijo a sumar/restar).",
            "widget": "money",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.05"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codtarifa",
            "remoteColumn": "codtarifa"
        },
        {
            "type": "hasMany",
            "targetModel": "grupo_clientes",
            "targetTable": "gruposclientes",
            "localColumn": "codtarifa",
            "remoteColumn": "codtarifa"
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
            "name": "inclineal",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "inclineal",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.04"
                }
            ]
        },
        {
            "name": "incporcentual",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "incporcentual",
            "widget": "number",
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

export default tarifaMetadata;
