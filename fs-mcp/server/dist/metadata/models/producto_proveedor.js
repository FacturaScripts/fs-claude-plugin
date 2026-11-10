// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const productoProveedorMetadata = {
    "name": "producto_proveedor",
    "table": "productosprov",
    "endpoint": "/productoproveedores",
    "primaryKey": "id",
    "description": "Asociación entre un producto y un proveedor con su referencia, código de barras y precio de coste.",
    "source": "core",
    "columns": [
        {
            "name": "actualizado",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Hora de actualización",
            "description": "Fecha y hora de la última actualización del precio del proveedor para este producto.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.2"
                }
            ]
        },
        {
            "name": "coddivisa",
            "sqlType": "character varying(3)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Divisa",
            "maxLength": 3,
            "description": "Divisa en la que el proveedor da los precios.",
            "widget": "select",
            "foreignKey": {
                "table": "divisas",
                "column": "coddivisa",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2020.2"
                }
            ]
        },
        {
            "name": "codproveedor",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Proveedor",
            "maxLength": 10,
            "description": "Proveedor que ofrece el producto.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "proveedores",
                "column": "codproveedor",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2020.2"
                }
            ]
        },
        {
            "name": "dtopor",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Dto.",
            "description": "Primer descuento porcentual aplicado por el proveedor.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.2"
                }
            ]
        },
        {
            "name": "dtopor2",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Dto. 2",
            "description": "Segundo descuento porcentual aplicado tras dtopor.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.2"
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
            "description": "Identificador interno autoincremental de la relación.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.2"
                }
            ]
        },
        {
            "name": "idproducto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idproducto",
            "description": "Producto que ofrece el proveedor.",
            "widget": "number",
            "foreignKey": {
                "table": "productos",
                "column": "idproducto",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2020.51"
                }
            ]
        },
        {
            "name": "neto",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Neto",
            "description": "Precio neto unitario en la divisa del proveedor (calculado tras descuentos).",
            "widget": "money",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.3"
                }
            ]
        },
        {
            "name": "netoeuros",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "netoeuros",
            "default": 0,
            "description": "Precio neto unitario convertido a euros.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2022.4"
                }
            ]
        },
        {
            "name": "precio",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Precio",
            "description": "Precio bruto del proveedor antes de descuentos.",
            "widget": "money",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.2"
                }
            ]
        },
        {
            "name": "referencia",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Variante",
            "maxLength": 30,
            "description": "Referencia de la variante de producto en el sistema.",
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.2"
                }
            ]
        },
        {
            "name": "refproveedor",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Referencia de proveedor",
            "maxLength": 30,
            "description": "Referencia/SKU que el proveedor usa para el producto.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.2"
                }
            ]
        },
        {
            "name": "stock",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Stock",
            "default": 0,
            "description": "Stock que el proveedor declara disponible para este producto.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.03"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "divisa",
            "targetTable": "divisas",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "belongsTo",
            "targetModel": "proveedor",
            "targetTable": "proveedores",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        },
        {
            "type": "belongsTo",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        }
    ],
    "availability": [
        {
            "source": "core",
            "since": "2020.2"
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
export default productoProveedorMetadata;
//# sourceMappingURL=producto_proveedor.js.map