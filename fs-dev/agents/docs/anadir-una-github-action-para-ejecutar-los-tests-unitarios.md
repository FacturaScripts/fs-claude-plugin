---
id: 2124
permalink: anadir-una-github-action-para-ejecutar-los-tests-unitarios
title: Añadir una github action para ejecutar los tests unitarios
creationdate: 24-05-2025 18:30:49
lastmod: 17-03-2026
url: https://facturascripts.com/anadir-una-github-action-para-ejecutar-los-tests-unitarios
---
Para añadir un GitHub Action que ejecute los tests unitarios en el repositorio de un plugin de FacturaScripts, sigue estos pasos:

## ✅ 1. Asegúrate de tener tests en el plugin
Comprueba que tengas archivos de tests en la **carpeta Test** de tu plugin. Si no tienes aún los tests preparados, puedes crear uno rápidamente con fsmaker:

```
fsmaker test
```

## 📝 2. Crea el workflow de GitHub Action
Con fsmaker también puedes crear el archivo del github action:

```
fsmaker github-action
```

### Creación manual
Si prefieres crear el archivo manualmente, dentro del repositorio, crea este archivo:

```
.github/workflows/tests.yml
```

Con el siguiente contenido básico adaptado para tu plugin. **Reemplaza el nombre del plugin** `Informes` por el de tu plugin.

```
name: Tests del Plugin FacturaScripts

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  tests:
    name: Tests en ${{ matrix.database }} con PHP ${{ matrix.php-version }}
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        php-version: [&#39;8.1&#39;, &#39;8.2&#39;, &#39;8.3&#39;, &#39;8.4&#39;]
        database: [&#39;mysql&#39;, &#39;postgresql&#39;]

    env:
      NOMBRE_PLUGIN: &quot;Informes&quot;

    services:
      mysql:
        image: mariadb:11
        ports:
          - 3306:3306
        env:
          MARIADB_ROOT_PASSWORD: toor
          MARIADB_DATABASE: facturascripts_tests
        options: &gt;-
          --health-cmd=&quot;mariadb-admin ping&quot;
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

      postgres:
        image: postgres:13
        ports:
          - 5432:5432
        env:
          POSTGRES_PASSWORD: toor
          POSTGRES_DB: facturascripts_tests
        options: &gt;-
          --health-cmd=pg_isready
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

    steps:
      - name: Instalar PHP y extensiones
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php-version }}
          extensions: json, fileinfo, simplexml, zip, dom, pdo, pdo_mysql, mysql, mysqli, pgsql, pdo_pgsql, bcmath, gd, curl, soap
          tools: composer
          coverage: none

      - name: Clonar FacturaScripts
        uses: actions/checkout@v5
        with:
          fetch-depth: 0
          repository: &#39;NeoRazorX/facturascripts&#39;

      - name: Clonar Plugin ${{ env.NOMBRE_PLUGIN }}
        uses: actions/checkout@v5
        with:
          fetch-depth: 0
          path: Plugins/${{ env.NOMBRE_PLUGIN }}

      - name: Cache de dependencias de Composer
        uses: actions/cache@v5
        with:
          path: ~/.composer/cache/files
          key: composer-${{ runner.os }}-${{ matrix.php-version }}-${{ hashFiles(&#39;**/composer.lock&#39;) }}
          restore-keys: |
            composer-${{ runner.os }}-${{ matrix.php-version }}-
            composer-${{ runner.os }}-

      - name: Instalar dependencias de FacturaScripts
        run: |
          mkdir -p MyFiles
          touch MyFiles/plugins.json
          composer install --prefer-dist --no-interaction --no-progress --optimize-autoloader

      - name: Crear archivo de configuración
        run: |
          cat &gt; config.php &lt;&lt; &#39;EOF&#39;
          &lt;?php
          
          define(&#39;FS_COOKIES_EXPIRE&#39;, 604800);
          define(&#39;FS_LANG&#39;, &#39;es_ES&#39;);
          define(&#39;FS_TIMEZONE&#39;, &#39;Europe/Madrid&#39;);
          define(&#39;FS_ROUTE&#39;, &#39;&#39;);
          
          ${{ matrix.database == &#39;mysql&#39; && format(&#39;
          define(&#39;&#39;FS_DB_TYPE&#39;&#39;, &#39;&#39;mysql&#39;&#39;);
          define(&#39;&#39;FS_DB_HOST&#39;&#39;, &#39;&#39;127.0.0.1&#39;&#39;);
          define(&#39;&#39;FS_DB_PORT&#39;&#39;, &#39;&#39;3306&#39;&#39;);
          define(&#39;&#39;FS_DB_USER&#39;&#39;, &#39;&#39;root&#39;&#39;);
          &#39;) || format(&#39;
          define(&#39;&#39;FS_DB_TYPE&#39;&#39;, &#39;&#39;postgresql&#39;&#39;);
          define(&#39;&#39;FS_DB_HOST&#39;&#39;, &#39;&#39;localhost&#39;&#39;);
          define(&#39;&#39;FS_DB_PORT&#39;&#39;, &#39;&#39;5432&#39;&#39;);
          define(&#39;&#39;FS_DB_USER&#39;&#39;, &#39;&#39;postgres&#39;&#39;);
          &#39;) }}
          define(&#39;FS_DB_NAME&#39;, &#39;facturascripts_tests&#39;);
          define(&#39;FS_DB_PASS&#39;, &#39;toor&#39;);
          define(&#39;FS_DB_FOREIGN_KEYS&#39;, true);
          define(&#39;FS_DB_TYPE_CHECK&#39;, true);
          define(&#39;FS_MYSQL_CHARSET&#39;, &#39;utf8&#39;);
          define(&#39;FS_MYSQL_COLLATE&#39;, &#39;utf8_bin&#39;);
          
          define(&#39;FS_HIDDEN_PLUGINS&#39;, &#39;&#39;);
          define(&#39;FS_DEBUG&#39;, false);
          define(&#39;FS_DISABLE_ADD_PLUGINS&#39;, false);
          define(&#39;FS_DISABLE_RM_PLUGINS&#39;, false);
          define(&#39;FS_NF0&#39;, 2);
          EOF

      - name: Copiar archivos de tests del Plugin
        run: |
          if [ -d &quot;Plugins/${{ env.NOMBRE_PLUGIN }}/Test/main&quot; ]; then
            cp -r Plugins/${{ env.NOMBRE_PLUGIN }}/Test/main Test/Plugins
          else
            echo &quot;No se encontraron tests para el plugin&quot;
            exit 1
          fi

      - name: Instalar dependencias del Plugin ${{ env.NOMBRE_PLUGIN }}
        run: |
          if [ -f &quot;Plugins/${{ env.NOMBRE_PLUGIN }}/composer.json&quot; ]; then
            cd Plugins/${{ env.NOMBRE_PLUGIN }}
            composer install --prefer-dist --no-interaction --no-progress --optimize-autoloader
          else
            echo &quot;El plugin no tiene dependencias de Composer&quot;
          fi

      - name: Instalar el Plugin ${{ env.NOMBRE_PLUGIN }}
        run: php Test/install-plugins.php

      - name: Ejecutar tests en ${{ matrix.database }}
        run: vendor/bin/phpunit -c phpunit-plugins.xml --verbose

      - name: Mostrar logs en caso de fallo
        if: failure()
        run: |
          echo &quot;=== Logs de la base de datos ===&quot;
          if [ &quot;${{ matrix.database }}&quot; = &quot;mysql&quot; ]; then
            docker logs $(docker ps -q --filter ancestor=mariadb:11) || true
          else
            docker logs $(docker ps -q --filter ancestor=postgres:13) || true
          fi
```

### Dependencias de otros plugins
Si tu plugin depende de otro plugin, puedes añadir ese paso. No olvides que debes ejecutar `php Test/install-plugins.php` tantas veces como plugins haya que instalar.

## ☑️ Revisa la pestaña actions
En la pestaña **actions** del repositorio en github podrás ver cómo se ejecutan los tests. Cada vez que añadas un commit o un pull-request al repositorio, se ejecutarán automáticamente los tests unitarios. Y si fallan, recibirás un email.

![ver resultados tests en github actions](https://facturascripts.com/MyFiles/2025/05/2858.png?myft=43460d4d689a18e4af184e1cd33c26c9398299e1)
