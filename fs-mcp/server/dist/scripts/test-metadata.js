/**
 * Prueba rápida de los handlers de metadata y del tool describe_model.
 *
 * Ejecuta los handlers sin levantar el servidor stdio, validando que la
 * metadata generada se expone correctamente como Resources y como Tool.
 *
 * Uso:
 *   node dist/scripts/test-metadata.js
 */
import { listSchemaResources, readSchemaResource } from '../resources/schema-resources.js';
import { handleSchemaTool } from '../modules/schema/index.js';
import { bootstrapCoreMetadata, getModelMetadata as registryGetMeta, getModelNames } from '../metadata/registry.js';
import { enrichAllTools, __test as enrichInternals } from '../metadata/enrich.js';
// Carga la metadata del core en el registry antes de ejecutar los asserts.
await bootstrapCoreMetadata();
const modelNames = getModelNames();
const modelMetadata = {};
for (const n of modelNames)
    modelMetadata[n] = registryGetMeta(n);
const results = [];
function assert(name, cond, detail) {
    const entry = { name, ok: cond };
    if (detail)
        entry.detail = detail;
    results.push(entry);
    const prefix = cond ? '✓' : '✗';
    const suffix = detail ? ` — ${detail}` : '';
    console.log(`${prefix} ${name}${suffix}`);
}
const EXPECTED_MODEL_COUNT = 83;
// 1. modelMetadata tiene los 83 modelos del core
assert(`hay ${EXPECTED_MODEL_COUNT} modelos en modelMetadata`, modelNames.length === EXPECTED_MODEL_COUNT, `modelos: ${modelNames.length}`);
const samples = ['cliente', 'producto', 'factura_cliente', 'asiento', 'stock', 'partida', 'subcuenta', 'pago_cliente', 'recibo_cliente', 'linea_factura_cliente', 'user', 'role', 'pais', 'serie', 'forma_pago'];
for (const expected of samples) {
    assert(`existe metadata para ${expected}`, modelMetadata[expected] !== undefined);
}
// 2. listSchemaResources devuelve el índice + 3 URIs por modelo
const resources = listSchemaResources();
const expectedResources = 1 + EXPECTED_MODEL_COUNT * 3;
assert(`listSchemaResources devuelve 1 + ${EXPECTED_MODEL_COUNT}×3 = ${expectedResources} resources`, resources.length === expectedResources, `encontrados: ${resources.length}`);
assert('primer resource es fs-schema://models', resources[0]?.uri === 'fs-schema://models');
// 3. readSchemaResource índice devuelve lista con todos los modelos
const indexResource = readSchemaResource('fs-schema://models');
assert('readSchemaResource models no es null', indexResource !== null);
if (indexResource) {
    const parsed = JSON.parse(indexResource.text);
    assert(`índice contiene ${EXPECTED_MODEL_COUNT} modelos`, parsed.models.length === EXPECTED_MODEL_COUNT, `${parsed.models.length} modelos`);
    const clienteEntry = parsed.models.find((m) => m.name === 'cliente');
    assert('cliente en el índice tiene columnsCount > 0', (clienteEntry?.columnsCount ?? 0) > 0, `columnas: ${clienteEntry?.columnsCount}`);
}
// 4. readSchemaResource JSON de un modelo
const clienteResource = readSchemaResource('fs-schema://model/cliente');
assert('readSchemaResource cliente JSON no es null', clienteResource !== null);
if (clienteResource) {
    assert('mimeType de cliente JSON es application/json', clienteResource.mimeType === 'application/json');
    const parsed = JSON.parse(clienteResource.text);
    assert('cliente.name === "cliente"', parsed.name === 'cliente');
    assert('cliente.table === "clientes"', parsed.table === 'clientes');
    assert('cliente.primaryKey === "codcliente"', parsed.primaryKey === 'codcliente');
    assert('cliente tiene columnas', parsed.columns.length > 0, `${parsed.columns.length} cols`);
}
// 5. readSchemaResource markdown
const clienteMd = readSchemaResource('fs-schema://model/cliente.md');
assert('readSchemaResource cliente.md no es null', clienteMd !== null);
if (clienteMd) {
    assert('mimeType de cliente.md es text/markdown', clienteMd.mimeType === 'text/markdown');
    assert('markdown contiene "# Modelo `cliente`"', clienteMd.text.includes('# Modelo `cliente`'));
    assert('markdown contiene tabla de columnas', clienteMd.text.includes('| Campo | Tipo |'));
    assert('markdown contiene belongsTo', clienteMd.text.includes('## Relaciones belongsTo'));
}
// 6. readSchemaResource relaciones
const asientoRels = readSchemaResource('fs-schema://relations/asiento');
assert('readSchemaResource relations/asiento no es null', asientoRels !== null);
if (asientoRels) {
    const parsed = JSON.parse(asientoRels.text);
    assert('asiento tiene relaciones', parsed.relations.length > 0, `${parsed.relations.length} relaciones`);
}
// 7. Modelo desconocido → error
try {
    readSchemaResource('fs-schema://model/inexistente');
    assert('modelo inexistente lanza error', false, 'no lanzó error');
}
catch (err) {
    assert('modelo inexistente lanza error', true, err.message);
}
// 8. URI con otro scheme → null (permite delegación)
const nonSchema = readSchemaResource('something://else');
assert('URI no-schema devuelve null', nonSchema === null);
// 9. Tool list_models
const listToolResult = await handleSchemaTool('list_models', {});
assert('tool list_models devuelve resultado', listToolResult !== null);
if (listToolResult) {
    const text = listToolResult.content[0].text;
    const parsed = JSON.parse(text);
    assert(`tool list_models devuelve ${EXPECTED_MODEL_COUNT} modelos`, parsed.models.length === EXPECTED_MODEL_COUNT);
}
// 10. Tool describe_model json
const descJson = await handleSchemaTool('describe_model', { model: 'producto', format: 'json' });
assert('tool describe_model producto JSON', descJson !== null);
if (descJson && !descJson.isError) {
    const parsed = JSON.parse(descJson.content[0].text);
    assert('describe_model producto.name correcto', parsed.name === 'producto');
    assert('describe_model producto tiene columnas y relaciones', parsed.columns.length > 0 && parsed.relations.length > 0);
}
// 11. Tool describe_model markdown
const descMd = await handleSchemaTool('describe_model', { model: 'factura_cliente', format: 'markdown' });
assert('tool describe_model factura_cliente markdown', descMd !== null);
if (descMd && !descMd.isError) {
    assert('describe_model factura_cliente markdown contiene header', descMd.content[0].text.includes('# Modelo `factura_cliente`'));
}
// 12. Tool describe_model con modelo inválido
const descErr = await handleSchemaTool('describe_model', { model: 'noexiste' });
assert('describe_model modelo inválido devuelve isError', descErr?.isError === true);
// 13. Tool no manejado devuelve null
const unknown = await handleSchemaTool('otra_cosa', {});
assert('tool no manejado devuelve null', unknown === null);
// 13b. Tool verify_model_columns con modelo inválido → isError
const verifyInvalid = await handleSchemaTool('verify_model_columns', { model: 'noexiste' });
assert('verify_model_columns modelo inválido → isError', verifyInvalid?.isError === true);
// 13c. Tool verify_model_columns con conexión inexistente → propaga error como isError
const verifyNoConn = await handleSchemaTool('verify_model_columns', { model: 'cliente', connection: '__no_existe__' });
assert('verify_model_columns con conexión inexistente devuelve isError', verifyNoConn?.isError === true);
if (verifyNoConn) {
    assert('mensaje de error menciona el modelo y el endpoint', verifyNoConn.content[0].text.includes('cliente') && verifyNoConn.content[0].text.includes('/clientes'));
}
// ─── Enriquecimiento ───────────────────────────────────────────────
// 14. Resolución del modelo a partir del nombre del tool
assert('resolveModelFromToolName(create_cliente) → cliente', enrichInternals.resolveModelFromToolName('create_cliente')?.name === 'cliente');
assert('resolveModelFromToolName(update_factura_cliente) → factura_cliente', enrichInternals.resolveModelFromToolName('update_factura_cliente')?.name === 'factura_cliente');
assert('resolveModelFromToolName(get_clientes) → cliente (vía endpoint)', enrichInternals.resolveModelFromToolName('get_clientes')?.name === 'cliente');
assert('resolveModelFromToolName(get_facturaclientes) → factura_cliente', enrichInternals.resolveModelFromToolName('get_facturaclientes')?.name === 'factura_cliente');
assert('resolveModelFromToolName(list_connections) → undefined', enrichInternals.resolveModelFromToolName('list_connections') === undefined);
// 15. enrichTool: descripción vacía se rellena, descripción existente NO se pisa
const fakeCreateCliente = {
    name: 'create_cliente',
    description: 'fake',
    inputSchema: {
        type: 'object',
        properties: {
            connection: { type: 'string', description: 'conexión' },
            cifnif: { type: 'string', description: '' },
            nombre: { type: 'string', description: 'Nombre o razón social del cliente' },
            personafisica: { type: 'boolean' },
        },
        required: ['connection', 'nombre'],
    },
};
const fakeStats = { toolsProcessed: 0, toolsEnriched: 0, descriptionsAdded: 0, maxLengthsAdded: 0, enumsAdded: 0 };
const touched = enrichInternals.enrichTool(fakeCreateCliente, fakeStats);
assert('enrichTool toca el tool', touched);
const props = fakeCreateCliente.inputSchema.properties;
assert('cifnif: description vacía se rellena del metadata o queda vacía si no hay description', typeof props.cifnif?.description === 'string');
assert('cifnif: maxLength se añade del metadata (30)', props.cifnif?.maxLength === 30, `maxLength: ${props.cifnif?.maxLength}`);
assert('nombre: description hardcoded NO se pisa', props.nombre?.description === 'Nombre o razón social del cliente');
assert('nombre: maxLength se añade aunque ya tenía description (100)', props.nombre?.maxLength === 100, `maxLength: ${props.nombre?.maxLength}`);
assert('personafisica tiene boolean (no enum) — el metadata captura enumValues solo de selects', props.personafisica?.enum === undefined || (Array.isArray(props.personafisica?.enum) && props.personafisica?.enum.length > 0));
assert('connection no se modifica', props.connection?.maxLength === undefined);
// 16. enrichTool sobre tool sin modelo devuelve false
const orphanTool = {
    name: 'list_connections',
    description: 'fake',
    inputSchema: { type: 'object', properties: {}, required: [] },
};
const orphanStats = { toolsProcessed: 0, toolsEnriched: 0, descriptionsAdded: 0, maxLengthsAdded: 0, enumsAdded: 0 };
assert('enrichTool sobre tool sin modelo devuelve false', enrichInternals.enrichTool(orphanTool, orphanStats) === false);
// 17. enrichAllTools sobre un Map devuelve estadísticas coherentes
const toolsMap = new Map();
toolsMap.set('create_producto', {
    name: 'create_producto',
    description: 'crea',
    inputSchema: {
        type: 'object',
        properties: {
            connection: { type: 'string' },
            referencia: { type: 'string' },
            descripcion: { type: 'string' },
        },
        required: ['connection', 'referencia'],
    },
});
toolsMap.set('add_connection', {
    name: 'add_connection',
    description: 'noop',
    inputSchema: { type: 'object', properties: { key: { type: 'string' } }, required: [] },
});
const aggStats = enrichAllTools(toolsMap);
assert('enrichAllTools procesa 2 tools', aggStats.toolsProcessed === 2);
assert('enrichAllTools enriquece 1 (create_producto)', aggStats.toolsEnriched === 1);
assert('create_producto: referencia adquiere maxLength 30', (toolsMap.get('create_producto')?.inputSchema).properties.referencia?.maxLength === 30);
// Resumen
const failed = results.filter((r) => !r.ok);
console.log('');
console.log(`Resultado: ${results.length - failed.length}/${results.length} pasaron.`);
if (failed.length > 0) {
    console.error('Fallaron:');
    for (const r of failed)
        console.error(` - ${r.name}${r.detail ? ` (${r.detail})` : ''}`);
    process.exit(1);
}
//# sourceMappingURL=test-metadata.js.map