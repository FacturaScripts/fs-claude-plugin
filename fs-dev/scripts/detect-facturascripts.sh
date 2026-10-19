#!/bin/bash
# Detecta si el directorio de trabajo actual está dentro de una instalación de FacturaScripts
# ERP, por ejemplo en la raíz del core o en uno de sus plugins bajo Plugins/. Un repositorio
# de plugin situado fuera de una instalación no se detecta. Se ejecuta en SessionStart y, si
# detecta la instalación, imprime en stdout el contexto que el host añade a la sesión para
# que use automáticamente las skills del plugin fs-dev.

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
EOF
fi

exit 0
