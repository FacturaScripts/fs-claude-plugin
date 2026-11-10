/**
 * Vigencia por versión de modelos y columnas.
 *
 * Responde a "¿para qué versión publicada es válida esta información?" leyendo
 * las tablas XML en cada tag del repositorio que las aporta (el core o un
 * plugin). Se lee de los objetos de git, nunca del árbol de trabajo, así que un
 * cambio sin publicar no se confunde con una versión.
 *
 * Decisiones que conviene no deshacer sin motivo:
 *
 *   - Barrido de TODOS los tags, no bisección. La bisección supone que una
 *     columna vive en un único intervalo; el barrido no supone nada y cuesta
 *     poco (todas las tablas del core en todos sus tags se leen en menos de un
 *     segundo, porque van en una sola llamada a `git cat-file --batch`).
 *   - La versión de cada tag es la que declara su código: `Kernel::version()` en
 *     el core y `version` del `facturascripts.ini` en un plugin, con el nombre
 *     del tag como respaldo. Se compara como decimal (2025.11 es anterior a
 *     2025.2), igual que hace el core.
 *   - Cuentan los tags cuya versión es menor o igual que la que declara HEAD.
 *     Se acota por versión y no por ascendencia porque una versión publicada
 *     puede vivir en una rama lateral (un parche sobre una versión anterior) y
 *     no ser ancestro de HEAD; aun así es historia publicada. Y si se genera
 *     desde un commit antiguo, las versiones posteriores siguen quedando fuera.
 *   - Sin historial no se inventa: el tramo sale como `unknown`.
 */
import { type TableColumn } from './table-xml.js';
import type { Availability } from './types.js';
export type Source = Availability['source'];
/** Cómo organiza sus tablas cada tipo de repositorio. */
export type Layout = 'core' | 'plugin';
export interface TagVersion {
    tag: string;
    /** La versión tal como se declara, para enseñarla. */
    version: string;
    /** La misma versión como decimal, para ordenar y comparar. */
    value: number;
}
export interface ColumnHistory {
    /** Presencia de la columna en cada versión de `SourceHistory.versions`. */
    present: boolean[];
    /** Su definición en la última versión que la tiene. */
    last: TableColumn;
}
export interface SourceHistory {
    source: Source;
    /** Versiones publicadas, de la más antigua a la más reciente. Vacío: sin historial. */
    versions: TagVersion[];
    /** Por tabla: en qué versiones la define esta fuente (no cuenta extenderla). */
    tables: Map<string, boolean[]>;
    /** Por tabla y columna: en qué versiones la aporta esta fuente, como tabla propia o por extensión. */
    columns: Map<string, Map<string, ColumnHistory>>;
}
/**
 * Las versiones publicadas de un repositorio hasta la que declara HEAD,
 * ordenadas como decimales. Un tag cuya versión no se puede leer ni deducir de
 * su nombre se omite. Si HEAD no declara versión, no hay tope.
 */
export declare function readTagVersions(dir: string, layout: Layout): TagVersion[];
/**
 * Recorre las tablas (propias y extensiones) de un repositorio en todas sus
 * versiones publicadas.
 */
export declare function loadSourceHistory(dir: string, source: Source, layout: Layout): SourceHistory;
/**
 * Tramos de una columna. `current` es quien la aporta en el código generado; se
 * omite para una columna retirada.
 */
export declare function columnAvailability(table: string, column: string, histories: SourceHistory[], current?: Source): Availability[];
/** Tramos de la tabla de un modelo, según la fuente que la define. */
export declare function modelAvailability(table: string, owner: Source, histories: SourceHistory[]): Availability[];
/**
 * Columnas que alguna fuente tuvo en una versión publicada y ya no están en el
 * código generado, con su definición en la última versión que las tenía.
 */
export declare function retiredColumns(table: string, current: ReadonlySet<string>, histories: SourceHistory[]): Array<{
    column: TableColumn;
    availability: Availability[];
}>;
/** El historial de cada fuente que aparece en unos tramos. */
export declare function versionsSummary(spans: Availability[], histories: SourceHistory[]): Record<string, {
    latest: string;
    tags: number;
} | {
    unknown: true;
}>;
//# sourceMappingURL=availability.d.ts.map