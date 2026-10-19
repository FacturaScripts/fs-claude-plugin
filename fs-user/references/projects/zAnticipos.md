---
idproject: 787
name: zAnticipos
permalink: zanticipos
creationdate: 07-09-2026
lastmod: 15-10-2026
version: 1.25
betaversion: 0
mincore: 2026.65
maxcore: 2026.7
compatible: Zolteka,zPlazosPago,zAnticiposPlantillasPDF
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/zAnticipos
---
🌟 ¿Qué es zAnticipos? Anticipos y compensación de saldos en FacturaScripts

zAnticipos cubre dos tareas que en FacturaScripts suelen acabar en apaños a mano y en descuadres:

* **Anticipos de clientes y proveedores.** Si cobras antes de entregar, tienes que emitir una **factura legal de anticipo** y declarar el IVA en ese momento (**devengo inmediato**, art. 75.Dos de la Ley del IVA en España, con normas equivalentes del SAT en México y la DIAN en Colombia). Meter líneas negativas a mano no cumple esa obligación y descuadra la contabilidad.
* **Compensación de saldos entre cliente y proveedor.** Si una empresa te compra y también te vende, cruzas sus recibos pendientes y solo pagas o cobras la diferencia, sin transferencias de ida y vuelta.

### 💰 1. Anticipos: factura legal y mochila de saldo

* **Factura de anticipo en dos clics:** serie propia, IVA en la fecha del cobro y asiento automático en la cuenta 438. Si el pedido lleva varios tipos de IVA, recargo o IRPF, crea una línea por cada uno.
* **El saldo sigue al trabajo:** el dinero cobrado va en una **mochila de saldo** de presupuesto a pedido, albarán y factura. Funciona con entregas 1:1, con un pedido repartido en varios albaranes (1:N) y con varios pedidos juntos en un albarán (N:1). Primero se usa el saldo más antiguo (FIFO).
* **Factura final sin cuentas a mano:** al facturar, el anticipo se descuenta con una línea negativa y la factura queda por la diferencia, o a 0,00 € si estaba pagado entero. **Cero descuadres.**
* **Imprevistos resueltos:** traspasa el saldo a otro pedido del mismo cliente, devuelve el dinero con una rectificativa o cancela el encargo quedándote el anticipo como indemnización (serie CAN, sin IVA).

### ⚖️ 2. Compensación de saldos entre cliente y proveedor

* **Cuándo sirve:** con colaboradores a los que compras y vendes a la vez, por ejemplo un taller que te subcontrata trabajos y te compra material.
* **Qué hace:** cruza los recibos pendientes de cobro y de pago con el mismo NIF, compensa el importe menor y deja la diferencia como un recibo pendiente. Genera la liquidación y un asiento directo entre las cuentas del proveedor y del cliente, sin pasar por el banco.
* **Papeles para las dos partes:** justificante en PDF con espacio para la firma de ambos y extracto de cuenta para enviar por email.
* **Se puede deshacer:** si te equivocas, la liquidación se anula y los recibos vuelven a quedar pendientes.
* Todo el detalle está en el [capítulo 4](https://facturascripts.com/publicaciones/4-compensacion-de-saldos-de-recibos-entre-cliente-y-proveedor).

### 📊 3. Control y cuadros de mando

* **Cuadro de mando de anticipos:** saldo vivo, anticipos con más de 60 días, antigüedad (Aging) y días que tardan en facturarse (DSOA), para que ningún anticipo se quede olvidado.
* **Avisos para revisar:** la pestaña Resolver anomalías señala pedidos atascados, saldos negativos o ventas facturadas dos veces.
* **Ficha de cliente y proveedor:** pestaña con los anticipos abiertos de cada uno y su antigüedad.
* **Con [Zolteka](https://facturascripts.com/plugins/zolteka):** si tienes el plugin `Zolteka`, añade una tarjeta de anticipos al panel principal.

### 📚 Documentación y Soporte Oficial
* 🔗 *[1. Conceptos, contabilidad y puesta en marcha →](https://facturascripts.com/publicaciones/1-conceptos-basicos-contabilidad-y-puesta-en-marcha#tag-publication-title)*
* 🔗 *[2. Operativa diaria de anticipos: del presupuesto a la factura de cierre →](https://facturascripts.com/publicaciones/2-operativa-diaria-del-presupuesto-a-la-factura-de-cierre#tag-publication-title)*
* 🔗 *[3. Traspasos, rectificativas y cancelaciones de anticipos →](https://facturascripts.com/publicaciones/3-gestion-avanzada-traspasos-rectificativas-y-cancelaciones#tag-publication-title)*
* ⚖️ *[4. Compensación de saldos entre cliente y proveedor →](https://facturascripts.com/publicaciones/4-compensacion-de-saldos-de-recibos-entre-cliente-y-proveedor#tag-publication-title)*
* 🔗 *[5. Consultas, cuadros de mando y auditoría →](https://facturascripts.com/publicaciones/4-consultas-globales-auditoria-y-cuadros-de-mando#tag-publication-title)*
* 🚀 *[6. Seguridad, casos prácticos, preguntas frecuentes y soporte →](https://facturascripts.com/publicaciones/5-seguridad-tecnica-casos-practicos-preguntas-frecuentes-y-soporte#tag-publication-title)*

&gt; 🔑 **Palabras Clave:** `anticipos legales, factura de anticipo, mochila de saldo, trazabilidad comercial, liva españa, cuenta 438, retencion de fondos, dashboard anticipos, finanzas, compensacion clientes proveedores, bolsa de saldos`