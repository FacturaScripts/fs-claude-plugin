// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const contactoMetadata: ModelMetadata = {
    "name": "contacto",
    "table": "contactos",
    "endpoint": "/contactos",
    "primaryKey": "idcontacto",
    "description": "Persona de contacto con datos de dirección. Sirve como dirección de envío o facturación de clientes y proveedores.",
    "source": "core",
    "columns": [
        {
            "name": "aceptaprivacidad",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Acepta la política de privacidad",
            "default": false,
            "description": "True si el contacto ha aceptado la política de privacidad (RGPD).",
            "widget": "checkbox"
        },
        {
            "name": "admitemarketing",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Permite marketing",
            "default": false,
            "description": "True si el contacto ha autorizado recibir comunicaciones de marketing.",
            "widget": "checkbox"
        },
        {
            "name": "apartado",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Apartado",
            "maxLength": 10,
            "description": "Apartado postal del contacto.",
            "widget": "text"
        },
        {
            "name": "apellidos",
            "sqlType": "character varying(150)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Apellidos",
            "maxLength": 150,
            "description": "Apellidos del contacto si es persona física.",
            "widget": "text"
        },
        {
            "name": "cargo",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cargo",
            "maxLength": 100,
            "description": "Cargo o puesto del contacto en su empresa.",
            "widget": "text"
        },
        {
            "name": "cifnif",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Núm. fiscal",
            "maxLength": 30,
            "description": "CIF/NIF/NIE del contacto.",
            "widget": "text"
        },
        {
            "name": "ciudad",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Ciudad",
            "maxLength": 100,
            "description": "Ciudad de la dirección del contacto.",
            "widget": "text"
        },
        {
            "name": "codagente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Agente",
            "maxLength": 10,
            "description": "Agente comercial asociado al contacto, si aplica.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "agentes",
                "column": "codagente",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codcliente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cliente",
            "maxLength": 10,
            "description": "Cliente al que pertenece el contacto.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "clientes",
                "column": "codcliente",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "codpais",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "País",
            "maxLength": 20,
            "description": "Código del país de la dirección del contacto.",
            "widget": "select"
        },
        {
            "name": "codpostal",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Código Postal",
            "maxLength": 10,
            "description": "Código postal de la dirección del contacto.",
            "widget": "text"
        },
        {
            "name": "codproveedor",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Proveedor",
            "maxLength": 10,
            "description": "Proveedor al que pertenece el contacto.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "proveedores",
                "column": "codproveedor",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Descripción",
            "maxLength": 100,
            "description": "Descripción libre del contacto (ej: 'Almacén central', 'Oficinas Madrid').",
            "widget": "text"
        },
        {
            "name": "direccion",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Dirección",
            "maxLength": 200,
            "description": "Dirección postal del contacto.",
            "widget": "text"
        },
        {
            "name": "email",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Email",
            "maxLength": 100,
            "description": "Email del contacto.",
            "widget": "text"
        },
        {
            "name": "empresa",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Empresa",
            "maxLength": 100,
            "description": "Nombre de la empresa a la que pertenece el contacto.",
            "widget": "text"
        },
        {
            "name": "fechaalta",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha de creación",
            "description": "Fecha de alta del contacto en el sistema.",
            "widget": "date"
        },
        {
            "name": "idcontacto",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Identificador interno autoincremental del contacto.",
            "widget": "text"
        },
        {
            "name": "langcode",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Idioma",
            "maxLength": 10,
            "description": "Código de idioma preferido del contacto (es_ES, en_US, etc.).",
            "widget": "select"
        },
        {
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre de pila del contacto.",
            "widget": "text"
        },
        {
            "name": "observaciones",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Observaciones",
            "description": "Notas internas sobre el contacto.",
            "widget": "textarea"
        },
        {
            "name": "personafisica",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Persona física",
            "default": true,
            "description": "True si el contacto es persona física, false si representa a una empresa.",
            "widget": "checkbox"
        },
        {
            "name": "provincia",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Provincia",
            "maxLength": 100,
            "description": "Provincia de la dirección del contacto.",
            "widget": "text"
        },
        {
            "name": "telefono1",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Teléfono",
            "maxLength": 30,
            "description": "Teléfono principal del contacto.",
            "widget": "text"
        },
        {
            "name": "telefono2",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Teléfono 2",
            "maxLength": 30,
            "description": "Teléfono secundario o móvil del contacto.",
            "widget": "text"
        },
        {
            "name": "tipoidfiscal",
            "sqlType": "character varying(25)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Id. Fiscal",
            "maxLength": 25,
            "description": "Tipo de identificador fiscal (NIF, CIF, NIE, VAT…).",
            "widget": "select"
        },
        {
            "name": "verificado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Verificado",
            "default": false,
            "description": "True si los datos del contacto han sido verificados manualmente.",
            "widget": "checkbox"
        },
        {
            "name": "web",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Web",
            "maxLength": 100,
            "description": "URL de la página web del contacto.",
            "widget": "link"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "agente",
            "targetTable": "agentes",
            "localColumn": "codagente",
            "remoteColumn": "codagente"
        },
        {
            "type": "belongsTo",
            "targetModel": "cliente",
            "targetTable": "clientes",
            "localColumn": "codcliente",
            "remoteColumn": "codcliente"
        },
        {
            "type": "belongsTo",
            "targetModel": "proveedor",
            "targetTable": "proveedores",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};

export default contactoMetadata;
