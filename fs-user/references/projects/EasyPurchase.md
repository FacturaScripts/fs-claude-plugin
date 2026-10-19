---
idproject: 655
name: EasyPurchase
permalink: easypurchase
creationdate: 28-06-2026
lastmod: 20-09-2026
version: 1.1
betaversion: 0
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/EasyPurchase
---
# EasyPurchase — Compras y niveles de stock para FacturaScripts

**Un MRP ligero con dos herramientas complementarias:** genera los **pedidos a proveedor** que necesitas (qué comprar, a quién y cuánto) y calcula los **niveles de stock mínimo y máximo** de cada producto a partir de su historial. Todo revisable: EasyPurchase propone, tú decides. Nada se pide ni se modifica automáticamente.

## Qué resuelve

Muchas empresas gestionan las compras con intuición y una hoja de Excel: se agotan unos productos mientras sobran otros, se pide dos veces lo que ya venía en camino, y los stocks mínimos —si existen— se pusieron “a ojo” hace años y nadie los ha vuelto a tocar. 
EasyPurchase convierte todo eso en un cálculo trazable y repetible, sin cambiar tu forma de trabajar ni tocar el esquema del core.

## Para quién es

Comercios, distribuidoras, talleres con recambios y cualquier negocio con almacén que quiera **reaprovisionar con criterio** y mantener sus niveles de stock **basados en datos** y no en corazonadas.

---

## 1. Propuesta de compra (generación de pedidos)

Calcula la **necesidad neta** por variante y almacén y la presenta agrupada por proveedor para que la revises y generes los pedidos en borrador.

- **Dos fuentes de demanda** combinables: reponer hasta el **stock mínimo/máximo** y cubrir los **pedidos de venta pendientes**. Descuenta siempre lo ya pedido a proveedores (**anti-doble-pedido**) y excluye los productos sin control de stock.
- **Selección de proveedor** por variante con prioridad configurable: **preferente** → **menor precio** → **última compra**. Las variantes sin proveedor se listan aparte.
- **Reglas de compra:** stock de seguridad, mínimo y múltiplo por producto; aviso (sin bloquear) cuando no se alcanza el mínimo de pedido del proveedor.
- **Pantalla revisable:** cantidades editables, **almacén por línea** (con consolidación en un mismo pedido), avisos de mínimo y aviso si una referencia **ya está pedida en otro almacén**, para que la confirmes a propósito.
- **Alcance configurable:** cálculo **por almacén** o **global por referencia** (para compra centralizada).
- **Generación:** un **pedido a proveedor en borrador** por proveedor y almacén, con totales e impuestos calculados por el core. Cada propuesta queda registrada.

---

## 2. Propuesta de niveles de stock (cálculo de mínimo y máximo)

Sugiere el **stock mínimo y máximo** de cada producto por almacén a partir de su **consumo histórico de ventas**, para que dejes de ajustarlos a mano.

- **Fuente de consumo configurable:** facturas, albaranes o pedidos de venta.
- **Dos métodos de cálculo:**
  - **Cobertura por días** (simple): niveles = consumo diario × (lead time + días de seguridad), y el máximo añade el periodo de reposición.
  - **Stock de seguridad estadístico:** punto de pedido con `z · σ · √lead time` y **nivel de servicio** configurable (90/95/97,5/99 %). Ideal cuando la demanda es irregular.
- **Parámetros ajustables:** ventana de histórico, lead time (afinado por proveedor si hay regla), días de seguridad y periodo de reposición.
- **Pantalla revisable:** muestra **actual vs sugerido** para cada producto, editable, con filtros (“solo con consumo”, “solo los que cambian”). Aplicas **solo las filas que marcas**; el resto no se toca.
- Al confirmar, **escribe el mínimo/máximo en el stock** y **registra el cambio** para auditoría.

## 3. Historial de cambios de niveles

Cada ajuste de mínimo/máximo aplicado queda en un **registro de auditoría append-only** (no se edita ni se crea a mano): **referencia, almacén, valores antes y después, usuario y fecha**, con búsqueda y filtros por fecha y almacén. Así siempre sabes **qué cambió, quién lo hizo y cuándo**.

---

## Además

- **Reglas por proveedor y por producto** configurables desde las propias fichas (mínimos de pedido, lead time, stock de seguridad, proveedor preferente, múltiplo y mínimo de compra).
- **Generación programada (Cron):** deja una propuesta de compra pendiente de revisión y avisa de cuántos niveles de stock conviene revisar. **Nunca** compra ni modifica stock por su cuenta.
- **Ayuda integrada** en cada pantalla explicando cada opción y las fórmulas.
- **Idiomas:** español e inglés.

## Diseñado para ser fiable

- **Nada se pide ni se aplica sin revisión humana.** El plugin propone; tú decides.
- **No modifica el esquema del core:** usa sus propias tablas (`easypurchase_*`), así la desinstalación es limpia y resiste actualizaciones de FacturaScripts.
- **Motor de cálculo aislado y testeado** (necesidad neta y niveles de stock), para que la credibilidad de las cifras no dependa de la interfaz.

## Requisitos

- FacturaScripts **2025+** (verificado contra 2026.4).
- **PHP 8.0** o superior.