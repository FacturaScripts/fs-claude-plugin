// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const diarioMetadata: ModelMetadata = {
    "name": "diario",
    "table": "diarios",
    "endpoint": "/diarios",
    "primaryKey": "iddiario",
    "description": "Diario contable. Permite separar asientos por tipo (ventas, compras, caja, etc.).",
    "source": "core",
    "columns": [
        {
            "name": "descripcion",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Descripción",
            "maxLength": 100,
            "description": "Descripción del diario contable (ej: Ventas, Compras, Caja).",
            "widget": "text"
        },
        {
            "name": "iddiario",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "description": "Identificador interno autoincremental del diario.",
            "widget": "text"
        }
    ],
    "relations": [
        {
            "type": "hasMany",
            "targetModel": "asiento",
            "targetTable": "asientos",
            "localColumn": "iddiario",
            "remoteColumn": "iddiario"
        },
        {
            "type": "hasMany",
            "targetModel": "serie",
            "targetTable": "series",
            "localColumn": "iddiario",
            "remoteColumn": "iddiario"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default diarioMetadata;
