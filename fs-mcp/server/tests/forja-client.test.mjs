/**
 * Pruebas del cliente de la API de autor de Forja y de las herramientas forja_*.
 *
 * Levanta un servidor HTTP local que imita `/api/3/forja` y comprueba la cabecera X-Forja-Token, el envío de
 * JSON sin el envoltorio filter[], la subida multipart, la descarga del zip a disco y los errores 401 y 404.
 */

import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(serverDirectory, 'dist');
const TOKEN = 'token-de-prueba';
const ZIP_BYTES = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0xff, 0x10, 0x20]);

/** @type {string} */
let tempDirectory;
/** @type {http.Server} */
let server;
/** @type {Array<{method: string, url: string, headers: http.IncomingHttpHeaders, body: Buffer}>} */
const requests = [];
/** @type {import('../dist/fs/forja-client.js')} */
let forjaModule;
/** @type {import('../dist/modules/forja/index.js')} */
let toolsModule;
/** @type {import('../dist/fs/client.js')} */
let apiModule;

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

  if (url.pathname === '/api/3/forja/plugin-options') {
    sendJson(res, 200, { can_create: true, quota: { plugins: 1, limit: 5, activeinstalls: 0 }, types: ['free', 'private'] });
    return;
  }

  const match = url.pathname.match(/^\/api\/3\/forja\/plugins(?:\/([^/]+))?(?:\/(.*))?$/);
  if (!match) {
    sendJson(res, 404, { code: 'not-found', message: 'Ruta desconocida' });
    return;
  }
  const [, plugin, rest] = match;
  if (plugin !== undefined && decodeURIComponent(plugin) !== 'MiPlugin') {
    sendJson(res, 404, { code: 'plugin-not-found', message: 'Plugin no encontrado' });
    return;
  }

  if (rest === 'docs' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/zip' });
    res.end(ZIP_BYTES);
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

  if (rest === 'translations' && req.method === 'GET') {
    const all = { es_ES: { hola: 'Hola', adios: 'Adiós' }, en_EN: { hola: 'Hello' } };
    const lang = url.searchParams.get('lang');
    sendJson(res, 200, lang ? { [lang]: all[lang] } : all);
    return;
  }

  sendJson(res, 200, {
    method: req.method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    json: body.length > 0 ? JSON.parse(body.toString('utf-8')) : null,
  });
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

  forjaModule = await import(pathToFileURL(path.join(distDirectory, 'fs', 'forja-client.js')).href);
  toolsModule = await import(pathToFileURL(path.join(distDirectory, 'modules', 'forja', 'index.js')).href);
  apiModule = await import(pathToFileURL(path.join(distDirectory, 'fs', 'client.js')).href);
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
  const result = await forjaModule.forjaClient.sendJson('PATCH', '/plugins/MiPlugin', { description_short: 'Corta' });
  assert.equal(result.method, 'PATCH');
  assert.deepEqual(result.json, { description_short: 'Corta' });
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
    forjaModule.forjaClient.sendMultipart('POST', '/plugins/MiPlugin/docs', {}, [
      { field: 'docs', path: path.join(tempDirectory, 'no-existe.zip') },
    ]),
    /No existe el archivo/
  );
  assert.equal(requests.length, before);
});

test('descarga el zip de documentación a disco creando la carpeta', async () => {
  const output = path.join(tempDirectory, 'salida', 'docs', 'MiPlugin-docs.zip');
  const result = await forjaModule.forjaClient.download('/plugins/MiPlugin/docs', { type: 'all' }, output);
  assert.equal(result.path, output);
  assert.equal(result.bytes, ZIP_BYTES.length);
  assert.equal(result.contentType, 'application/zip');
  assert.deepEqual(await readFile(output), ZIP_BYTES);
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

test('devuelve errores 404 legibles también en descargas binarias', async () => {
  await assert.rejects(
    forjaModule.forjaClient.download('/plugins/Ajeno/docs', { type: 'all' }, path.join(tempDirectory, 'ajeno.zip')),
    (error) => {
      assert.equal(error.status, 404);
      assert.equal(error.code, 'plugin-not-found');
      assert.match(error.message, /Plugin no encontrado/);
      assert.match(error.message, /no eres su autor/);
      return true;
    }
  );
});

test('handleForjaTool ignora las herramientas ajenas', async () => {
  assert.equal(await toolsModule.handleForjaTool('get_publications', {}), null);
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
});

test('forja_create_publication lee el cuerpo de body_file y valida los parámetros', async () => {
  const bodyFile = path.join(tempDirectory, 'noticia.md');
  await writeFile(bodyFile, '# Novedades\n');

  const result = await toolsModule.handleForjaTool('forja_create_publication', {
    plugin: 'MiPlugin',
    type: 'news',
    title: 'Versión 2',
    body_file: bodyFile,
  });
  assert.deepEqual(JSON.parse(result.content[0].text).json, { type: 'news', title: 'Versión 2', body: '# Novedades\n' });

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
});

test('forja_get_plugin_options consulta el cupo y las opciones de alta', async () => {
  const result = await toolsModule.handleForjaTool('forja_get_plugin_options', {});
  assert.equal(result.isError, undefined);
  const data = JSON.parse(result.content[0].text);
  assert.equal(data.can_create, true);
  assert.equal(data.quota.limit, 5);
});

test('forja_create_plugin envía los datos como JSON y valida nombre, descripción, tipo y precio antes de enviar', async () => {
  const result = await toolsModule.handleForjaTool('forja_create_plugin', {
    name: 'NuevoPlugin',
    description: 'Qué hace',
    type: 'for-sale',
    price: 25,
    idteam: 7,
  });
  const data = JSON.parse(result.content[0].text);
  assert.equal(data.method, 'POST');
  assert.equal(data.path, '/api/3/forja/plugins');
  assert.deepEqual(data.json, { name: 'NuevoPlugin', description: 'Qué hace', type: 'for-sale', price: 25 });

  const sent = requests.length;
  const invalid = [
    [{ name: '1-no-vale', description: 'Algo', type: 'free' }, /no es un nombre válido/],
    [{ name: 'OtroPlugin', type: 'free' }, /description es obligatorio/],
    [{ name: 'OtroPlugin', description: 'Algo' }, /type es obligatorio/],
    [{ name: 'OtroPlugin', description: 'Algo', type: 'gratis' }, /type debe ser/],
    [{ name: 'OtroPlugin', description: 'Algo', type: 'free', price: 10 }, /Solo los plugins de tipo for-sale/],
    [{ name: 'OtroPlugin', description: 'Algo', type: 'for-sale', price: -1 }, /price debe ser un número/],
  ];
  for (const [args, message] of invalid) {
    const response = await toolsModule.handleForjaTool('forja_create_plugin', args);
    assert.equal(response.isError, true, JSON.stringify(args));
    assert.match(response.content[0].text, message);
  }
  assert.equal(requests.length, sent, 'Los datos no válidos no deben llegar al servidor');
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

test('la descarga de documentación solo escribe zips y no sustituye otros archivos', async () => {
  const notZip = await toolsModule.handleForjaTool('forja_download_docs', {
    plugin: 'MiPlugin', output_zip: path.join(tempDirectory, 'docs.json'),
  });
  assert.equal(notZip.isError, true);
  assert.match(notZip.content[0].text, /debe acabar en \.zip/);

  const existing = path.join(tempDirectory, 'importante.zip');
  await writeFile(existing, 'contenido que no es un zip');
  const overwrite = await toolsModule.handleForjaTool('forja_download_docs', { plugin: 'MiPlugin', output_zip: existing });
  assert.equal(overwrite.isError, true);
  assert.equal(await readFile(existing, 'utf-8'), 'contenido que no es un zip');

  // encima de otro zip, sí
  const again = await toolsModule.handleForjaTool('forja_download_docs', { plugin: 'MiPlugin', output_zip: existing });
  assert.equal(again.isError, true, 'el archivo existente no es un zip');
  const zipPath = path.join(tempDirectory, 'otra', 'docs.zip');
  await toolsModule.handleForjaTool('forja_download_docs', { plugin: 'MiPlugin', output_zip: zipPath });
  const second = await toolsModule.handleForjaTool('forja_download_docs', { plugin: 'MiPlugin', output_zip: zipPath });
  assert.equal(second.isError, undefined);
});
