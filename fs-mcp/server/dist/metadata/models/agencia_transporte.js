// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const agenciaTransporteMetadata = {
    "name": "agencia_transporte",
    "table": "agenciastrans",
    "endpoint": "/agenciatransportes",
    "primaryKey": "codtrans",
    "description": "Agencia de transporte usada para envíos. Asignable a documentos de venta y compra.",
    "source": "core",
    "columns": [
        {
            "name": "activo",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "default": true,
            "description": "True si la agencia de transporte está activa y se puede asignar a documentos.",
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
            "name": "codtrans",
            "sqlType": "character varying(8)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 8,
            "description": "Código corto único de la agencia de transporte. Se usa como referencia en albaranes y facturas.",
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
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre comercial de la agencia de transporte.",
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
            "name": "telefono",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Teléfono",
            "maxLength": 30,
            "description": "Teléfono de contacto de la agencia.",
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
            "name": "web",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Dirección web",
            "maxLength": 100,
            "description": "URL de la página web de la agencia.",
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
            "type": "hasMany",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "codtrans",
            "remoteColumn": "codtrans"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "codtrans",
            "remoteColumn": "codtrans"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "codtrans",
            "remoteColumn": "codtrans"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "codtrans",
            "remoteColumn": "codtrans"
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
    }
};
export default agenciaTransporteMetadata;
//# sourceMappingURL=agencia_transporte.js.map