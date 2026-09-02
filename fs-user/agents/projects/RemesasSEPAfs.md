---
idproject: 723
name: RemesasSEPAfs
permalink: remesassepafs
creationdate: 16-07-2026
lastmod: 02-09-2026
version: 1.3
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/RemesasSEPAfs
---
RemesasSEPAfs genera remesas de adeudos directos SEPA en formato pain.008.001.02 (Norma 19-14 / Cuaderno 19, esquema basico CORE) a partir de tus recibos de cliente pendientes.

COMO FUNCIONA
- Da de alta el mandato SEPA de cada cliente (IBAN, referencia, fecha de firma, tipo).
- Crea una remesa: el acreedor se rellena con los datos de tu empresa; ajusta fecha de cobro y secuencia (FRST/RCUR/OOFF/FNAL).
- Pulsa &quot;Cargar recibos pendientes&quot; para incorporar las facturas de cliente sin pagar de clientes con mandato.
- Exporta el XML pain.008.001.02 listo para presentar en tu banco.

CARACTERISTICAS
- Validacion de IBAN (algoritmo mod-97).
- Gestion de mandatos por cliente.
- Agrupacion automatica por tipo de secuencia y calculo de totales.

REQUISITOS: FacturaScripts 2025 o superior. PHP 8.0+.

AVISO LEGAL: Este plugin ha sido desarrollado conforme a la normativa SEPA vigente (Norma 19-14 / pain.008.001.02). No constituye asesoramiento legal ni fiscal: cada empresa debe validar con su banco y con un asesor experto que su configuracion y uso cumplen la normativa aplicable a su caso concreto antes de presentar remesas reales.