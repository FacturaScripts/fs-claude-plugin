// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const pageMetadata = {
    "name": "page",
    "table": "pages",
    "endpoint": "/pages",
    "primaryKey": "name",
    "description": "Página/controlador del menú. Generada por el sistema al instalar plugins.",
    "source": "core",
    "columns": [
        {
            "name": "icon",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Icono",
            "maxLength": 50,
            "description": "Icono FontAwesome a mostrar en el menú junto al título de la página."
        },
        {
            "name": "menu",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Menú",
            "maxLength": 20,
            "description": "Menú principal donde se ubica la página (ventas, compras, contabilidad, etc.)."
        },
        {
            "name": "name",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 40,
            "description": "Nombre interno único de la página/controlador (ej: ListCliente, EditFacturaCliente)."
        },
        {
            "name": "ordernum",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "ordernum",
            "default": 100,
            "description": "Orden de aparición dentro del submenú.",
            "widget": "number"
        },
        {
            "name": "showonmenu",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "showonmenu",
            "default": true,
            "description": "True si la página debe aparecer en el menú; false si solo es accesible directamente.",
            "widget": "checkbox"
        },
        {
            "name": "submenu",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "submenu",
            "maxLength": 20,
            "description": "Submenú dentro del menú principal donde se ubica la página."
        },
        {
            "name": "title",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Título",
            "maxLength": 50,
            "description": "Título legible de la página, mostrado en el menú y la cabecera."
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "name",
            "remoteColumn": "homepage"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default pageMetadata;
//# sourceMappingURL=page.js.map