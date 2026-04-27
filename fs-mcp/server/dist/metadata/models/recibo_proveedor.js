// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const reciboProveedorMetadata = {
    "name": "recibo_proveedor",
    "table": "recibospagosprov",
    "endpoint": "/reciboproveedores",
    "primaryKey": "idrecibo",
    "description": "Recibo de pago a un proveedor. Generado a partir de una factura recibida.",
    "source": "core",
    "columns": [
        {
            "name": "coddivisa",
            "sqlType": "character varying(3)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Divisa",
            "maxLength": 3,
            "description": "Divisa del recibo. Si es distinta a la principal se aplica `tasaconv`.",
            "widget": "select",
            "foreignKey": {
                "table": "divisas",
                "column": "coddivisa",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codigofactura",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codigofactura",
            "maxLength": 20,
            "description": "Código de la factura recibida que generó el recibo."
        },
        {
            "name": "codpago",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Forma de pago",
            "maxLength": 10,
            "description": "Forma de pago aplicable al recibo.",
            "widget": "select"
        },
        {
            "name": "codproveedor",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Proveedor",
            "maxLength": 10,
            "description": "Proveedor al que se debe pagar el recibo.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "proveedores",
                "column": "codproveedor",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
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
            "description": "Fecha de emisión del recibo.",
            "widget": "date"
        },
        {
            "name": "fechapago",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha de pago",
            "description": "Fecha en la que se pagó el recibo. Vacía si todavía no se ha pagado.",
            "widget": "date"
        },
        {
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Empresa",
            "description": "ID de la empresa que paga.",
            "widget": "select"
        },
        {
            "name": "idfactura",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Factura",
            "description": "Factura del proveedor que origina el recibo.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "facturasprov",
                "column": "idfactura",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idrecibo",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental del recibo.",
            "widget": "text"
        },
        {
            "name": "importe",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Importe",
            "default": 0,
            "description": "Importe a pagar al proveedor.",
            "widget": "money"
        },
        {
            "name": "liquidado",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "liquidado",
            "default": 0,
            "description": "Importe ya liquidado/pagado del recibo.",
            "widget": "number"
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Usuario que gestionó el recibo.",
            "widget": "select"
        },
        {
            "name": "numero",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Número",
            "description": "Número correlativo del recibo dentro de la factura.",
            "widget": "number"
        },
        {
            "name": "observaciones",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Observaciones",
            "description": "Notas internas sobre el recibo.",
            "widget": "textarea"
        },
        {
            "name": "pagado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Pagado",
            "default": false,
            "description": "True si el recibo está totalmente pagado al proveedor.",
            "widget": "checkbox"
        },
        {
            "name": "vencido",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "vencido",
            "default": false,
            "description": "True si la fecha de vencimiento ya ha pasado y sigue sin pagarse.",
            "widget": "checkbox"
        },
        {
            "name": "vencimiento",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Vencimiento",
            "description": "Fecha límite en la que la empresa debe pagar al proveedor.",
            "widget": "date"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "divisa",
            "targetTable": "divisas",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "belongsTo",
            "targetModel": "proveedor",
            "targetTable": "proveedores",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        },
        {
            "type": "belongsTo",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "idfactura",
            "remoteColumn": "idfactura"
        },
        {
            "type": "hasMany",
            "targetModel": "pago_proveedor",
            "targetTable": "pagosprov",
            "localColumn": "idrecibo",
            "remoteColumn": "idrecibo"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default reciboProveedorMetadata;
//# sourceMappingURL=recibo_proveedor.js.map