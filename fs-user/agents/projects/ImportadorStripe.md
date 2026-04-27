---
idproject: 165
name: ImportadorStripe
permalink: importadorstripe
creationdate: 03-12-2021
lastmod: 27-10-2025
version: 1.7
betaversion: 1.2
mincore: 2025
maxcore: 2026
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/ImportadorStripe
---

# Importador Stripe
Plugin para FacturaScripts:
- https://facturascripts.com/plugins/importadorstripe

## Descripción
Stripe es un sistema de pagos online que entre otras cosas nos permite gestionar cobros recurrentes de servicios a los que se suscriben nuestros clientes y generar las facturas correspondientes a esos cobros. El problema de esas facturas es que puede que no nos sean utiles y tengamos que duplicar trabajo transcribiendolas a nuestro programa de facturación.
Este plugin permite crear facturas en Facturascripts de forma manual o automática a partir de las facturas que se generan en Stripe.
Además se pueden vincular artículos de Fs con los productos de Stripe.

## Como funciona
Para poder usar el plugin StripeInvoice es necesario configurar ciertos aspectos.

1. Desde el menú *Ajustes* se deben dar de alta las claves secretas que van a permitir a Facturascripts comunicarse con Stripe.  Podemos dar de alta varias claves en caso que tengamos varias cuentas de Stripe.

2. Desde el menú *Clientes* debemos vincular los clientes de Stripe con los clientes de Facturascript para poder generar las facturas y vincularlas.

3. Desde el menú *Productos* debemos vincular los productos de Stripe con productos de Facturascript con el de generar las facturas de una forma coherente  (impuestos, cuentas contables, etc...). Si alguna de las facturas que intentamos importar desde Stripe tiene productos que no tienen correlación con productos.

4. Ya solo nos queda ir a *Facturas*, seleccionar la cuenta de Stripe de la que deseamos importar y definir el intervalo de tiempo. Se cargarán las facturas que hay en Stripe pendientes de procesar. Solo tenemos que pulsar sobre el signo &quot;más&quot; de la factura. El sistema comprobará si el cliente de la factura de Stripe tiene una correlación con un cliente de Facturascripts.
En caso afirmativo continuará, si no te dará la opción de asociarlo a un cliente existente o bien crear un nuevo cliente.
Por último podemos indicar si la factura generada tiene que darse por pagada y si se debe enviar por email a la dirección de la ficha del cliente de Facturascripts.

5. Cola de transacciones: Aquí es donde estarán todas las transacciones realizadas en los webhooks que tengas configurados con stripe (Se explica más adelante)

## Menu ajustes
En el menú de ajustes tenemos dos secciones:

### Sección 1: Donde configuarmos las sk de stripe
Aquí agregaremos el nombre de la cuenta (el identificador interno que queramos tener en FS para saber desde que cuenta de Stripe ha llegado), el sk de stripe y la serie donde se van a crear las facturas.
Esto es así porque igual queremos que cada cuenta de Stripe se facture en una serie distinta.

### Sección 2: Configuración general del plugin
Aquí vamos a tener distintos parámetros a configurar en el caso que queramos usarlo de forma automática:
* Código del cliente por defecto: Cómo podemos tener el caso en que se genere una factura desde un cliente que no esté vinculado, podemos crear un cliente que sea &quot;por defecto&quot; para que lo vincule a esa factura y luego sólo necesitamos crear el cliente, vincularlo y cambiarlo en la factura de forma manual.
* Código del producto por defecto: Igual que el cliente, también puede pasar con un producto nuevo dado de alta en stripe que no lo hayamos vinculado.
* Enviar email al cliente cuando se genere la factura: Por si queremos mandar la factura al cliente una vez generada.
* Mostrar el cliente de stripe en la factura: Si se marca &quot;Si&quot;, aparecerá el cliente de stripe en el campo observaciones de la factura.
* Email técnico para las comunicaciones de stripe: Email al que llegarán emails de error en caso que algo ha fallado.

## Creación de facturas de forma automática
Si tienes mucha facturación recurrente en Stripe, igual te interesa que se generen las facturas de forma automática, es decir, que cada vez que tu cliente haga un pago de un servicio, producto o suscripción, se cree una factura en facturascripts.
Para ello, neceistas configurar un webhook en stripe, que no es más que un canal de comunicación entre Stripe y tu facturascripts. Hay que tener en cuenta que tu facturascripts tiene que estar en internet.

### ¿Cómo lo hago?
Para hacerlo es muy sencillo, por un lado, tienes que configurar como mínimo el cliente y producto por defecto en los ajustes del plugin y agregar el sk de stripe. 
Abajo en la tercera sección te aparecerá algo así como &quot;(cuenta de stripe) &gt;&gt; Webhook facturas&quot; y una url tipo /WebhookStripe?source=xxxx

Esa url es la que necesitamos configurar en stripe:
Para ello, nos vamos a Stripe &gt;&gt; Desarrolladores &gt;&gt; Webhooks y creamos un nuevo destino. 
Ajustes:
- Url: (dominio facturascripts)/WebhookStripe?source=xxx
- Evento: invoice.payment_succeeded
- Versión de la api: 2017-08-15

Y listo ya lo tienes contectado. En este apartado luego podrás ver los pings que te haga Stripe cada vez que se haya pagado una suscripción o producto.

#### ¿Y en facturascripts?
Cuando Stripe mande una factura a facturascripts por el webhook, esta factura se quedará en cola, ese apartado lo podrás ver en Menú &gt;&gt; Cola de transacciones.
Esta transacción la puedes ejecutar manualmente pulsando en el check y dandole al botón procesar o configurando un cron en tu servidor de forma que llame a tu facturascripts cada 5 min.

## Logs
* Si al generar una factura da error, podemos ver todo el proceso en el fichero físico: invoice-log.txt que se guarda en el alojamiento
