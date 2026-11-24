// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const stockProyectoMetadata: ModelMetadata = {
    "name": "stock_proyecto",
    "table": "proyectos_stocks",
    "endpoint": "/stockproyectos",
    "primaryKey": "id",
    "description": "Stock de un producto dentro de un proyecto: cantidad, reservada, pendiente de recibir y disponible, calculado a partir de los documentos del proyecto.",
    "source": "plugin:Proyectos",
    "columns": [
        {
            "name": "cantidad",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Cantidad",
            "default": 0,
            "description": "Cantidad en stock del proyecto.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "disponible",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Disponible",
            "default": 0,
            "description": "Cantidad disponible: cantidad menos reservada.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
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
            "description": "Identificador del registro de stock.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "idproducto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Producto",
            "description": "Producto.",
            "widget": "text",
            "foreignKey": {
                "table": "productos",
                "column": "idproducto",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "idproyecto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Proyecto",
            "description": "Proyecto al que pertenece el stock.",
            "widget": "select",
            "foreignKey": {
                "table": "proyectos",
                "column": "idproyecto",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "pterecibir",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Pendiente recepción",
            "default": 0,
            "description": "Cantidad pendiente de recibir por pedidos de proveedor del proyecto.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "referencia",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Referencia",
            "maxLength": 30,
            "description": "Referencia de la variante del producto.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        },
        {
            "name": "reservada",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Reservado",
            "default": 0,
            "description": "Cantidad reservada por pedidos de cliente del proyecto.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "0.7"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "producto",
            "targetTable": "productos",
            "localColumn": "idproducto",
            "remoteColumn": "idproducto"
        },
        {
            "type": "belongsTo",
            "targetModel": "proyecto",
            "targetTable": "proyectos",
            "localColumn": "idproyecto",
            "remoteColumn": "idproyecto"
        }
    ],
    "availability": [
        {
            "source": "plugin:Proyectos",
            "since": "0.7"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-11-24T12:34:05.273Z",
        "facturascriptsCommit": "7aa596470",
        "facturascriptsVersion": "plugin:Proyectos@bfa7881",
        "versions": {
            "plugin:Proyectos": {
                "latest": "4.2",
                "tags": 36
            }
        }
    }
};

export default stockProyectoMetadata;
