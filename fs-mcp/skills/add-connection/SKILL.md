---
name: add-connection
description: Guía para añadir una nueva conexión de FacturaScripts al archivo de configuración
---

# Añadir Conexión a FacturaScripts

Este skill configura una nueva conexión a una instancia de FacturaScripts. Las conexiones se guardan en `~/.fs-ai.json`, un archivo en el directorio home del usuario que **funciona en cualquier sistema operativo** (macOS, Linux, Windows) y es leído automáticamente por el servidor MCP sin necesidad de configuración adicional.

## ¿Qué necesitas?

Antes de comenzar, asegúrate de tener a mano:
- **Clave de conexión**: Un identificador único (por ejemplo: `empresa-principal`, `fs-demo`). Si ya existe una conexión con esa clave, no se sustituye salvo que el usuario lo confirme
- **Nombre descriptivo**: Descripción legible (por ejemplo: "FacturaScripts Principal")
- **URL del ERP**: La dirección base (por ejemplo: `https://facturascripts.miempresa.com`), sin `/api/3`; si se pega, se quita al guardar
- **Token API**: El token de autenticación de FacturaScripts
- **Verificación SSL**: Si la instalación usa HTTPS con certificado auto-firmado (típico en instalaciones locales), necesitarás desactivar la verificación

## Pasos

### 1. Solicita la información

Te haré algunas preguntas para recopilar los datos necesarios:

```
¿Cuál es la clave de conexión? (identificador único, sin espacios)
¿Cuál es el nombre descriptivo?
¿Cuál es la URL de FacturaScripts?
¿Cuál es el token API?
¿Quieres que sea la conexión por defecto? (sí/no)
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
python3 -c "import os; h = os.path.expanduser('~'); n = os.path.join(h, '.fs-ai.json'); v = os.path.join(h, '.fs-claude.json'); print(v if not os.path.exists(n) and os.path.exists(v) else n)"
```

Esto devuelve la ruta exacta a `~/.fs-ai.json` en cualquier SO:
- macOS/Linux: `/Users/username/.fs-ai.json` o `/home/username/.fs-ai.json`
- Windows: `C:\Users\username\.fs-ai.json`

Si solo existe el archivo antiguo `~/.fs-claude.json` (instalaciones anteriores al cambio de nombre), se sigue usando ese.
### 3. Añade la conexión

**Opción A — Si el plugin MCP está instalado y activo:**

Usa la herramienta `add_connection` directamente, con `rejectUnauthorized: false` si el certificado no es verificable. El servidor MCP guarda automáticamente en `~/.fs-ai.json` y la conexión queda disponible sin reiniciar.

Si la clave ya existe, `add_connection` falla y no toca la conexión existente: el error indica su nombre y su URL. Propón otra clave o, si el usuario confirma que quiere **sustituirla** (su token anterior se pierde), repite la llamada con `overwrite: true`.

**Opción B — Si el plugin MCP no está disponible todavía:**

Ejecuta este script Python para crear o actualizar `~/.fs-ai.json`:

```python
import json, os, re, sys, uuid
from pathlib import Path

# ~/.fs-ai.json, o el antiguo ~/.fs-claude.json mientras sea el único que existe
fs_claude = Path.home() / '.fs-ai.json'
if not fs_claude.exists() and (Path.home() / '.fs-claude.json').exists():
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
existente = config["connections"]["connections"].get(clave)
if existente and existente.get("type") == "forja":
    sys.exit(f"La clave {clave!r} es una conexión de tipo forja, del plugin fs-forja: usa otra clave")
if existente and not sustituir:
    sys.exit(f"Ya existe una conexión con la clave {clave!r}: usa otra clave o confirma que quieres sustituirla")

# URL base sin barra final ni la ruta de la API, que añade el servidor MCP
url = re.sub(r"/api/3(?:/forja)?$", "", "URL".strip().rstrip("/"), flags=re.I).rstrip("/")
config["connections"]["connections"][clave] = {
    "name": "NOMBRE",
    "url": url,
    "token": "TOKEN"
    # Añadir "rejectUnauthorized": False si el certificado SSL no es válido
}

# Establecer como default si es la primera o si el usuario lo solicitó
if not config["connections"].get("default"):
    config["connections"]["default"] = clave

# Se escribe en un temporal del mismo directorio, se lleva a disco y se renombra
# encima: el archivo nunca queda vacío ni a medias, tampoco mientras lo lee el
# servidor MCP. Guarda los tokens: el temporal se crea en exclusiva y legible
# sólo por el usuario (0600). Si es un enlace simbólico, se escribe en su destino.
destino = fs_claude.resolve()
tmp = destino.with_name(f"{destino.name}.{uuid.uuid4()}.tmp")
fd = os.open(tmp, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
try:
    with os.fdopen(fd, 'w', encoding='utf-8') as f:
        f.write(json.dumps(config, indent=2, ensure_ascii=False))
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, destino)
except BaseException:
    tmp.unlink(missing_ok=True)
    raise
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

> El servidor MCP lee `~/.fs-ai.json` al arrancar. No requiere configurar `FS_CONNECTIONS_FILE` manualmente; el archivo se encuentra automáticamente en cualquier plataforma.

## Estructura del archivo `~/.fs-ai.json`

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

## Conexiones de la forja

Esta skill solo añade conexiones a la API REST de una instalación de FacturaScripts. El token de autor de la API de la forja de facturascripts.com (el de la pestaña **avanzado** de PortalForja) **no se configura aquí**: lo gestiona el plugin **fs-forja**, con la skill `fs-forja:add-connection` o su herramienta `forja_add_connection`. Se guarda en el mismo `~/.fs-ai.json` como una conexión de tipo `forja`, que fs-mcp no usa ni modifica. Si el usuario quiere conectar con la forja y fs-forja no está instalado, indícale que lo active desde el gestor de plugins.

## Gestión de errores

- Si la clave ya existe, no se sustituye: pregunta al usuario si quiere otra clave o reemplazarla (`overwrite: true`, o `sustituir = True` en el script)
- Si es la primera conexión, se establecerá automáticamente como predeterminada
- Si hay problemas con Python, el archivo se puede editar manualmente con cualquier editor de texto

## Configuración adicional en `~/.fs-ai.json`

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
