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
 * - enum en propiedades que no son string: algunos esquemas declaran
 *   type boolean con enum ['1', '0'], y validarlo rechazaría todo booleano.
 *   Por lo mismo, un valor que está en el enum se acepta aunque su tipo no
 *   case con type: '1' es lo que anuncia ese mismo esquema.
 */

interface PropertySchema {
  type?: string | undefined;
  enum?: unknown[] | undefined;
  items?: { type?: string | undefined } | undefined;
}

interface InputSchema {
  properties?: Record<string, object> | undefined;
  required?: string[] | undefined;
}

function matchesType(value: unknown, type: string | undefined): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'boolean':
      return typeof value === 'boolean';
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
      return `el argumento "${name}" debe ser de tipo ${property.type}`;
    }
    if (property.type === 'string' && property.enum && !property.enum.includes(value)) {
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
