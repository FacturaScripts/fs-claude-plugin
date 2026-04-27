// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const secuenciaDocumentoMetadata = {
    "name": "secuencia_documento",
    "table": "secuencias_documentos",
    "endpoint": "/secuenciadocumentos",
    "primaryKey": "idsecuencia",
    "description": "Secuencia de numeración por tipo de documento, serie, ejercicio y empresa. Controla el siguiente número.",
    "source": "core",
    "columns": [
        {
            "name": "codejercicio",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Ejercicio",
            "maxLength": 4,
            "description": "Ejercicio contable en el que se aplica la secuencia. Vacío si aplica a todos los ejercicios.",
            "widget": "select",
            "foreignKey": {
                "table": "ejercicios",
                "column": "codejercicio",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codserie",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Serie",
            "maxLength": 4,
            "description": "Serie a la que aplica la secuencia. Vacío si aplica a todas las series.",
            "widget": "select",
            "foreignKey": {
                "table": "series",
                "column": "codserie",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Empresa",
            "description": "Empresa a la que aplica la secuencia. Vacío si aplica a todas las empresas.",
            "widget": "select",
            "foreignKey": {
                "table": "empresas",
                "column": "idempresa",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idsecuencia",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental de la secuencia.",
            "widget": "text"
        },
        {
            "name": "inicio",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Número inicial",
            "description": "Número desde el que empieza a numerar la secuencia.",
            "widget": "number"
        },
        {
            "name": "longnumero",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Longitud del número",
            "description": "Longitud mínima del número (se rellena con ceros a la izquierda).",
            "widget": "number"
        },
        {
            "name": "numero",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Número",
            "description": "Próximo número que asignará la secuencia al siguiente documento.",
            "widget": "number"
        },
        {
            "name": "patron",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Patrón",
            "maxLength": 50,
            "description": "Patrón de generación del código del documento (ej: '{SERIE}-{ANYO}-{NUM}').",
            "widget": "text"
        },
        {
            "name": "tipodoc",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Tipo de documento",
            "maxLength": 30,
            "description": "Tipo de documento al que aplica la secuencia.",
            "widget": "select",
            "enumValues": [
                "PresupuestoCliente",
                "PedidoCliente",
                "AlbaranCliente",
                "FacturaCliente",
                "PresupuestoProveedor",
                "PedidoProveedor",
                "AlbaranProveedor",
                "FacturaProveedor"
            ]
        },
        {
            "name": "usarhuecos",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Usar huecos",
            "default": false,
            "description": "True si la secuencia debe reaprovechar números no usados (huecos por borrado).",
            "widget": "checkbox"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "ejercicio",
            "targetTable": "ejercicios",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "belongsTo",
            "targetModel": "serie",
            "targetTable": "series",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "belongsTo",
            "targetModel": "empresa",
            "targetTable": "empresas",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default secuenciaDocumentoMetadata;
//# sourceMappingURL=secuencia_documento.js.map