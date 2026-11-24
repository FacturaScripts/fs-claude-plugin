/**
 * Validación de los argumentos de una tool contra su inputSchema, antes de
 * llamar al handler.
 *
 * Los handlers hacen `input as any` y meten algunos argumentos en la ruta de la
 * API de autor, así que sin esto un número declarado llega aunque sea una cadena
 * como "../plugins". Se valida el subconjunto de JSON Schema que usan los
 * esquemas de las tools: type, required, enum e items.type.
 *
 * Lo que NO se valida, a propósito:
 * - Propiedades no declaradas.
 * - `connection` como obligatoria: si falta, se usa la primera conexión de tipo forja.
 * - enum en propiedades que no son string: un valor que está en el enum se
 *   acepta aunque su tipo no case con type.
 *
 * Es una copia de la validación de fs-mcp sin los enums que allí añade la
 * metadata de modelos, que fs-forja no tiene.
 */
interface InputSchema {
    properties?: Record<string, object> | undefined;
    required?: string[] | undefined;
}
/**
 * Devuelve el motivo del rechazo, o null si los argumentos casan con el esquema.
 * Un argumento null o undefined cuenta como ausente.
 */
export declare function validateToolInput(schema: InputSchema, input: Record<string, unknown> | undefined): string | null;
export {};
//# sourceMappingURL=validateInput.d.ts.map