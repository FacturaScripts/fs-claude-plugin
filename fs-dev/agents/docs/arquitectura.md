---
id: 2551
permalink: arquitectura
title: Arquitectura
creationdate: 20-02-2026 23:21:39
lastmod: 20-02-2026
url: https://facturascripts.com/publicaciones/arquitectura
---
El plugin sigue el patrón MVC estándar de FacturaScripts:


* &gt; LibroIVA/
* &gt; ├── Controller/
* &gt; │   ├── ResumenTrimestral.php     ← Panel web: cálculos y datos
* &gt; │   └── ExportResumenPDF.php      ← Generación del PDF
* &gt; ├── View/
* &gt; │   └── ResumenTrimestral.html.twig  ← Plantilla HTML (Twig)
* &gt; ├── Init.php                      ← Instalación / desinstalación
* &gt; └── facturascripts.ini            ← Metadatos del plugin