// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const fabricanteMetadata = {
    "name": "fabricante",
    "table": "fabricantes",
    "endpoint": "/fabricantes",
    "primaryKey": "codfabricante",
    "description": "Fabricante de productos. Catálogo simple de marca/proveedor de origen.",
    "source": "core",
    "columns": [
        {
            "name": "codfabricante",
            "sqlType": "character varying(8)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 8,
            "description": "Código corto único del fabricante.",
            "widget": "text"
        },
        {
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre comercial del fabricante.",
            "widget": "text"
        },
        {
            "name": "numproductos",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Productos",
            "default": 0,
            "description": "Número de productos asociados al fabricante (calculado).",
            "widget": "number"
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "codfabricante",
            "remoteColumn": "codfabricante"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default fabricanteMetadata;
//# sourceMappingURL=fabricante.js.map