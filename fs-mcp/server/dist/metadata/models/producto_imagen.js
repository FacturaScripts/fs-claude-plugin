// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const productoImagenMetadata = {
    "name": "producto_imagen",
    "table": "productos_imagenes",
    "endpoint": "/productoimagenes",
    "primaryKey": "id",
    "description": "Imagen asociada a un producto o variante. Apunta a un attached_file.",
    "source": "core",
    "columns": [
        {
            "name": "id",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental del registro.",
            "widget": "number"
        },
        {
            "name": "idfile",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idfile",
            "description": "Archivo de imagen del producto/variante.",
            "widget": "number",
            "foreignKey": {
                "table": "attached_files",
                "column": "idfile",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idproducto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idproducto",
            "description": "Producto al que pertenece la imagen.",
            "widget": "number",
            "foreignKey": {
                "table": "productos",
                "column": "idproducto",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
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
            "description": "Variante concreta del producto a la que aplica la imagen (vacío si es global del producto).",
            "foreignKey": {
                "table": "variantes",
                "column": "referencia",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
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
            "description": "Posición de la imagen entre las imágenes del producto/variante.",
            "widget": "number"
        }
    ],
    "relations": [
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
        },
        {
            "type": "belongsTo",
            "targetModel": "attached_file",
            "targetTable": "attached_files",
            "localColumn": "idfile",
            "remoteColumn": "idfile"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default productoImagenMetadata;
//# sourceMappingURL=producto_imagen.js.map