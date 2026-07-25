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

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { esFechaValida, parseFsDate, toIsoDate } from './fsDate.js';

/** Compara solo la parte de fecha, para no depender de la zona horaria. */
function iso(value: unknown): string {
    return toIsoDate(parseFsDate(value));
}

describe('parseFsDate', () => {
    it('interpreta d-m-Y (el formato que devuelve la API), no MM-DD-YYYY', () => {
        // Con new Date() esto daba el 1 de abril: el bug que se está corrigiendo.
        assert.equal(iso('04-01-2023'), '2023-01-04');
        assert.equal(iso('01-09-2025'), '2025-09-01');
    });

    it('acepta días > 12, que antes daban Invalid Date y se perdían del cálculo', () => {
        assert.equal(iso('19-08-2025'), '2025-08-19');
        assert.equal(iso('31-12-2024'), '2024-12-31');
    });

    it('acepta d-m-Y con hora', () => {
        const d = parseFsDate('01-09-2025 10:48:33');
        assert.equal(toIsoDate(d), '2025-09-01');
        assert.equal(d.getHours(), 10);
        assert.equal(d.getMinutes(), 48);
        assert.equal(d.getSeconds(), 33);
    });

    it('acepta el separador de barra (estilo de fecha configurable en FS)', () => {
        assert.equal(iso('04/01/2023'), '2023-01-04');
        assert.equal(iso('19/08/2025'), '2025-08-19');
    });

    it('acepta ISO, que es lo que admite la API en los filtros', () => {
        assert.equal(iso('2023-01-04'), '2023-01-04');
        assert.equal(iso('2025-08-19'), '2025-08-19');
        assert.equal(iso('2025-09-01T10:48:33'), '2025-09-01');
    });

    it('devuelve la misma instancia si ya es un Date', () => {
        const d = new Date(2023, 0, 4);
        assert.equal(parseFsDate(d), d);
    });

    it('devuelve Invalid Date con valores no interpretables', () => {
        for (const v of [null, undefined, '', '   ', 42, {}, 'ayer', '16:14:10']) {
            assert.ok(Number.isNaN(parseFsDate(v).getTime()), `debería ser inválido: ${String(v)}`);
        }
    });

    it('rechaza fechas que no existen en vez de desbordar al mes siguiente', () => {
        // new Date(2023, 1, 31) daría el 3 de marzo sin avisar.
        assert.ok(Number.isNaN(parseFsDate('31-02-2023').getTime()));
        assert.ok(Number.isNaN(parseFsDate('00-01-2023').getTime()));
        assert.ok(Number.isNaN(parseFsDate('01-13-2023').getTime()));
    });

    it('ordena correctamente, que es de lo que dependen los rangos de los KPI', () => {
        const enero = parseFsDate('04-01-2023');
        const agosto = parseFsDate('19-08-2025');
        assert.ok(enero < agosto);
    });
});

describe('esFechaValida', () => {
    it('distingue las fechas interpretables de las que no', () => {
        assert.equal(esFechaValida('19-08-2025'), true);
        assert.equal(esFechaValida('2025-08-19'), true);
        assert.equal(esFechaValida(null), false);
        assert.equal(esFechaValida('16:14:10'), false);
    });
});

describe('toIsoDate', () => {
    it('formatea en hora local, sin el desplazamiento de zona de toISOString', () => {
        // A medianoche local, toISOString() puede devolver el día anterior.
        assert.equal(toIsoDate(new Date(2025, 0, 1, 0, 0, 0)), '2025-01-01');
        assert.equal(toIsoDate(new Date(2025, 11, 31, 23, 59, 59)), '2025-12-31');
    });
});
