// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const estadoDocumentoMetadata = {
    "name": "estado_documento",
    "table": "estados_documentos",
    "endpoint": "/estadodocumentos",
    "primaryKey": "idestado",
    "description": "Estado posible de un documento (borrador, aprobado, facturado…). Define las transiciones permitidas.",
    "source": "core",
    "columns": [
        {
            "name": "activo",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "default": true,
            "description": "True si el estado está disponible para asignar a documentos.",
            "widget": "checkbox"
        },
        {
            "name": "actualizastock",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Actualizar stock",
            "description": "Cómo afecta este estado al stock al transicionar el documento (-2/-1/0/1/2 según tipo).",
            "widget": "select",
            "enumValues": [
                "-2",
                "-1",
                "0",
                "1",
                "2"
            ]
        },
        {
            "name": "bloquear",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Bloqueado",
            "description": "True si al alcanzar este estado el documento queda bloqueado y no editable.",
            "widget": "checkbox"
        },
        {
            "name": "color",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Color",
            "maxLength": 15,
            "description": "Clase de color Bootstrap para mostrar el estado en la UI (primary, success, danger, etc.).",
            "widget": "select",
            "enumValues": [
                "primary",
                "secondary",
                "success",
                "danger",
                "warning",
                "info",
                "dark"
            ]
        },
        {
            "name": "editable",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Editable",
            "description": "True si el documento permanece editable mientras está en este estado.",
            "widget": "checkbox"
        },
        {
            "name": "generadoc",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Generar tipo de documento",
            "maxLength": 30,
            "description": "Si se debe generar otro documento al pasar a este estado, indica qué tipo (ej: FacturaCliente al aprobar un albarán).",
            "widget": "select",
            "enumValues": [
                "PresupuestoCliente",
                "PedidoCliente",
                "AlbaranCliente",
                "FacturaCliente",
                "PresupuestoProveedor",
                "PedidoProveedor",
                "AlbaranProveedor",
                "FacturaProveedor"
            ]
        },
        {
            "name": "icon",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Icono",
            "maxLength": 50,
            "description": "Icono FontAwesome a mostrar junto al estado en la UI.",
            "widget": "text"
        },
        {
            "name": "idestado",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental del estado.",
            "widget": "text"
        },
        {
            "name": "nombre",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 30,
            "description": "Nombre legible del estado (ej: Borrador, Aprobado, Facturado).",
            "widget": "text"
        },
        {
            "name": "predeterminado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Por defecto",
            "description": "True si este es el estado inicial por defecto al crear un documento del tipo indicado.",
            "widget": "checkbox"
        },
        {
            "name": "tipodoc",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Tipo de documento",
            "maxLength": 30,
            "description": "Tipo de documento al que aplica este estado.",
            "widget": "select",
            "enumValues": [
                "PresupuestoCliente",
                "PedidoCliente",
                "AlbaranCliente",
                "FacturaCliente",
                "PresupuestoProveedor",
                "PedidoProveedor",
                "AlbaranProveedor",
                "FacturaProveedor"
            ]
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "idestado",
            "remoteColumn": "idestado_ant"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_proveedor",
            "targetTable": "albaranesprov",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_proveedor",
            "targetTable": "albaranesprov",
            "localColumn": "idestado",
            "remoteColumn": "idestado_ant"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "idestado",
            "remoteColumn": "idestado_ant"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "idestado",
            "remoteColumn": "idestado_ant"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "idestado",
            "remoteColumn": "idestado_ant"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_proveedor",
            "targetTable": "pedidosprov",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_proveedor",
            "targetTable": "pedidosprov",
            "localColumn": "idestado",
            "remoteColumn": "idestado_ant"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "idestado",
            "remoteColumn": "idestado_ant"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_proveedor",
            "targetTable": "presupuestosprov",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_proveedor",
            "targetTable": "presupuestosprov",
            "localColumn": "idestado",
            "remoteColumn": "idestado_ant"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default estadoDocumentoMetadata;
//# sourceMappingURL=estado_documento.js.map