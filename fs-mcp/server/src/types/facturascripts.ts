/**
 * Tipos TypeScript para integración con FacturaScripts ERP
 * Define las entidades principales y estructura de datos de la API
 */

/**
 * Tipos de conexión admitidos.
 *
 * - `api`: API REST estándar de FacturaScripts (`/api/3`), autenticada con la cabecera `Token`.
 * - `forja`: API de autor de facturascripts.com (`/api/3/forja`), autenticada con `X-Forja-Token`.
 */
export type ConnectionType = 'api' | 'forja';

/**
 * Configuración de conexión individual a una instancia de FacturaScripts
 */
export interface ConnectionConfig {
  /** Nombre descriptivo de la conexión. */
  name: string;
  /** URL base de la instalación, sin `/api/3`. */
  url: string;
  /** Token de la API estándar o token de autor de Forja, según `type`. */
  token: string;
  /** Tipo de conexión; si se omite se trata como `api`. */
  type?: ConnectionType;
  /** Versión de FacturaScripts (informativa). */
  version?: string;
  /** Si es `false`, acepta certificados HTTPS autofirmados o no verificables. */
  rejectUnauthorized?: boolean;
}

/**
 * Configuración completa de conexiones multi-instancia
 */
export interface ConnectionsConfig {
  default: string;
  connections: Record<string, ConnectionConfig>;
}

/**
 * Respuesta genérica de API de FacturaScripts
 */
export interface ApiResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * Cliente en FacturaScripts
 */
export interface FsCliente {
  codcliente: string;
  nombre: string;
  cifnif: string;
  email: string;
  telefono1: string;
  direccion: string;
  codpais: string;
  provincia: string;
  ciudad: string;
}

/**
 * Producto en FacturaScripts
 */
export interface FsProducto {
  referencia: string;
  descripcion: string;
  precio: number;
  codfamilia: string;
  stockfis: number;
  pvp: number;
}

/**
 * Factura de Cliente en FacturaScripts
 */
export interface FsFacturaCliente {
  idfactura: number;
  codcliente: string;
  fecha: string;
  total: number;
  neto: number;
  totaliva: number;
  pagada: boolean;
  anulada: boolean;
  codserie: string;
}

/**
 * Pedido de Cliente en FacturaScripts
 */
export interface FsPedidoCliente {
  idpedido: number;
  codcliente: string;
  fecha: string;
  total: number;
  neto: number;
  estado: string;
}

/**
 * Albarán de Cliente en FacturaScripts
 */
export interface FsAlbaranCliente {
  idalbaran: number;
  codcliente: string;
  fecha: string;
  total: number;
  neto: number;
}

/**
 * Presupuesto de Cliente en FacturaScripts
 */
export interface FsPresupuestoCliente {
  idpresupuesto: number;
  codcliente: string;
  fecha: string;
  total: number;
  neto: number;
}

/**
 * Proveedor en FacturaScripts
 */
export interface FsProveedor {
  codproveedor: string;
  nombre: string;
  cifnif: string;
  email: string;
}

/**
 * Stock de producto en almacén
 */
export interface FsStock {
  referencia: string;
  codalmacen: string;
  cantidad: number;
  disponible: number;
  reservada: number;
}

/**
 * Ejercicio fiscal en FacturaScripts
 */
export interface FsEjercicio {
  codejercicio: string;
  nombre: string;
  fechainicio: string;
  fechafin: string;
  estado: string;
}

/**
 * Asiento contable en FacturaScripts
 */
export interface FsAsiento {
  idasiento: number;
  descripcion: string;
  fecha: string;
  importe: number;
  codejercicio: string;
}

/**
 * Input base para herramientas MCP con soporte multi-conexión
 */
export interface McpToolInput {
  connection?: string;
  [key: string]: unknown;
}

/**
 * Resultado de operación MCP
 */
export interface McpToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}
