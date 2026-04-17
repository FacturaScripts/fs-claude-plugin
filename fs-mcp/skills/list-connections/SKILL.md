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
CLAVE              | NOMBRE                   | URL                              | POR DEFECTO
-------------------|--------------------------|----------------------------------|-----------
empresa-principal  | FacturaScripts Principal | https://fs.empresa.com          | ✓
empresa-secundaria | FacturaScripts Demo      | https://fs-demo.empresa.com     |
```

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

1. El skill consultará el archivo de configuración (`connections.json`)
2. Si el MCP está disponible, usará la herramienta `list_connections`
3. Si no está disponible, leerá el archivo directamente
4. Mostrará los resultados en formato tabla
5. Dará recomendaciones si falta algo

## Próximos Pasos

Según lo que veas:

- **Si hay conexiones**: Puedes empezar a usar el MCP con todos sus endpoints
- **Si no hay conexiones**: Usa `fs-mcp:add-connection` para crear una
- **Si quieres cambiar la predeterminada**: Anota la clave y contacta al administrador del MCP
- **Si tienes problemas**: Verifica que el archivo `connections.json` existe en `${CLAUDE_PLUGIN_DATA}/`

¿Quieres ejecutar este skill? Te mostraré todas tus conexiones configuradas.
