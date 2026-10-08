// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const regularizacionImpuestoMetadata = {
    "name": "regularizacion_impuesto",
    "table": "regularizacionimpuestos",
    "endpoint": "/regularizacionimpuestos",
    "primaryKey": "idregiva",
    "description": "Regularización trimestral o mensual de IVA. Genera el asiento de cierre del periodo fiscal.",
    "source": "core",
    "columns": [
        {
            "name": "bloquear",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "bloquear",
            "default": true,
            "description": "True si tras la regularización el ejercicio queda bloqueado para nuevos asientos en este periodo.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.51"
                }
            ]
        },
        {
            "name": "codejercicio",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "codejercicio",
            "maxLength": 4,
            "description": "Ejercicio contable al que pertenece la regularización.",
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
            "name": "codsubcuentaacr",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codsubcuentaacr",
            "maxLength": 15,
            "description": "Subcuenta acreedora a usar para liquidar IVA repercutido.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.05"
                }
            ]
        },
        {
            "name": "codsubcuentadeu",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codsubcuentadeu",
            "maxLength": 15,
            "description": "Subcuenta deudora a usar para liquidar IVA soportado.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.05"
                }
            ]
        },
        {
            "name": "fechaasiento",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "fechaasiento",
            "description": "Fecha del asiento contable de regularización.",
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
            "name": "fechafin",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "fechafin",
            "description": "Fecha de fin del periodo a regularizar (último día del trimestre/mes).",
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
            "name": "fechainicio",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "fechainicio",
            "description": "Fecha de inicio del periodo a regularizar (primer día del trimestre/mes).",
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
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idasiento",
            "description": "Asiento contable de regularización generado.",
            "widget": "number",
            "foreignKey": {
                "table": "asientos",
                "column": "idasiento",
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
            "description": "Empresa para la que se realiza la regularización.",
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
            "name": "idregiva",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idregiva",
            "description": "Identificador interno autoincremental de la regularización.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.05"
                }
            ]
        },
        {
            "name": "idsubcuentaacr",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idsubcuentaacr",
            "description": "Subcuenta acreedora usada para liquidar IVA repercutido.",
            "widget": "number",
            "foreignKey": {
                "table": "subcuentas",
                "column": "idsubcuenta",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2018.05"
                }
            ]
        },
        {
            "name": "idsubcuentadeu",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idsubcuentadeu",
            "description": "Subcuenta deudora usada para liquidar IVA soportado.",
            "widget": "number",
            "foreignKey": {
                "table": "subcuentas",
                "column": "idsubcuenta",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2018.05"
                }
            ]
        },
        {
            "name": "periodo",
            "sqlType": "character varying(8)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "periodo",
            "maxLength": 8,
            "description": "Periodo regularizado (ej: T1, T2, T3, T4, ENE, FEB, etc.).",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
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
            "targetModel": "subcuenta",
            "targetTable": "subcuentas",
            "localColumn": "idsubcuentaacr",
            "remoteColumn": "idsubcuenta"
        },
        {
            "type": "belongsTo",
            "targetModel": "subcuenta",
            "targetTable": "subcuentas",
            "localColumn": "idsubcuentadeu",
            "remoteColumn": "idsubcuenta"
        },
        {
            "type": "belongsTo",
            "targetModel": "asiento",
            "targetTable": "asientos",
            "localColumn": "idasiento",
            "remoteColumn": "idasiento"
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
    },
    "retiredColumns": [
        {
            "name": "codsubcuentaacreedora",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codsubcuentaacreedora",
            "maxLength": 15,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.04"
                }
            ]
        },
        {
            "name": "codsubcuentadeudora",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codsubcuentadeudora",
            "maxLength": 15,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.04"
                }
            ]
        },
        {
            "name": "idregularizacion",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "idregularizacion",
            "default": "nextval('regularizacionimpuestos_idregularizacion_seq'::regclass)",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.04"
                }
            ]
        },
        {
            "name": "idsubcuentaacreedora",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idsubcuentaacreedora",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.04"
                }
            ]
        },
        {
            "name": "idsubcuentadeudora",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idsubcuentadeudora",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.04"
                }
            ]
        }
    ]
};
export default regularizacionImpuestoMetadata;
//# sourceMappingURL=regularizacion_impuesto.js.map