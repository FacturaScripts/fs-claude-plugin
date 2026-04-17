#!/bin/bash
# Hook PostToolUse: actualiza el año de copyright en archivos PHP, XML y Twig
# de FacturaScripts cuando son creados o modificados por las herramientas
# Write o Edit de Claude Code.
#
# Recibe por stdin un JSON con:
#   .tool_name       → "Write" o "Edit"
#   .tool_input.file_path → ruta absoluta del archivo modificado

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Solo procesar las herramientas Write y Edit
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
    exit 0
fi

# Solo procesar extensiones de FacturaScripts: .php, .xml, .html.twig
if [[ ! "$FILE_PATH" =~ \.(php|xml|html\.twig)$ ]]; then
    exit 0
fi

# Verificar que el archivo existe
if [[ ! -f "$FILE_PATH" ]]; then
    exit 0
fi

# Verificar que el archivo contiene una línea de copyright
if ! grep -q "Copyright (C)" "$FILE_PATH" 2>/dev/null; then
    exit 0
fi

CURRENT_YEAR=$(date +%Y)

python3 "${CLAUDE_PLUGIN_ROOT}/scripts/update-copyright.py" "$FILE_PATH" "$CURRENT_YEAR"

exit 0
