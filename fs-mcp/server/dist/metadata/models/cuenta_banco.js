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
            "widget": "checkbox"
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
            "widget": "number"
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
            "widget": "subcuenta"
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
            "widget": "subcuenta"
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
            "widget": "text"
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
            "widget": "text"
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
            }
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
            "widget": "text"
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
            "widget": "text"
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
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default cuentaBancoMetadata;
//# sourceMappingURL=cuenta_banco.js.map