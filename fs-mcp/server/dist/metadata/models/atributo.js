// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const atributoMetadata = {
    "name": "atributo",
    "table": "atributos",
    "endpoint": "/atributos",
    "primaryKey": "codatributo",
    "description": "Atributo configurable de productos (ej: talla, color). Agrupa los valores posibles.",
    "source": "core",
    "columns": [
        {
            "name": "codatributo",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 20,
            "description": "Código corto único del atributo (ej: TALLA, COLOR).",
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
            "description": "Nombre legible del atributo (ej: Talla, Color).",
            "widget": "text"
        },
        {
            "name": "num_selector",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Selector",
            "default": 0,
            "description": "Número del selector visual asociado al atributo (orden de aparición en filtros).",
            "widget": "number"
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "atributo_valor",
            "targetTable": "atributos_valores",
            "localColumn": "codatributo",
            "remoteColumn": "codatributo"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default atributoMetadata;
//# sourceMappingURL=atributo.js.map