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
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.01"
                }
            ]
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
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "mantenerfecha",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Mantener fecha",
            "default": false,
            "description": "True si al rellenar un hueco de numeración se respeta la fecha del documento en lugar de asignarle la del documento anterior. Solo aplica a tipos que no exigen orden cronológico.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.65"
                }
            ]
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
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            ],
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
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
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.16"
                }
            ]
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
    "availability": [
        {
            "source": "core",
            "since": "2018.03",
            "sinceFirstTag": true
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-10-07T17:38:31.723Z",
        "facturascriptsCommit": "93a6a74ac",
        "versions": {
            "core": {
                "latest": "2026.7",
                "tags": 67
            }
        }
    }
};
export default secuenciaDocumentoMetadata;
//# sourceMappingURL=secuencia_documento.js.map