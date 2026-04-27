---
name: sync-models
description: Sincroniza modelos del MCP fs-mcp con sus fuentes (FacturaScripts core o plugins privados). Detecta columnas nuevas/modificadas/eliminadas, mantiene las descripciones unificadas en los archivos de overrides, regenera la metadata y compila si hace falta. Soporta uno o varios modelos, ruta local o URL de GitHub, y un modo "refresh masivo" para auditar todos los modelos del catálogo y actualizar la versión registrada de FacturaScripts.
---

# Sync Models — Mantenimiento de la metadata del MCP

Esta skill es la herramienta de **mantenimiento** del catálogo de modelos del plugin `fs-mcp`. Úsala cuando:

- Quieras añadir un **modelo nuevo** del core de FacturaScripts o de un plugin privado.
- Hayas actualizado FacturaScripts (o un plugin) y quieras revisar si **algún modelo ya configurado tiene columnas nuevas, modificadas o eliminadas**.
- Quieras hacer un **refresh masivo** de todos los modelos del catálogo y actualizar la versión registrada del core.

La skill respeta la separación entre core y privados:
- **Core** → modifica archivos del repo del MCP (`server/src/...`) y **compila**.
- **Privados** → modifica archivos en la ruta privada del usuario (`<outputBase>/...`); **no compila** (los privados se cargan dinámicamente al arrancar el servidor).

---

## Cómo invocar

El usuario te indicará tres datos por cada modelo:

1. **Nombre del modelo** en snake_case (ej: `cliente`, `factura_cliente`, `task`).
2. **Tipo**: `core` o `private`.
3. **Origen** (de dónde leer la fuente):
   - **Ruta local absoluta**: ej. `/Users/yo/facturascripts` o `/Users/yo/facturascripts/Plugins/Forja`.
   - **URL de GitHub**: ej. `https://github.com/NeoRazorX/facturascripts` o de un plugin.

Ejemplos de invocación habituales:

- `Revisa el modelo cliente del core, fuente /Users/yo/facturascripts`
- `Revisa los modelos cliente, producto y factura_cliente, todos en /Users/yo/facturascripts`
- `Revisa task y publication, ambos privados, en /Users/yo/facturascripts/Plugins/Forja`
- `Revisa task del plugin privado en https://github.com/X/Forja`
- `Refresca todos los modelos del core desde /Users/yo/facturascripts y actualiza la versión`

Si el usuario no aporta alguno de los tres datos, **pregúntale** antes de continuar.

---

## Conceptos previos

Lo primero que debes hacer es **familiarizarte con el estado actual del MCP** si no lo has hecho ya:

| Archivo | Rol |
|---|---|
| `server/src/scripts/generate-metadata.ts` | Genera la metadata (modo CORE y modo PLUGIN). Contiene `MODEL_CATALOG` con los modelos del core. |
| `server/src/metadata/descriptions-overrides.json` | Descripciones contextuales del core. Single source of truth (committed). |
| `server/src/metadata/models/*.ts` | Metadata generada por modelo (CORE). No editar a mano. |
| `server/src/metadata/index.ts` | Agregador auto-generado. |
| `<outputBase>/manifest.json` | Manifest del plugin privado (declara los modelos del plugin). |
| `<outputBase>/descriptions.json` | Descripciones del plugin privado. Por convención, se llama `descriptions.json` (no `<modulo>-descriptions.json`). |
| `<outputBase>/<modelo>/metadata.js` | Metadata generada del modelo privado. No editar a mano. |
| `<outputBase>/<modelo>/index.js` | Loader del módulo privado. Re-exporta `modelMetadata` desde `./metadata.js`. |

Comandos clave que usarás:

```bash
# Comparar un modelo del registry con su fuente y obtener un diff JSON
node dist/scripts/compare-model.js --model=<NOMBRE> --source=<RUTA> --type=<core|private>

# Regenerar metadata
npm run generate:metadata -- --fs-path=<ruta>                 # CORE
npm run generate:metadata -- --manifest=<ruta_manifest>       # PRIVATE

# Compilar (necesario tras editar código TS o regenerar core)
npm run build

# Tests + chequeo de descripciones
node dist/scripts/test-metadata.js
node dist/scripts/dump-all-descriptions.js
```

---

## Flujo principal de la skill

Sigue este árbol de decisión por cada modelo que el usuario haya pedido:

### Paso 0 — Preparar la fuente

- **Ruta local**: comprueba que existe con `ls` o `existsSync`.
- **URL de GitHub**: clona el repo en `/tmp/<nombre-repo>` si todavía no está allí. Reusa la carpeta si ya existe (haz `git pull` si está obsoleta más de 24 h, salvo que el usuario diga otra cosa).

  ```bash
  git clone --depth=1 <URL> /tmp/<repo-name>
  ```

  Después usa `/tmp/<repo-name>` como `--source`.

### Paso 1 — Comparar el modelo con la fuente

Ejecuta:
```bash
cd <plugin>/server
npm run build > /dev/null   # Asegura que el script está actualizado
node dist/scripts/compare-model.js --model=<nombre> --source=<ruta> --type=<core|private>
```

Lee la salida JSON. Tiene esta forma (campos relevantes):
- `inRegistry` — true si el modelo ya está configurado.
- `inSource` — true si se ha encontrado el XML de la tabla en la fuente.
- `summary.{added,removed,changed,unchanged}` — conteos.
- `added[]` — columnas nuevas (con `name`, `sqlType`, `nullable`, `default`, `isPrimaryKey`, `foreignKey`).
- `removed[]` — columnas que ya no están en la fuente.
- `changed[]` — columnas con diferencias (`field`, `before`, `after`).
- `suggestedTableEntry` — solo si el modelo es nuevo. Te propone `name`, `table`, `endpointHint`, `primaryKey`, y `editViewHint` si encontró un `Edit<Modelo>.xml`.

### Paso 2 — Decidir el tipo de operación

Tres casos:

#### A) Modelo NUEVO (`inRegistry === false`)

1. Confirma con el usuario que quiere añadir el modelo (muéstrale `suggestedTableEntry` y la lista de `added` columnas).
2. **Si es CORE**:
   - Edita `server/src/scripts/generate-metadata.ts`: añade una entrada al array `MODEL_CATALOG` con `name`, `table`, `endpoint`, `editView` (si lo hay) y `description`. Coloca la entrada en la categoría temática que corresponda (datos maestros, documentos, contabilidad, etc.).
3. **Si es PRIVATE**:
   - Edita `<outputBase>/manifest.json`: añade una entrada al array `models` con `name`, `outputDir` (suele ser un plural, ej: `tasks`), `table`, `endpoint`, `editView` (si lo hay) y `description`.
   - Crea la carpeta `<outputBase>/<outputDir>/` si no existe.
   - Crea o actualiza `<outputBase>/<outputDir>/index.js` siguiendo el patrón de los módulos privados existentes:
     - `import <name>Metadata from './metadata.js';`
     - Exporta `registerTools`, `handleTool` y `export const modelMetadata = [<name>Metadata];`.
4. Redacta descripciones contextuales para **todas** las columnas del modelo (incluidas las FK) y añádelas al archivo de overrides:
   - **Core** → `server/src/metadata/descriptions-overrides.json`.
   - **Private** → `<outputBase>/descriptions.json`.

   Las descripciones deben ser concisas, en español, orientadas a reporting y consistentes con las que ya existen en el archivo. Para FK: explica el rol funcional (no "Referencia a X.Y."). Para campos comunes (`fecha`, `total`, `idempresa`, etc.) usa la misma redacción que ya tienen otros modelos similares.
5. Salta al Paso 3 (regenerar y verificar).

#### B) Modelo EXISTENTE con cambios (`inRegistry && (added>0 || removed>0 || changed>0)`)

1. Resume al usuario los cambios detectados (cuántas columnas se añaden, eliminan y cambian, con sus nombres).
2. Si hay `removed`: pregunta al usuario si desea eliminar también las descripciones del archivo de overrides para esas columnas (lo habitual es sí, para mantenerlo limpio). Si confirma, elimina las claves del JSON.
3. Si hay `changed`: muestra el detalle (`column`, `field`, `before`, `after`). Algunos cambios (cambio de `nullable`, `default`) no requieren modificar la descripción. Un cambio de `foreignKey` o de tipo a veces sí amerita revisar la descripción — pregunta al usuario si quiere ajustarla.
4. Si hay `added`: redacta descripciones para esas columnas y añádelas al archivo de overrides correspondiente. Ten en cuenta el contexto del modelo donde aparecen.
5. Salta al Paso 3.

#### C) Modelo SIN cambios

Reporta `Sin cambios detectados` y termina (no toques nada). Aun así, si la skill se invocó en modo refresh masivo, se cuenta para el resumen final.

### Paso 3 — Regenerar y verificar

1. **Si el modelo es CORE**:
   ```bash
   cd <plugin>/server
   npm run generate:metadata -- --fs-path=<ruta_fs>
   npm run build
   ```
   El segundo `build` es importante: la regeneración escribe `.ts` nuevos y hay que recompilar para que el servidor en producción los use.

2. **Si el modelo es PRIVATE**:
   ```bash
   cd <plugin>/server
   npm run generate:metadata -- --manifest=<ruta_manifest>
   ```
   No hace falta `npm run build` para el módulo privado en sí, porque su `metadata.js` es JS plano que se carga dinámicamente. Sin embargo, si el `compare-model.js` lo ejecutaste antes y necesitas volver a comparar tras los cambios, sí harás falta recompilarlo (porque el script lee del registry, no del JSON).

3. Verificación:
   ```bash
   node dist/scripts/test-metadata.js
   node dist/scripts/dump-all-descriptions.js
   ```
   - Los tests deben pasar (64/64 al menos).
   - No deben quedar descripciones genéricas tipo "Referencia a X.Y." (`0 (0.0%)`).
   - El `Total columnas` debe coincidir con el esperado tras los cambios.

4. Smoke test JSON-RPC opcional (recomendado para cambios grandes):
   ```bash
   printf '%s\n' \
     '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' \
     '{"jsonrpc":"2.0","method":"notifications/initialized","params":{}}' \
     '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"describe_model","arguments":{"model":"<nombre>","format":"markdown"}}}' \
     | node dist/index.js 2>/dev/null | tail -1 | python3 -c "import sys,json; print(json.loads(sys.stdin.read())['result']['content'][0]['text'])"
   ```

---

## Múltiples modelos

Si el usuario pasa una lista, hay dos formas:

- **Misma ruta para todos**:
  - Ejecuta el flujo del Paso 1 al 2 para cada modelo (sin regenerar entre uno y otro — solo edita los archivos).
  - Cuando hayas procesado todos, ejecuta UN solo Paso 3 (regenerar + compilar) al final. Esto evita compilaciones repetidas y deja el repo en un estado consistente.

- **Cada modelo en su propia ruta**:
  - Procesa cada uno con su `--source`. Aplica la misma estrategia: edita primero todos los archivos (overrides, manifest, catálogo), regenera al final.

Si la lista mezcla modelos `core` y `private`, agrupa: primero todos los core, regenera/compila core; luego los privados, regenera privado.

---

## Modo "Refresh masivo" (auditar todos los modelos del catálogo)

Cuando el usuario pida algo como *"revisa todos los modelos del core con la versión 2026.1"*:

1. Confirma la fuente (ruta local de FacturaScripts o URL de GitHub) y prepárala (Paso 0).
2. Lista los modelos del core con:
   ```bash
   node -e "const { modelMetadata } = require('./dist/metadata/index.js'); console.log(Object.keys(modelMetadata).join('\n'));"
   ```
   o leyendo `MODEL_CATALOG` en `generate-metadata.ts`.
3. Por cada modelo: ejecuta `compare-model.js`. Acumula los resultados.
4. Genera un **resumen** al usuario:
   - Modelos sin cambios: N
   - Modelos con columnas añadidas: lista con conteos.
   - Modelos con columnas eliminadas: lista.
   - Modelos con columnas cambiadas: lista.
5. Procesa los modelos con cambios siguiendo el flujo del Paso 2B (redacta descripciones para columnas nuevas, etc.). Hazlo en lote: edita los archivos sin regenerar entre cada modelo.
6. **Una sola** regeneración + compilación al final.
7. **Actualiza la versión registrada de FacturaScripts**:
   - El generador ya almacena el commit Git actual al regenerar (se obtiene con `git rev-parse --short HEAD` en la ruta de FS). Cuando regeneras tras el refresh masivo, ese commit pasa a quedar como `generatedFrom.facturascriptsCommit` en cada `ModelMetadata`.
   - Eso es lo que `verify_model_columns` usa para el aviso de drift. Por tanto, *regenerar* ya implica *actualizar la versión*.
   - Si el usuario quiere registrar una versión legible adicional (ej: "2026.1"), pregúntale por la cadena que quiere y, opcionalmente, podemos extender el manifest para añadirla — por ahora basta con el commit.

Para refresh masivo de **privados**: el flujo es idéntico pero iterando los modelos del `manifest.json` y al final ejecutando `npm run generate:metadata -- --manifest=...`. No requiere build adicional porque los privados son JS dinámicos.

---

## Buenas prácticas al redactar descripciones

Las descripciones deben ser:

- **Concisas** (1-2 frases máximo).
- **En español**.
- **Orientadas a reporting**: explica qué representa el campo en el negocio, no su tipo SQL.
- **Consistentes** con las descripciones que ya existen en el archivo. Si redactas para `cliente.codcliente`, mira cómo están redactadas las descripciones de campos similares (`producto.referencia`, `proveedor.codproveedor`).
- **Para FKs**: explica el **rol funcional**, no "Referencia a X.Y.". Ejemplos buenos:
  - `codagente`: "Agente comercial asignado al cliente. Cobra comisiones por sus compras."
  - `codpago`: "Forma de pago habitual del cliente (transferencia, recibo domiciliado, etc.)."
  - `idempresa`: "Empresa propietaria del registro. En instalaciones multi-empresa filtra y aísla los datos."

Si dudas en una descripción, **pregunta al usuario** mejor que inventar.

---

## Verificación final (siempre)

Tras cualquier ejecución de la skill, antes de dar por terminado:

1. `npm run build` ha terminado sin errores.
2. `node dist/scripts/test-metadata.js` → 64/64 (o más) tests pasan.
3. `node dist/scripts/dump-all-descriptions.js` → 0 descripciones genéricas.
4. Si se ha modificado un modelo concreto, llama a `describe_model` por JSON-RPC para que el usuario lo vea con sus propios ojos.
5. Reporta al usuario:
   - Modelos procesados (con conteo de added/removed/changed por cada uno).
   - Archivos modificados (paths absolutos).
   - Resultado de la verificación.

---

## Errores comunes y cómo manejarlos

- **"No se encontró Table/<modelo>.xml"**: la heurística de mapeo no encontró el archivo. Pídele al usuario el nombre exacto de la tabla XML; añade un override manual en el manifest/catálogo si es un nombre raro.
- **Conflicto en `descriptions-overrides.json`**: si una descripción ya existe y el usuario quiere reemplazarla, hazlo. Si la nueva descripción es claramente peor (más corta, más genérica), pregúntale.
- **El servidor no arranca tras los cambios**: ejecuta `node dist/index.js < /dev/null 2>&1 | head -20` para ver el primer error. Suele ser un error de sintaxis en un JSON o un módulo TS que no compila.
- **`compare-model.js` reporta `inSource: false`**: la ruta no apunta a una carpeta válida o el modelo no existe en esa fuente. Verifica con `ls <source>/Core/Table` (core) o `ls <source>/Table` (plugin).
- **GitHub clone falla**: a veces el repo es privado o requiere autenticación. Pídele al usuario que clone manualmente y pásete la ruta local.

---

## Resumen del flujo completo (cheatsheet)

```
1. Preparar fuente (ruta local o git clone)
2. node dist/scripts/compare-model.js --model=X --source=Y --type=Z
3. Decidir: NUEVO | EXISTENTE_CON_CAMBIOS | SIN_CAMBIOS
4. Editar:
     - CORE → MODEL_CATALOG + descriptions-overrides.json
     - PRIVATE → manifest.json + descriptions.json (+ index.js si nuevo)
5. Regenerar:
     - CORE → npm run generate:metadata -- --fs-path=...
              npm run build
     - PRIVATE → npm run generate:metadata -- --manifest=...
6. Verificar:
     - node dist/scripts/test-metadata.js
     - node dist/scripts/dump-all-descriptions.js
7. Reportar al usuario
```

¿Listo? Indícame qué modelo o modelos quieres revisar, su tipo (core/private) y la fuente.
