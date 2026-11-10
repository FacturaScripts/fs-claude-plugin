// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const lineaPedidoProveedorMetadata = {
    "name": "linea_pedido_proveedor",
    "table": "lineaspedidosprov",
    "endpoint": "/lineapedidoproveedores",
    "primaryKey": "idlinea",
    "description": "Línea de un pedido de proveedor.",
    "source": "core",
    "columns": [
        {
            "name": "actualizastock",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "actualizastock",
            "default": 0,
            "description": "Cómo afecta esta línea al stock al confirmar el pedido.",
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
            "name": "cantidad",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "cantidad",
            "description": "Cantidad pedida al proveedor.",
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
            "name": "codimpuesto",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codimpuesto",
            "maxLength": 10,
            "description": "Impuesto aplicado a la línea (suele coincidir con el del producto).",
            "foreignKey": {
                "table": "impuestos",
                "column": "codimpuesto",
                "onDelete": "RESTRICT",
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
            "name": "descripcion",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "descripcion",
            "description": "Descripción del producto en la línea del pedido.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "dtopor",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "dtopor",
            "default": 0,
            "description": "Primer descuento porcentual aplicado a la línea.",
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
            "name": "dtopor2",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "dtopor2",
            "default": 0,
            "description": "Segundo descuento porcentual aplicado tras dtopor.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.01"
                }
            ]
        },
        {
            "name": "excepcioniva",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "excepcioniva",
            "maxLength": 20,
            "description": "Excepción de IVA aplicada a esta línea.",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.03"
                }
            ]
        },
        {
            "name": "idlinea",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idlinea",
            "description": "Identificador interno autoincremental de la línea.",
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
            "name": "idpedido",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idpedido",
            "description": "Pedido de proveedor al que pertenece la línea.",
            "widget": "number",
            "foreignKey": {
                "table": "pedidosprov",
                "column": "idpedido",
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
            "name": "idproducto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idproducto",
            "description": "Producto al que se refiere la línea.",
            "widget": "number",
            "foreignKey": {
                "table": "productos",
                "column": "idproducto",
                "onDelete": "SET NULL",
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
            "name": "irpf",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "IRPF",
            "description": "Porcentaje de IRPF aplicado.",
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
            "name": "iva",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "iva",
            "description": "Porcentaje de IVA aplicado.",
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
            "name": "orden",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "orden",
            "default": 0,
            "description": "Posición de la línea en el pedido.",
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
            "name": "pvpsindto",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "pvpsindto",
            "description": "Subtotal antes de descuentos.",
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
            "name": "pvptotal",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "pvptotal",
            "description": "Subtotal después de descuentos.",
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
            "name": "pvpunitario",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "pvpunitario",
            "description": "Precio unitario sin IVA antes de descuentos.",
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
            "name": "recargo",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "recargo",
            "description": "Porcentaje de recargo de equivalencia.",
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
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "referencia",
            "maxLength": 30,
            "description": "Referencia de la variante pedida.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "servido",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "servido",
            "default": 0,
            "description": "Cantidad ya recibida del proveedor.",
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
            "name": "suplido",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "suplido",
            "default": false,
            "description": "True si la línea es un suplido.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.4"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "impuesto",
            "targetTable": "impuestos",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "belongsTo",
            "targetModel": "pedido_proveedor",
            "targetTable": "pedidosprov",
            "localColumn": "idpedido",
            "remoteColumn": "idpedido"
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
export default lineaPedidoProveedorMetadata;
//# sourceMappingURL=linea_pedido_proveedor.js.map