---
id: 2233
permalink: la-clase-tools
title: La clase Tools
creationdate: 05-09-2025 12:03:54
lastmod: 29-10-2025
url: https://facturascripts.com/la-clase-tools
---
La clase `Tools` (use FacturaScripts\Core\Tools) de FacturaScripts es una herramienta útil que ofrece funciones estáticas comunes para facilitar el desarrollo. A continuación, te presento un resumen de sus principales funcionalidades:

## ⚙️ Métodos principales:

### 📝 Formateo de texto:
- `ascii()` - Convierte caracteres especiales a ASCII.
- `kebab()` - Transforma texto a formato kebab-case.
- `slug()` - Genera slugs para URLs.
- `textBreak()` - Trunca texto con elipsis.
- `noHtml()` y `fixHtml()` - Manejo de caracteres HTML.

### 📅 Fechas y tiempo:
- `date()`, `dateTime()`, `hour()` - Formateo de fechas y horas.
- `dateOperation()`, `dateTimeOperation()` - Realiza operaciones con fechas.
- `timeToDate()`, `timeToDateTime()` - Conversión de timestamps a fechas.

### 💰 Números y monedas:
- `number()` - Formatea números con separadores.
- `money()` - Formatea cantidades monetarias.
- `bytes()` - Convierte bytes a unidades legibles.
- `floatCmp()` - Compara números flotantes.

### 📂 Sistema de archivos:
- `folder()` - Construye rutas.
- `folderCheckOrCreate()`, `folderCopy()`, `folderDelete()` - Realiza operaciones con directorios.
- `folderScan()`, `folderSize()` - Analiza y calcula el tamaño de directorios.

### ⚙️ Configuración:
- `config()` - Obtiene constantes de configuración.
- `settings()`, `settingsSet()`, `settingsSave()` - Gestiona configuraciones.
- `siteUrl()` - Devuelve la URL base del sitio.

### 🛠️ Utilidades:
- `password()`, `randomString()` - Genera cadenas aleatorias.
- `trans()` - Traduce textos.
- `lang()`, `log()` - Instancias de Translator y MiniLog.
