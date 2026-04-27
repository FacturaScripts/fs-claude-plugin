// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const cuentaBancoProveedorMetadata = {
    "name": "cuenta_banco_proveedor",
    "table": "cuentasbcopro",
    "endpoint": "/cuentabancoproveedores",
    "primaryKey": "codcuenta",
    "description": "Cuenta bancaria de un proveedor. Usada para pagos por transferencia.",
    "source": "core",
    "columns": [
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
            "description": "Código corto único de la cuenta bancaria del proveedor.",
            "widget": "number"
        },
        {
            "name": "codproveedor",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Proveedor",
            "maxLength": 10,
            "description": "Proveedor titular de la cuenta bancaria.",
            "widget": "text",
            "foreignKey": {
                "table": "proveedores",
                "column": "codproveedor",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 100,
            "description": "Descripción/alias de la cuenta del proveedor.",
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
            "description": "Número IBAN de la cuenta del proveedor.",
            "widget": "text"
        },
        {
            "name": "principal",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Principal",
            "description": "True si es la cuenta principal del proveedor para realizar pagos.",
            "widget": "checkbox"
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
            "description": "Código SWIFT/BIC de la entidad bancaria del proveedor.",
            "widget": "text"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "proveedor",
            "targetTable": "proveedores",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default cuentaBancoProveedorMetadata;
//# sourceMappingURL=cuenta_banco_proveedor.js.map