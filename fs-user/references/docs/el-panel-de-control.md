---
id: 2529
permalink: el-panel-de-control
title: El Panel de control
creationdate: 11-02-2026 19:15:42
lastmod: 03-09-2026
url: https://facturascripts.com/publicaciones/el-panel-de-control
---
En el panel de control de FacturaScripts, accesible desde el menú **Administrador → Panel de control**, se concentra la configuración general del programa: los valores predeterminados que se aplican a los documentos nuevos, los formatos numéricos, las políticas de precio de coste, los identificadores fiscales, las secuencias de numeración, los estados de los documentos, los formatos de impresión y las claves de la API.

El panel está dividido en pestañas. La primera reúne las secciones **Por defecto**, **Formatos numéricos**, **Productos**, **Documentos** y **Avanzado**, y a continuación aparecen las pestañas **Id. Fiscal**, **Secuencias**, **Estados**, **Formatos de impresión** y **Claves API**. Los plugins que instales pueden añadir sus propias pestañas a este panel.

&gt; Recuerda pulsar el botón **Guardar** de cada sección después de hacer cambios. Muchos de estos ajustes solo afectan a los documentos que crees a partir de ese momento, no a los que ya existen.


## ⚙️ Por defecto

Aquí se definen los valores que el programa propondrá al crear facturas, albaranes, pedidos, presupuestos, clientes y proveedores.

![panel de control](https://i.imgur.com/r00lfeI.png)

- **País**: país predeterminado de la instalación. Condiciona las validaciones de identificadores fiscales y los datos fiscales por defecto.
- **Empresa**: la [empresa](https://facturascripts.com/publicaciones/empresas-524) principal. Si tienes varias, esta es la que se propone al crear documentos.
- **Almacén**: el almacén predeterminado. Solo se ofrecen los almacenes de la empresa seleccionada.
- **Id. Fiscal**: tipo de identificador fiscal por defecto (CIF, NIF, DNI…) para clientes y proveedores nuevos.
- **Serie**: [serie](https://facturascripts.com/publicaciones/series-470) predeterminada para los documentos. No se muestran aquí las series de tipo rectificativa.
- **Serie rectificativa**: serie que se usará al crear facturas rectificativas. Solo se listan las series marcadas como rectificativas.
- **Divisa**: la [divisa](https://facturascripts.com/publicaciones/divisas-773) predeterminada.
- **Forma de pago**: forma de pago propuesta en los documentos nuevos. Solo se ofrecen las de la empresa seleccionada.
- **Impuesto**: impuesto (IVA) que se asigna a los productos nuevos.
- **Retención**: retención (IRPF) predeterminada.
- **Régimen impuestos**: [régimen de IVA](https://facturascripts.com/publicaciones/regimen-iva-369) por defecto: General, Exento, Recargo de equivalencia, Simplificado, Criterio de caja, Agencias de viaje, Bienes usados, OSS/IOSS, etc.
- **Validar IBAN**: si está marcado, el programa comprueba que las cuentas bancarias que introduzcas tengan un IBAN válido.

Si cambias la empresa predeterminada, FacturaScripts revisa automáticamente que el almacén y la forma de pago guardados sigan perteneciendo a esa empresa; si no es así, asigna los primeros disponibles.

### 🔢 Formatos numéricos

Controlan cómo se muestran y se calculan los importes en toda la aplicación.

- **Decimales**: número de decimales (de 0 a 6) con el que se trabaja. ⚠️ Este cambio no solo afecta a los precios de los productos, sino también a los totales de facturas, asientos contables, etc. Cámbialo con cuidado y preferiblemente al empezar.
- **Separador de decimales**: coma o punto.
- **Separador de millares**: coma, punto, espacio o guion bajo.
- **Posición símbolo de divisa**: a la izquierda (`$ 123`) o a la derecha (`123 $`).

### 📦 Productos

- **Política de precio de coste**: determina cómo se recalcula el precio de coste de los productos con cada compra. Puedes elegir entre *Último precio de compra*, *Precio medio de compra*, *Precio de coste real* y *Precio más alto*, o dejarlo sin política para introducirlo a mano. Consulta la guía de [políticas de precios de coste](https://facturascripts.com/publicaciones/politicas-de-precios-de-coste) para elegir la que mejor te convenga.
- **Actualizar precios de proveedores**: si está marcado, al registrar una compra se actualiza la ficha del producto de ese proveedor con el precio pagado.

⚠️ Estas dos opciones van juntas: la política de precio de coste se calcula a partir de los precios de tus proveedores, así que **si no marcas *Actualizar precios de proveedores*, la política no se aplicará nunca**. Marca las dos.
- **Permitir la venta sin stock en nuevos productos**: valor por defecto de la casilla *venta sin stock* en los productos que crees a partir de ahora. No modifica los productos existentes.

### 📄 Documentos

- **Método cálculo impuestos**: *Clásico* (los impuestos se calculan sobre la base imponible, como es habitual en facturación entre empresas) o *Ajustado a precio con impuestos* (útil cuando trabajas con precios finales al público y quieres que el total cuadre al céntimo).
- **Ver columna subtotal o neto**: si en las líneas de los documentos se muestra el *Subtotal* (antes de descuentos) o el *Neto* (después de descuentos).
- **Días hasta vencimiento**: días que se suman a la fecha del documento para calcular la fecha de vencimiento de los presupuestos y pedidos de cliente.
- **Nivel para ver costes** y **Nivel para ver beneficios**: nivel mínimo de usuario (de 0 a 99) necesario para ver el coste y el beneficio, tanto en las líneas como en los totales de los documentos de venta. El nivel de cada usuario se define en [Usuarios y permisos](https://facturascripts.com/publicaciones/usuarios-y-permisos).

### 🛠️ Avanzado

- **Dirección web**: URL pública de tu instalación. Se usa en los enlaces de los emails y en los servicios que necesitan una dirección absoluta. Se rellena automáticamente si la dejas vacía.
- **Página de inicio**: pantalla a la que se llega al iniciar sesión (por ejemplo el escritorio, un listado o un informe).
- **Imagen de login**: imagen que se muestra en la pantalla de acceso. Se elige de entre los archivos subidos a la biblioteca (GIF, JPG, PNG o WEBP).
- **Tamaño de la tabla**: *Grande* o *Pequeño*, para mostrar más o menos filas en pantalla en los listados.
- **Elementos por página**: cuántos registros se cargan en cada listado (entre 10 y 250). Bajarlo mejora el rendimiento en instalaciones con muchos datos.
- **Grupo de usuario pred.**: rol que se asignará automáticamente a los usuarios nuevos.
- **Nº días retención logs**: días que se conservan los registros de actividad antes de que el [cron](https://facturascripts.com/publicaciones/el-cron-104) los borre (de 1 a 250).
- **Activar API**: habilita la [API REST](https://facturascripts.com/publicaciones/la-api-rest-de-facturascripts-912). Mientras esté desactivada, la pestaña *Claves API* aparece deshabilitada.
- **Activar actualizaciones beta**: permite recibir versiones beta. Consulta [cómo instalar actualizaciones beta](https://facturascripts.com/publicaciones/instalar-actualizaciones-beta).


## 🧾 Id. fiscal

En esta pestaña puedes dar de alta y configurar los distintos tipos de identificadores fiscales para clientes y proveedores.

![identificador fiscal cif nif dni](https://i.imgur.com/YQxg4cq.png)

Cada tipo tiene tres campos:

- **Id. Fiscal**: el nombre del tipo, tal y como aparecerá en las fichas de clientes y proveedores (CIF, NIF, DNI, NIE, Pasaporte…).
- **Código**: código oficial asociado al tipo, que utilizan algunos servicios de facturación electrónica.
- **Validar**: si lo marcas, el programa comprueba que el número introducido sea correcto y avisa cuando no lo es.

Por ejemplo, si quieres que el programa te avise cuando un CIF sea incorrecto, marca la casilla **Validar** en la fila del CIF y pulsa **Guardar**.


## 🔢 Secuencias

Desde esta pestaña se configura la numeración y los códigos de facturas, albaranes, pedidos y presupuestos. Hay una secuencia por cada combinación de tipo de documento, serie, ejercicio y empresa, y se crean automáticamente la primera vez que emites un documento con esa combinación.

Consulta la guía de [secuencias de documentos](https://facturascripts.com/publicaciones/secuencias-de-documentos-184) para ver todos los campos, los códigos que admite el patrón y cómo funciona el relleno de huecos.


## 🏷️ Estados

Los estados definen la situación de cada presupuesto, pedido, albarán o factura, y qué ocurre al aplicarlos: si el documento sigue siendo editable, cómo afecta al stock y si genera otro documento (por ejemplo, pasar de presupuesto a pedido).

Consulta la guía de [estados del documento](https://facturascripts.com/publicaciones/estados-del-documento-680) para ver cómo configurarlos.


## 🖨️ Formatos de impresión

Aquí se gestionan los formatos con los que se generan los PDF: el título, el texto adicional, el logotipo y a qué tipo de documento, serie y empresa se aplican automáticamente.

Consulta la guía de [formatos de impresión](https://facturascripts.com/publicaciones/los-formatos-de-impresion-de-facturascripts) para ver cómo crearlos.


## 🔑 Claves API

Esta pestaña solo está operativa si has marcado **Activar API** en la sección *Avanzado*. Desde aquí se crean y revocan las claves con las que otras aplicaciones acceden a la [API REST de FacturaScripts](https://facturascripts.com/publicaciones/la-api-rest-de-facturascripts-912), y puedes consultar de cada una su última conexión y su última IP, lo que ayuda a detectar claves en desuso o accesos inesperados.

Trata cada clave como una contraseña. Si sospechas que se ha filtrado, desactívala o elimínala y genera una nueva.


## Ver también

- [Configuración general](https://facturascripts.com/publicaciones/configuracion-15)
- [Primeros pasos con FacturaScripts](https://facturascripts.com/publicaciones/primeros-pasos-303)
- [Usuarios y permisos](https://facturascripts.com/publicaciones/usuarios-y-permisos)
- [Empresas](https://facturascripts.com/publicaciones/empresas-524)
- [Cómo ejecutar el cron de FacturaScripts](https://facturascripts.com/publicaciones/el-cron-104)