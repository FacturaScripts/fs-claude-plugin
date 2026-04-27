// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const settingsMetadata = {
    "name": "settings",
    "table": "settings",
    "endpoint": "/settings",
    "primaryKey": "name",
    "description": "Configuración global agrupada por nombre. Valores en JSON serializado.",
    "source": "core",
    "columns": [
        {
            "name": "name",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 50,
            "description": "Nombre del grupo de configuración (ej: default, email, accounting)."
        },
        {
            "name": "properties",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "properties",
            "description": "Configuración del grupo en formato JSON.",
            "widget": "textarea"
        }
    ],
    "relations": [],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default settingsMetadata;
//# sourceMappingURL=settings.js.map