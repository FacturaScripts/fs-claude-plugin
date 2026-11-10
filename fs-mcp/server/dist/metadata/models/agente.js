// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const agenteMetadata = {
    "name": "agente",
    "table": "agentes",
    "endpoint": "/agentes",
    "primaryKey": "codagente",
    "description": "Agente comercial con datos personales y comisión asociada. Vincula a clientes y documentos.",
    "source": "core",
    "columns": [
        {
            "name": "cargo",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cargo",
            "maxLength": 100,
            "description": "Cargo o puesto del agente comercial dentro de su empresa.",
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
            "name": "cifnif",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Núm. fiscal",
            "maxLength": 30,
            "description": "CIF/NIF del agente comercial.",
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
            "name": "codagente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 10,
            "description": "Código corto único del agente comercial. Se usa como referencia en clientes y documentos.",
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
            "description": "True si el agente está dado de baja (ya no opera); false si sigue activo.",
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
            "name": "email",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Email",
            "maxLength": 100,
            "description": "Email del agente comercial.",
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
            "description": "Fecha de alta del agente en el sistema.",
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
            "description": "Fecha en la que se dio de baja al agente. Si está vacía, sigue activo.",
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
            "description": "Identificador del contacto asociado al agente (datos personales y dirección).",
            "widget": "autocomplete",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.04"
                }
            ]
        },
        {
            "name": "idproducto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Producto de liquidación",
            "description": "Producto del catálogo asociado al agente, si lo representa o vende en exclusiva.",
            "widget": "text",
            "foreignKey": {
                "table": "productos",
                "column": "idproducto",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2018.04"
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
            "description": "Nombre completo del agente comercial.",
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
            "description": "Notas internas sobre el agente.",
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
            "name": "telefono1",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "telefono1",
            "maxLength": 30,
            "description": "Teléfono principal del agente.",
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
            "label": "telefono2",
            "maxLength": 30,
            "description": "Teléfono secundario o móvil del agente.",
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
            "description": "Tipo de identificador fiscal del agente (NIF, CIF, NIE, etc.). Determina el formato de `cifnif`.",
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.04"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "codagente",
            "remoteColumn": "codagente"
        },
        {
            "type": "hasMany",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codagente",
            "remoteColumn": "codagente"
        },
        {
            "type": "hasMany",
            "targetModel": "contacto",
            "targetTable": "contactos",
            "localColumn": "codagente",
            "remoteColumn": "codagente"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "codagente",
            "remoteColumn": "codagente"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "codagente",
            "remoteColumn": "codagente"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "codagente",
            "remoteColumn": "codagente"
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
            "name": "banco",
            "sqlType": "character varying(34)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "banco",
            "maxLength": 34,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        },
        {
            "name": "ciudad",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "ciudad",
            "maxLength": 100,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        },
        {
            "name": "codpostal",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codpostal",
            "maxLength": 10,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        },
        {
            "name": "direccion",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "direccion",
            "maxLength": 100,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        },
        {
            "name": "fechanacimiento",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "fechanacimiento",
            "widget": "date",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        },
        {
            "name": "porcomision",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "porcomision",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        },
        {
            "name": "provincia",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "provincia",
            "maxLength": 100,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        },
        {
            "name": "seg_social",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "seg_social",
            "maxLength": 100,
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
export default agenteMetadata;
//# sourceMappingURL=agente.js.map