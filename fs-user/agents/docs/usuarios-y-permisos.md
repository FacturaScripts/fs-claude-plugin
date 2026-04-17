---
id: 950
permalink: usuarios-y-permisos
title: Usuarios y permisos
creationdate: 17-07-2021 09:27:33
lastmod: 17-03-2026
url: https://facturascripts.com/usuarios-y-permisos
---
Para usar FacturaScripts es necesario un usuario y contraseña, así se evita que cualquiera pueda acceder a sus datos. Puede gestionar la lista de usuarios de FacturaScripts desde el **menú Administrador** → **Usuarios**.

![listado de usuarios](https://facturascripts.com/MyFiles/2023/12/1852.png?myft=5ba3b3c7c4a9716be7c19d5e44a86386b43250ca)

## ⁉️ FacturaScripts y facturascripts.com
Su instalación de FacturaScripts es **totalmente independiente** de facturascripts.com. No se comparten usuarios, ni contraseñas, ni emails, nada. Si lo instala en su PC o servidor, sus datos están ahí y solamente ahí.

## 👤 Usuarios
Puede crear tantos usuarios como necesite desde el **menú Administrador** → **Usuarios**. Todo lo que necesita indicar es un nick o apodo, y una contraseña, que tendrá que repetir para evitar errores. Una vez creado, el usuario podrá entrar al programa usando ese usuario y contraseña.

![crear o añadir nuevo usuario](https://i.imgur.com/FP71JBY.png)

Además del **nick** y la **contraseña**, puede indicar un email, y una serie de opciones predeterminadas para ese usuarios (algunas opciones aparecen una vez tenemos guardado al nuevo usuario) como son:

- **Idioma**: para la interfaz de usuario.
- **Página de inicio**: Cuando el usuario inicie sesión en el programa, será redirigido a está página por defecto.
- **Serie**: Se puede elegir la serie de facturación(general, rectificativa o simplificada).
- **Agente**: el agente vinculado al usuario. Todos los documentos que cree el usuario tendrán ese agente vinculado.
- **Nivel**: el nivel del usuario se utiliza para hacer que algunas columnas o campos sean visibles solamente para determinado nivel. Por ejemplo, puede modificar el campo coste de los productos para que solamente los usuarios con nivel 10 o superior puedan verlo. Tienes más detalles abajo.

### 🚫 Desactivar usuarios
Para desactivar un usuario, solo necesitas desmarcar el campo **Activo** en la ficha del usuario. Si posteriormente necesitar volver a activarlo, tendrás volver a marcar el campo **Activo** en la ficha del usuario.

### 🔐 Administradores
Los usuarios marcados como administradores tienen acceso total a todas las secciones de FacturaScripts, no necesitando de ningún permiso adicional, y no pudiendo aplicarles restricciones. **Solamente** los administradores pueden **crear más usuarios**.

### 🔑 Permisos de usuarios
Los permisos de usuario se gestionan a nivel de **grupo**, es decir, para hacer que un usuario solamente pueda acceder a ciertas páginas, hay que **asignarlo a un grupo** con esas restricciones. Puede gestionar los grupos desde el **menú Administrador** → **Usuarios**, pestaña **Grupos**.

Para crear un grupo pulse el **botón nuevo** y en la siguiente pantalla escriba una descripción o nombre para el nuevo grupo y pulse **guardar**. Una vez guardado podrá editar los permisos o reglas para cada página u opción del menú en la sección de reglas:

![permisos de grupo](https://i.imgur.com/cwTLNiZ.png)

Para cada página se pueden asignar los siguientes permisos:
- **Mostrar**: el usuario puede acceder a la página.
- **Mostrar solamente registros del usuario**: el usuario solamente podrá ver registros creados por él mismo (o por nadie) o vinculador a él (ya sea a su usuario o a su agente).
- **Permitir modificar**.
- **Permitir importar**.
- **Permitir exportar**: el usuario podrá imprimir o exportar a Excel, CSV, etc.
- **Permitir eliminar**.

#### 📖 Listados y formularios
En la lista de permisos aparecen tanto los listados como los formularios de edición. Puede darle permisos de edición a un usuario sobre el listado de facturas, pero si no le da permisos sobre el formulario de factura, no podrá verla.

![permisos modificar factura](https://imgur.com/U9jjrhw.png)

#### 👥 Múltiples grupos
Si un usuario pertenece a varios grupos, sus permisos serán la combinación de todos esos grupos.

### ⏫ Nivel del usuario
El nivel de usuario nos permite **ocultar** a ciertos usuarios algunas **columnas de listados** o **campos de formularios**, asignando a estas columnas un nivel superior al del usuario. Por ejemplo, imaginemos que queremos que el empleado que se encarga del almacén no pueda ver los precios de los productos en el listado. Pues simplemente debemos ir al listado, hacer clic en el **botón opciones** (arriba a la izquierda) y clic en productos. En la siguiente pantalla buscamos la fila de precio, y en su columna de nivel, indicamos nivel 10. Así solamente los usuarios con niveles 10 o superior podrán ver esa columna en ese listado.

![configurar nivel de columna en opciones](https://i.imgur.com/ah0LYVH.png)
