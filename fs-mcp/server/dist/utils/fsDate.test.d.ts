/**
 * Tests del parseo de fechas de la API de FacturaScripts.
 *
 * Se ejecutan con el runner integrado de Node (sin dependencias nuevas):
 *   npm test
 *
 * El caso crítico es el primero: `new Date('04-01-2023')` devolvía el 1 de ABRIL
 * (mes y día intercambiados) y `new Date('19-08-2025')` devolvía Invalid Date,
 * ambos en silencio. Eso falseaba todos los KPI que filtran o agrupan por fecha.
 */
export {};
//# sourceMappingURL=fsDate.test.d.ts.map