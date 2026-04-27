// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const retencionMetadata = {
    "name": "retencion",
    "table": "retenciones",
    "endpoint": "/retenciones",
    "primaryKey": "codretencion",
    "description": "Retención fiscal aplicable a documentos (IRPF, etc.). Lleva porcentaje y subcuenta.",
    "source": "core",
    "columns": [
        {
            "name": "activa",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "default": true,
            "description": "True si la retención está activa para asignar a documentos.",
            "widget": "checkbox"
        },
        {
            "name": "codretencion",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": false,
            "isRequired": true,
            "label": "Código",
            "maxLength": 10,
            "description": "Código corto único de la retención.",
            "widget": "text"
        },
        {
            "name": "codsubcuentaret",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cuenta retenciones ventas",
            "maxLength": 15,
            "description": "Subcuenta contable de la retención en ventas (cliente).",
            "widget": "subcuenta"
        },
        {
            "name": "codsubcuentaacr",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Subcuenta de retenciones para compras",
            "maxLength": 15,
            "description": "Subcuenta contable de la retención en compras (proveedor).",
            "widget": "subcuenta"
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 50,
            "description": "Descripción legible (ej: IRPF profesionales 15%).",
            "widget": "text"
        },
        {
            "name": "porcentaje",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Porcentaje",
            "description": "Porcentaje de retención aplicable.",
            "widget": "text"
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codretencion",
            "remoteColumn": "codretencion"
        },
        {
            "type": "hasMany",
            "targetModel": "proveedor",
            "targetTable": "proveedores",
            "localColumn": "codretencion",
            "remoteColumn": "codretencion"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default retencionMetadata;
//# sourceMappingURL=retencion.js.map