#!/usr/bin/env python3
"""Hace las capturas de pantalla de la documentación de FacturaScripts, anotadas y anonimizadas.

Lee un escenario JSON con las capturas de una página de documentación y, con
Google Chrome (o Chromium) sin interfaz, inicia sesión en la instalación de
pruebas, recorre cada pantalla y guarda un PNG por captura. Antes de cada
captura:

- Oculta la barra de depuración y desactiva las animaciones.
- Anonimiza los datos personales: sustituye por valores ficticios los emails,
  NIF/CIF/NIE, teléfonos e IBAN que encuentra en el texto, los campos de nombre,
  NIF, email, teléfono, dirección y cuenta de los formularios y las columnas
  equivalentes de los listados. Cada valor real se sustituye siempre por el
  mismo valor ficticio en todas las capturas, también donde vuelva a aparecer.
- Oculta los logotipos de la marca (imágenes con «FacturaScripts» en su texto
  alternativo): la documentación se publica igual en facturascripts.com y en
  factura.city.
- Dibuja las marcas: un recuadro rojo alrededor del elemento y, si se pide, un
  número, una flecha y una nota.
- Comprueba que no queda ningún dato personal ni la marca («FacturaScripts»,
  «factura.city» o «FS») visibles; si queda alguno, no guarda la captura y lo
  devuelve como error.

Los clics que pueden cambiar datos (botones que envían un formulario POST,
enlaces con ``action=`` o textos como «Guardar», «Enviar» o «Dar de alta») se
bloquean salvo que el paso lleve ``"allow_change": true``.

Las credenciales no van en el escenario: se leen de las variables de entorno
``FS_DOC_USER`` y ``FS_DOC_PASSWORD`` (o de las que indique ``login``).

Uso:
    doc-screenshots.py <escenario.json> [--only <nombre> ...] [--scan] [--check]
                       [--output-dir <carpeta>] [--chrome <ruta>]

``--check`` solo valida el escenario. ``--scan`` no guarda capturas: recorre
las pantallas y devuelve, para cada una, los controles visibles con el selector
que se puede usar en los pasos y los datos personales detectados (enmascarados).

El resultado se imprime en JSON. Código de salida: 0 si todo va bien, 1 si
alguna captura falla o deja datos personales a la vista y 2 si el escenario no
es válido o no se puede abrir Chrome.
"""

from __future__ import annotations

import argparse
import base64
import fcntl
import json
import os
import select
import shutil
import sys
import tempfile
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse


# Tamaño de la ventana por defecto: el de un portátil corriente, legible al reducir la imagen en la web.
DEFAULT_VIEWPORT = {'width': 1280, 'height': 800, 'scale': 1}

# Segundos máximos de espera para cargar una página o encontrar un elemento.
DEFAULT_TIMEOUT = 20

# Color de las marcas: rojo intenso, visible sobre el azul y el blanco de FacturaScripts.
DEFAULT_COLOR = '#e11d48'

# Variables de entorno de las credenciales.
DEFAULT_USER_ENV = 'FS_DOC_USER'
DEFAULT_PASSWORD_ENV = 'FS_DOC_PASSWORD'

# Patrones de datos personales en el texto, compatibles con las expresiones regulares de Python y JavaScript.
SENSITIVE_PATTERNS = {
    'email': r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}',
    'iban': r'\b[A-Z]{2}[0-9]{2}(?:[ ]?[A-Z0-9]{4}){4,7}(?:[ ]?[A-Z0-9]{1,4})?\b',
    'nif': r'\b(?:ES)?(?:[0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]|[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J])\b',
    'phone': r'(?:\+34[ ]?)?\b[6789][0-9]{2}[ .-]?[0-9]{3}[ .-]?[0-9]{3}\b',
}

# Campos de formulario (atributo name) con datos personales y su categoría.
FIELD_RULES = [
    [r'^(nombre|nombrecliente|nombreproveedor|razonsocial|apellidos|apellidos2|personacontacto|'
     r'nombrecomercial|codcliente|codproveedor|codcontacto)$', 'name'],
    [r'^(cifnif|nif|dni)$', 'nif'],
    [r'^(email|email2|emailcopia|emailfrom)$', 'email'],
    [r'^(telefono|telefono1|telefono2|movil|fax)$', 'phone'],
    [r'^(direccion|apartado|direccionenv)$', 'address'],
    [r'^(iban|swift|codcuenta|cuentabanco)$', 'iban'],
]

# Cabeceras de columna de los listados con datos personales y su categoría.
HEADER_RULES = [
    [r'^(cliente|proveedor|acreedor|nombre|razón social|nombre comercial|contacto|persona de contacto|'
     r'titular|destinatario|apellidos)$', 'name'],
    [r'^(cif/nif|nif|cif|dni|nif/cif)$', 'nif'],
    [r'^(email|e-mail|correo|correo electrónico)$', 'email'],
    [r'^(teléfono|teléfono 1|teléfono 2|móvil|tel\.?)$', 'phone'],
    [r'^(dirección)$', 'address'],
    [r'^(iban|cuenta bancaria)$', 'iban'],
]

# Marca que no puede verse: la documentación se publica igual en facturascripts.com y en factura.city.
BRAND_PATTERN = r'[Ff]actura[Ss]cripts|[Ff]actura\.city|\bFS\b'

# Lo que se desenfoca siempre con la anonimización automática: los QR tributarios llevan el NIF del emisor.
AUTO_BLUR = ['img[alt*="QR" i]', 'img[src*="qr" i]']

# Textos de botones y enlaces que indican una acción que cambia datos.
RISKY_ACTION_PATTERN = (
    r'\b(guardar|eliminar|borrar|enviar|dar de alta|anular|subsanar|confirmar|aceptar|emitir|pagar|cobrar|'
    r'aprobar|generar|restaurar|deshacer|registrar|save|delete|remove|send|submit|confirm|approve)\b'
)

# Claves admitidas en el escenario, en cada captura, en cada marca y en cada paso.
SCENARIO_KEYS = {'base_url', 'output_dir', 'viewport', 'timeout', 'login', 'redact', 'hide', 'captures', 'insecure'}
CAPTURE_KEYS = {'name', 'file', 'url', 'steps', 'highlight', 'clip', 'margin', 'full_page', 'redact', 'hide'}
HIGHLIGHT_KEYS = {'target', 'nth', 'label', 'arrow', 'note', 'color', 'padding'}
REDACT_KEYS = {'auto', 'keep', 'replace', 'blur'}
STEP_ACTIONS = {'goto', 'click', 'fill', 'select', 'wait', 'wait_for', 'scroll_to', 'eval'}
STEP_OPTIONS = {'nth', 'value', 'allow_change', 'timeout'}
ARROW_DIRECTIONS = {'left', 'right', 'up', 'down'}

# Funciones que se inyectan en la página: búsqueda de elementos, anonimización, marcas y comprobaciones.
PAGE_HELPERS = r"""
(() => {
    if (window.__fsdoc) {
        return true;
    }
    const OVERLAY = 'fsdoc-overlay';
    const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE']);
    const norm = s => (s || '').replace(/\s+/g, ' ').trim();
    const visible = el => {
        const r = el.getBoundingClientRect();
        const st = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none';
    };
    const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const mask = s => s.length <= 2 ? '**' : s.slice(0, 2) + '*'.repeat(Math.min(s.length - 2, 8)) + ' (' + s.length + ')';

    // Busca un elemento por selector CSS o por texto («text=Guardar»), visible y fuera de las marcas.
    // «zona >> text=Texto» busca el texto solo dentro de los elementos visibles de la zona.
    function find(target, nth) {
        let list;
        let scopes = [document];
        const chain = target.split(' >> ');
        if (chain.length > 1) {
            scopes = [...document.querySelectorAll(chain[0])].filter(visible);
            target = chain.slice(1).join(' >> ');
        }
        const inScope = sel => scopes.flatMap(scope => [...scope.querySelectorAll(sel)]);
        if (target.startsWith('text=')) {
            const wanted = norm(target.slice(5)).toLowerCase();
            const all = inScope(
                'button, a, [role="tab"], [role="button"], label, th, legend, h1, h2, h3, h4, h5, li, td, option, span, div, p, b, strong'
            ).filter(el => visible(el) && !el.closest('.' + OVERLAY));
            const exact = all.filter(el => norm(el.textContent).toLowerCase() === wanted);
            let pool = exact.length ? exact : all.filter(el => norm(el.textContent).toLowerCase().includes(wanted));
            pool = pool.filter(el => !pool.some(o => o !== el && el.contains(o)));
            list = [];
            pool.forEach(el => {
                const ctrl = el.closest('button, a, [role="button"], [role="tab"]') || el;
                if (!list.includes(ctrl)) {
                    list.push(ctrl);
                }
            });
        } else {
            const all = inScope(target);
            list = all.filter(visible);
            if (!list.length) {
                list = all;
            }
        }
        const el = list[nth || 0];
        if (!el) {
            throw new Error('No se encuentra el elemento «' + chain.join(' >> ') + '»' + (nth ? ' número ' + nth : '') + '.');
        }
        return el;
    }

    // Motivos por los que un clic puede cambiar datos.
    function risky(el, pattern) {
        const ctrl = el.closest('button, a, input[type="submit"], input[type="button"], [role="button"]') || el;
        const text = norm(ctrl.textContent || ctrl.value || ctrl.title || ctrl.getAttribute('aria-label'));
        const reasons = [];
        const form = ctrl.form || null;
        if (ctrl.type === 'submit' && form && (form.getAttribute('method') || 'get').toLowerCase() === 'post') {
            reasons.push('envía un formulario POST');
        }
        if (new RegExp(pattern, 'i').test(text)) {
            reasons.push('su texto («' + text + '») indica una acción que cambia datos');
        }
        if (ctrl.tagName === 'A' && /[?&]action=/.test(ctrl.getAttribute('href') || '')) {
            reasons.push('su enlace ejecuta una acción');
        }
        return reasons;
    }

    function click(target, nth, allowChange, pattern) {
        const el = find(target, nth);
        if (!allowChange) {
            const reasons = risky(el, pattern);
            if (reasons.length) {
                throw new Error('Clic bloqueado en «' + target + '»: ' + reasons.join('; ')
                    + '. Si de verdad debe ejecutarse, añade "allow_change": true al paso.');
            }
        }
        const r = el.getBoundingClientRect();
        if (r.top < 60 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) {
            el.scrollIntoView({block: 'center'});
        }
        el.click();
        return true;
    }

    function setValue(el, value) {
        const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype
            : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
        el.dispatchEvent(new Event('input', {bubbles: true}));
        el.dispatchEvent(new Event('change', {bubbles: true}));
    }

    function fill(target, nth, value) {
        const el = find(target, nth);
        el.focus();
        setValue(el, value);
        el.blur();
        return true;
    }

    function choose(target, nth, value) {
        const el = find(target, nth);
        const option = [...el.options].find(o => o.value === value) || [...el.options].find(o => norm(o.text) === norm(value));
        if (!option) {
            throw new Error('El desplegable «' + target + '» no tiene la opción «' + value + '».');
        }
        setValue(el, option.value);
        return true;
    }

    function prepare(hide) {
        let style = document.getElementById('fsdoc-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'fsdoc-style';
            document.head.appendChild(style);
        }
        style.textContent = '.debugbar, .phpdebugbar, #debugbar { display: none !important; }'
            + '*, *::before, *::after { transition: none !important; animation: none !important; caret-color: transparent !important; }'
            + (hide.length ? hide.join(', ') + ' { visibility: hidden !important; }' : '');
        if (document.activeElement && document.activeElement !== document.body) {
            document.activeElement.blur();
        }
        return true;
    }

    // Estado de la anonimización, compartido entre llamadas de la misma página.
    const state = {map: new Map(), fakes: new Set(), counters: {}, keep: new Set()};

    function nifLetter(n) {
        return 'TRWAGMYFPDXBNJZSQVHLCKE'[n % 23];
    }

    function next(key) {
        state.counters[key] = (state.counters[key] || 0) + 1;
        return state.counters[key];
    }

    function namePrefix(hint) {
        hint = (hint || '').toLowerCase();
        if (/proveedor|acreedor/.test(hint)) {
            return 'Proveedor Ejemplo';
        }
        if (/empresa/.test(hint)) {
            return 'Empresa Ejemplo';
        }
        if (/contacto|persona|agente|usuario|titular|apellidos/.test(hint)) {
            return 'Persona Ejemplo';
        }
        return 'Cliente Ejemplo';
    }

    function generate(category, hint) {
        let n;
        switch (category) {
            case 'email':
                return 'usuario' + next('email') + '@ejemplo.com';
            case 'nif':
                n = next('nif');
                return String(n).padStart(8, '0') + nifLetter(n);
            case 'phone':
                return '600 000 ' + String(next('phone')).padStart(3, '0');
            case 'iban':
                return 'ES00 0000 0000 0000 0000 ' + String(next('iban')).padStart(4, '0');
            case 'address':
                return 'Calle Ejemplo, ' + next('address');
            default:
                const prefix = namePrefix(hint);
                return prefix + ' ' + next(prefix);
        }
    }

    function fake(category, original, hint) {
        original = norm(original);
        if (!original || state.fakes.has(original) || state.keep.has(original.toLowerCase())) {
            return original;
        }
        if (!state.map.has(original)) {
            const value = generate(category, hint);
            state.map.set(original, {fake: value, category});
            state.fakes.add(value);
        }
        return state.map.get(original).fake;
    }

    function textNodes(root) {
        const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: node => {
                const parent = node.parentElement;
                if (!parent || SKIP_TAGS.has(parent.tagName) || parent.closest('.' + OVERLAY) || !node.nodeValue.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const nodes = [];
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }
        return nodes;
    }

    function textInputs() {
        return [...document.querySelectorAll('input, textarea')].filter(el =>
            !['hidden', 'password', 'checkbox', 'radio', 'file', 'submit', 'button', 'image', 'reset'].includes(el.type));
    }

    function replaceEverywhere(fn) {
        textNodes().forEach(node => {
            const value = fn(node.nodeValue);
            if (value !== node.nodeValue) {
                node.nodeValue = value;
            }
        });
        textInputs().forEach(el => {
            const value = fn(el.value);
            if (value !== el.value) {
                el.value = value;
                el.setAttribute('value', value);
            }
        });
        document.querySelectorAll('[title], [placeholder], [data-bs-original-title]').forEach(el => {
            ['title', 'placeholder', 'data-bs-original-title'].forEach(attr => {
                if (el.hasAttribute(attr)) {
                    const value = fn(el.getAttribute(attr));
                    if (value !== el.getAttribute(attr)) {
                        el.setAttribute(attr, value);
                    }
                }
            });
        });
        document.title = fn(document.title);
    }

    function redact(cfg) {
        (cfg.keep || []).forEach(v => state.keep.add(norm(v).toLowerCase()));
        Object.entries(cfg.replace || {}).forEach(([original, value]) => {
            if (norm(original) && !state.map.has(norm(original))) {
                state.map.set(norm(original), {fake: value, category: 'manual'});
                state.fakes.add(norm(value));
            }
        });
        if (cfg.auto !== false) {
            // 1. Campos de formulario por su nombre.
            const fieldRules = cfg.fields.map(([re, cat]) => [new RegExp(re, 'i'), cat]);
            document.querySelectorAll('input[name], textarea[name], select[name]').forEach(el => {
                if (['hidden', 'password', 'checkbox', 'radio', 'file', 'submit', 'button'].includes(el.type)) {
                    return;
                }
                const rule = fieldRules.find(([re]) => re.test(el.name));
                if (!rule) {
                    return;
                }
                const label = el.closest('.mb-3, .form-group, td, div') ? norm((el.closest('.mb-3, .form-group, div').querySelector('label') || {}).textContent) : '';
                const hint = el.name + ' ' + label;
                if (el.tagName === 'SELECT') {
                    [...el.options].forEach(o => {
                        if (o.value && rule[1] === 'name') {
                            o.text = fake(rule[1], o.text, hint);
                        }
                    });
                } else if (el.value && !/^cod/i.test(el.name)) {
                    el.value = fake(rule[1], el.value, hint);
                    el.setAttribute('value', el.value);
                }
            });

            // 2. Columnas de los listados por su cabecera.
            const headerRules = cfg.headers.map(([re, cat]) => [new RegExp(re, 'i'), cat]);
            document.querySelectorAll('table').forEach(table => {
                const headRow = table.tHead ? table.tHead.rows[table.tHead.rows.length - 1] : null;
                if (!headRow) {
                    return;
                }
                const columns = [];
                let index = 0;
                [...headRow.cells].forEach(th => {
                    const text = norm(th.textContent);
                    const rule = headerRules.find(([re]) => re.test(text));
                    if (rule) {
                        columns.push([index, rule[1], text]);
                    }
                    index += th.colSpan || 1;
                });
                if (!columns.length) {
                    return;
                }
                [...table.tBodies].forEach(tbody => [...tbody.rows].forEach(row => {
                    columns.forEach(([col, cat, hint]) => {
                        const cell = row.cells[col];
                        if (cell && norm(cell.textContent) && !(row.cells.length === 1 && cell.colSpan > 1)) {
                            fake(cat, cell.textContent, hint);
                        }
                    });
                }));
            });

            // 3. Patrones en el texto, los campos y los atributos.
            const patterns = Object.entries(cfg.patterns).map(([cat, re]) => [cat, new RegExp(re, 'g')]);
            replaceEverywhere(value => {
                patterns.forEach(([cat, re]) => {
                    value = value.replace(re, match => state.fakes.has(match) || state.keep.has(match.toLowerCase()) ? match : fake(cat, match, ''));
                });
                return value;
            });
        }

        // 4. Cada valor real que se ha encontrado, en cualquier parte de la página. Los de «replace» se aplican aunque
        // sean cortos («FS»), pero como palabra completa.
        const pairs = [...state.map.entries()].filter(([original, data]) => original.length >= 3 || data.category === 'manual')
            .sort((a, b) => b[0].length - a[0].length)
            .map(([original, data]) => [
                new RegExp(original.length < 4 ? '\\b' + escapeRe(original) + '\\b' : escapeRe(original), original.length < 4 ? 'g' : 'gi'),
                data.fake
            ]);
        replaceEverywhere(value => {
            pairs.forEach(([re, value2]) => {
                value = value.replace(re, value2);
            });
            return value;
        });
        document.querySelectorAll('option').forEach(o => {
            let text = o.text;
            pairs.forEach(([re, value2]) => {
                text = text.replace(re, value2);
            });
            if (text !== o.text) {
                o.text = text;
            }
        });

        // 5. Los logotipos de la marca se ocultan sin mover el resto de la pantalla.
        if (cfg.auto !== false) {
            const brand = new RegExp(cfg.brand);
            document.querySelectorAll('img').forEach(img => {
                if (brand.test(img.alt || '') || brand.test(img.title || '')) {
                    img.style.visibility = 'hidden';
                }
            });
        }

        // 6. Lo que se desenfoca porque no se puede sustituir.
        let blurred = 0;
        (cfg.blur || []).forEach(sel => document.querySelectorAll(sel).forEach(el => {
            el.style.filter = 'blur(6px)';
            blurred++;
        }));

        return {
            replaced: [...state.map.entries()].map(([original, data]) => ({
                category: data.category, original: mask(original), fake: data.fake
            })),
            blurred
        };
    }

    // Datos personales y marca que siguen visibles: patrones que no son valores ficticios, valores reales sin sustituir
    // y la marca. Con «region» (rectángulo del documento) solo cuenta lo que entra en la imagen.
    function leaks(cfg, region) {
        const found = [];
        const shown = el => {
            if (!visible(el)) {
                return false;
            }
            if (!region) {
                return true;
            }
            const r = rectOf(el);
            return r.x < region.x + region.width && r.x + r.w > region.x && r.y < region.y + region.height && r.y + r.h > region.y;
        };
        const patterns = Object.entries(cfg.patterns).map(([cat, re]) => [cat, new RegExp(re, 'g')]);
        const originals = [...state.map.keys()].filter(o => o.length >= 3).map(o => [o, new RegExp(escapeRe(o), 'i')]);
        const brand = new RegExp(cfg.brand, 'g');
        const check = (value, where) => {
            (value.match(brand) || []).forEach(match => found.push({category: 'marca', value: match, where}));
            patterns.forEach(([cat, re]) => {
                (value.match(re) || []).forEach(match => {
                    if (!state.fakes.has(match) && !state.keep.has(match.toLowerCase())) {
                        found.push({category: cat, value: mask(match), where});
                    }
                });
            });
            originals.forEach(([original, re]) => {
                if (re.test(value)) {
                    found.push({category: 'original', value: mask(original), where});
                }
            });
        };
        textNodes().filter(n => shown(n.parentElement) && !n.parentElement.closest('[style*="blur"]'))
            .forEach(n => check(n.nodeValue, n.parentElement.tagName.toLowerCase()));
        textInputs().filter(shown).forEach(el => check(el.value, el.tagName.toLowerCase() + '[name=' + el.name + ']'));
        document.querySelectorAll('select').forEach(el => {
            if (shown(el) && el.selectedOptions[0]) {
                check(el.selectedOptions[0].text, 'select[name=' + el.name + ']');
            }
        });
        document.querySelectorAll('img').forEach(img => {
            if (shown(img) && (new RegExp(cfg.brand).test(img.alt || '') || new RegExp(cfg.brand).test(img.title || ''))) {
                found.push({category: 'marca', value: img.alt || img.title, where: 'img'});
            }
        });
        return found;
    }

    function clear() {
        document.querySelectorAll('.' + OVERLAY).forEach(el => el.remove());
        return true;
    }

    function rectOf(el) {
        const r = el.getBoundingClientRect();
        return {x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height};
    }

    function arrow(svg, x1, y1, x2, y2, color) {
        const ns = 'http://www.w3.org/2000/svg';
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const head = 18;
        const bx = x2 - head * Math.cos(angle), by = y2 - head * Math.sin(angle);
        const px = 9 * Math.sin(angle), py = -9 * Math.cos(angle);
        const points = x2 + ',' + y2 + ' ' + (bx + px) + ',' + (by + py) + ' ' + (bx - px) + ',' + (by - py);
        [['#ffffff', 10], [color, 5]].forEach(([stroke, width]) => {
            const line = document.createElementNS(ns, 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', bx);
            line.setAttribute('y2', by);
            line.setAttribute('stroke', stroke);
            line.setAttribute('stroke-width', width);
            line.setAttribute('stroke-linecap', 'round');
            svg.appendChild(line);
        });
        const polygon = document.createElementNS(ns, 'polygon');
        polygon.setAttribute('points', points);
        polygon.setAttribute('fill', color);
        polygon.setAttribute('stroke', '#ffffff');
        polygon.setAttribute('stroke-width', '2');
        polygon.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(polygon);
    }

    function highlight(items, defaultColor) {
        clear();
        if (!items.length) {
            return [];
        }
        const first = find(items[0].target, items[0].nth);
        const fr = first.getBoundingClientRect();
        if (fr.top < 60 || fr.bottom > innerHeight - 20 || fr.left < 0 || fr.right > innerWidth) {
            first.scrollIntoView({block: 'center', inline: 'center'});
        }
        const layer = document.createElement('div');
        layer.className = OVERLAY;
        layer.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;z-index:2147483647;pointer-events:none;';
        document.body.appendChild(layer);
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('width', document.documentElement.scrollWidth);
        svg.setAttribute('height', document.documentElement.scrollHeight);
        svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;';
        layer.appendChild(svg);
        const boxes = [];
        items.forEach(item => {
            const el = find(item.target, item.nth);
            const color = item.color || defaultColor;
            const pad = item.padding === undefined ? 5 : item.padding;
            const r = rectOf(el);
            const box = {x: r.x - pad, y: r.y - pad, w: r.w + pad * 2, h: r.h + pad * 2};
            const div = document.createElement('div');
            div.style.cssText = 'position:absolute;box-sizing:border-box;border:3px solid ' + color + ';border-radius:8px;'
                + 'box-shadow:0 0 0 2px rgba(255,255,255,.9),0 0 14px 3px ' + color + '66;'
                + 'left:' + box.x + 'px;top:' + box.y + 'px;width:' + box.w + 'px;height:' + box.h + 'px;';
            layer.appendChild(div);
            const parts = [box];
            let anchor = null;
            if (item.arrow) {
                const view = el.getBoundingClientRect();
                let dir = item.arrow === true ? null : item.arrow;
                if (!dir) {
                    const space = {left: view.left, right: innerWidth - view.right, up: view.top - 60, down: innerHeight - view.bottom};
                    dir = Object.keys(space).sort((a, b) => space[b] - space[a])[0];
                }
                const len = 90, gap = 6;
                const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
                let x2, y2, x1, y1;
                if (dir === 'left') {
                    x2 = box.x - gap; y2 = cy; x1 = x2 - len; y1 = cy;
                } else if (dir === 'right') {
                    x2 = box.x + box.w + gap; y2 = cy; x1 = x2 + len; y1 = cy;
                } else if (dir === 'up') {
                    x2 = cx; y2 = box.y - gap; x1 = cx; y1 = y2 - len;
                } else {
                    x2 = cx; y2 = box.y + box.h + gap; x1 = cx; y1 = y2 + len;
                }
                arrow(svg, x1, y1, x2, y2, color);
                parts.push({x: Math.min(x1, x2) - 10, y: Math.min(y1, y2) - 10, w: Math.abs(x2 - x1) + 20, h: Math.abs(y2 - y1) + 20});
                anchor = {x: x1, y: y1, dir};
            }
            if (item.label !== undefined && item.label !== null && item.label !== '') {
                const badge = document.createElement('div');
                badge.textContent = String(item.label);
                badge.style.cssText = 'position:absolute;min-width:30px;height:30px;padding:0 8px;box-sizing:border-box;border-radius:15px;'
                    + 'background:' + color + ';color:#fff;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);'
                    + 'font:700 15px/26px system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center;'
                    + 'left:' + Math.max(2, box.x - 15) + 'px;top:' + Math.max(2, box.y - 15) + 'px;';
                layer.appendChild(badge);
                parts.push({x: Math.max(2, box.x - 15), y: Math.max(2, box.y - 15), w: 30, h: 30});
            }
            if (item.note) {
                const note = document.createElement('div');
                note.textContent = item.note;
                note.style.cssText = 'position:absolute;left:0;top:0;width:max-content;max-width:280px;padding:6px 12px;border-radius:8px;background:' + color + ';'
                    + 'color:#fff;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);'
                    + 'font:600 14px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;white-space:normal;';
                layer.appendChild(note);
                const nw = note.offsetWidth, nh = note.offsetHeight;
                let nx, ny;
                if (anchor) {
                    nx = anchor.dir === 'left' ? anchor.x - nw - 4 : anchor.dir === 'right' ? anchor.x + 4 : anchor.x - nw / 2;
                    ny = anchor.dir === 'up' ? anchor.y - nh - 4 : anchor.dir === 'down' ? anchor.y + 4 : anchor.y - nh / 2;
                } else {
                    nx = box.x;
                    ny = box.y + box.h + 8;
                }
                nx = Math.max(scrollX + 4, Math.min(nx, scrollX + innerWidth - nw - 4));
                note.style.left = nx + 'px';
                note.style.top = Math.max(4, ny) + 'px';
                parts.push({x: nx, y: Math.max(4, ny), w: nw, h: nh});
            }
            boxes.push(...parts);
        });
        return boxes;
    }

    // Rectángulo que abarca los elementos de «clip» y las marcas, con un margen, en coordenadas del documento.
    function clipRect(targets, marks, margin) {
        const rects = targets.map(t => {
            const r = rectOf(find(t, 0));
            return {x: r.x, y: r.y, w: r.w, h: r.h};
        }).concat(marks || []);
        if (!rects.length) {
            return null;
        }
        let x1 = Math.min(...rects.map(r => r.x)) - margin;
        let y1 = Math.min(...rects.map(r => r.y)) - margin;
        let x2 = Math.max(...rects.map(r => r.x + r.w)) + margin;
        let y2 = Math.max(...rects.map(r => r.y + r.h)) + margin;
        x1 = Math.max(0, x1);
        y1 = Math.max(0, y1);
        x2 = Math.min(document.documentElement.scrollWidth, scrollX + innerWidth, x2);
        y2 = Math.min(document.documentElement.scrollHeight, y2);
        return {x: Math.floor(x1), y: Math.floor(y1), width: Math.ceil(x2 - x1), height: Math.ceil(y2 - y1)};
    }

    // Selector útil para los pasos de un control visible.
    function selectorOf(el) {
        if (el.id && document.querySelectorAll('#' + CSS.escape(el.id)).length === 1) {
            return '#' + CSS.escape(el.id);
        }
        if (el.name && document.querySelectorAll(el.tagName.toLowerCase() + '[name="' + el.name + '"]').length === 1) {
            return el.tagName.toLowerCase() + '[name="' + el.name + '"]';
        }
        const href = el.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            return 'a[href="' + href + '"]';
        }
        const text = norm(el.textContent || el.value);
        return text ? 'text=' + text.slice(0, 60) : el.tagName.toLowerCase();
    }

    function scan(cfg) {
        const controls = [];
        const seen = new Set();
        document.querySelectorAll('button, a.btn, a.nav-link, a.dropdown-item, [role="tab"], input, select, textarea').forEach(el => {
            // Las casillas de cada fila de un listado se seleccionan con input.listAction[value="<código>"].
            if (!visible(el) || el.closest('.' + OVERLAY) || el.closest('.debugbar') || el.type === 'hidden'
                || (el.type === 'checkbox' && el.name === 'codes[]')) {
                return;
            }
            const text = norm(el.textContent || el.value || el.placeholder || el.title);
            const key = selectorOf(el) + '|' + text;
            if (seen.has(key)) {
                return;
            }
            seen.add(key);
            controls.push({
                tag: el.tagName.toLowerCase() + (el.type ? '[' + el.type + ']' : ''),
                text: text.slice(0, 60),
                target: selectorOf(el),
                changes_data: risky(el, cfg.risky).length > 0
            });
        });
        return {
            url: location.href,
            title: document.title,
            viewport: {width: innerWidth, height: innerHeight, page_height: document.documentElement.scrollHeight},
            controls: controls.slice(0, 150),
            sensitive: leaks(cfg)
        };
    }

    window.__fsdoc = {find, click, fill, choose, prepare, redact, leaks, highlight, clear, clipRect, scan, risky};
    return true;
})()
"""


class ScreenshotError(Exception):
    """Error de una captura o de la comunicación con Chrome."""


def validate_target(value: object, where: str) -> list[str]:
    """Valida el destino de un paso o de una marca: un selector CSS o «text=...»."""
    if not isinstance(value, str) or not value.strip():
        return [f'{where}: el destino debe ser un selector CSS o «text=...» no vacío.']
    return []


def validate_redact(redact: object, where: str) -> list[str]:
    """Valida la configuración de anonimización de un escenario o de una captura."""
    if redact is None:
        return []
    if not isinstance(redact, dict):
        return [f'{where}: «redact» debe ser un objeto.']
    errors = [f'{where}: clave desconocida «{key}» en «redact».' for key in redact if key not in REDACT_KEYS]
    if 'auto' in redact and not isinstance(redact['auto'], bool):
        errors.append(f'{where}: «redact.auto» debe ser true o false.')
    for key in ('keep', 'blur'):
        if key in redact and not (isinstance(redact[key], list) and all(isinstance(v, str) for v in redact[key])):
            errors.append(f'{where}: «redact.{key}» debe ser una lista de textos.')
    if 'replace' in redact and not (isinstance(redact['replace'], dict)
                                    and all(isinstance(v, str) for v in redact['replace'].values())):
        errors.append(f'{where}: «redact.replace» debe ser un objeto {{"valor real": "valor ficticio"}}.')
    return errors


def validate_step(step: object, where: str) -> list[str]:
    """Valida un paso: una sola acción y sus opciones."""
    if not isinstance(step, dict):
        return [f'{where}: cada paso debe ser un objeto.']
    actions = [key for key in step if key in STEP_ACTIONS]
    unknown = [key for key in step if key not in STEP_ACTIONS and key not in STEP_OPTIONS]
    errors = [f'{where}: clave desconocida «{key}».' for key in unknown]
    if len(actions) != 1:
        return errors + [f'{where}: cada paso debe tener una sola acción de: {", ".join(sorted(STEP_ACTIONS))}.']
    action = actions[0]
    value = step[action]
    if action == 'wait':
        if not isinstance(value, (int, float)) or value < 0:
            errors.append(f'{where}: «wait» son los milisegundos de espera.')
    elif action in ('goto', 'eval'):
        if not isinstance(value, str) or not value.strip():
            errors.append(f'{where}: «{action}» debe ser un texto no vacío.')
    else:
        errors += validate_target(value, where)
    if action in ('fill', 'select') and not isinstance(step.get('value'), str):
        errors.append(f'{where}: «{action}» necesita «value» con el texto que se escribe o la opción que se elige.')
    if 'nth' in step and (not isinstance(step['nth'], int) or step['nth'] < 0):
        errors.append(f'{where}: «nth» debe ser un número entero desde 0.')
    if 'allow_change' in step and not isinstance(step['allow_change'], bool):
        errors.append(f'{where}: «allow_change» debe ser true o false.')
    return errors


def validate_highlight(item: object, where: str) -> list[str]:
    """Valida una marca de una captura."""
    if not isinstance(item, dict):
        return [f'{where}: cada marca debe ser un objeto con «target».']
    errors = [f'{where}: clave desconocida «{key}».' for key in item if key not in HIGHLIGHT_KEYS]
    errors += validate_target(item.get('target'), where)
    arrow = item.get('arrow')
    if arrow is not None and not (isinstance(arrow, bool) or arrow in ARROW_DIRECTIONS):
        errors.append(f'{where}: «arrow» debe ser true o una dirección: {", ".join(sorted(ARROW_DIRECTIONS))}.')
    if 'nth' in item and (not isinstance(item['nth'], int) or item['nth'] < 0):
        errors.append(f'{where}: «nth» debe ser un número entero desde 0.')
    for key in ('label', 'note', 'color'):
        if key in item and not isinstance(item[key], (str, int)):
            errors.append(f'{where}: «{key}» debe ser un texto.')
    return errors


def validate_scenario(data: object) -> list[str]:
    """Devuelve los errores del escenario; una lista vacía si es válido."""
    if not isinstance(data, dict):
        return ['El escenario debe ser un objeto JSON.']
    errors = [f'Clave desconocida «{key}» en el escenario.' for key in data if key not in SCENARIO_KEYS]
    base_url = data.get('base_url')
    if base_url is not None and (not isinstance(base_url, str) or not urlparse(base_url).scheme):
        errors.append('«base_url» debe ser una URL completa, por ejemplo https://fs.localhost/.')
    viewport = data.get('viewport', {})
    if not isinstance(viewport, dict) or any(
            key not in DEFAULT_VIEWPORT or not isinstance(value, (int, float)) or value <= 0
            for key, value in viewport.items()):
        errors.append('«viewport» admite «width», «height» y «scale» con números positivos.')
    login = data.get('login')
    if login is not None and not isinstance(login, (bool, dict)):
        errors.append('«login» debe ser true o un objeto con «user_env» y «password_env».')
    if isinstance(login, dict):
        errors += [f'Clave desconocida «{key}» en «login».' for key in login if key not in ('user_env', 'password_env')]
    for key in ('hide',):
        if key in data and not (isinstance(data[key], list) and all(isinstance(v, str) for v in data[key])):
            errors.append(f'«{key}» debe ser una lista de selectores CSS.')
    errors += validate_redact(data.get('redact'), 'Escenario')

    captures = data.get('captures')
    if not isinstance(captures, list) or not captures:
        return errors + ['«captures» debe ser una lista con al menos una captura.']
    names = set()
    for index, capture in enumerate(captures, start=1):
        if not isinstance(capture, dict):
            errors.append(f'Captura {index}: debe ser un objeto.')
            continue
        name = capture.get('name')
        where = f'Captura «{name}»' if isinstance(name, str) else f'Captura {index}'
        if not isinstance(name, str) or not name.strip():
            errors.append(f'{where}: falta «name».')
        elif name in names:
            errors.append(f'{where}: el nombre está repetido.')
        else:
            names.add(name)
        errors += [f'{where}: clave desconocida «{key}».' for key in capture if key not in CAPTURE_KEYS]
        file = capture.get('file')
        if file is not None and (not isinstance(file, str) or not file.lower().endswith('.png') or '/' in file):
            errors.append(f'{where}: «file» debe ser un nombre de archivo .png sin carpetas.')
        if 'url' in capture and not isinstance(capture['url'], str):
            errors.append(f'{where}: «url» debe ser un texto.')
        steps = capture.get('steps', [])
        if not isinstance(steps, list):
            errors.append(f'{where}: «steps» debe ser una lista.')
        else:
            for number, step in enumerate(steps, start=1):
                errors += validate_step(step, f'{where}, paso {number}')
        marks = capture.get('highlight', [])
        if not isinstance(marks, list):
            errors.append(f'{where}: «highlight» debe ser una lista.')
        else:
            for number, item in enumerate(marks, start=1):
                errors += validate_highlight(item, f'{where}, marca {number}')
        clip = capture.get('clip')
        if clip is not None and not (isinstance(clip, str) or (isinstance(clip, list) and all(isinstance(c, str) for c in clip))):
            errors.append(f'{where}: «clip» debe ser un selector o una lista de selectores.')
        if 'margin' in capture and (not isinstance(capture['margin'], (int, float)) or capture['margin'] < 0):
            errors.append(f'{where}: «margin» debe ser un número de píxeles.')
        if 'full_page' in capture and not isinstance(capture['full_page'], bool):
            errors.append(f'{where}: «full_page» debe ser true o false.')
        if 'hide' in capture and not (isinstance(capture['hide'], list) and all(isinstance(v, str) for v in capture['hide'])):
            errors.append(f'{where}: «hide» debe ser una lista de selectores CSS.')
        errors += validate_redact(capture.get('redact'), where)
        if 'url' not in capture and not steps and index == 1:
            errors.append(f'{where}: la primera captura necesita «url» o pasos que abran una pantalla.')
    return errors


def merge_redact(base: dict | None, extra: dict | None) -> dict:
    """Combina la anonimización del escenario con la de una captura (la de la captura manda)."""
    base = base or {}
    extra = extra or {}
    auto = extra.get('auto', base.get('auto', True))
    return {
        'auto': auto,
        'keep': list(base.get('keep', [])) + list(extra.get('keep', [])),
        'replace': {**base.get('replace', {}), **extra.get('replace', {})},
        'blur': (AUTO_BLUR if auto else []) + list(base.get('blur', [])) + list(extra.get('blur', [])),
        'patterns': SENSITIVE_PATTERNS,
        'brand': BRAND_PATTERN,
        'fields': FIELD_RULES,
        'headers': HEADER_RULES,
        'risky': RISKY_ACTION_PATTERN,
    }


def resolve_credentials(login: object, env: dict) -> tuple[str, str] | None:
    """Devuelve el usuario y la contraseña de las variables de entorno, o None si no hay inicio de sesión."""
    if not login:
        return None
    login = login if isinstance(login, dict) else {}
    user_env = login.get('user_env', DEFAULT_USER_ENV)
    password_env = login.get('password_env', DEFAULT_PASSWORD_ENV)
    user = env.get(user_env, '')
    password = env.get(password_env, '')
    if not user or not password:
        raise ScreenshotError(
            f'Faltan las credenciales: define las variables de entorno {user_env} y {password_env} '
            'con el usuario y la contraseña de la instalación de pruebas.')
    return user, password


def is_local_url(url: str) -> bool:
    """Indica si la URL es de una instalación local, donde se aceptan certificados propios."""
    parsed = urlparse(url)
    if parsed.scheme == 'file':
        return True
    host = (parsed.hostname or '').lower()
    return host in ('localhost', '127.0.0.1', '::1') or host.endswith('.localhost') or host.endswith('.test')


def find_chrome(explicit: str | None, env: dict) -> str:
    """Localiza el ejecutable de Chrome o Chromium."""
    candidates = [explicit, env.get('FS_DOC_CHROME'),
                  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                  '/Applications/Chromium.app/Contents/MacOS/Chromium',
                  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge']
    for name in ('google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge'):
        candidates.append(shutil.which(name))
    for candidate in candidates:
        if candidate and os.path.isfile(candidate) and os.access(candidate, os.X_OK):
            return candidate
    raise ScreenshotError('No se encuentra Google Chrome ni Chromium. Indica la ruta con --chrome o FS_DOC_CHROME.')


def png_size(path: Path) -> tuple[int, int]:
    """Devuelve el ancho y el alto de un PNG leyendo su cabecera."""
    data = path.read_bytes()[:24]
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ScreenshotError(f'{path} no es un PNG.')
    return int.from_bytes(data[16:20], 'big'), int.from_bytes(data[20:24], 'big')


def high_fd(fd: int) -> int:
    """Mueve un descriptor por encima de 10 para que no choque con los 3 y 4 que usa Chrome."""
    moved = fcntl.fcntl(fd, fcntl.F_DUPFD_CLOEXEC, 10)
    os.close(fd)
    return moved


class Browser:
    """Chrome sin interfaz controlado por el protocolo DevTools a través de una tubería (sin dependencias)."""

    def __init__(self, binary: str, viewport: dict, insecure: bool, timeout: float):
        self.timeout = timeout
        self.events: list[dict] = []
        self.buffer = b''
        self.next_id = 0
        self.session = None
        self.profile = tempfile.mkdtemp(prefix='fs-doc-chrome-')
        cmd_read, self.cmd_write = (high_fd(fd) for fd in os.pipe())
        self.res_read, res_write = (high_fd(fd) for fd in os.pipe())
        args = [binary, '--headless=new', '--remote-debugging-pipe', f'--user-data-dir={self.profile}',
                '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars',
                '--mute-audio', '--disable-background-networking', '--disable-sync', '--disable-features=Translate',
                '--password-store=basic', '--use-mock-keychain', '--lang=es-ES', '--force-color-profile=srgb',
                f'--window-size={int(viewport["width"])},{int(viewport["height"])}', 'about:blank']
        if insecure:
            args.insert(1, '--ignore-certificate-errors')
        actions = [(os.POSIX_SPAWN_DUP2, cmd_read, 3), (os.POSIX_SPAWN_DUP2, res_write, 4),
                   (os.POSIX_SPAWN_OPEN, 0, os.devnull, os.O_RDONLY, 0),
                   (os.POSIX_SPAWN_OPEN, 1, os.devnull, os.O_WRONLY, 0),
                   (os.POSIX_SPAWN_OPEN, 2, os.devnull, os.O_WRONLY, 0)]
        try:
            self.pid = os.posix_spawn(binary, args, os.environ, file_actions=actions)
        finally:
            os.close(cmd_read)
            os.close(res_write)
        target = self.call('Target.createTarget', {'url': 'about:blank'})['targetId']
        self.session = self.call('Target.attachToTarget', {'targetId': target, 'flatten': True})['sessionId']
        self.call('Page.enable', session=True)
        self.call('Emulation.setDeviceMetricsOverride', {
            'width': int(viewport['width']), 'height': int(viewport['height']),
            'deviceScaleFactor': viewport.get('scale', 1), 'mobile': False}, session=True)

    def _read_message(self, deadline: float) -> dict:
        while b'\0' not in self.buffer:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise ScreenshotError('Chrome no responde a tiempo.')
            ready, _, _ = select.select([self.res_read], [], [], remaining)
            if not ready:
                continue
            chunk = os.read(self.res_read, 1 << 20)
            if not chunk:
                raise ScreenshotError('Chrome se ha cerrado inesperadamente.')
            self.buffer += chunk
        raw, self.buffer = self.buffer.split(b'\0', 1)
        return json.loads(raw)

    def call(self, method: str, params: dict | None = None, session: bool = False, timeout: float | None = None) -> dict:
        """Envía un comando y espera su respuesta; los eventos que llegan entretanto se guardan."""
        self.next_id += 1
        message = {'id': self.next_id, 'method': method, 'params': params or {}}
        if session:
            message['sessionId'] = self.session
        data = json.dumps(message).encode() + b'\0'
        while data:
            data = data[os.write(self.cmd_write, data):]
        deadline = time.monotonic() + (timeout or self.timeout)
        while True:
            reply = self._read_message(deadline)
            if reply.get('id') == self.next_id:
                if 'error' in reply:
                    raise ScreenshotError(f'{method}: {reply["error"].get("message")}')
                return reply.get('result', {})
            if 'method' in reply:
                self.events.append(reply)

    def wait_event(self, method: str, timeout: float) -> bool:
        """Espera un evento de la página; devuelve False si no llega a tiempo."""
        deadline = time.monotonic() + timeout
        while True:
            for index, event in enumerate(self.events):
                if event.get('method') == method:
                    del self.events[index]
                    return True
            try:
                message = self._read_message(deadline)
            except ScreenshotError:
                return False
            if 'method' in message:
                self.events.append(message)

    def evaluate(self, expression: str):
        """Evalúa JavaScript en la página y devuelve su valor; los errores de la página se lanzan como excepción."""
        result = self.call('Runtime.evaluate', {
            'expression': expression, 'returnByValue': True, 'awaitPromise': True}, session=True)
        if 'exceptionDetails' in result:
            details = result['exceptionDetails']
            text = details.get('exception', {}).get('description') or details.get('text', 'Error de JavaScript')
            raise ScreenshotError(text.splitlines()[0].replace('Error: ', ''))
        return result.get('result', {}).get('value')

    def helper(self, function: str, *args):
        """Llama a una función de las ayudas de la página, inyectándolas si hace falta."""
        self.evaluate(PAGE_HELPERS)
        encoded = ', '.join(json.dumps(arg, ensure_ascii=False) for arg in args)
        return self.evaluate(f'window.__fsdoc.{function}({encoded})')

    def settle(self) -> None:
        """Espera a que la página termine de cargar y de hacer peticiones AJAX."""
        deadline = time.monotonic() + self.timeout
        while time.monotonic() < deadline:
            try:
                ready = self.evaluate(
                    "document.readyState === 'complete' && !(window.jQuery && window.jQuery.active > 0)")
            except ScreenshotError:
                ready = False
            if ready:
                break
            time.sleep(0.15)
        time.sleep(0.35)

    def navigate(self, url: str) -> None:
        """Abre una URL y espera a que cargue."""
        self.events = [e for e in self.events if e.get('method') != 'Page.loadEventFired']
        result = self.call('Page.navigate', {'url': url}, session=True)
        if result.get('errorText'):
            raise ScreenshotError(f'No se puede abrir {url}: {result["errorText"]}')
        self.wait_event('Page.loadEventFired', self.timeout)
        self.settle()

    def after_action(self) -> None:
        """Tras un clic, espera a la página nueva si el clic navegó o a que termine lo que haya lanzado."""
        time.sleep(0.4)
        self.settle()

    def screenshot(self, clip: dict | None, full_page: bool) -> bytes:
        """Captura la ventana, una zona del documento o la página entera en PNG."""
        params: dict = {'format': 'png'}
        if full_page and not clip:
            size = self.evaluate('({w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight})')
            clip = {'x': 0, 'y': 0, 'width': size['w'], 'height': size['h']}
        if clip:
            params['clip'] = {**clip, 'scale': 1}
            params['captureBeyondViewport'] = True
        return base64.b64decode(self.call('Page.captureScreenshot', params, session=True, timeout=60)['data'])

    def close(self) -> None:
        """Cierra Chrome y borra su perfil temporal."""
        try:
            self.call('Browser.close', timeout=5)
        except (ScreenshotError, OSError):
            pass
        for _ in range(50):
            pid, _ = os.waitpid(self.pid, os.WNOHANG)
            if pid:
                break
            time.sleep(0.1)
        else:
            try:
                os.kill(self.pid, 9)
                os.waitpid(self.pid, 0)
            except (ProcessLookupError, ChildProcessError):
                pass
        for fd in (self.cmd_write, self.res_read):
            try:
                os.close(fd)
            except OSError:
                pass
        shutil.rmtree(self.profile, ignore_errors=True)


def absolute_url(base_url: str, url: str) -> str:
    """Resuelve una URL de la captura respecto a ``base_url``."""
    if urlparse(url).scheme:
        return url
    return urljoin(base_url if base_url.endswith('/') else base_url + '/', url.lstrip('/'))


def login(browser: Browser, base_url: str, credentials: tuple[str, str]) -> None:
    """Inicia sesión en FacturaScripts si la página pide usuario y contraseña."""
    browser.navigate(base_url)
    form_js = "[...document.forms].find(f => f.querySelector('input[name=\"action\"][value=\"login\"]'))"
    if not browser.evaluate(f'!!{form_js}'):
        return
    user, password = credentials
    browser.evaluate(
        f'(() => {{ const f = {form_js};'
        f' f.querySelector(\'input[name="fsNick"]\').value = {json.dumps(user)};'
        f' f.querySelector(\'input[name="fsPassword"]\').value = {json.dumps(password)};'
        ' f.submit(); return true; })()')
    browser.wait_event('Page.loadEventFired', browser.timeout)
    browser.settle()
    if browser.evaluate(f'!!{form_js}'):
        raise ScreenshotError('No se ha podido iniciar sesión: revisa el usuario y la contraseña de la instalación de pruebas.')


def run_step(browser: Browser, step: dict, base_url: str, redact: dict) -> None:
    """Ejecuta un paso de una captura."""
    nth = step.get('nth', 0)
    if 'goto' in step:
        browser.navigate(absolute_url(base_url, step['goto']))
    elif 'click' in step:
        browser.helper('click', step['click'], nth, step.get('allow_change', False), redact['risky'])
        browser.after_action()
    elif 'fill' in step:
        browser.helper('fill', step['fill'], nth, step['value'])
    elif 'select' in step:
        browser.helper('choose', step['select'], nth, step['value'])
        browser.after_action()
    elif 'wait' in step:
        time.sleep(step['wait'] / 1000)
    elif 'wait_for' in step:
        deadline = time.monotonic() + step.get('timeout', browser.timeout)
        while True:
            try:
                browser.helper('find', step['wait_for'], nth)
                break
            except ScreenshotError:
                if time.monotonic() > deadline:
                    raise
                time.sleep(0.2)
    elif 'scroll_to' in step:
        browser.evaluate(PAGE_HELPERS)
        browser.evaluate(f'window.__fsdoc.find({json.dumps(step["scroll_to"])}, {nth}).scrollIntoView({{block: "center"}})')
        time.sleep(0.2)
    elif 'eval' in step:
        browser.evaluate(step['eval'])
        browser.after_action()


def run_capture(browser: Browser, scenario: dict, capture: dict, output_dir: Path | None, scan: bool) -> dict:
    """Prepara una pantalla y guarda su captura, o la inspecciona con ``--scan``."""
    base_url = scenario.get('base_url', '')
    redact = merge_redact(scenario.get('redact'), capture.get('redact'))
    hide = list(scenario.get('hide', [])) + list(capture.get('hide', []))
    result: dict = {'name': capture['name']}
    if capture.get('url'):
        browser.navigate(absolute_url(base_url, capture['url']))
    for step in capture.get('steps', []):
        run_step(browser, step, base_url, redact)
    browser.helper('prepare', hide)
    anonymized = browser.helper('redact', redact)
    result['anonymized'] = anonymized['replaced']
    if scan:
        result.update(browser.helper('scan', redact))
        return result

    marks = browser.helper('highlight', capture.get('highlight', []), DEFAULT_COLOR)
    clip = None
    clip_targets = capture.get('clip')
    if clip_targets:
        clip_targets = [clip_targets] if isinstance(clip_targets, str) else clip_targets
        clip = browser.helper('clipRect', clip_targets, marks, capture.get('margin', 16))

    # Solo cuenta lo que entra en la imagen: el recorte, la página entera o la ventana.
    if clip or capture.get('full_page', False):
        region = clip
    else:
        region = browser.evaluate('({x: scrollX, y: scrollY, width: innerWidth, height: innerHeight})')
    leaks = browser.helper('leaks', redact, region)
    if leaks:
        browser.helper('clear')
        result['error'] = ('Quedan datos personales o la marca a la vista: añádelos a «redact.replace», '
                           '«redact.blur» o «hide».')
        result['leaks'] = leaks
        return result

    png = browser.screenshot(clip, capture.get('full_page', False))
    browser.helper('clear')
    assert output_dir is not None
    path = output_dir / capture.get('file', capture['name'] + '.png')
    path.write_bytes(png)
    width, height = png_size(path)
    result.update({'file': str(path), 'width': width, 'height': height})
    return result


def load_scenario(path: Path) -> dict:
    """Lee el escenario JSON."""
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as error:
        raise ScreenshotError(f'No se puede leer el escenario {path}: {error}') from error


def run(scenario: dict, args: argparse.Namespace, env: dict) -> tuple[int, dict]:
    """Ejecuta las capturas del escenario y devuelve el código de salida y el informe."""
    captures = scenario['captures']
    if args.only:
        missing = set(args.only) - {c['name'] for c in captures}
        if missing:
            raise ScreenshotError(f'No hay capturas con el nombre: {", ".join(sorted(missing))}.')
        captures = [c for c in captures if c['name'] in args.only]

    output_dir = None
    if not args.scan:
        folder = args.output_dir or scenario.get('output_dir')
        if not folder:
            raise ScreenshotError('Indica la carpeta de las imágenes con «output_dir» o --output-dir.')
        output_dir = Path(folder).expanduser().resolve()
        output_dir.mkdir(parents=True, exist_ok=True)

    base_url = scenario.get('base_url', '')
    credentials = resolve_credentials(scenario.get('login'), env)
    viewport = {**DEFAULT_VIEWPORT, **scenario.get('viewport', {})}
    insecure = scenario.get('insecure', is_local_url(base_url) if base_url else False)
    browser = Browser(find_chrome(args.chrome, env), viewport, insecure, scenario.get('timeout', DEFAULT_TIMEOUT))
    results = []
    try:
        if credentials:
            login(browser, base_url, credentials)
        for capture in captures:
            try:
                results.append(run_capture(browser, scenario, capture, output_dir, args.scan))
            except ScreenshotError as error:
                results.append({'name': capture['name'], 'error': str(error)})
    finally:
        browser.close()
    failed = [r for r in results if 'error' in r]
    report = {'output_dir': str(output_dir) if output_dir else None, 'scan': args.scan, 'captures': results,
              'failed': len(failed)}
    return (1 if failed else 0), report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description='Capturas anotadas y anonimizadas para la documentación de FacturaScripts.')
    parser.add_argument('scenario', help='Escenario JSON con las capturas.')
    parser.add_argument('--only', nargs='+', help='Solo las capturas con estos nombres.')
    parser.add_argument('--scan', action='store_true', help='Inspecciona las pantallas sin guardar capturas.')
    parser.add_argument('--check', action='store_true', help='Solo valida el escenario.')
    parser.add_argument('--output-dir', help='Carpeta de las imágenes (sustituye a «output_dir»).')
    parser.add_argument('--chrome', help='Ruta del ejecutable de Chrome o Chromium.')
    args = parser.parse_args(argv)

    try:
        scenario = load_scenario(Path(args.scenario))
    except ScreenshotError as error:
        print(json.dumps({'error': str(error)}, ensure_ascii=False, indent=2))
        return 2
    errors = validate_scenario(scenario)
    if errors or args.check:
        print(json.dumps({'valid': not errors, 'errors': errors}, ensure_ascii=False, indent=2))
        return 2 if errors else 0

    try:
        code, report = run(scenario, args, dict(os.environ))
    except ScreenshotError as error:
        print(json.dumps({'error': str(error)}, ensure_ascii=False, indent=2))
        return 2
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return code


if __name__ == '__main__':
    sys.exit(main())
