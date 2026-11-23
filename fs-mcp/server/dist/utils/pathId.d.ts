/**
 * Identificador de un registro como segmento de la ruta de la API REST.
 *
 * El core no decodifica la ruta de la API (index.php usa parse_url y
 * ApiController::getUriParam hace explode('/')), así que el identificador tiene
 * que llegar tal cual: codificado, «C+1» llegaría como «C%2B1» y no se
 * encontraría. En vez de codificar, se rechaza lo que cambiaría el recurso o la
 * query al componer la URL.
 */
/**
 * Devuelve el identificador como texto, sin codificar, o lanza un error si no
 * puede ir en la ruta sin cambiar el recurso.
 */
export declare function pathId(value: unknown): string;
/**
 * Como pathId, para un código que el esquema declara string. Un número se
 * rechaza en vez de convertirlo: en JSON no lleva ceros a la izquierda, y el
 * código 00123 llegaría como 123, que puede ser el de otro registro.
 */
export declare function pathCode(value: unknown, name: string): string;
//# sourceMappingURL=pathId.d.ts.map