/**
 * Core Business Module - Tools para gestión de datos maestros de FacturaScripts
 * Incluye: Clientes, Proveedores, Productos, Familias, Fabricantes, Almacenes, etc.
 */
import { fsClient } from '../../fs/client.js';
export const coreBusinessTools = [
    {
        name: 'get_clientes',
        description: 'Obtiene la lista de clientes de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codcliente: {
                    type: 'string',
                    description: 'Filtrar por código de cliente',
                },
                nombre: {
                    type: 'string',
                    description: 'Filtrar por nombre (búsqueda parcial)',
                },
                cifnif: {
                    type: 'string',
                    description: 'Filtrar por CIF/NIF',
                },
                email: {
                    type: 'string',
                    description: 'Filtrar por email',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_proveedores',
        description: 'Obtiene la lista de proveedores de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codproveedor: {
                    type: 'string',
                    description: 'Filtrar por código de proveedor',
                },
                nombre: {
                    type: 'string',
                    description: 'Filtrar por nombre',
                },
                cifnif: {
                    type: 'string',
                    description: 'Filtrar por CIF/NIF',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_productos',
        description: 'Obtiene la lista de productos de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
                descripcion: {
                    type: 'string',
                    description: 'Filtrar por descripción',
                },
                codfamilia: {
                    type: 'string',
                    description: 'Filtrar por código de familia',
                },
                codalmacen: {
                    type: 'string',
                    description: 'Filtrar por código de almacén',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_variantes',
        description: 'Obtiene la lista de variantes de productos',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
                codbarras: {
                    type: 'string',
                    description: 'Filtrar por código de barras',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_familias',
        description: 'Obtiene la lista de familias de productos',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codfamilia: {
                    type: 'string',
                    description: 'Filtrar por código de familia',
                },
                descripcion: {
                    type: 'string',
                    description: 'Filtrar por descripción',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_fabricantes',
        description: 'Obtiene la lista de fabricantes',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_almacenes',
        description: 'Obtiene la lista de almacenes configurados',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_stocks',
        description: 'Obtiene información de stocks de productos en almacenes',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
                codalmacen: {
                    type: 'string',
                    description: 'Filtrar por código de almacén',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_tarifas',
        description: 'Obtiene la lista de tarifas de precios',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_atributos',
        description: 'Obtiene la lista de atributos de productos',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_atributovalores',
        description: 'Obtiene los valores de atributos de productos',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codatributo: {
                    type: 'string',
                    description: 'Filtrar por código de atributo',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_agentes',
        description: 'Obtiene la lista de agentes comerciales',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codagente: {
                    type: 'string',
                    description: 'Filtrar por código de agente',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_contactos',
        description: 'Obtiene la lista de contactos (personas de contacto)',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codcontacto: {
                    type: 'string',
                    description: 'Filtrar por código de contacto',
                },
                nombre: {
                    type: 'string',
                    description: 'Filtrar por nombre',
                },
                email: {
                    type: 'string',
                    description: 'Filtrar por email',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_grupoclientes',
        description: 'Obtiene la lista de grupos de clientes',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_productoproveedores',
        description: 'Obtiene los productos proveedores (productos vinculados a proveedores)',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
                codproveedor: {
                    type: 'string',
                    description: 'Filtrar por código de proveedor',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_productoimagenes',
        description: 'Obtiene las imágenes de productos',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
            },
            required: ['connection'],
        },
    },
];
// ──────────────────────────────────────────────────
// Definiciones de herramientas de escritura
// ──────────────────────────────────────────────────
export const coreBusinessWriteTools = [
    // ── Clientes ──
    {
        name: 'create_cliente',
        description: 'Crea un nuevo cliente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                nombre: { type: 'string', description: 'Nombre o razón social del cliente' },
                cifnif: { type: 'string', description: 'CIF/NIF del cliente' },
                tipoidfiscal: { type: 'string', description: 'Tipo de identificador fiscal' },
                email: { type: 'string', description: 'Email del cliente' },
                telefono1: { type: 'string', description: 'Teléfono principal' },
                telefono2: { type: 'string', description: 'Teléfono secundario' },
                fax: { type: 'string', description: 'Número de fax' },
                razonsocial: { type: 'string', description: 'Razón social' },
                codpais: { type: 'string', description: 'Código de país (ej: ESP)' },
                provincia: { type: 'string', description: 'Provincia' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                direccion: { type: 'string', description: 'Dirección' },
                codgrupo: { type: 'string', description: 'Código de grupo de clientes' },
                codagente: { type: 'string', description: 'Código de agente comercial' },
                regimeniva: { type: 'string', description: 'Régimen de IVA (ej: general, exento)' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                codretencion: { type: 'string', description: 'Código de retención' },
                codserie: { type: 'string', description: 'Código de serie por defecto' },
                codsubcuenta: { type: 'string', description: 'Código de subcuenta contable' },
                codtarifa: { type: 'string', description: 'Código de tarifa' },
                codproveedor: { type: 'string', description: 'Código de proveedor asociado' },
                debaja: { type: 'boolean', description: 'Si el cliente está dado de baja' },
                diaspago: { type: 'number', description: 'Días de pago' },
                excepcioniva: { type: 'string', description: 'Excepción de IVA' },
                fechaalta: { type: 'string', description: 'Fecha de alta (YYYY-MM-DD)' },
                fechabaja: { type: 'string', description: 'Fecha de baja (YYYY-MM-DD)' },
                idcontactoenv: { type: 'number', description: 'ID del contacto de envío' },
                idcontactofact: { type: 'number', description: 'ID del contacto de facturación' },
                langcode: { type: 'string', description: 'Código de idioma (ej: es_ES)' },
                operacion: { type: 'string', description: 'Tipo de operación (ej: nacional, intracomunitaria)' },
                observaciones: { type: 'string', description: 'Observaciones' },
                personafisica: { type: 'boolean', description: 'Si es persona física' },
                riesgoalcanzado: { type: 'number', description: 'Riesgo alcanzado' },
                riesgomax: { type: 'number', description: 'Riesgo máximo' },
                web: { type: 'string', description: 'Página web' },
            },
            required: ['connection', 'nombre'],
        },
    },
    {
        name: 'update_cliente',
        description: 'Actualiza los datos de un cliente existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcliente: { type: 'string', description: 'Código del cliente a actualizar' },
                nombre: { type: 'string', description: 'Nuevo nombre o razón social' },
                cifnif: { type: 'string', description: 'CIF/NIF' },
                tipoidfiscal: { type: 'string', description: 'Tipo de identificador fiscal' },
                email: { type: 'string', description: 'Email' },
                telefono1: { type: 'string', description: 'Teléfono principal' },
                telefono2: { type: 'string', description: 'Teléfono secundario' },
                fax: { type: 'string', description: 'Número de fax' },
                razonsocial: { type: 'string', description: 'Razón social' },
                codpais: { type: 'string', description: 'Código de país' },
                provincia: { type: 'string', description: 'Provincia' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                direccion: { type: 'string', description: 'Dirección' },
                codgrupo: { type: 'string', description: 'Código de grupo' },
                codagente: { type: 'string', description: 'Código de agente' },
                regimeniva: { type: 'string', description: 'Régimen de IVA' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                codretencion: { type: 'string', description: 'Código de retención' },
                codserie: { type: 'string', description: 'Código de serie por defecto' },
                codsubcuenta: { type: 'string', description: 'Código de subcuenta contable' },
                codtarifa: { type: 'string', description: 'Código de tarifa' },
                codproveedor: { type: 'string', description: 'Código de proveedor asociado' },
                debaja: { type: 'boolean', description: 'Si el cliente está dado de baja' },
                diaspago: { type: 'number', description: 'Días de pago' },
                excepcioniva: { type: 'string', description: 'Excepción de IVA' },
                fechaalta: { type: 'string', description: 'Fecha de alta (YYYY-MM-DD)' },
                fechabaja: { type: 'string', description: 'Fecha de baja (YYYY-MM-DD)' },
                idcontactoenv: { type: 'number', description: 'ID del contacto de envío' },
                idcontactofact: { type: 'number', description: 'ID del contacto de facturación' },
                langcode: { type: 'string', description: 'Código de idioma (ej: es_ES)' },
                operacion: { type: 'string', description: 'Tipo de operación' },
                observaciones: { type: 'string', description: 'Observaciones' },
                personafisica: { type: 'boolean', description: 'Si es persona física' },
                riesgoalcanzado: { type: 'number', description: 'Riesgo alcanzado' },
                riesgomax: { type: 'number', description: 'Riesgo máximo' },
                web: { type: 'string', description: 'Página web' },
            },
            required: ['connection', 'codcliente'],
        },
    },
    {
        name: 'delete_cliente',
        description: 'Elimina un cliente de FacturaScripts. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcliente: { type: 'string', description: 'Código del cliente a eliminar' },
            },
            required: ['connection', 'codcliente'],
        },
    },
    // ── Proveedores ──
    {
        name: 'create_proveedor',
        description: 'Crea un nuevo proveedor en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                nombre: { type: 'string', description: 'Nombre o razón social del proveedor' },
                cifnif: { type: 'string', description: 'CIF/NIF del proveedor' },
                tipoidfiscal: { type: 'string', description: 'Tipo de identificador fiscal' },
                email: { type: 'string', description: 'Email del proveedor' },
                telefono1: { type: 'string', description: 'Teléfono principal' },
                telefono2: { type: 'string', description: 'Teléfono secundario' },
                fax: { type: 'string', description: 'Número de fax' },
                razonsocial: { type: 'string', description: 'Razón social' },
                regimeniva: { type: 'string', description: 'Régimen de IVA' },
                codpais: { type: 'string', description: 'Código de país (ej: ESP)' },
                provincia: { type: 'string', description: 'Provincia' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                direccion: { type: 'string', description: 'Dirección' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                codretencion: { type: 'string', description: 'Código de retención' },
                codserie: { type: 'string', description: 'Código de serie por defecto' },
                codsubcuenta: { type: 'string', description: 'Código de subcuenta contable' },
                codcliente: { type: 'string', description: 'Código de cliente asociado' },
                acreedor: { type: 'boolean', description: 'Si es acreedor' },
                debaja: { type: 'boolean', description: 'Si el proveedor está dado de baja' },
                excepcioniva: { type: 'string', description: 'Excepción de IVA' },
                fechaalta: { type: 'string', description: 'Fecha de alta (YYYY-MM-DD)' },
                fechabaja: { type: 'string', description: 'Fecha de baja (YYYY-MM-DD)' },
                idcontacto: { type: 'number', description: 'ID del contacto asociado' },
                langcode: { type: 'string', description: 'Código de idioma (ej: es_ES)' },
                operacion: { type: 'string', description: 'Tipo de operación' },
                observaciones: { type: 'string', description: 'Observaciones' },
                personafisica: { type: 'boolean', description: 'Si es persona física' },
                web: { type: 'string', description: 'Página web' },
            },
            required: ['connection', 'nombre'],
        },
    },
    {
        name: 'update_proveedor',
        description: 'Actualiza los datos de un proveedor existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codproveedor: { type: 'string', description: 'Código del proveedor a actualizar' },
                nombre: { type: 'string', description: 'Nuevo nombre o razón social' },
                cifnif: { type: 'string', description: 'CIF/NIF' },
                tipoidfiscal: { type: 'string', description: 'Tipo de identificador fiscal' },
                email: { type: 'string', description: 'Email' },
                telefono1: { type: 'string', description: 'Teléfono principal' },
                telefono2: { type: 'string', description: 'Teléfono secundario' },
                fax: { type: 'string', description: 'Número de fax' },
                razonsocial: { type: 'string', description: 'Razón social' },
                regimeniva: { type: 'string', description: 'Régimen de IVA' },
                codpais: { type: 'string', description: 'Código de país' },
                provincia: { type: 'string', description: 'Provincia' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                direccion: { type: 'string', description: 'Dirección' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                codretencion: { type: 'string', description: 'Código de retención' },
                codserie: { type: 'string', description: 'Código de serie por defecto' },
                codsubcuenta: { type: 'string', description: 'Código de subcuenta contable' },
                codcliente: { type: 'string', description: 'Código de cliente asociado' },
                acreedor: { type: 'boolean', description: 'Si es acreedor' },
                debaja: { type: 'boolean', description: 'Si el proveedor está dado de baja' },
                excepcioniva: { type: 'string', description: 'Excepción de IVA' },
                fechaalta: { type: 'string', description: 'Fecha de alta (YYYY-MM-DD)' },
                fechabaja: { type: 'string', description: 'Fecha de baja (YYYY-MM-DD)' },
                idcontacto: { type: 'number', description: 'ID del contacto asociado' },
                langcode: { type: 'string', description: 'Código de idioma (ej: es_ES)' },
                operacion: { type: 'string', description: 'Tipo de operación' },
                observaciones: { type: 'string', description: 'Observaciones' },
                personafisica: { type: 'boolean', description: 'Si es persona física' },
                web: { type: 'string', description: 'Página web' },
            },
            required: ['connection', 'codproveedor'],
        },
    },
    {
        name: 'delete_proveedor',
        description: 'Elimina un proveedor de FacturaScripts. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codproveedor: { type: 'string', description: 'Código del proveedor a eliminar' },
            },
            required: ['connection', 'codproveedor'],
        },
    },
    // ── Productos ──
    {
        name: 'create_producto',
        description: 'Crea un nuevo producto en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                referencia: { type: 'string', description: 'Referencia única del producto' },
                descripcion: { type: 'string', description: 'Descripción del producto' },
                pvp: { type: 'number', description: 'Precio de venta al público' },
                precio: { type: 'number', description: 'Precio base del modelo' },
                coste: { type: 'number', description: 'Precio de coste' },
                codfamilia: { type: 'string', description: 'Código de familia' },
                codfabricante: { type: 'string', description: 'Código de fabricante' },
                codimpuesto: { type: 'string', description: 'Código de impuesto (ej: IVA21)' },
                secompra: { type: 'boolean', description: 'Si el producto se puede comprar' },
                sevende: { type: 'boolean', description: 'Si el producto se puede vender' },
                publico: { type: 'boolean', description: 'Si el producto es visible públicamente' },
                stockmin: { type: 'number', description: 'Stock mínimo' },
                stockmax: { type: 'number', description: 'Stock máximo' },
                stockfis: { type: 'number', description: 'Stock físico actual' },
                observaciones: { type: 'string', description: 'Observaciones' },
                actualizado: { type: 'string', description: 'Fecha de última actualización (YYYY-MM-DD HH:MM:SS)' },
                bloqueado: { type: 'boolean', description: 'Si el producto está bloqueado para venta/compra' },
                codsubcuentacom: { type: 'string', description: 'Código de subcuenta de compras' },
                codsubcuentairpfcom: { type: 'string', description: 'Código de subcuenta IRPF compras' },
                codsubcuentaven: { type: 'string', description: 'Código de subcuenta de ventas' },
                excepcioniva: { type: 'string', description: 'Excepción de IVA' },
                fechaalta: { type: 'string', description: 'Fecha de alta (YYYY-MM-DD)' },
                nostock: { type: 'boolean', description: 'Si no lleva control de stock' },
                tipo: { type: 'string', description: 'Tipo de producto' },
                ventasinstock: { type: 'boolean', description: 'Si se puede vender sin stock' },
            },
            required: ['connection', 'referencia', 'descripcion'],
        },
    },
    {
        name: 'update_producto',
        description: 'Actualiza los datos de un producto existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                referencia: { type: 'string', description: 'Referencia del producto a actualizar' },
                descripcion: { type: 'string', description: 'Nueva descripción' },
                pvp: { type: 'number', description: 'Nuevo PVP' },
                precio: { type: 'number', description: 'Precio base del modelo' },
                coste: { type: 'number', description: 'Nuevo precio de coste' },
                codfamilia: { type: 'string', description: 'Código de familia' },
                codfabricante: { type: 'string', description: 'Código de fabricante' },
                codimpuesto: { type: 'string', description: 'Código de impuesto' },
                secompra: { type: 'boolean', description: 'Si se puede comprar' },
                sevende: { type: 'boolean', description: 'Si se puede vender' },
                publico: { type: 'boolean', description: 'Si es visible públicamente' },
                stockmin: { type: 'number', description: 'Stock mínimo' },
                stockmax: { type: 'number', description: 'Stock máximo' },
                stockfis: { type: 'number', description: 'Stock físico actual' },
                observaciones: { type: 'string', description: 'Observaciones' },
                actualizado: { type: 'string', description: 'Fecha de última actualización (YYYY-MM-DD HH:MM:SS)' },
                bloqueado: { type: 'boolean', description: 'Si el producto está bloqueado' },
                codsubcuentacom: { type: 'string', description: 'Código de subcuenta de compras' },
                codsubcuentairpfcom: { type: 'string', description: 'Código de subcuenta IRPF compras' },
                codsubcuentaven: { type: 'string', description: 'Código de subcuenta de ventas' },
                excepcioniva: { type: 'string', description: 'Excepción de IVA' },
                fechaalta: { type: 'string', description: 'Fecha de alta (YYYY-MM-DD)' },
                nostock: { type: 'boolean', description: 'Si no lleva control de stock' },
                tipo: { type: 'string', description: 'Tipo de producto' },
                ventasinstock: { type: 'boolean', description: 'Si se puede vender sin stock' },
            },
            required: ['connection', 'referencia'],
        },
    },
    {
        name: 'delete_producto',
        description: 'Elimina un producto de FacturaScripts. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                referencia: { type: 'string', description: 'Referencia del producto a eliminar' },
            },
            required: ['connection', 'referencia'],
        },
    },
    // ── Contactos ──
    {
        name: 'create_contacto',
        description: 'Crea un nuevo contacto en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                nombre: { type: 'string', description: 'Nombre del contacto' },
                apellidos: { type: 'string', description: 'Apellidos del contacto' },
                email: { type: 'string', description: 'Email del contacto' },
                telefono1: { type: 'string', description: 'Teléfono principal' },
                telefono2: { type: 'string', description: 'Teléfono secundario' },
                codpais: { type: 'string', description: 'Código de país' },
                provincia: { type: 'string', description: 'Provincia' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                direccion: { type: 'string', description: 'Dirección' },
                apartado: { type: 'string', description: 'Apartado de correos' },
                empresa: { type: 'string', description: 'Empresa del contacto' },
                cargo: { type: 'string', description: 'Cargo en la empresa' },
                descripcion: { type: 'string', description: 'Descripción o notas' },
                aceptaprivacidad: { type: 'boolean', description: 'Si acepta la política de privacidad' },
                admitemarketing: { type: 'boolean', description: 'Si admite comunicaciones de marketing' },
                codagente: { type: 'string', description: 'Código de agente asociado' },
                codcliente: { type: 'string', description: 'Código de cliente asociado' },
                codproveedor: { type: 'string', description: 'Código de proveedor asociado' },
                fechaalta: { type: 'string', description: 'Fecha de alta (YYYY-MM-DD)' },
                langcode: { type: 'string', description: 'Código de idioma (ej: es_ES)' },
                observaciones: { type: 'string', description: 'Observaciones' },
                personafisica: { type: 'boolean', description: 'Si es persona física' },
                verificado: { type: 'boolean', description: 'Si el contacto está verificado' },
                web: { type: 'string', description: 'Página web' },
            },
            required: ['connection', 'nombre'],
        },
    },
    {
        name: 'update_contacto',
        description: 'Actualiza los datos de un contacto existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcontacto: { type: 'string', description: 'Código del contacto a actualizar' },
                nombre: { type: 'string', description: 'Nombre' },
                apellidos: { type: 'string', description: 'Apellidos' },
                email: { type: 'string', description: 'Email' },
                telefono1: { type: 'string', description: 'Teléfono principal' },
                telefono2: { type: 'string', description: 'Teléfono secundario' },
                codpais: { type: 'string', description: 'Código de país' },
                provincia: { type: 'string', description: 'Provincia' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                direccion: { type: 'string', description: 'Dirección' },
                apartado: { type: 'string', description: 'Apartado de correos' },
                empresa: { type: 'string', description: 'Empresa' },
                cargo: { type: 'string', description: 'Cargo' },
                descripcion: { type: 'string', description: 'Descripción o notas' },
                aceptaprivacidad: { type: 'boolean', description: 'Si acepta la política de privacidad' },
                admitemarketing: { type: 'boolean', description: 'Si admite comunicaciones de marketing' },
                codagente: { type: 'string', description: 'Código de agente asociado' },
                codcliente: { type: 'string', description: 'Código de cliente asociado' },
                codproveedor: { type: 'string', description: 'Código de proveedor asociado' },
                fechaalta: { type: 'string', description: 'Fecha de alta (YYYY-MM-DD)' },
                langcode: { type: 'string', description: 'Código de idioma (ej: es_ES)' },
                observaciones: { type: 'string', description: 'Observaciones' },
                personafisica: { type: 'boolean', description: 'Si es persona física' },
                verificado: { type: 'boolean', description: 'Si el contacto está verificado' },
                web: { type: 'string', description: 'Página web' },
            },
            required: ['connection', 'codcontacto'],
        },
    },
    {
        name: 'delete_contacto',
        description: 'Elimina un contacto de FacturaScripts. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcontacto: { type: 'string', description: 'Código del contacto a eliminar' },
            },
            required: ['connection', 'codcontacto'],
        },
    },
    // ── Variantes ──
    {
        name: 'create_variante',
        description: 'Crea una nueva variante de producto en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                referencia: { type: 'string', description: 'Referencia del producto (obligatorio)' },
                codbarras: { type: 'string', description: 'Código de barras' },
                coste: { type: 'number', description: 'Precio de coste' },
                idatributovalor1: { type: 'number', description: 'ID del primer valor de atributo' },
                idatributovalor2: { type: 'number', description: 'ID del segundo valor de atributo' },
                idatributovalor3: { type: 'number', description: 'ID del tercer valor de atributo' },
                idatributovalor4: { type: 'number', description: 'ID del cuarto valor de atributo' },
                margen: { type: 'number', description: 'Margen de beneficio' },
                precio: { type: 'number', description: 'Precio de venta' },
            },
            required: ['referencia'],
        },
    },
    {
        name: 'update_variante',
        description: 'Actualiza una variante de producto existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idvariante: { type: 'number', description: 'ID de la variante a actualizar (obligatorio)' },
                referencia: { type: 'string', description: 'Referencia del producto' },
                codbarras: { type: 'string', description: 'Código de barras' },
                coste: { type: 'number', description: 'Precio de coste' },
                margen: { type: 'number', description: 'Margen de beneficio' },
                precio: { type: 'number', description: 'Precio de venta' },
            },
            required: ['idvariante'],
        },
    },
    {
        name: 'delete_variante',
        description: 'Elimina una variante de producto de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idvariante: { type: 'number', description: 'ID de la variante a eliminar' },
            },
            required: ['idvariante'],
        },
    },
    // ── Familias ──
    {
        name: 'create_familia',
        description: 'Crea una nueva familia de productos en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codfamilia: { type: 'string', description: 'Código de la familia (obligatorio)' },
                descripcion: { type: 'string', description: 'Descripción de la familia (obligatorio)' },
                madre: { type: 'string', description: 'Código de la familia madre (padre)' },
                codsubcuentacom: { type: 'string', description: 'Subcuenta de compras' },
                codsubcuentaven: { type: 'string', description: 'Subcuenta de ventas' },
            },
            required: ['codfamilia', 'descripcion'],
        },
    },
    {
        name: 'update_familia',
        description: 'Actualiza una familia de productos existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codfamilia: { type: 'string', description: 'Código de la familia a actualizar (obligatorio)' },
                descripcion: { type: 'string', description: 'Descripción de la familia' },
                madre: { type: 'string', description: 'Código de la familia madre' },
                codsubcuentacom: { type: 'string', description: 'Subcuenta de compras' },
                codsubcuentaven: { type: 'string', description: 'Subcuenta de ventas' },
            },
            required: ['codfamilia'],
        },
    },
    {
        name: 'delete_familia',
        description: 'Elimina una familia de productos de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codfamilia: { type: 'string', description: 'Código de la familia a eliminar' },
            },
            required: ['codfamilia'],
        },
    },
    // ── Fabricantes ──
    {
        name: 'create_fabricante',
        description: 'Crea un nuevo fabricante en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codfabricante: { type: 'string', description: 'Código del fabricante (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del fabricante (obligatorio)' },
            },
            required: ['codfabricante', 'nombre'],
        },
    },
    {
        name: 'update_fabricante',
        description: 'Actualiza un fabricante existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codfabricante: { type: 'string', description: 'Código del fabricante a actualizar (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del fabricante' },
            },
            required: ['codfabricante'],
        },
    },
    {
        name: 'delete_fabricante',
        description: 'Elimina un fabricante de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codfabricante: { type: 'string', description: 'Código del fabricante a eliminar' },
            },
            required: ['codfabricante'],
        },
    },
    // ── Almacenes ──
    {
        name: 'create_almacen',
        description: 'Crea un nuevo almacén en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codalmacen: { type: 'string', description: 'Código del almacén (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del almacén (obligatorio)' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpais: { type: 'string', description: 'Código del país' },
                codpostal: { type: 'string', description: 'Código postal' },
                direccion: { type: 'string', description: 'Dirección' },
                provincia: { type: 'string', description: 'Provincia' },
                telefono: { type: 'string', description: 'Teléfono' },
                activo: { type: 'boolean', description: 'Si el almacén está activo' },
            },
            required: ['codalmacen', 'nombre'],
        },
    },
    {
        name: 'update_almacen',
        description: 'Actualiza un almacén existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codalmacen: { type: 'string', description: 'Código del almacén a actualizar (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del almacén' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpais: { type: 'string', description: 'Código del país' },
                codpostal: { type: 'string', description: 'Código postal' },
                direccion: { type: 'string', description: 'Dirección' },
                provincia: { type: 'string', description: 'Provincia' },
                telefono: { type: 'string', description: 'Teléfono' },
                activo: { type: 'boolean', description: 'Si el almacén está activo' },
            },
            required: ['codalmacen'],
        },
    },
    {
        name: 'delete_almacen',
        description: 'Elimina un almacén de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codalmacen: { type: 'string', description: 'Código del almacén a eliminar' },
            },
            required: ['codalmacen'],
        },
    },
    // ── Tarifas ──
    {
        name: 'create_tarifa',
        description: 'Crea una nueva tarifa de precios en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codtarifa: { type: 'string', description: 'Código de la tarifa (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre de la tarifa (obligatorio)' },
                aplicar: { type: 'string', description: 'A qué se aplica la tarifa' },
                valorx: { type: 'number', description: 'Primer valor de ajuste' },
                valory: { type: 'number', description: 'Segundo valor de ajuste' },
                mincoste: { type: 'number', description: 'Porcentaje mínimo sobre coste' },
                maxpvp: { type: 'number', description: 'Precio máximo de venta' },
            },
            required: ['codtarifa', 'nombre'],
        },
    },
    {
        name: 'update_tarifa',
        description: 'Actualiza una tarifa de precios existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codtarifa: { type: 'string', description: 'Código de la tarifa a actualizar (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre de la tarifa' },
                aplicar: { type: 'string', description: 'A qué se aplica la tarifa' },
                valorx: { type: 'number', description: 'Primer valor de ajuste' },
                valory: { type: 'number', description: 'Segundo valor de ajuste' },
                mincoste: { type: 'number', description: 'Porcentaje mínimo sobre coste' },
                maxpvp: { type: 'number', description: 'Precio máximo de venta' },
            },
            required: ['codtarifa'],
        },
    },
    {
        name: 'delete_tarifa',
        description: 'Elimina una tarifa de precios de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codtarifa: { type: 'string', description: 'Código de la tarifa a eliminar' },
            },
            required: ['codtarifa'],
        },
    },
    // ── Atributos ──
    {
        name: 'create_atributo',
        description: 'Crea un nuevo atributo de producto en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codatributo: { type: 'string', description: 'Código del atributo (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del atributo (obligatorio)' },
                num_selector: { type: 'number', description: 'Posición del selector (1-4)' },
            },
            required: ['codatributo', 'nombre'],
        },
    },
    {
        name: 'update_atributo',
        description: 'Actualiza un atributo de producto existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codatributo: { type: 'string', description: 'Código del atributo a actualizar (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del atributo' },
                num_selector: { type: 'number', description: 'Posición del selector' },
            },
            required: ['codatributo'],
        },
    },
    {
        name: 'delete_atributo',
        description: 'Elimina un atributo de producto de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codatributo: { type: 'string', description: 'Código del atributo a eliminar' },
            },
            required: ['codatributo'],
        },
    },
    // ── Valores de atributo ──
    {
        name: 'create_atributovalor',
        description: 'Crea un nuevo valor de atributo en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codatributo: { type: 'string', description: 'Código del atributo padre (obligatorio)' },
                valor: { type: 'string', description: 'Valor del atributo (obligatorio)' },
            },
            required: ['codatributo', 'valor'],
        },
    },
    {
        name: 'update_atributovalor',
        description: 'Actualiza un valor de atributo existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del valor de atributo a actualizar (obligatorio)' },
                codatributo: { type: 'string', description: 'Código del atributo padre' },
                valor: { type: 'string', description: 'Nuevo valor' },
            },
            required: ['id'],
        },
    },
    {
        name: 'delete_atributovalor',
        description: 'Elimina un valor de atributo de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del valor de atributo a eliminar' },
            },
            required: ['id'],
        },
    },
    // ── Agentes ──
    {
        name: 'create_agente',
        description: 'Crea un nuevo agente comercial en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codagente: { type: 'string', description: 'Código del agente (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del agente (obligatorio)' },
                cargo: { type: 'string', description: 'Cargo o puesto del agente' },
                idcontacto: { type: 'number', description: 'ID del contacto asociado' },
                observaciones: { type: 'string', description: 'Observaciones sobre el agente' },
                debaja: { type: 'boolean', description: 'Si el agente está dado de baja' },
            },
            required: ['codagente', 'nombre'],
        },
    },
    {
        name: 'update_agente',
        description: 'Actualiza un agente comercial existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codagente: { type: 'string', description: 'Código del agente a actualizar (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del agente' },
                cargo: { type: 'string', description: 'Cargo o puesto' },
                idcontacto: { type: 'number', description: 'ID del contacto asociado' },
                observaciones: { type: 'string', description: 'Observaciones' },
                debaja: { type: 'boolean', description: 'Si el agente está dado de baja' },
            },
            required: ['codagente'],
        },
    },
    {
        name: 'delete_agente',
        description: 'Elimina un agente comercial de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codagente: { type: 'string', description: 'Código del agente a eliminar' },
            },
            required: ['codagente'],
        },
    },
    // ── Grupos de clientes ──
    {
        name: 'create_grupoclientes',
        description: 'Crea un nuevo grupo de clientes en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codgrupo: { type: 'string', description: 'Código del grupo (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del grupo (obligatorio)' },
                codtarifa: { type: 'string', description: 'Código de la tarifa asignada' },
                codsubcuenta: { type: 'string', description: 'Subcuenta contable' },
            },
            required: ['codgrupo', 'nombre'],
        },
    },
    {
        name: 'update_grupoclientes',
        description: 'Actualiza un grupo de clientes existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codgrupo: { type: 'string', description: 'Código del grupo a actualizar (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del grupo' },
                codtarifa: { type: 'string', description: 'Código de la tarifa' },
                codsubcuenta: { type: 'string', description: 'Subcuenta contable' },
            },
            required: ['codgrupo'],
        },
    },
    {
        name: 'delete_grupoclientes',
        description: 'Elimina un grupo de clientes de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codgrupo: { type: 'string', description: 'Código del grupo a eliminar' },
            },
            required: ['codgrupo'],
        },
    },
    // ── Precios de productos por proveedor ──
    {
        name: 'create_productoproveedor',
        description: 'Crea un nuevo precio de producto por proveedor en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                referencia: { type: 'string', description: 'Referencia del producto (obligatorio)' },
                codproveedor: { type: 'string', description: 'Código del proveedor (obligatorio)' },
                refproveedor: { type: 'string', description: 'Referencia del proveedor' },
                precio: { type: 'number', description: 'Precio de compra' },
                dtopor: { type: 'number', description: 'Porcentaje de descuento 1' },
                dtopor2: { type: 'number', description: 'Porcentaje de descuento 2' },
                coddivisa: { type: 'string', description: 'Código de divisa' },
            },
            required: ['referencia', 'codproveedor'],
        },
    },
    {
        name: 'update_productoproveedor',
        description: 'Actualiza un precio de producto por proveedor existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del registro a actualizar (obligatorio)' },
                referencia: { type: 'string', description: 'Referencia del producto' },
                codproveedor: { type: 'string', description: 'Código del proveedor' },
                refproveedor: { type: 'string', description: 'Referencia del proveedor' },
                precio: { type: 'number', description: 'Precio de compra' },
                dtopor: { type: 'number', description: 'Porcentaje de descuento 1' },
                dtopor2: { type: 'number', description: 'Porcentaje de descuento 2' },
                coddivisa: { type: 'string', description: 'Código de divisa' },
            },
            required: ['id'],
        },
    },
    {
        name: 'delete_productoproveedor',
        description: 'Elimina un precio de producto por proveedor de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del registro a eliminar' },
            },
            required: ['id'],
        },
    },
    // ── Stocks ──
    {
        name: 'create_stock',
        description: 'Crea un nuevo registro de stock en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                referencia: { type: 'string', description: 'Referencia del producto (obligatorio)' },
                codalmacen: { type: 'string', description: 'Código del almacén (obligatorio)' },
                cantidad: { type: 'number', description: 'Cantidad en stock' },
                reservada: { type: 'number', description: 'Cantidad reservada' },
                pterecibir: { type: 'number', description: 'Cantidad pendiente de recibir' },
                disponible: { type: 'number', description: 'Cantidad disponible' },
            },
            required: ['referencia', 'codalmacen'],
        },
    },
    {
        name: 'update_stock',
        description: 'Actualiza un registro de stock existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idstock: { type: 'number', description: 'ID del stock a actualizar (obligatorio)' },
                referencia: { type: 'string', description: 'Referencia del producto' },
                codalmacen: { type: 'string', description: 'Código del almacén' },
                cantidad: { type: 'number', description: 'Cantidad en stock' },
                reservada: { type: 'number', description: 'Cantidad reservada' },
                pterecibir: { type: 'number', description: 'Cantidad pendiente de recibir' },
                disponible: { type: 'number', description: 'Cantidad disponible' },
            },
            required: ['idstock'],
        },
    },
    {
        name: 'delete_stock',
        description: 'Elimina un registro de stock de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idstock: { type: 'number', description: 'ID del stock a eliminar' },
            },
            required: ['idstock'],
        },
    },
    // ── Cuentas bancarias de clientes ──
    {
        name: 'create_cuentabancocliente',
        description: 'Crea una nueva cuenta bancaria de cliente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcliente: { type: 'string', description: 'Código del cliente (obligatorio)' },
                iban: { type: 'string', description: 'IBAN de la cuenta (obligatorio)' },
                swift: { type: 'string', description: 'Código SWIFT/BIC' },
                descripcion: { type: 'string', description: 'Descripción de la cuenta' },
                principal: { type: 'boolean', description: 'Si es la cuenta principal' },
            },
            required: ['codcliente', 'iban'],
        },
    },
    {
        name: 'update_cuentabancocliente',
        description: 'Actualiza una cuenta bancaria de cliente existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcuenta: { type: 'string', description: 'Código de la cuenta a actualizar (obligatorio)' },
                codcliente: { type: 'string', description: 'Código del cliente' },
                iban: { type: 'string', description: 'IBAN de la cuenta' },
                swift: { type: 'string', description: 'Código SWIFT/BIC' },
                descripcion: { type: 'string', description: 'Descripción de la cuenta' },
                principal: { type: 'boolean', description: 'Si es la cuenta principal' },
            },
            required: ['codcuenta'],
        },
    },
    {
        name: 'delete_cuentabancocliente',
        description: 'Elimina una cuenta bancaria de cliente de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcuenta: { type: 'string', description: 'Código de la cuenta a eliminar' },
            },
            required: ['codcuenta'],
        },
    },
];
/**
 * Register all core business tools with the MCP server
 */
export async function registerCoreBusinessTools(tools) {
    coreBusinessTools.forEach((tool) => tools.set(tool.name, tool));
    coreBusinessWriteTools.forEach((tool) => tools.set(tool.name, tool));
}
/**
 * Handle core business tool calls
 */
export async function handleCoreBusinessTool(name, args) {
    const input = args;
    switch (name) {
        case 'get_clientes': {
            const params = input;
            const result = await fsClient.get('/clientes', {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                nombre: params.nombre,
                cifnif: params.cifnif,
                email: params.email,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_proveedores': {
            const params = input;
            const result = await fsClient.get('/proveedores', {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                nombre: params.nombre,
                cifnif: params.cifnif,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_productos': {
            const params = input;
            const result = await fsClient.get('/productos', {
                offset: params.offset,
                limit: params.limit,
                referencia: params.referencia,
                descripcion: params.descripcion,
                codfamilia: params.codfamilia,
                codalmacen: params.codalmacen,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_variantes': {
            const params = input;
            const result = await fsClient.get('/variantes', {
                offset: params.offset,
                limit: params.limit,
                referencia: params.referencia,
                codbarras: params.codbarras,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_familias': {
            const params = input;
            const result = await fsClient.get('/familias', {
                offset: params.offset,
                limit: params.limit,
                codfamilia: params.codfamilia,
                descripcion: params.descripcion,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_fabricantes': {
            const params = input;
            const result = await fsClient.get('/fabricantes', {
                offset: params.offset,
                limit: params.limit,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_almacenes': {
            const params = input;
            const result = await fsClient.get('/almacenes', {
                offset: params.offset,
                limit: params.limit,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_stocks': {
            const params = input;
            const result = await fsClient.get('/stocks', {
                offset: params.offset,
                limit: params.limit,
                referencia: params.referencia,
                codalmacen: params.codalmacen,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_tarifas': {
            const params = input;
            const result = await fsClient.get('/tarifas', {
                offset: params.offset,
                limit: params.limit,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_atributos': {
            const params = input;
            const result = await fsClient.get('/atributos', {
                offset: params.offset,
                limit: params.limit,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_atributovalores': {
            const params = input;
            const result = await fsClient.get('/atributovalores', {
                offset: params.offset,
                limit: params.limit,
                codatributo: params.codatributo,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_agentes': {
            const params = input;
            const result = await fsClient.get('/agentes', {
                offset: params.offset,
                limit: params.limit,
                codagente: params.codagente,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_contactos': {
            const params = input;
            const result = await fsClient.get('/contactos', {
                offset: params.offset,
                limit: params.limit,
                codcontacto: params.codcontacto,
                nombre: params.nombre,
                email: params.email,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_grupoclientes': {
            const params = input;
            const result = await fsClient.get('/grupoclientes', {
                offset: params.offset,
                limit: params.limit,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_productoproveedores': {
            const params = input;
            const result = await fsClient.get('/productoproveedores', {
                offset: params.offset,
                limit: params.limit,
                referencia: params.referencia,
                codproveedor: params.codproveedor,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_productoimagenes': {
            const params = input;
            const result = await fsClient.get('/productoimagenes', {
                offset: params.offset,
                limit: params.limit,
                referencia: params.referencia,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'create_cliente': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/clientes', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_cliente': {
            const params = input;
            const { connection, codcliente, ...data } = params;
            const result = await fsClient.put(`/clientes/${codcliente}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_cliente': {
            const params = input;
            const result = await fsClient.delete(`/clientes/${params.codcliente}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_proveedor': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/proveedores', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_proveedor': {
            const params = input;
            const { connection, codproveedor, ...data } = params;
            const result = await fsClient.put(`/proveedores/${codproveedor}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_proveedor': {
            const params = input;
            const result = await fsClient.delete(`/proveedores/${params.codproveedor}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_producto': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/productos', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_producto': {
            const params = input;
            const { connection, referencia, ...data } = params;
            const result = await fsClient.put(`/productos/${referencia}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_producto': {
            const params = input;
            const result = await fsClient.delete(`/productos/${params.referencia}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_contacto': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/contactos', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_contacto': {
            const params = input;
            const { connection, codcontacto, ...data } = params;
            const result = await fsClient.put(`/contactos/${codcontacto}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_contacto': {
            const params = input;
            const result = await fsClient.delete(`/contactos/${params.codcontacto}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_variante': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/variantes', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_variante': {
            const params = input;
            const { connection, idvariante, ...data } = params;
            const result = await fsClient.put(`/variantes/${idvariante}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_variante': {
            const params = input;
            const result = await fsClient.delete(`/variantes/${params.idvariante}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_familia': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/familias', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_familia': {
            const params = input;
            const { connection, codfamilia, ...data } = params;
            const result = await fsClient.put(`/familias/${codfamilia}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_familia': {
            const params = input;
            const result = await fsClient.delete(`/familias/${params.codfamilia}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_fabricante': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/fabricantes', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_fabricante': {
            const params = input;
            const { connection, codfabricante, ...data } = params;
            const result = await fsClient.put(`/fabricantes/${codfabricante}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_fabricante': {
            const params = input;
            const result = await fsClient.delete(`/fabricantes/${params.codfabricante}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_almacen': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/almacenes', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_almacen': {
            const params = input;
            const { connection, codalmacen, ...data } = params;
            const result = await fsClient.put(`/almacenes/${codalmacen}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_almacen': {
            const params = input;
            const result = await fsClient.delete(`/almacenes/${params.codalmacen}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_tarifa': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/tarifas', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_tarifa': {
            const params = input;
            const { connection, codtarifa, ...data } = params;
            const result = await fsClient.put(`/tarifas/${codtarifa}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_tarifa': {
            const params = input;
            const result = await fsClient.delete(`/tarifas/${params.codtarifa}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_atributo': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/atributos', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_atributo': {
            const params = input;
            const { connection, codatributo, ...data } = params;
            const result = await fsClient.put(`/atributos/${codatributo}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_atributo': {
            const params = input;
            const result = await fsClient.delete(`/atributos/${params.codatributo}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_atributovalor': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/atributovalores', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_atributovalor': {
            const params = input;
            const { connection, id, ...data } = params;
            const result = await fsClient.put(`/atributovalores/${id}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_atributovalor': {
            const params = input;
            const result = await fsClient.delete(`/atributovalores/${params.id}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_agente': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/agentes', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_agente': {
            const params = input;
            const { connection, codagente, ...data } = params;
            const result = await fsClient.put(`/agentes/${codagente}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_agente': {
            const params = input;
            const result = await fsClient.delete(`/agentes/${params.codagente}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_grupoclientes': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/grupoclientes', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_grupoclientes': {
            const params = input;
            const { connection, codgrupo, ...data } = params;
            const result = await fsClient.put(`/grupoclientes/${codgrupo}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_grupoclientes': {
            const params = input;
            const result = await fsClient.delete(`/grupoclientes/${params.codgrupo}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_productoproveedor': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/productoproveedores', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_productoproveedor': {
            const params = input;
            const { connection, id, ...data } = params;
            const result = await fsClient.put(`/productoproveedores/${id}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_productoproveedor': {
            const params = input;
            const result = await fsClient.delete(`/productoproveedores/${params.id}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_stock': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/stocks', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_stock': {
            const params = input;
            const { connection, idstock, ...data } = params;
            const result = await fsClient.put(`/stocks/${idstock}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_stock': {
            const params = input;
            const result = await fsClient.delete(`/stocks/${params.idstock}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_cuentabancocliente': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/cuentabancoasociados', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_cuentabancocliente': {
            const params = input;
            const { connection, codcuenta, ...data } = params;
            const result = await fsClient.put(`/cuentabancoasociados/${codcuenta}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_cuentabancocliente': {
            const params = input;
            const result = await fsClient.delete(`/cuentabancoasociados/${params.codcuenta}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        default:
            return null;
    }
}
//# sourceMappingURL=index.js.map