import { fsClient } from '../../fs/client.js';
export const purchasingTools = [
    {
        name: 'get_presupuestoproveedores',
        description: 'Obtiene presupuestos de proveedores con filtros opcionales de código de proveedor, fecha y estado',
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
                codproveedor: {
                    type: 'string',
                    description: 'Código del proveedor a filtrar',
                },
                fecha: {
                    type: 'string',
                    description: 'Fecha para filtrar (formato YYYY-MM-DD)',
                },
                estado: {
                    type: 'string',
                    description: 'Estado del presupuesto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineapresupuestoproveedores',
        description: 'Obtiene líneas de presupuestos de proveedores filtradas por ID de presupuesto',
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
                idpresupuesto: {
                    type: 'string',
                    description: 'ID del presupuesto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_pedidoproveedores',
        description: 'Obtiene pedidos de proveedores con filtros opcionales de código de proveedor, fecha y estado',
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
                codproveedor: {
                    type: 'string',
                    description: 'Código del proveedor a filtrar',
                },
                fecha: {
                    type: 'string',
                    description: 'Fecha para filtrar (formato YYYY-MM-DD)',
                },
                estado: {
                    type: 'string',
                    description: 'Estado del pedido',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineapedidoproveedores',
        description: 'Obtiene líneas de pedidos de proveedores filtradas por ID de pedido',
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
                idpedido: {
                    type: 'string',
                    description: 'ID del pedido',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_albaranproveedores',
        description: 'Obtiene albaranes de proveedores con filtros opcionales',
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
                codproveedor: {
                    type: 'string',
                    description: 'Código del proveedor a filtrar',
                },
                fecha: {
                    type: 'string',
                    description: 'Fecha para filtrar (formato YYYY-MM-DD)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineaalbaranproveedores',
        description: 'Obtiene líneas de albaranes de proveedores filtradas por ID',
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
                idalbaran: {
                    type: 'string',
                    description: 'ID del albarán',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_facturaproveedores',
        description: 'Obtiene facturas de proveedores con filtros opcionales de código de proveedor, fecha, estado de pago y ejercicio',
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
                codproveedor: {
                    type: 'string',
                    description: 'Código del proveedor a filtrar',
                },
                fecha: {
                    type: 'string',
                    description: 'Fecha para filtrar (formato YYYY-MM-DD)',
                },
                pagada: {
                    type: 'boolean',
                    description: 'Si está pagada o no',
                },
                codejercicio: {
                    type: 'string',
                    description: 'Código del ejercicio',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineafacturaproveedores',
        description: 'Obtiene líneas de facturas de proveedores filtradas por ID de factura',
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
                idfactura: {
                    type: 'string',
                    description: 'ID de la factura',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_reciboproveedores',
        description: 'Obtiene recibos de proveedores con filtros opcionales',
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
                codproveedor: {
                    type: 'string',
                    description: 'Código del proveedor a filtrar',
                },
                fecha: {
                    type: 'string',
                    description: 'Fecha para filtrar (formato YYYY-MM-DD)',
                },
                pagado: {
                    type: 'boolean',
                    description: 'Si está pagado o no',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_pagoproveedores',
        description: 'Obtiene pagos de proveedores filtrados por ID de recibo',
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
                idrecibo: {
                    type: 'string',
                    description: 'ID del recibo',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_cuentabancoproveedores',
        description: 'Obtiene cuentas bancarias de proveedores con filtros opcionales',
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
                codproveedor: {
                    type: 'string',
                    description: 'Código del proveedor a filtrar',
                },
            },
            required: ['connection'],
        },
    },
];
export const purchasingWriteTools = [
    // ── Facturas de proveedor ──
    {
        name: 'create_factura_proveedor',
        description: 'Crea una nueva factura de proveedor en FacturaScripts usando el endpoint /crearFacturaProveedor',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codproveedor: { type: 'string', description: 'Código del proveedor (obligatorio)' },
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
                            codimpuesto: { type: 'string', description: 'Código de impuesto' },
                            dtopor2: { type: 'number', description: 'Segundo descuento en porcentaje' },
                            excepcioniva: { type: 'string', description: 'Excepción de IVA' },
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
                numproveedor: { type: 'string', description: 'Número de factura del proveedor' },
                pagada: { type: 'boolean', description: 'Marcar la factura como pagada al crearla' },
                nombre: { type: 'string', description: 'Nombre del proveedor en el documento' },
                cifnif: { type: 'string', description: 'CIF/NIF en el documento' },
                codagente: { type: 'string', description: 'Código de agente' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                dtopor1: { type: 'number', description: 'Descuento porcentual nivel 1' },
                dtopor2: { type: 'number', description: 'Descuento porcentual nivel 2' },
                irpf: { type: 'number', description: 'Porcentaje de retención IRPF' },
                direccion: { type: 'string', description: 'Dirección' },
                apartado: { type: 'string', description: 'Apartado de correos' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                codpais: { type: 'string', description: 'Código de país' },
            },
            required: ['connection', 'codproveedor', 'lineas'],
        },
    },
    {
        name: 'delete_factura_proveedor',
        description: 'Elimina una factura de proveedor. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID de la factura (idfactura)' },
            },
            required: ['connection', 'id'],
        },
    },
    // ── Albaranes de proveedor ──
    {
        name: 'create_albaran_proveedor',
        description: 'Crea un nuevo albarán de proveedor en FacturaScripts usando el endpoint /crearAlbaranProveedor',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codproveedor: { type: 'string', description: 'Código del proveedor (obligatorio)' },
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
                            dtopor2: { type: 'number', description: 'Segundo descuento en porcentaje' },
                            codimpuesto: { type: 'string', description: 'Código de impuesto' },
                            excepcioniva: { type: 'string', description: 'Excepción de IVA' },
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
                numproveedor: { type: 'string', description: 'Número externo del proveedor' },
                nombre: { type: 'string', description: 'Nombre del proveedor en el documento' },
                cifnif: { type: 'string', description: 'CIF/NIF en el documento' },
                codagente: { type: 'string', description: 'Código de agente' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                dtopor1: { type: 'number', description: 'Descuento porcentual nivel 1' },
                dtopor2: { type: 'number', description: 'Descuento porcentual nivel 2' },
                irpf: { type: 'number', description: 'Porcentaje de retención IRPF' },
                direccion: { type: 'string', description: 'Dirección' },
                apartado: { type: 'string', description: 'Apartado de correos' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                codpais: { type: 'string', description: 'Código de país' },
            },
            required: ['connection', 'codproveedor', 'lineas'],
        },
    },
    {
        name: 'delete_albaran_proveedor',
        description: 'Elimina un albarán de proveedor. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del albarán (idalbaran)' },
            },
            required: ['connection', 'id'],
        },
    },
    // ── Pedidos de proveedor ──
    {
        name: 'create_pedido_proveedor',
        description: 'Crea un nuevo pedido de proveedor en FacturaScripts usando el endpoint /crearPedidoProveedor',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codproveedor: { type: 'string', description: 'Código del proveedor (obligatorio)' },
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
                            dtopor2: { type: 'number', description: 'Segundo descuento en porcentaje' },
                            codimpuesto: { type: 'string', description: 'Código de impuesto' },
                            excepcioniva: { type: 'string', description: 'Excepción de IVA' },
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
                numproveedor: { type: 'string', description: 'Número externo del proveedor' },
                nombre: { type: 'string', description: 'Nombre del proveedor en el documento' },
                cifnif: { type: 'string', description: 'CIF/NIF en el documento' },
                codagente: { type: 'string', description: 'Código de agente' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                dtopor1: { type: 'number', description: 'Descuento porcentual nivel 1' },
                dtopor2: { type: 'number', description: 'Descuento porcentual nivel 2' },
                irpf: { type: 'number', description: 'Porcentaje de retención IRPF' },
                direccion: { type: 'string', description: 'Dirección' },
                apartado: { type: 'string', description: 'Apartado de correos' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                codpais: { type: 'string', description: 'Código de país' },
                finoferta: { type: 'string', description: 'Fecha de fin de validez del pedido (YYYY-MM-DD)' },
            },
            required: ['connection', 'codproveedor', 'lineas'],
        },
    },
    {
        name: 'delete_pedido_proveedor',
        description: 'Elimina un pedido de proveedor. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del pedido (idpedido)' },
            },
            required: ['connection', 'id'],
        },
    },
    // ── Presupuestos de proveedor ──
    {
        name: 'create_presupuesto_proveedor',
        description: 'Crea un nuevo presupuesto de proveedor en FacturaScripts usando el endpoint /crearPresupuestoProveedor',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codproveedor: { type: 'string', description: 'Código del proveedor (obligatorio)' },
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
                            dtopor2: { type: 'number', description: 'Segundo descuento en porcentaje' },
                            codimpuesto: { type: 'string', description: 'Código de impuesto' },
                            excepcioniva: { type: 'string', description: 'Excepción de IVA' },
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
                numproveedor: { type: 'string', description: 'Número externo del proveedor' },
                nombre: { type: 'string', description: 'Nombre del proveedor en el documento' },
                cifnif: { type: 'string', description: 'CIF/NIF en el documento' },
                codagente: { type: 'string', description: 'Código de agente' },
                codpago: { type: 'string', description: 'Código de forma de pago' },
                dtopor1: { type: 'number', description: 'Descuento porcentual nivel 1' },
                dtopor2: { type: 'number', description: 'Descuento porcentual nivel 2' },
                irpf: { type: 'number', description: 'Porcentaje de retención IRPF' },
                direccion: { type: 'string', description: 'Dirección' },
                apartado: { type: 'string', description: 'Apartado de correos' },
                ciudad: { type: 'string', description: 'Ciudad' },
                codpostal: { type: 'string', description: 'Código postal' },
                codpais: { type: 'string', description: 'Código de país' },
                finoferta: { type: 'string', description: 'Fecha de fin de validez del presupuesto (YYYY-MM-DD)' },
            },
            required: ['connection', 'codproveedor', 'lineas'],
        },
    },
    {
        name: 'delete_presupuesto_proveedor',
        description: 'Elimina un presupuesto de proveedor. Precaución: operación irreversible.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del presupuesto (idpresupuesto)' },
            },
            required: ['connection', 'id'],
        },
    },
    // ── Actualizar documentos de proveedor ──
    {
        name: 'update_factura_proveedor',
        description: 'Actualiza los datos de cabecera de una factura de proveedor en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idfactura: { type: 'number', description: 'ID de la factura a actualizar (obligatorio)' },
                codproveedor: { type: 'string', description: 'Código del proveedor' },
                cifnif: { type: 'string', description: 'CIF/NIF del proveedor' },
                nombre: { type: 'string', description: 'Nombre del proveedor' },
                fecha: { type: 'string', description: 'Fecha de la factura (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de la serie' },
                codpago: { type: 'string', description: 'Código de la forma de pago' },
                observaciones: { type: 'string', description: 'Observaciones' },
                numproveedor: { type: 'string', description: 'Número de factura del proveedor' },
            },
            required: ['connection', 'idfactura'],
        },
    },
    {
        name: 'update_albaran_proveedor',
        description: 'Actualiza los datos de cabecera de un albarán de proveedor en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idalbaran: { type: 'number', description: 'ID del albarán a actualizar (obligatorio)' },
                codproveedor: { type: 'string', description: 'Código del proveedor' },
                nombre: { type: 'string', description: 'Nombre del proveedor' },
                fecha: { type: 'string', description: 'Fecha del albarán (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de la serie' },
                codpago: { type: 'string', description: 'Código de la forma de pago' },
                observaciones: { type: 'string', description: 'Observaciones' },
                numproveedor: { type: 'string', description: 'Número de albarán del proveedor' },
            },
            required: ['connection', 'idalbaran'],
        },
    },
    {
        name: 'update_pedido_proveedor',
        description: 'Actualiza los datos de cabecera de un pedido a proveedor en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idpedido: { type: 'number', description: 'ID del pedido a actualizar (obligatorio)' },
                codproveedor: { type: 'string', description: 'Código del proveedor' },
                nombre: { type: 'string', description: 'Nombre del proveedor' },
                fecha: { type: 'string', description: 'Fecha del pedido (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de la serie' },
                codpago: { type: 'string', description: 'Código de la forma de pago' },
                observaciones: { type: 'string', description: 'Observaciones' },
            },
            required: ['connection', 'idpedido'],
        },
    },
    {
        name: 'update_presupuesto_proveedor',
        description: 'Actualiza los datos de cabecera de un presupuesto a proveedor en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idpresupuesto: { type: 'number', description: 'ID del presupuesto a actualizar (obligatorio)' },
                codproveedor: { type: 'string', description: 'Código del proveedor' },
                nombre: { type: 'string', description: 'Nombre del proveedor' },
                fecha: { type: 'string', description: 'Fecha del presupuesto (YYYY-MM-DD)' },
                codserie: { type: 'string', description: 'Código de la serie' },
                codpago: { type: 'string', description: 'Código de la forma de pago' },
                observaciones: { type: 'string', description: 'Observaciones' },
            },
            required: ['connection', 'idpresupuesto'],
        },
    },
    // ── Cuentas bancarias de proveedores ──
    {
        name: 'get_cuentabancoproveedores',
        description: 'Obtiene las cuentas bancarias de un proveedor en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                offset: { type: 'number', description: 'Offset de paginación (por defecto: 0)' },
                limit: { type: 'number', description: 'Límite de resultados (por defecto: 100)' },
                codproveedor: { type: 'string', description: 'Filtrar por código de proveedor' },
            },
            required: [],
        },
    },
    {
        name: 'create_cuentabancoproveedor',
        description: 'Crea una nueva cuenta bancaria de proveedor en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codproveedor: { type: 'string', description: 'Código del proveedor (obligatorio)' },
                iban: { type: 'string', description: 'IBAN de la cuenta (obligatorio)' },
                swift: { type: 'string', description: 'Código SWIFT/BIC' },
                descripcion: { type: 'string', description: 'Descripción de la cuenta' },
                principal: { type: 'boolean', description: 'Si es la cuenta principal' },
            },
            required: ['codproveedor', 'iban'],
        },
    },
    {
        name: 'update_cuentabancoproveedor',
        description: 'Actualiza una cuenta bancaria de proveedor existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codcuenta: { type: 'string', description: 'Código de la cuenta a actualizar (obligatorio)' },
                codproveedor: { type: 'string', description: 'Código del proveedor' },
                iban: { type: 'string', description: 'IBAN de la cuenta' },
                swift: { type: 'string', description: 'Código SWIFT/BIC' },
                descripcion: { type: 'string', description: 'Descripción de la cuenta' },
                principal: { type: 'boolean', description: 'Si es la cuenta principal' },
            },
            required: ['codcuenta'],
        },
    },
    {
        name: 'delete_cuentabancoproveedor',
        description: 'Elimina una cuenta bancaria de proveedor de FacturaScripts',
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
 * Register all purchasing tools with the MCP server
 */
export async function registerPurchasingTools(tools) {
    purchasingTools.forEach((tool) => tools.set(tool.name, tool));
    purchasingWriteTools.forEach((tool) => tools.set(tool.name, tool));
}
/**
 * Handle purchasing tool calls
 */
export async function handlePurchasingTool(name, args) {
    const input = args;
    switch (name) {
        case 'get_presupuestoproveedores': {
            const params = input;
            const result = await fsClient.get('/presupuestoproveedores', {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                fecha: params.fecha,
                estado: params.estado,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_lineapresupuestoproveedores': {
            const params = input;
            const result = await fsClient.get('/lineapresupuestoproveedores', {
                offset: params.offset,
                limit: params.limit,
                idpresupuesto: params.idpresupuesto,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pedidoproveedores': {
            const params = input;
            const result = await fsClient.get('/pedidoproveedores', {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                fecha: params.fecha,
                estado: params.estado,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_lineapedidoproveedores': {
            const params = input;
            const result = await fsClient.get('/lineapedidoproveedores', {
                offset: params.offset,
                limit: params.limit,
                idpedido: params.idpedido,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_albaranproveedores': {
            const params = input;
            const result = await fsClient.get('/albaranproveedores', {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                fecha: params.fecha,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_lineaalbaranproveedores': {
            const params = input;
            const result = await fsClient.get('/lineaalbaranproveedores', {
                offset: params.offset,
                limit: params.limit,
                idalbaran: params.idalbaran,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_facturaproveedores': {
            const params = input;
            const result = await fsClient.get('/facturaproveedores', {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                fecha: params.fecha,
                pagada: params.pagada,
                codejercicio: params.codejercicio,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_lineafacturaproveedores': {
            const params = input;
            const result = await fsClient.get('/lineafacturaproveedores', {
                offset: params.offset,
                limit: params.limit,
                idfactura: params.idfactura,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_reciboproveedores': {
            const params = input;
            const result = await fsClient.get('/reciboproveedores', {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                fecha: params.fecha,
                pagado: params.pagado,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_pagoproveedores': {
            const params = input;
            const result = await fsClient.get('/pagoproveedores', {
                offset: params.offset,
                limit: params.limit,
                idrecibo: params.idrecibo,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_cuentabancoproveedores': {
            const params = input;
            const result = await fsClient.get('/cuentabancoproveedores', {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'create_factura_proveedor': {
            const params = input;
            const { connection, lineas, ...rest } = params;
            const body = { ...rest, lineas: JSON.stringify(lineas) };
            const result = await fsClient.post('/crearFacturaProveedor', body, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_factura_proveedor': {
            const params = input;
            const result = await fsClient.delete(`/facturaproveedores/${params.id}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_albaran_proveedor': {
            const params = input;
            const { connection, lineas, ...rest } = params;
            const body = { ...rest, lineas: JSON.stringify(lineas) };
            const result = await fsClient.post('/crearAlbaranProveedor', body, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_albaran_proveedor': {
            const params = input;
            const result = await fsClient.delete(`/albaranproveedores/${params.id}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_pedido_proveedor': {
            const params = input;
            const { connection, lineas, ...rest } = params;
            const body = { ...rest, lineas: JSON.stringify(lineas) };
            const result = await fsClient.post('/crearPedidoProveedor', body, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_pedido_proveedor': {
            const params = input;
            const result = await fsClient.delete(`/pedidoproveedores/${params.id}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_presupuesto_proveedor': {
            const params = input;
            const { connection, lineas, ...rest } = params;
            const body = { ...rest, lineas: JSON.stringify(lineas) };
            const result = await fsClient.post('/crearPresupuestoProveedor', body, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_presupuesto_proveedor': {
            const params = input;
            const result = await fsClient.delete(`/presupuestoproveedores/${params.id}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_factura_proveedor': {
            const params = input;
            const { connection, idfactura, ...data } = params;
            const result = await fsClient.put(`/facturasprov/${idfactura}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_albaran_proveedor': {
            const params = input;
            const { connection, idalbaran, ...data } = params;
            const result = await fsClient.put(`/albaranesprov/${idalbaran}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_pedido_proveedor': {
            const params = input;
            const { connection, idpedido, ...data } = params;
            const result = await fsClient.put(`/pedidosprov/${idpedido}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_presupuesto_proveedor': {
            const params = input;
            const { connection, idpresupuesto, ...data } = params;
            const result = await fsClient.put(`/presupuestosprov/${idpresupuesto}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'get_cuentabancoproveedores': {
            const params = input;
            const queryParams = {
                offset: params.offset || 0,
                limit: params.limit || 100,
            };
            if (params.codproveedor)
                queryParams.codproveedor = params.codproveedor;
            const result = await fsClient.get('/cuentabancoproveedores', queryParams, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_cuentabancoproveedor': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/cuentabancoproveedores', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_cuentabancoproveedor': {
            const params = input;
            const { connection, codcuenta, ...data } = params;
            const result = await fsClient.put(`/cuentabancoproveedores/${codcuenta}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_cuentabancoproveedor': {
            const params = input;
            const result = await fsClient.delete(`/cuentabancoproveedores/${params.codcuenta}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        default:
            return null;
    }
}
//# sourceMappingURL=index.js.map