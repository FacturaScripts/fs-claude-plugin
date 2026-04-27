// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const ejercicioMetadata: ModelMetadata = {
    "name": "ejercicio",
    "table": "ejercicios",
    "endpoint": "/ejercicios",
    "primaryKey": "codejercicio",
    "description": "Ejercicio contable de la empresa, definido por fecha de inicio y fin. Contiene los asientos del periodo.",
    "source": "core",
    "columns": [
        {
            "name": "codejercicio",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": true,
            "label": "Código",
            "maxLength": 4,
            "description": "Código corto del ejercicio (suele ser el año, ej: 2024).",
            "widget": "text"
        },
        {
            "name": "estado",
            "sqlType": "character varying(15)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Estado",
            "maxLength": 15,
            "description": "Estado del ejercicio: ABIERTO si admite movimientos, CERRADO si se ha cerrado contablemente.",
            "widget": "select",
            "enumValues": [
                "ABIERTO",
                "CERRADO"
            ]
        },
        {
            "name": "fechafin",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Fecha de fin",
            "description": "Fecha de fin del ejercicio (último día contabilizable).",
            "widget": "date"
        },
        {
            "name": "fechainicio",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Fecha de inicio",
            "description": "Fecha de inicio del ejercicio (primer día contabilizable).",
            "widget": "date"
        },
        {
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Empresa",
            "description": "Empresa propietaria del ejercicio contable.",
            "widget": "select",
            "foreignKey": {
                "table": "empresas",
                "column": "idempresa",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "longsubcuenta",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Longitud de subcuenta",
            "description": "Longitud de los códigos de subcuenta usados en este ejercicio (típicamente 8 a 12 dígitos).",
            "widget": "number"
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
            "description": "Nombre descriptivo del ejercicio.",
            "widget": "text"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "empresa",
            "targetTable": "empresas",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_proveedor",
            "targetTable": "albaranesprov",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "asiento",
            "targetTable": "asientos",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "cuenta",
            "targetTable": "cuentas",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_proveedor",
            "targetTable": "pedidosprov",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_proveedor",
            "targetTable": "presupuestosprov",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "regularizacion_impuesto",
            "targetTable": "regularizacionimpuestos",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "secuencia_documento",
            "targetTable": "secuencias_documentos",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "hasMany",
            "targetModel": "subcuenta",
            "targetTable": "subcuentas",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default ejercicioMetadata;
