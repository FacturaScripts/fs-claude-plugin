#!/bin/bash
# Detecta si el directorio de trabajo actual está dentro de una instalación de FacturaScripts
# ERP, por ejemplo en la raíz del core o en uno de sus plugins bajo Plugins/. Un repositorio
# de plugin situado fuera de una instalación no se detecta. Se ejecuta en SessionStart y, si
# detecta la instalación, imprime en stdout el contexto que el host añade a la sesión para
# que use automáticamente las skills del plugin fs-dev, junto con la regla del árbol de
# documentación (AGENTS.md y Doc/) que pueden tener el core y cada plugin y las rutas de la que
# existe en el plugin actual y en el core.

is_facturascripts_root() {
    local dir="$1"

    # Detecta por composer.json con el nombre del proyecto FacturaScripts
    if [ -f "$dir/composer.json" ] && grep -q '"name":.*"facturascripts/facturascripts"' "$dir/composer.json" 2>/dev/null; then
        return 0
    fi

    # Detecta por estructura de directorios característica del core
    if [ -d "$dir/Core" ] && [ -d "$dir/Plugins" ] && [ -d "$dir/Dinamic" ]; then
        return 0
    fi

    return 1
}

# Añade a $docs las rutas de AGENTS.md y Doc/Context/README.md que existan en una carpeta
add_docs() {
    local base="$1" label="$2" file
    for file in AGENTS.md Doc/Context/README.md; do
        if [ -f "$base/$file" ]; then
            docs="${docs}  - ${label}: ${base}/${file}"$'\n'
        fi
    done
}

# Busca desde el directorio actual hacia arriba en el árbol de directorios
dir="$(pwd)"
found=false

while [ -n "$dir" ] && [ "$dir" != "/" ]; do
    if is_facturascripts_root "$dir"; then
        found=true
        break
    fi
    parent="$(dirname "$dir")"
    if [ "$parent" = "$dir" ]; then
        break
    fi
    dir="$parent"
done

if [ "$found" = true ]; then
    cat << 'EOF'
=== CONTEXTO: Proyecto FacturaScripts detectado ===
Estás trabajando en FacturaScripts ERP o uno de sus plugins.
- Usa SIEMPRE las skills del plugin fs-dev para tareas de programación y, cuando estén disponibles, sus agentes o perfiles especializados.
- Usa SIEMPRE el plugin fs-mcp para obtener datos de una instancia de FacturaScripts.
- TRADUCCIONES: añade claves de traducción ÚNICAMENTE al archivo `Translation/es_ES.json`. Nunca modifiques otros archivos de idioma (en_EN.json, ca_ES.json, de_DE.json, etc.).
- DOCUMENTACIÓN: el core y cada plugin de `Plugins/<Plugin>/` pueden tener su propio árbol de documentación: `AGENTS.md` (qué es y sus reglas) y `Doc/` (`User`, `Dev`, `Context` con su índice `README.md`, `Assets` y `forja.json`). Antes de cambiar el core o un plugin, lee su `AGENTS.md` y el índice `Doc/Context/README.md` si existen, y abre solo lo que necesites; si un cambio del core afecta a un plugin, mira también la documentación de ese plugin. Actualiza esa documentación en el mismo trabajo que cambia el código; para crear o completar la estructura usa la skill `fs-dev:crear-documentacion` y, para escribir una página de `Doc/User` o `Doc/Dev`, `fs-dev:docs-writer`.
EOF

    # plugin actual: la primera carpeta con facturascripts.ini entre el directorio de trabajo y la raíz
    docs=""
    current="$(pwd)"
    while [ -n "$current" ] && [ "$current" != "$dir" ] && [ "$current" != "/" ]; do
        if [ -f "$current/facturascripts.ini" ]; then
            add_docs "$current" "Plugin $(basename "$current")"
            break
        fi
        current="$(dirname "$current")"
    done
    add_docs "$dir" "Core"

    if [ -n "$docs" ]; then
        printf 'Documentación existente que debes consultar:\n%s' "$docs"
    fi
fi

exit 0
