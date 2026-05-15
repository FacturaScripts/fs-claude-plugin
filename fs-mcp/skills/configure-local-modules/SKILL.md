---
name: configure-local-modules
description: Configura la ruta de módulos MCP locales privados para el plugin fs-mcp
---

# Configurar Módulos Locales Privados

Este skill te ayuda a configurar la variable `FS_LOCAL_MODULES_PATH` para que el plugin `fs-mcp` cargue herramientas MCP privadas desde tu máquina, sin subirlas al repositorio. También te guía para crear un módulo nuevo, tanto en la raíz como dentro de una subcarpeta de grupo.

## ¿Para qué sirve?

Los módulos locales son herramientas MCP que **solo tú usas** — endpoints privados de tu empresa, integraciones con otros sistemas, o tools específicas de tu instalación de FacturaScripts. Se almacenan en tu máquina y nunca se suben a GitHub.

## Cómo funciona

El plugin lee la variable de entorno `FS_LOCAL_MODULES_PATH` al arrancar. Si apunta a un directorio válido, carga automáticamente todos los módulos que encuentre dentro, tanto en la raíz como dentro de subcarpetas de grupo.

---

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

---

## Estructura de módulos locales

El directorio de módulos soporta **dos niveles de organización**:

### Opción 1 — Módulos directamente en la raíz

```
fs-mcp-modules-privados/
  mi-modulo/
    index.js       ← único archivo necesario
    metadata.js    ← opcional, si se genera con sync-models
  otro-modulo/
    index.js
```

Los módulos de la raíz tienen su propio `manifest.json` y `descriptions.json` también en la raíz (si usan sync-models).

### Opción 2 — Módulos agrupados en subcarpetas

```
fs-mcp-modules-privados/
  MiGrupo/
    manifest.json      ← configuración del grupo (para sync-models)
    descriptions.json  ← descripciones de columnas del grupo (para sync-models)
    mi-modulo/
      index.js
      metadata.js
    otro-modulo/
      index.js
      metadata.js
  OtroGrupo/
    manifest.json
    descriptions.json
    tercer-modulo/
      index.js
      metadata.js
```

Los módulos dentro de una subcarpeta se cargan igual que los de la raíz. Puedes mezclar ambas formas en el mismo directorio.

---

## Crear un módulo nuevo

Cuando el usuario quiera añadir un módulo nuevo, **pregunta siempre**:

> ¿Quieres crear el módulo en la raíz del directorio de módulos, o dentro de una subcarpeta existente (grupo)?
> - En la raíz: el módulo va directamente en `<modules-dir>/nombre-modulo/`
> - En un grupo: el módulo va en `<modules-dir>/NombreGrupo/nombre-modulo/`

Si elige grupo, pregunta el nombre del grupo (carpeta). Si ya existe el grupo, el `manifest.json` y `descriptions.json` del grupo deben **actualizarse** añadiendo el nuevo modelo. Si no existe el grupo, se crean ambos archivos nuevos.

**Importante sobre los archivos de configuración**:
- Siempre se llaman `manifest.json` y `descriptions.json` — nunca `manifest-nombre.json` ni `nombre-descriptions.json`.
- Si ya existen en la raíz o en la subcarpeta, se **editan** para añadir el nuevo modelo; no se crean duplicados.

---

## El `index.js` de un módulo

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

---

## Flujo de este skill

Cuando ejecutes este skill seguiré estos pasos:

1. **Recopilación**: Te preguntaré la ruta de tu carpeta de módulos
2. **Verificación**: Comprobaré que el directorio existe y tiene la estructura correcta
3. **Configuración**: Te guiaré para configurar la variable en Claude Code
4. **Módulo nuevo (si aplica)**: Preguntaré si va en la raíz o en un grupo, y editaré/crearé los archivos correspondientes
5. **Confirmación**: Verificaré que el servidor MCP arranca cargando los módulos

¿Listo? Dime la ruta absoluta de tu carpeta de módulos locales y lo configuramos.
