---
name: php-expert
description: >
  Usa este agente para escribir código PHP idiomático y de calidad en FacturaScripts: patrones
  PHP 8.0+ específicos del framework (Closures para extensiones, traits de modelos, herencia de
  ModelClass/ControllerClass), cumplimiento PSR-12, uso correcto de la clase Tools (noHtml,
  fixHtml, trans, log, date, money, settings), patrones de Init.php, refactorización de código
  PHP, resolución de errores y análisis de calidad con PHPStan y CS-Check.
---

# Skill: php-expert — Especialista en PHP para FacturaScripts

Esta skill conecta las tareas de código PHP del usuario con el agente `php-expert`,
que domina los patrones PHP específicos de FacturaScripts: la clase Tools, el sistema de
Closures para extensiones, Init.php, namespaces Dinamic/Core/Plugins, PSR-12 y tipado.

## Por qué usar el agente

El agente `php-expert` conoce las convenciones PHP propias de FacturaScripts que difieren
significativamente de Laravel o Symfony: las propiedades de modelos usan `@var` docblocks en
vez de typed properties, las extensiones usan Closures (no interfaces), `$this` dentro de un
Closure se refiere al objeto original, la clase Tools reemplaza muchas funciones nativas PHP,
y el patrón Init.php tiene sus propias reglas. Responder sin el agente introduce riesgo de
aplicar convenciones PHP genéricas que rompen el framework.

## Cómo invocar el agente

Usa el agente `php-expert` pasándole la tarea del usuario:

```
Agente: php-expert
Tarea: [descripción exacta de lo que necesita el usuario]
```

El agente:
1. Consulta la documentación en `./agents/docs/` (la-clase-tools, profundizando-en-el-core, el-archivo-init-php, gestion-de-errores)
2. Analiza el código existente del plugin para detectar patrones y problemas
3. Implementa o refactoriza el código siguiendo las convenciones de FacturaScripts
4. Verifica calidad con PHPStan y CS-Check

## Convenciones de estilo obligatorias

Estas reglas se aplican SIEMPRE al escribir o refactorizar código PHP en FacturaScripts:

### 1. Comentarios en español
- Todos los comentarios del código (inline, bloques y docblocks) se escriben en **español**.
- Documenta siempre que sea posible y tenga sentido: describe el propósito de clases, métodos,
  propiedades y bloques de lógica compleja.
- Los nombres de clases, métodos y variables siguen en inglés o en el idioma del framework,
  pero la documentación siempre va en español.

### 2. Ordenación de propiedades (variables de clase)
Dos grupos, en este orden:
- **Grupo 1 — public**: ordenadas alfabéticamente (A → Z).
- **Grupo 2 — protected/private**: juntas en un mismo bloque, ordenadas alfabéticamente (A → Z).

```php
class MiModelo extends ModelClass
{
    /** @var string descripción del campo activo */
    public $activo;

    /** @var string código único */
    public $codigo;

    /** @var string nombre del registro */
    public $nombre;

    /** @var array caché de resultados */
    private $cache = [];

    /** @var int contador interno */
    protected $contador;
}
```

### 3. Ordenación de métodos (funciones)
Misma lógica de dos grupos:
- **Grupo 1 — public**: ordenados alfabéticamente (A → Z).
- **Grupo 2 — protected/private**: juntos en un mismo bloque, ordenados alfabéticamente (A → Z).
- Excepción: los métodos mágicos (`__construct`, `__toString`, etc.) van al principio de su grupo.

```php
// Orden correcto de métodos:
// 1. public __construct()
// 2. public clear()
// 3. public install()
// 4. public primaryColumn()
// 5. public tableName()
// 6. public test()
// 7. private calcularTotal()
// 8. protected saveInsert()
// 9. protected saveUpdate()
// 10. private validarCodigo()
```

## Qué tareas activan esta skill

- "Revisa mi código PHP y dime si sigue las convenciones de FacturaScripts"
- "¿Cómo uso Tools::noHtml() vs Tools::fixHtml()?"
- "Refactoriza este modelo para usar los patrones correctos del framework"
- "¿Cómo registro una extensión en Init.php?"
- "¿Por qué mi Closure no accede al modelo correctamente?"
- "¿Cómo configuro PHPStan para mi plugin?"
- "Necesito sanitizar la entrada del usuario antes de guardar"
- "¿Cuál es el patrón correcto para el método validate()?"
- "¿Cómo uso Tools::log() con canales personalizados?"
- "¿Por qué debo importar desde Dinamic en vez de Core?"
- Cualquier pregunta sobre calidad, estilo o patrones PHP en FacturaScripts

## Cuándo NO activar esta skill

- Crear modelos completos con tabla y controlador → usa `backend-developer` o `fullstack-developer`
- Preguntas sobre consultas SQL o diseño de tablas → usa `sql-expert`
- Preguntas sobre testing y PHPUnit → usa `testing-expert`
- Preguntas sobre documentos de compra/venta → usa `document-expert`
- Preguntas conceptuales sobre documentación → usa `docs-expert`
