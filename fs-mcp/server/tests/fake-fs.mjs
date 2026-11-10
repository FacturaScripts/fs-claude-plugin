/**
 * FacturaScripts de pega para las pruebas: un servidor HTTP en loopback que
 * registra cada petición (método, ruta y cabeceras) y responde con lo que
 * devuelva `responder` o, por defecto, con una lista vacía.
 *
 * La ruta se registra tal como llega por la red, sin decodificar (`req.url`),
 * igual que la ve el core: su API tampoco la decodifica.
 */

import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

/**
 * @param {(req: http.IncomingMessage) => unknown} [responder] Cuerpo JSON de la respuesta.
 * @returns {Promise<{url: string, peticiones: Array<{method: string, path: string, headers: http.IncomingHttpHeaders}>, cerrar: () => Promise<void>}>}
 */
export async function arrancarFsDePega(responder = () => []) {
  const peticiones = [];
  const server = http.createServer((req, res) => {
    peticiones.push({ method: req.method, path: req.url, headers: req.headers });
    req.resume();
    req.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(responder(req)));
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}`,
    peticiones,
    cerrar: () => new Promise((resolve) => server.close(() => resolve())),
  };
}

/**
 * Escribe un archivo de conexiones temporal y apunta FS_CONNECTIONS_FILE a él.
 * Hay que llamarla ANTES de importar dist/, porque el gestor de conexiones lo
 * lee al cargarse.
 *
 * @param {{default: string, connections: Record<string, {name: string, url: string, token: string}>}} config
 * @returns {() => void} Borra el directorio temporal.
 */
export function usarConexiones(config) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-mcp-test-'));
  const file = path.join(dir, 'connections.json');
  fs.writeFileSync(file, JSON.stringify(config), 'utf-8');
  process.env.FS_CONNECTIONS_FILE = file;
  return () => fs.rmSync(dir, { recursive: true, force: true });
}
