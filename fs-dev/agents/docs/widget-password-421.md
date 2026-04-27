---
id: 657
permalink: widget-password-421
title: Widget Password (campo contraseña)
creationdate: 06-10-2018 00:00:00
lastmod: 10-11-2025
url: https://facturascripts.com/publicaciones/widget-password-421
---

En los archivos XMLView puedes usar el widget password (WidgetPassword) para mostrar y editar contraseñas en formularios. Su comportamiento es idéntico al del [widget de texto](https://facturascripts.com/publicaciones/widget-text-96), salvo que muestra puntos en lugar de los caracteres de la contraseña.

```xml
&lt;column name=&quot;new-password&quot; numcolumns=&quot;4&quot; order=&quot;100&quot;&gt;
	&lt;widget type=&quot;password&quot; fieldname=&quot;newPassword&quot; /&gt;
&lt;/column&gt;
```

## ⚙️ Configuración

A continuación tienes las propiedades más útiles del widget y cómo usarlas. Usa siempre `fieldname` para enlazar con el campo del modelo.

- **fieldname** (obligatorio): nombre del campo que contiene la contraseña. Ejemplo: `fieldname=&quot;newPassword&quot;`.
- **required**: si lo pones (`required=&quot;true&quot;`) impide guardar el formulario cuando el campo está vacío.
- **icon**: nombre del icono que se mostrará dentro del campo. Revisa los [iconos disponibles](https://facturascripts.com/publicaciones/iconos-disponibles-308). Ejemplo: `icon=&quot;fa-solid fa-lock&quot;`.
- **maxlength**: longitud máxima permitida para la contraseña. Ejemplo: `maxlength=&quot;32&quot;`.

## 🧩 Ejemplos prácticos

Ejemplo básico:

```xml
&lt;widget type=&quot;password&quot; fieldname=&quot;userPassword&quot; /&gt;
```

Ejemplo con validación obligatoria y límite de longitud:

```xml
&lt;widget type=&quot;password&quot; fieldname=&quot;newPassword&quot; required=&quot;true&quot; maxlength=&quot;64&quot; /&gt;
```

Ejemplo con icono visible en el campo:

```xml
&lt;widget type=&quot;password&quot; fieldname=&quot;apiKey&quot; icon=&quot;fa-solid fa-key&quot; /&gt;
```

## 👁️ Mostrar/ocultar contraseña

El widget incluye un icono de ojo que permite alternar la visibilidad de la contraseña: si haces clic en el ojo verás los caracteres; vuelve a hacer clic para ocultarlos como puntos. Esta funcionalidad es puramente visual y no cambia cómo se guarda el dato.

![widget password edicion](https://i.imgur.com/yR8JKM3.png)

## 🔐 Seguridad y buenas prácticas

- El widget solo controla la presentación en la interfaz; asegúrate de validar y proteger la contraseña en el servidor (hash, sal, etc.).
- No dependas únicamente del atributo `maxlength` para la seguridad; también valida en el backend.
- Usa `required` cuando la contraseña sea obligatoria y muestra mensajes claros al usuario sobre requisitos (longitud mínima, caracteres especiales, etc.).
