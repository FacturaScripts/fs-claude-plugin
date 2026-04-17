---
id: 990
permalink: los-agentes-que-son-y-para-que-sirven
title: Agentes en FacturaScripts: ¿Qué son y para qué sirven?
creationdate: 16-09-2021 08:49:52
lastmod: 09-04-2026
url: https://facturascripts.com/los-agentes-que-son-y-para-que-sirven
---
En FacturaScripts, los agentes permiten gestionar situaciones en las que se deseen otorgar comisiones de venta, ya sea a empleados, comerciales externos o empresas colaboradoras. Puede crear y administrar agentes desde el **menú Administrador → Agentes**.

## ¿Cómo crear un agente?

Para añadir un agente, pulse el botón **Nuevo** en la lista de agentes. Solo se requiere completar el campo **Nombre**; los demás campos son opcionales. Una vez finalizado el formulario, presione el botón **Guardar** ubicado en la parte inferior derecha.

![Nuevo agente](https://i.imgur.com/qUl115P.png)

&gt; **Nota:** Hasta que guarde el agente no podrá acceder a otras secciones ni añadir más información.

### 📝 Campos del agente
- **Código** (opcional): Identificador único del agente (por ejemplo, 1). No puede repetirse entre agentes.
- **Nombre**: Nombre por el cual reconocerá al agente. *Obligatorio.*
- **Id. Fiscal** (opcional): Tipo de identificador fiscal, como NIF.
- **Número fiscal** (opcional): Identificador fiscal (DNI o CIF). Ejemplo: 12345678X.
- **Producto de liquidación** (opcional): Se utiliza en la liquidación para asociar el producto específico en la factura, facilitando el control de cuentas de compras y estadísticas.
- **Observaciones** (opcional): Espacio para notas o información adicional sobre el agente.

Al crear un agente, se genera automáticamente un contacto con el mismo nombre, que permite añadir información como su dirección, correo electrónico o teléfono.

## 👨 ¿Cómo asociar un agente a un cliente?
Puede vincular un agente a un cliente desde la ficha en **Ventas → Clientes**. Seleccione el cliente, luego elija el agente en el campo correspondiente y haga clic en **Guardar**.

![Agente de cliente](https://i.imgur.com/Qgpv45B.png)

De este modo, todas las ventas facturadas a ese cliente estarán relacionadas con el agente asignado, a menos que lo cambie manualmente al crear o modificar la factura.

## 👨‍💼 ¿Cómo asociar un agente a un usuario?
También tiene la opción de vincular un agente a un usuario. Para ello, edite el usuario desde **Administrador → Usuarios**, seleccione el agente que desea asociar y pulse **Guardar**.

![Agente usuario](https://i.imgur.com/33bz1Lk.png)

### 🔍 Preferencia en la asignación de agentes
El agente vinculado al usuario tiene prioridad sobre el agente asignado al cliente. Por ejemplo:

- Si el usuario que crea la factura tiene un agente vinculado, este será el que se asigne a la venta, independientemente del agente definido en el cliente.
- Si el usuario no tiene un agente asignado, se utilizará el agente ligado al cliente si existe.

## 💰 Gestión de comisiones
Con el [plugin Comisiones](https://facturascripts.com/plugins/comisiones) (gratuito) puede:

- [Asignar comisiones de venta](https://facturascripts.com/publicaciones/comisiones-de-agentes-comisiones-por-venta)
- Definir penalizaciones
- Gestionar las [liquidaciones de comisiones](https://facturascripts.com/publicaciones/liquidacion-de-comisiones-de-venta)

Para más información sobre la configuración general, consulte la [documentación relacionada](https://facturascripts.com/publication/configuracion-15).
