// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const grupoClientesMetadata = {
    "name": "grupo_clientes",
    "table": "gruposclientes",
    "endpoint": "/grupoclientes",
    "primaryKey": "codgrupo",
    "description": "Grupo de clientes. Permite agrupar clientes para reporting y descuentos.",
    "source": "core",
    "columns": [
        {
            "name": "codgrupo",
            "sqlType": "character varying(6)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 6,
            "description": "Código corto único del grupo de clientes.",
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
            "name": "codsubcuenta",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta",
            "maxLength": 15,
            "description": "Subcuenta contable por defecto para los clientes del grupo.",
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
            "name": "codtarifa",
            "sqlType": "character varying(6)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Tarifa",
            "maxLength": 6,
            "description": "Tarifa de precios aplicable a los clientes del grupo por defecto.",
            "widget": "select",
            "foreignKey": {
                "table": "tarifas",
                "column": "codtarifa",
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
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre legible del grupo de clientes.",
            "widget": "text",
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
            "targetModel": "tarifa",
            "targetTable": "tarifas",
            "localColumn": "codtarifa",
            "remoteColumn": "codtarifa"
        },
        {
            "type": "hasMany",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codgrupo",
            "remoteColumn": "codgrupo"
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
            "name": "parent",
            "sqlType": "character varying(6)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Padre",
            "maxLength": 6,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.04"
                }
            ]
        }
    ]
};
export default grupoClientesMetadata;
//# sourceMappingURL=grupo_clientes.js.map