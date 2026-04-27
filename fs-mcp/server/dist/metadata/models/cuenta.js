// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const cuentaMetadata = {
    "name": "cuenta",
    "table": "cuentas",
    "endpoint": "/cuentas",
    "primaryKey": "idcuenta",
    "description": "Cuenta contable de un ejercicio según el plan general. Agrupa subcuentas.",
    "source": "core",
    "columns": [
        {
            "name": "codcuenta",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Cuenta",
            "maxLength": 10,
            "description": "Código de la cuenta contable según el plan general (ej: 700, 4300).",
            "widget": "text"
        },
        {
            "name": "codcuentaesp",
            "sqlType": "character varying(6)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cuenta especial",
            "maxLength": 6,
            "description": "Alias de cuenta especial (ej: VENTAS, COMPRAS, IVAREP) que identifica el rol de la cuenta.",
            "widget": "select",
            "foreignKey": {
                "table": "cuentasesp",
                "column": "codcuentaesp",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codejercicio",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Ejercicio fiscal",
            "maxLength": 4,
            "description": "Ejercicio contable al que pertenece la cuenta.",
            "widget": "select",
            "foreignKey": {
                "table": "ejercicios",
                "column": "codejercicio",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "debe",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Debe",
            "description": "Suma acumulada de los importes en el debe de las partidas de esta cuenta.",
            "widget": "money"
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(255)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 255,
            "description": "Descripción de la cuenta contable.",
            "widget": "text"
        },
        {
            "name": "haber",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Haber",
            "description": "Suma acumulada de los importes en el haber de las partidas de esta cuenta.",
            "widget": "money"
        },
        {
            "name": "idcuenta",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental de la cuenta dentro del ejercicio.",
            "widget": "text"
        },
        {
            "name": "parent_codcuenta",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "parent_codcuenta",
            "maxLength": 10,
            "description": "Código de la cuenta padre en la jerarquía contable. Vacío si es de primer nivel."
        },
        {
            "name": "parent_idcuenta",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Cuenta Padre",
            "description": "Cuenta padre en la jerarquía contable. Vacío si es de primer nivel.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "cuentas",
                "column": "idcuenta",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "saldo",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Saldo",
            "description": "Saldo de la cuenta calculado como debe menos haber.",
            "widget": "money"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "cuenta_especial",
            "targetTable": "cuentasesp",
            "localColumn": "codcuentaesp",
            "remoteColumn": "codcuentaesp"
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
            "targetModel": "cuenta",
            "targetTable": "cuentas",
            "localColumn": "parent_idcuenta",
            "remoteColumn": "idcuenta"
        },
        {
            "type": "hasMany",
            "targetModel": "subcuenta",
            "targetTable": "subcuentas",
            "localColumn": "idcuenta",
            "remoteColumn": "idcuenta"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default cuentaMetadata;
//# sourceMappingURL=cuenta.js.map