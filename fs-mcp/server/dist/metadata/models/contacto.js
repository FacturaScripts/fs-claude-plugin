// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const contactoMetadata = {
    "name": "contacto",
    "table": "contactos",
    "endpoint": "/contactos",
    "primaryKey": "idcontacto",
    "description": "Persona de contacto con datos de dirección. Sirve como dirección de envío o facturación de clientes y proveedores.",
    "source": "core",
    "columns": [
        {
            "name": "aceptaprivacidad",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Acepta la política de privacidad",
            "default": false,
            "description": "True si el contacto ha aceptado la política de privacidad (RGPD).",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.11"
                }
            ]
        },
        {
            "name": "admitemarketing",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Permite marketing",
            "default": false,
            "description": "True si el contacto ha autorizado recibir comunicaciones de marketing.",
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
            "name": "apartado",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Apartado",
            "maxLength": 10,
            "description": "Apartado postal del contacto.",
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
            "name": "apellidos",
            "sqlType": "character varying(150)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Apellidos",
            "maxLength": 150,
            "description": "Apellidos del contacto si es persona física.",
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
            "name": "cargo",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cargo",
            "maxLength": 100,
            "description": "Cargo o puesto del contacto en su empresa.",
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
            "description": "CIF/NIF/NIE del contacto.",
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
            "name": "ciudad",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Ciudad",
            "maxLength": 100,
            "description": "Ciudad de la dirección del contacto.",
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
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Agente",
            "maxLength": 10,
            "description": "Agente comercial asociado al contacto, si aplica.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "agentes",
                "column": "codagente",
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
            "name": "codcliente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cliente",
            "maxLength": 10,
            "description": "Cliente al que pertenece el contacto.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "clientes",
                "column": "codcliente",
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
            "name": "codpais",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "País",
            "maxLength": 20,
            "description": "Código del país de la dirección del contacto.",
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
            "name": "codpostal",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Código Postal",
            "maxLength": 10,
            "description": "Código postal de la dirección del contacto.",
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
            "name": "codproveedor",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Proveedor",
            "maxLength": 10,
            "description": "Proveedor al que pertenece el contacto.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "proveedores",
                "column": "codproveedor",
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
            "name": "descripcion",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Descripción",
            "maxLength": 100,
            "description": "Descripción libre del contacto (ej: 'Almacén central', 'Oficinas Madrid').",
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
            "name": "direccion",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Dirección",
            "maxLength": 200,
            "description": "Dirección postal del contacto.",
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
            "name": "email",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Email",
            "maxLength": 100,
            "description": "Email del contacto.",
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
            "name": "empresa",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Empresa",
            "maxLength": 100,
            "description": "Nombre de la empresa a la que pertenece el contacto.",
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
            "description": "Fecha de alta del contacto en el sistema.",
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
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Identificador interno autoincremental del contacto.",
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
            "name": "langcode",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Idioma",
            "maxLength": 10,
            "description": "Código de idioma preferido del contacto (es_ES, en_US, etc.).",
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
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre de pila del contacto.",
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
            "description": "Notas internas sobre el contacto.",
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
            "name": "personafisica",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Persona física",
            "default": true,
            "description": "True si el contacto es persona física, false si representa a una empresa.",
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
            "name": "provincia",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Provincia",
            "maxLength": 100,
            "description": "Provincia de la dirección del contacto.",
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
            "name": "telefono1",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Teléfono",
            "maxLength": 30,
            "description": "Teléfono principal del contacto.",
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
            "description": "Teléfono secundario o móvil del contacto.",
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
            "description": "Tipo de identificador fiscal (NIF, CIF, NIE, VAT…).",
            "widget": "select",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.04"
                }
            ]
        },
        {
            "name": "verificado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Verificado",
            "default": false,
            "description": "True si los datos del contacto han sido verificados manualmente.",
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
            "name": "web",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Web",
            "maxLength": 100,
            "description": "URL de la página web del contacto.",
            "widget": "link",
            "availability": [
                {
                    "source": "core",
                    "since": "2024"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "agente",
            "targetTable": "agentes",
            "localColumn": "codagente",
            "remoteColumn": "codagente"
        },
        {
            "type": "belongsTo",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "belongsTo",
            "targetModel": "proveedor",
            "targetTable": "proveedores",
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
            "name": "habilitado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "habilitado",
            "default": true,
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.11",
                    "until": "2024.2"
                }
            ]
        },
        {
            "name": "lastactivity",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "lastactivity",
            "widget": "datetime",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2024.2"
                }
            ]
        },
        {
            "name": "lastip",
            "sqlType": "character varying(40)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "lastip",
            "maxLength": 40,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2024.2"
                }
            ]
        },
        {
            "name": "level",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Nivel",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2024.2"
                }
            ]
        },
        {
            "name": "logkey",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "logkey",
            "maxLength": 100,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2024.2"
                }
            ]
        },
        {
            "name": "password",
            "sqlType": "character varying(255)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Contraseña",
            "maxLength": 255,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2024.2"
                }
            ]
        },
        {
            "name": "puntos",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "puntos",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2024.2"
                }
            ]
        }
    ]
};
export default contactoMetadata;
//# sourceMappingURL=contacto.js.map