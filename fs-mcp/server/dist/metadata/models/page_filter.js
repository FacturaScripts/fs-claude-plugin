// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const pageFilterMetadata = {
    "name": "page_filter",
    "table": "pages_filters",
    "endpoint": "/pagefilteres",
    "primaryKey": "id",
    "description": "Filtro guardado por un usuario sobre una página de listado.",
    "source": "core",
    "columns": [
        {
            "name": "description",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 50,
            "description": "Descripción legible del filtro guardado por el usuario."
        },
        {
            "name": "filters",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Filtros",
            "description": "Configuración del filtro en formato JSON (campos y valores).",
            "widget": "textarea"
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
            "description": "Identificador interno autoincremental del filtro.",
            "widget": "number"
        },
        {
            "name": "name",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 40,
            "description": "Nombre del controlador/página al que aplica el filtro."
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
            "description": "Usuario al que pertenece el filtro guardado.",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        }
    ],
    "relations": [
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
export default pageFilterMetadata;
//# sourceMappingURL=page_filter.js.map