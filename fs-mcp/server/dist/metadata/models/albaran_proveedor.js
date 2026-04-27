// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const albaranProveedorMetadata = {
    "name": "albaran_proveedor",
    "table": "albaranesprov",
    "endpoint": "/albaranproveedores",
    "primaryKey": "idalbaran",
    "description": "Albarán de mercancía recibida de un proveedor. Cabecera con totales.",
    "source": "core",
    "columns": [
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
            "description": "CIF/NIF del proveedor, copiado desde el proveedor al crear el albarán."
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
            "description": "Almacén donde se recibe la mercancía del albarán.",
            "foreignKey": {
                "table": "almacenes",
                "column": "codalmacen",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
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
            "description": "Divisa del albarán. Si es distinta a la principal se aplica `tasaconv`.",
            "foreignKey": {
                "table": "divisas",
                "column": "coddivisa",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
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
            "description": "Ejercicio contable al que pertenece el albarán.",
            "foreignKey": {
                "table": "ejercicios",
                "column": "codejercicio",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
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
            "description": "Código identificativo único del albarán de proveedor."
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
            "description": "Forma de pago del albarán al proveedor.",
            "foreignKey": {
                "table": "formaspago",
                "column": "codpago",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
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
            "description": "Proveedor que ha emitido el albarán.",
            "foreignKey": {
                "table": "proveedores",
                "column": "codproveedor",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
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
            "description": "Serie de numeración del albarán.",
            "foreignKey": {
                "table": "series",
                "column": "codserie",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
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
            "description": "True si el albarán todavía puede modificarse; false si está bloqueado por el flujo.",
            "widget": "checkbox"
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
            "description": "Primer porcentaje de descuento aplicado sobre el neto del albarán.",
            "widget": "number"
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
            "widget": "number"
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
            "description": "Fecha del albarán de proveedor.",
            "widget": "date"
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
            "description": "Fecha en la que se envió el albarán por email.",
            "widget": "date"
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
            "description": "Hora del albarán (HH:MM:SS)."
        },
        {
            "name": "idalbaran",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idalbaran",
            "description": "Identificador interno autoincremental del albarán.",
            "widget": "number"
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
            "description": "Empresa receptora del albarán. En instalaciones multi-empresa filtra los datos.",
            "widget": "number",
            "foreignKey": {
                "table": "empresas",
                "column": "idempresa",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            }
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
            "description": "Estado actual del albarán en su flujo (borrador, aprobado, facturado, etc.).",
            "widget": "number",
            "foreignKey": {
                "table": "estados_documentos",
                "column": "idestado",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            }
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
            "description": "Estado anterior del albarán, para tracking de transiciones.",
            "widget": "number",
            "foreignKey": {
                "table": "estados_documentos",
                "column": "idestado",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
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
            "description": "Porcentaje de IRPF aplicado al albarán.",
            "widget": "number"
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
            "description": "Importe neto del albarán (subtotal antes de impuestos, después de descuentos).",
            "widget": "number"
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
            "description": "Importe neto antes de aplicar los descuentos generales.",
            "widget": "number"
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
            "description": "Usuario que registró o gestionó el albarán.",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            }
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
            "description": "Nombre del proveedor registrado en el albarán (snapshot al crear)."
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
            "description": "Número de archivos adjuntos vinculados al albarán.",
            "widget": "number"
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
            "description": "Número correlativo del albarán dentro de su serie y ejercicio."
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
            "description": "Número o referencia que el proveedor da a este albarán (su número interno)."
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
            "description": "Notas internas u observaciones del albarán.",
            "widget": "textarea"
        },
        {
            "name": "operacion",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "operacion",
            "maxLength": 20,
            "description": "Tipo de operación fiscal (interior, intracomunitaria, importación)."
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
            "description": "Tasa de conversión si el albarán está en una divisa distinta a la principal.",
            "widget": "number"
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
            "description": "Importe total del albarán (neto + IVA + recargo - retenciones).",
            "widget": "number"
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
            "description": "Total convertido a la divisa principal (euros) usando tasaconv.",
            "widget": "number"
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
            "widget": "number"
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
            "description": "Importe total de IVA del albarán.",
            "widget": "number"
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
            "widget": "number"
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
            "widget": "number"
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
            "targetModel": "linea_albaran_proveedor",
            "targetTable": "lineasalbaranesprov",
            "localColumn": "idalbaran",
            "remoteColumn": "idalbaran"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default albaranProveedorMetadata;
//# sourceMappingURL=albaran_proveedor.js.map