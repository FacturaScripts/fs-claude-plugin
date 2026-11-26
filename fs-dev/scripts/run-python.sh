#!/bin/sh
# Ejecuta un script de Python 3 con el intérprete disponible en Linux, macOS y Windows (Git Bash).
#
# Lo usan los hooks de fs-dev y fs-user en el campo `command`, que Claude Code ejecuta con
# `sh -c` en Linux y macOS y con Git Bash en Windows, y Codex con `$SHELL -lc` en Linux y
# macOS. En Windows, Codex ejecuta en su lugar `commandWindows` con cmd.exe.
#
# Orden de búsqueda:
# - Linux y macOS: `python3` y, si no existe, `python`.
# - Windows (Git Bash, MSYS o Cygwin): el lanzador `py -3`, `python` y `python3`. Se prueba
#   primero `py` porque el instalador de python.org lo instala siempre, aunque no añada
#   Python al PATH, y porque `python3` suele ser el alias de la Microsoft Store, que no
#   ejecuta nada si Python no está instalado desde la tienda.
#
# Sin ningún intérprete avisa por stderr y sale con 0: un hook nunca debe bloquear al host.
#
# Uso: sh run-python.sh <script.py> [argumentos...]
#
# @author Esteban Sánchez Martínez <esteban@factura.city>

case "$(uname -s 2>/dev/null)" in
    MINGW* | MSYS* | CYGWIN*)
        if command -v py >/dev/null 2>&1; then
            exec py -3 "$@"
        fi
        candidates="python python3"
        ;;
    *)
        candidates="python3 python"
        ;;
esac

for candidate in $candidates; do
    if command -v "$candidate" >/dev/null 2>&1; then
        exec "$candidate" "$@"
    fi
done

echo "fs-ai: no se encuentra Python 3 (python3, python o py); instálalo para usar los hooks de este plugin." >&2
exit 0
