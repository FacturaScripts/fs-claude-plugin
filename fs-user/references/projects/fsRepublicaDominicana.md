---
idproject: 176
name: fsRepublicaDominicana
permalink: fsrepublicadominicana
creationdate: 10-01-2022
lastmod: 04-11-2026
version: 1.38
betaversion: 1.36
mincore: 2026
maxcore: 2026.72
compatible: 
min_php: 8.2
require: 
require_php: 
url: https://facturascripts.com/plugins/fsRepublicaDominicana
---
***Plugin de localización fiscal de República Dominicana para FacturaScripts: comprobantes fiscales (NCF), comprobantes electrónicos (e-CF), notas de crédito y débito, impuestos adicionales, retenciones y los reportes 606, 607 y 608 de la DGII.                                                                                                                                                                               
                                                                                                                                                                                                                    
  REQUISITOS
                                                                                                                                                                                                
  - FacturaScripts 2026 o superior y PHP 8.2 o superior.                                                                                                                                                            
  - Instale FacturaScripts con idioma Español (República Dominicana), zona horaria América/Santo_Domingo y país República Dominicana. Con otra configuración no se garantiza el funcionamiento.                     
  - Al actualizar el plugin, pulse &quot;Reconstruir&quot; en Administrador &gt; Plugins.                                                                                                                                        
                                                                                                                                                                                                                    
  QUÉ HACE                                                                                                                                                                                                          

  - NCF: maestro de rangos autorizados por la DGII, asignación automática del NCF al guardar la factura, control de correlativos y vencimiento.                                                                     
  - Comprobantes: físicos del 01 al 17 y electrónicos del 31 al 47. Tipo de comprobante y forma de pago por cliente.                                                                                                
  - Notas de crédito y débito: desde Devoluciones (04 y 34) o con factura a modificar y código de modificación de la DGII. El plugin valida que la nota de crédito reste, que la de débito sume, que no supere el  total de la factura y que sea del mismo cliente o proveedor, empresa y divisa.                                                                                                                                    
  - Comprobantes electrónicos (e-CF): carga del XML del facturador, fecha de firma, código de seguridad y código QR de consulta de la DGII en el PDF. El plugin no firma ni transmite el e-CF.
  - Impuestos adicionales: ISC específico y ad valorem (por porcentaje, monto por unidad o litro de alcohol), CDT, propina legal y primera placa, por línea. 
  - En compras puede digitar el monto del ISC que facturó el proveedor.                                                                                                                                                                                                     
  - Retenciones: ISR e ITBIS con los códigos de la DGII, descontadas en el PDF y reflejadas en los reportes.                                                                                                        
  - Reportes fiscales: 606, 607, 608 y consolidado, con exportación a TXT para la DGII.                                                                                                                             
  - Verificación de proveedores: antes de guardar una factura de compra, compruebe si el NCF ya fue registrado, y consulte el RNC del proveedor o cliente.                                                          
                                                                                                                                                                                                                    
  IMPRESIÓN

  El PDF incluye el tipo de comprobante, el NCF, la fecha de vencimiento cuando aplica, el NCF que modifica y su código en las notas, y el código QR en los e-CF.                                                   
                                                                                                                                                                                                                    
  DÓNDE ESTÁ EN EL MENÚ                                                                                                                                                                                             
  - Contabilidad &gt; República Dominicana: Impuestos, Maestro de NCF, Tipos de anulación, Tipos de movimiento, Tipos de NCF y Tipos de pago.                                                                          
  - Informes &gt; República Dominicana: Informes fiscales (606, 607, 608 y consolidado).                                                                                                                               
  - Ventas &gt; Clientes y Compras &gt; Proveedores: campos de tipo de comprobante, tipo de pago y tipo de anulación al final de la ficha.                                                                                
                                                                                                                                                                                                                    
  LIMITACIONES
  - No es plenamente compatible con otros plugins que modifiquen las facturas de venta o compra. Si hay un conflicto, contacte primero al soporte del otro plugin y luego valide con este.                          
  - Las fórmulas del ISC específico y el campo de ITBIS llevado al costo del 606 conviene validarlos con su contador.                                                                                               
                                                                                                                                                                                                                    
  Documentación: [https://joenilson.github.io/fsRepublicaDominicana/]