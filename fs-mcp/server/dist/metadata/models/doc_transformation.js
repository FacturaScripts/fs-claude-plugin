// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const docTransformationMetadata = {
    "name": "doc_transformation",
    "table": "doctransformations",
    "endpoint": "/doctransformations",
    "primaryKey": "id",
    "description": "Registro de transformación entre documentos (ej: presupuesto → pedido → factura). Trazabilidad de líneas.",
    "source": "core",
    "columns": [
        {
            "name": "cantidad",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "cantidad",
            "description": "Cantidad transferida desde la línea origen a la línea destino en la transformación.",
            "widget": "number"
        },
        {
            "name": "id",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Id.",
            "description": "Identificador interno autoincremental del registro de transformación.",
            "widget": "number"
        },
        {
            "name": "iddoc1",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "iddoc1",
            "description": "ID del documento origen (ej: idpresupuesto).",
            "widget": "number"
        },
        {
            "name": "iddoc2",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "iddoc2",
            "description": "ID del documento destino (ej: idpedido).",
            "widget": "number"
        },
        {
            "name": "idlinea1",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idlinea1",
            "description": "ID de la línea del documento origen.",
            "widget": "number"
        },
        {
            "name": "idlinea2",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "idlinea2",
            "description": "ID de la línea del documento destino.",
            "widget": "number"
        },
        {
            "name": "model1",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "model1",
            "maxLength": 30,
            "description": "Nombre del modelo del documento origen (ej: PresupuestoCliente)."
        },
        {
            "name": "model2",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "model2",
            "maxLength": 30,
            "description": "Nombre del modelo del documento destino (ej: PedidoCliente)."
        }
    ],
    "relations": [],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default docTransformationMetadata;
//# sourceMappingURL=doc_transformation.js.map