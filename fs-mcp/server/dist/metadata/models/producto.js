// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const productoMetadata = {
    "name": "producto",
    "table": "productos",
    "endpoint": "/productos",
    "primaryKey": "idproducto",
    "description": "Producto del catálogo. Los productos pueden tener variantes, precios de compra/venta y control de stock.",
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
            "label": "Última modificación",
            "description": "Fecha y hora de la última modificación del producto.",
            "widget": "datetime",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "bloqueado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Bloqueado",
            "default": false,
            "description": "True si el producto está bloqueado y no puede usarse en nuevas operaciones (obsoleto/descatalogado).",
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
            "name": "codfabricante",
            "sqlType": "character varying(8)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fabricante",
            "maxLength": 8,
            "description": "Fabricante del producto.",
            "widget": "select",
            "foreignKey": {
                "table": "fabricantes",
                "column": "codfabricante",
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
            "name": "codfamilia",
            "sqlType": "character varying(8)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Familia",
            "maxLength": 8,
            "description": "Familia o categoría a la que pertenece el producto.",
            "widget": "select",
            "foreignKey": {
                "table": "familias",
                "column": "codfamilia",
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
            "name": "codimpuesto",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Impuesto",
            "maxLength": 10,
            "description": "Impuesto (IVA) aplicable al producto en ventas y compras.",
            "widget": "select",
            "foreignKey": {
                "table": "impuestos",
                "column": "codimpuesto",
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
            "name": "codsubcuentacom",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cuenta para compras",
            "maxLength": 15,
            "description": "Subcuenta contable a usar para compras de este producto (sobrescribe la de la familia).",
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
            "description": "Subcuenta contable a usar para ventas (sobrescribe la de la familia).",
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
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "description": "Descripción detallada del producto. Aparece en documentos.",
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
            "name": "excepcioniva",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Excepción de IVA",
            "maxLength": 20,
            "description": "Excepción de IVA aplicable al producto.",
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.03"
                }
            ]
        },
        {
            "name": "fechaalta",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha creación",
            "description": "Fecha de alta del producto en el catálogo.",
            "widget": "date",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.16"
                }
            ]
        },
        {
            "name": "idproducto",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idproducto",
            "description": "Identificador interno autoincremental del producto.",
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
            "name": "nostock",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "No controlar stock",
            "default": false,
            "description": "True si el producto no lleva control de stock (servicios, intangibles).",
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
            "name": "observaciones",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Observaciones",
            "description": "Notas internas sobre el producto.",
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
            "name": "precio",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Precio",
            "default": 0,
            "description": "Precio base de venta del producto (sin IVA). Las variantes pueden tener precios distintos.",
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
            "name": "publico",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Público",
            "default": false,
            "description": "True si el producto es visible al público (web, catálogo).",
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
            "name": "referencia",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Referencia",
            "maxLength": 30,
            "description": "Referencia única del producto. Identificador alfanumérico (SKU).",
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
            "name": "secompra",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Se compra",
            "default": true,
            "description": "True si el producto se puede comprar a proveedores.",
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
            "name": "sevende",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Se vende",
            "default": true,
            "description": "True si el producto se puede vender a clientes.",
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
            "name": "stockfis",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Stock",
            "default": 0,
            "description": "Stock físico actual del producto, sumado entre todos los almacenes.",
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
            "name": "tipo",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Tipo",
            "maxLength": 50,
            "description": "Tipo de producto (servicio, físico, suscripción, etc.).",
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.03"
                }
            ]
        },
        {
            "name": "ventasinstock",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Permitir venta sin stock",
            "default": false,
            "description": "True si se permite vender el producto aunque no haya stock disponible.",
            "widget": "checkbox",
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
            "type": "belongsTo",
            "targetModel": "fabricante",
            "targetTable": "fabricantes",
            "localColumn": "codfabricante",
            "remoteColumn": "codfabricante"
        },
        {
            "type": "belongsTo",
            "targetModel": "familia",
            "targetTable": "familias",
            "localColumn": "codfamilia",
            "remoteColumn": "codfamilia"
        },
        {
            "type": "belongsTo",
            "targetModel": "impuesto",
            "targetTable": "impuestos",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "hasMany",
            "targetModel": "agente",
            "targetTable": "agentes",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_albaran_cliente",
            "targetTable": "lineasalbaranescli",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_albaran_proveedor",
            "targetTable": "lineasalbaranesprov",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_factura_cliente",
            "targetTable": "lineasfacturascli",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_factura_proveedor",
            "targetTable": "lineasfacturasprov",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_pedido_cliente",
            "targetTable": "lineaspedidoscli",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_pedido_proveedor",
            "targetTable": "lineaspedidosprov",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_presupuesto_cliente",
            "targetTable": "lineaspresupuestoscli",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_presupuesto_proveedor",
            "targetTable": "lineaspresupuestosprov",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "producto_imagen",
            "targetTable": "productos_imagenes",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "producto_proveedor",
            "targetTable": "productosprov",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "stock",
            "targetTable": "stocks",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "variante",
            "targetTable": "variantes",
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
export default productoMetadata;
//# sourceMappingURL=producto.js.map