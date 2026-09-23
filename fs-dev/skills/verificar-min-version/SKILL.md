---
name: verificar-min-version
description: Audita un plugin de FacturaScripts antes de instalarlo o publicarlo; comprueba si cumple el min_version de su facturascripts.ini y revisa su seguridad, como ejecución de comandos, código ofuscado o envío de datos a URLs externas.
---

# Auditoría de compatibilidad y seguridad de un plugin

La auditoría tiene dos partes independientes: la **compatibilidad** con el core (`min_version`) y la **seguridad** (qué hace el plugin en el servidor y en el navegador). Haz las dos salvo que el usuario pida solo una. La de seguridad no necesita el clon del core: si falta, hazla igualmente.

## Flujo

1. Lee el `facturascripts.ini` del plugin y anota `min_version`, `min_php` y `require`.
2. Localiza un clon git del core con todas sus etiquetas. Orden de búsqueda del script: `--core`, `FS_CORE_PATH`, `settings.corePath` de `~/.fs-claude.json`, la raíz de la instalación cuando el plugin vive en `Plugins/`, y el directorio actual. Si no hay ninguno, pide clonar `https://github.com/NeoRazorX/facturascripts.git` y detente: sin historial no se puede datar ningún símbolo.
3. Ejecuta el script de auditoría:

   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/scripts/check-min-version.py" <ruta_plugin> --core <ruta_core>
   ```

4. Lee completo el perfil [`../../agents/compatibility-auditor.md`](../../agents/compatibility-auditor.md) para interpretar el informe y verificar a mano los símbolos de confianza media o baja.
5. Ejecuta la auditoría de seguridad:

   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/scripts/check-security.py" <ruta_plugin>
   ```

6. Revisa en el código cada hallazgo de severidad alta o media siguiendo el apartado «Cómo revisar los hallazgos» del perfil, y clasifícalo como justificado, a vigilar o sospechoso.
7. Concluye con dos apartados:
   - **Compatibilidad**: el `min_version` correcto, el símbolo concreto que lo determina y el archivo donde aparece.
   - **Seguridad**: los hallazgos revisados con su archivo, contexto de ejecución, destino y clasificación; los dominios externos; y lo que ha quedado sin revisar.

## Opciones de `check-min-version.py`

| Opción | Uso |
| --- | --- |
| `--json` | Informe completo para procesar símbolo a símbolo |
| `--include-tests` | Analiza también `Test/`, excluido por defecto |
| `--min-confidence alta` | Deja solo clases, llamadas estáticas y pipes |
| `--plugins-dir` | Directorio `Plugins/` para atribuir los símbolos de otros plugins |
| `--workers N` | Ajusta las consultas simultáneas a git |

Código de salida: `0` cumple, `1` incumple, `2` error de configuración.

## Opciones de `check-security.py`

| Opción | Uso |
| --- | --- |
| `--json` | Informe completo con hallazgos, notas y dominios |
| `--min-severity alta\|media\|baja\|info` | Oculta los hallazgos de menor severidad |
| `--include-tests` | Analiza también `Test/` |
| `--include-vendor` | Analiza las librerías de `vendor/`, que por defecto solo se cuentan |

Código de salida: `0` sin hallazgos de severidad media o alta, `1` con hallazgos que revisar, `2` ruta no válida.

## Qué busca la auditoría de seguridad

- **Ejecución en el servidor**: comandos del sistema (`exec`, `shell_exec`, `system`, comillas invertidas…), `eval`, `include` de rutas calculadas y código ofuscado.
- **Salida de datos**: conexiones de red (cURL, sockets, `Http::`, SOAP, `file_get_contents` de URLs, `fetch` o `sendBeacon` a dominios externos), scripts cargados desde CDN y el cruce entre lectura de datos sensibles y conexiones en el mismo archivo.
- **Datos sensibles**: credenciales de la base de datos, `config.php`, contraseñas, `logkey`, claves 2FA y `ApiKey`.
- **Persistencia y accesos**: escritura de `.php`, `.htaccess` o `config.php`, cambios de permisos, controladores sin autenticación, concesión de `admin`, credenciales escritas en el código y archivos PHP dentro de `Assets/`.

Cada hallazgo indica cuándo se ejecuta (`Init::update()` al instalar, `Init::init()` en cada petición, cron, controlador público, navegador…). Nada de esto está prohibido: el objetivo es que quien revisa el plugin sepa qué hace y decida. Un informe sin hallazgos no garantiza que el plugin sea seguro.

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

## Estados del informe de compatibilidad

`ok` y `método añadido` no requieren acción. `posterior` obliga a subir el `min_version`.
`eliminado` avisa de que el plugin se romperá al actualizar el core. `aportado por plugin`
y `aportado por vendor` indican que el símbolo no es del core. `no encontrado` exige
revisión manual, y si es un `pipe('X')` significa que el core no declara ese punto de
extensión y nada del plugin invoca el método: esa extensión seguramente nunca se ejecuta.

## Límites del análisis

La auditoría de compatibilidad es estática y solo audita PHP: no resuelve tipos, no comprueba las funciones ni los bloques de plantilla que usan los Twig, ni los XMLView, ni el JavaScript, y no audita los plugins declarados en `require`. Las plantillas solo se leen para saber qué métodos invoca el plugin.

Por eso un `min_version` más alto que el calculado puede estar justificado por un cambio del core que esta herramienta no ve. Declara siempre estas limitaciones en la conclusión y marca como dudosos los símbolos que no hayas verificado a mano.

La auditoría de seguridad se basa en patrones: no sigue el flujo de datos, no ve URLs construidas por partes ni código descargado en tiempo de ejecución y, por defecto, no revisa `vendor/` ni los plugins de `require`.

## Ejecución portable

En Claude Code puedes delegar la interpretación al agente `fs-dev:compatibility-auditor`. En Codex aplica el perfil directamente. Si no hay delegación disponible, completa el flujo tú mismo.

Esta skill solo diagnostica: no modifiques el plugin ni su `facturascripts.ini` salvo petición expresa del usuario, y no ejecutes su código para comprobar lo que hace.
