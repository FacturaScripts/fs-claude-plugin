---
name: docs-writer
description: Escribe una página de documentación de uso o de programación de un plugin o del core de FacturaScripts, paso a paso, con capturas anotadas y anonimizadas, y la registra en Doc/forja.json.
---

# Redacción de documentación con capturas

Úsala cuando el usuario pida documentar cómo se hace algo en un plugin o en el core («créame la documentación de cómo
firmar una factura», «documenta cómo se configura...», «escribe la página de desarrollo para extender...») o toda la
documentación de un plugin. Cada página va en `Doc/User/` (uso) o `Doc/Dev/` (programación), sus capturas en
`Doc/Assets/<nombre-de-la-página>/` y sus datos en `Doc/forja.json`. Para crear o revisar solo la estructura de
`Doc/`, usa `fs-dev:crear-documentacion`.

Usa como instrucciones de especialidad el perfil [`../../agents/docs-writer.md`](../../agents/docs-writer.md) y léelo
completo antes de actuar, junto con la [guía de estilo](../../references/documentacion/guia-de-estilo.md), el
[formato del escenario de capturas](../../references/documentacion/escenario-de-capturas.md) y la
[instalación de pruebas](../../references/documentacion/instalacion-de-pruebas.md).

## Rutas de los scripts

Los scripts están en [`../../scripts/`](../../scripts/), relativa a este `SKILL.md`; en Claude Code equivale a
`${CLAUDE_PLUGIN_ROOT}/scripts/`. La variable `CLAUDE_PLUGIN_ROOT` no existe en el entorno de Bash: resuelve antes la
ruta absoluta de la carpeta y úsala entre comillas. En los ejemplos, `<scripts>` representa esa ruta.

```bash
python3 "<scripts>/doc-screenshots.py" "<escenario.json>" --check
FS_DOC_USER='<usuario>' FS_DOC_PASSWORD='<contraseña>' python3 "<scripts>/doc-screenshots.py" "<escenario.json>" --scan
FS_DOC_USER='<usuario>' FS_DOC_PASSWORD='<contraseña>' python3 "<scripts>/doc-screenshots.py" "<escenario.json>"
python3 "<scripts>/create-doc-structure.py" "<plugin o core>" --check
```

El script de capturas necesita Python 3 y Google Chrome o Chromium; no instala nada.

## Antes de capturar

1. **Instalación de pruebas.** Si la petición no dice cuál usar, pregunta al usuario con tres opciones: usar una
   instalación de pruebas que ya tenga (URL y usuario), crear una desechable o usar solo los datos existentes sin
   cambiar nada. Cómo crear la desechable y dejarla limpia (una sola empresa, solo los plugins que se documentan,
   entorno de pruebas en todos los sistemas que comunican con un organismo, el correo hacia un servidor local de
   pruebas y `FS_DEBUG` desactivado) está en la
   [instalación de pruebas](../../references/documentacion/instalacion-de-pruebas.md). Nunca se ejecuta el cron ni
   una acción que envíe a producción; comprueba antes que no hay nada pendiente de enviar a producción.
2. **Plan de datos.** Haz una tabla con cada estado que hay que enseñar (antes y después de cada acción) y el registro
   concreto que lo muestra. Si hay varias páginas o varios redactores, reserva registros distintos para cada uno, para
   que la acción de uno no cambie el estado que necesita otro.

## Documentación completa de un plugin

Cuando el usuario pide toda la documentación de un plugin (varias páginas), tú coordinas:

1. **Inventario.** Pantallas, acciones y configuración del plugin (controladores, XMLView, `Init.php`,
   `Translation/es_ES.json`), las páginas que ya hay en `Doc/User`, `Doc/Dev` y `Doc/forja.json` y las **publicadas**
   en la web: léelas de la forja con `forja_list_publications` (tipos `user` y `dev`) y `forja_download_docs` de
   fs-mcp (la skill `fs-dev:sincronizar-forja` explica cómo), o de la web del plugin si no hay acceso.
2. **Índice.** Diseña el árbol de páginas y propónselo al usuario antes de escribir:

   | Archivo | `title` | `parent` | `ordernum` | `permalink` |
   |---|---|---|---|---|
   | `configuracion.md` | Cómo configurar el plugin | | 10 | `configuracion` |
   | `enviar-facturas.md` | Cómo enviar facturas | `configuracion.md` | 20 | `enviar-facturas` |

   `parent` es el nombre de archivo con `.md`; deja huecos en `ordernum` (10, 20, 30...) para insertar páginas
   después. **Conserva los permalinks ya publicados**: la forja reconoce la página por ellos y no deja cambiarlos.
3. **Instalación y plan de datos** comunes (ver [Antes de capturar](#antes-de-capturar)), con los registros reservados
   para cada página.
4. **Reparto.** Si repartes las páginas entre varios redactores en paralelo, dales a todos el mismo **briefing**: el
   índice completo (nombre de archivo, título, permalink y padre de cada página, para los enlaces de «Ver también»),
   la instalación y cómo obtener las credenciales sin escribirlas en ningún archivo, los registros reservados a cada
   uno, los textos literales de la interfaz que se repiten (con su traducción `es_ES`), la convención de marcas de la
   guía de estilo, las reglas de producción y qué deben devolver: la página, sus imágenes, su entrada de `forja.json`
   en JSON, lo que no han podido comprobar y los hallazgos. Los redactores **no tocan `Doc/forja.json`** ni las
   páginas de otros.
5. **Unión y validación.** Junta las entradas en `Doc/forja.json` y normalízalas (`visibility` booleano, `parent` con
   `.md`, `controllers` sin espacios, `ordernum` del índice, iconos y colores coherentes). Revisa cada página: marcas
   en el orden del texto, sin claves de traducción, sin notas internas, sin la marca, enlaces a páginas que existen y
   afirmaciones comprobadas en el código. Valida con `create-doc-structure.py --check` y con
   `forja-doc-bundle.py pack` sobre todas las páginas, y revisa las imágenes.
6. **Hallazgos.** Reúne en tu informe, aparte de la documentación, los fallos del plugin encontrados al documentar
   (con archivo y línea si se conocen) y propón al usuario corregirlos; la documentación no los arregla ni los
   menciona como notas.

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-dev:docs-writer` cuando esté disponible. Si el agente devuelve una
  pregunta (por ejemplo, la instalación de pruebas o sus credenciales), házsela al usuario y vuelve a delegar con la
  respuesta. En una documentación completa, lanza un agente por página o grupo de páginas con el briefing común.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico. Si en Codex delegas en un subagente, pide
  el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalente al `model: sonnet` del perfil; si
  tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.

Antes de terminar, muestra al usuario las capturas generadas para que confirme que no queda ningún dato real y que las
marcas son correctas.
