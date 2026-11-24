// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const crmInteresContactoMetadata: ModelMetadata = {
    "name": "crm_interes_contacto",
    "table": "crm_intereses_contactos",
    "endpoint": "/crminterescontactos",
    "primaryKey": "id",
    "description": "Interés asignado a un contacto del CRM. Se crea también al guardar una nota u oportunidad con interés.",
    "source": "plugin:CRM",
    "columns": [
        {
            "name": "fecha",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Fecha",
            "description": "Fecha en que se asignó el interés.",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "id",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "Código",
            "description": "Identificador de la asignación.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idcontacto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Contacto",
            "description": "Contacto interesado.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "contactos",
                "column": "idcontacto",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idinteres",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Interés",
            "description": "Interés del contacto.",
            "widget": "select",
            "foreignKey": {
                "table": "crm_intereses",
                "column": "id",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:CRM",
                    "since": "0.1",
                    "sinceFirstTag": true
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "contacto",
            "targetTable": "contactos",
            "localColumn": "idcontacto",
            "remoteColumn": "idcontacto"
        },
        {
            "type": "belongsTo",
            "targetModel": "crm_interes",
            "targetTable": "crm_intereses",
            "localColumn": "idinteres",
            "remoteColumn": "id"
        }
    ],
    "availability": [
        {
            "source": "plugin:CRM",
            "since": "0.1",
            "sinceFirstTag": true
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-11-24T12:56:34.504Z",
        "facturascriptsCommit": "7aa596470",
        "facturascriptsVersion": "plugin:CRM@16399b9",
        "versions": {
            "plugin:CRM": {
                "latest": "3.44",
                "tags": 33
            }
        }
    }
};

export default crmInteresContactoMetadata;
