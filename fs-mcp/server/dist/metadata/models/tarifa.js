// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const tarifaMetadata = {
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
            "widget": "text"
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
            "widget": "checkbox"
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
            "widget": "checkbox"
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
            "widget": "text"
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
            "widget": "number"
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
            "widget": "money"
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
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default tarifaMetadata;
//# sourceMappingURL=tarifa.js.map