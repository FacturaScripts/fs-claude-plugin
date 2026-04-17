---
name: skill-commit
description: >
  Buenas prácticas para crear commits de git claros, atómicos y bien estructurados en español.
  Activa esta skill siempre que el usuario pida hacer un commit, confirmar cambios, guardar cambios
  en git, o cualquier variación de "haz commit", "commitea", "sube los cambios", "guarda en git",
  "git commit", etc. También cuando el usuario pida revisar o mejorar un mensaje de commit existente.
---

# Commits en Git — Buenas Prácticas

El objetivo de un buen commit es que cualquier persona del equipo (o tú mismo dentro de 6 meses) pueda entender qué se cambió y por qué con solo leer el historial de git. Un commit bien hecho facilita las revisiones de código, simplifica los reverts y hace que el proyecto sea más mantenible.

## Estructura del mensaje de commit

Usa el formato de **Conventional Commits** adaptado al español:

```
<tipo>(<ámbito>): <descripción breve>

<cuerpo opcional>

<pie opcional>
```

**Ejemplo 1:**
```
feat(facturas): añadir campo de descuento por pronto pago

Se añade un nuevo campo en el modelo de factura que permite
aplicar un porcentaje de descuento cuando el cliente paga
antes de la fecha de vencimiento.
```

**Ejemplo 2:**
```
fix(informes): corregir cálculo de IVA en informe trimestral

El IVA se estaba calculando sobre el total con descuento en
lugar de sobre la base imponible. Ahora se aplica correctamente.
```

**Ejemplo 3 (simple):**
```
docs(readme): actualizar instrucciones de instalación
```

## Código de tarea en el commit

Cuando el usuario proporcione un **código de tarea** (por ejemplo, un número de issue o tarea del roadmap como `4543`, `#1234`, `TASK-567`, etc.), este código debe incluirse en el **título del commit**, justo después del tipo (y ámbito si lo hay), antes de la descripción. Solo se incluye el código numérico o identificador, sin enlaces ni texto adicional.

**Formato con código de tarea:**
```
<tipo>: <código> <descripción breve>
```

**Formato con código de tarea y ámbito:**
```
<tipo>(<ámbito>): <código> <descripción breve>
```

**Ejemplos con código de tarea:**
```
feat: 4543 añadir filtro por fecha de pago en las listas de anticipos de clientes y proveedores
```

```
fix: 1287 corregir cálculo de IVA en informe trimestral
```

```
feat(facturas): 3201 añadir campo de descuento por pronto pago
```

Si el usuario no menciona ningún código de tarea, el commit se escribe sin él, siguiendo el formato estándar.

## Tipos de commit

Estos son los tipos que debes usar. Elegir el tipo correcto ayuda a generar changelogs automáticos y a entender el historial de un vistazo:

- **feat**: nueva funcionalidad o característica
- **fix**: corrección de un error o bug
- **docs**: cambios solo en documentación
- **style**: formato, punto y coma faltante, etc. (sin cambios en lógica)
- **refactor**: reestructuración de código sin cambiar comportamiento
- **test**: añadir o corregir tests
- **chore**: tareas de mantenimiento (dependencias, configuración, CI, etc.)
- **perf**: mejora de rendimiento

## Reglas para un buen mensaje

La primera línea es lo más importante porque es lo que aparece en `git log --oneline`, en las interfaces de GitHub y en las revisiones de código:

- Escríbela en **imperativo**: "añadir", "corregir", "eliminar" (no "añadido", "corregido")
- Máximo **72 caracteres** en la primera línea
- No termines con punto la primera línea
- Escribe en **minúsculas** (salvo nombres propios o acrónimos)

El cuerpo es opcional pero muy valioso cuando el cambio no es trivial. Úsalo para explicar el **por qué** del cambio, no solo el **qué** (el qué ya se ve en el diff). Sepáralo de la primera línea con una línea en blanco.

## Commits atómicos

Cada commit debería representar **un solo cambio lógico**. Esto es importante porque permite hacer `git revert` de un cambio concreto sin arrastrar otros, y hace que las revisiones de código sean mucho más fáciles de seguir.

Señales de que un commit es demasiado grande:
- Necesitas usar "y" en la descripción ("añadir campo X **y** corregir validación Y")
- Mezcla cambios funcionales con cambios de formato
- Toca muchos archivos sin relación entre sí

Si tienes cambios mezclados en tu directorio de trabajo, usa `git add -p` para seleccionar solo los cambios relevantes para cada commit.

## Qué NO incluir en un commit

Antes de confirmar, revisa que no estés incluyendo archivos que no deberían estar en el repositorio:

- Archivos `.env` o con credenciales
- Archivos binarios grandes o compilados
- Carpetas como `node_modules/`, `vendor/`, `__pycache__/`
- Archivos temporales o de IDE (`.idea/`, `.vscode/settings.json` personales)

## Flujo al hacer commit

Cuando el usuario pida hacer un commit, sigue este orden:

1. Ejecuta `git status` para ver los archivos modificados y sin seguimiento
2. Ejecuta `git diff` (staged y unstaged) para entender los cambios
3. Ejecuta `git log --oneline -5` para ver el estilo de commits recientes del proyecto
4. Analiza los cambios y redacta un mensaje de commit que siga las convenciones anteriores
5. Haz staging solo de los archivos relevantes (evita `git add .` a ciegas)
6. Crea el commit con el mensaje bien formateado
7. Añade siempre al final: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

Si los cambios incluyen múltiples temas distintos, propón dividirlos en varios commits separados.
