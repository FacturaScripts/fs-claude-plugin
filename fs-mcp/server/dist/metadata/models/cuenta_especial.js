// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const cuentaEspecialMetadata = {
    "name": "cuenta_especial",
    "table": "cuentasesp",
    "endpoint": "/cuentaespeciales",
    "primaryKey": "codcuentaesp",
    "description": "Cuenta especial: alias para que el sistema sepa qué cuenta usar (ventas, compras, IVA repercutido, etc.).",
    "source": "core",
    "columns": [
        {
            "name": "codcuentaesp",
            "sqlType": "character varying(6)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 6,
            "description": "Código corto único del alias contable (ej: VENTAS, COMPRAS, IVAREP).",
            "widget": "text"
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(255)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 255,
            "description": "Descripción del propósito del alias contable.",
            "widget": "text"
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "cuenta",
            "targetTable": "cuentas",
            "localColumn": "codcuentaesp",
            "remoteColumn": "codcuentaesp"
        },
        {
            "type": "hasMany",
            "targetModel": "subcuenta",
            "targetTable": "subcuentas",
            "localColumn": "codcuentaesp",
            "remoteColumn": "codcuentaesp"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default cuentaEspecialMetadata;
//# sourceMappingURL=cuenta_especial.js.map