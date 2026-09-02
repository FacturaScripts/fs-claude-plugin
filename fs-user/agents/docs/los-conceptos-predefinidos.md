---
id: 3551
permalink: los-conceptos-predefinidos
title: Los conceptos predefinidos
creationdate: 22-07-2026 11:41:59
lastmod: 22-07-2026
url: https://facturascripts.com/publicaciones/los-conceptos-predefinidos
---
Los conceptos predefinidos te permiten guardar los textos que usas con más frecuencia en el campo concepto de los asientos, para no tener que escribirlos una y otra vez.

Puedes gestionarlos desde el menú Contabilidad → Asientos contables, en la pestaña Conceptos predefinidos.

## ➕ Crear un concepto predefinido
Pulsa el botón `Nuevo`, escribe la descripción del concepto y guarda.

## ✨ Comodines
En la descripción puedes usar comodines que se sustituyen por el valor correspondiente al crear el asiento:

- `%document%`: el identificador del documento indicado en la cabecera del asiento.
- `%date%`: la fecha actual.
- `%date-entry%`: la fecha indicada en la cabecera del asiento.
- `%month%`: el nombre del mes de la fecha del asiento.
- `%year%`: el año actual.

Por ejemplo, el concepto `Factura %document% de %month%` se convertirá en algo como `Factura FA-001 de julio`.

## 📝 Usar un concepto predefinido
Al crear un asiento, en el campo `Concepto` puedes seleccionar uno de tus conceptos predefinidos: FacturaScripts rellenará el texto automáticamente y sustituirá los comodines por sus valores.

Puedes ver el paso a paso completo en [Cómo hacer un asiento contable](https://facturascripts.com/publicaciones/tu-primer-asiento-463).