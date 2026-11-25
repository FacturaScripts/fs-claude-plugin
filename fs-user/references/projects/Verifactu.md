---
idproject: 448
name: Verifactu
permalink: verifactu
creationdate: 27-05-2025
lastmod: 23-11-2026
version: 1.52
betaversion: 0
mincore: 2026.65
maxcore: 2026.72
compatible: PlantillasPDF,CSVimport,Servicios
min_php: 8.1
require: 
require_php: soap
url: https://facturascripts.com/plugins/Verifactu
---
Plugin **gratuito** para cumplir con **Verifactu** (VERI*FACTU) en FacturaScripts. Cada factura de venta genera su registro de facturación con huella encadenada y firma, lleva el **código QR** de la AEAT en el PDF y en el ticket, y se envía sola a la **Agencia Tributaria**. Es el sistema que exige la Ley Antifraude a empresas y autónomos que facturan con un programa informático en España.

Lo usan más de 1.100 instalaciones activas y se actualiza con cada cambio de la AEAT y de FacturaScripts.

## Qué hace el plugin
- **Envío de facturas a la AEAT**: envía el alta de cada factura de venta con un botón o de forma automática al cambiarla de estado. Los envíos se hacen en segundo plano mediante el cron.
- **Código QR en tus facturas**: añade el QR tributario con la leyenda VERI*FACTU al PDF de la factura, a las plantillas de [PlantillasPDF](https://facturascripts.com/plugins/plantillaspdf) y a los tickets.
- **Modo Verifactu y modo NO Verifactu**: elige por ejercicio si envías los registros a la AEAT o si los conservas firmados en tu instalación con su registro de eventos.
- **Modo de pruebas**: envía al entorno de pruebas de la AEAT todas las veces que quieras antes de pasar al modo real.
- **Subsanación y anulación**: corrige los datos del cliente de una factura ya enviada o anúlala, y guarda el historial de registros de cada factura.
- **Consulta a la AEAT**: comprueba desde el informe de Verifactu qué facturas tiene registradas Hacienda y descarga los registros firmados en JSON y XML.
- **Requerimientos**: si la AEAT te pide los registros de un periodo, los preparas y los envía el cron.
- **Multiempresa**: cada empresa tiene su certificado y su configuración. Te avisa por email antes de que caduque el certificado.
- **Facturas de otros programas**: marca como enviadas o anuladas las facturas importadas que ya se remitieron desde otro software.
- **Canarias, Ceuta y Melilla**: califica correctamente las operaciones con estos territorios.
- **API**: alta, subsanación, anulación y QR desde la API de FacturaScripts para integrarlo con otras aplicaciones.
- **Declaración responsable**: descárgala desde *Administrador → Acerca de*.

## Requisitos
- FacturaScripts 2026.65 o superior y PHP 8.1 con la extensión `soap`.
- Un certificado digital válido ante la AEAT: de autónomo, de empresa, de representante o de sello.
- El [cron de FacturaScripts](https://facturascripts.com/publicaciones/el-cron-de-verifactu) ejecutándose cada 60 segundos.

¿No quieres instalar nada? El plugin viene incluido en el plan negocio de [factura.city](https://factura.city), el proveedor oficial de FacturaScripts en la nube.

## Cómo empezar
1. Descarga el plugin e instálalo desde *Administrador → Plugins*.
2. [Configura Verifactu](https://facturascripts.com/publicaciones/como-configurar-verifactu): sube el certificado en la empresa y elige el modo en el ejercicio.
3. [Envía tu primera factura](https://facturascripts.com/publicaciones/como-enviar-una-factura-a-verifactu) en modo de pruebas y, cuando todo esté correcto, desactiva el modo de pruebas.

## ¿Cuándo es obligatorio Verifactu?
El 5 de octubre de 2026 Hacienda anunció un nuevo aplazamiento hasta **octubre de 2028**, con una única fecha para empresas y autónomos que coincide con la factura electrónica obligatoria. Ese aplazamiento todavía tiene que publicarse en el BOE. Hasta entonces siguen vigentes las fechas del Real Decreto-ley 15/2025:
- **1 de enero de 2027**: contribuyentes del Impuesto sobre Sociedades.
- **1 de julio de 2027**: autónomos y resto de obligados.

Actualizaremos esta ficha en cuanto se publique la norma. Hasta la fecha de obligatoriedad puedes usar el plugin para probar y adaptar tu forma de trabajar sin prisas.

## Preguntas frecuentes
### ¿El plugin Verifactu es gratis?
Sí. Puedes descargarlo y usarlo sin pagar nada, con todas las empresas de tu instalación. El envío a la AEAT tampoco tiene coste.

### ¿Quién no tiene que usar Verifactu?
- Empresas y autónomos con domicilio fiscal en el País Vasco: usan [TicketBAI](https://facturascripts.com/plugins/ticketbai).
- Quienes ya están acogidos al Suministro Inmediato de Información (SII).

### ¿Está certificado por Hacienda?
La AEAT no certifica ni homologa programas. Lo que exige es una declaración responsable del fabricante, que puedes [descargar desde el propio programa](https://facturascripts.com/publicaciones/como-descargar-la-declaracion-responsable).

### ¿Verifactu es lo mismo que la factura electrónica?
No. Verifactu registra y comunica tus facturas a la AEAT. La factura electrónica entre empresas es otra obligación, de la Ley Crea y Crece. Lo explicamos en [Ley Antifraude y factura electrónica](https://facturascripts.com/ley-antifraude).

### ¿Me equivoqué en una factura enviada?
Si el error está en los datos del cliente, [subsana la factura](https://facturascripts.com/publicaciones/como-subsanar-una-factura-en-verifactu). Si el error está en los importes o las líneas, haz una factura rectificativa. La [anulación](https://facturascripts.com/publicaciones/como-anular-una-factura-en-verifactu) solo es para facturas que ya no son válidas.