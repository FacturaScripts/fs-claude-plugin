---
name: crear-xmlview
description: Guía para escribir un archivo XMLView concreto de FacturaScripts con sus columnas, grupos, widgets, filas, botones y modales.
---

# Skill: crear un XMLView de FacturaScripts

Los archivos XMLView definen las columnas y los botones de las pestañas de los controladores extendidos (ListController, EditController y PanelController) (`las-vistas-xml-xmlview-668.md`). Los filtros de los listados no se definen aquí, sino en el controlador con los métodos `addFilter*()` (consulta la skill `fs-dev:crear-controlador`).

## Ubicación

- Vista propia: `Plugins/MiPlugin/XMLView/NombreVista.xml`. El nombre coincide con el `viewName` de la pestaña, sin el sufijo `-N`.
- Extensión de una vista ajena: `Plugins/MiPlugin/Extension/XMLView/NombreVista.xml` (consulta la skill `fs-dev:crear-extension`).

## Estructura completa

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <!-- OBLIGATORIO: columnas. En formularios se agrupan en <group>; en listados van sueltas -->
    <columns>
        <group name="data" numcolumns="8" title="main-data" icon="fa-solid fa-circle-info">
            <column name="name" numcolumns="8" order="100" description="desc-name">
                <widget type="text" fieldname="nombre" required="true" maxlength="100"/>
            </column>
            <column name="customer" numcolumns="4" order="110">
                <widget type="autocomplete" fieldname="codcliente" onclick="EditCliente">
                    <values source="clientes" fieldcode="codcliente" fieldtitle="nombre"/>
                </widget>
            </column>
        </group>
    </columns>

    <!-- OPCIONAL: filas especiales; una sola de cada tipo -->
    <rows>
        <row type="status">
            <option color="success" fieldname="estado" title="active">ACTIVO</option>
            <option color="danger" fieldname="estado" title="inactive">INACTIVO</option>
        </row>
        <row type="actions">
            <button type="action" action="my-action" label="my-action" icon="fa-solid fa-bolt" color="info"/>
            <button type="modal" action="my-modal" label="more-data" icon="fa-solid fa-plus"/>
        </row>
    </rows>

    <!-- OPCIONAL: modales; cada uno es un <group> -->
    <modals>
        <group name="my-modal" title="more-data" icon="fa-solid fa-plus" class="modal-lg">
            <column name="notes" numcolumns="12">
                <widget type="textarea" fieldname="notas" rows="3"/>
            </column>
        </group>
    </modals>
</view>
```

## Atributos de `column`

| Atributo | Valores | Descripción |
|----------|---------|-------------|
| `name` | texto | Identificador único (obligatorio); título por defecto, traducido |
| `title` | clave de traducción | Título visible |
| `description` | clave de traducción | Ayuda bajo el campo en formularios |
| `titleurl` | URL | Enlace en el título |
| `order` | entero | Orden dentro del grupo, de menor a mayor |
| `numcolumns` | 1-12 | Ancho en la rejilla de Bootstrap |
| `display` | `left`, `center`, `right`, `none` | Alineación, o `none` para ocultar |
| `level` | entero | Nivel mínimo de seguridad para verla |

`required`, `readonly` (`true`, `false` o `dynamic`), `onclick`, `icon` y `translate` son atributos del **widget**, no de la columna (`widget-238.md`).

## Widgets disponibles

```xml
<widget type="text" fieldname="nombre" maxlength="100"/>
<widget type="textarea" fieldname="observaciones" rows="3"/>
<widget type="number" fieldname="cantidad" decimal="2" min="0" step="1"/>
<widget type="money" fieldname="precio"/>                          <!-- símbolo de coddivisa -->
<widget type="percentage" fieldname="dtopor" decimal="0" max="100"/> <!-- 21 = 21 % -->
<widget type="seconds" fieldname="duracion"/>                      <!-- s, m, h o d en listados -->
<widget type="bytes" fieldname="tamano" multiplier="1048576"/>     <!-- KB, MB, GB, TB -->
<widget type="date" fieldname="fecha"/>
<widget type="datetime" fieldname="creationdate"/>
<widget type="time" fieldname="hora" step="60"/>
<widget type="checkbox" fieldname="activo"/>
<widget type="color" fieldname="color"/>
<widget type="password" fieldname="clave"/>
<widget type="link" fieldname="web"/>                              <!-- enlaza a la URL del campo -->
<widget type="stars" fieldname="valoracion"/>
<widget type="file" fieldname="archivo" accept=".csv,.xlsx" multiple="true"/>
<widget type="library" fieldname="idlogo" accept=".png,.jpg"/>
<widget type="subcuenta" fieldname="codsubcuenta"/>
<widget type="variante" fieldname="referencia"/>                   <!-- match="idproducto" para otro campo -->
<widget type="json" fieldname="context" readonly="true"/>
<widget type="info" alert="info" icon="fa-solid fa-circle-info" text="my-help-text"/> <!-- sin fieldname -->

<!-- Valores fijos: select, radio o datalist -->
<widget type="select" fieldname="tipo" translate="true">
    <values title="type-1">1</values>
    <values title="type-2">2</values>
</widget>

<!-- Valores de una tabla o modelo: select, datalist o autocomplete -->
<widget type="select" fieldname="codpais">
    <values source="paises" fieldcode="codpais" fieldtitle="nombre"/>
</widget>
<widget type="datalist" fieldname="provincia" parent="codpais">
    <values source="provincias" fieldcode="provincia" fieldtitle="provincia" fieldfilter="codpais"/>
</widget>
<widget type="radio" fieldname="plantilla" class="form-check-inline">
    <values title="simple">simple</values>
    <values title="complete">complete</values>
</widget>
```

Cada `widget-*.md` detalla sus atributos. `info` admite además `href`, `btn-text`, `btn-class`, `template` y `class`; antes de la versión 2026.71, `json` vaciaba el campo al guardar.

Coloreado del contenido de cualquier widget: `<option color="danger">lt:0</option>`, con los operadores `gt:`, `gte:`, `lt:`, `lte:`, `neq:`, `null:` y `notnull:`.

## Filas especiales (`rows`)

- **`status`**: colorea la fila; `<option color fieldname title>valor</option>`, con los mismos operadores y `field:otracolumna` (`row-status-477.md`).
- **`actions`**: botones `type="action|modal|link|js"` con `action`, `label`, `title`, `icon`, `color`, `confirm` y `target` (`row-actions-315.md`).
- **`statistics`**: `<datalabel label icon function link/>`, donde `function` es un método público del controlador que devuelve el texto (`row-statistics-603.md`).
- **`header`** y **`footer`**: paneles `<group name title label footer html class numcolumns>` con botones dentro; los botones sueltos no se muestran (`row-header-y-footer-565.md`).

## Modales

- Cada modal es un `<group>` dentro de `<modals>` y se abre con un botón `type="modal"` cuyo `action` es el `name` del grupo.
- Tamaños: `class="modal-sm"`, `modal-lg` o `modal-xl`.
- Al aceptar, el controlador recibe el `name` del grupo como `action` (`modals-718.md`).

## Comprobaciones

- [ ] Los `name` de grupos y columnas son únicos, en minúsculas y en inglés; los textos visibles son claves de traducción.
- [ ] Cada columna tiene un solo widget y su `fieldname` existe en el modelo.
- [ ] Tras cambiar el XML se ha reconstruido el plugin y, si la vista se personalizó con el botón de opciones, se han eliminado esos cambios.

## Para más información

Consulta la skill `fs-dev:docs-expert` para revisar la documentación oficial. Para diseñar varias vistas, filtros y la configuración de pestañas a la vez, usa `fs-dev:ui-designer`.
