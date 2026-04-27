// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const divisaMetadata = {
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
            "widget": "text"
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
            "widget": "number"
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
            "widget": "text"
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
            "widget": "text"
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
            "widget": "number"
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
            "widget": "number"
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
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default divisaMetadata;
//# sourceMappingURL=divisa.js.map