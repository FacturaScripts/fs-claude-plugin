// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const cuentaBancoClienteMetadata = {
    "name": "cuenta_banco_cliente",
    "table": "cuentasbcocli",
    "endpoint": "/cuentabancoclientes",
    "primaryKey": "codcuenta",
    "description": "Cuenta bancaria de un cliente. Usada para cobros por domiciliación.",
    "source": "core",
    "columns": [
        {
            "name": "codcliente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Cliente",
            "maxLength": 10,
            "description": "Cliente titular de la cuenta bancaria.",
            "widget": "text",
            "foreignKey": {
                "table": "clientes",
                "column": "codcliente",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
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
            "description": "Código corto único de la cuenta bancaria del cliente.",
            "widget": "text"
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
            "description": "Descripción/alias de la cuenta (ej: 'Caja principal').",
            "widget": "text"
        },
        {
            "name": "fmandato",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fecha Mandato",
            "description": "Fecha en la que el cliente firmó el mandato SEPA de domiciliación.",
            "widget": "date"
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
            "description": "Número IBAN de la cuenta del cliente.",
            "widget": "text"
        },
        {
            "name": "mandato",
            "sqlType": "character varying(35)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Mandato",
            "maxLength": 35,
            "description": "Identificador del mandato SEPA firmado por el cliente.",
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
            "description": "True si esta es la cuenta principal del cliente para domiciliaciones.",
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
            "description": "Código SWIFT/BIC de la entidad bancaria del cliente.",
            "widget": "text"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default cuentaBancoClienteMetadata;
//# sourceMappingURL=cuenta_banco_cliente.js.map