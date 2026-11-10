// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const stockMetadata = {
    "name": "stock",
    "table": "stocks",
    "endpoint": "/stocks",
    "primaryKey": "idstock",
    "description": "Existencias de una variante de producto en un almacén concreto.",
    "source": "core",
    "columns": [
        {
            "name": "cantidad",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cantidad",
            "default": 0,
            "description": "Cantidad real existente en el almacén.",
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
            "name": "codalmacen",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Almacén",
            "maxLength": 4,
            "description": "Almacén donde se localiza el stock.",
            "widget": "select",
            "foreignKey": {
                "table": "almacenes",
                "column": "codalmacen",
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
            "name": "disponible",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Disponible",
            "default": 0,
            "description": "Cantidad disponible para venta (cantidad menos reservada).",
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
            "name": "idproducto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Producto",
            "description": "Producto al que pertenece el registro de stock.",
            "widget": "text",
            "foreignKey": {
                "table": "productos",
                "column": "idproducto",
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
            "name": "idstock",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental del registro de stock.",
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
            "name": "pterecibir",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Pendiente recepción",
            "default": 0,
            "description": "Cantidad pendiente de recibir en pedidos a proveedor confirmados.",
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
            "name": "referencia",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Variante",
            "maxLength": 30,
            "description": "Variante concreta del producto cuyo stock se controla.",
            "widget": "select",
            "foreignKey": {
                "table": "variantes",
                "column": "referencia",
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
            "name": "reservada",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Reservado",
            "default": 0,
            "description": "Cantidad reservada por pedidos de cliente sin servir.",
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
            "name": "stockmax",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Stock máx.",
            "default": 0,
            "description": "Stock máximo recomendado en el almacén. Por encima se considera sobrestock.",
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
            "name": "stockmin",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Stock mín.",
            "default": 0,
            "description": "Stock mínimo recomendado. Por debajo el sistema avisa para reponer.",
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
            "name": "ubicacion",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Ubicación",
            "maxLength": 100,
            "description": "Ubicación física del producto dentro del almacén (estantería, pasillo, etc.).",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2021.71"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "almacen",
            "targetTable": "almacenes",
            "localColumn": "codalmacen",
            "remoteColumn": "codalmacen"
        },
        {
            "type": "belongsTo",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "belongsTo",
            "targetModel": "variante",
            "targetTable": "variantes",
            "localColumn": "referencia",
            "remoteColumn": "referencia"
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
export default stockMetadata;
//# sourceMappingURL=stock.js.map