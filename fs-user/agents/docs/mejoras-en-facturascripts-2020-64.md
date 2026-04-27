---
id: 135
permalink: mejoras-en-facturascripts-2020-64
title: Mejoras en FacturaScripts 2020.64
creationdate: 10-07-2020 17:46:20
lastmod: 12-07-2020
url: https://facturascripts.com/publicaciones/mejoras-en-facturascripts-2020-64
---

La versión 2020.64 de FacturaScripts es una pequeña actualización con algunas novedades y correcciones. Pero necesaria para los nuevos plugins de [TarifasAvanzadas](https://facturascripts.com/plugins/tarifasavanzadas) y [Proyectos](https://facturascripts.com/plugins/proyectos).

## Novedades
- Ahora podemos **generar automáticamente** todas las **liquidaciones de comisiones** pendientes para los agentes.
- Añadido el campo observaciones a las direcciones de los clientes. Este campo se ha añadido oculto y podemos activarlo desde el botón opciones situado arriba a la izquierda.
- Cuando un presupuesto, pedido o albarán viene de varios documentos (o se ha partido en varios), ahora se muestran esos documentos en una lista en lugar de un montón de recuadros.
- Mejorada la pantalla de tarifas para simplificar la forma de añadir/quitar clientes o grupos a la tarifa.
- En el formulario de variantes de producto, ahora se ocultan automáticamente los campos de atributos si no hay ningún atributo definido.

## Correcciones
- Solucionado bug al calcular las cantidades pendientes cuando un documento se parte en varios.
- Solucionado bug al calcular el gráfico de saldos de subcuentas al editar asientos.
- Aumentado el límite de elementos al exportar listados a excel.

## Mejoras para desarrollo
- Añadida la extensión checkPrototype al controlador DocumentStitcher.

## Nuevos plugins
A parte de los ya comentados TarifasAvanzadas y Proyectos, puede que todavía no conozcas los siguientes plugins que ya llevan tiempo disponibles:
- [EasyPos](https://facturascripts.com/plugins/easypos): punto de venta para facturascripts utilizando una interfaz HTML amigable con mobil y escritorio.
- [MultiEmail](https://facturascripts.com/plugins/multiemail): añade la opción de configurar multiples emails, y poder asociarlos a usuarios, grupos y empresas.
- [Redsys](https://facturascripts.com/plugins/redsys): con este plugin, las facturas que envíes a tus clientes llegarán con un enlace incrustado mediante el que podrán pagar directamente a través de Redsys.
