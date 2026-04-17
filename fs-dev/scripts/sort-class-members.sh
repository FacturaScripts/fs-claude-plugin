#!/bin/bash
# Hook PostToolUse: ordena los miembros de clases PHP de FacturaScripts
# cuando se crea o edita un archivo .php.
#
# Orden aplicado dentro de cada clase:
#   1. use (traits)                  - A-Z
#   2. const                         - A-Z
#   3. variables public              - A-Z
#   4. variables protected/private   - A-Z (agrupadas)
#   5. métodos public                - A-Z
#   6. métodos protected/private     - A-Z (agrupados)
#
# Solo actúa sobre archivos .php que contengan 'namespace FacturaScripts\'
# (core o plugins del ERP). El filtro final lo aplica el propio script Python.
#
# Recibe por stdin un JSON con:
#   .tool_name            → "Write" o "Edit"
#   .tool_input.file_path → ruta absoluta del archivo modificado

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Solo procesar las herramientas Write y Edit
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
    exit 0
fi

# Solo procesar archivos PHP
if [[ ! "$FILE_PATH" =~ \.php$ ]]; then
    exit 0
fi

# Verificar que el archivo existe
if [[ ! -f "$FILE_PATH" ]]; then
    exit 0
fi

# Verificar que es un archivo de FacturaScripts (namespace FacturaScripts\)
if ! grep -q 'namespace FacturaScripts\\' "$FILE_PATH" 2>/dev/null; then
    exit 0
fi

python3 "${CLAUDE_PLUGIN_ROOT}/scripts/sort-class-members.py" "$FILE_PATH"

exit 0
