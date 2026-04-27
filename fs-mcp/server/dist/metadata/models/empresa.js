// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.
export const empresaMetadata = {
    "name": "empresa",
    "table": "empresas",
    "endpoint": "/empresas",
    "primaryKey": "idempresa",
    "description": "Empresa propia del sistema. Puede haber varias en una misma instalación; cada documento pertenece a una.",
    "source": "core",
    "columns": [
        {
            "name": "administrador",
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Administrador",
            "maxLength": 100,
            "description": "Nombre del administrador o representante legal de la empresa.",
            "widget": "text"
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
            "description": "Apartado postal de la empresa.",
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
            "description": "CIF/NIF de la empresa.",
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
            "description": "Ciudad de la sede social.",
            "widget": "text"
        },
        {
            "name": "codpais",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "País",
            "maxLength": 20,
            "description": "Código del país de la sede social.",
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
            "description": "Código postal de la empresa.",
            "widget": "text"
        },
        {
            "name": "direccion",
            "sqlType": "character varying(200)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Dirección",
            "maxLength": 200,
            "description": "Dirección postal de la sede social.",
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
            "description": "Email principal de contacto de la empresa.",
            "widget": "text"
        },
        {
            "name": "fax",
            "sqlType": "character varying(30)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fax",
            "maxLength": 30,
            "description": "Número de fax de la empresa.",
            "widget": "text"
        },
        {
            "name": "fechaalta",
            "sqlType": "date",
            "tsType": "date",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Fecha de inicio",
            "description": "Fecha de alta de la empresa en el sistema.",
            "widget": "date"
        },
        {
            "name": "idempresa",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idempresa",
            "description": "Identificador interno autoincremental de la empresa.",
            "widget": "number"
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
            "description": "Archivo de imagen del logo de la empresa para usar en documentos.",
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
            "sqlType": "character varying(100)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre de empresa",
            "maxLength": 100,
            "description": "Razón social completa de la empresa.",
            "widget": "text"
        },
        {
            "name": "nombrecorto",
            "sqlType": "character varying(32)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Nombre Corto",
            "maxLength": 32,
            "description": "Nombre comercial corto, usado en cabeceras de documentos.",
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
            "description": "Notas internas sobre la empresa.",
            "widget": "textarea"
        },
        {
            "name": "personafisica",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Tipo",
            "default": false,
            "description": "True si la empresa es persona física (autónomo); false si es persona jurídica.",
            "widget": "select",
            "enumValues": [
                "1",
                "0"
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
            "label": "Provincia",
            "maxLength": 100,
            "description": "Provincia de la sede social.",
            "widget": "text"
        },
        {
            "name": "regimeniva",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Régimen impuestos",
            "maxLength": 50,
            "description": "Régimen de IVA aplicable a la empresa (general, simplificado, etc.).",
            "widget": "select"
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
            "description": "Teléfono principal de la empresa.",
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
            "description": "Teléfono secundario.",
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
            "description": "Tipo de identificador fiscal (NIF, CIF, etc.).",
            "widget": "select"
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
            "description": "URL de la página web de la empresa.",
            "widget": "link"
        }
    ],
    "relations": [
        {
            "type": "belongsTo",
            "targetModel": "attached_file",
            "targetTable": "attached_files",
            "localColumn": "idlogo",
            "remoteColumn": "idfile"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_cliente",
            "targetTable": "albaranescli",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "albaran_proveedor",
            "targetTable": "albaranesprov",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "almacen",
            "targetTable": "almacenes",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "asiento",
            "targetTable": "asientos",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "cuenta_banco",
            "targetTable": "cuentasbanco",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "ejercicio",
            "targetTable": "ejercicios",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_cliente",
            "targetTable": "facturascli",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "factura_proveedor",
            "targetTable": "facturasprov",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "forma_pago",
            "targetTable": "formaspago",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "formato_documento",
            "targetTable": "formatos_documentos",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_cliente",
            "targetTable": "pedidoscli",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "pedido_proveedor",
            "targetTable": "pedidosprov",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_cliente",
            "targetTable": "presupuestoscli",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "presupuesto_proveedor",
            "targetTable": "presupuestosprov",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "regularizacion_impuesto",
            "targetTable": "regularizacionimpuestos",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "secuencia_documento",
            "targetTable": "secuencias_documentos",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        },
        {
            "type": "hasMany",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "idempresa",
            "remoteColumn": "idempresa"
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-04-25T12:48:58.060Z",
        "facturascriptsCommit": "262e79208"
    }
};
export default empresaMetadata;
//# sourceMappingURL=empresa.js.map