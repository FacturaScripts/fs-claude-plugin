/**
 * Lectura de las tablas XML de FacturaScripts (`Table/*.xml`, `Extension/Table/*.xml`).
 *
 * Vive aparte del generador porque lo usan dos sitios: el generador, para el estado
 * actual, y el cálculo de vigencia, para el mismo XML en cada versión publicada. Un
 * solo parser garantiza que los dos ven las mismas columnas.
 */
export interface TableColumn {
    name: string;
    type: string;
    nullable: boolean;
    default?: string;
    /** Quién aporta la columna (lo fija quien carga la tabla, no el parser). */
    source?: 'core' | `plugin:${string}`;
}
export interface TableForeignKey {
    localColumn: string;
    remoteTable: string;
    remoteColumn: string;
    onDelete: 'SET NULL' | 'CASCADE' | 'RESTRICT' | 'NO ACTION';
    onUpdate: 'SET NULL' | 'CASCADE' | 'RESTRICT' | 'NO ACTION';
}
export interface TableDefinition {
    columns: TableColumn[];
    primaryKey: string[];
    foreignKeys: TableForeignKey[];
    uniqueConstraints: string[][];
    /** Quién define la tabla (lo fija quien la carga, no el parser). */
    source?: 'core' | `plugin:${string}`;
}
export declare function parseTableXml(xml: string): TableDefinition;
//# sourceMappingURL=table-xml.d.ts.map