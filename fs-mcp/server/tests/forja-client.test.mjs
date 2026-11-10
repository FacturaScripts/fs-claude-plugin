/**
 * Pruebas del cliente de la API de autor de Forja y de las herramientas forja_*.
 *
 * Levanta un servidor HTTP local que imita `/api/3/forja` y comprueba la cabecera X-Forja-Token, el envío de
 * JSON sin el envoltorio filter[], la subida multipart, la descarga del zip a disco y los errores 401 y 404.
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
    // un idioma sin traducciones: PHP devuelve el array vacío como []
    if (lang === 'zz_ZZ') {
      sendJson(res, 200, []);
      return;
    }
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

test('forja_download_translations acepta la respuesta [] de un plugin sin traducciones', async () => {
  const pluginPath = path.join(tempDirectory, 'SinTraducciones');
  await mkdir(pluginPath, { recursive: true });

  const result = await toolsModule.handleForjaTool('forja_download_translations', {
    plugin: 'MiPlugin',
    plugin_path: pluginPath,
    lang: 'zz_ZZ',
  });
  assert.equal(result.isError, undefined, result.content[0].text);
  assert.deepEqual(JSON.parse(result.content[0].text).files, []);
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

test('forja_delete_translations envía key y lang en la query del DELETE', async () => {
  const single = await toolsModule.handleForjaTool('forja_delete_translations', { plugin: 'MiPlugin', key: 'hola', lang: 'es_ES' });
  const body = JSON.parse(single.content[0].text);
  assert.equal(body.method, 'DELETE');
  assert.equal(body.path, '/api/3/forja/plugins/MiPlugin/translations');
  assert.deepEqual(body.query, { key: 'hola', lang: 'es_ES' });
  assert.equal(body.json, null);

  const all = await toolsModule.handleForjaTool('forja_delete_translations', { plugin: 'MiPlugin', all: true });
  assert.deepEqual(JSON.parse(all.content[0].text).query, { all: 'true' });
});

test('forja_delete_translations no borra nada sin parámetros ni mezcla all con key o lang', async () => {
  const sent = requests.length;
  const invalid = [
    [{ plugin: 'MiPlugin' }, /Indica key, lang o ambos/],
    [{ plugin: 'MiPlugin', all: false }, /Indica key, lang o ambos/],
    [{ plugin: 'MiPlugin', all: true, lang: 'es_ES' }, /all no se combina/],
    [{ plugin: 'MiPlugin', lang: 'español' }, /Código de idioma no válido/],
  ];
  for (const [args, message] of invalid) {
    const response = await toolsModule.handleForjaTool('forja_delete_translations', args);
    assert.equal(response.isError, true, JSON.stringify(args));
    assert.match(response.content[0].text, message);
  }
  assert.equal(requests.length, sent, 'Las llamadas no válidas no deben llegar al servidor');
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
  assert.deepEqual(Object.keys(summary.excluded).sort(), ['ai', 'doc', 'hidden', 'symlink', 'system', 'test']);
  assert.deepEqual(summary.excluded.ai.sample, ['CLAUDE.md', 'Lib/AGENTS.md']);
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

  // con include_docs entra la documentación que Forja importa, pero no Doc/Context
  await createFiles(pluginPath, { 'Doc/Context/README.md': 'contexto', 'Doc/Assets/captura.png': 'png', 'Doc/notas.txt': 'notas' });
  const withDocs = JSON.parse((await toolsModule.handleForjaTool('forja_build_zip', { source_path: pluginPath, include_docs: true })).content[0].text);
  const docNames = [...(await readZip(withDocs.path)).keys()].filter((name) => name.startsWith('MiPlugin/Doc/') && !name.endsWith('/')).sort();
  assert.deepEqual(docNames, ['MiPlugin/Doc/Assets/captura.png', 'MiPlugin/Doc/User/guia.md', 'MiPlugin/Doc/forja.json']);
  assert.deepEqual(withDocs.excluded.doc.sample, ['Doc/Context/', 'Doc/notas.txt']);
  await rm(path.dirname(withDocs.path), { recursive: true, force: true });
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
