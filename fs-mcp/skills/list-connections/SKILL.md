---
name: list-connections
description: Lista todas las conexiones de FacturaScripts configuradas en el plugin
---

# Listar Conexiones de FacturaScripts

Este skill te muestra todas las conexiones de FacturaScripts que tienes configuradas en el plugin `fs-mcp`.

## ¿Qué hace?

Obtiene un resumen de todas tus conexiones con los detalles principales:
- **Clave**: Identificador único de la conexión
- **Nombre**: Descripción legible
- **URL**: Dirección del servidor FacturaScripts
- **Estado**: Indica cuál es la conexión por defecto

## Información que Obtendrás

El skill mostrará una tabla con este formato:

```
CLAVE              | NOMBRE                   | URL                          | POR DEFECTO
-------------------|--------------------------|------------------------------|-----------
empresa-principal  | FacturaScripts Principal | https://fs.empresa.com       | ✓
empresa-secundaria | FacturaScripts Demo      | https://fs-demo.empresa.com  |
```

No muestres nunca los tokens. El archivo `~/.fs-ai.json` también puede guardar conexiones de tipo `forja` (las que tienen `"type": "forja"`): son del plugin **fs-forja**, que las lista con `forja_list_connections`. No las muestres en esta tabla; como mucho, indica cuántas hay y que las gestiona fs-forja. Si se lee el archivo directamente, una conexión sin el campo `type` es de fs-mcp.

## Casos Posibles

### Sin conexiones configuradas

Si aún no tienes ninguna conexión, verás:

```
No hay conexiones configuradas.
¿Necesitas añadir una? Usa: fs-mcp:add-connection
```

Cuando veas este mensaje, sigue estos pasos:
1. Usa el skill `fs-mcp:add-connection`
2. Proporciona los datos de tu instancia de FacturaScripts
3. Vuelve a ejecutar este skill para confirmar

### Con conexiones

Verás un listado completo de todas tus conexiones, marcando cuál es la predeterminada con un símbolo (✓).

## Cómo Leer los Resultados

- **CLAVE**: Usarla para especificar qué conexión usar en operaciones específicas
- **NOMBRE**: La descripción que configuraste
- **URL**: Valida que apunta al servidor correcto
- Si la conexión por defecto del archivo es de tipo `forja` (de una versión antigua), recomienda cambiarla a una conexión del ERP con `set_default_connection`: las herramientas de datos rechazan las conexiones de tipo forja
- **POR DEFECTO**: Si ves la marca aquí, es la conexión que se usará automáticamente

## Casos de Uso

### Verificar Tu Conexión Primaria
Ejecuta este skill para asegurar que tu conexión por defecto es la correcta.

### Verificar Múltiples Conexiones
Si trabajas con varios entornos (desarrollo, pruebas, producción), verifica que todas estén configuradas.

### Cambiar la Conexión por Defecto
Si necesitas cambiar cuál es la conexión por defecto, puedes:
1. Ver esta lista
2. Notar qué conexión quieres que sea por defecto
3. Usar el comando: `set_default_connection` con la clave correspondiente

## Flujo de Ejecución

1. La skill consultará el archivo unificado `~/.fs-ai.json`
2. Si el MCP está disponible, usará la herramienta `list_connections`
3. Si no está disponible, leerá el archivo directamente
4. Mostrará los resultados en formato tabla
5. Dará recomendaciones si falta algo

## Próximos Pasos

Según lo que veas:

- **Si hay conexiones**: Puedes empezar a usar el MCP con todos sus endpoints
- **Si no hay conexiones**: Usa `fs-mcp:add-connection` para crear una
- **Si quieres cambiar la predeterminada**: Anota la clave y contacta al administrador del MCP
- **Si tienes problemas**: verifica que existe `~/.fs-ai.json`, que su JSON es válido y que contiene la sección `connections`

¿Quieres ejecutar este skill? Te mostraré todas tus conexiones configuradas.
