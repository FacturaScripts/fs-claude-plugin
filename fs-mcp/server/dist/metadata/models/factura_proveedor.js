// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const facturaProveedorMetadata = {
    "name": "factura_proveedor",
    "table": "facturasprov",
    "endpoint": "/facturaproveedores",
    "primaryKey": "idfactura",
    "description": "Factura recibida de un proveedor. Cabecera con totales, impuestos y estado contable.",
    "source": "core",
    "columns": [
        {
            "name": "apartado",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "apartado",
            "maxLength": 10,
            "description": "Apartado postal de la dirección del proveedor en la factura.",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.4"
                }
            ]
        },
        {
            "name": "cifnif",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "CIF/NIF",
            "maxLength": 30,
            "description": "CIF/NIF del proveedor, copiado al crear la factura.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "ciudad",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "ciudad",
            "maxLength": 100,
            "description": "Ciudad de la dirección del proveedor en la factura.",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.4"
                }
            ]
        },
        {
            "name": "codalmacen",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codalmacen",
            "maxLength": 4,
            "description": "Almacén donde se recibió la mercancía facturada.",
            "foreignKey": {
                "table": "almacenes",
                "column": "codalmacen",
                "onDelete": "RESTRICT",
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
            "name": "coddivisa",
            "sqlType": "character varying(3)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "coddivisa",
            "maxLength": 3,
            "description": "Divisa de la factura. Si es distinta a la principal se aplica `tasaconv`.",
            "foreignKey": {
                "table": "divisas",
                "column": "coddivisa",
                "onDelete": "RESTRICT",
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
            "name": "codejercicio",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "codejercicio",
            "maxLength": 4,
            "description": "Ejercicio contable al que pertenece la factura.",
            "foreignKey": {
                "table": "ejercicios",
                "column": "codejercicio",
                "onDelete": "RESTRICT",
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
            "name": "codigo",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "codigo",
            "maxLength": 20,
            "description": "Código identificativo único de la factura recibida (numeración interna).",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "codigorect",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codigorect",
            "maxLength": 20,
            "description": "Código de la factura original que rectifica esta (en rectificativas).",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "codpago",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "codpago",
            "maxLength": 10,
            "description": "Forma de pago de la factura al proveedor.",
            "foreignKey": {
                "table": "formaspago",
                "column": "codpago",
                "onDelete": "RESTRICT",
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
            "name": "codpais",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codpais",
            "maxLength": 20,
            "description": "Código del país de la dirección del proveedor.",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.4"
                }
            ]
        },
        {
            "name": "codpostal",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codpostal",
            "maxLength": 10,
            "description": "Código postal de la dirección del proveedor.",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.4"
                }
            ]
        },
        {
            "name": "codproveedor",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codproveedor",
            "maxLength": 10,
            "description": "Proveedor que ha emitido la factura.",
            "foreignKey": {
                "table": "proveedores",
                "column": "codproveedor",
                "onDelete": "RESTRICT",
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
            "name": "codserie",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "codserie",
            "maxLength": 4,
            "description": "Serie de numeración interna asignada a la factura recibida.",
            "foreignKey": {
                "table": "series",
                "column": "codserie",
                "onDelete": "RESTRICT",
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
            "name": "dtopor1",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "dtopor1",
            "description": "Primer porcentaje de descuento aplicado sobre el neto.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.16"
                }
            ]
        },
        {
            "name": "dtopor2",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "dtopor2",
            "description": "Segundo porcentaje de descuento aplicado tras dtopor1.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.16"
                }
            ]
        },
        {
            "name": "direccion",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "direccion",
            "maxLength": 200,
            "description": "Dirección postal del proveedor, copiada de su dirección al crear la factura (snapshot).",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.4"
                }
            ]
        },
        {
            "name": "editable",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Editable",
            "description": "True si la factura puede modificarse; false si está bloqueada.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "fecha",
            "sqlType": "date",
            "tsType": "date",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "fecha",
            "description": "Fecha de emisión de la factura por parte del proveedor.",
            "widget": "date",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "fechadevengo",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "fechadevengo",
            "description": "Fecha de devengo fiscal del IVA.",
            "widget": "date",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.03"
                }
            ]
        },
        {
            "name": "femail",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "femail",
            "description": "Fecha en la que se envió la factura por email.",
            "widget": "date",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "hora",
            "sqlType": "time",
            "tsType": "time",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "hora",
            "description": "Hora de la factura (HH:MM:SS).",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idasiento",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idasiento",
            "description": "Asiento contable generado al contabilizar la factura.",
            "widget": "number",
            "foreignKey": {
                "table": "asientos",
                "column": "idasiento",
                "onDelete": "SET NULL",
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
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idempresa",
            "description": "Empresa receptora de la factura. En multi-empresa filtra los datos.",
            "widget": "number",
            "foreignKey": {
                "table": "empresas",
                "column": "idempresa",
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
            "name": "idestado",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idestado",
            "description": "Estado actual de la factura en su flujo (borrador, aprobada, pagada, anulada, etc.).",
            "widget": "number",
            "foreignKey": {
                "table": "estados_documentos",
                "column": "idestado",
                "onDelete": "RESTRICT",
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
            "name": "idestado_ant",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idestado_ant",
            "description": "Estado anterior de la factura, para tracking de transiciones.",
            "widget": "number",
            "foreignKey": {
                "table": "estados_documentos",
                "column": "idestado",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "core",
                    "since": "2026.1"
                }
            ]
        },
        {
            "name": "idfactura",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idfactura",
            "description": "Identificador interno autoincremental de la factura.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idfacturarect",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idfacturarect",
            "description": "Factura original que esta rectifica (solo en facturas rectificativas).",
            "widget": "number",
            "foreignKey": {
                "table": "facturasprov",
                "column": "idfactura",
                "onDelete": "RESTRICT",
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
            "name": "irpf",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "IRPF",
            "description": "Porcentaje de IRPF aplicado.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "neto",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "neto",
            "description": "Importe neto de la factura (subtotal antes de impuestos, después de descuentos).",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "netosindto",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "netosindto",
            "default": 0,
            "description": "Importe neto antes de aplicar descuentos generales.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.01"
                }
            ]
        },
        {
            "name": "nick",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Usuario",
            "maxLength": 50,
            "description": "Usuario que registró o gestionó la factura.",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
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
            "name": "numdocs",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "numdocs",
            "default": 0,
            "description": "Número de archivos adjuntos vinculados a la factura.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.08"
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
            "label": "nombre",
            "maxLength": 100,
            "description": "Nombre del proveedor registrado en la factura (snapshot al crearla).",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "numero",
            "sqlType": "character varying(12)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "numero",
            "maxLength": 12,
            "description": "Número correlativo interno asignado al recibir la factura.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "numproveedor",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "numproveedor",
            "maxLength": 50,
            "description": "Número que el proveedor da a su factura (su numeración interna).",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "observaciones",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "observaciones",
            "description": "Notas u observaciones internas.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "operacion",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "operacion",
            "maxLength": 30,
            "description": "Tipo de operación fiscal (interior, intracomunitaria, importación).",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.03"
                }
            ]
        },
        {
            "name": "pagada",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "pagada",
            "default": false,
            "description": "True si la factura está totalmente pagada.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "provincia",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "provincia",
            "maxLength": 100,
            "description": "Provincia de la dirección del proveedor en la factura.",
            "availability": [
                {
                    "source": "core",
                    "since": "2026.4"
                }
            ]
        },
        {
            "name": "tasaconv",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "tasaconv",
            "description": "Tasa de conversión aplicada si la factura está en otra divisa.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "total",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Total",
            "description": "Importe total de la factura (neto + IVA + recargo - retenciones).",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "totaleuros",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "totaleuros",
            "description": "Total convertido a divisa principal usando tasaconv.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "totalirpf",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "totalirpf",
            "description": "Importe total retenido por IRPF.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "totaliva",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "totaliva",
            "description": "Importe total de IVA de la factura.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "totalrecargo",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "totalrecargo",
            "description": "Importe total del recargo de equivalencia.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "totalsuplidos",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "totalsuplidos",
            "default": 0,
            "description": "Importe total de suplidos.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2020.4"
                }
            ]
        },
        {
            "name": "vencida",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "vencida",
            "default": false,
            "description": "True si la factura tiene recibos vencidos sin pagar.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.03"
                }
            ]
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "almacen",
            "targetTable": "almacenes",
            "localColumn": "codalmacen",
            "remoteColumn": "codalmacen"
        },
        {
            "type": "belongsTo",
            "targetModel": "divisa",
            "targetTable": "divisas",
            "localColumn": "coddivisa",
            "remoteColumn": "coddivisa"
        },
        {
            "type": "belongsTo",
            "targetModel": "ejercicio",
            "targetTable": "ejercicios",
            "localColumn": "codejercicio",
            "remoteColumn": "codejercicio"
        },
        {
            "type": "belongsTo",
            "targetModel": "forma_pago",
            "targetTable": "formaspago",
            "localColumn": "codpago",
            "remoteColumn": "codpago"
        },
        {
            "type": "belongsTo",
            "targetModel": "proveedor",
            "targetTable": "proveedores",
            "localColumn": "codproveedor",
            "remoteColumn": "codproveedor"
        },
        {
            "type": "belongsTo",
            "targetModel": "serie",
            "targetTable": "series",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "belongsTo",
            "targetModel": "asiento",
            "targetTable": "asientos",
            "localColumn": "idasiento",
            "remoteColumn": "idasiento"
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
            "targetModel": "estado_documento",
            "targetTable": "estados_documentos",
            "localColumn": "idestado",
            "remoteColumn": "idestado"
        },
        {
            "type": "belongsTo",
            "targetModel": "estado_documento",
            "targetTable": "estados_documentos",
            "localColumn": "idestado_ant",
            "remoteColumn": "idestado"
        },
        {
            "type": "belongsTo",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "idfacturarect",
            "remoteColumn": "idfactura"
        },
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_factura_proveedor",
            "targetTable": "lineasfacturasprov",
            "localColumn": "idfactura",
            "remoteColumn": "idfactura"
        },
        {
            "type": "hasMany",
            "targetModel": "recibo_proveedor",
            "targetTable": "recibospagosprov",
            "localColumn": "idfactura",
            "remoteColumn": "idfactura"
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
    },
    "retiredColumns": [
        {
            "name": "codagente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codagente",
            "maxLength": 10,
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        },
        {
            "name": "idasientop",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idasientop",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        },
        {
            "name": "pagado",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "pagado",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true,
                    "until": "2018.03"
                }
            ]
        }
    ]
};
export default facturaProveedorMetadata;
//# sourceMappingURL=factura_proveedor.js.map