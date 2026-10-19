---
idproject: 801
name: FirmarAhora
permalink: firmarahora
creationdate: 29-09-2026
lastmod: 05-10-2026
version: 4
betaversion: 0
mincore: 2026.1
maxcore: 2026.7
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/FirmarAhora
---
FirmarAhora añade firma electrónica a FacturaScripts sin depender de servicios externos ni de otros plugins.

Cada presupuesto, pedido, albarán y factura de cliente tiene una pestaña Firmas desde la que puedes:

- Firmar en el momento, en la tablet o el ordenador de la oficina: el cliente dibuja su firma con el dedo, la escribe o sube una imagen.
- Pedir la firma a distancia: el cliente recibe un email con un botón y firma desde el móvil sin registrarse. También puedes mandarle el enlace por WhatsApp con un botón.
- Añadir varios firmantes al mismo documento: cliente, técnico, testigo…

Para dar más garantías:

- Código por email (OTP), opcional en cada solicitud: sin verificarlo no se puede ver el documento ni firmar.
- DNI o NIF de quien debe firmar, opcional: solo podrá firmar quien escriba ese mismo documento.
- Copia sellada en PDF con un certificado de evidencias: quién firmó, con qué NIF, cuándo, desde qué IP y navegador, si verificó el código, y la huella SHA-256 del documento que vio.
- Página pública de verificación: con el código que aparece en el PDF, cualquiera comprueba quién firmó y puede subir el PDF para saber si es idéntico al original.
- Registro de auditoría de cada solicitud: enviada, abierta, código verificado, firmada, rechazada…
- Las pruebas no se pierden: si se borra un documento firmado, la firma y su copia se conservan; si se modifica, el plugin avisa.

Y para trabajar menos:

- Contratos desde plantillas con editor visual y variables ({{cliente.nombre}}, {{factura.total}}…).
- Envío masivo: un contrato para cada email de una lista, con los contactos que falten creados al momento.
- Recordatorios automáticos a quien no ha firmado y caducidad de los enlaces.
- El cliente puede rechazar con motivo, y te llega un aviso por email en cuanto firma o rechaza.
- «PDF con firmas» en el menú Imprimir: el documento con las firmas al pie, sin tocar el PDF normal ni chocar con otros plugins de plantillas.
- Al convertir un presupuesto en pedido, albarán o factura, las firmas se copian al nuevo documento indicando qué documento se firmó.
- Presupuestos que se aceptan solos: cuando firman todos, pasan a pedido o a factura (opcional).
- Ubicación del firmante en el certificado, con su permiso (opcional).
- Página de firma en el idioma del cliente: español, inglés, catalán, valenciano, gallego, francés, italiano, portugués y alemán.

Ejemplos de uso

- Taller o servicio técnico: el cliente firma el albarán de entrega en la tablet al recoger el equipo, y el técnico firma también. El «PDF con firmas» del albarán lleva las dos firmas al pie.
- Presupuestos a distancia: envías el presupuesto, el cliente lo abre en el móvil, verifica el código que le llega por email y lo acepta firmando. Recibes el aviso y el presupuesto pasa a pedido con la firma incluida.
- Contratos de mantenimiento o mandatos SEPA: preparas una plantilla una vez y la envías a 50 clientes en un solo paso. Cada uno firma su copia, y ves en el listado quién ha firmado y a quién hay que recordárselo.

Las firmas son firmas electrónicas simples con evidencias (reglamento eIDAS), no firmas cualificadas con certificado digital.