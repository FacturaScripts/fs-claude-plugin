// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../../../../metadata/types.js';

export const servicioAtMetadata: ModelMetadata = {
    "name": "servicio_at",
    "table": "serviciosat",
    "endpoint": "/servicioates",
    "primaryKey": "idservicio",
    "description": "Servicio de asistencia técnica (SAT) del plugin Servicios: una solicitud de soporte o reparación de un cliente, con estado, prioridad, tipo, usuario asignado, agente, hasta cuatro máquinas implicadas y los trabajos realizados.",
    "source": "plugin:Servicios",
    "columns": [
        {
            "name": "asignado",
            "sqlType": "character varying(50)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Asignado",
            "maxLength": 50,
            "description": "Nick del usuario de FacturaScripts asignado para gestionar este servicio.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
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
            "label": "Agente",
            "maxLength": 10,
            "description": "Código del agente comercial asociado al servicio.",
            "widget": "select",
            "foreignKey": {
                "table": "agentes",
                "column": "codagente",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "codalmacen",
            "sqlType": "character varying(4)",
            "tsType": "string",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Almacén",
            "maxLength": 4,
            "description": "Almacén desde el que se gestiona el servicio. Determina la empresa implícitamente.",
            "widget": "select",
            "foreignKey": {
                "table": "almacenes",
                "column": "codaLmacen",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
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
            "isRequired": true,
            "label": "Cliente",
            "maxLength": 10,
            "description": "Código del cliente al que pertenece el servicio.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "clientes",
                "column": "codcliente",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "codigo",
            "sqlType": "character varying(20)",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Código",
            "maxLength": 20,
            "description": "Código alfanumérico único del servicio, generado a partir del patrón configurado (por defecto SER-{NUM}).",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "descripcion",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Descripción",
            "description": "Descripción detallada del problema o solicitud de asistencia técnica.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "editable",
            "sqlType": "boolean",
            "tsType": "boolean",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Editable",
            "description": "Indica si el servicio puede modificarse. Viene determinado por el estado activo.",
            "widget": "checkbox",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
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
            "label": "Fecha",
            "description": "Fecha de apertura del servicio (por defecto la fecha actual).",
            "widget": "date",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "hora",
            "sqlType": "time without time zone",
            "tsType": "string",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Hora",
            "description": "Hora de apertura del servicio.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idempresa",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": true,
            "isRequired": true,
            "label": "Empresa",
            "description": "Empresa propietaria del servicio. Se infiere automáticamente del almacén si se omite.",
            "widget": "select",
            "foreignKey": {
                "table": "empresas",
                "column": "idempresa",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idestado",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Estado",
            "description": "Estado del servicio. Define si el servicio es editable y a quién se asigna automáticamente.",
            "widget": "select",
            "foreignKey": {
                "table": "serviciosat_estados",
                "column": "id",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idmaquina",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Máquina",
            "description": "Primera máquina o equipo implicado en el servicio.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "serviciosat_maquinas",
                "column": "idmaquina",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idmaquina2",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Máquina",
            "description": "Segunda máquina o equipo implicado en el servicio.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "serviciosat_maquinas",
                "column": "idmaquina",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idmaquina3",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Máquina",
            "description": "Tercera máquina o equipo implicado en el servicio.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "serviciosat_maquinas",
                "column": "idmaquina",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idmaquina4",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Máquina",
            "description": "Cuarta máquina o equipo implicado en el servicio.",
            "widget": "autocomplete",
            "foreignKey": {
                "table": "serviciosat_maquinas",
                "column": "idmaquina",
                "onDelete": "RESTRICT",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idprioridad",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": true,
            "label": "Prioridad",
            "description": "Prioridad del servicio (urgente, normal, baja, etc.), definida en la tabla de prioridades.",
            "widget": "select",
            "foreignKey": {
                "table": "serviciosat_prioridades",
                "column": "id",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idtipo",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Tipo",
            "description": "Tipo de servicio (reparación, instalación, mantenimiento, etc.), definido en la tabla de tipos.",
            "widget": "select",
            "foreignKey": {
                "table": "serviciosat_tipos",
                "column": "id",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idservicio",
            "sqlType": "serial",
            "tsType": "number",
            "nullable": false,
            "isPrimaryKey": true,
            "isReadonly": true,
            "isRequired": false,
            "label": "idservicio",
            "description": "Identificador interno autoincremental del servicio SAT.",
            "widget": "number",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "material",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Material",
            "description": "Descripción del material o repuesto utilizado en el servicio.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
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
            "description": "Nick del usuario de FacturaScripts que creó o gestiona el servicio.",
            "widget": "select",
            "foreignKey": {
                "table": "users",
                "column": "nick",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
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
            "isReadonly": true,
            "isRequired": false,
            "label": "Neto",
            "default": 0,
            "description": "Importe neto total del servicio, calculado automáticamente como suma de precio × cantidad de los trabajos.",
            "widget": "money",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
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
            "label": "Observaciones",
            "description": "Notas internas o indicaciones adicionales sobre el servicio.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "solucion",
            "sqlType": "text",
            "tsType": "text",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "Solución",
            "description": "Descripción de la solución o resolución aplicada al servicio.",
            "widget": "textarea",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
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
            "description": "Primer teléfono de contacto. Se rellena automáticamente con el del cliente si el servicio es editable.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
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
            "description": "Segundo teléfono de contacto.",
            "widget": "text",
            "availability": [
                {
                    "source": "plugin:Servicios",
                    "since": "4.11",
                    "sinceFirstTag": true
                }
            ]
        },
        {
            "name": "idproyecto",
            "sqlType": "integer",
            "tsType": "number",
            "nullable": true,
            "isPrimaryKey": false,
            "isReadonly": false,
            "isRequired": false,
            "label": "idproyecto",
            "description": "Proyecto al que pertenece el servicio (columna que añade el plugin Proyectos, si está activo).",
            "widget": "number",
            "foreignKey": {
                "table": "proyectos",
                "column": "idproyecto",
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE"
            },
            "availability": [
                {
                    "source": "plugin:Proyectos",
                    "since": "3.4"
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
            "remoteColumn": "codaLmacen"
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
            "targetModel": "maquina_at",
            "targetTable": "serviciosat_maquinas",
            "localColumn": "idmaquina",
            "remoteColumn": "idmaquina"
        },
        {
            "type": "belongsTo",
            "targetModel": "maquina_at",
            "targetTable": "serviciosat_maquinas",
            "localColumn": "idmaquina2",
            "remoteColumn": "idmaquina"
        },
        {
            "type": "belongsTo",
            "targetModel": "maquina_at",
            "targetTable": "serviciosat_maquinas",
            "localColumn": "idmaquina3",
            "remoteColumn": "idmaquina"
        },
        {
            "type": "belongsTo",
            "targetModel": "maquina_at",
            "targetTable": "serviciosat_maquinas",
            "localColumn": "idmaquina4",
            "remoteColumn": "idmaquina"
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
            "targetModel": "estado_at",
            "targetTable": "serviciosat_estados",
            "localColumn": "idestado",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "nick",
            "remoteColumn": "nick"
        },
        {
            "type": "belongsTo",
            "targetModel": "user",
            "targetTable": "users",
            "localColumn": "asignado",
            "remoteColumn": "nick"
        },
        {
            "type": "belongsTo",
            "targetModel": "prioridad_at",
            "targetTable": "serviciosat_prioridades",
            "localColumn": "idprioridad",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "tipo_at",
            "targetTable": "serviciosat_tipos",
            "localColumn": "idtipo",
            "remoteColumn": "id"
        },
        {
            "type": "belongsTo",
            "targetModel": "proyectos",
            "targetTable": "proyectos",
            "localColumn": "idproyecto",
            "remoteColumn": "idproyecto"
        },
        {
            "type": "hasMany",
            "targetModel": "servicio_categoria_at",
            "targetTable": "serviciosat_serviciocategorias",
            "localColumn": "idservicio",
            "remoteColumn": "idservice"
        },
        {
            "type": "hasMany",
            "targetModel": "servicio_check_at",
            "targetTable": "serviciosat_serviciochecks",
            "localColumn": "idservicio",
            "remoteColumn": "idservice"
        },
        {
            "type": "hasMany",
            "targetModel": "trabajo_at",
            "targetTable": "serviciosat_trabajos",
            "localColumn": "idservicio",
            "remoteColumn": "idservicio"
        }
    ],
    "availability": [
        {
            "source": "plugin:Servicios",
            "since": "4.11",
            "sinceFirstTag": true
        }
    ],
    "generatedFrom": {
        "generatedAt": "2026-11-24T13:08:19.225Z",
        "facturascriptsCommit": "7aa596470",
        "facturascriptsVersion": "plugin:Servicios@124f8a2",
        "versions": {
            "plugin:Servicios": {
                "latest": "4.31",
                "tags": 5
            },
            "plugin:Proyectos": {
                "latest": "4.2",
                "tags": 36
            }
        }
    }
};

export default servicioAtMetadata;
