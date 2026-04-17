#!/bin/bash

# Script para detectar si FacturaScripts está conectado vía fs-mcp
# Busca el archivo connections.json de fs-mcp en ~/.claude/plugins/data/

set -e

CONNECTIONS_FILE="$HOME/.claude/plugins/data/fs-mcp/connections.json"

if [ -f "$CONNECTIONS_FILE" ]; then
    # El archivo existe, intentar leer la conexión por defecto
    DEFAULT_CONNECTION=$(grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONNECTIONS_FILE" 2>/dev/null | cut -d'"' -f4 || echo "")

    if [ -n "$DEFAULT_CONNECTION" ]; then
        echo "✓ FacturaScripts conectado: $DEFAULT_CONNECTION"
        exit 0
    else
        # El archivo existe pero no hay conexión por defecto
        echo "ℹ FacturaScripts no tiene conexión configurada por defecto. Usa 'fs-mcp:add-connection' para crear una."
        exit 0
    fi
else
    # El archivo no existe
    echo "ℹ Para conectar con FacturaScripts, instala fs-mcp y configura una conexión con 'fs-mcp:add-connection'"
    exit 0
fi
