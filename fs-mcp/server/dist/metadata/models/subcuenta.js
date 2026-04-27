// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const subcuentaMetadata = {
    "name": "subcuenta",
    "table": "subcuentas",
    "endpoint": "/subcuentas",
    "primaryKey": "idsubcuenta",
    "description": "Subcuenta contable de un ejercicio. Es el nivel de detalle donde se imputan las partidas.",
    "source": "core",
    "columns": [
        {
            "name": "codcuenta",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "codcuenta",
            "maxLength": 10,
            "description": "Código de la cuenta padre en el plan contable."
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
            "description": "Alias de cuenta especial (ej: VENTAS, CLIENT, IVAREP) que identifica el rol funcional de la subcuenta.",
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
            "description": "Ejercicio contable al que pertenece la subcuenta.",
            "widget": "select",
            "foreignKey": {
                "table": "ejercicios",
                "column": "codejercicio",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codsubcuenta",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Subcuenta",
            "maxLength": 15,
            "description": "Código de la subcuenta. Soporta el carácter punto para autocompletar ceros (ej: 11.1 = 1100000001).",
            "widget": "text"
        },
        {
            "name": "debe",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Debe",
            "default": 0,
            "description": "Suma acumulada de los importes en el debe de las partidas de esta subcuenta.",
            "widget": "money"
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(255)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 255,
            "description": "Descripción legible de la subcuenta.",
            "widget": "text"
        },
        {
            "name": "haber",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Haber",
            "default": 0,
            "description": "Suma acumulada de los importes en el haber de las partidas de esta subcuenta.",
            "widget": "money"
        },
        {
            "name": "idcuenta",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Cuenta",
            "description": "Cuenta padre en el plan contable a la que pertenece la subcuenta.",
            "widget": "select",
            "foreignKey": {
                "table": "cuentas",
                "column": "idcuenta",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idsubcuenta",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idsubcuenta",
            "description": "Identificador interno autoincremental de la subcuenta dentro del ejercicio.",
            "widget": "number"
        },
        {
            "name": "saldo",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Saldo",
            "default": 0,
            "description": "Saldo de la subcuenta calculado como debe menos haber.",
            "widget": "money"
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
            "targetModel": "cuenta",
            "targetTable": "cuentas",
            "localColumn": "idcuenta",
            "remoteColumn": "idcuenta"
        },
        {
            "type": "belongsTo",
            "targetModel": "cuenta_especial",
            "targetTable": "cuentasesp",
            "localColumn": "codcuentaesp",
            "remoteColumn": "codcuentaesp"
        },
        {
            "type": "hasMany",
            "targetModel": "partida",
            "targetTable": "partidas",
            "localColumn": "idsubcuenta",
            "remoteColumn": "idsubcuenta"
        },
        {
            "type": "hasMany",
            "targetModel": "partida",
            "targetTable": "partidas",
            "localColumn": "idsubcuenta",
            "remoteColumn": "idcontrapartida"
        },
        {
            "type": "hasMany",
            "targetModel": "regularizacion_impuesto",
            "targetTable": "regularizacionimpuestos",
            "localColumn": "idsubcuenta",
            "remoteColumn": "idsubcuentaacr"
        },
        {
            "type": "hasMany",
            "targetModel": "regularizacion_impuesto",
            "targetTable": "regularizacionimpuestos",
            "localColumn": "idsubcuenta",
            "remoteColumn": "idsubcuentadeu"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default subcuentaMetadata;
//# sourceMappingURL=subcuenta.js.map