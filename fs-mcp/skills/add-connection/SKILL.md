---
name: add-connection
description: Guía para añadir una nueva conexión de FacturaScripts al archivo de configuración
---

# Añadir Conexión a FacturaScripts

Este skill te guía paso a paso para configurar una nueva conexión a una instancia de FacturaScripts en el plugin `fs-mcp`.

## ¿Qué necesitas?

Antes de comenzar, asegúrate de tener a mano:
- **Clave de conexión**: Un identificador único (por ejemplo: `empresa-principal`, `fs-demo`)
- **Nombre descriptivo**: Descripción legible (por ejemplo: "FacturaScripts Principal")
- **URL del ERP**: La dirección completa (por ejemplo: `https://facturascripts.miempresa.com`)
- **Token API**: El token de autenticación de FacturaScripts

## Pasos

### 1. Solicita la información

Te haré algunas preguntas para recopilar los datos necesarios:

```
¿Cuál es la clave de conexión? (identificador único, sin espacios)
¿Cuál es el nombre descriptivo?
¿Cuál es la URL de FacturaScripts?
¿Cuál es el token API?
¿Quieres que sea la conexión por defecto? (sí/no)
```

### 2. Procesa la información

Una vez que proporciones los datos, verificaré que sean válidos:
- La clave no debe estar vacía
- El nombre es obligatorio
- La URL debe ser válida
- El token no puede estar vacío

### 3. Añade la conexión

**Si el plugin MCP está instalado:**
Usaré la herramienta `add_connection` para guardar la conexión de forma segura en `${CLAUDE_PLUGIN_DATA}/connections.json`

**Si el plugin MCP no está disponible:**
Te mostraré cómo editar manualmente el archivo `connections.json` con el siguiente formato:

```json
{
  "default": "clave-conexion",
  "connections": {
    "clave-conexion": {
      "name": "Nombre Descriptivo",
      "url": "https://facturascripts.miempresa.com",
      "token": "tu-token-api-aqui"
    }
  }
}
```

## Flujo Interactivo

Cuando ejecutes este skill, seguiremos estos pasos:

1. **Recopilación**: Te haré preguntas sobre la nueva conexión
2. **Validación**: Verificaré que todos los datos sean correctos
3. **Almacenamiento**: Guardaré la conexión usando el MCP o te indicaré cómo hacerlo manualmente
4. **Confirmación**: Confirmaré que la conexión se ha añadido correctamente

## Gestión de Errores

- Si la clave ya existe, se actualizará
- Si es la primera conexión, se establecerá automáticamente como predeterminada
- Si hay problemas al guardar, se te mostrarán instrucciones para hacerlo manualmente

## Próximos Pasos

Una vez hayas añadido la conexión, puedes:
- Listar todas tus conexiones: `fs-mcp:list-connections`
- Cambiar la conexión por defecto
- Usar el MCP con cualquiera de tus conexiones configuradas

¿Preparado? Proporcioname la información de tu conexión y la configuraré por ti.
