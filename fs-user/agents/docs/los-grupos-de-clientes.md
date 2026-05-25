---
id: 2622
permalink: los-grupos-de-clientes
title: Los grupos de clientes
creationdate: 10-03-2026 17:31:46
lastmod: 17-04-2026
url: https://facturascripts.com/publicaciones/los-grupos-de-clientes
---
Los **Grupos de Clientes** en FacturaScripts permiten organizar y clasificar a tus clientes para aplicar configuraciones comunes de forma masiva, facilitando la gestión de ventas y la segmentación de datos.

Su función principal es permitir la asignación de **tarifas de precios** y subcuentas contables a un conjunto de clientes a la vez.

---

## 1. Acceso a Grupos de Clientes

Para gestionar los grupos de clientes, dirígete al menú principal y selecciona:
**Ventas &gt; Clientes &gt; Grupos**

Desde esta pantalla, podrás ver el listado de grupos existentes, editarlos o crear uno nuevo pulsando el botón **Nuevo**.

![Pantalla de creación de grupos](https://i.imgur.com/Jgo79Vf.png)

---

## 2. Configuración de un Grupo

Al crear o editar un grupo, encontrarás los siguientes campos:

- **Nombre**: El nombre descriptivo que identifica al grupo (ej. *Clientes Mayoristas*, *VIP*, *Minoristas*).
- **Tarifa**: Permite seleccionar una [tarifa de precios](https://facturascripts.com/publicaciones/las-tarifas-de-precios-por-clientes-o-grupos) específica. Todos los clientes pertenecientes a este grupo heredarán automáticamente los precios y descuentos definidos en dicha tarifa.
- **Subcuenta**: (Opcional) Código de la subcuenta contable asociada al grupo, útil para la exportación o gestión contable segmentada.

![Pantalla grupo nuevo](https://i.imgur.com/dDX2bxT.png)

---

## 3. Cómo asignar un Grupo a un Cliente

Una vez creado el grupo, puedes asignarlo a tus clientes siguiendo estos pasos:

1. Ve al menú **Ventas &gt; Clientes**.
2. Haz clic en la pestaña Grupos.
3. ![Pestaña grupo](https://i.imgur.com/Sfaf4Pr.png)
4. En la pestaña Grupos, localiza el grupo ya creado al que queremos incluir un cliente.
5. ![Grupo creado](https://i.imgur.com/pkgILTh.png)
6. Pulsamos en **Añadir** y elegimos al cliente que queremos incluir.
7. ![Añadir clientes](https://i.imgur.com/ApBqD9l.png)
8. Pulsa el botón **Añadir**.
9. Para quitarlo pulsamos en **Clientes**.
10. Elegimos al cliente que queremos quitar y pulsamos **Quitar**.
11. ![Quitar clientes](https://i.imgur.com/6P8N9VT.png)

---

## 4. Notas Importantes sobre Tarifas y Prioridad

Es fundamental entender cómo FacturaScripts gestiona la prioridad de los precios:

&gt; **Prioridad de Tarifas:** Si un cliente tiene asignada una tarifa específica directamente en su ficha personal, **esta tendrá prioridad** sobre la tarifa definida en su Grupo de Clientes. El sistema solo aplicará la tarifa del grupo si el campo &quot;Tarifa&quot; en la ficha del cliente está vacío.

![Tarifa en cliente](https://i.imgur.com/pWArX0l.png)

---

## 5. Funcionalidades Avanzadas

Si necesitas un control más exhaustivo sobre los precios por grupo o reglas de negocio complejas, puedes ampliar la funcionalidad básica con plugins como:

*   **Tarifas Avanzadas:** Para gestionar reglas de precios más dinámicas.
*   **Agentes de Venta:** Para asignar comerciales específicos a grupos de clientes determinados.