---
idproject: 109
name: DocumentosRecurrentes
permalink: documentosrecurrentes
creationdate: 11-11-2020
lastmod: 05-08-2026
version: 3.23
betaversion: 
mincore: 2026.5
maxcore: 2026.5
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/DocumentosRecurrentes
---
Plugin para **FacturaScripts** que automatiza la creación de los documentos que repites una y otra vez.
En lugar de crear cada mes la misma factura a mano, defines una **plantilla** (qué clientes/proveedores, qué productos y cada cuánto tiempo) y el sistema genera los documentos por ti, de forma automática o cuando tú decidas.

Funciona con **ventas y compras**, y no solo con facturas: puedes generar de forma recurrente cualquiera de los documentos de FacturaScripts.

Así puedes, por ejemplo, emitir cada mes la **factura** de una cuota, pero también lanzar automáticamente el **pedido** o el **presupuesto** que envías siempre igual a un proveedor.

## ¿Para qué sirve? (casos de uso reales)
Es ideal para cualquier negocio que cobre o pague de forma periódica. Por ejemplo:

- **Alojamientos / hosting / dominios**: factura mensual o anual a cada cliente por su servicio de hospedaje.
- **Academias y centros de formación**: la cuota mensual de los alumnos de las clases de repaso, idiomas o música.
- **Cuotas y suscripciones**: gimnasios, clubs, asociaciones, plataformas, mantenimientos de software, etc.
- **Igualas y servicios profesionales**: asesorías, despachos de abogados, gestorías o agencias que facturan
  una cantidad fija todos los meses.
- **Alquileres**: locales, trasteros, equipos o vehículos con renta mensual.
- **Mantenimientos**: limpieza, jardinería, ascensores, equipos informáticos, contratos de soporte.
- **Compras periódicas a proveedores**: el alquiler que pagas, la cuota del software, los suministros que
  recibes siempre igual cada mes.

En todos estos casos defines la plantilla una sola vez y te olvidas: los documentos se crean solos en su fecha.


## ¿Cómo funciona? En 3 pasos

1 - **Creas una plantilla** del documento recurrente (de venta o de compra) indicando el cliente o proveedor, los productos o conceptos a facturar y el tipo de documento a generar (factura, albarán, pedido o presupuesto).

2 - **Eliges cada cuánto** se debe generar: cada cierto número de **días**, **semanas** o **meses**; o bien  lo dejas en modo **manual** para generarlo tú con un clic cuando quieras.

3 - El sistema **crea el documento solo** en la fecha correspondiente (y, si lo configuras, lo **envía por  email** al cliente automáticamente).

## Dos formas de facturar de forma recurrente

El plugin cubre los dos escenarios típicos de la facturación periódica. Puedes usar el que necesites e incluso combinarlos.

1 - Plantillas individuales: conceptos distintos para cada cliente
    Cada plantilla es independiente y tiene **sus propios conceptos, importes y periodicidad**. Es la opción ideal cuando cada cliente (o proveedor) factura cosas diferentes o paga importes distintos.

2 - Grupos recurrentes: los mismos conceptos para una lista de clientes
    Cuando muchos clientes comparten **exactamente la misma plantilla** (los mismos conceptos y la misma configuración), creas un **grupo** una sola vez, defines las líneas comunes y le vinculas todos los clientes de golpe. Cada cliente conserva su propia planificación (fechas, periodicidad y porcentaje del primer documento), pero los conceptos se gestionan desde un único sitio: si cambias una línea, el cambio se aplica a todos.

**Puedes saber más detalles en la [documentación del plugin](https://facturascripts.com/publicaciones/presentacion-documentosrecurrentes)**