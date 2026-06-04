---
name: add-connection
description: Guía para añadir una nueva conexión de FacturaScripts al archivo de configuración
---

# Añadir Conexión a FacturaScripts

Este skill configura una nueva conexión a una instancia de FacturaScripts. Las conexiones se guardan en `~/.fs-claude.json`, un archivo en el directorio home del usuario que **funciona en cualquier sistema operativo** (macOS, Linux, Windows) y es leído automáticamente por el servidor MCP sin necesidad de configuración adicional.

## ¿Qué necesitas?

Antes de comenzar, asegúrate de tener a mano:
- **Clave de conexión**: Un identificador único (por ejemplo: `empresa-principal`, `fs-demo`)
- **Nombre descriptivo**: Descripción legible (por ejemplo: "FacturaScripts Principal")
- **URL del ERP**: La dirección completa (por ejemplo: `https://facturascripts.miempresa.com`)
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
python3 -c "import os, sys; home = os.path.expanduser('~'); print(os.path.join(home, '.fs-claude.json'))"
```

Esto devuelve la ruta exacta a `~/.fs-claude.json` en cualquier SO:
- macOS/Linux: `/Users/username/.fs-claude.json` o `/home/username/.fs-claude.json`
- Windows: `C:\Users\username\.fs-claude.json`

### 3. Añade la conexión

**Opción A — Si el plugin MCP está instalado y activo:**

Usa la herramienta `add_connection` directamente. El servidor MCP guarda automáticamente en `~/.fs-claude.json`.

**Opción B — Si el plugin MCP no está disponible todavía:**

Ejecuta este script Python para crear o actualizar `~/.fs-claude.json`:

```python
import json, sys
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
config["connections"]["connections"][clave] = {
    "name": "NOMBRE",
    "url": "URL",
    "token": "TOKEN"
    # Añadir "rejectUnauthorized": False si el certificado SSL no es válido
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

Para que Claude cargue las conexiones del archivo recién actualizado, es necesario **reiniciar Claude**:
- **Claude Code CLI**: cierra la sesión actual y ejecuta `claude` de nuevo
- **Claude Desktop**: cierra la aplicación y vuelve a abrirla
- **Claude Cowork**: cierra y reabre la app

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

## Gestión de errores

- Si la clave ya existe, se actualizará con los nuevos datos
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
