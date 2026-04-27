---
id: 7
permalink: ya-disponible-facturascripts-2018-014-beta-14
title: Ya disponible FacturaScripts 2018.014 (beta 14)
creationdate: 14-12-2018 13:00:11
lastmod: 22-01-2019
url: https://facturascripts.com/publicaciones/ya-disponible-facturascripts-2018-014-beta-14
---

Ya podéis probar la beta 14 de FacturaScripts 2018 que cuenta con la siguiente lista de cambios:
- Al crear un **nuevo usuario** (no administrador) se le asigna automáticamente el primer **grupo de usuarios** y una de sus páginas como **página de inicio**.
- Nuevos métodos en modelos de factura, albarán, etc... para facilitar su creación o manipulación.
- Mejoras en el **cálculo de impuestos** de documentos de compra y venta. Ya están correctamente implementados el **régimen de IVA** de **recargo de equivalencia** y el exento, además del **IRPF**. Y también está operativa la configuración de **impuestos por zonas**, es decir, el poder configurar FacturaScripts para que aplique un impuesto u otro (o ninguno) en función de la dirección de facturación del cliente.
- La vista de factura, albarán, etc... ahora muestra qué usuario la creó, si el documento ha sido enviado por email y cuando, y si el documento ya está **pagado**. Además, podemos ir al cliente o proveedor haciendo clic en el icono.
- Ya podemos **filtrar por usuario** (autor) en los listados de facturas, albaranes...
- Ya se pueden desactivar los botones de guardar y deshacer desde el controlador.
- Añadido servicio como tipo de documento al configurar los estados del documento. Ya se está trabajando en el **plugin servicios** para esta nueva versión.
- [290 nuevos iconos disponibles](https://fontawesome.com/icons?d=gallery&v=5.6.0).
- Pequeñas mejoras en la disposición de elementos de la interfaz en dispositivos móviles.

## Nuevos métodos para crear en muy pocas líneas facturas, albaranes, etc...
Se han añadido los métodos getNewLine() y getProductNewLine($ref) a los modelos de facturas, albaranes, etc. De esta forma se simplifica enórmemente la creación o manipulación de estos.

### Ejemplo: crear una nueva factura por código
```
$factura = new FacturaCliente();
$factura-&gt;setSubject($cliente); /// supongamos que ya tenemos el cliente
$factura-&gt;setDate(&#39;12-01-2019&#39;, &#39;10:00:00&#39;);
if($factura-&gt;save()) {
	/// añadimos el producto 123
	$newLinea = $factura-&gt;getNewProductLine(&#39;123&#39;);
	$newLinea-&gt;cantidad = 1;
	$newLinea-&gt;save();
	/// recalculamos
	$docTools = new BusinessDocumentTools();
	$docTools-&gt;recalculate($factura);
	$factura-&gt;save();
}
```

## Dashboard
El dashboard ha sido movido del core al [plugin Dashboard](https://facturascripts.com/plugins/Dashboard) para continuar su desarrollo. Más adelante, cuando el desarrollo esté más avanzado, volverá al núcleo.

## Cómo actualizar
Como siempre, puedes actualizar desde el menú admin -&gt; panel de control -&gt; actualizador.
