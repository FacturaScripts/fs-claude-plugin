---
name: configure-local-modules
description: Configura la ruta de módulos MCP locales privados para el plugin fs-mcp
---

# Configurar Módulos Locales Privados

Este skill te ayuda a configurar la variable `FS_LOCAL_MODULES_PATH` para que el plugin `fs-mcp` cargue herramientas MCP privadas desde tu máquina, sin subirlas al repositorio.

## ¿Para qué sirve?

Los módulos locales son herramientas MCP que **solo tú usas** — endpoints privados de tu empresa, integraciones con otros sistemas, o tools específicas de tu instalación de FacturaScripts. Se almacenan en tu máquina y nunca se suben a GitHub.

## Cómo funciona

El plugin lee la variable de entorno `FS_LOCAL_MODULES_PATH` al arrancar. Si apunta a un directorio válido, carga automáticamente todos los módulos que encuentre dentro.

## Pasos para configurar

### 1. Pregunta la ruta

Antes de continuar, necesito saber:

```
¿Cuál es la ruta absoluta a tu carpeta de módulos locales?
Ejemplo: /Users/tu-usuario/fs-mcp-modules-privados
```

### 2. Verificar que la ruta existe

Comprueba que el directorio existe en el sistema de archivos. Si no existe, créalo:

```bash
mkdir -p /ruta/a/tu/carpeta
```

### 3. Configurar la variable en Claude Code

Una vez tengas la ruta, tienes dos formas de configurarla:

#### Opción A — A través de la configuración del plugin (recomendado)

En Claude Code, ejecuta:

```
/plugin-config fs-mcp
```

Busca el campo **"Ruta de módulos locales privados"** (`FS_LOCAL_MODULES_PATH`) e introduce la ruta absoluta a tu carpeta.

Esta opción almacena el valor de forma **local en tu máquina** y nunca se sube a GitHub.

#### Opción B — Editar el plugin.json localmente (solo uso personal)

Si el plugin lo tienes en local y **no lo vas a subir a GitHub**, puedes editar directamente:

```
<ruta-del-plugin>/.claude-plugin/plugin.json
```

Busca la línea:
```json
"FS_LOCAL_MODULES_PATH": "${FS_LOCAL_MODULES_PATH}"
```

Y cambia el valor por tu ruta:
```json
"FS_LOCAL_MODULES_PATH": "/ruta/absoluta/a/tu/carpeta"
```

⚠️ **No hagas esto si el plugin.json está en un repositorio compartido** — tu ruta local acabaría en el repo de otros.

### 4. Reiniciar el servidor MCP

Después de configurar la variable, reinicia el servidor MCP:

- En Claude Code: cierra y vuelve a abrir la sesión, o usa `/mcp restart`
- En el terminal: detén el proceso y vuelve a ejecutar `node dist/index.js`

Al arrancar verás en los logs algo como:

```
[local-loader] ✓ Módulo local cargado: mi-modulo
[local-loader] 1 módulo(s) local(es) cargado(s) desde: /ruta/a/tu/carpeta
```

## Estructura de un módulo local

Cada módulo es una **carpeta con un `index.js`** dentro de tu directorio:

```
fs-mcp-modules-privados/
  mi-modulo/
    index.js       ← único archivo necesario
  otro-modulo/
    index.js
```

El `index.js` debe exportar dos funciones:

```javascript
// Registra las tools de este módulo en el servidor MCP
export async function registerTools(toolsMap) {
  toolsMap.set('nombre_de_mi_tool', {
    name: 'nombre_de_mi_tool',
    description: 'Descripción de lo que hace',
    inputSchema: {
      type: 'object',
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        limit: { type: 'number', description: 'Máximo de resultados', default: 50 },
        offset: { type: 'number', description: 'Paginación', default: 0 },
      },
      required: [],
    },
  });
}

// Maneja la llamada a la tool. Devuelve null si no es tu tool.
export async function handleTool(name, args, client) {
  if (name !== 'nombre_de_mi_tool') return null;

  const result = await client.get('/mi-endpoint', {
    limit: args.limit ?? 50,
    offset: args.offset ?? 0,
  }, args.connection);

  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
}
```

El parámetro `client` ya viene configurado con las conexiones que tienes en el plugin — no necesitas importar nada.

## Flujo de este skill

Cuando ejecutes este skill seguiré estos pasos:

1. **Recopilación**: Te preguntaré la ruta de tu carpeta de módulos
2. **Verificación**: Comprobaré que el directorio existe y tiene la estructura correcta
3. **Configuración**: Te guiaré para configurar la variable en Claude Code
4. **Confirmación**: Verificaré que el servidor MCP arranca cargando los módulos

¿Listo? Dime la ruta absoluta de tu carpeta de módulos locales y lo configuramos.
