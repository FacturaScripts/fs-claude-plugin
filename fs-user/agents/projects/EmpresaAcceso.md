---
idproject: 692
name: EmpresaAcceso
permalink: empresaacceso
creationdate: 08-07-2026
lastmod: 20-08-2026
version: 1.2
betaversion: 
mincore: 2026
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/EmpresaAcceso
---
## EmpresaAcceso — Control de acceso a empresas por usuario

Plugin **gratuito** para entornos multi-empresa de FacturaScripts 2026. Permite que cada usuario solo pueda ver y operar sobre las empresas que se le han asignado explícitamente.

### ¿Cómo funciona?

- **Sin restricciones:** si un usuario no tiene ninguna empresa asignada, puede acceder a **todas** las empresas del sistema (comportamiento original, retrocompatible).
- **Con restricciones:** si se le asigna una o más empresas, **solo podrá operar sobre esas**, y si en algún momento tiene activa una empresa no permitida, el sistema le cambia automáticamente a su primera empresa autorizada.

### Funciones principales

- Matriz de configuración Usuario × Empresa en **Admin &gt; Acceso a Empresas**
- Activación/desactivación de accesos con un solo clic
- Botón &quot;Sin restricciones&quot; para liberar a un usuario de todas las restricciones
- Protección automática en cada petición web (via `Init::init()`)
- Compatible con instalaciones existentes: si no hay ninguna restricción definida, el comportamiento es exactamente igual que sin el plugin

### Demo online

Prueba el plugin sin instalar nada en [https://empresaacceso.adelantia.com](https://empresaacceso.adelantia.com) — Acceso: usuario demo / contraseña demo1234. Es un entorno público de pruebas (los datos pueden reiniciarse; no introduzcas datos reales).

## Requisitos

- FacturaScripts 2026 o superior
- PHP 8.1 o superior

### Instalación

1. Descarga el ZIP y súbelo en **Admin &gt; Plugins &gt; Subir plugin**
2. Activa EmpresaAcceso
3. Ve a **Admin &gt; Acceso a Empresas** y configura los accesos por usuario

Desarrollado por [YAST TELECOM SL](https://adelantia.com) — soporte@adelantia.com