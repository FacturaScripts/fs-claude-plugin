// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const identificadorFiscalMetadata: ModelMetadata = {
    "name": "identificador_fiscal",
    "table": "idsfiscales",
    "endpoint": "/identificadorfiscales",
    "primaryKey": "tipoidfiscal",
    "description": "Tipo de identificador fiscal (NIF, CIF, NIE, VAT…). Usado por clientes, proveedores y la propia empresa.",
    "source": "core",
    "columns": [
        {
            "name": "codeid",
            "sqlType": "character varying(2)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Código",
            "maxLength": 2,
            "description": "Código ISO de 2 letras del país asociado (ej: ES, FR, DE).",
            "widget": "text"
        },
        {
            "name": "tipoidfiscal",
            "sqlType": "character varying(25)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 25,
            "description": "Nombre del tipo de identificador fiscal (NIF, CIF, NIE, VAT, etc.).",
            "widget": "text"
        },
        {
            "name": "validar",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Validar",
            "default": false,
            "description": "True si el sistema debe validar el formato al introducir un identificador de este tipo.",
            "widget": "checkbox"
        }
    ],
    "relations": [],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default identificadorFiscalMetadata;
