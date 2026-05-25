---
id: 2074
permalink: instalar-facturascripts-en-un-nas
title: Cómo instalar FacturaScripts en un NAS
creationdate: 13-03-2025 16:39:52
lastmod: 04-04-2025
url: https://facturascripts.com/publicaciones/instalar-facturascripts-en-un-nas
---
Para instalar FacturaScripts en un NAS, es imprescindible que el dispositivo soporte Docker o que incluya Apache y MySQL. A continuación, se muestra una guía detallada para la instalación en las marcas de NAS más populares.

## Instalación en NAS Synology

Sigue estos pasos para instalar FacturaScripts en un NAS Synology utilizando Docker y Portainer:

1. **Instalación de Docker y Portainer**: Asegúrate de que Docker esté instalado en tu NAS Synology. Posteriormente, instala Portainer, una herramienta que facilita la gestión de contenedores Docker.

2. **Creación de carpetas necesarias**: Accede a File Station en tu NAS y, dentro de la carpeta `docker`, crea dos nuevas carpetas: `facturascripts` y `facturascriptsdb`. Es importante que los nombres se ingresen en minúsculas para evitar posibles inconvenientes.

3. **Configuración del stack en Portainer**:
   - Ingresa a Portainer con tus credenciales.
   - En el menú lateral izquierdo, selecciona &quot;Stacks&quot; y haz clic en &quot;+ Add stack&quot;.
   - Asigna el nombre `facturascripts` al stack.
   - En el editor web, copia y pega el siguiente código YAML:

   ```yaml
   version: &#39;3&#39;
   services:
     mysql:
       image: mysql
       container_name: fs_db
       command: --default-authentication-plugin=mysql_native_password
       restart: always
       environment:
         MYSQL_ROOT_PASSWORD: tu_contraseña_segura
       volumes:
         - /volume1/docker/facturascriptsdb:/var/lib/mysql

     facturascripts:
       image: facturascripts/facturascripts
       container_name: fs
       restart: always
       ports:
         - 5379:80
       volumes:
         - /volume1/docker/facturascripts:/var/www/html

     adminer:
       image: adminer
       container_name: fs_adminer
       restart: always
       ports:
         - 5380:8080
   ```

   Reemplaza `tu_contraseña_segura` por una contraseña robusta para la base de datos MySQL.

4. **Despliegue del stack**: Una vez ingresado el código, haz clic en &quot;Deploy the stack&quot; para iniciar la configuración y el despliegue de los contenedores.

5. **Acceso a FacturaScripts**: Cuando los contenedores estén en funcionamiento, accede a FacturaScripts a través de tu navegador web utilizando la dirección: `http://tu_nas_synology:5379`.

6. **Configuración en el instalador de FacturaScripts**: Durante la instalación, introduce `fs_db` como nombre del host para la base de datos.

Siguiendo estos pasos, podrás tener FacturaScripts funcionando en tu NAS Synology utilizando Docker y Portainer. Esta guía se basa en la documentación de FacturaScripts para ofrecerte una experiencia de instalación clara y eficiente.