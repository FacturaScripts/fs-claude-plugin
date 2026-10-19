---
name: docs-expert
description: "Busca y cita la documentación de usuario incluida de FacturaScripts y su catálogo de plugins. Úsala antes de afirmar cómo se hace algo en el ERP, qué menú usar o si una función es del core o de un plugin."
---

# Documentación de usuario de FacturaScripts

Responde a partir de la documentación de usuario incluida en [`../../references/docs/`](../../references/docs/) y, si la funcionalidad no forma parte del core, del catálogo de plugins de [`../../references/projects/`](../../references/projects/). Ambas rutas se resuelven respecto a este `SKILL.md`.

## Cómo está organizada la documentación

- `references/docs/` es una carpeta plana de artículos Markdown. Cada uno tiene un frontmatter con `title`, `url`, `permalink` y `lastmod`. El nombre del archivo coincide con el `permalink`.
- Los artículos se enlazan entre sí con URLs `https://facturascripts.com/publicaciones/<permalink>`. Para seguir un enlace, abre `references/docs/<permalink>.md`. Si ese archivo no existe, la publicación no está en la copia local: cita la URL y no afirmes que no hay documentación.
- Los artículos `menu-ventas`, `menu-compras`, `almacenes-128` (menú Almacén), `menu-contabilidad`, `menu-informes` y `primeros-pasos-303` son índices de área útiles para empezar.
- `references/projects/` contiene una ficha por plugin. Su frontmatter incluye `name`, `url`, `version`, `mincore`, `maxcore` (versiones del core compatibles), `require` (plugins de los que depende) y `min_php`. Los enlaces `https://facturascripts.com/plugins/<nombre>` corresponden a `references/projects/<Nombre>.md`; el nombre del archivo puede diferir en mayúsculas.

## Flujo

1. Busca los términos de la pregunta y sus sinónimos en `references/docs/` sin distinguir mayúsculas (por ejemplo `rg -i "recibo|vencimiento"` o la herramienta Grep con el patrón `recibo|vencimiento` y la opción de ignorar mayúsculas). Si la pregunta es amplia, empieza por el índice del área.
2. Lee completos los artículos relevantes y sigue los enlaces de "Ver también" cuando completen la respuesta.
3. Explica el procedimiento con los menús, botones y campos tal como aparecen en el artículo (por ejemplo `Ventas → Facturas`, botón **Nuevo**). Adapta la redacción a un trato de tú homogéneo, pero no cambies nombres de menús ni de campos, ni añadas pasos que el artículo no recoja.
4. Si el core no cubre la necesidad o el artículo remite a un plugin, busca en `references/projects/` y menciona como máximo tres plugins realmente pertinentes.
5. Cita cada fuente con su `title` y su `url` del frontmatter, no con el nombre del archivo.
6. Si no hay documentación ni plugin aplicable, dilo claramente y remite a <https://facturascripts.com/publicaciones> o al soporte oficial. No inventes el procedimiento.

## Cómo sugerir un plugin

- Deja claro que es una extensión opcional, no parte del core, y basa la descripción únicamente en lo que diga su ficha.
- Indica su URL (campo `url`), las dependencias de `require` y la compatibilidad de `mincore`–`maxcore`. Si `maxcore` es anterior a la versión del usuario o a la actual, advierte que puede no ser compatible.
- No afirmes si es gratuito o de pago salvo que la ficha lo diga.

Ejemplo: *"El programa base no incluye un punto de venta, pero existe el plugin **POS** (https://facturascripts.com/plugins/POS), que añade un TPV con arqueos, búsqueda por código de barras e impresión de tickets. Según su ficha necesita el plugin PrintTicket y es compatible con el core 2026.5 a 2026.7."*

## Alcance

- Esta skill cubre el **uso** del ERP: operaciones, configuración, instalación, actualización, usuarios, errores frecuentes, fiscalidad y contabilidad.
- Las preguntas de programación (crear plugins, modificar código, API REST para desarrolladores) corresponden a `fs-dev:docs-expert`, disponible si está instalado el plugin `fs-dev`.

## Compatibilidad de agentes

En Claude Code esta skill está precargada en los agentes `fs-user:docs-expert`, `fs-user:erp-guide` y `fs-user:reporting-analyst`. En Codex aplica estas instrucciones directamente; no depende de que existan los agentes Markdown de Claude.
