/**
 * Prueba de que el cliente de la API REST /api/3 rechaza las conexiones de tipo forja, que son del plugin fs-forja,
 * sin enviar su token de autor a ninguna parte.
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { arrancarFsDePega, usarConexiones } from './fake-fs.mjs';

const fs = await arrancarFsDePega();

// Archivo de conexiones aislado antes de importar build/: el gestor lo lee al cargarse
const borrar = usarConexiones({
  default: 'erp',
  connections: {
    erp: { name: 'ERP', url: fs.url, token: 'token-api' },
    'forja-autor': { name: 'Forja autor', url: fs.url, token: 'token-autor', type: 'forja' },
  },
});
const { fsClient } = await import('../build/fs/client.js');

test.after(async () => {
  await fs.cerrar();
  borrar();
});

test('el cliente de la API /api/3 rechaza las conexiones de tipo forja y remite a fs-forja', async () => {
  await assert.rejects(fsClient.get('/clientes', {}, 'forja-autor'), /tipo forja.*fs-forja/s);
  assert.deepEqual(fs.peticiones, []);
});
