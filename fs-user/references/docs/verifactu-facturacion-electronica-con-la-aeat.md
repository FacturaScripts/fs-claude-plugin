---
id: 2111
permalink: verifactu-facturacion-electronica-con-la-aeat
title: VERI*FACTU: software de facturación y envío de registros a la AEAT
creationdate: 01-05-2025 12:55:04
lastmod: 06-10-2026
url: https://facturascripts.com/publicaciones/verifactu-facturacion-electronica-con-la-aeat
---
El [plugin VERI*FACTU](https://facturascripts.com/plugins/verifactu) añade a FacturaScripts soporte para remitir a la Agencia Tributaria los registros de facturación exigidos por el Reglamento de requisitos de los sistemas informáticos de facturación.

## ¿Qué es VERI*FACTU?

El Reglamento aprobado por el Real Decreto 1007/2023 regula cómo deben funcionar los sistemas informáticos de facturación para garantizar la integridad, conservación, accesibilidad, legibilidad, trazabilidad e inalterabilidad de los registros.

Existen dos modalidades válidas:

- **VERI*FACTU:** el sistema remite a la AEAT los registros de facturación inmediatamente después de generarlos.
- **Sistema de emisión de facturas no verificables:** conserva los registros localmente y debe cumplir requisitos adicionales de firma y registro de eventos.

El plugin de FacturaScripts funciona en modalidad VERI*FACTU.

## ¿Cuándo será obligatorio?

**Nuevo aplazamiento a octubre de 2028.** El 5 de octubre de 2026 el Ministerio de Hacienda anunció que VERI*FACTU dejará de ser obligatorio en 2027 y pasará a aplicarse en **octubre de 2028**, cuando entre en vigor la factura electrónica para todos los obligados, con el fin de alinear ambos calendarios. Con el cambio desaparece la distinción entre sociedades y autónomos: habrá una única fecha para todos.

El aplazamiento todavía tiene que aprobarse mediante la modificación normativa correspondiente y publicarse en el BOE. Mientras tanto siguen formalmente vigentes los plazos del Real Decreto-ley 15/2025:

- **1 de enero de 2027:** contribuyentes del Impuesto sobre Sociedades incluidos en el reglamento.
- **1 de julio de 2027:** resto de obligados tributarios incluidos en su ámbito, entre ellos los autónomos que desarrollan actividades económicas.

Actualizaremos esta página en cuanto se publique la norma con la fecha definitiva. El periodo anterior a la fecha de obligatoriedad es un periodo de pruebas. El ámbito de aplicación y las exclusiones deben comprobarse según el territorio, el régimen tributario, el tipo de operación y las demás circunstancias de cada obligado. Por ejemplo, los contribuyentes sometidos al SII quedan fuera del ámbito del reglamento y los territorios forales disponen de sus propios sistemas.

## ¿Es lo mismo que la factura electrónica?

No. VERI*FACTU y la factura electrónica son conceptos relacionados, pero distintos.

- **VERI*FACTU** regula el funcionamiento del software y la generación y remisión de registros de facturación a la AEAT.
- **La factura electrónica B2B** regula la factura estructurada que se expide, transmite y recibe entre empresarios y profesionales.
- **Facturae/FACE** se utiliza para facturar electrónicamente a las administraciones públicas.
- **TicketBAI** es el sistema aplicable en los territorios forales correspondientes.

El registro enviado a la AEAT en modalidad VERI*FACTU es un resumen estructurado de la factura, pero no es la factura electrónica.

## Código QR

Las facturas expedidas mediante los sistemas informáticos incluidos en el reglamento deben incorporar el código QR o, cuando se trate de una factura electrónica, la información que representa ese código. Si el sistema funciona en modalidad VERI*FACTU, la factura también incluye la indicación correspondiente.

## Certificación del software

No existe una homologación previa ni un registro del producto ante la AEAT. La persona o entidad productora certifica que cada versión cumple la normativa mediante una **declaración responsable** incorporada al sistema. No se exige una certificación realizada por una entidad externa.

## VERI*FACTU en FacturaScripts

Consulta la [ficha del plugin VERI*FACTU](https://facturascripts.com/plugins/verifactu) para conocer su versión actual, compatibilidad, configuración y documentación de uso.

### Fuentes oficiales

- [Sistemas informáticos de facturación y VERI*FACTU — Agencia Tributaria](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu.html)
- [Plazos de adaptación — Agencia Tributaria](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu/nota-informativa-ampliacion-plazo-adaptacion-facturacion.html)
- [Certificación y declaración responsable — Agencia Tributaria](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu/preguntas-frecuentes/certificacion-sistemas-informaticos-declaracion-responsable.html)