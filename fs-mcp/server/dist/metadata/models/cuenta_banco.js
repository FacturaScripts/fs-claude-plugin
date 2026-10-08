// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const cuentaBancoMetadata = {
    "name": "cuenta_banco",
    "table": "cuentasbanco",
    "endpoint": "/cuentabancos",
    "primaryKey": "codcuenta",
    "description": "Cuenta bancaria propia de la empresa. Asociada a una subcuenta contable.",
    "source": "core",
    "columns": [
        {
            "name": "activa",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "default": true,
            "description": "True si la cuenta bancaria está activa para usar en cobros y pagos.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2024.9"
                }
            ]
        },
        {
            "name": "codcuenta",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 10,
            "description": "Código corto único de la cuenta bancaria propia.",
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
            "name": "codsubcuenta",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta",
            "maxLength": 15,
            "description": "Subcuenta contable enlazada para movimientos de la cuenta bancaria.",
            "widget": "subcuenta",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "codsubcuentagasto",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta para gastos bancarios",
            "maxLength": 15,
            "description": "Subcuenta contable para imputar gastos bancarios (comisiones, etc).",
            "widget": "subcuenta",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 100,
            "description": "Descripción/alias de la cuenta bancaria (ej: 'Cuenta principal BBVA').",
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
            "name": "iban",
            "sqlType": "character varying(34)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "IBAN",
            "maxLength": 34,
            "description": "Número IBAN completo de la cuenta bancaria.",
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
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Empresa",
            "description": "Empresa propietaria de la cuenta bancaria.",
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
            "name": "sufijosepa",
            "sqlType": "character varying(3)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Sufijo SEPA",
            "maxLength": 3,
            "description": "Sufijo SEPA (3 dígitos) usado para los mandatos de domiciliación.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.11"
                }
            ]
        },
        {
            "name": "swift",
            "sqlType": "character varying(11)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Swift/BIC",
            "maxLength": 11,
            "description": "Código SWIFT/BIC de la entidad bancaria.",
            "widget": "text",
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
            "targetModel": "empresa",
            "targetTable": "empresas",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "forma_pago",
            "targetTable": "formaspago",
            "localColumn": "codcuenta",
            "remoteColumn": "codcuentabanco"
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
export default cuentaBancoMetadata;
//# sourceMappingURL=cuenta_banco.js.map