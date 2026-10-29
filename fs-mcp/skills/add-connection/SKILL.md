---
name: add-connection
description: Guía para añadir una nueva conexión de FacturaScripts al archivo de configuración
---

# Añadir Conexión a FacturaScripts

Este skill configura una nueva conexión a una instancia de FacturaScripts. Las conexiones se guardan en `~/.fs-claude.json`, un archivo en el directorio home del usuario que **funciona en cualquier sistema operativo** (macOS, Linux, Windows) y es leído automáticamente por el servidor MCP sin necesidad de configuración adicional.

## ¿Qué necesitas?

Antes de comenzar, asegúrate de tener a mano:
- **Clave de conexión**: Un identificador único (por ejemplo: `empresa-principal`, `fs-demo`). Si ya existe una conexión con esa clave, no se sustituye salvo que el usuario lo confirme
- **Nombre descriptivo**: Descripción legible (por ejemplo: "FacturaScripts Principal")
- **URL del ERP**: La dirección base (por ejemplo: `https://facturascripts.miempresa.com`), sin `/api/3` ni `/api/3/forja`; si se pegan, se quitan al guardar
- **Token API**: El token de autenticación de FacturaScripts
- **Verificación SSL**: Si la instalación usa HTTPS con certificado auto-firmado (típico en instalaciones locales), necesitarás desactivar la verificación
- **Tipo de conexión**: `api` (por defecto) para la API REST de una instalación de FacturaScripts, o `forja` para la API de autor de facturascripts.com (ver [Conexiones de tipo forja](#conexiones-de-tipo-forja))

## Pasos

### 1. Solicita la información

Te haré algunas preguntas para recopilar los datos necesarios:

```
¿Cuál es la clave de conexión? (identificador único, sin espacios)
¿Cuál es el nombre descriptivo?
¿Cuál es la URL de FacturaScripts?
¿Es una conexión a la API de una instalación (api) o la API de autor de Forja (forja)?
¿Cuál es el token API? (en conexiones forja, el token de autor)
¿Quieres que sea la conexión por defecto? (sí/no; nunca para conexiones forja)
¿La instalación usa HTTPS con certificado auto-firmado o no verificable? (sí/no)
```

La última pregunta es especialmente relevante en estos casos:
- Instalaciones locales (`https://localhost`, `https://192.168.x.x`, etc.)
- Servidores de desarrollo con certificados auto-firmados
- Cualquier instalación donde el navegador muestre advertencia de certificado

### 2. Detecta el entorno

Una vez recopilados los datos, ejecuta estos comandos para obtener la ruta correcta según el sistema operativo:

```bash
# Detectar sistema operativo y directorio home
python3 -c "import os, sys; home = os.path.expanduser('~'); print(os.path.join(home, '.fs-claude.json'))"
```

Esto devuelve la ruta exacta a `~/.fs-claude.json` en cualquier SO:
- macOS/Linux: `/Users/username/.fs-claude.json` o `/home/username/.fs-claude.json`
- Windows: `C:\Users\username\.fs-claude.json`

### 3. Añade la conexión

**Opción A — Si el plugin MCP está instalado y activo:**

Usa la herramienta `add_connection` directamente, con `type: "forja"` si es una conexión de autor y `rejectUnauthorized: false` si el certificado no es verificable. El servidor MCP guarda automáticamente en `~/.fs-claude.json` y la conexión queda disponible sin reiniciar.

Si la clave ya existe, `add_connection` falla y no toca la conexión existente: el error indica su nombre, tipo y URL. Propón otra clave o, si el usuario confirma que quiere **sustituirla** (su token anterior se pierde), repite la llamada con `overwrite: true`.

**Opción B — Si el plugin MCP no está disponible todavía:**

Ejecuta este script Python para crear o actualizar `~/.fs-claude.json`:

```python
import json, re, sys
from pathlib import Path

fs_claude = Path.home() / '.fs-claude.json'

# Leer configuración existente o crear nueva
if fs_claude.exists():
    config = json.loads(fs_claude.read_text(encoding='utf-8'))
else:
    config = {
        "version": "1.0",
        "connections": {"default": "", "connections": {}},
        "settings": {"sortClassMembers": True, "updateCopyright": True}
    }

# Asegurarse de que existe la sección connections
if "connections" not in config:
    config["connections"] = {"default": "", "connections": {}}

# Añadir la nueva conexión (sustituir CLAVE, NOMBRE, URL, TOKEN con los valores reales)
clave = "CLAVE"
sustituir = False  # True solo si el usuario confirma que quiere reemplazar una conexión existente
if clave in config["connections"]["connections"] and not sustituir:
    sys.exit(f"Ya existe una conexión con la clave {clave!r}: usa otra clave o confirma que quieres sustituirla")

# URL base sin barra final ni la ruta de la API, que añade el servidor MCP
url = re.sub(r"/api/3(?:/forja)?$", "", "URL".strip().rstrip("/"), flags=re.I).rstrip("/")
config["connections"]["connections"][clave] = {
    "name": "NOMBRE",
    "url": url,
    "token": "TOKEN"
    # Añadir "rejectUnauthorized": False si el certificado SSL no es válido
    # Añadir "type": "forja" si es una conexión de autor de Forja
}

# Establecer como default si es la primera o si el usuario lo solicitó
if not config["connections"].get("default"):
    config["connections"]["default"] = clave

fs_claude.write_text(json.dumps(config, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"Conexión guardada en: {fs_claude}")
```

### 4. Confirma la operación

Tras guardar la conexión, muestra al usuario la ruta del archivo y el contenido de la sección `connections` (ocultando el token por seguridad).

### 5. Reinicio del servidor MCP

Para que el servidor MCP cargue las conexiones del archivo recién actualizado, inicia una sesión nueva o reinicia el host:
- **Claude Code CLI**: cierra la sesión actual y ejecuta `claude` de nuevo
- **Claude Desktop**: cierra la aplicación y vuelve a abrirla
- **Claude Cowork**: cierra y reabre la app
- **Codex**: abre un hilo nuevo; si el servidor sigue activo con la configuración anterior, reinicia Codex

> El servidor MCP lee `~/.fs-claude.json` al arrancar. No requiere configurar `FS_CONNECTIONS_FILE` manualmente; el archivo se encuentra automáticamente en cualquier plataforma.

## Estructura del archivo `~/.fs-claude.json`

```json
{
  "version": "1.0",
  "connections": {
    "default": "clave-conexion",
    "connections": {
      "clave-conexion": {
        "name": "Nombre Descriptivo",
        "url": "https://facturascripts.miempresa.com",
        "token": "tu-token-api-aqui"
      }
    }
  },
  "settings": {
    "sortClassMembers": true,
    "updateCopyright": true
  }
}
```

Para instalaciones locales o con certificado auto-firmado, añade `"rejectUnauthorized": false`:

```json
{
  "version": "1.0",
  "connections": {
    "default": "local",
    "connections": {
      "local": {
        "name": "FacturaScripts Local",
        "url": "https://localhost",
        "token": "tu-token-api-aqui",
        "rejectUnauthorized": false
      }
    }
  },
  "settings": {
    "sortClassMembers": true,
    "updateCopyright": true
  }
}
```

> ⚠️ **Nota de seguridad**: `rejectUnauthorized: false` desactiva la verificación del certificado SSL. Úsalo únicamente en instalaciones locales o de desarrollo de confianza, nunca en producción con datos reales accesibles desde internet.

## Conexiones de tipo forja

Las conexiones de tipo `forja` no apuntan a la API REST de una instalación, sino a la API de autor de facturascripts.com (`/api/3/forja`), que usan las herramientas `forja_*` para gestionar tus plugins publicados: datos e imágenes, traducciones, documentación, versiones y publicaciones.

- **Token**: es el token de autor de la pestaña **avanzado** de PortalForja. Solo lo tienen los contactos con el acuerdo de proveedor vigente.
- **URL**: la de la web de Forja, por ejemplo `https://facturascripts.com` (sin `/api/3/forja`; si se pega, se quita al guardar).
- **Clave**: usa una distinta de las existentes, por ejemplo `forja-autor`. Si ya tienes una conexión `api` a facturascripts.com con la clave `forja`, no la sustituyas: la usan las herramientas de datos (`get_webprojects`, `get_publications`...).
- **No la marques como predeterminada**: las herramientas de la API estándar (`get_*`, `create_*`...) usan la conexión por defecto y rechazan las de tipo forja. Las herramientas `forja_*` usan por su cuenta la primera conexión de tipo forja, o la que indiques en `connection`.
- Las conexiones sin `type` son de tipo `api`; no modifiques las existentes para añadirlo.

```json
"forja-autor": {
  "name": "Forja (autor)",
  "url": "https://facturascripts.com",
  "token": "tu-token-de-autor",
  "type": "forja"
}
```

## Gestión de errores

- Si la clave ya existe, no se sustituye: pregunta al usuario si quiere otra clave o reemplazarla (`overwrite: true`, o `sustituir = True` en el script)
- Si es la primera conexión, se establecerá automáticamente como predeterminada
- Si hay problemas con Python, el archivo se puede editar manualmente con cualquier editor de texto

## Configuración adicional en `~/.fs-claude.json`

La sección `settings` permite personalizar el comportamiento de los plugins de FacturaScripts para Claude:

| Clave | Tipo | Por defecto | Descripción |
|-------|------|-------------|-------------|
| `sortClassMembers` | boolean | `true` | Reordena automáticamente los miembros de clases PHP al editar |
| `updateCopyright` | boolean | `true` | Actualiza el año del copyright automáticamente al editar |

Para desactivar una función, cambia su valor a `false` en el archivo.

## Próximos pasos

Una vez hayas añadido la conexión:
- Listar todas tus conexiones: `fs-mcp:list-connections`
- Cambiar la conexión por defecto usando la herramienta `set_default_connection`
- Usar el MCP con cualquiera de tus conexiones configuradas

¿Preparado? Proporcióname la información de tu conexión y la configuraré por ti.
