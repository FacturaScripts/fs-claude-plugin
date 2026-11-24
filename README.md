# Plugins de FacturaScripts para Claude Code y Codex

Este repositorio distribuye cuatro plugins independientes para trabajar con [FacturaScripts](https://facturascripts.com) desde Claude Code o Codex.

| Plugin | Para quién | Descripción |
|---|---|---|
| **fs-dev** | Desarrolladores | Skills portables, perfiles especializados, documentación técnica y automatizaciones |
| **fs-user** | Usuarios del ERP | Análisis de datos, informes y ayuda documentada sobre el uso del ERP |
| **fs-mcp** | Cualquier usuario | Servidor MCP de la API REST del ERP, con conexiones múltiples y módulos privados locales |
| **fs-forja** | Autores de plugins | Servidor MCP de la API de autor de la forja de facturascripts.com: versiones, documentación, traducciones, noticias, errores e issues de tus plugins publicados |

## Instalación en Claude Code

Añade el marketplace desde Claude Desktop/Cowork o desde Claude Code:

```text
/plugin add marketplace FacturaScripts/fs-ai-plugin
```

También puedes clonar el repositorio e instalarlo desde una ruta local:

```text
/plugin install /ruta/local/fs-ai-plugin
```

Activa después `fs-dev`, `fs-user`, `fs-mcp` y/o `fs-forja` desde el gestor de plugins. Tras actualizar una instalación local, usa `/reload-plugins` o abre una sesión nueva.

## Instalación local en Codex

Clona el repositorio y registra su marketplace local:

```bash
git clone https://github.com/FacturaScripts/fs-ai-plugin
codex plugin marketplace add /ruta/local/fs-ai-plugin
codex plugin add fs-dev@fs-ai-plugin
codex plugin add fs-user@fs-ai-plugin
codex plugin add fs-mcp@fs-ai-plugin
codex plugin add fs-forja@fs-ai-plugin
```

Después de instalar o actualizar, abre un hilo nuevo para que Codex cargue las skills y los servidores MCP actuales. Los hooks se revisan y autorizan desde `/hooks`; cuando cambia su definición, Codex solicita una nueva revisión.

Codex utiliza directamente las skills. Los archivos Markdown de `agents/` son agentes nativos de Claude Code; las skills de `fs-dev` cargan esos mismos archivos como perfiles de especialidad para mantener un único contenido compartido en ambos hosts.

La matriz de capacidades, diferencias de hooks y flujo de recarga está documentada en [COMPATIBILITY.md](COMPATIBILITY.md).

## Migrar desde `fs-claude-plugin`

El repositorio y el marketplace se llamaban antes `fs-claude-plugin`. Si los tenías instalados con ese nombre, quita el marketplace antiguo y añade el nuevo; tus conexiones y ajustes de `~/.fs-claude.json` se siguen leyendo sin hacer nada.

En Claude Code:

```text
/plugin marketplace remove fs-claude-plugin
/plugin marketplace add FacturaScripts/fs-ai-plugin
```

En Codex:

```bash
codex plugin marketplace remove fs-claude-plugin
codex plugin marketplace add /ruta/local/fs-ai-plugin
```

Después vuelve a instalar `fs-dev`, `fs-user`, `fs-mcp` y/o `fs-forja` desde el marketplace `fs-ai-plugin` y abre una sesión o un hilo nuevo.

## Plugins incluidos

- [fs-dev — Desarrollo](fs-dev/README.md)
- [fs-user — Uso del ERP](fs-user/README.md)
- [fs-mcp — Servidor MCP del ERP](fs-mcp/README.md)
- [fs-forja — Servidor MCP de la forja](fs-forja/README.md)

## Configuración compartida

Los cuatro plugins usan `~/.fs-ai.json` (si solo existe el antiguo `~/.fs-claude.json`, siguen usando ese). Incluye conexiones, opciones de automatización y `settings.localModulesPath`. fs-mcp usa las conexiones a instalaciones del ERP y fs-forja, solo las de tipo `forja` (token de autor de facturascripts.com); ninguno de los dos usa ni modifica las del otro. Los módulos privados permanecen fuera de este repositorio y se cargan dinámicamente desde esa ruta.

## Requisitos

- Claude Code o Codex con soporte de plugins
- FacturaScripts con la API REST habilitada para `fs-mcp`
- Node.js 18 o superior para ejecutar los servidores MCP de `fs-mcp` y `fs-forja`
- Acceso a la API de autor de la forja para `fs-forja`
- Python 3 para las automatizaciones de `fs-dev`

## Licencia

MIT — [FacturaScripts](https://facturascripts.com)
