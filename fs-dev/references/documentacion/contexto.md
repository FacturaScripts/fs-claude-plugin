# Contenido de Doc/Context

`Doc/Context/` guarda **por qué el código es como es**: lo que no se entiende leyendo una sola clase. Lo leen el
equipo y los agentes antes de cambiar el plugin o el core, así que cada archivo tiene que servir para trabajar, no para
contar la historia completa. Esta guía la usa `fs-dev:context-writer` para rellenarlo a partir del historial git y del
código.

## Estructura

```
Doc/Context/
├── README.md                  # índice: una línea por archivo con qué responde
├── 01-arquitectura.md         # piezas del plugin y cómo encajan
├── 02-modelo-de-datos.md      # tablas, modelos y relaciones
├── 03-<flujo-principal>.md    # un archivo por cada flujo o tema importante
├── ...
├── NN-evolucion.md            # etapas del código según el historial
└── Decisiones/
    ├── 0001-<titulo>.md       # una decisión por archivo
    └── ...
```

- Los temas se numeran `NN-tema.md` en el orden en que conviene leerlos; los nombres van en minúsculas, sin acentos y
  con guiones. Divide un tema en varios archivos (o en una subcarpeta) cuando pase de unas 200 líneas.
- No hace falta tener todos los temas: crea solo los que el plugin justifica. Un plugin pequeño puede quedarse con la
  arquitectura, el modelo de datos y un par de decisiones.
- Las decisiones se numeran `NNNN-titulo.md` en orden cronológico.

## Temas habituales

| Tema | Qué responde |
|---|---|
| Arquitectura | Qué piezas tiene (modelos, tablas, controladores, extensiones, workers, cron, API, Mods, assets), qué hace cada una, de qué plugins depende (`require` del `facturascripts.ini`) y qué toca del core |
| Modelo de datos | Tablas y modelos, sus relaciones, los campos con significado no evidente, estados y códigos |
| Flujos | Cada proceso importante de principio a fin: qué lo dispara, qué clases intervienen, qué datos cambian y qué pasa si falla |
| Integraciones | Servicios externos, organismos, formatos de archivo y protocolos; entornos de pruebas y producción |
| Configuración | Ajustes del plugin (`Settings`, `Init.php`), valores por defecto y su efecto |
| Normativa | Leyes o especificaciones que el código implementa, con la versión y el artículo cuando el código o los commits los citan |
| Puntos delicados | Lo que se rompe con facilidad, compatibilidad con versiones del core, rendimiento, deuda conocida y las trampas que el historial muestra (errores corregidos varias veces) |
| Evolución | Etapas del código según el historial: versiones, cambios de enfoque, reescrituras, partes abandonadas |

## Formato de un tema

```markdown
# Título del tema

Una o dos frases con lo esencial.

## Cómo es hoy

Explicación con las rutas de los archivos implicados entre comillas invertidas (`Lib/Envio.php`) y, si ayuda, una
tabla o una lista de pasos.

## Por qué

Los motivos que dan el código, los commits o las issues, con el commit corto entre paréntesis (`a1b2c3d`). Si el
historial no explica un motivo, dilo así; no lo inventes.

## Al cambiarlo

Qué revisar o probar al tocar esta parte.
```

## Formato de una decisión

```markdown
# NNNN. Título de la decisión

- Fecha: AAAA-MM-DD (del commit que la introduce)
- Commits: `a1b2c3d`, `e4f5a6b`
- Estado: vigente | sustituida por [NNNN](NNNN-titulo.md)

## Contexto

Qué problema o necesidad había.

## Decisión

Qué se hizo y dónde está en el código.

## Alternativas

Las que se probaron o descartaron según el historial (código revertido, enfoques sustituidos). Si no consta ninguna,
omite el apartado.

## Consecuencias

Qué implica hoy para quien cambie el código.
```

Es una decisión lo que cambia cómo se trabaja con el código: elegir una librería, un formato o un enfoque, cambiar el
modelo de datos, sustituir una implementación, una restricción de compatibilidad o de normativa. No lo es un arreglo
puntual, una traducción o un cambio de estilo.

## Índice (README.md)

Conserva la introducción de la plantilla y sus secciones **Temas** y **Decisiones**, sustituyendo los textos de
«Todavía no hay...» por una lista con un enlace relativo y una línea por archivo que diga qué pregunta responde:

```markdown
## Temas

- [`01-arquitectura.md`](01-arquitectura.md): piezas del plugin, dependencias y qué extiende del core.
- [`02-modelo-de-datos.md`](02-modelo-de-datos.md): tablas, estados de un envío y relación con las facturas.

## Decisiones

- [`0001-firmar-con-xades.md`](Decisiones/0001-firmar-con-xades.md): por qué se firma con XAdES y no con PAdES.
```

## Reglas

- **Nada inventado.** Cada afirmación sale del código o del historial (mensaje, diff o issue enlazada). Lo que es una
  deducción se dice como tal («por el código, parece que...») y solo si aporta.
- **Manda el código.** Si un commit antiguo dice una cosa y el código actual otra, se documenta el código actual y el
  cambio va a la evolución o a una decisión.
- **Sin copiar código.** Se enlazan las rutas de los archivos; como mucho, una firma o una línea clave.
- **Sin datos sensibles.** Nunca copies del historial tokens, claves, contraseñas, certificados, URL con credenciales,
  correos o datos de clientes. Los autores de los commits no se nombran salvo que el usuario lo pida.
- **Sin rutas del equipo** (`/Users/...`, `C:\...`): solo rutas relativas a la raíz del plugin o del core.
- En español, frases cortas y directas, igual que el resto de la documentación de `Doc/`.
