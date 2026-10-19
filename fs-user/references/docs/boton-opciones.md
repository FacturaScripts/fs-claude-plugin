---
id: 2436
permalink: boton-opciones
title: Botón opciones
creationdate: 30-12-2025 16:52:11
lastmod: 21-09-2026
url: https://facturascripts.com/publicaciones/boton-opciones
---
Todos los listados y formularios de FacturaScripts se pueden personalizar desde el **botón opciones**, situado arriba a la izquierda. Pulsa el botón y selecciona la pestaña o sección a personalizar, no es posible personalizar el color de los listados.

Con esta pantalla puedes ocultar los campos que no usas, cambiar los títulos por los que utilizáis en tu empresa, reordenar los campos y decidir qué ve cada usuario. Es la forma de adaptar el programa a tu manera de trabajar sin programar nada.

![botón opciones, maquetación y permisos](https://i.imgur.com/5IgiWwP.png)

## Columnas
La pantalla de personalización es una tabla con varias columnas, la primera son los **títulos** de las columnas del listado o formulario, después la **visualización**, **nivel**, **solamente lectura**, **decimales**, **ancho** y **orden**.

![opciones listado](https://i.imgur.com/VzylYB7.png)

### ✏️ Título
Puedes cambiar el texto que se muestra como título de la columna o del campo. Es útil para usar la terminología de tu sector, por ejemplo cambiar *Referencia* por *Código de barras*.

### 👀 Visualización
Las opciones de visualización son:

- Alineación a la **izquierda**.
- Alineación **centrado**.
- Alineación a la **derecha**.
- **Ocultar** (el ojo tachado).

### 🔓 Nivel
En ocasiones queremos que solamente algunos usuarios puedan ver una columna, para estos casos existe el nivel. Asigna nivel 9 (por ejemplo) a un campo y solamente los usuarios con nivel 9 o superior podrán ver ese campo.

Los administradores tienen siempre nivel 99, así que ellos ven todos los campos. Tienes más detalles en [los niveles de usuario](https://facturascripts.com/publicaciones/los-niveles-de-usuario).

### 🚫 Sólo lectura
En ocasiones queremos que algunos campos no sean editables, o solamente si no tienen valor. Las opciones son:

- **Si**: el campo solamente se puede leer, no modificar.
- **No**: el campo se puede leer y modificar.
- **Auto**: el campo se puede modificar si no tiene valor, pero en cuanto tiene un valor ya no se puede modificar.

### Decimales
Para los campos de tipo número, podemos configurar cuantos decimales mostrar. Solamente se aplicaría a este campo.

Ojo: esto solo cambia **cómo se muestra** el número en esa columna. Los decimales con los que el programa calcula se configuran en el [panel de control](https://facturascripts.com/publicaciones/el-panel-de-control), sección *Formatos numéricos*.

### ↔️ Ancho
Solamente para los formularios, podemos modificar la anchura del campo (entre 1 y 12). En los listados esto no aplica.

El ancho funciona sobre una rejilla de 12: un campo con ancho 12 ocupa toda la fila, uno con ancho 6 ocupa media fila, y uno con ancho 3 permite poner cuatro campos en la misma fila.

### ↕️ Orden
Los campos se ordenan de menor a mayor. Reduce el valor del campo orden para que aparezca antes que otros. Aumenta el valor para que aparezca después.

Conviene dejar huecos entre los valores (10, 20, 30…) en lugar de numerar de uno en uno, así podrás intercalar un campo más adelante sin tener que renumerar todo.

## 👤 Personalización general o por usuario

Esto es lo que más se desconoce de esta pantalla: las personalizaciones pueden ser **para todos** o **para un usuario concreto**.

- Si eres **administrador**, arriba tienes un selector de usuario. Si lo dejas vacío, los cambios que guardes se aplican a **todos los usuarios**. Si eliges un usuario, los cambios se aplican **solo a él**.
- Si **no** eres administrador, solo puedes personalizar tus propias pantallas; lo que guardes no afecta a nadie más.

Cuando un usuario tiene su propia personalización de una pantalla, esa es la que se usa y **sustituye** a la general. Ten esto en cuenta si cambias la configuración general y algún usuario sigue viendo la pantalla como antes: probablemente tenga una personalización propia.

Las personalizaciones guardadas de un usuario se pueden consultar en su ficha, en el **menú Administrador** → **Usuarios**, pestaña **Opciones**.

## ↩️ Volver a la configuración original

Las personalizaciones se guardan aparte, sobre la estructura original de la pantalla. Si te has liado, usa el botón de **eliminar** de esta pantalla: se borra la personalización y el listado o formulario vuelve a mostrarse tal y como viene de fábrica.

Esto también significa que, al actualizar FacturaScripts, los campos nuevos que traiga una versión aparecen aunque tengas la pantalla personalizada.

## Ver también

- [Los niveles de usuario](https://facturascripts.com/publicaciones/los-niveles-de-usuario)
- [Grupos y permisos de usuario](https://facturascripts.com/publicaciones/grupos-y-permisos-de-usuario)
- [Funcionamiento de Listados y Filtros](https://facturascripts.com/publicaciones/como-funcionan-los-listados-y-filtros)
- [El Panel de control](https://facturascripts.com/publicaciones/el-panel-de-control)