/**
 * Tipos para la metadata de modelos de FacturaScripts.
 *
 * Esta metadata describe las columnas de cada modelo con información suficiente
 * para que el asistente pueda interpretar los datos devueltos por la API,
 * cruzar tablas por sus relaciones y generar informes complejos sin adivinar.
 *
 * La fuente de la metadata es una combinación de archivos del core de
 * FacturaScripts (Core/Table/*.xml, Core/XMLView/*.xml, Core/Translation/*.json)
 * procesados por `scripts/generate-metadata.ts`.
 */

/**
 * Tipo lógico de la columna, normalizado desde el tipo SQL de FacturaScripts.
 */
export type TsType = 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'time' | 'text';

/**
 * Tipos de widget soportados por FacturaScripts en las vistas XMLView.
 * Se incluyen los más comunes; cualquier otro se mapea a 'text'.
 */
export type WidgetType =
    | 'text'
    | 'select'
    | 'number'
    | 'money'
    | 'date'
    | 'datetime'
    | 'checkbox'
    | 'textarea'
    | 'email'
    | 'link'
    | 'password'
    | 'color'
    | 'file'
    | 'autocomplete'
    | 'subcuenta';

export interface ForeignKey {
    table: string;
    column: string;
    onDelete: 'SET NULL' | 'CASCADE' | 'RESTRICT' | 'NO ACTION';
    onUpdate: 'SET NULL' | 'CASCADE' | 'RESTRICT' | 'NO ACTION';
}

/**
 * Un tramo de vigencia: entre qué versiones publicadas existe un modelo o una
 * columna, según quien la aporta. Las versiones son las que declara cada fuente
 * (`Kernel::version()` en el core, `version` del `facturascripts.ini` en un
 * plugin), se guardan tal cual ("3.40", no 3.4) y se comparan como decimales.
 *
 * Una columna puede tener varios tramos: si pasa de un plugin a otro, cada uno
 * aporta el suyo. Leer un único desde/hasta la daría por retirada estando viva.
 */
export interface Availability {
    /** Quién la aporta en este tramo, con el mismo formato que `ModelMetadata.source`. */
    source: 'core' | `plugin:${string}`;
    /** Primera versión publicada que la tiene. */
    since?: string;
    /** Ya estaba en la versión más antigua con tag: `since` es un "como muy tarde". */
    sinceFirstTag?: true;
    /** Última versión publicada que la tiene (inclusiva). Ausente: sigue en la última. */
    until?: string;
    /** Está en el código generado pero en ninguna versión publicada todavía. */
    unreleased?: true;
    /** Quien la aporta no tiene historial de versiones: el rango no se conoce. */
    unknown?: true;
}

export interface ColumnMetadata {
    /** Nombre físico de la columna en la base de datos. */
    name: string;
    /** Tipo SQL tal como aparece en el XML de la tabla (ej: "character varying(30)"). */
    sqlType: string;
    /** Tipo lógico normalizado. */
    tsType: TsType;
    /** Longitud máxima para strings; ausente si no aplica. */
    maxLength?: number;
    /** Si la columna acepta NULL. */
    nullable: boolean;
    /** Valor por defecto definido en el XML de la tabla. */
    default?: string | number | boolean;
    /** Si la columna forma parte de la clave primaria. */
    isPrimaryKey: boolean;
    /**
     * Si la columna es de solo lectura desde el cliente (auto-generada, calculada,
     * o marcada como readonly en la XMLView).
     */
    isReadonly: boolean;
    /**
     * Si la columna es obligatoria al crear un registro. Se deriva de NOT NULL sin
     * default o de `required="true"` en la XMLView.
     */
    isRequired: boolean;
    /** Label amigable traducido (cae al nombre del campo si no hay traducción). */
    label: string;
    /**
     * Descripción corta y orientada a reporting de qué guarda la columna.
     * Se omite si no hay información amigable disponible.
     */
    description?: string;
    /** Tipo de widget UI usado en la vista de edición. */
    widget?: WidgetType;
    /** Relación foreign key si la columna referencia otra tabla. */
    foreignKey?: ForeignKey;
    /** Valores enumerados literales si la XMLView los declara. */
    enumValues?: string[];
    /** Tramos de versiones publicadas en los que existe la columna. */
    availability?: Availability[];
}

/**
 * Relación inversa: qué tablas tienen una FK apuntando a este modelo
 * (hasMany) o qué modelos referencia este (belongsTo, redundante con
 * ColumnMetadata.foreignKey pero expuesto aquí para lectura rápida).
 */
export interface Relation {
    type: 'belongsTo' | 'hasMany';
    /** Nombre del modelo relacionado (singular, snake_case). */
    targetModel: string;
    /** Nombre físico de la tabla relacionada. */
    targetTable: string;
    /** Columna en este modelo. */
    localColumn: string;
    /** Columna en el modelo relacionado. */
    remoteColumn: string;
}

export interface ModelMetadata {
    /** Nombre del modelo en singular, snake_case (ej: "factura_cliente"). */
    name: string;
    /** Nombre físico de la tabla en la base de datos (ej: "facturascli"). */
    table: string;
    /** Endpoint REST en la API (ej: "/facturaclientes"). */
    endpoint: string;
    /** Nombre de la columna que actúa como clave primaria. */
    primaryKey: string;
    /** Descripción corta de qué representa el modelo en el negocio. */
    description: string;
    /** Origen de la metadata: core de FS o un plugin concreto. */
    source: 'core' | `plugin:${string}`;
    columns: ColumnMetadata[];
    relations: Relation[];
    /** Tramos de versiones publicadas en los que existe la tabla del modelo. */
    availability?: Availability[];
    /**
     * Columnas que existieron en alguna versión publicada y ya no están. Van
     * aparte de `columns` a propósito: todo lo que construye filtros, campos o
     * comprobaciones a partir de `columns` sigue viendo solo columnas vigentes.
     */
    retiredColumns?: ColumnMetadata[];
    /** Trazabilidad de la generación. */
    generatedFrom: {
        facturascriptsCommit?: string;
        facturascriptsVersion?: string;
        generatedAt: string;
        /**
         * Historial consultado por cada fuente que aparece en la vigencia: la
         * última versión publicada y cuántas se recorrieron, o que no lo tiene.
         */
        versions?: Record<string, { latest: string; tags: number } | { unknown: true }>;
    };
}
