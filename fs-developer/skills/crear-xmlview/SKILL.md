---
name: crear-xmlview
description: Crea o modifica archivos XMLView de FacturaScripts para definir columnas, widgets, filtros y acciones en vistas.
---

# Skill: Crear XMLView FacturaScripts

Los archivos XMLView definen la interfaz de usuario para ListController y EditController.

## Ubicación
- Plugin propio: `Plugins/MiPlugin/XMLView/NombreVista.xml`
- Extensión de otra vista: `Plugins/MiPlugin/Extension/XMLView/NombreVista.xml`

## Estructura completa

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <!-- OBLIGATORIO: definición de columnas -->
    <columns>
        <!-- Para EditController: usar <group> para agrupar campos -->
        <group name="data" numcolumns="8" title="Datos principales" icon="fas fa-info">
            <column name="name" numcolumns="8" order="100" required="true">
                <widget type="text" fieldname="name" />
            </column>
        </group>
    </columns>

    <!-- OPCIONAL: filas especiales (colores, botones) -->
    <rows>
        <row type="status">
            <option color="success" fieldname="estado">ACTIVO</option>
            <option color="danger" fieldname="estado">INACTIVO</option>
        </row>
        <row type="actions">
            <button label="Acción" type="action" action="mi-accion" icon="fas fa-bolt" />
        </row>
    </rows>

    <!-- OPCIONAL: modales -->
    <modals>
        <modal name="mi-modal" title="Mi Modal">
            <column name="field1" order="100">
                <widget type="text" fieldname="field1" />
            </column>
        </modal>
    </modals>
</view>
```

## Widgets disponibles

```xml
<!-- Texto -->
<widget type="text" fieldname="nombre" maxlength="100" />

<!-- Número -->
<widget type="number" fieldname="cantidad" decimal="2" />

<!-- Dinero -->
<widget type="money" fieldname="precio" />

<!-- Fecha -->
<widget type="date" fieldname="fecha" />

<!-- Fecha y hora -->
<widget type="datetime" fieldname="fecha_hora" />

<!-- Checkbox -->
<widget type="checkbox" fieldname="activo" />

<!-- Select (lista desplegable) -->
<widget type="select" fieldname="tipo">
    <values title="Opción 1">1</values>
    <values title="Opción 2">2</values>
</widget>

<!-- Autocomplete (busca en modelo) -->
<widget type="autocomplete" fieldname="codcliente" fieldcode="codcliente" fieldtitle="nombre" source="clientes" />

<!-- Textarea -->
<widget type="textarea" fieldname="observaciones" rows="3" />

<!-- Link -->
<widget type="link" fieldname="url" />

<!-- Color -->
<widget type="color" fieldname="color" />

<!-- Password -->
<widget type="password" fieldname="contrasena" />
```

## Atributos de column

| Atributo | Valores | Descripción |
|----------|---------|-------------|
| `name` | string | Identificador de la columna (clave traducción) |
| `order` | integer | Orden de aparición |
| `numcolumns` | 1-12 | Ancho en grid Bootstrap |
| `display` | left, center, right, none | Alineación |
| `required` | true/false | Campo obligatorio |
| `readonly` | true/false | Solo lectura |


## Para más información

Para consultar la documentación oficial completa sobre XMLView, widgets y columnas, invoca el agente **docs-expert** que te proporcionará detalles completos directamente desde la documentación oficial del framework.
