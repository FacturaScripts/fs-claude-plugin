---
id: 4506
permalink: los-niveles-de-usuario
title: Los niveles de usuario
creationdate: 03-09-2026 17:00:16
lastmod: 21-09-2026
url: https://facturascripts.com/publicaciones/los-niveles-de-usuario
---
Además de los [grupos y permisos](https://facturascripts.com/publicaciones/grupos-y-permisos-de-usuario), que deciden a qué páginas puede entrar cada usuario, FacturaScripts tiene un segundo mecanismo más fino: el **nivel**. El nivel sirve para **ocultar columnas y campos concretos** a determinados usuarios, sin quitarles el acceso a la página.

El caso típico: el encargado del almacén necesita entrar en el listado de productos, pero no quieres que vea los precios de coste.

## ⏫ El nivel del usuario

Cada usuario tiene un nivel, un número entre 0 y 99 que se configura en su ficha, en el **menú Administrador** → **Usuarios**. Los usuarios nuevos se crean con **nivel 2**.

Un usuario solo ve los campos y columnas cuyo nivel sea **igual o inferior** al suyo. Es decir, un campo marcado con nivel 10 lo verán los usuarios de nivel 10, 20 o 99, pero no los de nivel 2.

Dos detalles importantes:

- Los **administradores** siempre tienen **nivel 99**. El programa se lo asigna automáticamente al guardar, así que un administrador ve todos los campos, sea cual sea el nivel que les pongas.
- El propio campo **Nivel** solo es visible para usuarios de nivel 99, o sea, en la práctica **solo los administradores pueden ver y cambiar los niveles**.

## 🔓 Ocultar una columna o un campo

Los niveles se asignan desde el **botón opciones**, arriba a la izquierda de cualquier listado o formulario:

1. Abre el listado o el formulario que quieras ajustar.
2. Pulsa el **botón opciones** y elige la pestaña o sección a personalizar.
3. Busca la fila del campo y escribe el nivel mínimo en la columna **Nivel**.
4. Guarda.

![configurar nivel de columna en opciones](https://i.imgur.com/ah0LYVH.png)

Siguiendo el ejemplo del almacén: entra en el listado de productos, pulsa el botón opciones, busca la fila del precio de coste y ponle nivel 10. A partir de ahí solo los usuarios de nivel 10 o superior verán esa columna.

Tienes todos los detalles de esta pantalla en la ficha del [botón opciones](https://facturascripts.com/publicaciones/boton-opciones). El nivel se puede aplicar a las columnas de los listados, a los campos de los formularios y también a algunos botones.

## 💰 Costes y beneficios en los documentos

En las facturas, albaranes, pedidos y presupuestos de venta, el coste y el beneficio no se controlan con el botón opciones, sino con dos ajustes del [panel de control](https://facturascripts.com/publicaciones/el-panel-de-control), en la sección **Documentos**:

- **Nivel para ver costes**
- **Nivel para ver beneficios**

Estos dos valores afectan tanto a las columnas de las líneas del documento como a los totales del pie. Los administradores los ven siempre, independientemente del nivel configurado.

## ⚠️ El nivel oculta, no protege

Conviene tener claro para qué sirve cada cosa:

- El **nivel** es una herramienta de **presentación**: simplifica la pantalla y evita que ciertos usuarios vean datos que no les corresponden en el día a día.
- Los **grupos y permisos** son la herramienta de **control de acceso**: deciden a qué páginas se entra y qué se puede modificar, importar, exportar o eliminar.

Si un dato no debe estar al alcance de un usuario bajo ningún concepto, quítale el acceso a esa página con un [grupo](https://facturascripts.com/publicaciones/grupos-y-permisos-de-usuario); no te limites a subir el nivel de la columna.

## Ver también

- [Usuarios y permisos](https://facturascripts.com/publicaciones/usuarios-y-permisos)
- [Grupos y permisos de usuario](https://facturascripts.com/publicaciones/grupos-y-permisos-de-usuario)
- [Botón opciones](https://facturascripts.com/publicaciones/boton-opciones)
- [El Panel de control](https://facturascripts.com/publicaciones/el-panel-de-control)