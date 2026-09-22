---
name: verificar-min-version
description: Comprueba si un plugin de FacturaScripts cumple el min_version de su facturascripts.ini y calcula la versión mínima real del core según las clases, métodos y puntos de extensión que usa.
---

# Verificación del min_version de un plugin

## Flujo

1. Lee el `facturascripts.ini` del plugin y anota `min_version`, `min_php` y `require`.
2. Localiza un clon git del core con todas sus etiquetas. Orden de búsqueda del script: `--core`, `FS_CORE_PATH`, `settings.corePath` de `~/.fs-claude.json`, la raíz de la instalación cuando el plugin vive en `Plugins/`, y el directorio actual. Si no hay ninguno, pide clonar `https://github.com/NeoRazorX/facturascripts.git` y detente: sin historial no se puede datar ningún símbolo.
3. Ejecuta el script de auditoría:

   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/scripts/check-min-version.py" <ruta_plugin> --core <ruta_core>
   ```

4. Lee completo el perfil [`../../agents/compatibility-auditor.md`](../../agents/compatibility-auditor.md) para interpretar el informe y verificar a mano los símbolos de confianza media o baja.
5. Concluye con una recomendación única: el `min_version` correcto, el símbolo concreto que lo determina y el archivo donde aparece.

## Opciones del script

| Opción | Uso |
| --- | --- |
| `--json` | Informe completo para procesar símbolo a símbolo |
| `--include-tests` | Analiza también `Test/`, excluido por defecto |
| `--min-confidence alta` | Deja solo clases, llamadas estáticas y pipes |
| `--plugins-dir` | Directorio `Plugins/` para atribuir los símbolos de otros plugins |
| `--workers N` | Ajusta las consultas simultáneas a git |

Código de salida: `0` cumple, `1` incumple, `2` error de configuración.

## Reglas de versión que debes aplicar

- Las versiones se comparan como decimales, igual que `Kernel::version()`: `2025.11` es **anterior** a `2025.2`. No uses `sort -V` ni criterios semver.
- El core rechaza cualquier plugin con `min_version` inferior a 2025, aunque el código sea compatible (`Core/Internal/Plugin.php`).
- Un `min_version` demasiado alto es un error tanto como uno demasiado bajo: impide instalar el plugin donde funcionaría.

## Verificación manual de un símbolo dudoso

```bash
# ¿existe en esa versión?
git -C <core> grep -n 'function <metodo>(' <tag> -- Core/

# ¿en qué commit se añadió?
git -C <core> log --reverse --oneline -S'function <metodo>(' -- Core/<ruta>
```

## Estados del informe

`ok` y `método añadido` no requieren acción. `posterior` obliga a subir el `min_version`.
`eliminado` avisa de que el plugin se romperá al actualizar el core. `aportado por plugin`
y `aportado por vendor` indican que el símbolo no es del core. `no encontrado` exige
revisión manual, y si es un `pipe('X')` significa que el core no declara ese punto de
extensión y nada del plugin invoca el método: esa extensión seguramente nunca se ejecuta.

## Límites del análisis

El análisis es estático y solo audita PHP: no resuelve tipos, no comprueba las funciones ni los bloques de plantilla que usan los Twig, ni los XMLView, ni el JavaScript, y no audita los plugins declarados en `require`. Las plantillas solo se leen para saber qué métodos invoca el plugin.

Por eso un `min_version` más alto que el calculado puede estar justificado por un cambio del core que esta herramienta no ve. Declara siempre estas limitaciones en la conclusión y marca como dudosos los símbolos que no hayas verificado a mano.

## Ejecución portable

En Claude Code puedes delegar la interpretación al agente `fs-dev:compatibility-auditor`. En Codex aplica el perfil directamente. Si no hay delegación disponible, completa el flujo tú mismo.

Esta skill solo diagnostica: no modifiques el `facturascripts.ini` salvo petición expresa del usuario.
