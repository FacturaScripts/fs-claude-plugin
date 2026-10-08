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
            ],
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
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
            "name": "codcliente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codcliente",
            "maxLength": 10,
            "description": "Código del cliente asociado, si la misma entidad actúa también como cliente.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.1"
                }
            ]
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
            "widget": "email",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "name": "fechaalta",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha creación",
            "description": "Fecha de alta del proveedor en el sistema.",
            "widget": "date",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "widget": "date",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.03"
                }
            ]
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
            "name": "observaciones",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Observaciones",
            "description": "Notas internas sobre el proveedor.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "operacion",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Operación",
            "maxLength": 30,
            "description": "Tipo de operación fiscal por defecto en sus facturas.",
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.1"
                }
            ]
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
            ],
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
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
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
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
            "widget": "link",
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
    },
    "retiredColumns": [
        {
            "name": "codimpuestoportes",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codimpuestoportes",
            "maxLength": 10,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2025.81"
                }
            ]
        },
        {
            "name": "irpf",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "IRPF",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        }
    ]
};
export default proveedorMetadata;
//# sourceMappingURL=proveedor.js.map