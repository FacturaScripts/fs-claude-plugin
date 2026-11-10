# Guía de estilo de la documentación de FacturaScripts

Es el estilo de las páginas publicadas en facturascripts.com, que están copiadas en `fs-user/references/docs/` (uso) y
`fs-dev/references/docs/` (programación). Antes de escribir una página, lee dos o tres de ellas sobre un tema parecido
para copiar el tono; por ejemplo `autenticacion-en-2-pasos.md`, `como-enviar-facturas-por-email.md` o
`como-hacer-una-factura-rectificativa-o-devolucion.md` en uso, y `anadir-una-pestana-de-archivos-a-un-editcontroller.md`
en programación. Esas copias empiezan con un bloque `---` de metadatos de la web: las páginas de `Doc/` **no** lo
llevan, porque sus datos van en `Doc/forja.json`.

## Texto sin marca

La misma página se publica en facturascripts.com y en factura.city, y los usuarios de factura.city no conocen
FacturaScripts. Por eso el texto es agnóstico:

- **Nunca** escribas «FacturaScripts», «FS» ni «factura.city» (ni sus dominios). Habla de **el programa** o **el
  ERP**: «el programa genera el registro», «la ayuda del programa». Las copias de `references/docs/` sí nombran
  FacturaScripts: no copies eso.
- **Enlaces solo dentro de la misma documentación**: una página de un plugin enlaza únicamente otras páginas de `Doc/`
  de ese mismo plugin, y una del core, otras del core, siempre con la ruta relativa
  (`[Configurar el certificado](configurar-el-certificado.md)`, `[Ejemplo](../Dev/ejemplo.md)`), que cada sitio
  resuelve a su propia web.
- **Sin enlaces a otro sitio**: ni de un plugin al core, ni a otro plugin, ni a facturascripts.com o factura.city, ni a
  webs externas (tampoco las oficiales de la AEAT u otros organismos). En su lugar, explica lo necesario en una frase o
  nombra el menú donde está («desde **menú Administrador** → **Empresas**»). Si crees que un enlace de ese tipo aporta
  de verdad, **pregunta** al usuario antes de añadirlo.
- Los organismos y sistemas externos se nombran por su nombre (AEAT, Verifactu, TicketBAI, SII).
- El nombre del plugin («el plugin Verifactu») sí se puede usar.
- En las capturas tampoco debe verse la marca: el script lo comprueba en el texto visible; revisa a ojo el logotipo,
  los títulos y los pies de página.

## Comunes a las dos

- **Sin título `#`**: el título de la página es el `title` de `Doc/forja.json`. La página empieza con el texto.
- **Introducción** de uno o dos párrafos cortos: qué se consigue y, si hace falta, cómo funciona por dentro en una
  frase. Nada de «En esta página veremos...».
- **Secciones `##`** con frases cortas y concretas. En las páginas de uso, con un emoji delante que ayude a ojear
  (`## ✅ Cómo activarla`, `## ⚠️ Antes de eliminar`, `## 📋 Ver todas las rectificativas`); en las de programación,
  numeradas cuando son pasos (`## 1. Usar el trait DocFilesTrait`). `### ` solo para subdividir una sección larga.
- **Pasos numerados** (`1.`, `2.`...) cuando el orden importa, un paso por acción. Listas con guiones para opciones o
  requisitos.
- **Negrita** para lo que el usuario ve en pantalla: menús, botones, pestañas, campos y estados (`**Guardar**`,
  `**menú Ventas** → **Facturas**`). Rutas de menú con `→`.
- **Avisos** en línea con `⚠️` al principio del párrafo, sin bloques especiales ni `>`.
- Los textos de la interfaz se copian **literalmente** de las traducciones `es_ES` del plugin o del core
  (`Translation/es_ES.json`), con sus mayúsculas.
- **«Ver también»** al final (`## Ver también`, sin emoji) con dos o tres enlaces relativos a páginas relacionadas de
  la misma documentación ([Texto sin marca](#texto-sin-marca)). Si no hay ninguna, omite la sección. No inventes
  páginas: enlaza solo las que existan en `Doc/` o las que vayas a crear en el mismo trabajo.
- Nada de relleno ni repeticiones: si una frase no ayuda a hacer la tarea o a entenderla, sobra.

## Páginas de uso (`Doc/User`)

- Se habla **de tú** («Pulsa», «Ve al menú», «Si te has equivocado...»), en presente y en positivo.
- Orden habitual: introducción → requisitos (`## ⚙️ Antes de empezar`, solo si los hay) → la tarea principal paso a
  paso → variantes (otra forma de hacerlo, desde el listado, en lote...) → qué pasa después o cómo comprobarlo →
  errores y cómo corregirlos → `## Ver también`.
- Explica el porqué solo cuando cambia lo que hace el usuario («la factura queda protegida: revísala antes»).
- Sin detalles internos (clases, tablas, campos de la base de datos) ni normativa extensa: enlaza la página que la
  explique.

## Páginas de programación (`Doc/Dev`)

- Se habla en impersonal («Se añade...», «Hay que extender...») o de tú, como la página del core más parecida.
- Cada clase, método, archivo o extensión en **negrita** o entre comillas invertidas, con su espacio de nombres
  completo la primera vez.
- Bloques de código con su lenguaje (` ```php `, ` ```xml `, ` ```twig `), completos y comprobados contra el código del
  plugin y del core: nada de código inventado. Aplica la regla Dinamic.
- Orden habitual: qué permite hacer → requisitos → pasos numerados con su código → ejemplo completo → `## Ver
  también`.
- Las capturas solo cuando muestran el resultado en pantalla de lo que se programa.

## Imágenes

- Van en `Doc/Assets/<nombre-de-la-página>/NN-que-muestra.png` (`01-menu-ventas-facturas.png`) y se enlazan con la
  ruta relativa a la página: `![Texto alternativo](../Assets/<nombre-de-la-página>/01-....png)`.
- Cada imagen va **justo después** del paso o del párrafo que explica, en su propia línea y con una línea en blanco
  antes y después. Si varios pasos seguidos ocurren en la misma pantalla, una sola imagen al final de esos pasos.
- El **texto alternativo** describe lo que se ve y lo que está marcado («Pestaña Verifactu de una factura sin enviar,
  con el botón Dar de alta marcado»), no el nombre del archivo.
- Las **marcas numeradas** de la imagen siguen el orden de los pasos del texto: si el texto dice «1. Marca las casillas,
  2. Pulsa Acciones, 3. Elige Enviar a Verifactu», la imagen lleva las marcas 1, 2 y 3 en esos elementos.
- Una imagen por idea: recorta a la zona que importa y no repitas la misma pantalla sin un cambio que aporte.
- Ningún dato real ni sensible: las capturas se hacen con el script `doc-screenshots.py`, que anonimiza y lo
  comprueba, y además se revisan a ojo una a una.
