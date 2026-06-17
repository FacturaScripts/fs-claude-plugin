---
name: skill-notice
description: >
  Redacta en pantalla (sin crear ningún archivo) un texto en formato markdown, listo para copiar
  y pegar, que explica las novedades, mejoras y correcciones de un plugin o proyecto de
  FacturaScripts a partir de un rango de commits o de versiones. Activa esta skill siempre que el
  usuario pida "redacta las novedades", "escribe la noticia de los cambios", "genera el changelog",
  "qué ha cambiado desde la versión X", "resume los cambios entre la versión X y la Y", "prepara el
  anuncio de la nueva versión", o cualquier variación en la que se pida comunicar qué se ha hecho en
  un rango de commits o entre dos versiones.
---

# Noticia de cambios (changelog) — Buenas prácticas

El objetivo de esta skill es redactar un texto claro y atractivo que comunique a usuarios y clientes
**qué hay de nuevo** en una versión: nuevas funcionalidades, mejoras y correcciones de errores. El
texto está pensado para publicarse (en la forja de FacturaScripts, en un changelog, en una nota de
lanzamiento o en redes), por lo que debe ser comprensible para quien usa el ERP, no solo para quien
programa.

## Reglas fundamentales

1. **No crees ningún archivo.** El resultado se muestra **directamente en el chat**, dentro de un
   bloque de código markdown, para que el usuario lo copie y lo pegue donde quiera. Nunca escribas
   el texto en un fichero del proyecto salvo que el usuario lo pida explícitamente.
2. **Acota el rango.** El usuario indicará el alcance de los cambios, normalmente de una de estas
   formas:
   - Por **versiones**: "desde la versión 1.1.0 hasta la 1.2.0".
   - Por **commits**: "desde el commit `abc123` hasta `HEAD`".
   - Por **referencia temporal**: "los cambios de la última semana", "desde el último release".
   Si no indica rango, **pregúntale** desde qué versión/commit hasta cuál quiere la noticia.
3. **Redacta orientado al usuario, no al desarrollador.** Traduce los cambios técnicos a beneficios
   y comportamientos visibles. Por ejemplo, en lugar de "refactor del Calculator", escribe "los
   totales de las facturas ahora se recalculan correctamente al cambiar la serie".

## Flujo de trabajo

Cuando el usuario pida la noticia de cambios, sigue este orden:

1. **Determina el rango de commits.** Según lo que indique el usuario:
   - Entre dos versiones (si están etiquetadas como tags de git):
     ```
     git log v1.1.0..v1.2.0 --pretty=format:"%h %s" --no-merges
     ```
   - Entre dos commits:
     ```
     git log abc123..def456 --pretty=format:"%h %s" --no-merges
     ```
   - Desde el último tag hasta ahora:
     ```
     git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%h %s" --no-merges
     ```
   - Por fecha:
     ```
     git log --since="2026-06-01" --pretty=format:"%h %s" --no-merges
     ```

   > Si las versiones que da el usuario **no son tags de git** (por ejemplo, solo aparecen en el
   > `facturascripts.ini` del plugin), localiza los commits donde se actualizó el número de versión
   > en ese archivo y usa esos commits como límites del rango.

2. **Revisa el contenido de los commits**, no solo los títulos. Cuando un título no sea claro, mira
   el cuerpo del commit o el diff (`git show <hash>`) para entender qué cambió de verdad.

3. **Clasifica cada cambio** en una de estas categorías (omite las categorías que queden vacías):
   - 🚀 **Novedades**: nuevas funcionalidades o características (commits `feat`).
   - ✨ **Mejoras**: optimizaciones, cambios de comportamiento, rendimiento, refactors visibles
     (commits `perf`, `refactor`, y `feat` menores).
   - 🐛 **Correcciones**: errores resueltos (commits `fix`).
   - 🔧 **Otros / mantenimiento**: solo si es relevante para el usuario (dependencias, compatibilidad,
     documentación destacada). Ignora `chore`, `style` y `test` puramente internos.

4. **Filtra el ruido.** No incluyas commits irrelevantes para quien usa el ERP: ajustes de estilo de
   código, cambios en tests, merges, retoques internos sin efecto visible. Agrupa cambios repetidos
   o relacionados en una sola línea.

5. **Redacta el texto** en español, en pasado o presente impersonal, con frases breves. Cada punto
   empieza en mayúscula, sin punto final, en lenguaje cercano.

6. **Muestra el resultado en pantalla** dentro de un bloque de código markdown para que se copie tal
   cual.

## Formato de salida

Devuelve siempre la noticia dentro de un bloque de código markdown como este (adáptalo al nombre del
plugin y a la versión):

````markdown
## NombreDelPlugin 1.2.0

### 🚀 Novedades
- Nuevo informe de antigüedad de cobros con prioridades de seguimiento
- Posibilidad de filtrar las facturas por fecha de pago

### ✨ Mejoras
- Los totales de los documentos se recalculan automáticamente al cambiar la serie
- Carga más rápida del listado de productos con muchas variantes

### 🐛 Correcciones
- Corregido el cálculo del IVA en el informe trimestral
- Solucionado un error que impedía guardar clientes sin email
````

### Notas sobre el formato

- Usa el **nombre real del plugin** y el **número de versión** de destino en el encabezado. Si la
  noticia abarca varias versiones, puedes poner un rango (`## NombrePlugin 1.1.0 → 1.2.0`) o una
  sección por versión.
- Mantén solo las categorías que tengan contenido.
- Si el rango no tiene cambios relevantes para el usuario, indícalo claramente en lugar de inventar
  puntos.
- Si el usuario quiere un tono más comercial (para un anuncio) o más escueto (para un changelog
  técnico), ajústalo manteniendo siempre la salida en un bloque de código markdown copiable.
