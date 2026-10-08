// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const atributoValorMetadata: ModelMetadata = {
    "name": "atributo_valor",
    "table": "atributos_valores",
    "endpoint": "/atributovalores",
    "primaryKey": "id",
    "description": "Valor concreto de un atributo (ej: rojo, XL). Se asigna a las variantes de productos.",
    "source": "core",
    "columns": [
        {
            "name": "codatributo",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Atributo",
            "maxLength": 20,
            "description": "Atributo padre al que pertenece este valor (ej: TALLA, COLOR).",
            "widget": "select",
            "foreignKey": {
                "table": "atributos",
                "column": "codatributo",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "descripcion",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "descripcion",
            "maxLength": 200,
            "description": "Descripción ampliada del valor del atributo.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
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
            "label": "Id.",
            "description": "Identificador interno autoincremental del valor.",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "valor",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Valor",
            "maxLength": 100,
            "description": "Valor concreto del atributo (ej: XL, Rojo).",
            "widget": "text",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "orden",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Orden",
            "default": 100,
            "description": "Posición del valor en el orden de presentación dentro de su atributo.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.13"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "atributo",
            "targetTable": "atributos",
            "localColumn": "codatributo",
            "remoteColumn": "codatributo"
        },
        {
            "type": "hasMany",
            "targetModel": "variante",
            "targetTable": "variantes",
            "localColumn": "id",
            "remoteColumn": "idatributovalor1"
        },
        {
            "type": "hasMany",
            "targetModel": "variante",
            "targetTable": "variantes",
            "localColumn": "id",
            "remoteColumn": "idatributovalor2"
        },
        {
            "type": "hasMany",
            "targetModel": "variante",
            "targetTable": "variantes",
            "localColumn": "id",
            "remoteColumn": "idatributovalor3"
        },
        {
            "type": "hasMany",
            "targetModel": "variante",
            "targetTable": "variantes",
            "localColumn": "id",
            "remoteColumn": "idatributovalor4"
        }
    ],
    "availability": [
        {
            "source": "core",
            "since": "2018.03",
            "sinceFirstTag": true
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-10-07T17:38:31.723Z",
        "facturascriptsCommit": "93a6a74ac",
        "versions": {
            "core": {
                "latest": "2026.7",
                "tags": 67
            }
        }
    }
};

export default atributoValorMetadata;
