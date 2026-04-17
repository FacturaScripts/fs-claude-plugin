/**
 * Sales Orders Module - Tools para gestión de pedidos, presupuestos, albaranes y facturas
 * Incluye: Presupuestos, Pedidos, Albaranes, Facturas y Recibos de clientes
 */
import { fsClient } from '../../fs/client.js';
export const salesOrdersTools = [
    {
        name: 'get_presupuestoclientes',
        description: 'Obtiene la lista de presupuestos de clientes',
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
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
                estado: {
                    type: 'string',
                    description: 'Filtrar por estado',
                },
                codserie: {
                    type: 'string',
                    description: 'Filtrar por código de serie',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineapresupuestoclientes',
        description: 'Obtiene las líneas de presupuestos de clientes',
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
                idpresupuesto: {
                    type: 'number',
                    description: 'Filtrar por ID de presupuesto',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_pedidoclientes',
        description: 'Obtiene la lista de pedidos de clientes',
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
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
                estado: {
                    type: 'string',
                    description: 'Filtrar por estado',
                },
                codserie: {
                    type: 'string',
                    description: 'Filtrar por código de serie',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineapedidoclientes',
        description: 'Obtiene las líneas de pedidos de clientes',
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
                idpedido: {
                    type: 'number',
                    description: 'Filtrar por ID de pedido',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_albaranclientes',
        description: 'Obtiene la lista de albaranes de clientes',
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
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
                codserie: {
                    type: 'string',
                    description: 'Filtrar por código de serie',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineaalbaranclientes',
        description: 'Obtiene las líneas de albaranes de clientes',
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
                idalbaran: {
                    type: 'number',
                    description: 'Filtrar por ID de albarán',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_facturaclientes',
        description: 'Obtiene la lista de facturas de clientes',
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
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
                pagada: {
                    type: 'boolean',
                    description: 'Filtrar por estado de pago',
                },
                anulada: {
                    type: 'boolean',
                    description: 'Filtrar por estado de anulación',
                },
                codserie: {
                    type: 'string',
                    description: 'Filtrar por código de serie',
                },
                codejercicio: {
                    type: 'string',
                    description: 'Filtrar por código de ejercicio',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineafacturaclientes',
        description: 'Obtiene las líneas de facturas de clientes',
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
                idfactura: {
                    type: 'number',
                    description: 'Filtrar por ID de factura',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_reciboclientes',
        description: 'Obtiene la lista de recibos de clientes',
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
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
                pagado: {
                    type: 'boolean',
                    description: 'Filtrar por estado de pago',
                },
                vencimiento: {
                    type: 'string',
                    description: 'Filtrar por fecha de vencimiento (formato YYYY-MM-DD)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_pagoclientes',
        description: 'Obtiene la lista de pagos de clientes',
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
                idrecibo: {
                    type: 'number',
                    description: 'Filtrar por ID de recibo',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_cuentabancoclientes',
        description: 'Obtiene cuentas bancarias de clientes con filtros opcionales de código de cliente',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Identificador de conexión a la base de datos',
                },
                offset: {
                    type: 'number',
                    description: 'Número de registros a saltar',
                },
                limit: {
                    type: 'number',
                    description: 'Número máximo de registros a retornar',
                },
                codcliente: {
                    type: 'string',
                    description: 'Código del cliente',
                },
            },
            required: ['connection'],
        },
    },
];
export const salesOrdersWriteTools = [
    // ── Facturas de cliente ──
    {
        name: 'create_factura_cliente',
        description: 'Crea una nueva factura de cliente en FacturaScripts usando el endpoint especializado /crearFacturaCliente',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcliente: { type: 'string', description: 'Código del cliente (obligatorio)' },
                lineas: {
                    type: 'array',
                    description: 'Líneas de la factura (obligatorio)',
                    items: {
                        type: 'object',
                        properties: {
                            referencia: { type: 'string', description: 'Referencia del producto (opcional)' },
                            descripcion: { type: 'string', description: 'Descripción de la línea' },
                            cantidad: { type: 'number', description: 'Cantidad' },
                            pvpunitario: { type: 'number', description: 'Precio unitario' },
                            dtopor: { type: 'number', description: 'Descuento en porcentaje' },
                            codimpuesto: { type: 'string', description: 'Código de impuesto (ej: IVA21)' },
                            coste: { type: 'number', description: 'Precio de coste de la línea' },
                            orden: { type: 'number', description: 'Orden de la línea en el documento' },
                            actualizastock: { type: 'boolean', description: 'Si actualiza el stock al registrar' },
                            servido: { type: 'number', description: 'Cantidad ya servida' },
                            mostrar_cantidad: { type: 'boolean', description: 'Mostrar cantidad en impresión' },
                            mostrar_precio: { type: 'boolean', description: 'Mostrar precio en impresión' },
                            salto_pagina: { type: 'boolean', description: 'Insertar salto de página tras esta línea' },
                        },
                    },
                },
                fecha: { type: 'string', description: 'Fecha de la factura (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de serie' },
                codalmacen: { type: 'string', description: 'Código de almacén' },
                coddivisa: { type: 'string', description: 'Código de divisa (ej: EUR)' },
                observaciones: { type: 'string', description: 'Observaciones' },
                numero2: { type: 'string', description: 'Número externo o referencia del cliente' },
                pagada: { type: 'boolean', description: 'Marcar la factura como pagada al crearla' },
                codagente: { type: 'string', description: 'Código de agente comercial' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                dtopor1: { type: 'number', description: 'Descuento porcentual nivel 1' },
                dtopor2: { type: 'number', description: 'Descuento porcentual nivel 2' },
                irpf: { type: 'number', description: 'Porcentaje de retención IRPF' },
                nombrecliente: { type: 'string', description: 'Nombre del cliente en el documento' },
                cifnif: { type: 'string', description: 'CIF/NIF en el documento' },
                direccion: { type: 'string', description: 'Dirección de envío' },
                apartado: { type: 'string', description: 'Apartado de correos' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                codpais: { type: 'string', description: 'Código de país' },
                idcontactoenv: { type: 'number', description: 'ID del contacto de envío' },
                idcontactofact: { type: 'number', description: 'ID del contacto de facturación' },
            },
            required: ['connection', 'codcliente', 'lineas'],
        },
    },
    {
        name: 'delete_factura_cliente',
        description: 'Elimina una factura de cliente. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID de la factura (idfactura)' },
            },
            required: ['connection', 'id'],
        },
    },
    // ── Albaranes de cliente ──
    {
        name: 'create_albaran_cliente',
        description: 'Crea un nuevo albarán de cliente en FacturaScripts usando el endpoint /crearAlbaranCliente',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcliente: { type: 'string', description: 'Código del cliente (obligatorio)' },
                lineas: {
                    type: 'array',
                    description: 'Líneas del albarán (obligatorio)',
                    items: {
                        type: 'object',
                        properties: {
                            referencia: { type: 'string', description: 'Referencia del producto' },
                            descripcion: { type: 'string', description: 'Descripción' },
                            cantidad: { type: 'number', description: 'Cantidad' },
                            pvpunitario: { type: 'number', description: 'Precio unitario' },
                            dtopor: { type: 'number', description: 'Descuento en porcentaje' },
                            codimpuesto: { type: 'string', description: 'Código de impuesto' },
                            coste: { type: 'number', description: 'Precio de coste de la línea' },
                            orden: { type: 'number', description: 'Orden de la línea en el documento' },
                            actualizastock: { type: 'boolean', description: 'Si actualiza el stock al registrar' },
                            servido: { type: 'number', description: 'Cantidad ya servida' },
                            mostrar_cantidad: { type: 'boolean', description: 'Mostrar cantidad en impresión' },
                            mostrar_precio: { type: 'boolean', description: 'Mostrar precio en impresión' },
                            salto_pagina: { type: 'boolean', description: 'Insertar salto de página tras esta línea' },
                        },
                    },
                },
                fecha: { type: 'string', description: 'Fecha (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de serie' },
                codalmacen: { type: 'string', description: 'Código de almacén' },
                observaciones: { type: 'string', description: 'Observaciones' },
                numero2: { type: 'string', description: 'Número externo' },
                codagente: { type: 'string', description: 'Código de agente comercial' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                dtopor1: { type: 'number', description: 'Descuento porcentual nivel 1' },
                dtopor2: { type: 'number', description: 'Descuento porcentual nivel 2' },
                irpf: { type: 'number', description: 'Porcentaje de retención IRPF' },
                nombrecliente: { type: 'string', description: 'Nombre del cliente en el documento' },
                cifnif: { type: 'string', description: 'CIF/NIF en el documento' },
                direccion: { type: 'string', description: 'Dirección de envío' },
                apartado: { type: 'string', description: 'Apartado de correos' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                codpais: { type: 'string', description: 'Código de país' },
                idcontactoenv: { type: 'number', description: 'ID del contacto de envío' },
                idcontactofact: { type: 'number', description: 'ID del contacto de facturación' },
            },
            required: ['connection', 'codcliente', 'lineas'],
        },
    },
    {
        name: 'delete_albaran_cliente',
        description: 'Elimina un albarán de cliente. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del albarán (idalbaran)' },
            },
            required: ['connection', 'id'],
        },
    },
    // ── Pedidos de cliente ──
    {
        name: 'create_pedido_cliente',
        description: 'Crea un nuevo pedido de cliente en FacturaScripts usando el endpoint /crearPedidoCliente',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcliente: { type: 'string', description: 'Código del cliente (obligatorio)' },
                lineas: {
                    type: 'array',
                    description: 'Líneas del pedido (obligatorio)',
                    items: {
                        type: 'object',
                        properties: {
                            referencia: { type: 'string', description: 'Referencia del producto' },
                            descripcion: { type: 'string', description: 'Descripción' },
                            cantidad: { type: 'number', description: 'Cantidad' },
                            pvpunitario: { type: 'number', description: 'Precio unitario' },
                            dtopor: { type: 'number', description: 'Descuento en porcentaje' },
                            codimpuesto: { type: 'string', description: 'Código de impuesto' },
                            coste: { type: 'number', description: 'Precio de coste de la línea' },
                            orden: { type: 'number', description: 'Orden de la línea en el documento' },
                            actualizastock: { type: 'boolean', description: 'Si actualiza el stock al registrar' },
                            servido: { type: 'number', description: 'Cantidad ya servida' },
                            mostrar_cantidad: { type: 'boolean', description: 'Mostrar cantidad en impresión' },
                            mostrar_precio: { type: 'boolean', description: 'Mostrar precio en impresión' },
                            salto_pagina: { type: 'boolean', description: 'Insertar salto de página tras esta línea' },
                        },
                    },
                },
                fecha: { type: 'string', description: 'Fecha (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de serie' },
                codalmacen: { type: 'string', description: 'Código de almacén' },
                observaciones: { type: 'string', description: 'Observaciones' },
                numero2: { type: 'string', description: 'Número externo' },
                codagente: { type: 'string', description: 'Código de agente comercial' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                dtopor1: { type: 'number', description: 'Descuento porcentual nivel 1' },
                dtopor2: { type: 'number', description: 'Descuento porcentual nivel 2' },
                irpf: { type: 'number', description: 'Porcentaje de retención IRPF' },
                nombrecliente: { type: 'string', description: 'Nombre del cliente en el documento' },
                cifnif: { type: 'string', description: 'CIF/NIF en el documento' },
                direccion: { type: 'string', description: 'Dirección de envío' },
                apartado: { type: 'string', description: 'Apartado de correos' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                codpais: { type: 'string', description: 'Código de país' },
                idcontactoenv: { type: 'number', description: 'ID del contacto de envío' },
                idcontactofact: { type: 'number', description: 'ID del contacto de facturación' },
                finoferta: { type: 'string', description: 'Fecha de fin de validez del pedido (YYYY-MM-DD)' },
            },
            required: ['connection', 'codcliente', 'lineas'],
        },
    },
    {
        name: 'delete_pedido_cliente',
        description: 'Elimina un pedido de cliente. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del pedido (idpedido)' },
            },
            required: ['connection', 'id'],
        },
    },
    // ── Presupuestos de cliente ──
    {
        name: 'create_presupuesto_cliente',
        description: 'Crea un nuevo presupuesto de cliente en FacturaScripts usando el endpoint /crearPresupuestoCliente',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcliente: { type: 'string', description: 'Código del cliente (obligatorio)' },
                lineas: {
                    type: 'array',
                    description: 'Líneas del presupuesto (obligatorio)',
                    items: {
                        type: 'object',
                        properties: {
                            referencia: { type: 'string', description: 'Referencia del producto' },
                            descripcion: { type: 'string', description: 'Descripción' },
                            cantidad: { type: 'number', description: 'Cantidad' },
                            pvpunitario: { type: 'number', description: 'Precio unitario' },
                            dtopor: { type: 'number', description: 'Descuento en porcentaje' },
                            codimpuesto: { type: 'string', description: 'Código de impuesto' },
                            coste: { type: 'number', description: 'Precio de coste de la línea' },
                            orden: { type: 'number', description: 'Orden de la línea en el documento' },
                            actualizastock: { type: 'boolean', description: 'Si actualiza el stock al registrar' },
                            servido: { type: 'number', description: 'Cantidad ya servida' },
                            mostrar_cantidad: { type: 'boolean', description: 'Mostrar cantidad en impresión' },
                            mostrar_precio: { type: 'boolean', description: 'Mostrar precio en impresión' },
                            salto_pagina: { type: 'boolean', description: 'Insertar salto de página tras esta línea' },
                        },
                    },
                },
                fecha: { type: 'string', description: 'Fecha (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de serie' },
                codalmacen: { type: 'string', description: 'Código de almacén' },
                observaciones: { type: 'string', description: 'Observaciones' },
                numero2: { type: 'string', description: 'Número externo' },
                codagente: { type: 'string', description: 'Código de agente comercial' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                dtopor1: { type: 'number', description: 'Descuento porcentual nivel 1' },
                dtopor2: { type: 'number', description: 'Descuento porcentual nivel 2' },
                irpf: { type: 'number', description: 'Porcentaje de retención IRPF' },
                nombrecliente: { type: 'string', description: 'Nombre del cliente en el documento' },
                cifnif: { type: 'string', description: 'CIF/NIF en el documento' },
                direccion: { type: 'string', description: 'Dirección de envío' },
                apartado: { type: 'string', description: 'Apartado de correos' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                codpais: { type: 'string', description: 'Código de país' },
                idcontactoenv: { type: 'number', description: 'ID del contacto de envío' },
                idcontactofact: { type: 'number', description: 'ID del contacto de facturación' },
                finoferta: { type: 'string', description: 'Fecha de fin de validez del presupuesto (YYYY-MM-DD)' },
            },
            required: ['connection', 'codcliente', 'lineas'],
        },
    },
    {
        name: 'delete_presupuesto_cliente',
        description: 'Elimina un presupuesto de cliente. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del presupuesto (idpresupuesto)' },
            },
            required: ['connection', 'id'],
        },
    },
    // ── Actualizar documentos de cliente ──
    {
        name: 'update_factura_cliente',
        description: 'Actualiza los datos de cabecera de una factura de cliente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idfactura: { type: 'number', description: 'ID de la factura a actualizar (obligatorio)' },
                codcliente: { type: 'string', description: 'Código del cliente' },
                cifnif: { type: 'string', description: 'CIF/NIF del cliente' },
                nombrecliente: { type: 'string', description: 'Nombre del cliente' },
                fecha: { type: 'string', description: 'Fecha de la factura (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de la serie' },
                codpago: { type: 'string', description: 'Código de la forma de pago' },
                observaciones: { type: 'string', description: 'Observaciones' },
                codagente: { type: 'string', description: 'Código del agente' },
                codigoenv: { type: 'string', description: 'Código de envío' },
            },
            required: ['connection', 'idfactura'],
        },
    },
    {
        name: 'update_albaran_cliente',
        description: 'Actualiza los datos de cabecera de un albarán de cliente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idalbaran: { type: 'number', description: 'ID del albarán a actualizar (obligatorio)' },
                codcliente: { type: 'string', description: 'Código del cliente' },
                nombrecliente: { type: 'string', description: 'Nombre del cliente' },
                fecha: { type: 'string', description: 'Fecha del albarán (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de la serie' },
                codpago: { type: 'string', description: 'Código de la forma de pago' },
                observaciones: { type: 'string', description: 'Observaciones' },
                codagente: { type: 'string', description: 'Código del agente' },
            },
            required: ['connection', 'idalbaran'],
        },
    },
    {
        name: 'update_pedido_cliente',
        description: 'Actualiza los datos de cabecera de un pedido de cliente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idpedido: { type: 'number', description: 'ID del pedido a actualizar (obligatorio)' },
                codcliente: { type: 'string', description: 'Código del cliente' },
                nombrecliente: { type: 'string', description: 'Nombre del cliente' },
                fecha: { type: 'string', description: 'Fecha del pedido (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de la serie' },
                codpago: { type: 'string', description: 'Código de la forma de pago' },
                observaciones: { type: 'string', description: 'Observaciones' },
                codagente: { type: 'string', description: 'Código del agente' },
            },
            required: ['connection', 'idpedido'],
        },
    },
    {
        name: 'update_presupuesto_cliente',
        description: 'Actualiza los datos de cabecera de un presupuesto de cliente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idpresupuesto: { type: 'number', description: 'ID del presupuesto a actualizar (obligatorio)' },
                codcliente: { type: 'string', description: 'Código del cliente' },
                nombrecliente: { type: 'string', description: 'Nombre del cliente' },
                fecha: { type: 'string', description: 'Fecha del presupuesto (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de la serie' },
                codpago: { type: 'string', description: 'Código de la forma de pago' },
                observaciones: { type: 'string', description: 'Observaciones' },
                codagente: { type: 'string', description: 'Código del agente' },
                fechafin: { type: 'string', description: 'Fecha de fin de validez (YYYY-MM-DD)' },
            },
            required: ['connection', 'idpresupuesto'],
        },
    },
];
/**
 * Register all sales orders tools with the MCP server
 */
export async function registerSalesOrdersTools(tools) {
    salesOrdersTools.forEach((tool) => tools.set(tool.name, tool));
    salesOrdersWriteTools.forEach((tool) => tools.set(tool.name, tool));
}
/**
 * Handle sales orders tool calls
 */
export async function handleSalesOrdersTool(name, args) {
    const input = args;
    switch (name) {
        case 'get_presupuestoclientes': {
            const params = input;
            const result = await fsClient.get('/presupuestoclientes', {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                fecha: params.fecha,
                estado: params.estado,
                codserie: params.codserie,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_lineapresupuestoclientes': {
            const params = input;
            const result = await fsClient.get('/lineapresupuestoclientes', {
                offset: params.offset,
                limit: params.limit,
                idpresupuesto: params.idpresupuesto,
                referencia: params.referencia,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pedidoclientes': {
            const params = input;
            const result = await fsClient.get('/pedidoclientes', {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                fecha: params.fecha,
                estado: params.estado,
                codserie: params.codserie,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_lineapedidoclientes': {
            const params = input;
            const result = await fsClient.get('/lineapedidoclientes', {
                offset: params.offset,
                limit: params.limit,
                idpedido: params.idpedido,
                referencia: params.referencia,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_albaranclientes': {
            const params = input;
            const result = await fsClient.get('/albaranclientes', {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                fecha: params.fecha,
                codserie: params.codserie,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_lineaalbaranclientes': {
            const params = input;
            const result = await fsClient.get('/lineaalbaranclientes', {
                offset: params.offset,
                limit: params.limit,
                idalbaran: params.idalbaran,
                referencia: params.referencia,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_facturaclientes': {
            const params = input;
            const result = await fsClient.get('/facturaclientes', {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                fecha: params.fecha,
                pagada: params.pagada,
                anulada: params.anulada,
                codserie: params.codserie,
                codejercicio: params.codejercicio,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_lineafacturaclientes': {
            const params = input;
            const result = await fsClient.get('/lineafacturaclientes', {
                offset: params.offset,
                limit: params.limit,
                idfactura: params.idfactura,
                referencia: params.referencia,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_reciboclientes': {
            const params = input;
            const result = await fsClient.get('/reciboclientes', {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                fecha: params.fecha,
                pagado: params.pagado,
                vencimiento: params.vencimiento,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pagoclientes': {
            const params = input;
            const result = await fsClient.get('/pagoclientes', {
                offset: params.offset,
                limit: params.limit,
                idrecibo: params.idrecibo,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'create_factura_cliente': {
            const params = input;
            const { connection, lineas, ...rest } = params;
            const body = { ...rest, lineas: JSON.stringify(lineas) };
            const result = await fsClient.post('/crearFacturaCliente', body, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_factura_cliente': {
            const params = input;
            const result = await fsClient.delete(`/facturaclientes/${params.id}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_albaran_cliente': {
            const params = input;
            const { connection, lineas, ...rest } = params;
            const body = { ...rest, lineas: JSON.stringify(lineas) };
            const result = await fsClient.post('/crearAlbaranCliente', body, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_albaran_cliente': {
            const params = input;
            const result = await fsClient.delete(`/albaranclientes/${params.id}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_pedido_cliente': {
            const params = input;
            const { connection, lineas, ...rest } = params;
            const body = { ...rest, lineas: JSON.stringify(lineas) };
            const result = await fsClient.post('/crearPedidoCliente', body, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_pedido_cliente': {
            const params = input;
            const result = await fsClient.delete(`/pedidoclientes/${params.id}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_presupuesto_cliente': {
            const params = input;
            const { connection, lineas, ...rest } = params;
            const body = { ...rest, lineas: JSON.stringify(lineas) };
            const result = await fsClient.post('/crearPresupuestoCliente', body, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_presupuesto_cliente': {
            const params = input;
            const result = await fsClient.delete(`/presupuestoclientes/${params.id}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'get_cuentabancoclientes': {
            const params = input;
            const result = await fsClient.get('/cuentabancoclientes', {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'update_factura_cliente': {
            const params = input;
            const { connection, idfactura, ...data } = params;
            const result = await fsClient.put(`/facturascli/${idfactura}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_albaran_cliente': {
            const params = input;
            const { connection, idalbaran, ...data } = params;
            const result = await fsClient.put(`/albaranescli/${idalbaran}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_pedido_cliente': {
            const params = input;
            const { connection, idpedido, ...data } = params;
            const result = await fsClient.put(`/pedidoscli/${idpedido}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_presupuesto_cliente': {
            const params = input;
            const { connection, idpresupuesto, ...data } = params;
            const result = await fsClient.put(`/presupuestoscli/${idpresupuesto}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        default:
            return null;
    }
}
//# sourceMappingURL=index.js.map