#!/usr/bin/env python3
"""Procesa de forma secuencial los archivos modificados por Claude Code o Codex.

Hook ``PostToolUse`` compartido por ambos hosts. Normaliza su entrada:

- Claude Code: herramientas ``Write`` y ``Edit`` con ``tool_input.file_path``.
  Un ``Write`` solo se considera archivo nuevo si ``tool_response.type`` es
  ``"create"``; si falta ese dato, el archivo se trata como existente.
- Codex: herramienta ``apply_patch`` con el parche en ``tool_input.command``
  (texto o lista de fragmentos, que se unen con saltos de línea). Se procesan
  los bloques ``*** Add File:``, ``*** Update File:`` y ``*** Move to:``; los
  ``*** Delete File:`` se ignoran.

Para cada archivo PHP, XML o Twig primero actualiza el copyright y después
ordena los miembros de las clases PHP, para evitar escrituras concurrentes
sobre el mismo archivo.

Salida:

- stdout: solo si algún archivo ha cambiado, un JSON
  ``{"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": ...}}``
  que avisa al modelo de que debe releerlo antes de volver a editarlo. Ambos
  hosts admiten ``additionalContext`` en ``PostToolUse``.
- stderr: avisos y errores de los transformadores.
- Código de salida: siempre 0. Un error nunca bloquea la sesión; Codex no
  documenta el significado de un código distinto de 0 y 2 en ``PostToolUse``,
  así que los fallos se comunican solo por stderr.
"""

from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

# Extensiones de los archivos que se procesan.
SUPPORTED_SUFFIXES = ('.php', '.xml', '.twig')

# Tiempo máximo de cada transformador, por debajo del timeout de 30 s del hook.
TRANSFORM_TIMEOUT = 20


@dataclass(frozen=True)
class ModifiedFile:
    """Representa un archivo afectado por la herramienta de edición.

    Attributes:
        path: Ruta absoluta del archivo.
        is_new: ``True`` si la herramienta acaba de crear el archivo.
    """

    path: Path
    is_new: bool = False


def _absolute_path(raw_path: str, cwd: Path) -> Path:
    """Convierte una ruta de la entrada del hook en una ruta absoluta.

    Args:
        raw_path: Ruta tal como la indica la herramienta.
        cwd: Directorio de trabajo de la sesión.

    Returns:
        La ruta absoluta, resuelta respecto a ``cwd`` si era relativa.
    """
    path = Path(raw_path).expanduser()
    return path if path.is_absolute() else cwd / path


def _parse_apply_patch(command: str, cwd: Path) -> List[ModifiedFile]:
    """Extrae los archivos creados, actualizados o movidos de un parche de Codex.

    Args:
        command: Texto del parche.
        cwd: Directorio de trabajo respecto al que se resuelven las rutas.

    Returns:
        Los archivos en el orden en que aparecen en el parche.
    """
    files: List[ModifiedFile] = []
    pending_is_new = False

    for line in command.splitlines():
        if line.startswith('*** Add File: '):
            files.append(ModifiedFile(_absolute_path(line[14:].strip(), cwd), True))
            pending_is_new = True
        elif line.startswith('*** Update File: '):
            files.append(ModifiedFile(_absolute_path(line[17:].strip(), cwd)))
            pending_is_new = False
        elif line.startswith('*** Move to: '):
            files.append(ModifiedFile(_absolute_path(line[13:].strip(), cwd), pending_is_new))

    return files


def _patch_text(command: Any) -> str:
    """Devuelve el parche como texto, aceptando una cadena o una lista de fragmentos.

    Args:
        command: Valor de ``tool_input.command``.

    Returns:
        El texto del parche, o una cadena vacía si no hay.
    """
    if isinstance(command, (list, tuple)):
        return '\n'.join(str(part) for part in command)
    return str(command or '')


def _is_created(tool_response: Any) -> bool:
    """Indica si la respuesta de ``Write`` declara que el archivo se ha creado.

    Args:
        tool_response: Valor de ``tool_response`` de la entrada del hook.

    Returns:
        ``True`` solo si ``tool_response.type`` es ``"create"``.
    """
    return isinstance(tool_response, dict) and tool_response.get('type') == 'create'


def modified_files(payload: Dict[str, Any]) -> List[ModifiedFile]:
    """Normaliza la entrada del hook y devuelve archivos únicos en orden estable.

    Args:
        payload: Objeto JSON recibido por stdin.

    Returns:
        Los archivos afectados, con rutas absolutas resueltas y sin duplicados.
    """
    cwd = Path(str(payload.get('cwd') or Path.cwd())).expanduser()
    tool_name = str(payload.get('tool_name') or '')
    tool_input = payload.get('tool_input')
    if not isinstance(tool_input, dict):
        return []

    candidates: Iterable[ModifiedFile]
    if tool_name in {'Write', 'Edit'}:
        file_path = tool_input.get('file_path')
        is_new = tool_name == 'Write' and _is_created(payload.get('tool_response'))
        candidates = [ModifiedFile(_absolute_path(str(file_path), cwd), is_new)] if file_path else []
    elif tool_name == 'apply_patch':
        candidates = _parse_apply_patch(_patch_text(tool_input.get('command')), cwd)
    else:
        candidates = []

    unique: Dict[Path, ModifiedFile] = {}
    for item in candidates:
        resolved = item.path.resolve(strict=False)
        previous = unique.get(resolved)
        unique[resolved] = ModifiedFile(resolved, item.is_new or (previous.is_new if previous else False))
    return list(unique.values())


def _run(script: Path, *args: str) -> int:
    """Ejecuta un transformador y reenvía toda su salida a stderr.

    La salida estándar del hook se reserva para el JSON que lee el host.

    Args:
        script: Ruta del script transformador.
        *args: Argumentos del script.

    Returns:
        El código de salida del transformador, o 1 si no se pudo ejecutar.
    """
    try:
        result = subprocess.run(
            [sys.executable, str(script), *args],
            check=False, capture_output=True, text=True, timeout=TRANSFORM_TIMEOUT,
        )
    except (OSError, subprocess.SubprocessError) as error:
        print(f'fs-dev: no se pudo ejecutar {script.name}: {error}', file=sys.stderr)
        return 1

    for output in (result.stdout, result.stderr):
        if output:
            sys.stderr.write(output if output.endswith('\n') else output + '\n')
    return result.returncode


def _digest(path: Path) -> Optional[str]:
    """Calcula la huella del contenido de un archivo.

    Args:
        path: Ruta del archivo.

    Returns:
        El SHA-256 del contenido, o ``None`` si no se puede leer.
    """
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError:
        return None


def process_file(item: ModifiedFile, scripts_dir: Path) -> int:
    """Aplica en orden los transformadores compatibles al archivo indicado.

    Args:
        item: Archivo modificado por la herramienta.
        scripts_dir: Directorio donde están los transformadores.

    Returns:
        0 si todo ha ido bien o el archivo no aplica, o el código de error del
        primer transformador que haya fallado.
    """
    file_path = item.path
    if not file_path.is_file() or not file_path.name.endswith(SUPPORTED_SUFFIXES):
        return 0

    copyright_args = [str(file_path), str(datetime.now().year)]
    if item.is_new:
        copyright_args.append('--new')

    result = _run(scripts_dir / 'update-copyright.py', *copyright_args)
    if result != 0:
        return result

    if file_path.suffix == '.php':
        return _run(scripts_dir / 'sort-class-members.py', str(file_path))
    return 0


def _display_path(path: Path, cwd: Path) -> str:
    """Devuelve la ruta relativa al directorio de trabajo cuando es posible.

    Args:
        path: Ruta absoluta del archivo.
        cwd: Directorio de trabajo de la sesión.

    Returns:
        La ruta relativa, o la absoluta si el archivo está fuera de ``cwd``.
    """
    try:
        return str(path.relative_to(cwd.resolve()))
    except ValueError:
        return str(path)


def build_output(changed: List[Path], cwd: Path) -> Dict[str, Any]:
    """Construye el JSON que avisa al modelo de los archivos modificados por el hook.

    Args:
        changed: Archivos cuyo contenido ha cambiado.
        cwd: Directorio de trabajo de la sesión.

    Returns:
        Objeto con ``hookSpecificOutput.additionalContext`` para ``PostToolUse``.
    """
    names = ', '.join(_display_path(path, cwd) for path in changed)
    return {
        'hookSpecificOutput': {
            'hookEventName': 'PostToolUse',
            'additionalContext': (
                f'El hook de fs-dev ha modificado {names} tras la edición (año de copyright y/o '
                'orden de los miembros de la clase). Relee el archivo antes de volver a editarlo.'
            ),
        },
    }


def run(payload: Dict[str, Any], scripts_dir: Path) -> Optional[Dict[str, Any]]:
    """Procesa todos los archivos del payload y prepara la respuesta para el host.

    Args:
        payload: Objeto JSON recibido por stdin.
        scripts_dir: Directorio donde están los transformadores.

    Returns:
        El JSON que debe escribirse en stdout, o ``None`` si nada ha cambiado.
    """
    changed: List[Path] = []
    for item in modified_files(payload):
        before = _digest(item.path)
        result = process_file(item, scripts_dir)
        if result != 0:
            print(f'fs-dev: el hook de edición falló en {item.path} (código {result}).', file=sys.stderr)
        after = _digest(item.path)
        if before is not None and after is not None and before != after:
            changed.append(item.path)

    if not changed:
        return None
    cwd = Path(str(payload.get('cwd') or Path.cwd())).expanduser()
    return build_output(changed, cwd)


def main() -> int:
    """Lee la entrada estándar del hook y procesa todos los archivos detectados.

    Returns:
        Siempre 0: los errores se notifican por stderr sin bloquear al host.
    """
    try:
        try:
            payload = json.load(sys.stdin)
        except (ValueError, TypeError):
            return 0
        if not isinstance(payload, dict):
            return 0

        output = run(payload, Path(__file__).resolve().parent)
        if output is not None:
            sys.stdout.write(json.dumps(output, ensure_ascii=False) + '\n')
    except Exception as error:  # noqa: BLE001 - el hook nunca debe interrumpir al host.
        print(f'fs-dev: error inesperado en el hook de edición: {error!r}', file=sys.stderr)
    return 0


if __name__ == '__main__':
    sys.exit(main())
