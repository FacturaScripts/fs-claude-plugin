// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const formatoDocumentoMetadata: ModelMetadata = {
    "name": "formato_documento",
    "table": "formatos_documentos",
    "endpoint": "/formatodocumentos",
    "primaryKey": "id",
    "description": "Formato de impresión asignado a un tipo de documento. Define la plantilla.",
    "source": "core",
    "columns": [
        {
            "name": "autoaplicar",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Aplicar automáticamente a",
            "default": true,
            "description": "True si el formato debe aplicarse automáticamente a los documentos del tipo indicado.",
            "widget": "checkbox"
        },
        {
            "name": "codserie",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Serie",
            "maxLength": 4,
            "description": "Serie a la que aplica el formato. Vacío si aplica a todas las series.",
            "widget": "select",
            "foreignKey": {
                "table": "series",
                "column": "codserie",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
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
            "description": "Identificador interno autoincremental del formato.",
            "widget": "number"
        },
        {
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Empresa",
            "description": "Empresa propietaria del formato.",
            "widget": "select",
            "foreignKey": {
                "table": "empresas",
                "column": "idempresa",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "idlogo",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Logotipo",
            "description": "Archivo de imagen del logo a mostrar en los documentos impresos con este formato.",
            "widget": "text",
            "foreignKey": {
                "table": "attached_files",
                "column": "idfile",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "nombre",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Nombre",
            "maxLength": 30,
            "description": "Nombre identificador del formato.",
            "widget": "text"
        },
        {
            "name": "texto",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Texto adicional",
            "description": "Texto adicional que se incluye en el pie del documento al imprimir con este formato.",
            "widget": "textarea"
        },
        {
            "name": "tipodoc",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Tipo de documento",
            "maxLength": 30,
            "description": "Tipo de documento al que se aplica el formato.",
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
            "name": "titulo",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Título",
            "maxLength": 30,
            "description": "Título personalizado a mostrar en el encabezado del documento.",
            "widget": "text"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "serie",
            "targetTable": "series",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "belongsTo",
            "targetModel": "empresa",
            "targetTable": "empresas",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "belongsTo",
            "targetModel": "attached_file",
            "targetTable": "attached_files",
            "localColumn": "idlogo",
            "remoteColumn": "idfile"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default formatoDocumentoMetadata;
