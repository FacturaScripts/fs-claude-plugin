---
id: 1059
permalink: los-formatos-de-impresion-de-facturascripts
title: Formatos de Impresión en FacturaScripts
creationdate: 18-02-2022 13:34:01
lastmod: 03-09-2026
url: https://facturascripts.com/publicaciones/los-formatos-de-impresion-de-facturascripts
---
Puede personalizar los textos y títulos mostrados al imprimir algunos documentos creando un formato de impresión para ese tipo de documento. Los formatos de impresión se pueden gestionar desde el **menú Administrador → Panel de control**, sección **Formatos de impresión**.

Puede generar formatos de impresión para cada tipo de documento creado en FacturaScripts, ya sea para Compras o Ventas. Además, si desea un control más preciso, puede configurar formatos de impresión específicos por cada serie.

## Información mínima para crear un formato de impresión

Para crear un formato de impresión, necesitamos definir la siguiente información mínima:

- **Nombre**: Introduce el nombre del formato que deseas crear.
- **Título**: Este es el texto que se mostrará en el documento PDF generado, justo delante del número del documento.
- **Logotipo**: Si deseas configurar un logotipo específico, puedes seleccionar una imagen de las que hayas subido a la biblioteca. Para más información, consulta la guía sobre [Logotipo](https://facturascripts.com/publicaciones/logotipo-y-lopd-299).
- **Texto adicional**: Aquí puedes introducir cualquier texto adicional que desees que aparezca al final del documento.
- **Aplicar automáticamente a**: Marca esta opción si deseas que este formato se aplique a un tipo de documento y/o serie específicos.
- **Tipo de documento**: Selecciona el tipo de documento al que afectará el formato.
- **Serie**: Si deseas que el formato solo aparezca en una serie específica, puedes elegirla aquí. Si no se elige ninguna, el formato se aplicará a todos los tipos de documentos previamente seleccionados.

![Crear formato de impresión](https://i.imgur.com/I6X8H3m.gif)

## 🎯 Cómo elige FacturaScripts el formato

Cuando marcas **Aplicar automáticamente a**, el formato se usa solo, sin que haya que elegirlo al imprimir. Si tienes varios formatos que podrían encajar con el mismo documento, el programa se queda siempre con **el más específico**, en este orden:

1. El que coincide en **tipo de documento y serie**.
2. El que coincide en **tipo de documento**, sin serie concreta.
3. El que coincide en **serie**, sin tipo de documento concreto.
4. El que no concreta ni tipo ni serie, es decir, el formato general.

En todos los casos solo se tienen en cuenta los formatos de la **empresa** del documento. Si ningún formato tiene marcado *Aplicar automáticamente a*, el documento se imprime con los textos y el logotipo por defecto.

Esto te permite tener un formato general para todo y luego excepciones. Por ejemplo: un formato con las condiciones habituales aplicado a las facturas de cliente, y otro más específico para las facturas de la serie de exportación, que llevará otro texto.

### Elegir el formato a mano
Aunque no marques *Aplicar automáticamente a*, el formato sigue disponible: al imprimir un documento puedes elegirlo en el desplegable de formatos. Es lo práctico para formatos que solo usas de vez en cuando.

## 🔍 Encontrar un formato

El listado tiene filtros por **tipo de documento**, **empresa** y **serie**, y el buscador funciona por nombre, título y texto adicional. Si tienes muchos formatos y no sabes cuál está saliendo en un documento, filtra por su tipo y su serie y aplica el orden de prioridad de arriba.

## Ver también

- [Cambiar el logotipo y LOPD](https://facturascripts.com/publicaciones/logotipo-y-lopd-299)
- [Las series de facturación](https://facturascripts.com/publicaciones/series-470)
- [El Panel de control](https://facturascripts.com/publicaciones/el-panel-de-control)