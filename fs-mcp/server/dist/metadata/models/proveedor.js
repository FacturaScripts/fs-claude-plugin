// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const proveedorMetadata = {
    "name": "proveedor",
    "table": "proveedores",
    "endpoint": "/proveedores",
    "primaryKey": "codproveedor",
    "description": "Proveedor de la empresa. Datos fiscales, dirección y condiciones de compra.",
    "source": "core",
    "columns": [
        {
            "name": "acreedor",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Es acreedor",
            "default": false,
            "description": "True si la entidad es acreedor (factura servicios sin productos físicos); false si es proveedor estándar.",
            "widget": "select",
            "enumValues": [
                "1",
                "0"
            ]
        },
        {
            "name": "cifnif",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Núm. fiscal",
            "maxLength": 30,
            "description": "CIF/NIF/NIE del proveedor.",
            "widget": "text"
        },
        {
            "name": "codcliente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codcliente",
            "maxLength": 10,
            "description": "Código del cliente asociado, si la misma entidad actúa también como cliente."
        },
        {
            "name": "codpago",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Forma de pago",
            "maxLength": 10,
            "description": "Forma de pago habitual al proveedor.",
            "widget": "select",
            "foreignKey": {
                "table": "formaspago",
                "column": "codpago",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codproveedor",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 10,
            "description": "Código corto único del proveedor. Se usa como referencia en documentos.",
            "widget": "text"
        },
        {
            "name": "codretencion",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Retención",
            "maxLength": 10,
            "description": "Retención fiscal (IRPF) aplicable a sus facturas.",
            "widget": "select",
            "foreignKey": {
                "table": "retenciones",
                "column": "codretencion",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codserie",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Serie",
            "maxLength": 4,
            "description": "Serie de numeración por defecto para los documentos del proveedor.",
            "widget": "select",
            "foreignKey": {
                "table": "series",
                "column": "codserie",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
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
            "description": "Indique una subcuenta a usar o deje el campo en blanco para asignar una automáticamente.",
            "widget": "text"
        },
        {
            "name": "debaja",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "debaja",
            "default": false,
            "description": "True si el proveedor está dado de baja; false si sigue activo.",
            "widget": "checkbox"
        },
        {
            "name": "excepcioniva",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Excepción de IVA",
            "maxLength": 20,
            "description": "Excepción de IVA aplicable a este proveedor.",
            "widget": "select"
        },
        {
            "name": "email",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Email",
            "maxLength": 100,
            "description": "Email principal del proveedor.",
            "widget": "email"
        },
        {
            "name": "fax",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fax",
            "maxLength": 30,
            "description": "Número de fax del proveedor.",
            "widget": "text"
        },
        {
            "name": "fechaalta",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha de creación",
            "description": "Fecha de alta del proveedor en el sistema.",
            "widget": "date"
        },
        {
            "name": "fechabaja",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fecha de baja",
            "description": "Fecha de baja. Si está vacía, sigue activo.",
            "widget": "date"
        },
        {
            "name": "idcontacto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Contacto",
            "description": "Identificador del contacto principal asociado al proveedor.",
            "widget": "select"
        },
        {
            "name": "langcode",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Idioma",
            "maxLength": 10,
            "description": "Código de idioma del proveedor (es_ES, en_US, etc.).",
            "widget": "select"
        },
        {
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre por el que es conocido el proveedor. Para uso interno.",
            "widget": "text"
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
            "description": "Notas internas sobre el proveedor.",
            "widget": "textarea"
        },
        {
            "name": "operacion",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Operación",
            "maxLength": 20,
            "description": "Tipo de operación fiscal por defecto en sus facturas.",
            "widget": "select"
        },
        {
            "name": "personafisica",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Tipo",
            "default": true,
            "description": "True si es persona física; false si es persona jurídica.",
            "widget": "select",
            "enumValues": [
                "1",
                "0"
            ]
        },
        {
            "name": "razonsocial",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Razón Social",
            "maxLength": 100,
            "description": "Razón social oficial del proveedor, para las facturas y otros documentos.",
            "widget": "text"
        },
        {
            "name": "regimeniva",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Régimen impuestos",
            "maxLength": 50,
            "description": "Régimen de IVA del proveedor.",
            "widget": "select"
        },
        {
            "name": "telefono1",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Teléfono",
            "maxLength": 30,
            "description": "Teléfono principal del proveedor.",
            "widget": "text"
        },
        {
            "name": "telefono2",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Teléfono 2",
            "maxLength": 30,
            "description": "Teléfono secundario o móvil.",
            "widget": "text"
        },
        {
            "name": "tipoidfiscal",
            "sqlType": "character varying(25)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Id. Fiscal",
            "maxLength": 25,
            "description": "Tipo de identificador fiscal (NIF, CIF, NIE, VAT, etc.).",
            "widget": "select"
        },
        {
            "name": "web",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Web",
            "maxLength": 100,
            "description": "URL de la página web del proveedor.",
            "widget": "link"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "forma_pago",
            "targetTable": "formaspago",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "belongsTo",
            "targetModel": "retencion",
            "targetTable": "retenciones",
            "localColumn": "codretencion",
            "remoteColumn": "codretencion"
        },
        {
            "type": "belongsTo",
            "targetModel": "serie",
            "targetTable": "series",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_proveedor",
            "targetTable": "albaranesprov",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        },
        {
            "type": "hasMany",
            "targetModel": "contacto",
            "targetTable": "contactos",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        },
        {
            "type": "hasMany",
            "targetModel": "cuenta_banco_proveedor",
            "targetTable": "cuentasbcopro",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_proveedor",
            "targetTable": "pedidosprov",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_proveedor",
            "targetTable": "presupuestosprov",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        },
        {
            "type": "hasMany",
            "targetModel": "producto_proveedor",
            "targetTable": "productosprov",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        },
        {
            "type": "hasMany",
            "targetModel": "recibo_proveedor",
            "targetTable": "recibospagosprov",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default proveedorMetadata;
//# sourceMappingURL=proveedor.js.map