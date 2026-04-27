---
id: 124
permalink: suplidos-costes-4-atributos-por-variante-y-mucho-mas-ya-en-facturascripts-2020-4
title: Suplidos, costes, 4 atributos por variante y mucho más ... ya en FacturaScripts 2020.4
creationdate: 06-03-2020 11:09:54
lastmod: 09-03-2020
url: https://facturascripts.com/publicaciones/suplidos-costes-4-atributos-por-variante-y-mucho-mas-ya-en-facturascripts-2020-4
---

Ya está disponible **FacturaScripts 2020.4** con soporte para **suplidos**, nuevas **políticas de precios de coste**, más **atributos por variante** y un largo etcétera.

## Novedades
- El asistente de configuración inicial ahora **instala automáticamente el plan contable** predeterminado del país.
- Ahora podemos usar un **punto** para **autocompletar con ceros el código** al crear una **nueva subcuenta**.
- Añadidos **dos atributos más por variante** (*ocultos por defecto*). Con lo que ahora tenemos un total de 4 atributos por variante.
- Ahora podemos establecer una **política de actualización de precios de coste** para los productos, desde las **preferencias de la aplicación**.
- Ahora **si modificamos la dirección** de una factura, albarán, pedido o presupuesto de venta, y el cliente tiene en blanco la dirección, **se actualiza la dirección en la ficha del cliente**.
- Añadido soporte para **suplidos** en facturas, albaranes, etc. Un suplido es algo que pagamos en nombre del cliente.
- Ya se puede indicar la **serie predeterminada** para facturas **rectificativas**.
- Añadida al listado de clientes la **pestaña de cuentas bancarias** de clientes.
- Añadido filtro de **régimen IVA** en los listados de clientes y proveedores.
- Añadido botón de **diario a cuentas y subcuentas**.
- Rediseñados los **informes contables**.
- La función de test del email en las preferencias de la aplicación muestra ahora más información de diagnóstico.

## Correcciones
- Al cambiar la forma de pago de una factura, ahora se regeneran los recibos.
- Al regenerar los recibos de una factura con forma de pago pagada ahora se actualiza correctamente la factura como pagada.
- Al agrupar albaranes, pedidos o presupuestos, ahora se muestran ordenados por fecha ascendente (los últimos abajo).
- La plantilla de email ahora se visualiza correctamente en Outlook.
- Solucionado bug al descargar ficheros desde github.
- Solucionado bug con el traductor al realizar ciertas búsquedas en el mega-buscador.
- Los selectores de direcciones en la pestaña detalles de facturas, albaranes, etc. Ahora muestran la descripción de la dirección, en lugar del nombre.
- Solucionado bug que duplicada idasiento al generar facturas rectificativas.
- Solucionado bug al eliminar facturas rectificativas mal generadas.
- Solucionado bug al seleccionar la fecha para las nuevas facturas rectificativas.

## Mejoras para desarrollo
- Añadido widget porcentaje.
- Ahora podemos desactivar el botón de imprimir en los EditController.
- El widget file ahora admite el parámetro &quot;accept&quot; para poder filtrar el tipo de archivos a seleccionar.
- Añadido el método today(), que devuelve la fecha actual en el formato predeterminado, al toolBox().

## Actualizar
Como siempre, podéis actualizar FacturaScripts desde el menú Administrador &gt; Panel de control &gt; Actualizador.

### Plugins disponibles
- [CRM](https://facturascripts.com/plugins/crm): permite gestionar **contactos**, sus intereses, fuentes, listas, notas y oportunidades.
- [CSVimport](https://facturascripts.com/plugins/csvimport): permite importar clientes, proveedores, productos, familias o fabricantes desde **archivos CSV**. Ideal para importar tus datos de **factusol**.
- [Etiquetas](https://facturascripts.com/plugins/etiquetas): permite imprimir **etiquetas de los productos** desde albaranes o facturas de compra.
- [Modelo347](https://facturascripts.com/plugins/modelo347): Permite obtener los datos necesarios para el **modelo 347** de la hacienda española.
- [PlantillasPDF](https://facturascripts.com/plugins/plantillaspdf): permite editar los **diseños de facturas**, albaranes, etc.
- [PlazosPago](https://facturascripts.com/plugins/plazospago): permite añadir múltiples plazos a una forma de pago, para poder crear formas de pago como 50-50, 30-60-90, etc.
- [RemesasSEPA](https://facturascripts.com/plugins/remesassepa): añade gestión de **remesas bancarias** en formatos SEPA CORE, COR1 y B2B.
