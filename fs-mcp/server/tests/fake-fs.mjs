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
 * El responder puede devolver el cuerpo JSON o `{ status, body }` envuelto con
 * `respuesta()` para contestar con otro código HTTP. Cada petición registra
 * también su cuerpo (`body`) tal como llega.
 *
 * @param {(req: http.IncomingMessage, body: string) => unknown} [responder] Cuerpo JSON de la respuesta.
 * @returns {Promise<{url: string, peticiones: Array<{method: string, path: string, headers: http.IncomingHttpHeaders, body: string}>, cerrar: () => Promise<void>}>}
 */
export async function arrancarFsDePega(responder = () => []) {
  const peticiones = [];
  const server = http.createServer((req, res) => {
    const peticion = { method: req.method, path: req.url, headers: req.headers, body: '' };
    peticiones.push(peticion);
    req.setEncoding('utf8');
    req.on('data', (chunk) => (peticion.body += chunk));
    req.on('end', () => {
      const salida = responder(req, peticion.body);
      res.setHeader('Content-Type', 'application/json');
      if (salida && typeof salida === 'object' && salida[ES_RESPUESTA]) {
        res.statusCode = salida.status;
        res.end(JSON.stringify(salida.body));
        return;
      }
      res.end(JSON.stringify(salida));
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

const ES_RESPUESTA = Symbol('respuesta');

/**
 * Respuesta con un código HTTP distinto de 200, para el responder de arrancarFsDePega.
 *
 * @param {number} status Código HTTP.
 * @param {unknown} body Cuerpo JSON.
 */
export function respuesta(status, body) {
  return { [ES_RESPUESTA]: true, status, body };
}

/**
 * Escribe un archivo de conexiones temporal y apunta FS_CONNECTIONS_FILE a él.
 * Hay que llamarla ANTES de importar build/, porque el gestor de conexiones lo
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
