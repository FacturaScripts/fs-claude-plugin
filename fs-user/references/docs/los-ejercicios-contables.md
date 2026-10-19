---
id: 884
permalink: los-ejercicios-contables
title: Los ejercicios contables
creationdate: 02-01-2021 13:17:21
lastmod: 03-09-2026
url: https://facturascripts.com/publicaciones/los-ejercicios-contables
---
FacturaScripts **genera automáticamente** un ejercicio contable cada año, conforme lo va necesitando. Si por ejemplo creas un pedido con fecha del 2 de enero de 2026, FacturaScripts creará automáticamente el ejercicio 2026 (si no existe). **Lo que no genera automáticamente** es [el plan contable](https://facturascripts.com/publicaciones/plan-contable-442): ese paso debes darlo tú y es importante para el buen funcionamiento de la contabilidad. Sin plan contable no se pueden generar asientos contables.

Puedes tener todos los ejercicios abiertos que quieras. Al contrario que otros programas, FacturaScripts no limita el uso de ejercicios: puedes hacer facturas del nuevo año mientras terminas de crear las que te faltaban del año anterior.

## 📑 Los campos de un ejercicio

En el **menú Contabilidad → Ejercicios**, al abrir uno encontrarás:

- **Código** y **Nombre**: el identificador del ejercicio (por ejemplo `2026`) y su nombre.
- **Fecha de inicio** y **Fecha de fin**: el periodo que cubre. Es lo que usa el programa para asignar el ejercicio a cada factura o asiento según su fecha.
- **Estado**: si el ejercicio está abierto o cerrado.
- **Empresa**: a qué empresa pertenece, si tienes varias.
- **Longitud de subcuenta**: cuántos dígitos tienen las subcuentas de este ejercicio. Por defecto 10. Ver [el plan contable](https://facturascripts.com/publicaciones/plan-contable-442).
- **Diario de cierre** y **Diario de apertura**: en qué [diario](https://facturascripts.com/publicaciones/los-diarios-contables) se generan los asientos de cierre y de apertura al cerrar el ejercicio.

### ⚠️ Cuidado al cambiar la longitud de subcuenta

La longitud de subcuenta hay que decidirla **antes** de importar el plan contable. Si la cambias cuando ya tienes datos, las subcuentas configuradas en otras fichas —productos, familias, impuestos, retenciones, clientes, proveedores, grupos de clientes y cuentas bancarias— se quedan con una longitud que ya no encaja.

FacturaScripts te avisa de ello al entrar en la pestaña Subcuentas del ejercicio, indicándote cuántas hay mal y en qué fichas están, para que puedas corregirlas.

## 🗂️ Las pestañas del ejercicio

Al abrir un ejercicio tienes tres pestañas más:

- **Cuentas**: las cuentas del plan contable de ese ejercicio.
- **Subcuentas**: sus subcuentas, con el saldo de cada una. Puedes ordenarlas por código o por saldo.
- **Asientos especiales**: los asientos de apertura, cierre y regularización del ejercicio. No se crean a mano desde aquí: los genera el programa al cerrar el ejercicio.

Si al consultar los saldos ves un aviso de tareas en segundo plano, es normal: los saldos se recalculan mediante el [cron](https://facturascripts.com/publicaciones/el-cron-104) y pueden no ser definitivos hasta que termine. Si nunca se actualizan, mira [no se actualizan los saldos de las cuentas](https://facturascripts.com/publicaciones/no-se-actualizan-los-saldos-de-las-cuentas).

## 📅 Asignación automática de ejercicio
FacturaScripts asigna automáticamente el ejercicio a las facturas y asientos en función de su fecha. Puedes tener varios ejercicios abiertos a la vez y seguir trabajando con normalidad. Lo que **no puedes es tener dos ejercicios en las mismas fechas**.

## 🔒 Cerrar ejercicio
Cuando quieras cerrar un ejercicio, ve al menú Contabilidad → Ejercicios, haz clic en el ejercicio deseado y pulsa el botón `Cerrar ejercicio`. Si dejas marcada la casilla `Copiar plan contable`, se copiará el plan contable al ejercicio siguiente.

![Ventana para cerrar un ejercicio contable](https://i.imgur.com/rzHUIQM.png)

Al cerrar el ejercicio se genera el asiento de cierre y el de apertura del ejercicio siguiente. **Deja que el proceso termine.** Los asientos y facturas del ejercicio cerrado quedan bloqueados, pero no ocultos.

### 🔐 Reabrir ejercicio
Si quieres reabrir un ejercicio ya cerrado, ve al menú Contabilidad → Ejercicios, haz clic en el ejercicio y pulsa el botón `Abrir ejercicio`. Puedes marcar si quieres eliminar el asiento de cierre o el de apertura; se generarán de nuevo la próxima vez que cierres el ejercicio.

![Ventana para reabrir un ejercicio cerrado](https://i.imgur.com/gpz1oYI.png)

## 📑 Plan contable
[El plan contable](https://facturascripts.com/publicaciones/plan-contable-442) comprende el listado de cuentas, subcuentas y [cuentas especiales](https://facturascripts.com/publicaciones/cuentas-especiales) necesarias para el correcto funcionamiento de la contabilidad. Está vinculado al ejercicio, es decir, cada ejercicio puede tener una relación de cuentas y subcuentas distinta.

## 📚 Diarios y balances
Con el [plugin Informes](https://facturascripts.com/plugins/informes) activado, desde el menú Informes → Informes contables puedes generar:

- Diarios contables.
- [Balances de sumas y saldos](https://facturascripts.com/publicaciones/como-hacer-un-balance-de-sumas-y-saldos).
- [Balances de situación](https://facturascripts.com/publicaciones/como-hacer-un-balance-de-situacion).
- Balances de ingresos y gastos.
- [Balances de pérdidas y ganancias](https://facturascripts.com/publicaciones/como-hacer-un-balance-de-perdidas-y-ganancias).

## Ver también

- [El plan contable](https://facturascripts.com/publicaciones/plan-contable-442)
- [Cuentas especiales](https://facturascripts.com/publicaciones/cuentas-especiales)
- [Cómo hacer un asiento contable](https://facturascripts.com/publicaciones/tu-primer-asiento-463)
- [Menú Contabilidad](https://facturascripts.com/publicaciones/menu-contabilidad)