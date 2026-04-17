---
id: 774
permalink: el-cron-104
title: Cómo ejecutar el cron de FacturaScripts
creationdate: 07-08-2018 00:00:00
lastmod: 17-05-2025
url: https://facturascripts.com/el-cron-104
---
FacturaScripts necesita de un proceso cron para ciertas tareas de algunos plugins. **No es imprescindible**, pero si recomendable. Este proceso se debe ejecutar cada hora, a ser posible.

Configurar el cron se hace de forma distinta si tiene instalado FacturaScripts en Windows, Linux, Mac o bien en un Hosting externo. En esta guía le explicamos como hacerlo en cada caso.

## 💻 Ejecutar el cron desde el navegador
Puede ejecutar el cron manualmente desde el navegador, simplemente añada **/cron** al final de la url donde acceda a FacturaScripts, por ejemplo: http://localhost/facturascripts/cron

### ⌨️ Ejecutar el cron desde el terminal
Añadiendo el parámetro **-cron** al llamar al **index.php** se ejecutará el cron.

```
cd donde-tengas-facturascripts
php index.php -cron
```

## 🧰 Configurar el cron en un hosting
La mayoría de hostings tienen una sección de **tareas programas** o cron en su **panel de control**. Desde ahí podrá crear una tarea programada para ejecutar el cron cada hora.
- Si el formulario solamente deja escribir una url, escriba la url donde tenga FacturaScripts con /cron al final. Ejemplo: http://mi-dominio.com/facturas/cron
- Si el formulario deja escribir comandos como este ``php index.php``, entonces escriba este comando ``php carpeta-donde-tengas-facturascripts/index.php -cron``

### 🐧 Configurar el cron en Linux
La opción más sencilla es crear un script en la carpeta **/etc/cron.hourly**, para que se ejecute cada hora:

```
cd /etc/cron.hourly
sudo touch facturascripts
sudo chmod +x facturascripts
sudo nano facturascripts
```

Esto crea el archivo y abre el editor de textos nano para poder editarlo. Escriba esto en el archivo:

```
#!/bin/sh
cd donde-tengas-facturascripts
php index.php -cron
```

Para guardar pulse **ctrl+o** y **ctrl+x**.
