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
// en silencio tabuladores y saltos de línea.
const NO_VALIDO = /[/\\?#%\x00-\x1f\x7f]/;
/**
 * Devuelve el identificador como texto, sin codificar, o lanza un error si no
 * puede ir en la ruta sin cambiar el recurso.
 */
export function pathId(value) {
    const id = String(value);
    if (NO_VALIDO.test(id) || id === '.' || id === '..') {
        throw new Error(`Identificador no válido para la ruta de la API: ${JSON.stringify(id)}. ` +
            'No puede contener / \\ ? # %, caracteres de control, ni ser «.» o «..».');
    }
    return id;
}
//# sourceMappingURL=pathId.js.map