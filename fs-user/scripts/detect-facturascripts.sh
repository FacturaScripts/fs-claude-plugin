#!/bin/bash
# Detecta si el directorio de trabajo actual pertenece a un proyecto FacturaScripts ERP
# o a uno de sus plugins. Si lo detecta, inyecta contexto en la sesión de Claude para
# que use automáticamente las skills del plugin fs-user.

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
- Usa SIEMPRE las skills y agentes del plugin fs-user para dudas de usuario, configuración, uso de herramientas, etc.
- Usa SIEMPRE el plugin fs-mcp para obtener datos de una instancia de FacturaScripts.
EOF
fi

exit 0
