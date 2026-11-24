/**
 * Pruebas del cliente de la API de autor de Forja y de las herramientas forja_*.
 *
 * Levanta un servidor HTTP local que imita `/api/3/forja` y comprueba la cabecera X-Forja-Token, el envío de
 * JSON sin el envoltorio filter[], la subida multipart, los errores 401 y 404 y la publicación de páginas de Doc.
 */

import assert from 'node:assert/strict';
import { access, chmod, mkdtemp, mkdir, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDirectory = path.join(serverDirectory, 'build');
const TOKEN = 'token-de-prueba';
const ZIP_BYTES = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0xff, 0x10, 0x20]);

/** @type {string} */
let tempDirectory;
/** @type {http.Server} */
let server;
/** @type {Array<{method: string, url: string, headers: http.IncomingHttpHeaders, body: Buffer}>} */
const requests = [];
/** @type {import('../build/fs/forja-client.js')} */
let forjaModule;
/** @type {import('../build/modules/forja/index.js')} */
let toolsModule;
/** @type {import('../build/fs/client.js')} */
let apiModule;

/**
 * Publicaciones del plugin DocPlugin, que el servidor de prueba guarda como la forja.
 *
 * @type {Map<number, {id: number, url: string, body: string, fields: Record<string, string>}>}
 */
const docPublications = new Map();
let nextPublicationId = 100;
let uploadedImages = 0;

/**
 * Responde con un cuerpo JSON.
 *
 * @param {http.ServerResponse} res Respuesta HTTP.
 * @param {number} status Estado HTTP.
 * @param {unknown} body Cuerpo a serializar.
 */
function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

/**
 * Lee un zip desde su directorio central y devuelve cada entrada con su contenido y sus permisos Unix.
 *
 * @param {string} file Ruta del zip.
 * @returns {Promise<Map<string, {content: Buffer, mode: number}>>} Entradas por nombre.
 */
async function readZip(file) {
  const data = await readFile(file);
  const end = data.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  assert.ok(end >= 0, 'falta el final del directorio central');
  const total = data.readUInt16LE(end + 10);
  let offset = data.readUInt32LE(end + 16);
  const entries = new Map();
  for (let i = 0; i < total; i++) {
    assert.equal(data.readUInt32LE(offset), 0x02014b50);
    const method = data.readUInt16LE(offset + 10);
    const compressed = data.readUInt32LE(offset + 20);
    const nameLength = data.readUInt16LE(offset + 28);
    const extraLength = data.readUInt16LE(offset + 30);
    const commentLength = data.readUInt16LE(offset + 32);
    const mode = data.readUInt32LE(offset + 38) >>> 16;
    const local = data.readUInt32LE(offset + 42);
    const name = data.subarray(offset + 46, offset + 46 + nameLength).toString('utf-8');
    const start = local + 30 + data.readUInt16LE(local + 26) + data.readUInt16LE(local + 28);
    const raw = data.subarray(start, start + compressed);
    entries.set(name, { content: method === 8 ? inflateRawSync(raw) : Buffer.from(raw), mode });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

/**
 * Crea archivos de prueba a partir de un mapa ruta relativa → contenido.
 *
 * @param {string} base Carpeta base.
 * @param {Record<string, string>} files Archivos a crear.
 */
async function createFiles(base, files) {
  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(base, relative);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content);
  }
}

/**
 * Indica si existe una ruta.
 *
 * @param {string} file Ruta.
 * @returns {Promise<boolean>} true si existe.
 */
async function exists(file) {
  return access(file).then(() => true, () => false);
}

/**
 * Atiende las peticiones del servidor de prueba.
 *
 * @param {http.IncomingMessage} req Petición.
 * @param {http.ServerResponse} res Respuesta.
 * @param {Buffer} body Cuerpo completo de la petición.
 */
async function route(req, res, body) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (req.headers['x-forja-token'] !== TOKEN) {
    sendJson(res, 401, { code: 'invalid-token', message: 'Token no válido' });
    return;
  }

  const match = url.pathname.match(/^\/api\/3\/forja\/plugins(?:\/([^/]+))?(?:\/(.*))?$/);
  if (!match) {
    sendJson(res, 404, { code: 'not-found', message: 'Ruta desconocida' });
    return;
  }
  const [, plugin, rest] = match;
  if (plugin !== undefined && !['MiPlugin', 'DocPlugin'].includes(decodeURIComponent(plugin))) {
    sendJson(res, 404, { code: 404, message: 'Plugin no encontrado' });
    return;
  }

  if (plugin === 'DocPlugin') {
    await routeDocPublications(req, res, rest ?? '', body);
    return;
  }

  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    const form = await new Response(body, { headers: { 'content-type': req.headers['content-type'] } }).formData();
    const fields = {};
    for (const [name, value] of form.entries()) {
      fields[name] = typeof value === 'string'
        ? value
        : { filename: value.name, size: value.size, text: await value.text() };
    }
    sendJson(res, 200, { multipart: fields });
    return;
  }

  const translations = rest?.match(/^translations(?:\/([^/]+))?$/);
  if (translations && req.method === 'GET') {
    const all = { es_ES: { hola: 'Hola', adios: 'Adiós' }, en_EN: { hola: 'Hello' } };
    const lang = translations[1];
    // un idioma sin traducciones: la forja devuelve {}
    sendJson(res, 200, lang ? (all[lang] ?? {}) : all);
    return;
  }

  sendJson(res, 200, {
    method: req.method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    json: body.length > 0 ? JSON.parse(body.toString('utf-8')) : null,
  });
}

/**
 * Lee los campos y los archivos de un formulario multipart.
 *
 * @param {http.IncomingMessage} req Petición.
 * @param {Buffer} body Cuerpo.
 * @returns {Promise<{fields: Record<string, string>, files: Array<{filename: string, size: number}>}>} Contenido.
 */
async function readForm(req, body) {
  const form = await new Response(body, { headers: { 'content-type': req.headers['content-type'] } }).formData();
  const fields = {};
  const files = [];
  for (const [name, value] of form.entries()) {
    if (typeof value === 'string') {
      fields[name] = value;
    } else {
      files.push({ filename: value.name, size: value.size });
    }
  }
  return { fields, files };
}

/**
 * Imita las publicaciones de la forja para DocPlugin: las imágenes subidas se añaden al final del texto.
 *
 * @param {http.IncomingMessage} req Petición.
 * @param {http.ServerResponse} res Respuesta.
 * @param {string} rest Ruta tras /plugins/DocPlugin/.
 * @param {Buffer} body Cuerpo.
 */
async function routeDocPublications(req, res, rest, body) {
  const match = rest.match(/^publications(?:\/(\d+))?$/);
  if (!match) {
    sendJson(res, 404, { code: 404, message: 'Ruta desconocida' });
    return;
  }
  if (req.method === 'GET' && !match[1]) {
    sendJson(res, 200, { publications: [...docPublications.values()].map(({ id, url }) => ({ id, url })) });
    return;
  }

  const multipart = req.headers['content-type']?.startsWith('multipart/form-data');
  const { fields, files } = multipart ? await readForm(req, body) : { fields: JSON.parse(body.toString('utf-8')), files: [] };
  const id = match[1] ? Number(match[1]) : nextPublicationId++;
  const publication = docPublications.get(id) ?? { id, url: `https://forja.test/publication/${id}`, body: '', fields: {} };
  if (match[1] && !docPublications.has(id)) {
    sendJson(res, 404, { code: 404, message: 'Publicación no encontrada' });
    return;
  }
  publication.fields = { ...publication.fields, ...fields };
  if (fields.body !== undefined) {
    publication.body = String(fields.body);
  }
  for (const file of files) {
    uploadedImages++;
    // como la forja, el nombre original solo conserva letras, números, «.», «_» y «-»
    const safeName = file.filename.replace(/[^A-Za-z0-9._-]/g, '_');
    publication.body += `\n\n![](https://forja.test/MyFiles/2026/11/${uploadedImages}_forja_${safeName}?myft=t)`;
  }
  docPublications.set(id, publication);
  sendJson(res, match[1] ? 200 : 201, { id, url: publication.url, body: publication.body, type: fields.type });
}

before(async () => {
  tempDirectory = await mkdtemp(path.join(os.tmpdir(), 'fs-mcp-forja-'));

  server = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      requests.push({ method: req.method ?? '', url: req.url ?? '', headers: req.headers, body });
      route(req, res, body).catch((error) => sendJson(res, 500, { message: String(error) }));
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
  const baseUrl = `http://127.0.0.1:${port}`;

  // Archivo de conexiones aislado: la conexión por defecto es de tipo api y la de forja va después.
  const connectionsFile = path.join(tempDirectory, 'connections.json');
  await writeFile(connectionsFile, JSON.stringify({
    default: 'erp',
    connections: {
      erp: { name: 'ERP', url: baseUrl, token: 'api-token' },
      'forja-autor': { name: 'Forja autor', url: `${baseUrl}/`, token: TOKEN, type: 'forja' },
      'forja-mala': { name: 'Forja token erróneo', url: baseUrl, token: 'otro', type: 'forja' },
      // URL de la API pegada tal cual al editar el archivo a mano
      'forja-ruta': { name: 'Forja con ruta', url: `${baseUrl}/api/3/forja/`, token: TOKEN, type: 'forja' },
    },
  }));
  process.env.FS_CONNECTIONS_FILE = connectionsFile;

  forjaModule = await import(pathToFileURL(path.join(buildDirectory, 'fs', 'forja-client.js')).href);
  toolsModule = await import(pathToFileURL(path.join(buildDirectory, 'modules', 'forja', 'index.js')).href);
  apiModule = await import(pathToFileURL(path.join(buildDirectory, 'fs', 'client.js')).href);
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(tempDirectory, { recursive: true, force: true });
});

test('usa la primera conexión de tipo forja, no la conexión por defecto global', () => {
  const resolved = forjaModule.resolveForjaConnection();
  assert.equal(resolved.key, 'forja-autor');
  assert.throws(() => forjaModule.resolveForjaConnection('erp'), /tipo api/);
});

test('el cliente de la API /api/3 rechaza las conexiones de tipo forja', async () => {
  await assert.rejects(apiModule.fsClient.get('/clientes', {}, 'forja-autor'), /tipo forja/);
});

test('GET envía X-Forja-Token y los parámetros sin envoltorio filter[]', async () => {
  const result = await forjaModule.forjaClient.get('/plugins/MiPlugin/publications', { type: 'news', vacio: '' });
  assert.equal(result.path, '/api/3/forja/plugins/MiPlugin/publications');
  assert.deepEqual(result.query, { type: 'news' });
  assert.equal(requests.at(-1).headers['x-forja-token'], TOKEN);
});

test('PATCH envía el cuerpo como JSON', async () => {
  const result = await forjaModule.forjaClient.sendJson('PATCH', '/plugins/MiPlugin', { description: 'Larga' });
  assert.equal(result.method, 'PATCH');
  assert.deepEqual(result.json, { description: 'Larga' });
  assert.match(requests.at(-1).headers['content-type'] ?? '', /^application\/json/);
});

test('sube archivos y campos en multipart', async () => {
  const zipPath = path.join(tempDirectory, 'MiPlugin.zip');
  await writeFile(zipPath, 'contenido-zip');

  const result = await forjaModule.forjaClient.sendMultipart(
    'POST',
    '/plugins/MiPlugin/builds',
    { version: '1.5', vacio: undefined },
    [{ field: 'zip', path: zipPath }]
  );
  assert.deepEqual(result.multipart, {
    version: '1.5',
    zip: { filename: 'MiPlugin.zip', size: 13, text: 'contenido-zip' },
  });
});

test('falla antes de enviar si el archivo a subir no existe', async () => {
  const before = requests.length;
  await assert.rejects(
    forjaModule.forjaClient.sendMultipart('POST', '/plugins/MiPlugin/builds', {}, [
      { field: 'zip', path: path.join(tempDirectory, 'no-existe.zip') },
    ]),
    /No existe el archivo/
  );
  assert.equal(requests.length, before);
});

test('devuelve errores 401 legibles con el código del servidor', async () => {
  await assert.rejects(
    forjaModule.forjaClient.get('/plugins', undefined, 'forja-mala'),
    (error) => {
      assert.equal(error.name, 'ForjaApiError');
      assert.equal(error.status, 401);
      assert.equal(error.code, 'invalid-token');
      assert.match(error.message, /GET \/plugins: Forja \(Forja token erróneo, HTTP 401, invalid-token\): Token no válido/);
      assert.match(error.message, /PortalForja/);
      return true;
    }
  );
});

test('devuelve errores 404 legibles con una pista sobre el acceso al plugin', async () => {
  await assert.rejects(
    forjaModule.forjaClient.get('/plugins/Ajeno'),
    (error) => {
      assert.equal(error.status, 404);
      assert.equal(error.code, '404');
      assert.match(error.message, /Plugin no encontrado/);
      assert.match(error.message, /no es tuyo ni de un equipo/);
      return true;
    }
  );
});

test('handleForjaTool ignora las herramientas ajenas', async () => {
  assert.equal(await toolsModule.handleForjaTool('get_publications', {}), null);
});

test('el nombre del plugin va tal cual en la ruta y se rechaza el que saldría del recurso', async () => {
  const desde = requests.length;
  for (const plugin of ['..', '.', 'a/b', '..\\plugins', 'a?b', 'a#b', '%2e%2e']) {
    const result = await toolsModule.handleForjaTool('forja_get_plugin', { plugin });
    assert.equal(result.isError, true, plugin);
    assert.match(result.content[0].text, /Identificador no válido/, plugin);
  }
  assert.equal(requests.length, desde);

  const result = await toolsModule.handleForjaTool('forja_get_plugin', { plugin: 'MiPlugin' });
  assert.equal(result.isError, undefined);
  assert.equal(requests.at(-1).url, '/api/3/forja/plugins/MiPlugin');
});

test('forja_download_translations escribe un JSON formateado por idioma', async () => {
  const pluginPath = path.join(tempDirectory, 'MiPlugin');
  await mkdir(pluginPath, { recursive: true });

  const result = await toolsModule.handleForjaTool('forja_download_translations', {
    plugin: 'MiPlugin',
    plugin_path: pluginPath,
  });
  assert.equal(result.isError, undefined);
  const summary = JSON.parse(result.content[0].text);
  assert.deepEqual(summary.files.map((file) => [file.lang, file.keys]), [['es_ES', 2], ['en_EN', 1]]);
  assert.equal(
    await readFile(path.join(pluginPath, 'Translation', 'es_ES.json'), 'utf-8'),
    '{\n    "hola": "Hola",\n    "adios": "Adiós"\n}'
  );
});

test('forja_download_translations pide un idioma por su ruta y no vacía el archivo local si no tiene traducciones', async () => {
  const pluginPath = path.join(tempDirectory, 'UnIdioma');
  await createFiles(pluginPath, { 'Translation/zz_ZZ.json': '{"local": "Local"}' });

  const result = await toolsModule.handleForjaTool('forja_download_translations', {
    plugin: 'MiPlugin',
    plugin_path: pluginPath,
    lang: 'en_EN',
  });
  assert.equal(result.isError, undefined, result.content[0].text);
  assert.equal(requests.at(-1).url, '/api/3/forja/plugins/MiPlugin/translations/en_EN');
  assert.deepEqual(JSON.parse(result.content[0].text).files.map((file) => [file.lang, file.keys]), [['en_EN', 1]]);

  const empty = await toolsModule.handleForjaTool('forja_download_translations', {
    plugin: 'MiPlugin',
    plugin_path: pluginPath,
    lang: 'zz_ZZ',
  });
  const summary = JSON.parse(empty.content[0].text);
  assert.deepEqual(summary.files, []);
  assert.deepEqual(summary.empty_languages, ['zz_ZZ']);
  assert.equal(await readFile(path.join(pluginPath, 'Translation', 'zz_ZZ.json'), 'utf-8'), '{"local": "Local"}');
});

test('forja_upload_translations envía los archivos locales como JSON {idioma: {clave: valor}}', async () => {
  const pluginPath = path.join(tempDirectory, 'MiPlugin');
  await mkdir(path.join(pluginPath, 'Translation'), { recursive: true });
  await writeFile(path.join(pluginPath, 'Translation', 'ca_ES.json'), '{"hola": "Hola (ca)"}');

  const result = await toolsModule.handleForjaTool('forja_upload_translations', {
    plugin: 'MiPlugin',
    plugin_path: pluginPath,
    lang: 'ca_ES',
  });
  const body = JSON.parse(result.content[0].text);
  assert.equal(body.method, 'POST');
  assert.deepEqual(body.json, { ca_ES: { hola: 'Hola (ca)' } });

  const single = await toolsModule.handleForjaTool('forja_upload_translations', {
    plugin: 'MiPlugin',
    lang: 'es_ES',
    key: 'nueva',
    value: 'Nueva',
  });
  assert.deepEqual(JSON.parse(single.content[0].text).json, { es_ES: { nueva: 'Nueva' } });

  // un archivo sin claves no se envía: la forja rechazaría la subida entera
  await writeFile(path.join(pluginPath, 'Translation', 'gl_ES.json'), '{}');
  const all = JSON.parse((await toolsModule.handleForjaTool('forja_upload_translations', { plugin: 'MiPlugin', plugin_path: pluginPath })).content[0].text);
  assert.deepEqual(Object.keys(all.json).sort(), ['ca_ES', 'en_EN', 'es_ES']);
});

test('forja_create_publication lee el cuerpo de body_file y valida los parámetros', async () => {
  const bodyFile = path.join(tempDirectory, 'noticia.md');
  await writeFile(bodyFile, '# Novedades\n');

  const result = await toolsModule.handleForjaTool('forja_create_publication', {
    plugin: 'MiPlugin',
    type: 'news',
    title: 'Versión 2',
    title_short: 'V2',
    youtube: 'abc123def',
    color: 'info',
    body_file: bodyFile,
  });
  assert.deepEqual(JSON.parse(result.content[0].text).json, {
    type: 'news', title: 'Versión 2', title_short: 'V2', youtube: 'abc123def', color: 'info', body: '# Novedades\n',
  });

  // Con imágenes, la publicación se envía en multipart con los archivos en images[].
  const imagePath = path.join(tempDirectory, 'captura.png');
  await writeFile(imagePath, 'png');
  const withImages = await toolsModule.handleForjaTool('forja_create_publication', {
    plugin: 'MiPlugin',
    type: 'user',
    title: 'Guía',
    body: 'Texto',
    ordernum: 3,
    images: [imagePath],
  });
  assert.deepEqual(JSON.parse(withImages.content[0].text).multipart, {
    type: 'user',
    title: 'Guía',
    body: 'Texto',
    ordernum: '3',
    'images[]': { filename: 'captura.png', size: 3, text: 'png' },
  });

  const invalid = await toolsModule.handleForjaTool('forja_create_publication', {
    plugin: 'MiPlugin',
    type: 'news',
    title: 'Sin cuerpo',
    body_file: 'relativa.md',
  });
  assert.equal(invalid.isError, true);
  assert.match(invalid.content[0].text, /ruta absoluta/);

  const sent = requests.length;
  for (const [args, message] of [
    [{ plugin: 'MiPlugin', title: 'Sin tipo', body: 'x' }, /type\) o su publicación padre/],
    [{ plugin: 'MiPlugin', type: 'news', title: 'Color', body: 'x', color: 'rosa' }, /color debe ser/],
  ]) {
    const response = await toolsModule.handleForjaTool('forja_create_publication', args);
    assert.equal(response.isError, true);
    assert.match(response.content[0].text, message);
  }
  assert.equal(requests.length, sent);
});

test('forja_update_publication envía PATCH y, con imágenes, POST multipart sobre la publicación', async () => {
  const patch = JSON.parse((await toolsModule.handleForjaTool('forja_update_publication', { plugin: 'MiPlugin', id: 7, ordernum: 2 })).content[0].text);
  assert.equal(patch.method, 'PATCH');
  assert.equal(patch.path, '/api/3/forja/plugins/MiPlugin/publications/7');

  const imagePath = path.join(tempDirectory, 'otra.png');
  await writeFile(imagePath, 'png');
  await toolsModule.handleForjaTool('forja_update_publication', { plugin: 'MiPlugin', id: 7, images: [imagePath] });
  assert.equal(requests.at(-1).method, 'POST');
  assert.equal(requests.at(-1).url, '/api/3/forja/plugins/MiPlugin/publications/7');

  const deleted = JSON.parse((await toolsModule.handleForjaTool('forja_delete_publication', { plugin: 'MiPlugin', id: 7 })).content[0].text);
  assert.equal(deleted.method, 'DELETE');
  assert.equal(deleted.path, '/api/3/forja/plugins/MiPlugin/publications/7');
});

test('forja_set_build_status cambia el estado de una versión y valida versión y estado', async () => {
  const result = JSON.parse((await toolsModule.handleForjaTool('forja_set_build_status', { plugin: 'MiPlugin', version: '1.5', status: 'stable' })).content[0].text);
  assert.equal(result.method, 'PATCH');
  assert.equal(result.path, '/api/3/forja/plugins/MiPlugin/builds/1.5');
  assert.deepEqual(result.json, { status: 'stable' });

  const sent = requests.length;
  for (const args of [{ version: '1.5/../x', status: 'beta' }, { version: '1.5', status: 'publicada' }]) {
    const response = await toolsModule.handleForjaTool('forja_set_build_status', { plugin: 'MiPlugin', ...args });
    assert.equal(response.isError, true);
  }
  assert.equal(requests.length, sent);
});

test('los informes de error y las issues se piden con su filtro y su paginación', async () => {
  const errors = JSON.parse((await toolsModule.handleForjaTool('forja_list_errors', { plugin: 'MiPlugin', status: 'solved', limit: 10, offset: 20 })).content[0].text);
  assert.equal(errors.path, '/api/3/forja/plugins/MiPlugin/errors');
  assert.deepEqual(errors.query, { status: 'solved', limit: '10', offset: '20' });

  const error = JSON.parse((await toolsModule.handleForjaTool('forja_get_error', { plugin: 'MiPlugin', hash: 'abc123' })).content[0].text);
  assert.equal(error.path, '/api/3/forja/plugins/MiPlugin/errors/abc123');

  const issues = JSON.parse((await toolsModule.handleForjaTool('forja_list_issues', { plugin: 'MiPlugin', status: 'open' })).content[0].text);
  assert.equal(issues.path, '/api/3/forja/plugins/MiPlugin/issues');
  assert.deepEqual(issues.query, { status: 'open' });

  const issue = JSON.parse((await toolsModule.handleForjaTool('forja_get_issue', { plugin: 'MiPlugin', id: 12 })).content[0].text);
  assert.equal(issue.path, '/api/3/forja/plugins/MiPlugin/issues/12');

  const sent = requests.length;
  for (const [tool, args] of [['forja_list_errors', { status: 'abierto' }], ['forja_get_error', { hash: '../x' }], ['forja_get_issue', { id: 0 }]]) {
    const response = await toolsModule.handleForjaTool(tool, { plugin: 'MiPlugin', ...args });
    assert.equal(response.isError, true, tool);
  }
  assert.equal(requests.length, sent);
});

test('ignora la ruta /api/3/forja si la URL de la conexión ya la incluye', async () => {
  const result = await forjaModule.forjaClient.get('/plugins', undefined, 'forja-ruta');
  assert.equal(result.path, '/api/3/forja/plugins');
});

test('solo sube archivos locales con la extensión de su uso, también tras un enlace simbólico', async () => {
  const secret = path.join(tempDirectory, 'conexiones.json');
  await writeFile(secret, '{"token": "secreto"}');
  const disguised = path.join(tempDirectory, 'disfrazado.md');
  await symlink(secret, disguised);
  const sent = requests.length;

  for (const bodyFile of [secret, disguised]) {
    const result = await toolsModule.handleForjaTool('forja_create_publication', {
      plugin: 'MiPlugin', type: 'news', title: 'Fuga', body_file: bodyFile,
    });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /debe ser un archivo \.markdown, \.md, \.txt/);
  }

  const image = await toolsModule.handleForjaTool('forja_upload_plugin_image', { plugin: 'MiPlugin', image_path: secret });
  assert.equal(image.isError, true);

  // un .zip que no es un zip tampoco se sube
  const fakeZip = path.join(tempDirectory, 'falso.zip');
  await writeFile(fakeZip, 'no soy un zip');
  const build = await toolsModule.handleForjaTool('forja_upload_build', { plugin: 'MiPlugin', zip_path: fakeZip });
  assert.equal(build.isError, true);
  assert.match(build.content[0].text, /no es un archivo zip/);

  assert.equal(requests.length, sent, 'Ningún archivo rechazado debe llegar al servidor');
});

test('forja_build_zip empaqueta un plugin en su carpeta raíz y quita lo que no se reparte', async () => {
  const pluginPath = path.join(tempDirectory, 'carpeta-local');
  await createFiles(pluginPath, {
    'facturascripts.ini': "name = 'MiPlugin'\ndescription = 'Prueba'\nversion = 2.5 ; comentario\nmin_version = 2025\n",
    'Init.php': '<?php',
    'Controller/MiControlador.php': '<?php // controlador',
    'Lib/Doc/Ayuda.php': '<?php',
    'Lib/Agents.php': '<?php',
    'Test/main/MiTest.php': '<?php',
    'Doc/User/guia.md': '# Guía',
    'Doc/forja.json': '{}',
    'CLAUDE.md': '@AGENTS.md',
    'Lib/AGENTS.md': '# Agentes',
    'GEMINI.md': '# Gemini',
    'phpunit.xml.dist': '<phpunit/>',
    '.git/config': '[core]',
    '.claude/settings.json': '{}',
    '.DS_Store': '',
    'Assets/._foto.png': '',
    '__MACOSX/x': '',
    'Assets/Thumbs.db': '',
  });
  await symlink(path.join(pluginPath, 'Init.php'), path.join(pluginPath, 'Enlace.php'));

  const result = await toolsModule.handleForjaTool('forja_build_zip', { source_path: pluginPath });
  assert.equal(result.isError, undefined, result.content[0].text);
  const summary = JSON.parse(result.content[0].text);
  assert.equal(summary.type, 'plugin');
  assert.equal(summary.name, 'MiPlugin');
  assert.equal(summary.version, '2.5');
  assert.equal(summary.root, 'MiPlugin');
  assert.equal(path.basename(summary.path), 'MiPlugin-2.5.zip');
  assert.equal(summary.files, 5);
  assert.deepEqual(Object.keys(summary.excluded).sort(), ['ai', 'doc', 'hidden', 'phpunit', 'symlink', 'system', 'test']);
  assert.deepEqual(summary.excluded.ai.sample, ['CLAUDE.md', 'GEMINI.md', 'Lib/AGENTS.md']);
  assert.deepEqual(summary.excluded.phpunit.sample, ['phpunit.xml.dist']);
  assert.deepEqual(summary.excluded.doc.sample, ['Doc/']);

  const entries = await readZip(summary.path);
  assert.deepEqual([...entries.keys()].filter((name) => !name.endsWith('/')).sort(), [
    'MiPlugin/Controller/MiControlador.php',
    'MiPlugin/Init.php',
    'MiPlugin/Lib/Agents.php',
    'MiPlugin/Lib/Doc/Ayuda.php',
    'MiPlugin/facturascripts.ini',
  ]);
  assert.equal(entries.get('MiPlugin/Controller/MiControlador.php').content.toString(), '<?php // controlador');
  assert.equal(entries.get('MiPlugin/Init.php').mode, 0o100644);
  assert.equal(entries.get('MiPlugin/Controller/').mode, 0o040755);
  await rm(path.dirname(summary.path), { recursive: true, force: true });

});

test('forja_build_zip empaqueta el core en la carpeta facturascripts sin los datos de la instalación', async () => {
  const corePath = path.join(tempDirectory, 'core');
  await createFiles(corePath, {
    'Core/Kernel.php': '<?php class Kernel { public static function version(): float\n    {\n        return 2026.8;\n    } }',
    'index.php': '<?php',
    'replace_index_to_restore.php': '<?php',
    'vendor/autoload.php': '<?php',
    'node_modules/jquery/jquery.js': '',
    'config.php': '<?php // claves de la base de datos',
    'config-mysql.php': '<?php',
    'Plugins/MiPlugin/Init.php': '<?php',
    'Dinamic/Model/Cliente.php': '<?php',
    'MyFiles/factura.pdf': 'pdf',
    'Test/main/KernelTest.php': '<?php',
    'AGENTS.md': '# Agentes',
  });

  const result = await toolsModule.handleForjaTool('forja_build_zip', { source_path: corePath });
  assert.equal(result.isError, undefined, result.content[0].text);
  const summary = JSON.parse(result.content[0].text);
  assert.equal(summary.type, 'core');
  assert.equal(summary.version, '2026.8');
  assert.equal(path.basename(summary.path), 'facturascripts-2026.8.zip');
  assert.deepEqual(summary.excluded.core.sample, ['Dinamic/', 'MyFiles/', 'Plugins/', 'config-mysql.php', 'config.php']);

  const names = [...(await readZip(summary.path)).keys()].filter((name) => !name.endsWith('/')).sort();
  assert.deepEqual(names, [
    'facturascripts/Core/Kernel.php',
    'facturascripts/index.php',
    'facturascripts/node_modules/jquery/jquery.js',
    'facturascripts/replace_index_to_restore.php',
    'facturascripts/vendor/autoload.php',
  ]);
  await rm(path.dirname(summary.path), { recursive: true, force: true });

  // sin vendor, el actualizador del core no podría instalarlo
  await rm(path.join(corePath, 'vendor'), { recursive: true });
  const missing = await toolsModule.handleForjaTool('forja_build_zip', { source_path: corePath });
  assert.equal(missing.isError, true);
  assert.match(missing.content[0].text, /Falta la carpeta vendor/);
});

test('forja_build_zip rechaza carpetas que Forja no aceptaría', async () => {
  const notProject = await toolsModule.handleForjaTool('forja_build_zip', { source_path: tempDirectory });
  assert.equal(notProject.isError, true);
  assert.match(notProject.content[0].text, /no es un plugin ni el core/);

  const badVersion = path.join(tempDirectory, 'sin-version');
  await createFiles(badVersion, { 'facturascripts.ini': 'name = OtroPlugin\nversion = 1.0-beta\n' });
  const version = await toolsModule.handleForjaTool('forja_build_zip', { source_path: badVersion });
  assert.match(version.content[0].text, /version válida/);

  const composer = path.join(tempDirectory, 'con-composer');
  await createFiles(composer, { 'facturascripts.ini': 'name = OtroPlugin\nversion = 1\n', 'composer.json': '{}' });
  const noVendor = await toolsModule.handleForjaTool('forja_build_zip', { source_path: composer });
  assert.equal(noVendor.isError, true);
  assert.match(noVendor.content[0].text, /composer\.json en la raíz pero no la carpeta vendor/);

  const relative = await toolsModule.handleForjaTool('forja_build_zip', { source_path: 'Plugins/MiPlugin' });
  assert.match(relative.content[0].text, /ruta absoluta/);
});

test('forja_upload_build borra el zip de forja_build_zip tras subirlo, salvo keep_zip, y nunca uno del usuario', async () => {
  const pluginPath = path.join(tempDirectory, 'para-subir');
  await createFiles(pluginPath, { 'facturascripts.ini': 'name = MiPlugin\nversion = 3\n', 'Init.php': '<?php' });
  const build = async () => JSON.parse((await toolsModule.handleForjaTool('forja_build_zip', { source_path: pluginPath })).content[0].text).path;

  // por defecto, se borra el zip y su carpeta temporal
  const first = await build();
  const uploaded = JSON.parse((await toolsModule.handleForjaTool('forja_upload_build', { plugin: 'MiPlugin', zip_path: first })).content[0].text);
  assert.equal(uploaded.multipart.zip.filename, 'MiPlugin-3.zip');
  assert.equal(uploaded.local_zip.deleted, true);
  assert.equal(await exists(first), false);
  assert.equal(await exists(path.dirname(first)), false);

  // con keep_zip, se conserva
  const second = await build();
  const kept = JSON.parse((await toolsModule.handleForjaTool('forja_upload_build', { plugin: 'MiPlugin', zip_path: second, keep_zip: true })).content[0].text);
  assert.equal(kept.local_zip.deleted, false);
  assert.equal(await exists(second), true);
  await rm(path.dirname(second), { recursive: true, force: true });

  // un zip del usuario no se borra, aunque esté en la carpeta temporal del sistema
  const userZip = path.join(tempDirectory, 'MiPlugin-usuario.zip');
  await writeFile(userZip, ZIP_BYTES);
  const user = JSON.parse((await toolsModule.handleForjaTool('forja_upload_build', { plugin: 'MiPlugin', zip_path: userZip })).content[0].text);
  assert.equal(user.local_zip.deleted, false);
  assert.equal(await exists(userZip), true);

  // si la carpeta temporal de la herramienta deja de ser solo del usuario, sus zips no se borran
  const exposed = await build();
  const base = path.dirname(path.dirname(exposed));
  await chmod(base, 0o777);
  const unsafe = JSON.parse((await toolsModule.handleForjaTool('forja_upload_build', { plugin: 'MiPlugin', zip_path: exposed })).content[0].text);
  assert.equal(unsafe.local_zip.deleted, false);
  assert.equal(await exists(exposed), true);
  await rm(path.dirname(exposed), { recursive: true, force: true });

  // al crear el siguiente zip, la carpeta vuelve a quedar solo para el usuario
  const third = await build();
  assert.equal((await stat(base)).mode & 0o777, 0o700);

  // si la subida falla, el zip de la herramienta se conserva
  const failed = await toolsModule.handleForjaTool('forja_upload_build', { plugin: 'Ajeno', zip_path: third });
  assert.equal(failed.isError, true);
  assert.equal(await exists(third), true);
  await rm(path.dirname(third), { recursive: true, force: true });
});

/** Texto de relleno para que las páginas de prueba superen los 300 caracteres que exige la forja. */
const FILLER = 'Texto de la página de prueba con suficiente longitud para que la forja lo acepte. '.repeat(5);

test('forja_publish_doc_page crea la página con sus datos de forja.json y coloca las imágenes en su sitio', async () => {
  const pluginPath = path.join(tempDirectory, 'DocPlugin');
  await createFiles(pluginPath, {
    'Doc/User/inicio.md': `Introducción.\n\n![Pantalla](../Assets/inicio.png)\n\n${FILLER}\n\nSigue en [la guía](guia.md#pasos).\n`,
    'Doc/User/guia.md': `${FILLER}\n\n![Paso 1](../Assets/paso%201.png)\n![Otra vez](../Assets/inicio.png)\n\nVuelve al [inicio](inicio.md).\n`,
    'Doc/Assets/inicio.png': 'png-inicio',
    'Doc/Assets/paso 1.png': 'png-paso',
    'Doc/forja.json': JSON.stringify({
      User: {
        'inicio.md': { title: 'Inicio', ordernum: 1, icon: 'fa-solid fa-house', youtubeid: 'abc123def', permalink: 'inicio', visibility: true },
        'guia.md': { title: 'Guía', parent: 'inicio.md', controllers: 'ListCliente,EditCliente' },
      },
      Dev: {},
    }),
  });

  // dry_run no publica ni cambia forja.json
  const sentBefore = requests.length;
  const dry = JSON.parse((await toolsModule.handleForjaTool('forja_publish_doc_page', {
    plugin: 'DocPlugin', plugin_path: pluginPath, page: 'User/inicio.md', dry_run: true,
  })).content[0].text);
  assert.equal(dry.dry_run, true);
  assert.equal(dry.action, 'create');
  assert.deepEqual(dry.images.upload, ['Assets/inicio.png']);
  assert.deepEqual(dry.links.unresolved, ['User/guia.md']);
  assert.deepEqual(dry.ignored_fields.map((field) => field.split(':')[0]), ['permalink']);
  assert.equal(requests.slice(sentBefore).filter((request) => request.method !== 'GET').length, 0);
  assert.equal(JSON.parse(await readFile(path.join(pluginPath, 'Doc/forja.json'), 'utf-8')).User['inicio.md'].idpublication, undefined);

  // la página hija no se puede publicar antes que su padre
  const orphan = await toolsModule.handleForjaTool('forja_publish_doc_page', { plugin: 'DocPlugin', plugin_path: pluginPath, page: 'User/guia.md' });
  assert.equal(orphan.isError, true);
  assert.match(orphan.content[0].text, /Publica antes la página padre User\/inicio\.md/);

  const created = JSON.parse((await toolsModule.handleForjaTool('forja_publish_doc_page', {
    plugin: 'DocPlugin', plugin_path: pluginPath, page: 'Doc/User/inicio.md',
  })).content[0].text);
  assert.equal(created.action, 'created');
  const publication = docPublications.get(created.id);
  assert.equal(publication.fields.type, 'user');
  assert.equal(publication.fields.title, 'Inicio');
  assert.equal(publication.fields.ordernum, '1');
  assert.equal(publication.fields.youtube, 'abc123def');
  assert.equal(publication.fields.permalink, undefined);
  // la imagen está donde la puso el autor y no al final; el enlace a la guía, sin publicar, se deja igual
  assert.match(publication.body, /^Introducción\.\n\n!\[Pantalla\]\(https:\/\/forja\.test\/MyFiles\/2026\/11\/\d+_forja_inicio\.png\?myft=t\)/);
  assert.doesNotMatch(publication.body, /\n\n!\[\]\(/);
  assert.match(publication.body, /\[la guía\]\(guia\.md#pasos\)/);

  const forjaJson = JSON.parse(await readFile(path.join(pluginPath, 'Doc/forja.json'), 'utf-8'));
  assert.equal(forjaJson.User['inicio.md'].idpublication, created.id);
  assert.match(forjaJson.User['inicio.md'].assets['Assets/inicio.png'].url, /_inicio\.png/);

  // la guía: hereda el padre, reutiliza la imagen ya subida y enlaza la página publicada
  const uploadsBefore = uploadedImages;
  const guideRaw = (await toolsModule.handleForjaTool('forja_publish_doc_page', {
    plugin: 'DocPlugin', plugin_path: pluginPath, page: path.join(pluginPath, 'Doc/User/guia.md'),
  }));
  assert.equal(guideRaw.isError, undefined, guideRaw.content[0].text);
  const guide = JSON.parse(guideRaw.content[0].text);
  assert.deepEqual(guide.images, { upload: ['Assets/paso 1.png'], reuse: ['Assets/inicio.png'] });
  assert.equal(uploadedImages, uploadsBefore + 1);
  const guideBody = docPublications.get(guide.id).body;
  assert.equal(docPublications.get(guide.id).fields.idparent, String(created.id));
  assert.match(guideBody, /!\[Paso 1\]\(https:\/\/forja\.test\/MyFiles\/2026\/11\/\d+_forja_paso_1\.png\?myft=t\)/);
  assert.match(guideBody, new RegExp(`!\\[Otra vez\\]\\(${forjaJson.User['inicio.md'].assets['Assets/inicio.png'].url.replace(/[.?]/g, '\\$&')}\\)`));
  // los enlaces van relativos al sitio, como los que se escriben en la web
  assert.match(guideBody, new RegExp(`\\[inicio\\]\\(/publication/${created.id}\\)`));

  // al volver a publicar el inicio, la guía ya está publicada: se enlaza y no se sube ninguna imagen
  const again = JSON.parse((await toolsModule.handleForjaTool('forja_publish_doc_page', {
    plugin: 'DocPlugin', plugin_path: pluginPath, page: 'User/inicio.md',
  })).content[0].text);
  assert.equal(again.action, 'updated');
  assert.equal(again.id, created.id);
  assert.deepEqual(again.images.upload, []);
  assert.equal(uploadedImages, uploadsBefore + 1);
  assert.equal(requests.at(-1).method, 'PATCH');
  assert.match(docPublications.get(created.id).body, new RegExp(`\\[la guía\\]\\(/publication/${guide.id}#pasos\\)`));

  // si la imagen cambia, se vuelve a subir
  await writeFile(path.join(pluginPath, 'Doc/Assets/inicio.png'), 'png-nueva');
  const changed = JSON.parse((await toolsModule.handleForjaTool('forja_publish_doc_page', {
    plugin: 'DocPlugin', plugin_path: pluginPath, page: 'User/inicio.md',
  })).content[0].text);
  assert.deepEqual(changed.images.upload, ['Assets/inicio.png']);
});

test('forja_publish_doc_page rechaza páginas cortas, sin título, fuera de Doc o con imágenes que no existen', async () => {
  const pluginPath = path.join(tempDirectory, 'DocErrores');
  await createFiles(pluginPath, {
    'Doc/User/corta.md': 'Muy corta.',
    'Doc/User/sin-titulo.md': FILLER,
    'Doc/User/rota.md': `${FILLER}\n![](../Assets/no-existe.png)`,
    'Doc/User/fuera.md': `${FILLER}\n![](../../secreto.png)`,
    'Doc/Context/README.md': FILLER,
    'secreto.png': 'png',
    'Doc/forja.json': JSON.stringify({
      User: { 'corta.md': { title: 'Corta' }, 'rota.md': { title: 'Rota' }, 'fuera.md': { title: 'Fuera' }, 'sin-titulo.md': {} },
      Dev: {},
    }),
  });
  const sent = requests.length;
  for (const [page, message] of [
    ['User/corta.md', /al menos 300/],
    ['User/sin-titulo.md', /Falta el title/],
    ['User/rota.md', /no existe/],
    ['User/fuera.md', /fuera de Doc/],
    ['Context/README.md', /Doc\/User o Doc\/Dev/],
    ['User/no-existe.md', /No existe la página/],
  ]) {
    const response = await toolsModule.handleForjaTool('forja_publish_doc_page', { plugin: 'DocPlugin', plugin_path: pluginPath, page });
    assert.equal(response.isError, true, page);
    assert.match(response.content[0].text, message, page);
  }
  assert.equal(requests.slice(sent).filter((request) => request.method !== 'GET').length, 0);

  // un idpublication que ya no existe en la forja no crea otra publicación a escondidas
  await writeFile(path.join(pluginPath, 'Doc/forja.json'), JSON.stringify({ User: { 'sin-titulo.md': { title: 'Vieja', idpublication: 9999 } }, Dev: {} }));
  const stale = await toolsModule.handleForjaTool('forja_publish_doc_page', { plugin: 'DocPlugin', plugin_path: pluginPath, page: 'User/sin-titulo.md' });
  assert.equal(stale.isError, true);
  assert.match(stale.content[0].text, /ya no existe en la forja/);
});

test('sitePath deja relativa al sitio la URL de una publicación y no toca lo que no es http(s)', async () => {
  const { sitePath } = await import(pathToFileURL(path.join(buildDirectory, 'modules', 'forja', 'doc-page.js')).href);
  assert.equal(sitePath('https://facturascripts.com/publicaciones/mi-pagina'), '/publicaciones/mi-pagina');
  assert.equal(sitePath('https://forja.localhost/publicaciones/x?lang=es'), '/publicaciones/x?lang=es');
  assert.equal(sitePath('/publicaciones/ya-relativa'), '/publicaciones/ya-relativa');
  assert.equal(sitePath('mailto:hola@example.com'), 'mailto:hola@example.com');
});
