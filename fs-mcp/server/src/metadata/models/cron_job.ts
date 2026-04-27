// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const cronJobMetadata: ModelMetadata = {
    "name": "cron_job",
    "table": "cronjobs",
    "endpoint": "/cronjobes",
    "primaryKey": "id",
    "description": "Tarea programada del cron de FacturaScripts. Registra última ejecución y duración.",
    "source": "core",
    "columns": [
        {
            "name": "date",
            "sqlType": "timestamp",
            "tsType": "datetime",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha",
            "description": "Fecha y hora de la última ejecución registrada.",
            "widget": "datetime"
        },
        {
            "name": "daily_exec",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Ejecuciones diarias",
            "default": 0,
            "description": "Número de ejecuciones del trabajo en el último día.",
            "widget": "number"
        },
        {
            "name": "done",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Realizado",
            "default": false,
            "description": "True si la última ejecución finalizó correctamente.",
            "widget": "checkbox"
        },
        {
            "name": "duration",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Duración",
            "default": 0,
            "description": "Duración total acumulada de las ejecuciones (segundos).",
            "widget": "number"
        },
        {
            "name": "enabled",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Activo",
            "default": true,
            "description": "True si el trabajo está activo; false si está pausado.",
            "widget": "checkbox"
        },
        {
            "name": "failed",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fallido",
            "default": false,
            "description": "True si la última ejecución falló.",
            "widget": "checkbox"
        },
        {
            "name": "fails",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fallos",
            "default": 0,
            "description": "Número de fallos acumulados del trabajo.",
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
            "description": "Identificador interno autoincremental del registro.",
            "widget": "text"
        },
        {
            "name": "jobname",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Nombre del trabajo",
            "maxLength": 50,
            "description": "Nombre del trabajo programado dentro del cron.",
            "widget": "text"
        },
        {
            "name": "last_duration",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Última duración",
            "default": 0,
            "description": "Duración de la última ejecución (en segundos).",
            "widget": "number"
        },
        {
            "name": "pluginname",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Plugin",
            "maxLength": 50,
            "description": "Nombre del plugin propietario del trabajo.",
            "widget": "text"
        },
        {
            "name": "running",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Ejecutando",
            "default": 0,
            "description": "Marca de ejecución en curso (1 si está ejecutándose, 0 si no).",
            "widget": "number"
        }
    ],
    "relations": [],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default cronJobMetadata;
