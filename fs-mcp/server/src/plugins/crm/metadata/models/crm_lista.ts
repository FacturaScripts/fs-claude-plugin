// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const crmListaMetadata: ModelMetadata = {
    "name": "crm_lista",
    "table": "crm_listas",
    "endpoint": "/crmlistas",
    "primaryKey": "id",
    "description": "Lista de contactos del CRM, usada para segmentar y para las campañas de email, con su número de contactos.",
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
            "description": "Fecha de alta.",
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
            "description": "Identificador de la lista.",
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
            "name": "nombre",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre",
            "maxLength": 100,
            "description": "Nombre de la lista.",
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
            "name": "numcontactos",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": false,
            "label": "Contactos",
            "description": "Número de contactos de la lista.",
            "widget": "number",
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
            "type": "hasMany",
            "targetModel": "crm_lista_contacto",
            "targetTable": "crm_listas_contactos",
            "localColumn": "id",
            "remoteColumn": "idlista"
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

export default crmListaMetadata;
