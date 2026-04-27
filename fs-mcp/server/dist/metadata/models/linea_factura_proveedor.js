// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const lineaFacturaProveedorMetadata = {
    "name": "linea_factura_proveedor",
    "table": "lineasfacturasprov",
    "endpoint": "/lineafacturaproveedores",
    "primaryKey": "idlinea",
    "description": "Línea de una factura de proveedor.",
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
            "default": 1,
            "description": "Cómo afecta esta línea al stock al confirmar la factura.",
            "widget": "number"
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
            "description": "Cantidad facturada por el proveedor.",
            "widget": "number"
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
            }
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
            "description": "Descripción del producto/servicio facturado.",
            "widget": "textarea"
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
            "widget": "number"
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
            "widget": "number"
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
            "description": "Excepción de IVA aplicada a esta línea."
        },
        {
            "name": "idfactura",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idfactura",
            "description": "Factura de proveedor a la que pertenece la línea.",
            "widget": "number",
            "foreignKey": {
                "table": "facturasprov",
                "column": "idfactura",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
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
            "widget": "number"
        },
        {
            "name": "idlinearect",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idlinearect",
            "description": "Línea original que esta rectifica (en facturas rectificativas).",
            "widget": "number",
            "foreignKey": {
                "table": "lineasfacturasprov",
                "column": "idlinea",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
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
            }
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
            "description": "Porcentaje de IRPF aplicado a la línea.",
            "widget": "number"
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
            "description": "Porcentaje de IVA aplicado a la línea.",
            "widget": "number"
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
            "description": "Posición de la línea en la factura.",
            "widget": "number"
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
            "description": "Subtotal antes de aplicar descuentos.",
            "widget": "number"
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
            "description": "Subtotal después de aplicar descuentos.",
            "widget": "number"
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
            "widget": "number"
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
            "widget": "number"
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
            "description": "Referencia de la variante de producto facturada."
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
            "description": "Cantidad ya recibida (referente al pedido/albarán origen).",
            "widget": "number"
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
            "widget": "checkbox"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "idfactura",
            "remoteColumn": "idfactura"
        },
        {
            "type": "belongsTo",
            "targetModel": "linea_factura_proveedor",
            "targetTable": "lineasfacturasprov",
            "localColumn": "idlinearect",
            "remoteColumn": "idlinea"
        },
        {
            "type": "belongsTo",
            "targetModel": "impuesto",
            "targetTable": "impuestos",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "belongsTo",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default lineaFacturaProveedorMetadata;
//# sourceMappingURL=linea_factura_proveedor.js.map