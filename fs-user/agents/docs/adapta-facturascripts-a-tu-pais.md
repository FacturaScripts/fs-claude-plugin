---
id: 83
permalink: adapta-facturascripts-a-tu-pais
title: Adapta FacturaScripts a tu país
creationdate: 25-07-2019 10:28:41
lastmod: 25-07-2019
url: https://facturascripts.com/publicaciones/adapta-facturascripts-a-tu-pais
---

Gracias al nuevo diseño de FacturaScripts, ahora es más sencillo que nunca adaptarlo a cualquier país. Desde las **traducciones** y los **valores iniciales**, hasta las personalizaciones más específicas.

## Traducciones
Ahora puedes ayudar con las traducciones cómodamente desde esta misma web:
- Regístrate, si todavía no lo has hecho.
- [Únete al equipo de traducciones](https://facturascripts.com/colabora/TRANSLATIONS).
- Una vez aceptado, ya podrás modificar [las traducciones de FacturaScripts](https://facturascripts.com/traducciones).

### ¿Quieres traducir un idioma que no aparece en la lista?
Avísanos a través de la [sección contacto](https://facturascripts.com/contacto) y lo daremos de alta.

### Latinoamérica
En cada país hay algunos términos que se llaman distinto. En España se dice **albarán**, pero en otros países se llama **remito** o **guía de remisión**. Para solucionar este problema también tratamos el español de cada país como un idioma distinto, así podemos personalizar estos términos fácilmente.

#### ¿Cómo se dice albarán en tu país?
https://www.facturascripts.com/EditTranslation?code=4124

## Valores iniciales de impuestos, provincias...
Los valores iniciales para las tablas se definen en los **archivos csv** de la carpeta **Core/Data**, ya sea por país o por idioma. Por ejemplo, los impuestos para **Argentina** están en el archivo [Core/Data/Codpais/ARG/impuestos.csv](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Data/Codpais/ARG/impuestos.csv)

Así que ya sabes, si quieres añadir los impuestos de tu país, solamente debes colocar un archivo impuestos.csv en el directorio de tu país. Pero no seas tonto y **comparte**. Puedes hacernos llegar esos archivos a través un pull request en [github](https://github.com/NeoRazorX/facturascripts) o a través de la [sección contacto](https://facturascripts.com/contacto).

## Plan contable
FacturaScripts maneja un plan contable para cada ejercicio. Puedes hacer clic en el menú **contabilidad &gt; ejercicios**, clic en el ejercicio 2019, y ahí abajo encontrarás los botones de importar y exportar. El plan contable no es más que un archivo csv con 3 columnas: **cuenta**, **descripcion** y **cuentaesp**:
- **cuenta**: el código de la cuenta, por ejemplo &quot;1&quot;.
- **descripcion**: la descripción de la cuenta, por ejemplo: &quot;Financiación básica&quot;.
- **cuentaesp**: el código de la cuenta especial, algo que usamos para marcar algunas cuentas especiales, como la de &quot;CAJA&quot;.

### Niveles de cuentas
FacturaScripts permite **hasta 11 niveles** en la contabilidad, pero para que detecte bien el número de niveles del archivo csv, es necesario que incluyas al menos una **subcuenta**. Las subcuentas son el **último nivel** de cuentas y tienen todas la misma longitud, por ejemplo 10 caracteres. Lo recomendable es que el plan de cuentas incluya una subcuenta de caja, por ejemplo.

### Personalizaciones más profundas
Para personalizaciones más profundas ya es necesario modificar código. **Si eres programador**, lo mejor es que [te unas al equipo de desarrollo](https://facturascripts.com/colabora/DEVELOPMENT) y hables con nosotros para integrar los cambios necesarios.

En el pasado se personalizaba todo en plugins, pero casi siempre estos plugins se abandonaban y quedaban obsoletos. Ahora preferimos integrar todo lo posible en el núcleo y dejar para los plugins solamente aquello que sea tan específico para ese país, que no se pueda incluir en el núcleo.

## Comparte, difunde, ayúdanos a crecer
Y por último, pero no por ello menos importante. Otra forma de ayudar en la adaptación de FacturaScripts a tu país, es precisamente darlo a conocer. Comparte esta página, síguenos en twitter, facebook o youtube. **Ayúdanos a crecer ;-)**
- Twitter: https://twitter.com/facturascripts
- Facebook: https://www.facebook.com/facturascripts
- Youtube: https://www.youtube.com/channel/UCtsptMQYpW2wJZkvak6NYng
