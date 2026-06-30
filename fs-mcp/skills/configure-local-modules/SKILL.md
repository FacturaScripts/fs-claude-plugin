---
name: configure-local-modules
description: Configura la ruta de módulos MCP locales privados en ~/.fs-claude.json
---

# Configurar Módulos Locales Privados

Este skill configura la ruta de módulos MCP privados en `~/.fs-claude.json` (el archivo de configuración unificado de fs-claude), y te guía para crear módulos nuevos.

## ¿Para qué sirve?

Los módulos locales son herramientas MCP que **solo tú usas** — endpoints privados de tu empresa, integraciones con otros sistemas, o tools específicas de tu instalación de FacturaScripts. Se almacenan en tu máquina y nunca se suben a GitHub.

## Cómo funciona

El servidor MCP lee `settings.localModulesPath` de `~/.fs-claude.json` al arrancar. Si la ruta existe, carga automáticamente todos los módulos dentro. No requiere configuración de variables de entorno.

---

## Pasos para configurar

### 1. Detectar la configuración actual

Ejecuta este comando para saber si ya tienes una ruta configurada:

```python
import json
from pathlib import Path

fs_claude = Path.home() / '.fs-claude.json'
if fs_claude.exists():
    config = json.loads(fs_claude.read_text(encoding='utf-8'))
    path = config.get('settings', {}).get('localModulesPath', '')
    print(f"Ruta configurada: {path}" if path else "Sin ruta configurada")
else:
    print("~/.fs-claude.json no existe aún")
```

### 2a. Si ya hay una ruta configurada

Usa esa ruta directamente. Confirma al usuario que el servidor MCP la cargará al reiniciar y muestra su contenido actual.

### 2b. Si NO hay ruta configurada

Pregunta al usuario si quiere:
- **Usar una carpeta existente**: proporciona la ruta absoluta
- **Crear la carpeta por defecto**: se crea `~/fs-claude-mcp-private/` automáticamente

Para crear la carpeta por defecto y registrarla:

```python
import json
from pathlib import Path

fs_claude = Path.home() / '.fs-claude.json'
modules_dir = Path.home() / 'fs-claude-mcp-private'

# Crear el directorio si no existe
modules_dir.mkdir(exist_ok=True)
print(f"Carpeta creada: {modules_dir}")

# Actualizar ~/.fs-claude.json
config = json.loads(fs_claude.read_text(encoding='utf-8')) if fs_claude.exists() else {
    "version": "1.0",
    "connections": {"default": "", "connections": {}},
    "settings": {"sortClassMembers": True, "updateCopyright": True}
}
config.setdefault('settings', {})['localModulesPath'] = str(modules_dir)
fs_claude.write_text(json.dumps(config, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"Ruta guardada en: {fs_claude}")
```

Para usar una ruta existente, reemplaza `modules_dir` con la ruta que proporcione el usuario.

### 3. Reiniciar el servidor MCP

Después de configurar la ruta, reinicia Claude para que el servidor MCP la cargue:
- **Claude Code CLI**: cierra la sesión y ejecuta `claude` de nuevo
- **Claude Desktop**: cierra y vuelve a abrir la app

Al arrancar verás en los logs:
```
[local-loader] ✓ Módulo local cargado: mi-modulo
[local-loader] 1 módulo(s) local(es) cargado(s) desde: /ruta/a/tu/carpeta
```

---

## Estructura de módulos locales

El directorio soporta **dos niveles de organización**:

### Opción 1 — Módulos directamente en la raíz

```
fs-claude-mcp-private/
  mi-modulo/
    index.js       ← único archivo necesario
    metadata.js    ← opcional, si se genera con sync-models
  otro-modulo/
    index.js
```

### Opción 2 — Módulos agrupados en subcarpetas

```
fs-claude-mcp-private/
  MiGrupo/
    manifest.json      ← configuración del grupo (para sync-models)
    descriptions.json  ← descripciones de columnas del grupo (para sync-models)
    mi-modulo/
      index.js
      metadata.js
    otro-modulo/
      index.js
  OtroGrupo/
    manifest.json
    descriptions.json
    tercer-modulo/
      index.js
```

Puedes mezclar ambas formas en el mismo directorio.

---

## Crear un módulo nuevo

Cuando el usuario quiera añadir un módulo nuevo, **pregunta siempre**:

> ¿Quieres crear el módulo en la raíz del directorio de módulos, o dentro de una subcarpeta existente (grupo)?
> - En la raíz: el módulo va directamente en `<modules-dir>/nombre-modulo/`
> - En un grupo: el módulo va en `<modules-dir>/NombreGrupo/nombre-modulo/`

Si elige grupo, pregunta el nombre del grupo (carpeta). Si ya existe el grupo, el `manifest.json` y `descriptions.json` deben **actualizarse** añadiendo el nuevo modelo. Si no existe el grupo, se crean ambos archivos nuevos.

**Reglas sobre los archivos de configuración**:
- Siempre se llaman `manifest.json` y `descriptions.json` — nunca con sufijos de nombre.
- Si ya existen, se **editan** para añadir el nuevo modelo; no se crean duplicados.

---

## El `index.js` de un módulo

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
        // Declara cada filtro como un parámetro propio (recomendado):
        idproject: { type: 'number', description: 'Filtrar por proyecto' },
        nombre: { type: 'string', description: 'Filtrar por nombre (búsqueda parcial)' },
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
    idproject: args.idproject,        // se envía como filter[idproject]
    nombre_like: args.nombre,         // se envía como filter[nombre_like] (LIKE)
  }, args.connection);

  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
}
```

El parámetro `client` ya viene configurado con las conexiones de `~/.fs-claude.json` — no necesitas importar nada.

### ⚠️ Filtros: cómo funcionan (importante)

La API REST de FacturaScripts **solo aplica filtros con la sintaxis `filter[campo]=valor`**. Los parámetros sueltos en la URL (`?idproject=1`) se **ignoran en silencio** (la consulta devuelve todo). Para evitar este error, `client.get(endpoint, params, connection)` **envuelve automáticamente** cada clave de `params` como `filter[clave]=valor`, salvo las reservadas `offset`, `limit`, `sort` y `operation` (que se pasan tal cual) y las claves que ya vengan en notación de corchetes (`filter[...]`).

Por tanto, basta con pasar cada campo de filtro directamente en el objeto `params` (patrón recomendado, idéntico al de las tools del servidor principal). Los valores `null`/`undefined` se omiten automáticamente, así que puedes pasar `args.idproject` aunque sea opcional.

**Operadores** — añade un sufijo al nombre del campo:

| Sufijo | Operador | Ejemplo (clave en `params`) |
|---|---|---|
| _(ninguno)_ | `=` | `idproject: 1` |
| `_like` | `LIKE` (búsqueda parcial; el core envuelve con `%…%`) | `nombre_like: 'forja'` |
| `_gt` / `_gte` | `>` / `>=` | `price_gte: 100` |
| `_lt` / `_lte` | `<` / `<=` | `creationdate_lte: '2025-12-31'` |
| `_neq` | `!=` | `type_neq: 'private'` |
| `_null` / `_notnull` | `IS NULL` / `IS NOT NULL` | `idparent_null: 1` |

> Si filtras por una columna que no existe en el modelo, la API responde con error `api: fields not allowed: <campo>`.

Para ordenar usa `sort[campo]`: `{ 'sort[creationdate]': 'DESC' }`.

---

## Flujo de este skill

1. **Detección**: Compruebo si `~/.fs-claude.json` ya tiene `settings.localModulesPath`
2. **Configuración**: Si no hay ruta, pregunto si usar una existente o crear `~/fs-claude-mcp-private/`
3. **Escritura**: Actualizo `~/.fs-claude.json` con la ruta elegida
4. **Módulo nuevo (si aplica)**: Pregunto si va en la raíz o en un grupo, y edito/creo los archivos
5. **Reinicio**: Indico al usuario que reinicie Claude para cargar los módulos

¿Listo? Dime si tienes ya una carpeta de módulos o si quiero que cree la carpeta por defecto.
