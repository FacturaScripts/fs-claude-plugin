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
- **Al menos 300 caracteres de cuerpo**: la web rechaza las páginas más cortas. Si una página se queda en una o dos
  frases, únela a otra relacionada.
- **Títulos únicos**: dos páginas del mismo plugin (o del core) no comparten `title`, tampoco entre `User` y `Dev`.
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
  (`Translation/es_ES.json`), con sus mayúsculas. **Nunca la clave de traducción**: «pulsa **Enviar a Verifactu**», no
  «pulsa **send-to-verifactu**». Si una pantalla muestra la clave porque falta su traducción, es un fallo del plugin:
  escribe el texto que debería verse si está claro y anótalo como hallazgo.
- **Sin notas internas**: nada de «no se ha probado», «pendiente de confirmar», «según el código...» ni comentarios
  para el equipo. La página solo dice lo que el usuario necesita y está comprobado; las dudas van al informe de quien
  la escribe.
- **Cada afirmación comprobada en el código** (y en la aplicación si se ve en pantalla), no solo en `Doc/Context/`, que
  explica las decisiones pero puede estar desfasado. Si no coinciden, manda el código y la diferencia se anota como
  hallazgo.
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
- **Marcas numeradas: una sola convención.**
  - Si la imagen ilustra **pasos numerados**, la marca *n* está en el elemento del paso *n*: «1. Marca las casillas,
    2. Pulsa **Acciones**, 3. Elige **Enviar a Verifactu**» lleva las marcas 1, 2 y 3. Si los pasos 4 y 5 están en la
    imagen siguiente, sus marcas son 4 y 5, no 1 y 2.
  - Si la imagen ilustra **un párrafo o una lista sin numerar** (qué muestra una pantalla), el texto cita cada marca
    con «(*n*)» justo después del elemento: «el estado **Aceptada** (1) y la fecha de envío (2)».
  - Los números de la imagen siguen siempre el orden en que el texto nombra los elementos, sin saltos ni números que
    el texto no cite. Una marca sin número (solo el recuadro) basta cuando la imagen señala un único elemento.
- Una imagen por idea: recorta a la zona que importa y no repitas la misma pantalla sin un cambio que aporte.
- Ningún dato real ni sensible: las capturas se hacen con el script `doc-screenshots.py`, que anonimiza y lo
  comprueba, y además se revisan a ojo una a una.

## Plugins con núcleo y plugins hijos

Algunos plugins comparten un plugin núcleo (por ejemplo, FiscalES con Verifactu, TicketBAI, SII y Facturae): el núcleo
tiene las pantallas comunes (certificados, configuración fiscal) y cada hijo, las de su organismo. Como una página no
puede enlazar a otro plugin:

- El **núcleo** documenta lo común completo, una vez: cómo funciona cada pantalla común, todas sus opciones y sus
  errores. Pon en su `controllers` los controladores de esas pantallas, para que la página salga en la ayuda de la
  pantalla aunque el usuario llegue desde un hijo.
- Cada **hijo** documenta su tarea de principio a fin y, cuando necesita algo del núcleo, lo resume en su página o en
  una página propia corta (`## ⚙️ Antes de empezar`): solo los pasos que ese hijo exige, nombrando el menú donde está
  («desde **menú Administrador** → **Empresas**»), sin repetir toda la referencia.
- Ese resumen se escribe igual en todos los hijos (mismos pasos y textos), para que un cambio en el núcleo se pueda
  aplicar a todos a la vez; anota en el `Doc/Context` del núcleo qué páginas de los hijos lo repiten.
- Lo propio de un hijo (su configuración, sus estados, sus errores) va solo en ese hijo.

## Publicación

- Las páginas de `Doc/User` y `Doc/Dev` se publican solas al subir una versión del plugin o del core que traiga su
  `Doc/`: la web importa esas carpetas con sus datos de `Doc/forja.json` y las imágenes de `Doc/Assets` que enlazan, y
  después quita la carpeta `Doc/` entera del zip que se descarga. `Doc/Context/`, `AGENTS.md` y `CLAUDE.md` no se
  publican nunca: no enlaces a ellos desde una página.
- La web reconoce cada página por su ruta (`User/x.md`) y, si no la encuentra, por su `permalink`. Para renombrar una
  página publicada cambia su `title`, no su `permalink`. Las páginas de la web que no vienen en el paquete no se
  tocan.
- Para corregir lo publicado sin esperar a una versión, o para traer a `Doc/` lo que se editó en la web, usa la skill
  `fs-dev:sincronizar-forja`. Antes de subir, `forja-doc-bundle.py pack` comprueba la longitud, los enlaces, las
  imágenes y los títulos repetidos.
