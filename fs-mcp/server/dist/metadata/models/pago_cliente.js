// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const pagoClienteMetadata = {
    "name": "pago_cliente",
    "table": "pagoscli",
    "endpoint": "/pagoclientes",
    "primaryKey": "idpago",
    "description": "Pago realizado por un cliente sobre un recibo. Marca el cobro y la fecha.",
    "source": "core",
    "columns": [
        {
            "name": "codpago",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codpago",
            "maxLength": 10,
            "description": "Código de la forma de pago usada en este cobro."
        },
        {
            "name": "customid",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "customid",
            "maxLength": 30,
            "description": "Identificador externo del pago si proviene de una pasarela de cobro."
        },
        {
            "name": "customstatus",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "customstatus",
            "maxLength": 30,
            "description": "Estado externo del pago según la pasarela."
        },
        {
            "name": "fecha",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "fecha",
            "description": "Fecha del cobro.",
            "widget": "date"
        },
        {
            "name": "gastos",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "gastos",
            "default": 0,
            "description": "Gastos asociados al cobro (comisiones bancarias, etc.).",
            "widget": "number"
        },
        {
            "name": "hora",
            "sqlType": "time",
            "tsType": "time",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "hora",
            "description": "Hora del cobro (HH:MM:SS)."
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
            "description": "Asiento contable generado al registrar el cobro.",
            "widget": "number",
            "foreignKey": {
                "table": "asientos",
                "column": "idasiento",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idpago",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idpago",
            "description": "Identificador interno autoincremental del cobro.",
            "widget": "number"
        },
        {
            "name": "idrecibo",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idrecibo",
            "description": "Recibo del cliente que origina este cobro.",
            "widget": "number",
            "foreignKey": {
                "table": "recibospagoscli",
                "column": "idrecibo",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "importe",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "importe",
            "default": 0,
            "description": "Importe cobrado al cliente.",
            "widget": "number"
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Usuario que registró el cobro."
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
            "targetModel": "recibo_cliente",
            "targetTable": "recibospagoscli",
            "localColumn": "idrecibo",
            "remoteColumn": "idrecibo"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default pagoClienteMetadata;
//# sourceMappingURL=pago_cliente.js.map