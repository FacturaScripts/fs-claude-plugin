// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const presupuestoClienteMetadata: ModelMetadata = {
    "name": "presupuesto_cliente",
    "table": "presupuestoscli",
    "endpoint": "/presupuestoclientes",
    "primaryKey": "idpresupuesto",
    "description": "Presupuesto enviado a un cliente. Cabecera con totales; las líneas están en linea_presupuesto_cliente.",
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
            "description": "Apartado postal de la dirección de envío.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "cifnif",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "CIF/NIF",
            "maxLength": 30,
            "description": "CIF/NIF del cliente, copiado al crear el presupuesto.",
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
            "description": "Ciudad de la dirección.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
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
            "description": "Agente comercial asignado al presupuesto. Cobra comisiones si se confirma la venta.",
            "foreignKey": {
                "table": "agentes",
                "column": "codagente",
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
            "name": "codalmacen",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codalmacen",
            "maxLength": 4,
            "description": "Almacén desde el que se serviría la mercancía presupuestada.",
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
            "name": "codcliente",
            "sqlType": "character varying(10)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codcliente",
            "maxLength": 10,
            "description": "Cliente al que se emite el presupuesto.",
            "foreignKey": {
                "table": "clientes",
                "column": "codcliente",
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
            "description": "Divisa del presupuesto. Si es distinta a la principal se aplica `tasaconv`.",
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
            "description": "Ejercicio contable al que pertenece el presupuesto.",
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
            "description": "Código identificativo único del presupuesto.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "codigoenv",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codigoenv",
            "maxLength": 200,
            "description": "Código de seguimiento del envío.",
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
            "description": "Forma de pago propuesta en el presupuesto.",
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
            "description": "Código del país de la dirección.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
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
            "description": "Código postal de la dirección.",
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
            "description": "Serie de numeración del presupuesto.",
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
            "name": "codtrans",
            "sqlType": "character varying(8)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "codtrans",
            "maxLength": 8,
            "description": "Agencia de transporte propuesta para el envío.",
            "foreignKey": {
                "table": "agenciastrans",
                "column": "codtrans",
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
            "name": "direccion",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "direccion",
            "maxLength": 200,
            "description": "Dirección postal del presupuesto.",
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
            "name": "editable",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Editable",
            "description": "True si el presupuesto puede modificarse; false si está bloqueado.",
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
            "description": "Fecha de emisión del presupuesto.",
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
            "name": "femail",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "femail",
            "description": "Fecha en la que se envió el presupuesto por email al cliente.",
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
            "name": "finoferta",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "finoferta",
            "description": "Fecha de caducidad de la oferta. Tras esta fecha el presupuesto deja de ser válido.",
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
            "description": "Hora del presupuesto (HH:MM:SS).",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idcontactoenv",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idcontactoenv",
            "description": "ID del contacto usado como dirección de envío.",
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
            "name": "idcontactofact",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idcontactofact",
            "description": "ID del contacto usado como dirección de facturación.",
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
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idempresa",
            "description": "Empresa emisora del presupuesto. En multi-empresa filtra los datos.",
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
            "description": "Estado actual del presupuesto en su flujo (borrador, enviado, aprobado, rechazado, etc.).",
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
            "description": "Estado anterior del presupuesto, para tracking de transiciones.",
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
            "name": "idpresupuesto",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idpresupuesto",
            "description": "Identificador interno autoincremental del presupuesto.",
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
            "description": "Importe neto del presupuesto (subtotal sin impuestos, después de descuentos).",
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
            "description": "Usuario que creó o gestionó el presupuesto.",
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
            "name": "nombrecliente",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "nombrecliente",
            "maxLength": 100,
            "description": "Nombre del cliente registrado en el presupuesto (snapshot al crear).",
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
            "description": "Número de archivos adjuntos vinculados al presupuesto.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.08"
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
            "description": "Número correlativo del presupuesto dentro de su serie y ejercicio.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "numero2",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "numero2",
            "maxLength": 50,
            "description": "Número adicional o referencia externa.",
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
            "description": "Tipo de operación fiscal.",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.03"
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
            "description": "Provincia de la dirección.",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.03",
                    "sinceFirstTag": true
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
            "description": "Tasa de conversión aplicada si el presupuesto está en otra divisa.",
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
            "description": "Importe total del presupuesto (neto + IVA + recargo - retenciones).",
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
            "name": "totalbeneficio",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "totalbeneficio",
            "description": "Beneficio total del presupuesto (total menos coste).",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2023.08"
                }
            ]
        },
        {
            "name": "totalcoste",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "totalcoste",
            "description": "Coste total de los productos.",
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2022.2"
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
            "description": "Importe total de IVA del presupuesto.",
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
            "targetModel": "almacen",
            "targetTable": "almacenes",
            "localColumn": "codalmacen",
            "remoteColumn": "codalmacen"
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
            "targetModel": "serie",
            "targetTable": "series",
            "localColumn": "codserie",
            "remoteColumn": "codserie"
        },
        {
            "type": "belongsTo",
            "targetModel": "agencia_transporte",
            "targetTable": "agenciastrans",
            "localColumn": "codtrans",
            "remoteColumn": "codtrans"
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
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "hasMany",
            "targetModel": "linea_presupuesto_cliente",
            "targetTable": "lineaspresupuestoscli",
            "localColumn": "idpresupuesto",
            "remoteColumn": "idpresupuesto"
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
        },
        {
            "name": "porcomision",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "porcomision",
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
            "name": "totalcomision",
            "sqlType": "double precision",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "totalcomision",
            "default": 0,
            "widget": "number",
            "availability": [
                {
                    "source": "core",
                    "since": "2018.04",
                    "until": "2021.81"
                }
            ]
        }
    ]
};

export default presupuestoClienteMetadata;
