---
idproject: 585
name: FastPresupuesto
permalink: fastpresupuesto
creationdate: 28-04-2026
lastmod: 28-04-2026
version: 1
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/FastPresupuesto
---
# FastPresupuesto

Plugin para crear presupuestos rápidos sin seleccionar un cliente real en el formulario, manteniendo compatibilidad con la lógica interna de FacturaScripts.

## Para Usuarios

## Qué hace
- Añade un botón **Nuevo presupuesto rápido** en `ListPresupuestoCliente`.
- Abre un modal para introducir:
  - Nombre
  - Teléfono
  - Email
- Crea un `PresupuestoCliente` directamente y abre su edición.

## Flujo funcional
1. Entras en **Ventas &gt; Presupuestos**.
2. Pulsas **Nuevo presupuesto rápido**.
3. Rellenas nombre, teléfono y email.
4. Se crea el presupuesto y se abre en edición.

## Restricción importante
- El plugin usa un cliente técnico (`FASTPRES`) para cumplir requisitos internos del ERP.
- Si un documento con ese cliente se intenta cerrar en estado no editable (caso factura), se bloquea y se pide asignar cliente real.

## Qué verás en el presupuesto
Cuando el cliente del documento es `FASTPRES`, en cabecera aparecen inputs destacados (borde rojo) para:
- Nombre
- Teléfono
- Email

## Para Técnicos

## Objetivo técnico
Permitir creación rápida con datos de contacto, sin romper:
- `SalesDocument::getSubject()`
- `Calculator::apply()`
- flujo estándar de guardado/estados

## Estrategia
En vez de dejar `codcliente` vacío (incompatible con cálculos y validaciones), se usa un cliente técnico fijo:
- `Init::TECHNICAL_CUSTOMER_CODE = FASTPRES`

## Implementación por archivos

### `Init.php`
- Registra extensiones de:
  - `Extension\Controller\ListPresupuestoCliente`
  - `Extension\Model\PresupuestoCliente`
  - `Extension\Model\FacturaCliente`
- Registra `SalesHeaderHTMLMod`.
- En `update()` crea el cliente técnico si no existe.

### `Extension/Controller/ListPresupuestoCliente.php`
- Añade botón/modal de alta rápida.
- Acción `create-fast-presupuesto`:
  - Valida token.
  - Valida nombre obligatorio.
  - Valida formato email.
  - Crea presupuesto con cliente técnico.
  - Guarda contacto en campos custom y en campos espejo del documento.

### `Extension/Model/PresupuestoCliente.php`
- `testBefore()` para presupuesto rápido:
  - sanea datos.
  - valida nombre y email.
  - sincroniza campos espejo.

### `Mod/SalesHeaderHTMLMod.php`
- Solo actúa si `modelClassName() === PresupuestoCliente` y cliente `FASTPRES`.
- Renderiza inputs custom (nombre/teléfono/email) en cabecera.
- Aplica cambios y sincroniza espejo al guardar.

### `Extension/Model/FacturaCliente.php`
- Bloquea guardado en estado no editable si el cliente sigue siendo `FASTPRES`.

### `Table/presupuestoscli.xml`
Añade columnas propias del plugin:
- `contacto_telefono` (`varchar(20)`)
- `contacto_email` (`varchar(150)`)

## Mapeo de datos

### Campos de trabajo (plugin)
- `nombrecliente`
- `contacto_telefono`
- `contacto_email`

### Campos espejo (documento estándar)
Para que salga correctamente en el PDF estándar sin tocar Core:
- `direccion` &lt;= `contacto_email`
- `provincia` &lt;= `contacto_telefono`

`PDFDocument` imprime `nombrecliente` y bloque de dirección (`direccion`, `provincia`, etc.), por eso se usa este espejo.

## Traducciones
- Archivo: `Translation/es_ES.json`
- Constantes PHP: `Lib/TransKeys.php`
- En XML se usan directamente keys de traducción.

## Calidad de código
El plugin incluye configuración local:
- `phpstan` nivel 5 + strict rules
- `php-cs-fixer`
- scripts en `composer.json`

Comandos (desde `Plugins/FastPresupuesto`):
- `composer run phpstan`
- `composer run cs:check`
- `composer run cs:fix`

## Notas de mantenimiento
- Si cambia la plantilla PDF base del ERP, revisar el mapeo espejo.
- Si en el futuro se quiere mostrar teléfono/email de forma nativa en PDF, hacerlo vía extensión PDF en plugin, no tocando Core.