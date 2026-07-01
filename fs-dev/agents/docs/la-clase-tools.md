---
id: 2233
permalink: la-clase-tools
title: La clase Tools
creationdate: 05-09-2025 12:03:54
lastmod: 29-10-2025
url: https://facturascripts.com/publicaciones/la-clase-tools
---
La clase `Tools` de FacturaScripts es una herramienta útil que ofrece funciones estáticas comunes para facilitar el desarrollo. No olvide añadir el correspondiente use de la clase.

```php
use FacturaScripts\Core\Tools;
```

## 📝 Formateo de texto
- `ascii()` - Convierte caracteres especiales a ASCII.
- `kebab()` - Transforma texto a formato kebab-case.
- `slug()` - Genera slugs para URLs. Admite el separador como segundo parámetro y la longitud máxima como tercero.
- `textBreak()` - Trunca texto con elipsis, con la longitud máxima como segundo parámetro.
- `noHtml()` y `fixHtml()` - Escapan y des-escapan los caracteres HTML peligrosos (`&lt;`, `&gt;`, comillas).

```php
echo Tools::ascii(&#39;Cañón&#39;); // Canon
echo Tools::kebab(&#39;MiNuevoPlugin&#39;); // mi-nuevo-plugin
echo Tools::slug(&#39;Mi Nuevo Plugin&#39;); // mi-nuevo-plugin
echo Tools::textBreak(&#39;Un texto muy largo para mostrar en una lista&#39;, 20); // Un texto muy lar...
echo Tools::noHtml(&#39;&lt;b&gt;hola&lt;/b&gt;&#39;); // &amp;lt;b&amp;gt;hola&amp;lt;/b&amp;gt;
```

## 📅 Fechas y tiempo
- `date()`, `dateTime()`, `hour()` - Devuelven la fecha (d-m-Y), fecha y hora (d-m-Y H:i:s) u hora (H:i:s), de la fecha indicada o del momento actual si no se indica nada.
- `dateOperation()`, `dateTimeOperation()` - Realizan operaciones con fechas (&#39;+1 day&#39;, &#39;-2 months&#39;...).
- `timeToDate()`, `timeToDateTime()` - Conversión de timestamps a fechas.

```php
echo Tools::date(); // 12-06-2026
echo Tools::date(&#39;2026-01-30&#39;); // 30-01-2026
echo Tools::dateTime(); // 12-06-2026 18:30:57
echo Tools::hour(); // 18:30:57

echo Tools::dateOperation(&#39;12-06-2026&#39;, &#39;+1 month&#39;); // 12-07-2026
echo Tools::timeToDate(1750000000); // 15-06-2025
```

## 💰 Números y monedas
- `number()` - Formatea números con los decimales y separadores configurados.
- `money()` - Formatea cantidades monetarias con el símbolo de la divisa.
- `round()` - Redondea con los decimales configurados.
- `decimals()` - Devuelve el número de decimales configurado.
- `bytes()` - Convierte bytes a unidades legibles (KB, MB, GB).
- `floatCmp()` - Compara números flotantes de forma segura.

```php
echo Tools::number(1234.567); // 1 234.57
echo Tools::money(1234.567); // 1 234.57 €
echo Tools::money(1234.567, &#39;USD&#39;); // 1 234.57 $
echo Tools::round(1234.567); // 1234.57
echo Tools::bytes(1048576); // 1.00 MB

if (Tools::floatCmp($total, 100.0)) {
    // $total es 100, comparado de forma segura
}
```

## 📂 Sistema de archivos
- `folder()` - Construye rutas a partir de la carpeta de la instalación.
- `folderCheckOrCreate()`, `folderCopy()`, `folderDelete()` - Operaciones con directorios.
- `folderScan()`, `folderSize()` - Listan el contenido y calculan el tamaño de directorios.

```php
$path = Tools::folder(&#39;MyFiles&#39;, &#39;Public&#39;); // /ruta/a/facturascripts/MyFiles/Public

Tools::folderCheckOrCreate($path); // crea la carpeta si no existe

foreach (Tools::folderScan($path) as $fileName) {
    // recorremos los archivos de la carpeta
}
```

## ⚙️ Configuración
- `config()` - Obtiene constantes del config.php. Para la clave `db_name` busca las constantes `db_name`, `DB_NAME` y `FS_DB_NAME`.
- `settings()` - Lee una opción de la configuración (panel de control), indicando grupo, clave y valor por defecto.
- `settingsSet()`, `settingsSave()` - Modifican y guardan opciones de la configuración.
- `settingsClear()` - Descarta los cambios no guardados y limpia la caché de opciones.
- `siteUrl()` - Devuelve la URL base de la instalación.

```php
$dbName = Tools::config(&#39;db_name&#39;);

$codalmacen = Tools::settings(&#39;default&#39;, &#39;codalmacen&#39;);

// modificamos y guardamos una opción
Tools::settingsSet(&#39;default&#39;, &#39;codalmacen&#39;, &#39;2&#39;);
Tools::settingsSave();

echo Tools::siteUrl(); // https://miempresa.com/facturascripts
```

## 🛠️ Utilidades
- `trans()` - Traduce textos, con soporte de parámetros.
- `lang()` - Devuelve una instancia del traductor, útil para traducir a un idioma concreto.
- `log()` - Devuelve una instancia del log, opcionalmente sobre un canal concreto.
- `password()` - Genera una contraseña aleatoria (mínimo 8 caracteres, garantiza letras y números).
- `randomString()` - Genera una cadena alfanumérica aleatoria.

```php
echo Tools::trans(&#39;products&#39;); // Productos
echo Tools::trans(&#39;items-added-correctly&#39;, [&#39;%num%&#39; =&gt; 50]); // 50 elementos añadidos correctamente

echo Tools::lang(&#39;en_EN&#39;)-&gt;trans(&#39;products&#39;); // Products

Tools::log()-&gt;info(&#39;mensaje informativo&#39;);
Tools::log(&#39;mi-canal&#39;)-&gt;error(&#39;mensaje de error en el canal mi-canal&#39;);

echo Tools::password(12); // contraseña aleatoria de 12 caracteres
echo Tools::randomString(20); // cadena aleatoria de 20 caracteres
```