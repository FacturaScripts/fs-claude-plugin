/**
 * Generador de metadata de modelos de FacturaScripts.
 *
 * Soporta dos modos:
 *
 *   1. Modo CORE (por defecto): lee Core/Table/*.xml, Core/XMLView/*.xml,
 *      Core/Translation/es_ES.json y escribe TS en server/src/metadata/models/.
 *      Estos archivos se commitean en el repo del MCP.
 *
 *      Uso:
 *        npm run generate:metadata -- --fs-path=/ruta/a/facturascripts [--only=cliente,producto]
 *
 *   2. Modo PLUGIN: genera metadata para los modelos de un plugin de FS y la
 *      escribe como JS en la ruta de módulos privados del usuario. Cada
 *      módulo privado pasa a tener un metadata.js que su index.js puede
 *      reexportar como `export const modelMetadata = [...]` para que el MCP
 *      lo registre dinámicamente al arrancar.
 *
 *      Uso (manifest):
 *        npm run generate:metadata -- --manifest=/ruta/manifest.json
 *
 *      Estructura del manifest.json:
 *        {
 *          "moduleName": "forja",
 *          "fsPath": "/Users/.../facturascripts",
 *          "pluginPath": "/Users/.../facturascripts/Plugins/Forja",
 *          "outputBase": "/Users/.../fs-mcp-modules-private",
 *          "models": [
 *            { "name": "task", "outputDir": "tasks", "table": "tasks",
 *              "endpoint": "/tasks", "editView": "CardTask",
 *              "description": "Tarea del plugin Forja..." }
 *          ]
 *        }
 *      Por cada modelo se escribe `<outputBase>/<outputDir>/metadata.js`.
 */

import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
    ColumnMetadata,
    ForeignKey,
    ModelMetadata,
    Relation,
    TsType,
    WidgetType,
} from '../metadata/types.js';

// ───────────────────────────────────────────────────────────────────────────
// Catálogo de modelos soportados
// ───────────────────────────────────────────────────────────────────────────

interface ModelEntry {
    /** Nombre del modelo en singular, snake_case. */
    name: string;
    /** Nombre físico de la tabla en la base de datos. */
    table: string;
    /** Endpoint REST en la API. */
    endpoint: string;
    /** Nombre de la XMLView de edición (sin ".xml"); opcional. */
    editView?: string;
    /** Descripción funcional del modelo. */
    description: string;
}

/**
 * Catálogo completo de los 83 modelos del core de FacturaScripts.
 * Cada entrada mapea un modelo a su tabla, endpoint REST y XMLView de edición.
 */
const MODEL_CATALOG: ModelEntry[] = [
    // ── Datos maestros ──────────────────────────────────────────────
    {
        name: 'agencia_transporte',
        table: 'agenciastrans',
        endpoint: '/agenciatransportes',
        editView: 'EditAgenciaTransporte',
        description: 'Agencia de transporte usada para envíos. Asignable a documentos de venta y compra.',
    },
    {
        name: 'agente',
        table: 'agentes',
        endpoint: '/agentes',
        editView: 'EditAgente',
        description: 'Agente comercial con datos personales y comisión asociada. Vincula a clientes y documentos.',
    },
    {
        name: 'almacen',
        table: 'almacenes',
        endpoint: '/almacenes',
        editView: 'EditAlmacen',
        description: 'Almacén físico donde se gestiona stock de productos. Ligado a empresa y dirección.',
    },
    {
        name: 'cliente',
        table: 'clientes',
        endpoint: '/clientes',
        editView: 'EditCliente',
        description: 'Cliente de la empresa. Puede tener una o más direcciones y cuentas bancarias asociadas.',
    },
    {
        name: 'contacto',
        table: 'contactos',
        endpoint: '/contactos',
        editView: 'EditContacto',
        description: 'Persona de contacto con datos de dirección. Sirve como dirección de envío o facturación de clientes y proveedores.',
    },
    {
        name: 'empresa',
        table: 'empresas',
        endpoint: '/empresas',
        editView: 'EditEmpresa',
        description: 'Empresa propia del sistema. Puede haber varias en una misma instalación; cada documento pertenece a una.',
    },
    {
        name: 'fabricante',
        table: 'fabricantes',
        endpoint: '/fabricantes',
        editView: 'EditFabricante',
        description: 'Fabricante de productos. Catálogo simple de marca/proveedor de origen.',
    },
    {
        name: 'familia',
        table: 'familias',
        endpoint: '/familias',
        editView: 'EditFamilia',
        description: 'Familia o categoría de productos. Soporta jerarquía de familias padre/hijas.',
    },
    {
        name: 'grupo_clientes',
        table: 'gruposclientes',
        endpoint: '/grupoclientes',
        editView: 'EditGrupoClientes',
        description: 'Grupo de clientes. Permite agrupar clientes para reporting y descuentos.',
    },
    {
        name: 'producto',
        table: 'productos',
        endpoint: '/productos',
        editView: 'EditProducto',
        description: 'Producto del catálogo. Los productos pueden tener variantes, precios de compra/venta y control de stock.',
    },
    {
        name: 'producto_imagen',
        table: 'productos_imagenes',
        endpoint: '/productoimagenes',
        description: 'Imagen asociada a un producto o variante. Apunta a un attached_file.',
    },
    {
        name: 'producto_proveedor',
        table: 'productosprov',
        endpoint: '/productoproveedores',
        editView: 'EditProductoProveedor',
        description: 'Asociación entre un producto y un proveedor con su referencia, código de barras y precio de coste.',
    },
    {
        name: 'proveedor',
        table: 'proveedores',
        endpoint: '/proveedores',
        editView: 'EditProveedor',
        description: 'Proveedor de la empresa. Datos fiscales, dirección y condiciones de compra.',
    },
    {
        name: 'tarifa',
        table: 'tarifas',
        endpoint: '/tarifas',
        editView: 'EditTarifa',
        description: 'Tarifa de precios aplicable a clientes. Define márgenes o descuentos sobre el precio base.',
    },
    {
        name: 'variante',
        table: 'variantes',
        endpoint: '/variantes',
        editView: 'EditVariante',
        description: 'Variante de un producto (talla, color, etc.). Cada variante tiene su propia referencia, código de barras y precio.',
    },

    // ── Atributos de productos ─────────────────────────────────────
    {
        name: 'atributo',
        table: 'atributos',
        endpoint: '/atributos',
        editView: 'EditAtributo',
        description: 'Atributo configurable de productos (ej: talla, color). Agrupa los valores posibles.',
    },
    {
        name: 'atributo_valor',
        table: 'atributos_valores',
        endpoint: '/atributovalores',
        editView: 'EditAtributoValor',
        description: 'Valor concreto de un atributo (ej: rojo, XL). Se asigna a las variantes de productos.',
    },

    // ── Stock ──────────────────────────────────────────────────────
    {
        name: 'stock',
        table: 'stocks',
        endpoint: '/stocks',
        editView: 'EditStock',
        description: 'Existencias de una variante de producto en un almacén concreto.',
    },

    // ── Documentos de venta (cabeceras) ────────────────────────────
    {
        name: 'presupuesto_cliente',
        table: 'presupuestoscli',
        endpoint: '/presupuestoclientes',
        description: 'Presupuesto enviado a un cliente. Cabecera con totales; las líneas están en linea_presupuesto_cliente.',
    },
    {
        name: 'pedido_cliente',
        table: 'pedidoscli',
        endpoint: '/pedidoclientes',
        description: 'Pedido confirmado por un cliente. Cabecera con totales; las líneas están en linea_pedido_cliente.',
    },
    {
        name: 'albaran_cliente',
        table: 'albaranescli',
        endpoint: '/albaranclientes',
        description: 'Albarán/nota de entrega a un cliente. Cabecera con totales; las líneas están en linea_albaran_cliente.',
    },
    {
        name: 'factura_cliente',
        table: 'facturascli',
        endpoint: '/facturaclientes',
        description: 'Factura emitida a un cliente. Documento con cabecera y líneas, con totales, impuestos y estado contable.',
    },

    // ── Documentos de venta (líneas) ───────────────────────────────
    {
        name: 'linea_presupuesto_cliente',
        table: 'lineaspresupuestoscli',
        endpoint: '/lineapresupuestoclientes',
        description: 'Línea de un presupuesto de cliente. Producto, cantidad, precio y descuento.',
    },
    {
        name: 'linea_pedido_cliente',
        table: 'lineaspedidoscli',
        endpoint: '/lineapedidoclientes',
        description: 'Línea de un pedido de cliente. Producto, cantidad, precio y descuento.',
    },
    {
        name: 'linea_albaran_cliente',
        table: 'lineasalbaranescli',
        endpoint: '/lineaalbaranclientes',
        description: 'Línea de un albarán de cliente. Producto, cantidad servida, precio y descuento.',
    },
    {
        name: 'linea_factura_cliente',
        table: 'lineasfacturascli',
        endpoint: '/lineafacturaclientes',
        description: 'Línea de una factura de cliente. Producto, cantidad, precio, IVA y descuentos.',
    },

    // ── Documentos de compra (cabeceras) ───────────────────────────
    {
        name: 'presupuesto_proveedor',
        table: 'presupuestosprov',
        endpoint: '/presupuestoproveedores',
        description: 'Presupuesto recibido de un proveedor. Cabecera con totales.',
    },
    {
        name: 'pedido_proveedor',
        table: 'pedidosprov',
        endpoint: '/pedidoproveedores',
        description: 'Pedido realizado a un proveedor. Cabecera con totales.',
    },
    {
        name: 'albaran_proveedor',
        table: 'albaranesprov',
        endpoint: '/albaranproveedores',
        description: 'Albarán de mercancía recibida de un proveedor. Cabecera con totales.',
    },
    {
        name: 'factura_proveedor',
        table: 'facturasprov',
        endpoint: '/facturaproveedores',
        description: 'Factura recibida de un proveedor. Cabecera con totales, impuestos y estado contable.',
    },

    // ── Documentos de compra (líneas) ──────────────────────────────
    {
        name: 'linea_presupuesto_proveedor',
        table: 'lineaspresupuestosprov',
        endpoint: '/lineapresupuestoproveedores',
        description: 'Línea de un presupuesto de proveedor.',
    },
    {
        name: 'linea_pedido_proveedor',
        table: 'lineaspedidosprov',
        endpoint: '/lineapedidoproveedores',
        description: 'Línea de un pedido de proveedor.',
    },
    {
        name: 'linea_albaran_proveedor',
        table: 'lineasalbaranesprov',
        endpoint: '/lineaalbaranproveedores',
        description: 'Línea de un albarán de proveedor.',
    },
    {
        name: 'linea_factura_proveedor',
        table: 'lineasfacturasprov',
        endpoint: '/lineafacturaproveedores',
        description: 'Línea de una factura de proveedor.',
    },

    // ── Cobros y pagos ─────────────────────────────────────────────
    {
        name: 'recibo_cliente',
        table: 'recibospagoscli',
        endpoint: '/reciboclientes',
        editView: 'EditReciboCliente',
        description: 'Recibo de cobro a un cliente. Generado a partir de una factura, con vencimiento e importe.',
    },
    {
        name: 'recibo_proveedor',
        table: 'recibospagosprov',
        endpoint: '/reciboproveedores',
        editView: 'EditReciboProveedor',
        description: 'Recibo de pago a un proveedor. Generado a partir de una factura recibida.',
    },
    {
        name: 'pago_cliente',
        table: 'pagoscli',
        endpoint: '/pagoclientes',
        description: 'Pago realizado por un cliente sobre un recibo. Marca el cobro y la fecha.',
    },
    {
        name: 'pago_proveedor',
        table: 'pagosprov',
        endpoint: '/pagoproveedores',
        description: 'Pago realizado a un proveedor sobre un recibo de proveedor.',
    },

    // ── Cuentas bancarias ──────────────────────────────────────────
    {
        name: 'cuenta_banco',
        table: 'cuentasbanco',
        endpoint: '/cuentabancos',
        editView: 'EditCuentaBanco',
        description: 'Cuenta bancaria propia de la empresa. Asociada a una subcuenta contable.',
    },
    {
        name: 'cuenta_banco_cliente',
        table: 'cuentasbcocli',
        endpoint: '/cuentabancoclientes',
        editView: 'EditCuentaBancoCliente',
        description: 'Cuenta bancaria de un cliente. Usada para cobros por domiciliación.',
    },
    {
        name: 'cuenta_banco_proveedor',
        table: 'cuentasbcopro',
        endpoint: '/cuentabancoproveedores',
        editView: 'EditCuentaBancoProveedor',
        description: 'Cuenta bancaria de un proveedor. Usada para pagos por transferencia.',
    },

    // ── Contabilidad ───────────────────────────────────────────────
    {
        name: 'asiento',
        table: 'asientos',
        endpoint: '/asientos',
        editView: 'EditAsiento',
        description: 'Asiento contable de un ejercicio. Agrupa partidas en el debe y el haber por el mismo importe total.',
    },
    {
        name: 'partida',
        table: 'partidas',
        endpoint: '/partidas',
        editView: 'EditPartida',
        description: 'Línea (apunte) de un asiento contable. Recoge el debe o el haber sobre una subcuenta.',
    },
    {
        name: 'cuenta',
        table: 'cuentas',
        endpoint: '/cuentas',
        editView: 'EditCuenta',
        description: 'Cuenta contable de un ejercicio según el plan general. Agrupa subcuentas.',
    },
    {
        name: 'subcuenta',
        table: 'subcuentas',
        endpoint: '/subcuentas',
        editView: 'EditSubcuenta',
        description: 'Subcuenta contable de un ejercicio. Es el nivel de detalle donde se imputan las partidas.',
    },
    {
        name: 'cuenta_especial',
        table: 'cuentasesp',
        endpoint: '/cuentaespeciales',
        editView: 'EditCuentaEspecial',
        description: 'Cuenta especial: alias para que el sistema sepa qué cuenta usar (ventas, compras, IVA repercutido, etc.).',
    },
    {
        name: 'concepto_partida',
        table: 'conceptos_partidas',
        endpoint: '/conceptopartidas',
        editView: 'EditConceptoPartida',
        description: 'Concepto preconfigurado para acelerar la creación de partidas en asientos.',
    },
    {
        name: 'diario',
        table: 'diarios',
        endpoint: '/diarios',
        editView: 'EditDiario',
        description: 'Diario contable. Permite separar asientos por tipo (ventas, compras, caja, etc.).',
    },
    {
        name: 'ejercicio',
        table: 'ejercicios',
        endpoint: '/ejercicios',
        editView: 'EditEjercicio',
        description: 'Ejercicio contable de la empresa, definido por fecha de inicio y fin. Contiene los asientos del periodo.',
    },
    {
        name: 'regularizacion_impuesto',
        table: 'regularizacionimpuestos',
        endpoint: '/regularizacionimpuestos',
        description: 'Regularización trimestral o mensual de IVA. Genera el asiento de cierre del periodo fiscal.',
    },

    // ── Configuración fiscal y financiera ──────────────────────────
    {
        name: 'divisa',
        table: 'divisas',
        endpoint: '/divisas',
        editView: 'EditDivisa',
        description: 'Moneda usada en documentos. Lleva la tasa de conversión a la divisa principal.',
    },
    {
        name: 'forma_pago',
        table: 'formaspago',
        endpoint: '/formapagos',
        editView: 'EditFormaPago',
        description: 'Forma de pago configurada (transferencia, efectivo, tarjeta…). Define plazos y vencimientos.',
    },
    {
        name: 'identificador_fiscal',
        table: 'idsfiscales',
        endpoint: '/identificadorfiscales',
        editView: 'EditIdentificadorFiscal',
        description: 'Tipo de identificador fiscal (NIF, CIF, NIE, VAT…). Usado por clientes, proveedores y la propia empresa.',
    },
    {
        name: 'impuesto',
        table: 'impuestos',
        endpoint: '/impuestos',
        editView: 'EditImpuesto',
        description: 'Tipo impositivo (IVA general, reducido, etc.) con su porcentaje y subcuentas asociadas.',
    },
    {
        name: 'impuesto_zona',
        table: 'impuestoszonas',
        endpoint: '/impuestozonas',
        editView: 'EditImpuestoZona',
        description: 'Mapeo de impuesto por país/zona, para aplicar tipos distintos según la geografía del cliente.',
    },
    {
        name: 'retencion',
        table: 'retenciones',
        endpoint: '/retenciones',
        editView: 'EditRetencion',
        description: 'Retención fiscal aplicable a documentos (IRPF, etc.). Lleva porcentaje y subcuenta.',
    },
    {
        name: 'serie',
        table: 'series',
        endpoint: '/series',
        editView: 'EditSerie',
        description: 'Serie de numeración para documentos (ej: A, R, RECT). Cada documento tiene una serie y un número correlativo.',
    },
    {
        name: 'secuencia_documento',
        table: 'secuencias_documentos',
        endpoint: '/secuenciadocumentos',
        editView: 'EditSecuenciaDocumento',
        description: 'Secuencia de numeración por tipo de documento, serie, ejercicio y empresa. Controla el siguiente número.',
    },
    {
        name: 'estado_documento',
        table: 'estados_documentos',
        endpoint: '/estadodocumentos',
        editView: 'EditEstadoDocumento',
        description: 'Estado posible de un documento (borrador, aprobado, facturado…). Define las transiciones permitidas.',
    },
    {
        name: 'doc_transformation',
        table: 'doctransformations',
        endpoint: '/doctransformations',
        description: 'Registro de transformación entre documentos (ej: presupuesto → pedido → factura). Trazabilidad de líneas.',
    },
    {
        name: 'formato_documento',
        table: 'formatos_documentos',
        endpoint: '/formatodocumentos',
        editView: 'EditFormatoDocumento',
        description: 'Formato de impresión asignado a un tipo de documento. Define la plantilla.',
    },

    // ── Geografía ──────────────────────────────────────────────────
    {
        name: 'pais',
        table: 'paises',
        endpoint: '/paises',
        editView: 'EditPais',
        description: 'País con código ISO, alpha-3 y nombre. Asociado a contactos, empresas y zonas de impuestos.',
    },
    {
        name: 'provincia',
        table: 'provincias',
        endpoint: '/provincias',
        editView: 'EditProvincia',
        description: 'Provincia o región dentro de un país.',
    },
    {
        name: 'ciudad',
        table: 'ciudades',
        endpoint: '/ciudades',
        editView: 'EditCiudad',
        description: 'Ciudad asociada a un país y provincia.',
    },
    {
        name: 'codigo_postal',
        table: 'codigos_postales',
        endpoint: '/codigopostales',
        editView: 'EditCodigoPostal',
        description: 'Código postal con su ciudad/provincia/país asociados.',
    },
    {
        name: 'punto_interes_ciudad',
        table: 'puntos_interes_ciudades',
        endpoint: '/puntointeresciudades',
        editView: 'EditPuntoInteresCiudad',
        description: 'Punto de interés geográfico asociado a una ciudad (referencia, no transaccional).',
    },

    // ── Sistema: usuarios y permisos ───────────────────────────────
    {
        name: 'user',
        table: 'users',
        endpoint: '/users',
        editView: 'EditUser',
        description: 'Usuario del sistema. Tiene credenciales, rol y empresa asignada.',
    },
    {
        name: 'role',
        table: 'roles',
        endpoint: '/roles',
        editView: 'EditRole',
        description: 'Rol de seguridad. Agrupa permisos sobre páginas y acciones.',
    },
    {
        name: 'role_access',
        table: 'roles_access',
        endpoint: '/roleaccesses',
        description: 'Permiso de acceso de un rol a una página, con flags allowdelete/allowupdate/onlyownerdata.',
    },
    {
        name: 'role_user',
        table: 'roles_users',
        endpoint: '/roleusers',
        editView: 'EditRoleUser',
        description: 'Asignación de un rol a un usuario.',
    },
    {
        name: 'api_access',
        table: 'api_access',
        endpoint: '/apiaccess',
        description: 'Permiso de acceso de una API key a un recurso (modelo) con CRUD configurable.',
    },
    {
        name: 'api_key',
        table: 'api_keys',
        endpoint: '/apikeyes',
        editView: 'EditApiKey',
        description: 'Clave de API para autenticar peticiones REST contra FacturaScripts.',
    },

    // ── Sistema: páginas y configuración ───────────────────────────
    {
        name: 'page',
        table: 'pages',
        endpoint: '/pages',
        description: 'Página/controlador del menú. Generada por el sistema al instalar plugins.',
    },
    {
        name: 'page_filter',
        table: 'pages_filters',
        endpoint: '/pagefilteres',
        description: 'Filtro guardado por un usuario sobre una página de listado.',
    },
    {
        name: 'page_option',
        table: 'pages_options',
        endpoint: '/pageoptions',
        description: 'Configuración personalizada (columnas visibles, anchos…) de una página por usuario o rol.',
    },
    {
        name: 'settings',
        table: 'settings',
        endpoint: '/settings',
        description: 'Configuración global agrupada por nombre. Valores en JSON serializado.',
    },

    // ── Sistema: archivos adjuntos ─────────────────────────────────
    {
        name: 'attached_file',
        table: 'attached_files',
        endpoint: '/attachedfiles',
        editView: 'EditAttachedFile',
        description: 'Archivo subido al sistema (factura, contrato, imagen…). Almacenado en disco.',
    },
    {
        name: 'attached_file_relation',
        table: 'attached_files_rel',
        endpoint: '/attachedfilerelations',
        description: 'Vínculo entre un attached_file y un registro de otra tabla (cliente, factura, etc.).',
    },

    // ── Sistema: comunicaciones ────────────────────────────────────
    {
        name: 'email_notification',
        table: 'emails_notifications',
        endpoint: '/emailnotifications',
        editView: 'EditEmailNotification',
        description: 'Plantilla de notificación por email (asunto, cuerpo) usada para envíos automáticos.',
    },
    {
        name: 'email_sent',
        table: 'emails_sent',
        endpoint: '/emailsentes',
        editView: 'EditEmailSent',
        description: 'Registro histórico de emails enviados desde el sistema.',
    },

    // ── Sistema: logs, jobs y eventos ──────────────────────────────
    {
        name: 'log_message',
        table: 'logs',
        endpoint: '/logmessages',
        description: 'Mensaje de log del sistema (info, warning, error, audit). Útil para auditoría.',
    },
    {
        name: 'cron_job',
        table: 'cronjobs',
        endpoint: '/cronjobes',
        editView: 'EditCronJob',
        description: 'Tarea programada del cron de FacturaScripts. Registra última ejecución y duración.',
    },
    {
        name: 'work_event',
        table: 'work_events',
        endpoint: '/workeventes',
        editView: 'EditWorkEvent',
        description: 'Evento de trabajo asíncrono encolado para que un worker lo procese (ej: creación de asiento).',
    },
];

// ───────────────────────────────────────────────────────────────────────────
// Argumentos CLI
// ───────────────────────────────────────────────────────────────────────────

interface CliArgs {
    /** Modo CORE: ruta a facturascripts. */
    fsPath?: string;
    /** Modo PLUGIN: ruta al manifest.json. */
    manifest?: string;
    /** Filtra modelos a generar (modo CORE). */
    only?: Set<string>;
}

interface PluginManifest {
    moduleName: string;
    fsPath: string;
    pluginPath: string;
    outputBase: string;
    /** Ruta opcional al archivo JSON de overrides de descripciones por modelo. */
    descriptionsOverridesPath?: string;
    models: Array<{
        name: string;
        outputDir: string;
        table: string;
        endpoint: string;
        editView?: string;
        description: string;
    }>;
}

/**
 * Mapa de overrides de descripciones de columnas, indexado por nombre de modelo
 * y luego por nombre de columna. Si una columna tiene un override aquí, este
 * gana sobre cualquier otra fuente (XMLView, traducción, FK genérica).
 */
type DescriptionOverrides = Record<string, Record<string, string>>;

function parseArgs(): CliArgs {
    const args: Record<string, string> = {};
    for (const arg of process.argv.slice(2)) {
        const match = arg.match(/^--([^=]+)=(.*)$/);
        if (match && match[1]) {
            args[match[1]] = match[2] ?? '';
        }
    }

    const result: CliArgs = {};
    if (args['fs-path']) result.fsPath = resolve(args['fs-path']);
    if (args['manifest']) result.manifest = resolve(args['manifest']);
    if (args['only']) {
        result.only = new Set(args['only'].split(',').map((s) => s.trim()).filter(Boolean));
    }

    if (!result.fsPath && !result.manifest) {
        console.error('Error: pasa --fs-path=/ruta/a/facturascripts (modo core) o --manifest=/ruta/manifest.json (modo plugin).');
        process.exit(1);
    }
    return result;
}

// ───────────────────────────────────────────────────────────────────────────
// Parsing de XML (regex-based, suficiente para el formato predecible de FS)
// ───────────────────────────────────────────────────────────────────────────

interface TableColumn {
    name: string;
    type: string;
    nullable: boolean;
    default?: string;
}

interface TableForeignKey {
    localColumn: string;
    remoteTable: string;
    remoteColumn: string;
    onDelete: 'SET NULL' | 'CASCADE' | 'RESTRICT' | 'NO ACTION';
    onUpdate: 'SET NULL' | 'CASCADE' | 'RESTRICT' | 'NO ACTION';
}

interface TableDefinition {
    columns: TableColumn[];
    primaryKey: string[];
    foreignKeys: TableForeignKey[];
    uniqueConstraints: string[][];
}

function parseTableXml(xml: string): TableDefinition {
    const columns: TableColumn[] = [];
    const columnBlocks = xml.matchAll(/<column>([\s\S]*?)<\/column>/g);
    for (const block of columnBlocks) {
        const body = block[1] ?? '';
        const nameMatch = body.match(/<name>([^<]+)<\/name>/);
        const typeMatch = body.match(/<type>([^<]+)<\/type>/);
        if (!nameMatch || !typeMatch || !nameMatch[1] || !typeMatch[1]) continue;
        const nullMatch = body.match(/<null>([^<]+)<\/null>/);
        const defaultMatch = body.match(/<default>([^<]*)<\/default>/);
        const col: TableColumn = {
            name: nameMatch[1].trim(),
            type: typeMatch[1].trim(),
            nullable: !(nullMatch && nullMatch[1]?.trim().toUpperCase() === 'NO'),
        };
        if (defaultMatch && defaultMatch[1] !== undefined) {
            col.default = defaultMatch[1].trim();
        }
        columns.push(col);
    }

    const primaryKey: string[] = [];
    const foreignKeys: TableForeignKey[] = [];
    const uniqueConstraints: string[][] = [];
    const constraintBlocks = xml.matchAll(/<constraint>([\s\S]*?)<\/constraint>/g);
    for (const block of constraintBlocks) {
        const body = block[1] ?? '';
        const typeMatch = body.match(/<type>([^<]+)<\/type>/);
        const typeDef = typeMatch?.[1]?.trim();
        if (!typeDef) continue;

        const pkMatch = typeDef.match(/^PRIMARY\s+KEY\s*\(([^)]+)\)/i);
        if (pkMatch && pkMatch[1]) {
            primaryKey.push(...pkMatch[1].split(',').map((s) => s.trim()));
            continue;
        }

        const fkMatch = typeDef.match(
            /^FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+(\w+)\s*\(([^)]+)\)(?:\s+ON\s+DELETE\s+([A-Z\s]+?))?(?:\s+ON\s+UPDATE\s+([A-Z\s]+?))?\s*$/i,
        );
        if (fkMatch && fkMatch[1] && fkMatch[2] && fkMatch[3]) {
            const localColumn = fkMatch[1].trim();
            const remoteTable = fkMatch[2].trim();
            const remoteColumn = fkMatch[3].trim();
            foreignKeys.push({
                localColumn,
                remoteTable,
                remoteColumn,
                onDelete: normalizeFkAction(fkMatch[4]),
                onUpdate: normalizeFkAction(fkMatch[5]),
            });
            continue;
        }

        const uniqMatch = typeDef.match(/^UNIQUE\s*\(([^)]+)\)/i);
        if (uniqMatch && uniqMatch[1]) {
            uniqueConstraints.push(uniqMatch[1].split(',').map((s) => s.trim()));
        }
    }

    return { columns, primaryKey, foreignKeys, uniqueConstraints };
}

function normalizeFkAction(raw?: string): 'SET NULL' | 'CASCADE' | 'RESTRICT' | 'NO ACTION' {
    if (!raw) return 'NO ACTION';
    const up = raw.trim().toUpperCase().replace(/\s+/g, ' ');
    if (up === 'SET NULL' || up === 'CASCADE' || up === 'RESTRICT' || up === 'NO ACTION') {
        return up;
    }
    return 'NO ACTION';
}

interface ViewFieldInfo {
    titleKey?: string;
    descriptionKey?: string;
    widget?: WidgetType;
    readonly?: boolean;
    required?: boolean;
    enumValues?: string[];
    maxLength?: number;
}

function parseEditViewXml(xml: string): Map<string, ViewFieldInfo> {
    const result = new Map<string, ViewFieldInfo>();

    const columnBlocks = xml.matchAll(/<column\b([^>]*)>([\s\S]*?)<\/column>/g);
    for (const block of columnBlocks) {
        const attrs = block[1] ?? '';
        const body = block[2] ?? '';

        const nameMatch = attrs.match(/\bname="([^"]+)"/);
        const titleMatch = attrs.match(/\btitle="([^"]+)"/);
        const descMatch = attrs.match(/\bdescription="([^"]+)"/);

        const widgetOpenTag = body.match(/<widget\b([^>]*?)\/?>/)?.[1] ?? '';
        const fieldnameMatch = widgetOpenTag.match(/\bfieldname="([^"]+)"/);
        if (!fieldnameMatch || !fieldnameMatch[1]) continue;
        const fieldname = fieldnameMatch[1];

        const typeMatch = widgetOpenTag.match(/\btype="([^"]+)"/);
        const readonlyMatch = widgetOpenTag.match(/\breadonly="([^"]+)"/);
        const requiredMatch = widgetOpenTag.match(/\brequired="true"/);
        const maxLengthMatch = widgetOpenTag.match(/\bmaxlength="(\d+)"/);

        const enumValues: string[] = [];
        const valuesBlocks = body.matchAll(/<values\b[^>]*title="([^"]+)"[^>]*>([^<]*)<\/values>/g);
        for (const v of valuesBlocks) {
            if (v[2]) enumValues.push(v[2].trim());
        }

        const info: ViewFieldInfo = {};
        const titleKey = titleMatch?.[1] ?? nameMatch?.[1];
        if (titleKey) info.titleKey = titleKey;
        if (descMatch?.[1]) info.descriptionKey = descMatch[1];
        if (typeMatch?.[1]) info.widget = normalizeWidgetType(typeMatch[1]);
        if (readonlyMatch?.[1] && readonlyMatch[1] !== 'false') info.readonly = true;
        if (requiredMatch) info.required = true;
        if (maxLengthMatch?.[1]) info.maxLength = Number(maxLengthMatch[1]);
        if (enumValues.length > 0) info.enumValues = enumValues;

        const existing = result.get(fieldname);
        if (!existing || Object.keys(info).length > Object.keys(existing).length) {
            result.set(fieldname, info);
        }
    }

    return result;
}

function normalizeWidgetType(raw: string): WidgetType {
    const known: WidgetType[] = [
        'text', 'select', 'number', 'money', 'date', 'datetime', 'checkbox',
        'textarea', 'email', 'link', 'password', 'color', 'file', 'autocomplete', 'subcuenta',
    ];
    return (known.includes(raw as WidgetType) ? raw : 'text') as WidgetType;
}

// ───────────────────────────────────────────────────────────────────────────
// Resolver de traducciones
// ───────────────────────────────────────────────────────────────────────────

interface TranslationLoader {
    get(key: string): string | undefined;
    missed: Set<string>;
}

// loadTranslations() reemplazado por loadCombinedTranslations() más abajo,
// que admite además un archivo extra de traducciones (las del plugin).

// ───────────────────────────────────────────────────────────────────────────
// Normalización de tipos SQL a tsType
// ───────────────────────────────────────────────────────────────────────────

function sqlTypeToTs(sqlType: string): { tsType: TsType; maxLength?: number } {
    const lower = sqlType.toLowerCase().trim();
    if (lower === 'serial' || lower === 'integer' || lower === 'bigint' || lower === 'smallint') {
        return { tsType: 'number' };
    }
    if (lower === 'double precision' || lower === 'real' || lower.startsWith('numeric') || lower.startsWith('decimal')) {
        return { tsType: 'number' };
    }
    if (lower === 'boolean') return { tsType: 'boolean' };
    if (lower === 'date') return { tsType: 'date' };
    if (lower === 'timestamp' || lower.startsWith('timestamp')) return { tsType: 'datetime' };
    if (lower === 'time') return { tsType: 'time' };
    if (lower === 'text') return { tsType: 'text' };

    const varcharMatch = lower.match(/character varying\((\d+)\)/) || lower.match(/varchar\((\d+)\)/);
    if (varcharMatch && varcharMatch[1]) {
        return { tsType: 'string', maxLength: Number(varcharMatch[1]) };
    }

    return { tsType: 'string' };
}

function parseDefault(raw: string | undefined, tsType: TsType): string | number | boolean | undefined {
    if (raw === undefined || raw === '') return undefined;
    if (tsType === 'boolean') {
        return raw === 'true' || raw === '1';
    }
    if (tsType === 'number') {
        const num = Number(raw);
        return Number.isNaN(num) ? raw : num;
    }
    return raw;
}

// ───────────────────────────────────────────────────────────────────────────
// Construcción de ColumnMetadata
// ───────────────────────────────────────────────────────────────────────────

function buildColumnMetadata(
    col: TableColumn,
    tableDef: TableDefinition,
    viewField: ViewFieldInfo | undefined,
    translations: TranslationLoader,
    descriptionOverride?: string,
): ColumnMetadata {
    const { tsType, maxLength: sqlMaxLength } = sqlTypeToTs(col.type);
    const isPrimaryKey = tableDef.primaryKey.includes(col.name);
    const fk = tableDef.foreignKeys.find((f) => f.localColumn === col.name);

    // Un campo es readonly si es serial (auto-increment) o la view lo marca readonly.
    const isSerial = col.type.toLowerCase() === 'serial';
    const isReadonly = isSerial || viewField?.readonly === true;

    // Requerido: NOT NULL sin default, o required="true" en la view. Los serial nunca.
    const isRequired =
        !isSerial &&
        ((!col.nullable && col.default === undefined) || viewField?.required === true);

    const label = resolveLabel(col.name, viewField, translations);
    // Override manual gana sobre toda la cascada automática.
    const description = descriptionOverride && descriptionOverride.trim() !== ''
        ? descriptionOverride.trim()
        : resolveDescription(col.name, viewField, translations, fk);
    const defaultValue = parseDefault(col.default, tsType);

    const result: ColumnMetadata = {
        name: col.name,
        sqlType: col.type,
        tsType,
        nullable: col.nullable,
        isPrimaryKey,
        isReadonly,
        isRequired,
        label,
    };

    const resolvedMaxLength = viewField?.maxLength ?? sqlMaxLength;
    if (resolvedMaxLength !== undefined) result.maxLength = resolvedMaxLength;
    if (defaultValue !== undefined) result.default = defaultValue;
    if (description) result.description = description;
    if (viewField?.widget) {
        result.widget = viewField.widget;
    } else {
        const impliedWidget = implyWidget(tsType);
        if (impliedWidget) result.widget = impliedWidget;
    }
    if (fk) {
        const foreignKey: ForeignKey = {
            table: fk.remoteTable,
            column: fk.remoteColumn,
            onDelete: fk.onDelete,
            onUpdate: fk.onUpdate,
        };
        result.foreignKey = foreignKey;
    }
    if (viewField?.enumValues && viewField.enumValues.length > 0) {
        result.enumValues = viewField.enumValues;
    }

    return result;
}

function implyWidget(tsType: TsType): WidgetType | undefined {
    if (tsType === 'boolean') return 'checkbox';
    if (tsType === 'date') return 'date';
    if (tsType === 'datetime') return 'datetime';
    if (tsType === 'text') return 'textarea';
    if (tsType === 'number') return 'number';
    return undefined;
}

function resolveLabel(
    columnName: string,
    viewField: ViewFieldInfo | undefined,
    translations: TranslationLoader,
): string {
    if (viewField?.titleKey) {
        const tr = translations.get(viewField.titleKey);
        if (tr) return tr;
    }
    const direct = translations.get(columnName);
    if (direct) return direct;
    return columnName;
}

function resolveDescription(
    columnName: string,
    viewField: ViewFieldInfo | undefined,
    translations: TranslationLoader,
    fk: TableForeignKey | undefined,
): string | undefined {
    if (viewField?.descriptionKey && viewField.descriptionKey !== 'optional') {
        const tr = translations.get(viewField.descriptionKey);
        if (tr) return tr;
    }
    const descKey = translations.get(`desc-${columnName}`);
    if (descKey) return descKey;
    if (fk) {
        return `Referencia a ${fk.remoteTable}.${fk.remoteColumn}.`;
    }
    return undefined;
}

// ───────────────────────────────────────────────────────────────────────────
// Construcción de relaciones
// ───────────────────────────────────────────────────────────────────────────

function buildRelations(
    modelTable: string,
    tableDef: TableDefinition,
    allTables: Map<string, TableDefinition>,
    catalog: ModelEntry[],
): Relation[] {
    const relations: Relation[] = [];
    const tableToModel = new Map(catalog.map((e) => [e.table, e.name]));

    for (const fk of tableDef.foreignKeys) {
        relations.push({
            type: 'belongsTo',
            targetModel: tableToModel.get(fk.remoteTable) ?? fk.remoteTable,
            targetTable: fk.remoteTable,
            localColumn: fk.localColumn,
            remoteColumn: fk.remoteColumn,
        });
    }

    for (const [otherTable, otherDef] of allTables) {
        if (otherTable === modelTable) continue;
        for (const fk of otherDef.foreignKeys) {
            if (fk.remoteTable === modelTable) {
                relations.push({
                    type: 'hasMany',
                    targetModel: tableToModel.get(otherTable) ?? otherTable,
                    targetTable: otherTable,
                    localColumn: fk.remoteColumn,
                    remoteColumn: fk.localColumn,
                });
            }
        }
    }

    return relations;
}

// ───────────────────────────────────────────────────────────────────────────
// Escritura de archivos generados
// ───────────────────────────────────────────────────────────────────────────

function serializeMetadata(meta: ModelMetadata): string {
    const json = JSON.stringify(meta, null, 4);
    const varName = toCamelCase(meta.name) + 'Metadata';
    return `// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from '../types.js';

export const ${varName}: ModelMetadata = ${json};

export default ${varName};
`;
}

function toCamelCase(snake: string): string {
    return snake.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

async function writeIndexFile(outDir: string, names: string[]): Promise<void> {
    const sorted = [...names].sort();
    const imports = sorted
        .map((name) => {
            const varName = toCamelCase(name) + 'Metadata';
            return `import ${varName} from './models/${name}.js';`;
        })
        .join('\n');
    const entries = sorted
        .map((name) => {
            const varName = toCamelCase(name) + 'Metadata';
            return `    ${name}: ${varName},`;
        })
        .join('\n');

    const content = `// Archivo generado automáticamente por scripts/generate-metadata.ts
// No editar a mano: cualquier cambio se perderá al regenerar.

import type { ModelMetadata } from './types.js';

${imports}

/**
 * Catálogo de metadata indexado por nombre de modelo.
 */
export const modelMetadata: Record<string, ModelMetadata> = {
${entries}
};

/**
 * Lista de nombres de modelos disponibles.
 */
export const modelNames: string[] = Object.keys(modelMetadata);

export type { ModelMetadata, ColumnMetadata, Relation, ForeignKey, TsType, WidgetType } from './types.js';
`;

    await writeFile(join(outDir, 'index.ts'), content, 'utf8');
}

// ───────────────────────────────────────────────────────────────────────────
// Main
// ───────────────────────────────────────────────────────────────────────────

/**
 * Carga todas las tablas (XML) bajo un directorio dado.
 */
async function loadTablesFromDir(tablesDir: string): Promise<Map<string, TableDefinition>> {
    const result = new Map<string, TableDefinition>();
    if (!existsSync(tablesDir)) return result;
    const tableFiles = await readdir(tablesDir);
    for (const file of tableFiles) {
        if (!file.endsWith('.xml')) continue;
        const tableName = file.replace(/\.xml$/, '');
        const xml = await readFile(join(tablesDir, file), 'utf8');
        result.set(tableName, parseTableXml(xml));
    }
    return result;
}

/**
 * Combina dos diccionarios de traducciones; el segundo gana en colisiones
 * (las traducciones del plugin sobrescriben las del core).
 */
async function loadCombinedTranslations(
    fsPath: string,
    extraJsonPath?: string,
): Promise<TranslationLoader> {
    const corePath = join(fsPath, 'Core', 'Translation', 'es_ES.json');
    const dict: Record<string, string> = {};
    if (existsSync(corePath)) {
        Object.assign(dict, JSON.parse(await readFile(corePath, 'utf8')) as Record<string, string>);
    }
    if (extraJsonPath && existsSync(extraJsonPath)) {
        Object.assign(dict, JSON.parse(await readFile(extraJsonPath, 'utf8')) as Record<string, string>);
    }
    const missed = new Set<string>();
    return {
        get(key: string) {
            const val = dict[key];
            if (val === undefined) missed.add(key);
            return val;
        },
        missed,
    };
}

/**
 * Carga un archivo JSON de overrides de descripciones. Si no existe o falla,
 * devuelve un objeto vacío y lo reporta por consola.
 */
async function loadDescriptionsOverrides(path: string | undefined): Promise<DescriptionOverrides> {
    if (!path || !existsSync(path)) return {};
    try {
        const raw = await readFile(path, 'utf8');
        const parsed = JSON.parse(raw) as DescriptionOverrides;
        let count = 0;
        for (const model of Object.values(parsed)) count += Object.keys(model).length;
        console.log(`[generate-metadata] Overrides de descripciones cargados: ${count} columnas en ${Object.keys(parsed).length} modelos (desde ${path}).`);
        return parsed;
    } catch (err) {
        console.warn(`[generate-metadata] Error cargando overrides desde ${path}: ${(err as Error).message}`);
        return {};
    }
}

/**
 * Resuelve el commit corto de un repo Git, o undefined si no se puede.
 */
function resolveGitCommit(cwd: string): string | undefined {
    try {
        const out = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
            cwd,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        });
        return out.trim();
    } catch {
        return undefined;
    }
}

/**
 * Construye un ModelMetadata a partir de una entrada de catálogo y los datos
 * cargados (tablas + traducciones + XMLView). Reusable por core y plugin.
 */
function buildModelMetadata(
    entry: ModelEntry,
    allTables: Map<string, TableDefinition>,
    translations: TranslationLoader,
    viewFields: Map<string, ViewFieldInfo>,
    catalog: ModelEntry[],
    source: ModelMetadata['source'],
    generatedFrom: ModelMetadata['generatedFrom'],
    overridesForModel?: Record<string, string>,
): ModelMetadata | undefined {
    const tableDef = allTables.get(entry.table);
    if (!tableDef) return undefined;

    const columns = tableDef.columns.map((col) =>
        buildColumnMetadata(
            col,
            tableDef,
            viewFields.get(col.name),
            translations,
            overridesForModel?.[col.name],
        ),
    );
    const relations = buildRelations(entry.table, tableDef, allTables, catalog);
    const primaryKey = tableDef.primaryKey[0] ?? columns[0]?.name ?? 'id';

    const meta: ModelMetadata = {
        name: entry.name,
        table: entry.table,
        endpoint: entry.endpoint,
        primaryKey,
        description: entry.description,
        source,
        columns,
        relations,
        generatedFrom,
    };
    return meta;
}

// ───────────────────────────────────────────────────────────────────────────
// Modo CORE
// ───────────────────────────────────────────────────────────────────────────

async function runCoreMode(args: CliArgs): Promise<void> {
    const fsPath = args.fsPath!;
    console.log(`[generate-metadata] Modo CORE — FacturaScripts path: ${fsPath}`);
    if (!existsSync(fsPath)) {
        console.error(`Error: no existe ${fsPath}`);
        process.exit(1);
    }

    const scriptDir = dirname(fileURLToPath(import.meta.url));
    const serverRoot = resolve(scriptDir, '..', '..');
    const outDir = join(serverRoot, 'src', 'metadata');
    const modelsDir = join(outDir, 'models');
    await mkdir(modelsDir, { recursive: true });
    console.log(`[generate-metadata] Output dir: ${outDir}`);

    const translations = await loadCombinedTranslations(fsPath);
    const allTables = await loadTablesFromDir(join(fsPath, 'Core', 'Table'));
    console.log(`[generate-metadata] Cargadas ${allTables.size} tablas del core.`);

    const fsCommit = resolveGitCommit(fsPath);

    // Overrides del core: archivo en server/src/metadata/descriptions-overrides.json
    const overridesPath = join(outDir, 'descriptions-overrides.json');
    const overrides = await loadDescriptionsOverrides(overridesPath);

    const toProcess = args.only
        ? MODEL_CATALOG.filter((m) => args.only!.has(m.name))
        : MODEL_CATALOG;

    if (toProcess.length === 0) {
        console.error('Error: no hay modelos que procesar.');
        process.exit(1);
    }

    const generatedAt = new Date().toISOString();
    const generatedNames: string[] = [];

    for (const entry of toProcess) {
        const viewFields = await loadEditViewIfExists(join(fsPath, 'Core', 'XMLView'), entry.editView, entry.name);
        const generatedFrom: ModelMetadata['generatedFrom'] = { generatedAt };
        if (fsCommit) generatedFrom.facturascriptsCommit = fsCommit;

        const meta = buildModelMetadata(
            entry,
            allTables,
            translations,
            viewFields,
            MODEL_CATALOG,
            'core',
            generatedFrom,
            overrides[entry.name],
        );
        if (!meta) {
            console.error(`[generate-metadata] Tabla "${entry.table}" no encontrada para "${entry.name}". Saltando.`);
            continue;
        }

        await writeFile(join(modelsDir, `${entry.name}.ts`), serializeMetadataAsTs(meta), 'utf8');
        console.log(`[generate-metadata] ✓ ${entry.name} (${meta.columns.length} columnas, ${meta.relations.length} relaciones)`);
        generatedNames.push(entry.name);
    }

    const existing = await readdir(modelsDir);
    const allNames = existing.filter((f) => f.endsWith('.ts')).map((f) => f.replace(/\.ts$/, ''));
    await writeIndexFile(outDir, allNames);

    reportMissedTranslations(translations);
    console.log(`[generate-metadata] Hecho. ${generatedNames.length} modelos generados (modo CORE).`);
}

// ───────────────────────────────────────────────────────────────────────────
// Modo PLUGIN
// ───────────────────────────────────────────────────────────────────────────

async function runPluginMode(args: CliArgs): Promise<void> {
    const manifestPath = args.manifest!;
    console.log(`[generate-metadata] Modo PLUGIN — manifest: ${manifestPath}`);
    if (!existsSync(manifestPath)) {
        console.error(`Error: no existe el manifest ${manifestPath}`);
        process.exit(1);
    }

    const raw = await readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(raw) as PluginManifest;
    validateManifest(manifest);

    const { moduleName, fsPath, pluginPath, outputBase, models } = manifest;
    console.log(`[generate-metadata] moduleName=${moduleName}, fsPath=${fsPath}, pluginPath=${pluginPath}`);

    if (!existsSync(fsPath)) {
        console.error(`Error: fsPath no existe: ${fsPath}`);
        process.exit(1);
    }
    if (!existsSync(pluginPath)) {
        console.error(`Error: pluginPath no existe: ${pluginPath}`);
        process.exit(1);
    }

    // Cargar tablas del core + plugin (para resolver FKs cruzadas).
    const coreTables = await loadTablesFromDir(join(fsPath, 'Core', 'Table'));
    const pluginTables = await loadTablesFromDir(join(pluginPath, 'Table'));
    const allTables = new Map<string, TableDefinition>([...coreTables, ...pluginTables]);
    console.log(`[generate-metadata] Tablas cargadas: ${coreTables.size} core + ${pluginTables.size} plugin = ${allTables.size}.`);

    // Combinar traducciones del core con las del plugin.
    const pluginTranslationPath = join(pluginPath, 'Translation', 'es_ES.json');
    const translations = await loadCombinedTranslations(fsPath, pluginTranslationPath);

    // Catálogo enriquecido: incluye TODOS los modelos del core (para que
    // hasMany/belongsTo se resuelvan a nombres correctos) y los del plugin.
    const pluginCatalog: ModelEntry[] = models.map((m) => ({
        name: m.name,
        table: m.table,
        endpoint: m.endpoint,
        ...(m.editView !== undefined ? { editView: m.editView } : {}),
        description: m.description,
    }));
    const fullCatalog: ModelEntry[] = [...MODEL_CATALOG, ...pluginCatalog];

    const fsCommit = resolveGitCommit(fsPath);
    const pluginCommit = resolveGitCommit(pluginPath);
    const generatedAt = new Date().toISOString();

    // Overrides del plugin: archivo opcional indicado en el manifest.
    const overrides = await loadDescriptionsOverrides(manifest.descriptionsOverridesPath);

    let okCount = 0;
    for (const m of models) {
        const generatedFrom: ModelMetadata['generatedFrom'] = { generatedAt };
        if (fsCommit) generatedFrom.facturascriptsCommit = fsCommit;
        if (pluginCommit) generatedFrom.facturascriptsVersion = `plugin:${moduleName}@${pluginCommit}`;

        const viewFields = await loadEditViewIfExists(join(pluginPath, 'XMLView'), m.editView, m.name);
        const entry: ModelEntry = {
            name: m.name,
            table: m.table,
            endpoint: m.endpoint,
            ...(m.editView !== undefined ? { editView: m.editView } : {}),
            description: m.description,
        };
        const meta = buildModelMetadata(
            entry,
            allTables,
            translations,
            viewFields,
            fullCatalog,
            `plugin:${moduleName}`,
            generatedFrom,
            overrides[m.name],
        );
        if (!meta) {
            console.error(`[generate-metadata] Tabla "${m.table}" no encontrada para "${m.name}" (busqué en core y en ${pluginPath}/Table). Saltando.`);
            continue;
        }

        const targetDir = resolve(outputBase, m.outputDir);
        await mkdir(targetDir, { recursive: true });
        const targetPath = join(targetDir, 'metadata.js');
        await writeFile(targetPath, serializeMetadataAsJs(meta), 'utf8');
        console.log(`[generate-metadata] ✓ ${m.name} (${meta.columns.length} columnas, ${meta.relations.length} relaciones) → ${targetPath}`);
        okCount += 1;
    }

    reportMissedTranslations(translations);
    console.log(`[generate-metadata] Hecho. ${okCount} modelo(s) generado(s) (modo PLUGIN: ${moduleName}).`);
}

function validateManifest(m: PluginManifest): void {
    const required: Array<keyof PluginManifest> = ['moduleName', 'fsPath', 'pluginPath', 'outputBase', 'models'];
    for (const k of required) {
        if (m[k] === undefined || m[k] === null) {
            console.error(`Error: manifest sin campo "${k}".`);
            process.exit(1);
        }
    }
    if (!Array.isArray(m.models) || m.models.length === 0) {
        console.error('Error: manifest.models debe ser un array no vacío.');
        process.exit(1);
    }
    for (const e of m.models) {
        for (const k of ['name', 'outputDir', 'table', 'endpoint', 'description']) {
            if (typeof (e as Record<string, unknown>)[k] !== 'string') {
                console.error(`Error: entrada de modelo "${e.name ?? '?'}" sin campo string "${k}".`);
                process.exit(1);
            }
        }
    }
}

async function loadEditViewIfExists(
    viewDir: string,
    editView: string | undefined,
    modelName: string,
): Promise<Map<string, ViewFieldInfo>> {
    if (!editView) return new Map();
    const viewPath = join(viewDir, `${editView}.xml`);
    if (!existsSync(viewPath)) {
        console.warn(`[generate-metadata] XMLView "${editView}.xml" no encontrada para "${modelName}" (en ${viewDir}).`);
        return new Map();
    }
    const xml = await readFile(viewPath, 'utf8');
    return parseEditViewXml(xml);
}

function reportMissedTranslations(translations: TranslationLoader): void {
    if (translations.missed.size === 0) return;
    console.warn(`[generate-metadata] ${translations.missed.size} claves de traducción no encontradas (primeras 10):`);
    let count = 0;
    for (const key of translations.missed) {
        if (count++ >= 10) break;
        console.warn(`  - ${key}`);
    }
}

/**
 * Serializa la metadata como módulo TS (modo CORE).
 */
function serializeMetadataAsTs(meta: ModelMetadata): string {
    return serializeMetadata(meta);
}

/**
 * Serializa la metadata como módulo JS plano (modo PLUGIN).
 * No usa imports tipados: los módulos privados son JS sin TypeScript.
 */
function serializeMetadataAsJs(meta: ModelMetadata): string {
    const json = JSON.stringify(meta, null, 4);
    const varName = toCamelCase(meta.name) + 'Metadata';
    return `// Archivo generado automáticamente por scripts/generate-metadata.ts (modo plugin).
// No editar a mano: cualquier cambio se perderá al regenerar.

export const ${varName} = ${json};

export default ${varName};
`;
}

// ───────────────────────────────────────────────────────────────────────────
// Entry point
// ───────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    const args = parseArgs();
    if (args.manifest) {
        await runPluginMode(args);
    } else {
        await runCoreMode(args);
    }
}

main().catch((err) => {
    console.error('[generate-metadata] Error fatal:', err);
    process.exit(1);
});
