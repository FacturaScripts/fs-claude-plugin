---
idproject: 117
name: LawFirm
permalink: lawfirm
creationdate: 18-03-2021
lastmod: 27-08-2026
version: 2.1
betaversion: 1.25
mincore: 2026.5
maxcore: 2026.5
compatible: DocumentosRecurrentes
min_php: 8.1
require: WidgetRichText
require_php: 
url: https://facturascripts.com/plugins/LawFirm
---
**El despacho, de la primera consulta a la minuta.**

LawFirm convierte FacturaScripts en la herramienta de gestión de un despacho de abogacía. Abre el expediente cuando entra el asunto, redacta e imprime la hoja de encargo que firma el cliente, anota el trabajo según se va haciendo y lo factura sin volver a teclearlo. Todo en el mismo sitio y sin duplicar un solo dato.

## El expediente, en el centro

Cada asunto es un expediente, y de él cuelga todo lo demás: quién es el cliente y quién paga, la parte contraria con su abogado, su procurador y su perito, el procedimiento judicial con su juzgado, su fase y su número de autos, el trabajo realizado, los documentos firmados y las facturas emitidas.

Un asunto puede empezar antes de estar cerrado. Si el despacho lo activa, el expediente nace como **propuesta**, con una numeración provisional que no consume la serie del año, y solo recibe su código definitivo cuando el encargo se acepta —momento en el que el código nuevo se propaga solo a los presupuestos y documentos que ya colgaban de él—. Así se sabe cuántas propuestas se emiten y cuántas acaban firmándose, y los asuntos que no salen adelante no ensucian el listado.

## La hoja de encargo, escrita sola

El clausulado se define una vez, como plantilla, con marcadores donde van los datos: el cliente, el letrado, el juzgado, el objeto del encargo, los honorarios. Al imprimir el contrato de un asunto concreto, los marcadores se sustituyen por los datos reales y sale el PDF listo para firmar, con el membrete del despacho, sus datos colegiales y el cuadro de firmas.

El plugin trae **diez plantillas de partida** —penal, civil, a resultado, iguala y colaboración, cada una para persona física y jurídica— que el despacho puede reescribir a su gusto. Se admite cualquier régimen de honorarios: por actuaciones, cerrado, a resultado con su porcentaje, o iguala con su cuota periódica. El contrato pide en cada caso solo los datos que ese régimen necesita.

Y un detalle que evita disgustos: **un dato que falta nunca se imprime en blanco**. El hueco se ve en el papel, con lo que ningún contrato se firma con una cláusula a medias.

## Pensado para un despacho, no adaptado

- Las fichas de empresa y de agente son las de un despacho y un letrado: colegio, número de colegiado, número de inscripción en el Registro de Sociedades Profesionales, compañía y póliza del seguro de responsabilidad civil. Sin pestañas de almacén ni de stock.
- Se instalan de serie los catálogos que hacen falta el primer día: los **más de 5.000 órganos judiciales de España**, tomados del buscador oficial del Ministerio de Justicia y ya adaptados a los Tribunales de Instancia, con su dirección y su teléfono; más los tipos de materia, los tipos de procedimiento y un listado extenso de asuntos. Ningún juzgado hay que teclearlo.
- El expediente guarda sus propios archivos —el encargo escaneado, escritos, resoluciones, notificaciones— ordenables por orden procesal.
- Cualquier presupuesto, pedido, albarán o factura se puede vincular a un expediente, y todos se consultan desde su ficha.

---

## Requisitos

FacturaScripts 2026 o superior, PHP 8.1 o superior y el plugin **WidgetRichText**, con el que se redacta el clausulado de las plantillas. 
Es compatible con **DocumentosRecurrentes**, que se encarga de emitir las facturas periódicas de las igualas.