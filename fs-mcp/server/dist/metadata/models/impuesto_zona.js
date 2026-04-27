// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const impuestoZonaMetadata = {
    "name": "impuesto_zona",
    "table": "impuestoszonas",
    "endpoint": "/impuestozonas",
    "primaryKey": "id",
    "description": "Mapeo de impuesto por país/zona, para aplicar tipos distintos según la geografía del cliente.",
    "source": "core",
    "columns": [
        {
            "name": "codimpuesto",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Impuesto",
            "maxLength": 10,
            "description": "Impuesto sobre el que se define la regla de zona.",
            "widget": "select",
            "foreignKey": {
                "table": "impuestos",
                "column": "codimpuesto",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codimpuestosel",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Impuesto aplicado",
            "maxLength": 10,
            "description": "Impuesto sustituto a aplicar cuando se cumplen las condiciones de país y provincia.",
            "widget": "select",
            "foreignKey": {
                "table": "impuestos",
                "column": "codimpuesto",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codisopro",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Provincia",
            "maxLength": 10,
            "description": "Código ISO de la provincia donde aplica la regla.",
            "widget": "autocomplete"
        },
        {
            "name": "codpais",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "País",
            "maxLength": 20,
            "description": "Código del país donde aplica la regla.",
            "widget": "select"
        },
        {
            "name": "excepcioniva",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Excepción de IVA",
            "maxLength": 20,
            "description": "Excepción de IVA específica que aplicará en la zona.",
            "widget": "select"
        },
        {
            "name": "id",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Identificador interno autoincremental.",
            "widget": "text"
        },
        {
            "name": "prioridad",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Prioridad",
            "description": "Prioridad de aplicación de la regla cuando hay varias coincidentes (mayor número, mayor prioridad).",
            "widget": "number"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "impuesto",
            "targetTable": "impuestos",
            "localColumn": "codimpuesto",
            "remoteColumn": "codimpuesto"
        },
        {
            "type": "belongsTo",
            "targetModel": "impuesto",
            "targetTable": "impuestos",
            "localColumn": "codimpuestosel",
            "remoteColumn": "codimpuesto"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default impuestoZonaMetadata;
//# sourceMappingURL=impuesto_zona.js.map