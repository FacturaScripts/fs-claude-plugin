---
id: 651
permalink: modals-718
title: Modals (XMLView)
creationdate: 07-05-2018 00:00:00
lastmod: 12-08-2026
url: https://facturascripts.com/publicaciones/modals-718
---
Los formularios modales son vistas complementarias a la vista principal, que permanecen ocultas hasta que se pulsa su **botón de tipo modal**. Estos formularios se declaran de manera muy similar a lo detallado en la sección COLUMNS. Podemos definir todos los modals que necesitemos, simplemente añadiendo grupos (etiqueta group) dentro de la etiqueta modals del XMLView.

## Ejemplo de modal:
```xml
&lt;modals&gt;
	&lt;group name=&quot;test&quot; title=&quot;other-data&quot; icon=&quot;fas fa-users&quot;&gt;
		&lt;column name=&quot;name&quot; numcolumns=&quot;12&quot; description=&quot;desc-customer-name&quot;&gt;
			&lt;widget type=&quot;text&quot; fieldname=&quot;nombre&quot; required=&quot;true&quot; /&gt;
		&lt;/column&gt;
		&lt;column name=&quot;create-date&quot; numcolumns=&quot;6&quot;&gt;
			&lt;widget type=&quot;date&quot; fieldname=&quot;fechaalta&quot; readonly=&quot;true&quot; /&gt;
		&lt;/column&gt;
		&lt;column name=&quot;blocked-date&quot; numcolumns=&quot;6&quot;&gt;
			&lt;widget type=&quot;date&quot; fieldname=&quot;fechabaja&quot; /&gt;
		&lt;/column&gt;
	&lt;/group&gt;
&lt;/modals&gt;
```

### Mostrar un modal
Para mostrar un modal que ya hayamos definido en **modals** debemos definir un **botón de tipo modal** en un `row` de tipo `actions`, `header` o `footer`. Además este botón debe indicar el nombre del modal en su **propiedad action**.

#### Ejemplo:
```xml
&lt;rows&gt;
	&lt;row type=&quot;actions&quot;&gt;
		&lt;button type=&quot;modal&quot; label=&quot;mostrar&quot; color=&quot;warning&quot; action=&quot;test&quot; /&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```

### Modal de distinto tamaño
Podemos mostrar una ventana de modal más pequeña añadiendo **class=&quot;modal-sm&quot;** al grupo del modal. También podemos mostrar una ventana más grande con **class=&quot;modal-lg&quot;** o **class=&quot;modal-xl&quot;**.

### ModalInsert
También podemos hacer que al pulsar el botón nuevo en un listado aparezca un modal elegido, en lugar de redirigir al controlador del modelo. Para lograr esto solamente debemos indicar en el ajuste `modalInsert` el `name` del modal.

```php
$this-&gt;setSettings($viewName, &#39;modalInsert&#39;, &#39;add-lote&#39;);
// en este caso al hacer clic en el botón nuevo se mostrará el modal con name &#39;add-lote&#39;
```

## Personalización de un modal (uso avanzado)

Los modales declarados de la forma indicada anteriormente son muy cómodos porque FacturaScripts se encarga de todo: crea la ventana, el formulario, el botón de aceptar y el envío de la acción al controlador. A cambio, su contenido está limitado a columnas y widgets concretos, y no siempre es suficiente. A veces necesitamos botones de tipo *radio* agrupados, tablas dinámicas rellenadas por JavaScript, bloques informativos, o simplemente un diseño que no encaja en el sistema de columnas.

Este apartado explica cómo mantener toda la maquinaria del modal XML (formulario, token, acción, integración con el controlador) pero sustituyendo su cuerpo por una plantilla o vista Twig propia que podemos personalizar.

## Qué genera FacturaScripts con un modal XML

Antes de entrar en el cómo aplicar esta técnica es conveniente entender como funciona internamente el Core cuando definimos un modal. Al declarar un grupo dentro de `modals`, la clase `GroupItem::modal()` genera esta estructura:

```html
&lt;form id=&quot;formModal{uniqueId}&quot; method=&quot;post&quot; enctype=&quot;multipart/form-data&quot;&gt;
    &lt;input type=&quot;hidden&quot; name=&quot;activetab&quot; value=&quot;{viewName}&quot;/&gt;
    &lt;input type=&quot;hidden&quot; name=&quot;multireqtoken&quot; value=&quot;{token}&quot;/&gt;
    &lt;div class=&quot;modal&quot; id=&quot;modal{name}&quot; tabindex=&quot;-1&quot; role=&quot;dialog&quot;&gt;
        &lt;div class=&quot;modal-dialog {class}&quot; role=&quot;document&quot;&gt;
            &lt;div class=&quot;modal-content&quot;&gt;
                &lt;div class=&quot;modal-header&quot;&gt;...título, descripción e icono...&lt;/div&gt;
                &lt;div class=&quot;modal-body&quot;&gt;
                    &lt;div class=&quot;row g-2&quot;&gt;...columnas del grupo...&lt;/div&gt;
                &lt;/div&gt;
                &lt;div class=&quot;modal-footer&quot;&gt;
                    &lt;button type=&quot;button&quot; data-bs-dismiss=&quot;modal&quot;&gt;Cancelar&lt;/button&gt;
                    &lt;input type=&quot;hidden&quot; name=&quot;action&quot; value=&quot;{name}&quot;/&gt;
                    &lt;button type=&quot;submit&quot;&gt;Aceptar&lt;/button&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/form&gt;
```

Hay tres detalles de esta estructura que son la base de toda la técnica:

- El `id` de la ventana es siempre `modal` + el `name` del grupo. Con ese identificador se abre el modal, tanto desde un botón (`data-bs-target`) como desde JavaScript.
- El atributo `class` del grupo se aplica a `.modal-dialog`, no al `.modal`. Además de los tamaños de Bootstrap (`modal-sm`, `modal-lg`, `modal-xl`) podemos añadir ahí una **clase marcadora propia** que nos sirva de selector inequívoco desde CSS y JavaScript.
- Todo lo que esté dentro de `.modal-body` viaja en el `&lt;form&gt;` del modal, que ya lleva el `action` correcto y el token de seguridad. Si conseguimos meter nuestro HTML ahí dentro, sus campos llegan al controlador sin escribir ni una línea extra de fontanería.

## La técnica en una frase

Declaramos el grupo del modal **vacío** (solo la carcasa) y colocamos el contenido real en una plantilla Twig incluida en un panel oculto del pie de la vista; un pequeño script traslada ese contenido al `.modal-body` cuando la página termina de cargar.

### Paso 1: declarar el modal vacío con una clase marcadora

En el XMLView, dentro de `modals`, declaramos el grupo sin columnas. Añadimos una clase propia que identifique el modal, y el tamaño de Bootstrap si lo necesitamos.

```xml
&lt;modals&gt;
    &lt;group name=&quot;add-receipts-auto&quot; class=&quot;autopaymentmodal&quot; /&gt;
    &lt;group name=&quot;invoice-info&quot; class=&quot;invoiceinfomodal modal-xl&quot; /&gt;
&lt;/modals&gt;
```

El grupo puede llevar también `title`, `description` e `icon`, que se renderizan en la cabecera del modal con normalidad. Si no ponemos `title`, la cabecera queda vacía (útil cuando el propio contenido ya incluye su encabezado).

El `name` es la pieza clave: define el `id` de la ventana (`modaladd-receipts-auto`, `modalinvoice-info`) y el valor de `action` que recibirá el controlador al pulsar *Aceptar*.

### Paso 2: crear la plantilla Twig con el contenido

Creamos la plantilla en `View/Block/` del plugin. El contenido debe ir dentro de un `div` con un `id` propio: es el &quot;paquete&quot; que después moveremos.

Como el contenedor del core que vamos a vaciar es un `div.row.g-2`, conviene que nuestro `div` lleve la clase `row`, así las columnas de Bootstrap siguen funcionando igual.

`View/Block/PaymentAutoModal.html.twig`:

```twig
{% set mainView = fsc.views[fsc.getMainViewName()] %}
{% set primaryKeyValue = mainView.model.primaryColumnValue() %}

&lt;div id=&quot;autopaymentmodalbody&quot; class=&quot;row&quot;&gt;
    &lt;input type=&quot;hidden&quot; name=&quot;idpayment&quot; value=&quot;{{ primaryKeyValue }}&quot;/&gt;

    &lt;div class=&quot;mb-3 col-12&quot;&gt;
        &lt;label class=&quot;d-block&quot;&gt;{{ trans(&#39;company&#39;) }}&lt;/label&gt;
        &lt;div class=&quot;btn-group&quot; role=&quot;group&quot;&gt;
            &lt;input type=&quot;radio&quot; class=&quot;btn-check&quot; name=&quot;company&quot; id=&quot;company_all&quot; value=&quot;-1&quot; checked autocomplete=&quot;off&quot;&gt;
            &lt;label class=&quot;btn btn-outline-primary&quot; for=&quot;company_all&quot;&gt;{{ trans(&#39;all-feminine&#39;) }}&lt;/label&gt;

            {% for company in fsc.getCompanyList() %}
                &lt;input type=&quot;radio&quot; class=&quot;btn-check&quot; name=&quot;company&quot; id=&quot;company_{{ company.idempresa }}&quot; value=&quot;{{ company.idempresa }}&quot; autocomplete=&quot;off&quot;&gt;
                &lt;label class=&quot;btn btn-outline-primary&quot; for=&quot;company_{{ company.idempresa }}&quot;&gt;{{ company.nombrecorto }}&lt;/label&gt;
            {% endfor %}
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;div class=&quot;mb-3 col-6&quot;&gt;
        &lt;label for=&quot;amount&quot;&gt;{{ trans(&#39;amount&#39;) }}&lt;/label&gt;
        &lt;input type=&quot;number&quot; name=&quot;amount&quot; class=&quot;form-control&quot; placeholder=&quot;0.00&quot; step=&quot;0.01&quot; min=&quot;0&quot; required&gt;
    &lt;/div&gt;

    &lt;div class=&quot;mb-3 col-6&quot;&gt;
        &lt;label class=&quot;d-block&quot;&gt;{{ trans(&#39;payment-method&#39;) }}&lt;/label&gt;
        &lt;div class=&quot;btn-group&quot; role=&quot;group&quot;&gt;
            &lt;input type=&quot;radio&quot; class=&quot;btn-check&quot; name=&quot;paymentMethod&quot; id=&quot;pm_cash&quot; value=&quot;0&quot; checked autocomplete=&quot;off&quot;&gt;
            &lt;label class=&quot;btn btn-outline-info&quot; for=&quot;pm_cash&quot;&gt;
                &lt;i class=&quot;fa-solid fa-sack-dollar me-1&quot;&gt;&lt;/i&gt; {{ trans(&#39;cash&#39;) }}
            &lt;/label&gt;

            &lt;input type=&quot;radio&quot; class=&quot;btn-check&quot; name=&quot;paymentMethod&quot; id=&quot;pm_check&quot; value=&quot;1&quot; autocomplete=&quot;off&quot;&gt;
            &lt;label class=&quot;btn btn-outline-info&quot; for=&quot;pm_check&quot;&gt;
                &lt;i class=&quot;fa-solid fa-money-check me-1&quot;&gt;&lt;/i&gt; {{ trans(&#39;bank-check-short&#39;) }}
            &lt;/label&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;
```

La única variable que el core pasa a estas plantillas es `fsc`, el controlador. Desde ella se accede a las vistas (`fsc.views`), al modelo principal (`fsc.views[fsc.getMainViewName()].model`) y a cualquier método público que hayamos añadido al controlador, como en el ejemplo `fsc.getCompanyList()`. La función `trans()` está disponible con normalidad.

### Paso 3: incluir la plantilla en un panel oculto del pie

En el mismo XMLView, dentro de `rows`, declaramos un panel de tipo `footer` que incluya la plantilla y que esté oculto con `d-none`.

```xml
&lt;rows&gt;
    &lt;row type=&quot;footer&quot;&gt;
        &lt;group name=&quot;autoPaymentBlock&quot; id=&quot;auto-payment-block&quot; class=&quot;d-none&quot; html=&quot;Block/PaymentAutoModal.html.twig&quot; /&gt;
        &lt;group name=&quot;invoiceInfoBlock&quot; id=&quot;invoice-info-block&quot; class=&quot;d-none&quot; html=&quot;Block/InvoiceInfoModal.html.twig&quot; /&gt;
    &lt;/row&gt;
&lt;/rows&gt;
```

El atributo `html` es el que carga la plantilla dentro del *card* del panel. El `class=&quot;d-none&quot;` oculta ese panel para que el usuario nunca lo vea: solo actúa como contenedor temporal del HTML mientras se carga la página. El `id` es opcional, pero facilita depurar.

### Paso 4: trasladar el contenido al cuerpo del modal

Al final de la plantilla Twig añadimos el script que hace el traslado. Vacía el `div.row.g-2` que el core generó dentro del `.modal-body` y le inserta nuestro `div`.

```twig
&lt;script&gt;
    document.addEventListener(&#39;DOMContentLoaded&#39;, function () {
        const modalBody = document.querySelector(&#39;.modal-dialog.autopaymentmodal .modal-body&#39;);
        const sourceDiv = document.getElementById(&#39;autopaymentmodalbody&#39;);
        if (modalBody && sourceDiv) {
            modalBody.innerHTML = &#39;&#39;;
            modalBody.appendChild(sourceDiv);
        }
    });
&lt;/script&gt;
```

Aquí es donde la clase marcadora del paso 1 gana su sentido: `.modal-dialog.autopaymentmodal` apunta a un modal concreto aunque la pestaña tenga varios.

El `DOMContentLoaded` no es opcional. En las plantillas del core (`ListView.html.twig`, `EditView.html.twig`, `EditListView.html.twig`) las filas de tipo footer se renderizan **antes** que los modales, así que en el momento en que el navegador ejecuta nuestro script en línea el `.modal-body` de destino todavía no existe en el DOM. Hay que esperar a que el documento esté completo.

Una vez trasladado, el contenido queda dentro del `&lt;form id=&quot;formModal…&quot;&gt;` del modal. Sus campos (`amount`, `company`, `paymentMethod`, `idpayment`…) se envían junto al `action` del modal al pulsar *Aceptar*, exactamente igual que si fueran columnas declaradas en el XML.

### Paso 5: abrir el modal

La forma estándar es un botón de tipo `modal` cuyo `action` coincida con el `name` del grupo. Se puede declarar en el XMLView o desde el controlador:

```php
$this-&gt;addButton($viewName, [
    &#39;action&#39; =&gt; &#39;add-receipts-auto&#39;,
    &#39;color&#39; =&gt; &#39;success&#39;,
    &#39;icon&#39; =&gt; &#39;fa-solid fa-folder-plus&#39;,
    &#39;label&#39; =&gt; &#39;auto&#39;,
    &#39;type&#39; =&gt; &#39;modal&#39;,
]);
```

Estos botones llaman además a `setModalParentForm()`, que copia al formulario del modal el `code` del registro o los `codes[]` de las filas marcadas del listado. Si abrimos el modal por otras vías, esa copia no ocurre y hay que enviar los identificadores por nuestra cuenta (en el ejemplo anterior, mediante el `input` oculto `idpayment`).

También podemos abrirlo desde JavaScript, que es lo habitual cuando el modal es puramente informativo y se dispara al pulsar una fila:

```javascript
const modal = document.getElementById(&#39;modalinvoice-info&#39;);
new bootstrap.Modal(modal, { backdrop: &#39;static&#39;, focus: true }).show();
```

### Paso 6: procesar la acción en el controlador

Nada cambia respecto a un modal normal: la acción llega a `execPreviousAction()` con el `name` del grupo y los campos se leen del request.

```php
protected function execPreviousAction($action)
{
    switch ($action) {
        case &#39;add-receipts-auto&#39;:
				    [ .... ]
            return true;

        default:
            return parent::execPreviousAction($action);
    }
}
```

## Variantes del proceso (otros ejemplos de uso)

### Modal informativo de solo lectura

Cuando el modal solo muestra información no tiene sentido el botón *Aceptar* que genera el core. Lo eliminamos en el mismo script del traslado.

```twig
&lt;script&gt;
    document.addEventListener(&#39;DOMContentLoaded&#39;, function () {
        const modalDialog = document.querySelector(&#39;.modal-dialog.invoiceinfomodal&#39;);
        if (!modalDialog) return;

        const modalBody = modalDialog.querySelector(&#39;.modal-body&#39;);
        const sourceDiv = document.getElementById(&#39;invoiceinfomodalbody&#39;);
        if (modalBody && sourceDiv) {
            modalBody.innerHTML = &#39;&#39;;
            modalBody.appendChild(sourceDiv);
        }

        const modalFooter = modalDialog.querySelector(&#39;.modal-footer&#39;);
        if (modalFooter) {
            const acceptButton = modalFooter.querySelector(&#39;button[type=&quot;submit&quot;], input[type=&quot;submit&quot;]&#39;);
            if (acceptButton) {
                acceptButton.remove();
            }
        }
    });
&lt;/script&gt;
```

El botón *Cancelar* se mantiene y hace de botón de cierre.

### Contenido dinámico rellenado por JSON

El contenido trasladado sigue siendo HTML normal, así que podemos dejar contenedores vacíos y rellenarlos desde JavaScript antes de mostrar el modal. Es el patrón para modales de detalle, donde los datos dependen de la fila pulsada.

La plantilla define el esqueleto:

```twig
&lt;style&gt;
    .modal-dialog.invoiceinfomodal .modal-body .modal-body-scroll {
        max-height: 65vh;
        overflow-y: auto;
        padding-right: 1rem;
    }
&lt;/style&gt;

&lt;div id=&quot;invoiceinfomodalbody&quot; class=&quot;row&quot;&gt;
    &lt;div class=&quot;col-12 mb-3&quot;&gt;
        &lt;div class=&quot;p-3 bg-light border border-info rounded&quot;&gt;
            &lt;strong&gt;{{ trans(&#39;customer&#39;) }}:&lt;/strong&gt; &lt;span id=&quot;fact-client&quot;&gt;-&lt;/span&gt;
            &lt;strong&gt;{{ trans(&#39;invoice&#39;) }}:&lt;/strong&gt; &lt;span id=&quot;fact-number&quot;&gt;-&lt;/span&gt;
            &lt;strong&gt;{{ trans(&#39;date&#39;) }}:&lt;/strong&gt; &lt;span id=&quot;fact-date&quot;&gt;-&lt;/span&gt;
            &lt;strong&gt;{{ trans(&#39;total&#39;) }}:&lt;/strong&gt; &lt;span id=&quot;fact-total&quot;&gt;-&lt;/span&gt;
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;div class=&quot;modal-body-scroll col-12&quot;&gt;
        &lt;table class=&quot;table table-striped table-bordered mb-0 w-100&quot;&gt;
            &lt;thead&gt;...&lt;/thead&gt;
            &lt;tbody id=&quot;modal-invoice-lines&quot;&gt;&lt;/tbody&gt;
        &lt;/table&gt;
    &lt;/div&gt;
&lt;/div&gt;
```

El script del controlador (cargado con `AssetManager::add(&#39;js&#39;, …)`) pide los datos y abre el modal:

```javascript
const data = new FormData();
data.append(&quot;action&quot;, &quot;invoice-info&quot;);
data.append(&quot;idreceipt&quot;, params.code);

fetch(window.location.href, { method: &quot;POST&quot;, body: data })
    .then(response =&gt; response.json())
    .then(result =&gt; showModalInvoice(result.lines, result.header));
```

Y en el controlador respondemos con JSON en lugar de recargar la vista:

```php
case &#39;invoice-info&#39;:
    $this-&gt;setTemplate(false);
		$results = [ .... ]
    $this-&gt;response-&gt;setContent(json_encode($results));
    return false;
```

Fíjate en que el mismo `name` del modal (`invoice-info`) se reutiliza como nombre de acción para el endpoint JSON. No es obligatorio, pero mantiene el código agrupado.

## Por qué no declarar el modal completo dentro de la plantilla

La tentación es escribir directamente todo el `&lt;div class=&quot;modal&quot;&gt;` dentro de la plantilla Twig del pie y olvidarse de la etiqueta `modals`. No funciona bien, por dos motivos:

- El panel del pie se renderiza **dentro del `&lt;form&gt;` principal de la vista**. Un formulario anidado es HTML inválido: el navegador lo descarta y los campos del modal acaban enviándose con el formulario y la acción equivocados.
- El modal queda anidado dentro de varios contenedores posicionados (`container-fluid`, `row`, `col`, `card`). Bootstrap inserta el fondo oscuro (*backdrop*) como hijo directo de `body`, así que el modal se dibuja *por debajo* de ese fondo. El efecto es desconcertante: la pantalla se oscurece y parece que el modal no se ha abierto, cuando en realidad está ahí, tapado.

Si aun así se necesita un modal totalmente artesanal, sin usar la etiqueta `modals`, el remedio es sacarlo del árbol y colgarlo directamente del `body` antes de mostrarlo:

```javascript
document.addEventListener(&#39;DOMContentLoaded&#39;, function () {
    const modal = document.getElementById(&#39;miModalPropio&#39;);
    if (modal && modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }
});
```

Aun así, la técnica recomendada es la de esta guía: dejar que el core cree la carcasa en el lugar correcto del DOM y limitarnos a sustituir su contenido. Así conservamos el formulario, el token de seguridad, la propagación de `code` y `codes[]`, la traducción del título y la integración natural con `execPreviousAction()`.

## Resumen

- Declara el grupo en `modals` **sin columnas**, con una clase marcadora propia (y `modal-xl`, `modal-lg`… si hace falta).
- Escribe el contenido en `View/Block/…html.twig`, envuelto en un `div` con `id` propio y clase `row`.
- Inclúyelo con `html=&quot;Block/…html.twig&quot;` en un `group` de `row type=&quot;footer&quot;` con `class=&quot;d-none&quot;`.
- Traslada el `div` al `.modal-body` en `DOMContentLoaded`, vaciando antes su contenido.
- Abre el modal con un botón `type=&quot;modal&quot;` cuyo `action` sea el `name` del grupo, o con `bootstrap.Modal` desde JavaScript.
- Procesa los datos en `execPreviousAction()` leyendo los campos del request.