/**
 * Contrato de los filtros de rango de fecha.
 *
 * El riesgo de este diseño es que el inputSchema anuncie `<columna>_gte`/`_lte`
 * pero el handler no los reenvíe: la llamada no fallaría, simplemente devolvería
 * TODO sin filtrar, y el usuario creería que ha filtrado. Es el mismo fallo
 * silencioso que tenían `get_logmessages` y `get_emailsentes`.
 *
 * Por eso este test recorre TODAS las tools que reciben parámetros de rango y
 * comprueba, con el cliente HTTP interceptado, que cada handler los propaga de
 * verdad hasta la petición. Si alguien añade una tool nueva con columnas de fecha
 * y olvida el reenvío, esto falla.
 */
export {};
//# sourceMappingURL=dateRange.test.d.ts.map