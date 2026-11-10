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