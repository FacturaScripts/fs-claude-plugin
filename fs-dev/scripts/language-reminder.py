#!/usr/bin/env python3
"""Recuerda al modelo, en cada mensaje del usuario, el idioma en el que debe responder.

Hook ``UserPromptSubmit`` compartido por Claude Code y Codex. Lee el idioma de
``settings.language`` en ``~/.fs-claude.json``:

- Sin la clave, con ``null`` o con ``true``: español (``es``).
- Un código de idioma (``en``, ``ca``, ``pt-BR``...) o un nombre (``inglés``,
  ``English``...): el aviso se escribe en ese idioma si hay plantilla propia y,
  si no, en inglés indicando el idioma pedido.
- ``false``, ``"off"``, ``"none"`` o una cadena vacía: el hook no hace nada.

Si el archivo no existe o no es JSON válido se usa el español por defecto.

Salida:

- stdout: un JSON
  ``{"hookSpecificOutput": {"hookEventName": "UserPromptSubmit", "additionalContext": ...}}``
  con el aviso, o nada si el recordatorio está desactivado. Ambos hosts añaden
  ``additionalContext`` al contexto del modelo.
- Código de salida: siempre 0. Un error nunca bloquea el mensaje del usuario.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, Optional

# Idioma que se usa cuando la configuración no indica otro.
DEFAULT_LANGUAGE = 'es'

# Valores de settings.language que desactivan el recordatorio.
DISABLED_VALUES = {'', 'off', 'none', 'false', 'no', 'disabled'}

# Avisos redactados en el propio idioma, porque el modelo los sigue mejor así.
TEMPLATES: Dict[str, str] = {
    'es': (
        'Preferencia de idioma (fs-dev): responde SIEMPRE en español, incluido todo el texto visible '
        'para el usuario (mensajes de progreso entre herramientas, resúmenes, preguntas, avisos y '
        'descripciones de comandos), aunque el contexto, las herramientas o las respuestas anteriores '
        'estén en otro idioma. Mantén en su forma original el código, los identificadores, los comandos '
        'y los términos técnicos.'
    ),
    'en': (
        'Language preference (fs-dev): ALWAYS respond in English, including all text visible to the '
        'user (progress messages between tool calls, summaries, questions, warnings and command '
        'descriptions), even if the context, the tools or previous replies are in another language. '
        'Keep code, identifiers, commands and technical terms in their original form.'
    ),
    'ca': (
        "Preferència d'idioma (fs-dev): respon SEMPRE en català, inclòs tot el text visible per a "
        "l'usuari (missatges de progrés entre eines, resums, preguntes, avisos i descripcions "
        "d'ordres), encara que el context, les eines o les respostes anteriors siguin en un altre "
        "idioma. Mantén en la seva forma original el codi, els identificadors, les ordres i els termes "
        'tècnics.'
    ),
    'gl': (
        'Preferencia de idioma (fs-dev): responde SEMPRE en galego, incluído todo o texto visible para '
        'o usuario (mensaxes de progreso entre ferramentas, resumos, preguntas, avisos e descricións de '
        'comandos), aínda que o contexto, as ferramentas ou as respostas anteriores estean noutro '
        'idioma. Mantén na súa forma orixinal o código, os identificadores, os comandos e os termos '
        'técnicos.'
    ),
    'pt': (
        'Preferência de idioma (fs-dev): responda SEMPRE em português, incluindo todo o texto visível '
        'para o utilizador (mensagens de progresso entre ferramentas, resumos, perguntas, avisos e '
        'descrições de comandos), mesmo que o contexto, as ferramentas ou as respostas anteriores '
        'estejam noutro idioma. Mantenha na forma original o código, os identificadores, os comandos e '
        'os termos técnicos.'
    ),
    'fr': (
        "Préférence de langue (fs-dev) : réponds TOUJOURS en français, y compris tout le texte visible "
        "par l'utilisateur (messages de progression entre les outils, résumés, questions, "
        "avertissements et descriptions des commandes), même si le contexte, les outils ou les réponses "
        "précédentes sont dans une autre langue. Conserve sous leur forme d'origine le code, les "
        'identifiants, les commandes et les termes techniques.'
    ),
    'it': (
        "Preferenza di lingua (fs-dev): rispondi SEMPRE in italiano, compreso tutto il testo visibile "
        "all'utente (messaggi di avanzamento tra gli strumenti, riepiloghi, domande, avvisi e "
        'descrizioni dei comandi), anche se il contesto, gli strumenti o le risposte precedenti sono in '
        "un'altra lingua. Mantieni nella forma originale il codice, gli identificatori, i comandi e i "
        'termini tecnici.'
    ),
    'de': (
        'Sprachpräferenz (fs-dev): Antworte IMMER auf Deutsch, einschließlich aller für den Benutzer '
        'sichtbaren Texte (Fortschrittsmeldungen zwischen Werkzeugaufrufen, Zusammenfassungen, Fragen, '
        'Hinweise und Befehlsbeschreibungen), auch wenn der Kontext, die Werkzeuge oder frühere '
        'Antworten in einer anderen Sprache sind. Belasse Code, Bezeichner, Befehle und Fachbegriffe in '
        'ihrer ursprünglichen Form.'
    ),
}

# Nombres de idioma aceptados como alternativa al código, en minúsculas.
ALIASES: Dict[str, str] = {
    'español': 'es', 'espanol': 'es', 'castellano': 'es', 'spanish': 'es',
    'inglés': 'en', 'ingles': 'en', 'english': 'en',
    'catalán': 'ca', 'catalan': 'ca', 'català': 'ca',
    'gallego': 'gl', 'galician': 'gl', 'galego': 'gl',
    'portugués': 'pt', 'portugues': 'pt', 'portuguese': 'pt', 'português': 'pt',
    'francés': 'fr', 'frances': 'fr', 'french': 'fr', 'français': 'fr',
    'italiano': 'it', 'italian': 'it',
    'alemán': 'de', 'aleman': 'de', 'german': 'de', 'deutsch': 'de',
    'euskera': 'eu', 'basque': 'eu', 'euskara': 'eu',
}

# Nombre en inglés de los idiomas reconocidos sin plantilla propia.
ENGLISH_NAMES: Dict[str, str] = {
    'eu': 'Basque (euskara)',
}


def read_language_setting(config_file: Path) -> Any:
    """Lee el valor de ``settings.language`` del archivo de configuración compartido.

    Args:
        config_file: Ruta de ``~/.fs-claude.json``.

    Returns:
        El valor configurado, o ``None`` si falta la clave o no se puede leer el archivo.
    """
    try:
        config = json.loads(config_file.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return None
    settings = config.get('settings') if isinstance(config, dict) else None
    return settings.get('language') if isinstance(settings, dict) else None


def resolve_language(value: Any) -> Optional[str]:
    """Normaliza el valor configurado a un código de idioma o a un nombre libre.

    Args:
        value: Valor de ``settings.language``.

    Returns:
        El código de idioma (``es``, ``en``...), el nombre tal cual si no se
        reconoce, o ``None`` si el recordatorio está desactivado.
    """
    if value is None or value is True:
        return DEFAULT_LANGUAGE
    if value is False:
        return None
    if not isinstance(value, str):
        return DEFAULT_LANGUAGE

    text = value.strip()
    lowered = text.lower()
    if lowered in DISABLED_VALUES:
        return None
    if lowered in ALIASES:
        return ALIASES[lowered]

    # Códigos regionales como pt-BR o es_ES: basta con el idioma principal.
    primary = lowered.replace('_', '-').split('-')[0]
    if primary in TEMPLATES or primary in ENGLISH_NAMES:
        return primary
    return text


def build_message(language: str) -> str:
    """Construye el aviso de idioma.

    Args:
        language: Código devuelto por :func:`resolve_language` o nombre libre.

    Returns:
        El aviso en el propio idioma o, si no hay plantilla, en inglés indicando el idioma.
    """
    if language in TEMPLATES:
        return TEMPLATES[language]

    name = ENGLISH_NAMES.get(language, language)
    return (
        f'Language preference (fs-dev): ALWAYS respond in {name}, including all text visible to the '
        'user (progress messages between tool calls, summaries, questions, warnings and command '
        'descriptions), even if the context, the tools or previous replies are in another language. '
        'Keep code, identifiers, commands and technical terms in their original form.'
    )


def build_output(config_file: Path) -> Optional[Dict[str, Any]]:
    """Prepara la respuesta del hook según la configuración.

    Args:
        config_file: Ruta de ``~/.fs-claude.json``.

    Returns:
        El JSON con ``additionalContext``, o ``None`` si el recordatorio está desactivado.
    """
    language = resolve_language(read_language_setting(config_file))
    if language is None:
        return None
    return {
        'hookSpecificOutput': {
            'hookEventName': 'UserPromptSubmit',
            'additionalContext': build_message(language),
        },
    }


def main() -> int:
    """Escribe el aviso de idioma en stdout.

    La entrada estándar del host se lee y se descarta: el aviso es el mismo
    para cualquier mensaje, pero vaciarla evita que el host reciba un error al
    escribir en una tubería cerrada.

    Returns:
        Siempre 0: los errores se notifican por stderr sin bloquear al host.
    """
    try:
        try:
            sys.stdin.read()
        except (OSError, ValueError):
            pass
        output = build_output(Path.home() / '.fs-claude.json')
        if output is not None:
            sys.stdout.write(json.dumps(output, ensure_ascii=False) + '\n')
    except Exception as error:  # noqa: BLE001 - el hook nunca debe interrumpir al host.
        print(f'fs-dev: error inesperado en el recordatorio de idioma: {error!r}', file=sys.stderr)
    return 0


if __name__ == '__main__':
    sys.exit(main())
