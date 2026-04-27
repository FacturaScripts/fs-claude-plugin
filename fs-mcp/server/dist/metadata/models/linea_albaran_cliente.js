// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const lineaAlbaranClienteMetadata = {
    "name": "linea_albaran_cliente",
    "table": "lineasalbaranescli",
    "endpoint": "/lineaalbaranclientes",
    "primaryKey": "idlinea",
    "description": "Línea de un albarán de cliente. Producto, cantidad servida, precio y descuento.",
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
            "description": "Cómo afecta esta línea al stock al confirmar el documento (-2/-1/0/1/2 según tipo).",
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
            "description": "Cantidad del producto en esta línea.",
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
            "name": "coste",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "coste",
            "description": "Precio de coste unitario del producto en el momento de crear la línea.",
            "widget": "number"
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
            "description": "Descripción del producto/servicio en la línea (puede sobrescribir la del producto).",
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
            "description": "Excepción de IVA aplicada únicamente a esta línea."
        },
        {
            "name": "idalbaran",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idalbaran",
            "description": "Albarán de cliente al que pertenece la línea.",
            "widget": "number",
            "foreignKey": {
                "table": "albaranescli",
                "column": "idalbaran",
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
            "name": "mostrar_cantidad",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "mostrar_cantidad",
            "default": true,
            "description": "Si la cantidad debe mostrarse en la impresión del documento.",
            "widget": "checkbox"
        },
        {
            "name": "mostrar_precio",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "mostrar_precio",
            "default": true,
            "description": "Si el precio debe mostrarse en la impresión del documento.",
            "widget": "checkbox"
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
            "description": "Posición de la línea en el documento (orden de aparición).",
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
            "description": "Subtotal de la línea (cantidad × precio unitario) antes de aplicar descuentos.",
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
            "description": "Subtotal de la línea después de aplicar descuentos, sin IVA.",
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
            "description": "Porcentaje de recargo de equivalencia aplicado a la línea.",
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
            "description": "Referencia de la variante de producto vendida."
        },
        {
            "name": "salto_pagina",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "salto_pagina",
            "default": false,
            "description": "True si se debe forzar un salto de página antes de imprimir esta línea.",
            "widget": "checkbox"
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
            "description": "Cantidad ya entregada/servida de esta línea.",
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
            "description": "True si la línea es un suplido (gasto a cuenta del cliente, sin IVA).",
            "widget": "checkbox"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "idalbaran",
            "remoteColumn": "idalbaran"
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
export default lineaAlbaranClienteMetadata;
//# sourceMappingURL=linea_albaran_cliente.js.map