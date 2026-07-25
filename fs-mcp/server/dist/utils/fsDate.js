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
/** `d-m-Y` o `d/m/Y`, con hora opcional. */
const RE_DMY = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
/** ISO `Y-m-d`, con hora opcional. Lo aceptamos porque la API lo admite en los filtros. */
const RE_ISO = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
const FECHA_INVALIDA = () => new Date(NaN);
/**
 * Construye la fecha en hora LOCAL y comprueba que no haya desbordado (p. ej.
 * `31-02-2023`, que `new Date(2023, 1, 31)` convertiría en el 3 de marzo).
 */
function construir(anio, mes, dia, hora = 0, minuto = 0, segundo = 0) {
    if (mes < 1 || mes > 12 || dia < 1 || dia > 31)
        return FECHA_INVALIDA();
    const d = new Date(anio, mes - 1, dia, hora, minuto, segundo);
    const desbordado = d.getFullYear() !== anio || d.getMonth() !== mes - 1 || d.getDate() !== dia;
    return desbordado ? FECHA_INVALIDA() : d;
}
/** Convierte los grupos capturados (strings) a número, con 0 por defecto. */
function num(v) {
    return v === undefined ? 0 : Number(v);
}
/**
 * Convierte un valor de fecha de la API de FacturaScripts en un `Date`.
 * Acepta `d-m-Y`, `d/m/Y` e ISO `Y-m-d`, todos con hora opcional.
 */
export function parseFsDate(value) {
    if (value instanceof Date)
        return value;
    if (typeof value !== 'string')
        return FECHA_INVALIDA();
    const texto = value.trim();
    if (texto === '')
        return FECHA_INVALIDA();
    const dmy = RE_DMY.exec(texto);
    if (dmy) {
        return construir(num(dmy[3]), num(dmy[2]), num(dmy[1]), num(dmy[4]), num(dmy[5]), num(dmy[6]));
    }
    const iso = RE_ISO.exec(texto);
    if (iso) {
        return construir(num(iso[1]), num(iso[2]), num(iso[3]), num(iso[4]), num(iso[5]), num(iso[6]));
    }
    return FECHA_INVALIDA();
}
/** Indica si el valor es una fecha de FacturaScripts interpretable. */
export function esFechaValida(value) {
    return !Number.isNaN(parseFsDate(value).getTime());
}
/**
 * Formatea una fecha en ISO `YYYY-MM-DD` (hora local, sin desplazamiento de zona,
 * a diferencia de `toISOString()`). Es el formato que espera la API en los filtros.
 */
export function toIsoDate(fecha) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
//# sourceMappingURL=fsDate.js.map