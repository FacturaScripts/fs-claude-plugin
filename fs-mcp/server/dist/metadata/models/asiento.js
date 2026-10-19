// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const asientoMetadata = {
    "name": "asiento",
    "table": "asientos",
    "endpoint": "/asientos",
    "primaryKey": "idasiento",
    "description": "Asiento contable de un ejercicio. Agrupa partidas en el debe y el haber por el mismo importe total.",
    "source": "core",
    "columns": [
        {
            "name": "canal",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Canal",
            "description": "Canal contable opcional para clasificar el asiento (centros de coste, departamentos).",
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
            "name": "codejercicio",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Ejercicio",
            "maxLength": 4,
            "description": "Ejercicio contable en el que se registra el asiento.",
            "widget": "select",
            "foreignKey": {
                "table": "ejercicios",
                "column": "codejercicio",
                "onDelete": "RESTRICT",
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
            "name": "concepto",
            "sqlType": "character varying(255)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Concepto",
            "maxLength": 255,
            "description": "Concepto o glosa que describe el asiento.",
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
            "name": "documento",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Documento",
            "maxLength": 50,
            "description": "Referencia al documento de origen del asiento (código de factura, recibo, etc.).",
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
            "name": "editable",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Editable",
            "description": "True si el asiento puede modificarse; false si está bloqueado (regularización IVA, ejercicio cerrado).",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "fecha",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Fecha",
            "description": "Fecha contable del asiento dentro del ejercicio.",
            "widget": "date",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idasiento",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental del asiento.",
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
            "name": "iddiario",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Diario",
            "description": "Diario contable donde se registra el asiento (ventas, compras, caja, etc.).",
            "widget": "select",
            "foreignKey": {
                "table": "diarios",
                "column": "iddiario",
                "onDelete": "SET NULL",
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
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idempresa",
            "description": "Empresa propietaria del asiento.",
            "widget": "number",
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
            "name": "importe",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Importe",
            "default": 0,
            "description": "Importe total del asiento (debe = haber). Se calcula desde las partidas.",
            "widget": "money",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "numero",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Número",
            "description": "Número correlativo del asiento dentro del ejercicio. Lo asigna el sistema.",
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
            "name": "operacion",
            "sqlType": "character varying(1)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "operacion",
            "maxLength": 1,
            "description": "Marca de operación especial (apertura, cierre, regularización), 1 carácter.",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.01"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "diario",
            "targetTable": "diarios",
            "localColumn": "iddiario",
            "remoteColumn": "iddiario"
        },
        {
            "type": "belongsTo",
            "targetModel": "ejercicio",
            "targetTable": "ejercicios",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "belongsTo",
            "targetModel": "empresa",
            "targetTable": "empresas",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "idasiento",
            "remoteColumn": "idasiento"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "idasiento",
            "remoteColumn": "idasiento"
        },
        {
            "type": "hasMany",
            "targetModel": "pago_cliente",
            "targetTable": "pagoscli",
            "localColumn": "idasiento",
            "remoteColumn": "idasiento"
        },
        {
            "type": "hasMany",
            "targetModel": "pago_proveedor",
            "targetTable": "pagosprov",
            "localColumn": "idasiento",
            "remoteColumn": "idasiento"
        },
        {
            "type": "hasMany",
            "targetModel": "partida",
            "targetTable": "partidas",
            "localColumn": "idasiento",
            "remoteColumn": "idasiento"
        },
        {
            "type": "hasMany",
            "targetModel": "regularizacion_impuesto",
            "targetTable": "regularizacionimpuestos",
            "localColumn": "idasiento",
            "remoteColumn": "idasiento"
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
export default asientoMetadata;
//# sourceMappingURL=asiento.js.map