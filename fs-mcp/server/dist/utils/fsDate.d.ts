/**
 * Parseo de las fechas tal como las devuelve la API REST de FacturaScripts.
 *
 * La API serializa las fechas con el estilo de FacturaScripts, que por defecto es
 * `d-m-Y` (y es configurable a `d/m/Y`): `04-01-2023`, `01-09-2025 10:48:33`. En
 * cambio, `new Date(...)` de JavaScript interpreta esa cadena como **MM-DD-YYYY**,
 * con dos fallos silenciosos:
 *
 *   new Date('04-01-2023')  ->  1 de ABRIL de 2023   (mes y día intercambiados)
 *   new Date('19-08-2025')  ->  Invalid Date         (no existe el mes 19)
 *
 * Es decir: con día <= 12 el registro se contabiliza en el mes equivocado y con
 * día > 12 desaparece del cálculo, en ambos casos **sin ningún error**. Por eso
 * cualquier valor de fecha que venga de la API debe pasar por aquí y nunca
 * directamente por `new Date()`.
 *
 * Devuelve un `Date` para poder sustituir a `new Date(...)` tal cual en el sitio
 * de llamada. Si el valor no es una fecha reconocible devuelve un `Date`
 * inválido (igual que hacía `new Date`), de modo que las comparaciones siguen
 * dando `false` y no cambia el comportamiento para entradas basura. Quien
 * necesite distinguirlo puede comprobar `Number.isNaN(d.getTime())`.
 */
/**
 * Convierte un valor de fecha de la API de FacturaScripts en un `Date`.
 * Acepta `d-m-Y`, `d/m/Y` e ISO `Y-m-d`, todos con hora opcional.
 */
export declare function parseFsDate(value: unknown): Date;
/** Indica si el valor es una fecha de FacturaScripts interpretable. */
export declare function esFechaValida(value: unknown): boolean;
/**
 * Formatea una fecha en ISO `YYYY-MM-DD` (hora local, sin desplazamiento de zona,
 * a diferencia de `toISOString()`). Es el formato que espera la API en los filtros.
 */
export declare function toIsoDate(fecha: Date): string;
//# sourceMappingURL=fsDate.d.ts.map