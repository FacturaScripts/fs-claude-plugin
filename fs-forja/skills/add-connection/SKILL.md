---
name: add-connection
description: Añade o sustituye la conexión de tipo forja con el token de autor de la API de la forja de facturascripts.com, en ~/.fs-claude.json.
---

# Añadir la conexión de la forja

Esta skill configura la conexión que usan las herramientas `forja_*` de fs-forja para gestionar los plugins publicados en facturascripts.com con la API de autor (`/api/3/forja`). Se guarda en `~/.fs-claude.json`, el mismo archivo que usa fs-mcp, como una conexión con `"type": "forja"`.

fs-forja y fs-mcp comparten el archivo, pero no las conexiones:

- fs-forja solo usa las conexiones de tipo `forja` y **nunca toca** las de fs-mcp (las que no tienen `type` o tienen `"type": "api"`) ni la conexión por defecto, que es de fs-mcp.
- Para conectar con la API REST de una instalación del ERP usa `fs-mcp:add-connection`, no esta skill.

## Qué necesitas

- **Token de autor**: se genera en la pestaña **avanzado** de PortalForja (área de cliente de facturascripts.com), que solo aparece cuando el personal de facturascripts.com ha concedido al contacto el acceso a la API. **Solo se muestra al generarlo**: si se perdió, hay que generar otro y sustituir la conexión.
- **Clave**: un identificador sin espacios que no exista ya, por ejemplo `forja-autor`.
- **Nombre**: una descripción legible, por ejemplo `Forja (autor)`.
- **URL**: la de la web, normalmente `https://facturascripts.com` exactamente, sin `www.` ni `http://`. El cliente no sigue redirecciones para que el token no llegue a otra dirección. Si se pega `.../api/3/forja`, se quita al guardar.
- **Certificado**: solo para una forja local de pruebas con un certificado autofirmado, `rejectUnauthorized: false`.

No pidas al usuario que pegue el token en el chat si puede escribirlo directamente en la herramienta o en el archivo; nunca lo muestres en las respuestas.

## Pasos

### 1. Comprueba las conexiones existentes

Si fs-forja está activo, llama a `forja_list_connections`. Si ya hay una conexión de tipo forja, pregunta si quiere sustituirla (por ejemplo, porque ha generado otro token) o añadir otra.

### 2. Añade la conexión

**Opción A — Con el servidor MCP de fs-forja activo:** usa la herramienta `forja_add_connection` con `key`, `name`, `url` y `token`. La conexión queda disponible al momento, sin reiniciar.

- Si la clave es de una conexión de fs-mcp, falla y no la toca: propón otra clave.
- Si la clave es de una conexión de tipo forja, falla salvo con `overwrite: true`, que solo debes usar si el usuario confirma que quiere sustituirla (el token anterior se pierde).

**Opción B — Sin el servidor MCP disponible:** ejecuta este script con `python3`, sustituyendo `CLAVE`, `NOMBRE`, `URL` y `TOKEN` por los valores reales:

```python
import json, os, re, sys, uuid
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

# Asegurarse de que existe la sección connections; la conexión por defecto es de fs-mcp y no se cambia
config.setdefault("connections", {})
config["connections"].setdefault("default", "")
config["connections"].setdefault("connections", {})

clave = "CLAVE"
sustituir = False  # True solo si el usuario confirma que quiere reemplazar su conexión de tipo forja
existente = config["connections"]["connections"].get(clave)
if existente and existente.get("type") != "forja":
    sys.exit(f"La clave {clave!r} es una conexión de fs-mcp y fs-forja no la sustituye: usa otra clave")
if existente and not sustituir:
    sys.exit(f"Ya existe una conexión de tipo forja con la clave {clave!r}: usa otra clave o confirma que quieres sustituirla")

# URL base sin barra final ni la ruta de la API, que añade el servidor MCP
url = re.sub(r"/api/3(?:/forja)?$", "", "URL".strip().rstrip("/"), flags=re.I).rstrip("/")
config["connections"]["connections"][clave] = {
    "name": "NOMBRE",
    "url": url,
    "token": "TOKEN",
    "type": "forja"
    # Añadir "rejectUnauthorized": False solo para una forja local con certificado autofirmado
}

# Se escribe en un temporal del mismo directorio, se lleva a disco y se renombra
# encima: el archivo nunca queda vacío ni a medias, tampoco mientras lo leen los
# servidores MCP. Guarda los tokens: el temporal se crea en exclusiva y legible
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
print(f"Conexión de tipo forja guardada en: {fs_claude}")
```

Con la opción B, el servidor de fs-forja lee el archivo al arrancar: abre una sesión nueva en Claude Code o un hilo nuevo en Codex.

### 3. Comprueba el acceso

Llama a `forja_list_plugins`. Si devuelve los plugins del usuario, la conexión funciona. Errores habituales:

- **401**: el token no es válido; genera otro en PortalForja y sustituye la conexión.
- **403**: el personal de facturascripts.com no ha concedido el acceso a la API de autor (o lo ha retirado), o la IP está bloqueada tras varios intentos fallidos.
- **Redirección**: la URL no es exactamente `https://facturascripts.com`; corrígela sustituyendo la conexión.

### 4. Confirma la operación

Muestra la clave, el nombre y la URL de la conexión guardada, sin el token. Para trabajar con un plugin, la skill `fs-dev:sincronizar-forja` explica el flujo completo.
