---
id: 3551
permalink: los-conceptos-predefinidos
title: Los conceptos predefinidos
creationdate: 22-07-2026 11:41:59
lastmod: 10-09-2026
url: https://facturascripts.com/publicaciones/los-conceptos-predefinidos
---
Los conceptos predefinidos te permiten guardar los textos que usas con más frecuencia en el campo concepto de los asientos, para no tener que escribirlos una y otra vez.

Puedes gestionarlos desde el menú Contabilidad → Asientos contables, en la pestaña Conceptos predefinidos.

![Listado de conceptos predefinidos](https://i.imgur.com/LSWcSeH.png)

## ➕ Crear un concepto predefinido
Pulsa el botón `Nuevo`, escribe la descripción del concepto y guarda.

## ✨ Comodines

En la descripción puedes usar comodines que se sustituyen por el valor correspondiente al elegir el concepto. Son **los mismos códigos que usan las [secuencias de documentos](https://facturascripts.com/publicaciones/secuencias-de-documentos-184)**, escritos entre llaves.

Estos son los que tienen sentido en un asiento:

- `{FECHA}`: la fecha del asiento.
- `{DIA}`: el día del asiento, con 2 cifras.
- `{MES}`: el mes del asiento, con 2 cifras.
- `{NOMBREMES}`: el nombre del mes del asiento, por ejemplo `julio`.
- `{ANYO}`: el año del asiento con 4 cifras.
- `{ANYO2}`: el año del asiento con 2 cifras.
- `{NUM}`: el número del asiento.
- `{HORA}` y `{FECHAHORA}`: la hora, y la fecha con la hora. El asiento no guarda hora, así que se usa la del momento en que se aplica el concepto.

Por ejemplo, el concepto `Nómina de {NOMBREMES} de {ANYO}` se convertirá en algo como `Nómina de julio de 2026`.

⚠️ Ten en cuenta que **las fechas se toman del propio asiento**, no del día en que escribes. Si creas un asiento con fecha de enero, `{NOMBREMES}` pondrá `enero` aunque hoy sea julio.

Los códigos `{EJE}`, `{EJE2}`, `{SERIE}` y `{0SERIE}` también se admiten, pero en los asientos se quedan **vacíos**, porque el asiento no guarda ni ejercicio ni serie en esos campos. Y `{0NUM}` se comporta igual que `{NUM}`, sin rellenar con ceros: el relleno solo funciona en las secuencias de documentos, donde hay una longitud configurada.

![Concepto predefinido con comodines](https://i.imgur.com/n6rwKD9.png)

### 🔤 Filtros de formato

Añadiendo una barra vertical y una letra al final puedes cambiar cómo se escribe el resultado:

- `|M`: todo en MAYÚSCULAS.
- `|m`: todo en minúsculas.
- `|P`: la primera letra en mayúscula.
- `|T`: la primera letra de cada palabra en mayúscula.

Por ejemplo, `Nómina de {NOMBREMES}|M` da `NÓMINA DE JULIO`. El filtro se aplica a todo el texto, no solo al comodín.

## 📝 Usar un concepto predefinido
Al crear un asiento, en el campo `Concepto` puedes seleccionar uno de tus conceptos predefinidos: FacturaScripts rellenará el texto automáticamente y sustituirá los comodines por sus valores.

Puedes ver el paso a paso completo en [Cómo hacer un asiento contable](https://facturascripts.com/publicaciones/tu-primer-asiento-463).

![Desplegable de conceptos predefinidos](https://i.imgur.com/HoYAdyf.png)

## Ver también

- [Cómo hacer un asiento contable](https://facturascripts.com/publicaciones/tu-primer-asiento-463)
- [Los diarios contables](https://facturascripts.com/publicaciones/los-diarios-contables)
- [Menú Contabilidad](https://facturascripts.com/publicaciones/menu-contabilidad)