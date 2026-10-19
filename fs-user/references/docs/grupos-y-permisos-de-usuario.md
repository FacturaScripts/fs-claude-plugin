---
id: 4505
permalink: grupos-y-permisos-de-usuario
title: Grupos y permisos de usuario
creationdate: 03-09-2026 16:59:21
lastmod: 21-09-2026
url: https://facturascripts.com/publicaciones/grupos-y-permisos-de-usuario
---
En FacturaScripts los permisos **no se asignan usuario por usuario**, sino a través de **grupos**. Para limitar lo que puede hacer una persona hay que crear un grupo con esas restricciones y asignarle el usuario. Puedes gestionar los grupos desde el **menú Administrador** → **Usuarios**, pestaña **Grupos**.

Los usuarios marcados como **administradores** no se ven afectados por los grupos: tienen acceso total a todo y no se les puede restringir. Los permisos solo tienen efecto sobre los usuarios que no son administradores.

## 👥 Crear un grupo

Pulsa el **botón nuevo**, escribe una descripción o nombre para el grupo y pulsa **guardar**. Una vez guardado aparecen dos pestañas más:

- **Reglas**: los permisos del grupo, página por página.
- **Usuarios**: los usuarios que pertenecen al grupo. Desde aquí puedes añadir o quitar varios de una vez, en lugar de ir a la ficha de cada usuario.

![permisos de grupo](https://i.imgur.com/cwTLNiZ.png)

## 🔑 Las reglas de acceso

En la pestaña **Reglas** aparece la lista de todas las páginas del programa, cada una con seis casillas:

- **Mostrar**: el usuario puede acceder a la página. Es la casilla principal: si la desmarcas, la regla se borra por completo y las otras cinco casillas dejan de tener efecto. Marca siempre *Mostrar* antes de dar cualquier otro permiso.
- **Mostrar solamente registros del usuario**: el usuario solo verá los registros creados por él mismo o vinculados a él. Lee el apartado [Solamente mis registros](#md_h4) porque tiene varios detalles importantes.
- **Permitir modificar**: puede crear y editar registros.
- **Permitir importar**: puede cargar datos desde un archivo.
- **Permitir exportar**: puede imprimir o descargar el listado en PDF, Excel, CSV, etc.
- **Permitir eliminar**: puede borrar registros.

Después de marcar o desmarcar casillas, recuerda **guardar**.

### 📖 Listados y formularios son páginas distintas

Este es el error más habitual al configurar permisos. En la lista de reglas aparecen tanto los **listados** (por ejemplo, el listado de facturas de cliente) como los **formularios de edición** (la ficha de una factura), y son páginas independientes.

Si le das acceso al listado de facturas pero no al formulario, el usuario verá la lista pero no podrá abrir ninguna factura. Y si quieres que pueda editarlas, el permiso **modificar** tiene que estar en el formulario, no solo en el listado.

![permisos modificar factura](https://imgur.com/U9jjrhw.png)

### 👨‍👩‍👧 Si el usuario pertenece a varios grupos

Los permisos de los distintos grupos se **suman**: basta que uno de los grupos permita modificar para que el usuario pueda modificar.

⚠️ Pero cuidado, porque la restricción **Mostrar solamente registros del usuario** también se suma, y al ser una restricción el resultado es el contrario de lo que se espera: si **cualquiera** de los grupos del usuario la tiene marcada, el usuario queda restringido, aunque otro grupo no la tenga. Añadir un grupo más permisivo **no** levanta esa restricción; hay que quitarla del grupo que la impone.

## 🙋 Solamente mis registros

Cuando marcas **Mostrar solamente registros del usuario**, FacturaScripts filtra los listados para que el usuario solo vea lo que es suyo. La propiedad se decide con dos campos, según los tenga la tabla:

- El **agente** vinculado al usuario (campo *agente* de su ficha).
- El **usuario** que creó el registro.

Si el registro coincide con cualquiera de los dos, el usuario lo ve.

### ⚠️ Necesita un agente asignado

Si la página trabaja con registros que se identifican por agente (facturas, albaranes, pedidos, presupuestos…) y el usuario **no tiene un agente asignado** en su ficha, no cumple ningún criterio de propiedad y el listado le aparecerá **completamente vacío**.

Por eso, si activas esta restricción, asigna siempre un [agente](https://facturascripts.com/publicaciones/los-agentes-que-son-y-para-que-sirven) al usuario.

### Páginas donde no tiene efecto

Si la tabla de esa página no guarda ni agente ni usuario (por ejemplo, familias, fabricantes o impuestos), no hay forma de saber de quién es cada registro, y la restricción simplemente no se aplica: el usuario verá todos los registros.

## 💡 Ejemplo: un comercial que solo ve sus ventas

1. Crea un [agente](https://facturascripts.com/publicaciones/los-agentes-que-son-y-para-que-sirven) para el comercial.
2. En la ficha del usuario, asígnale ese agente.
3. Crea un grupo llamado *Comerciales*.
4. En la pestaña **Reglas**, busca las páginas de clientes, presupuestos, pedidos, albaranes y facturas de venta, tanto los listados como los formularios, y marca en todas ellas **Mostrar**, **Mostrar solamente registros del usuario** y **Permitir modificar**. Deja sin marcar *Permitir eliminar*.
5. Guarda, y en la pestaña **Usuarios** del grupo añade al comercial.

Si además no quieres que vea los precios de coste ni los beneficios, usa los [niveles de usuario](https://facturascripts.com/publicaciones/los-niveles-de-usuario).