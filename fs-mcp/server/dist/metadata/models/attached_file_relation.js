// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const attachedFileRelationMetadata = {
    "name": "attached_file_relation",
    "table": "attached_files_rel",
    "endpoint": "/attachedfilerelations",
    "primaryKey": "id",
    "description": "Vínculo entre un attached_file y un registro de otra tabla (cliente, factura, etc.).",
    "source": "core",
    "columns": [
        {
            "name": "creationdate",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "creationdate",
            "description": "Fecha y hora en la que se vinculó el archivo al registro.",
            "widget": "datetime"
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
            "description": "Identificador interno autoincremental del vínculo.",
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
            "description": "Archivo adjunto vinculado al registro.",
            "widget": "number",
            "foreignKey": {
                "table": "attached_files",
                "column": "idfile",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "model",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Modelo",
            "maxLength": 30,
            "description": "Nombre del modelo PHP al que se vincula el archivo (ej: Cliente, FacturaCliente)."
        },
        {
            "name": "modelid",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "modelid",
            "description": "Identificador numérico del registro vinculado dentro del modelo indicado.",
            "widget": "number"
        },
        {
            "name": "modelcode",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "modelcode",
            "maxLength": 40,
            "description": "Código alternativo del registro vinculado cuando la PK no es numérica (ej: codcliente)."
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Usuario que vinculó el archivo al registro.",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "observations",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Observaciones",
            "description": "Observaciones libres sobre el vínculo entre archivo y registro.",
            "widget": "textarea"
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
            "description": "Orden de presentación del archivo dentro del registro al que está vinculado.",
            "widget": "number"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "attached_file",
            "targetTable": "attached_files",
            "localColumn": "idfile",
            "remoteColumn": "idfile"
        },
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default attachedFileRelationMetadata;
//# sourceMappingURL=attached_file_relation.js.map