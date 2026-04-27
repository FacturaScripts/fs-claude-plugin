// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const attachedFileMetadata = {
    "name": "attached_file",
    "table": "attached_files",
    "endpoint": "/attachedfiles",
    "primaryKey": "idfile",
    "description": "Archivo subido al sistema (factura, contrato, imagen…). Almacenado en disco.",
    "source": "core",
    "columns": [
        {
            "name": "date",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Fecha",
            "description": "Fecha en la que se subió el archivo al sistema.",
            "widget": "date"
        },
        {
            "name": "filename",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Nombre de archivo",
            "maxLength": 100,
            "description": "Nombre original del archivo al subirse.",
            "widget": "text"
        },
        {
            "name": "hour",
            "sqlType": "time",
            "tsType": "time",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Hora",
            "description": "Hora en la que se subió el archivo (HH:MM:SS).",
            "widget": "text"
        },
        {
            "name": "idfile",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idfile",
            "description": "Identificador interno autoincremental del archivo.",
            "widget": "number"
        },
        {
            "name": "mimetype",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Tipo",
            "maxLength": 100,
            "description": "Tipo MIME del archivo (ej: application/pdf, image/png).",
            "widget": "text"
        },
        {
            "name": "path",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Ruta completa",
            "maxLength": 200,
            "description": "Ruta relativa donde se almacena el archivo en disco.",
            "widget": "file"
        },
        {
            "name": "size",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Tamaño",
            "description": "Tamaño del archivo en bytes.",
            "widget": "number"
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "attached_file_relation",
            "targetTable": "attached_files_rel",
            "localColumn": "idfile",
            "remoteColumn": "idfile"
        },
        {
            "type": "hasMany",
            "targetModel": "empresa",
            "targetTable": "empresas",
            "localColumn": "idfile",
            "remoteColumn": "idlogo"
        },
        {
            "type": "hasMany",
            "targetModel": "familia",
            "targetTable": "familias",
            "localColumn": "idfile",
            "remoteColumn": "idattachedfile"
        },
        {
            "type": "hasMany",
            "targetModel": "formato_documento",
            "targetTable": "formatos_documentos",
            "localColumn": "idfile",
            "remoteColumn": "idlogo"
        },
        {
            "type": "hasMany",
            "targetModel": "producto_imagen",
            "targetTable": "productos_imagenes",
            "localColumn": "idfile",
            "remoteColumn": "idfile"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default attachedFileMetadata;
//# sourceMappingURL=attached_file.js.map