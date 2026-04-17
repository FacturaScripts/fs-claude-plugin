---
name: skill-pull-request
description: >
  Buenas prácticas para crear pull requests bien estructurados en español, incluyendo la creación
  de ramas con convención de nombres y enlaces a tareas del roadmap de FacturaScripts.
  Activa esta skill siempre que el usuario pida crear un pull request, una PR, un merge request,
  crear una rama nueva, hacer push de una rama, o cualquier variación como "abre una PR", "crea el
  pull request", "sube la rama", "prepara la PR", "crea una rama para la tarea X", "branch para
  el issue X", etc. También cuando pida revisar o mejorar una PR existente.
---

# Pull Requests y Ramas — Buenas Prácticas

Un buen pull request cuenta una historia: qué problema resuelve, cómo lo resuelve y cómo se puede verificar. El objetivo es que el revisor entienda el contexto sin tener que adivinar, y que el historial del proyecto quede limpio y rastreable.

## Creación de ramas

La convención de nombres de rama ayuda a identificar de un vistazo de qué trata cada rama y a vincularla con su tarea correspondiente.

### Convención de nombres

Si el usuario proporciona un **número de tarea** (por ejemplo, 4544), el nombre de la rama debe comenzar con ese número seguido de una descripción corta en kebab-case:

```
<número-tarea>-<descripción-corta>
```

**Ejemplos:**
- Tarea 4544 sobre descuentos → `4544-descuento-pronto-pago`
- Tarea 3821 sobre informes → `3821-informe-trimestral-iva`
- Tarea 5102 sobre API → `5102-endpoint-clientes`

Si **no hay número de tarea**, usa solo la descripción descriptiva:
```
fix-calculo-iva-facturas
feat-exportar-csv-clientes
refactor-modelo-presupuestos
```

### Flujo al crear la rama

1. Asegúrate de estar en la rama base actualizada (`main` o `master`): `git checkout main && git pull`
2. Crea la nueva rama: `git checkout -b <nombre-rama>`
3. Si el usuario dio un número de tarea, confirma el nombre propuesto antes de crearla

## Estructura del Pull Request

Usa `gh pr create` con esta estructura:

```
gh pr create --title "<título>" --body "$(cat <<'EOF'
## Descripción
<Explicación clara de qué hace esta PR y por qué>

## Tarea relacionada
<Enlace a la tarea si hay número>

## Cambios realizados
<Lista breve de los cambios principales>

## Cómo probar
<Pasos para verificar que funciona correctamente>

🤖 Generado con [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Título de la PR

El título debe ser conciso (menos de 70 caracteres) y describir el cambio principal. Escríbelo en español y en imperativo, igual que los commits:

**Ejemplos:**
- "Añadir descuento por pronto pago en facturas"
- "Corregir cálculo de IVA en informe trimestral"
- "Refactorizar modelo de presupuestos"

### Enlace a tareas

Cuando el usuario proporciona un número de tarea, genera un enlace markdown al roadmap de FacturaScripts en la sección "Tarea relacionada":

```markdown
[Tarea #4544](https://facturascripts.com/roadmap/4544)
```

Esto permite navegar directamente a la tarea desde la PR. Si no hay número de tarea, omite la sección "Tarea relacionada".

### Sección de cambios realizados

Describe los cambios principales de forma breve pero suficiente para que el revisor tenga contexto antes de mirar el código. No repitas lo que ya dice el título; aporta detalle adicional. Si la PR toca varios archivos o áreas, agrúpalos lógicamente.

### Sección de cómo probar

Incluye pasos concretos y reproducibles. El revisor debería poder seguirlos sin conocimiento previo del cambio. Cosas como:

- "Crear una factura con fecha de vencimiento futura y verificar que aparece el campo de descuento"
- "Ejecutar `php artisan test --filter=IvaTest`"
- "Navegar a Informes > Trimestral y comprobar que el total de IVA coincide"

## Flujo completo al crear una PR

Cuando el usuario pida crear un pull request, sigue este orden:

1. Ejecuta `git status` para ver archivos pendientes (nunca uses `-uall`)
2. Ejecuta `git diff` para revisar los cambios staged y unstaged
3. Ejecuta `git log --oneline` y `git diff main...HEAD` para entender todos los commits de la rama
4. Verifica que la rama tiene un nombre correcto según las convenciones (si no, sugiere renombrarla)
5. Comprueba si la rama está subida al remoto; si no, haz `git push -u origin <rama>`
6. Redacta el título y cuerpo de la PR siguiendo la estructura anterior
7. Si el usuario mencionó un número de tarea, incluye el enlace `[Tarea #XXXX](https://facturascripts.com/roadmap/XXXX)`
8. Crea la PR con `gh pr create`
9. Muestra la URL resultante al usuario

## Buenas prácticas generales

Un buen pull request facilita la revisión de código y reduce la fricción en el equipo. Estas prácticas ayudan a que las revisiones sean más rápidas y productivas:

- Mantén las PRs **pequeñas y enfocadas** en un solo tema. Las PRs grandes son difíciles de revisar y tienen más probabilidad de introducir errores que pasen desapercibidos.
- Si una funcionalidad es grande, divídela en varias PRs incrementales.
- Asegúrate de que los **tests pasan** antes de crear la PR. Menciona en la sección de pruebas qué tests se ejecutaron.
- No incluyas cambios de formato o estilo mezclados con cambios funcionales; esos van en PRs separadas.
- Si la PR depende de otra PR que aún no se ha mergeado, indícalo claramente en la descripción.
