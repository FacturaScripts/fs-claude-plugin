// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const partidaMetadata = {
    "name": "partida",
    "table": "partidas",
    "endpoint": "/partidas",
    "primaryKey": "idpartida",
    "description": "Línea (apunte) de un asiento contable. Recoge el debe o el haber sobre una subcuenta.",
    "source": "core",
    "columns": [
        {
            "name": "baseimponible",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Base Imponible",
            "default": 0,
            "description": "Base imponible asociada a la partida cuando se trata de IVA.",
            "widget": "money"
        },
        {
            "name": "cifnif",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Núm. fiscal",
            "maxLength": 30,
            "description": "CIF/NIF del tercero implicado en la partida (cliente o proveedor).",
            "widget": "text"
        },
        {
            "name": "codcontrapartida",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Contrapartida",
            "maxLength": 15,
            "description": "Código de la subcuenta de contrapartida (la otra cara de la operación).",
            "widget": "autocomplete"
        },
        {
            "name": "coddivisa",
            "sqlType": "character varying(3)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "coddivisa",
            "maxLength": 3,
            "description": "Divisa de la operación si es distinta a la del ejercicio."
        },
        {
            "name": "codserie",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codserie",
            "maxLength": 4,
            "description": "Serie del documento que originó la partida."
        },
        {
            "name": "codsubcuenta",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Subcuenta",
            "maxLength": 15,
            "description": "Código de la subcuenta a la que se imputa la partida.",
            "widget": "autocomplete"
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
            "description": "Concepto o glosa de la partida (suele copiarse del concepto del asiento).",
            "widget": "text"
        },
        {
            "name": "debe",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Debe",
            "default": 0,
            "description": "Importe imputado al debe.",
            "widget": "money"
        },
        {
            "name": "documento",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Documento",
            "maxLength": 50,
            "description": "Identificador del documento de origen al que se refiere la partida (factura, recibo, etc.).",
            "widget": "text"
        },
        {
            "name": "factura",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "factura",
            "maxLength": 15,
            "description": "Número/código de la factura que originó la partida."
        },
        {
            "name": "haber",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Haber",
            "default": 0,
            "description": "Importe imputado al haber.",
            "widget": "money"
        },
        {
            "name": "idasiento",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idasiento",
            "description": "Asiento contable al que pertenece la partida.",
            "widget": "text",
            "foreignKey": {
                "table": "asientos",
                "column": "idasiento",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idcontrapartida",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idcontrapartida",
            "description": "Subcuenta de contrapartida (la otra cara de la operación).",
            "widget": "number",
            "foreignKey": {
                "table": "subcuentas",
                "column": "idsubcuenta",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idpartida",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental de la partida.",
            "widget": "text"
        },
        {
            "name": "idsubcuenta",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idsubcuenta",
            "description": "Subcuenta a la que se imputa el importe de la partida.",
            "widget": "number",
            "foreignKey": {
                "table": "subcuentas",
                "column": "idsubcuenta",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "iva",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "% Impuesto",
            "description": "Porcentaje de IVA asociado a la partida (cuando aplica).",
            "widget": "number"
        },
        {
            "name": "orden",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "orden",
            "default": 0,
            "description": "Posición de la partida dentro de su asiento.",
            "widget": "number"
        },
        {
            "name": "punteada",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "punteada",
            "default": false,
            "description": "True si la partida ha sido punteada/conciliada manualmente.",
            "widget": "checkbox"
        },
        {
            "name": "recargo",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Recargo",
            "default": 0,
            "description": "Porcentaje de recargo de equivalencia asociado.",
            "widget": "number"
        },
        {
            "name": "saldo",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "saldo",
            "default": 0,
            "description": "Saldo acumulado de la subcuenta tras esta partida (calculado al consultar).",
            "widget": "number"
        },
        {
            "name": "tasaconv",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "tasaconv",
            "default": 0,
            "description": "Tasa de conversión aplicada si la divisa es distinta a la del ejercicio.",
            "widget": "number"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "asiento",
            "targetTable": "asientos",
            "localColumn": "idasiento",
            "remoteColumn": "idasiento"
        },
        {
            "type": "belongsTo",
            "targetModel": "subcuenta",
            "targetTable": "subcuentas",
            "localColumn": "idsubcuenta",
            "remoteColumn": "idsubcuenta"
        },
        {
            "type": "belongsTo",
            "targetModel": "subcuenta",
            "targetTable": "subcuentas",
            "localColumn": "idcontrapartida",
            "remoteColumn": "idsubcuenta"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default partidaMetadata;
//# sourceMappingURL=partida.js.map