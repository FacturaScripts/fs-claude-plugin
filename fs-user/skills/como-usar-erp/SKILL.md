---
name: como-usar-erp
description: "Orienta a quien aprende o administra FacturaScripts: explica conceptos, indica qué menú o documento consultar y propone rutas de aprendizaje, desde el primer día hasta la instalación, la fiscalidad o la resolución de errores."
---

# Cómo usar FacturaScripts

Ayuda al usuario a entender el ERP y a encontrar la información que necesita. No requiere conexión a una instancia: las respuestas salen de la documentación incluida en el plugin.

- Para localizar y citar la documentación, aplica siempre el protocolo de [`docs-expert`](../docs-expert/SKILL.md).
- Si el usuario quiere realizar una operación concreta paso a paso, aplica el perfil de [`erp-guide`](../erp-guide/SKILL.md).
- Si quiere cifras de su propia empresa, usa las skills de análisis ([`analizar-ventas`](../analizar-ventas/SKILL.md), [`clientes-morosos`](../clientes-morosos/SKILL.md), [`stock-bajo`](../stock-bajo/SKILL.md) o [`crear-informe`](../crear-informe/SKILL.md)), que necesitan el plugin `fs-mcp` configurado.
- Si la pregunta es de programación, remite a `fs-dev:docs-expert`, disponible si está instalado el plugin `fs-dev`.

## Cómo responder

1. Identifica el área de la pregunta con el índice de abajo y lee los artículos indicados. Los nombres son los archivos de `../../references/docs/` sin la extensión `.md`.
2. Explica primero el concepto en dos o tres frases y después dónde se gestiona en el ERP, con la ruta de menú tal como aparece en la documentación.
3. Si el usuario es principiante, propón el siguiente paso lógico de la ruta de aprendizaje.
4. Distingue siempre lo que hace el core de lo que aporta un plugin.
5. Cita los artículos con su título y su URL.

## Índice de la documentación por áreas

| Área | Artículos |
|---|---|
| Primeros pasos y menús | `primeros-pasos-303`, `menu-ventas`, `menu-compras`, `almacenes-128`, `menu-contabilidad`, `menu-informes`, `como-funcionan-los-listados-y-filtros`, `boton-opciones`, `productos-proveedores-o-clientes-ocultos` |
| Clientes y precios | `tu-primer-cliente-459`, `los-grupos-de-clientes`, `las-tarifas-de-precios-por-clientes-o-grupos`, `los-agentes-que-son-y-para-que-sirven`, `como-asignar-una-subcuenta-a-un-cliente` |
| Documentos de venta | `diferencias-entre-albaranes-facturas-pedidos-y-presupuetos`, `tu-primer-presupuesto-de-venta-351`, `como-aprobar-parcialmente-un-presupuesto`, `como-hacer-un-pedido-de-venta`, `como-hacer-un-albaran-de-venta`, `como-hacer-una-factura-de-venta`, `como-agrupar-albaranes-en-una-sola-factura`, `el-asistente-para-agrupar-o-partir-documentos`, `como-copiar-un-documento-de-venta`, `estados-del-documento-680` |
| Facturas especiales | `como-hacer-una-factura-proforma`, `como-hacer-una-factura-rectificativa-o-devolucion`, `como-hacer-una-factura-con-irpf`, `como-hacer-una-factura-con-recargo-de-equivalencia`, `como-hacer-una-factura-intracomunitaria`, `como-hacer-una-venta-de-segunda-mano` |
| Cobros y pagos | `los-recibos-de-facturas`, `los-recibos-y-pagos-a-proveedores`, `formas-de-pago-729`, `cuentas-bancarias-28` |
| Compras | `como-crear-un-proveedor-o-acreedor`, `como-cambiar-la-subcuenta-de-un-proveedor`, `registrar-un-presupuesto-de-compra`, `como-registrar-un-pedido-de-compra`, `registrar-un-albaran-de-compra`, `como-registrar-una-factura-de-compra`, `como-registrar-una-compra-intracomunitaria`, `como-registrar-una-compra-de-importacion`, `como-registrar-una-compra-con-inversion-de-sujeto-pasivo`, `politicas-de-precios-de-coste` |
| Productos y almacén | `tu-primer-producto-431`, `las-variantes-de-productos`, `tu-primer-atributo-515`, `tu-primera-familia-43`, `tu-primer-fabricante-538`, `los-precios-del-producto`, `las-imagenes-de-los-productos`, `el-stock-de-productos`, `como-crear-un-almacen`, `tu-primer-transportista-807` |
| Contabilidad | `plan-contable-442`, `cuentas-especiales`, `los-ejercicios-contables`, `tu-primer-asiento-463`, `los-asientos-contables-de-las-facturas`, `los-conceptos-predefinidos`, `los-diarios-contables`, `como-hacer-un-libro-diario-contable`, `no-se-actualizan-los-saldos-de-las-cuentas` |
| Impuestos y fiscalidad | `impuestos-967`, `regimen-iva-369`, `series-470`, `secuencias-de-documentos-184`, `verifactu-facturacion-electronica-con-la-aeat`, `esta-homologado-facturascripts-con-hacienda`, `menu-informes` (informe de impuestos y modelos fiscales) |
| Empresa y configuración | `el-panel-de-control`, `configuracion-15`, `empresas-524`, `logotipo-y-lopd-299`, `divisas-773`, `paises-y-provincias-461`, `los-formatos-de-impresion-de-facturascripts` |
| Emails y archivos | `envio-de-emails`, `como-enviar-facturas-por-email`, `cambiar-los-textos-de-las-plantillas-de-emails`, `shortcodes-para-bloques-de-email`, `la-biblioteca-de-archivos` |
| Usuarios y seguridad | `usuarios-y-permisos`, `grupos-y-permisos-de-usuario`, `los-niveles-de-usuario`, `autenticacion-en-2-pasos`, `bloqueo-de-ip-410`, `he-olvidado-mi-contrasena`, `la-sesion-se-cierra-cada-poco-tiempo`, `los-logs-y-el-registro-de-actividad`, `telemetria-de-facturascripts` |
| Instalación y mantenimiento | `requisitos-917`, `instalacion-de-facturascripts-2020-635`, `instalacion-desde-el-zip-331`, `instalacion-desatendida-204`, `instalar-facturascripts-en-un-nas`, `el-archivo-config-php`, `el-cron-104`, `como-actualizar-facturascripts-y-sus-plugins`, `instalar-actualizaciones-beta`, `como-actualizar-la-version-de-php`, `como-restaurar-facturascripts-en-caso-de-desastre` |
| Plugins | `como-instalar-un-plugin-en-facturascripts`, `como-actualizar-plugins-de-pago`, `se-desactivan-los-plugins` y el catálogo `../../references/projects/` |
| Errores frecuentes | `problemas-frecuentes-469`, `problemas-frecuentes-instalacion-641`, `error-al-conectar-a-la-base-de-datos`, `error-tabla-ciudades-no-encontrada`, `error-unable-to-write-in-the-cache-directory`, `fatal-error-allowed-memory-size-of-xxx-bytes-exhausted`, `php-fatal-error-cannot-declare-class-cpdf-because-the-name-is-already-in-use-in-opt-lampp`, `problemas-con-la-configuracion-de-max-input-vars`, `aumentar-el-limite-de-subida-de-archivos`, `ssl-certificate-problem`, `fecha-no-valida-la-fecha-es-posterior-a-la-fecha-de-la-factura-siguiente`, `fecha-no-valida-ya-hay-facturas-con-fecha-posterior` |
| Licencia y ayudas | `licencia-de-facturascripts-492`, `kit-digital` |

Si un artículo enlaza a una publicación que no está en la carpeta local, cita su URL en lugar de afirmar que no existe documentación.

## Rutas de aprendizaje

**Primer día:**

1. Asistente inicial y menús principales (`primeros-pasos-303`).
2. Crear el primer cliente (`tu-primer-cliente-459`) y el primer producto (`tu-primer-producto-431`).
3. Entender la diferencia entre presupuesto, pedido, albarán y factura (`diferencias-entre-albaranes-facturas-pedidos-y-presupuetos`).
4. Hacer la primera factura de venta (`como-hacer-una-factura-de-venta`) y registrar su cobro (`los-recibos-de-facturas`).

**Puesta en marcha de una empresa:**

1. Datos de la empresa, logotipo y valores por defecto (`empresas-524`, `logotipo-y-lopd-299`, `el-panel-de-control`).
2. Impuestos, régimen de IVA, series y secuencias (`impuestos-967`, `regimen-iva-369`, `series-470`, `secuencias-de-documentos-184`).
3. Formas de pago y cuentas bancarias (`formas-de-pago-729`, `cuentas-bancarias-28`).
4. Plan contable y ejercicios (`plan-contable-442`, `los-ejercicios-contables`).
5. Usuarios, permisos y seguridad (`usuarios-y-permisos`, `grupos-y-permisos-de-usuario`, `autenticacion-en-2-pasos`).
6. Cumplimiento fiscal en España (`verifactu-facturacion-electronica-con-la-aeat`, `esta-homologado-facturascripts-con-hacienda`).

**Administración técnica:** requisitos, instalación, `config.php`, cron, actualizaciones, copias de seguridad y errores frecuentes (ver el índice).

## Conceptos que se confunden a menudo

- **Serie y secuencia:** la serie separa la facturación (por ejemplo general, simplificada o rectificativa); la secuencia define cómo se numeran los documentos de esa serie (`series-470`, `secuencias-de-documentos-184`).
- **Albarán y factura:** el albarán acredita la entrega; la factura es el documento fiscal de la operación (`diferencias-entre-albaranes-facturas-pedidos-y-presupuetos`).
- **Factura pagada y recibos:** la factura queda pagada cuando se cobran todos sus recibos (`los-recibos-de-facturas`).
- **Stock disponible:** cantidad física menos lo reservado en pedidos de cliente (`el-stock-de-productos`).
- **Core y plugin:** la conciliación bancaria, los proyectos, los modelos fiscales, los balances, las transferencias entre almacenes y las comisiones requieren plugins.

## Límites

- No sustituye al soporte oficial ni al asesoramiento fiscal o contable profesional.
- Si la documentación no cubre la duda, dilo y remite a <https://facturascripts.com/publicaciones> o al soporte.
