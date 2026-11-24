/**
 * Pruebas de checkUploadPath: qué archivos locales pueden subir a FacturaScripts
 * las tools de los plugins oficiales y cuáles se rechazan por seguridad.
 */

import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import test from 'node:test';

const { checkUploadPath } = await import('../build/plugins/shared/upload.js');

/** Crea un home de pruebas con un archivo válido y varios protegidos. */
function crearHome() {
  const home = realpathSync(mkdtempSync(join(tmpdir(), 'fs-mcp-home-')));
  const escribir = (relativa, contenido = 'x') => {
    const ruta = join(home, relativa);
    mkdirSync(join(ruta, '..'), { recursive: true });
    writeFileSync(ruta, contenido);
    return ruta;
  };
  return { home, escribir, limpiar: () => rmSync(home, { recursive: true, force: true }) };
}

test('acepta un archivo normal y devuelve su ruta real, su nombre y su tamaño', async () => {
  const { home, escribir, limpiar } = crearHome();
  try {
    const ruta = escribir('Documentos/oferta.pdf', 'contenido');
    const resultado = await checkUploadPath(ruta, { home });
    assert.deepEqual(resultado, { ok: true, file: { path: ruta, name: 'oferta.pdf', size: 9 } });
  } finally {
    limpiar();
  }
});

test('rechaza rutas vacías, relativas o que no existen', async () => {
  const { home, limpiar } = crearHome();
  try {
    for (const ruta of [undefined, '', 'oferta.pdf', '../oferta.pdf', join(home, 'no-existe.pdf')]) {
      const resultado = await checkUploadPath(ruta, { home });
      assert.equal(resultado.ok, false, `debería rechazar ${String(ruta)}`);
    }
  } finally {
    limpiar();
  }
});

test('rechaza archivos ocultos, carpetas ocultas y la configuración de fs-mcp', async () => {
  const { home, escribir, limpiar } = crearHome();
  try {
    for (const relativa of ['.fs-ai.json', '.fs-claude.json', '.ssh/id_ed25519', '.aws/credentials', 'web/.env']) {
      const resultado = await checkUploadPath(escribir(relativa), { home });
      assert.equal(resultado.ok, false, `debería rechazar ${relativa}`);
    }
  } finally {
    limpiar();
  }
});

test('rechaza las carpetas de datos de aplicaciones y las claves o certificados', async () => {
  const { home, escribir, limpiar } = crearHome();
  try {
    const protegidos = [
      'Library/Keychains/login.keychain-db',
      'Library/Application Support/Google/Chrome/Default/Cookies',
      'AppData/Roaming/datos.db',
      'Documentos/servidor.pem',
      'Documentos/privada.KEY',
      'Documentos/id_rsa',
      'Documentos/claves.kdbx',
    ];
    for (const relativa of protegidos) {
      const resultado = await checkUploadPath(escribir(relativa), { home });
      assert.equal(resultado.ok, false, `debería rechazar ${relativa}`);
    }
  } finally {
    limpiar();
  }
});

test('rechaza un enlace simbólico visible que apunta a un archivo protegido', async () => {
  const { home, escribir, limpiar } = crearHome();
  try {
    const secreto = escribir('.fs-ai.json', '{"connections":{}}');
    const enlace = join(home, 'Documentos', 'inofensivo.txt');
    mkdirSync(join(home, 'Documentos'), { recursive: true });
    symlinkSync(secreto, enlace);
    const resultado = await checkUploadPath(enlace, { home });
    assert.equal(resultado.ok, false);
    assert.match(resultado.error, /configuración de fs-mcp/);
  } finally {
    limpiar();
  }
});

test('rechaza el archivo de conexiones indicado en FS_CONNECTIONS_FILE', async () => {
  const { home, escribir, limpiar } = crearHome();
  const anterior = process.env.FS_CONNECTIONS_FILE;
  try {
    const conexiones = escribir('datos/connections.json', '{}');
    process.env.FS_CONNECTIONS_FILE = conexiones;
    const resultado = await checkUploadPath(conexiones, { home });
    assert.equal(resultado.ok, false);
    assert.match(resultado.error, /configuración de fs-mcp/);
  } finally {
    if (anterior === undefined) delete process.env.FS_CONNECTIONS_FILE;
    else process.env.FS_CONNECTIONS_FILE = anterior;
    limpiar();
  }
});

test('rechaza el archivo de FS_CONNECTIONS_FILE aunque la variable tenga una ruta relativa', async () => {
  const { home, escribir, limpiar } = crearHome();
  const anterior = process.env.FS_CONNECTIONS_FILE;
  try {
    const conexiones = escribir('datos/connections.json', '{}');
    process.env.FS_CONNECTIONS_FILE = relative(process.cwd(), conexiones);
    const resultado = await checkUploadPath(conexiones, { home });
    assert.equal(resultado.ok, false);
    assert.match(resultado.error, /configuración de fs-mcp/);
  } finally {
    if (anterior === undefined) delete process.env.FS_CONNECTIONS_FILE;
    else process.env.FS_CONNECTIONS_FILE = anterior;
    limpiar();
  }
});

test('rechaza carpetas, dispositivos y archivos que superan el tamaño máximo', async () => {
  const { home, escribir, limpiar } = crearHome();
  try {
    mkdirSync(join(home, 'Documentos'), { recursive: true });
    assert.equal((await checkUploadPath(join(home, 'Documentos'), { home })).ok, false);
    assert.equal((await checkUploadPath('/dev/null', { home })).ok, false);

    const grande = escribir('Documentos/grande.bin', 'x'.repeat(2048));
    const resultado = await checkUploadPath(grande, { home, maxBytes: 1024 });
    assert.equal(resultado.ok, false);
    assert.match(resultado.error, /ocupa más/);
  } finally {
    limpiar();
  }
});
