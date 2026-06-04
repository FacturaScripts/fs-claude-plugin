# FacturaScripts Claude Plugin

Plugin para [Claude Code](https://claude.ai/code) que integra el ERP [FacturaScripts](https://facturascripts.com) con inteligencia artificial. Incluye tres subplugins independientes orientados a diferentes perfiles de uso.

## Instalación desde el Marketplace

Puedes instalar el plugin desde **Claude Desktop** (interfaz gráfica) o desde **Claude Code CLI** (terminal).

---

### Opción A — Claude Desktop (interfaz gráfica)

1. Abre Claude Desktop y ve a la pestaña **Cowork** o **Code**.
2. Haz clic en el icono de **Personalización** (ajustes/engranaje).
3. Pulsa el símbolo **+** (añadir plugin).
4. Selecciona **Nuevo plugin**.
5. Elige **Añadir marketplace** e introduce la URL del repositorio:

```
https://github.com/FacturaScripts/fs-claude-plugin
```

6. Confirma la instalación. Claude Desktop descargará el marketplace automáticamente.
7. Una vez instalado podrá ver los plugins disponibles para habilitarlos y poder usarlos.

---

### Opción B — Claude Code CLI (terminal)

En Claude Code ejecuta:

```
/plugin add marketplace FacturaScripts/fs-claude-plugin
```

O clona el repositorio e instálalo desde la ruta local:

```bash
git clone https://github.com/FacturaScripts/fs-claude-plugin
```

```
/plugin install /ruta/local/al/repositorio
```

> El plugin incluye los archivos `dist/` precompilados del servidor MCP. Aun así, **Node.js debe estar instalado** en tu máquina para que el servidor MCP pueda ejecutarse.

---

### 2. Activar los plugins

Una vez instalado el marketplace, activa los subplugins que necesites desde la gestión de plugins de Claude Code:

| Plugin | Para quién | Descripción |
|---|---|---|
| **fs-dev** | Desarrolladores | Skills y agentes para crear y mantener plugins de FacturaScripts |
| **fs-user** | Usuarios del ERP | Skills para analizar datos, generar informes y resolver dudas |
| **fs-mcp** | Cualquier usuario | Servidor MCP que conecta Claude directamente con tu FacturaScripts |

Puedes activar uno, dos o los tres según tu perfil. No es necesario activarlos todos.

---

## Plugins incluidos

- [fs-dev — Plugin para desarrolladores](fs-dev/README.md)
- [fs-user — Plugin para usuarios del ERP](fs-user/README.md)
- [fs-mcp — Servidor MCP de FacturaScripts](fs-mcp/README.md)

---

## Requisitos

- [Claude Code](https://claude.ai/code) con soporte de plugins
- FacturaScripts con API REST habilitada (solo para el plugin `fs-mcp`)
- **Node.js ≥ 18** instalado en tu máquina (Linux, macOS o Windows) — necesario para ejecutar el servidor MCP

---

## Licencia

MIT — [FacturaScripts](https://facturascripts.com)
