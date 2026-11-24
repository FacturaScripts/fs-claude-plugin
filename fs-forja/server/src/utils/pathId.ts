/**
 * Identificador de un registro como segmento de la ruta de la API REST.
 *
 * El core no decodifica la ruta de la API (index.php usa parse_url y
 * ApiController::getUriParam hace explode('/')), así que el identificador tiene
 * que llegar tal cual: codificado, «C+1» llegaría como «C%2B1» y no se
 * encontraría. En vez de codificar, se rechaza lo que cambiaría el recurso o la
 * query al componer la URL.
 */

// «/» y «\» separan segmentos (la URL trata «\» como «/»), «?» y «#» abren la
// query y el fragmento, «%» permite escribir «..» como «%2e%2e», y la URL quita
// en silencio tabuladores y saltos de línea. Los espacios del final también los
// quita, y el identificador va siempre al final: «.. » llegaría como «..».
const NO_VALIDO = /[/\\?#%\x00-\x1f\x7f]| $/;

/**
 * Devuelve el identificador como texto, sin codificar, o lanza un error si no
 * puede ir en la ruta sin cambiar el recurso.
 */
export function pathId(value: unknown): string {
    const id = String(value);
    if (NO_VALIDO.test(id) || id === '' || id === '.' || id === '..') {
        throw new Error(
            `Identificador no válido para la ruta de la API: ${JSON.stringify(id)}. ` +
            'No puede contener / \\ ? # %, caracteres de control, acabar en espacio, ni ser vacío, «.» o «..».'
        );
    }
    return id;
}

/**
 * Como pathId, para un código que el esquema declara string. Un número se
 * rechaza en vez de convertirlo: en JSON no lleva ceros a la izquierda, y el
 * código 00123 llegaría como 123, que puede ser el de otro registro.
 */
export function pathCode(value: unknown, name: string): string {
    if (typeof value === 'number') {
        throw new Error(
            `El argumento "${name}" va como texto, entre comillas: "${name}": "${value}". ` +
            'Escrito como número pierde los ceros a la izquierda y podría ser el de otro registro.'
        );
    }
    return pathId(value);
}
