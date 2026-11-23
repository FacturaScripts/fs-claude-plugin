/**
 * Validación de los argumentos de una tool contra su inputSchema, antes de
 * llamar al handler.
 *
 * Los handlers hacen `input as any` y meten algunos argumentos en la ruta de la
 * API, así que sin esto un `id` declarado número llega aunque sea una cadena
 * como "../users/admin". Se valida el subconjunto de JSON Schema que usan los
 * esquemas de las tools: type, required, enum e items.type.
 *
 * Lo que NO se valida, a propósito:
 * - Propiedades no declaradas: los update_* reenvían campos libres del modelo.
 * - `connection` como obligatoria: muchas tools la declaran en required, pero el
 *   cliente usa la conexión por defecto si falta.
 * - maxLength: lo añade la metadata y puede ir por detrás del core.
 * - enum que añade la metadata: lista los valores del core y un plugin puede
 *   usar otros, así que es orientativo. Sólo se exigen los escritos a mano.
 * - enum en propiedades que no son string: algunos esquemas declaran
 *   type boolean con enum ['1', '0'], y validarlo rechazaría todo booleano.
 *   Por lo mismo, un valor que está en el enum se acepta aunque su tipo no
 *   case con type: '1' es lo que anuncia ese mismo esquema.
 */

import { hasMetadataEnum } from '../metadata/enrich.js';

interface PropertySchema {
  type?: string | undefined;
  enum?: unknown[] | undefined;
  items?: { type?: string | undefined } | undefined;
}

interface InputSchema {
  properties?: Record<string, object> | undefined;
  required?: string[] | undefined;
}

/** Un número escrito como texto: "5", "-3", "2.5". Sin espacios, exponentes ni hexadecimal. */
const NUMERIC_STRING = /^-?\d+(\.\d+)?$/;
const INTEGER_STRING = /^-?\d+$/;

function matchesType(value: unknown, type: string | undefined): boolean {
  switch (type) {
    case 'string':
      // Un número se acepta, como antes de validar (codejercicio: 2025), y se pasa
      // sin convertir: el cliente lo manda como texto
      return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));
    case 'number':
      // Una cadena numérica se acepta, como antes de validar (los identificadores
      // van a la ruta como texto), y se pasa sin convertir
      return (typeof value === 'number' && Number.isFinite(value)) || (typeof value === 'string' && NUMERIC_STRING.test(value));
    case 'integer':
      // Como number, sin decimales
      return Number.isInteger(value) || (typeof value === 'string' && INTEGER_STRING.test(value));
    case 'boolean':
      // "1" y "0" llegaban a la API y funcionan en MySQL y PostgreSQL. "true" y
      // "false" no: la API guarda el texto tal cual, y en MySQL sin modo estricto
      // "true" acabaría como falso sin avisar
      return typeof value === 'boolean' || value === '1' || value === '0';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return value !== null && typeof value === 'object' && !Array.isArray(value);
    default:
      return true;
  }
}

/**
 * Devuelve el motivo del rechazo, o null si los argumentos casan con el esquema.
 * Un argumento null o undefined cuenta como ausente.
 */
export function validateToolInput(schema: InputSchema, input: Record<string, unknown> | undefined): string | null {
  const args = input ?? {};
  const properties = (schema.properties ?? {}) as Record<string, PropertySchema>;

  for (const name of schema.required ?? []) {
    if (name === 'connection') continue;
    if (args[name] === undefined || args[name] === null) {
      return `falta el argumento obligatorio "${name}"`;
    }
  }

  for (const [name, value] of Object.entries(args)) {
    const property = Object.hasOwn(properties, name) ? properties[name] : undefined;
    if (!property || value === undefined || value === null) continue;
    if (property.enum?.includes(value)) continue;

    if (!matchesType(value, property.type)) {
      return property.type === 'boolean'
        ? `el argumento "${name}" debe ser true, false, 1 o 0`
        : `el argumento "${name}" debe ser de tipo ${property.type}`;
    }
    if (property.type === 'string' && property.enum && !hasMetadataEnum(property) && !property.enum.includes(value)) {
      return `el argumento "${name}" debe ser uno de: ${property.enum.join(', ')}`;
    }
    if (property.type === 'array' && property.items?.type) {
      const itemType = property.items.type;
      if (!(value as unknown[]).every((item) => matchesType(item, itemType))) {
        return `los elementos de "${name}" deben ser de tipo ${itemType}`;
      }
    }
  }

  return null;
}
