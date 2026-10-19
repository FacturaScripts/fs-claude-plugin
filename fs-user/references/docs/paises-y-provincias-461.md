---
id: 783
permalink: paises-y-provincias-461
title: Países y provincias
creationdate: 25-01-2019 00:00:00
lastmod: 03-09-2026
url: https://facturascripts.com/publicaciones/paises-y-provincias-461
---
Los datos geográficos de FacturaScripts se gestionan desde el **menú Administrador** → **Países**. Esa pantalla tiene seis pestañas: **Países**, **Provincias**, **Ciudades**, **Códigos postales**, **Puntos de interés** y **Divisas**.

Vienen precargados todos los países y, para España, sus provincias, así que lo normal es que no tengas que tocar nada. Solo necesitarás entrar aquí si trabajas con clientes de un país cuyas provincias no estén cargadas, o si quieres corregir un nombre.

FacturaScript ya tiene precargado todos los países disponibles. Para añadir un nuevo país haga clic en el **botón nuevo**, o pinche sobre un país para editarlo.

![Añadir país](https://i.imgur.com/5mAHfI1.png)

## Datos a rellenar:
- **Código alfa 3**: estandar ISO 3166 de tres caracteres. Ejemplo: ESP.
- **Código alfa 2**: estandar ISO 3166 de dos caracteres. Ejemplo: ES.
- **Nombre**: nombre completo del país.

![Datos a rellenar del país](https://i.imgur.com/cI1Y09n.png)

## Provincias
FacturaScript ya provee las provincias para España por defecto. Para añadir una nueva provincia haga clic en el país al que pertenece la provincia y en el **botón nuevo** del apartado de provincias, o pinchando sobre una provincia para editarla.

![Añadir provincia](https://i.imgur.com/zzp3G2e.png)

- **País**: seleccione el país al que pertenece la provincia.
- **Provincia**: nombre completo de la provincia.
- **ISO**: estandar ISO de dos caracteres.
- **Código postal**: numeración postal de la provincia.
- **Latitud**: coordenadas geográficas.
- **Longitud**: coordenadas geográficas.
- **Fecha de revisión**: última fecha de comprobación de los datos.

![Datos a rellenar de la provincia](https://i.imgur.com/zCoSb0A.png)

## 🏙️ Ciudades
En la pestaña **Ciudades** puedes dar de alta poblaciones y asignarlas a una provincia. Tienes un filtro por provincia y el buscador funciona por nombre y por alias.

El campo **alias** sirve para los nombres alternativos de una misma población (por ejemplo, el nombre en otro idioma), de forma que al escribirlo en una ficha de cliente el programa la encuentre igual.

## 📮 Códigos postales
La pestaña **Códigos postales** es un catálogo que relaciona cada código con su país, provincia y ciudad. Puedes filtrar por los tres. El núcleo de FacturaScripts no lo usa por sí solo: sirve como tabla de referencia para los plugins y las integraciones que necesitan resolver un código postal.

## 📍 Puntos de interés
Los puntos de interés son ubicaciones concretas dentro de una ciudad (un polígono industrial, un centro comercial, un puerto…), con su nombre, su alias y sus coordenadas de latitud y longitud. Como los códigos postales, es un catálogo que aprovechan los plugins de logística y reparto. Puedes filtrar por ciudad.

## 💱 Divisas
La pestaña **Divisas** es un acceso directo a la misma configuración que explicamos en [divisas](https://facturascripts.com/publicaciones/divisas-773).

## ⚠️ Antes de borrar un país o una provincia
No elimines un país o una provincia que ya esté en uso en fichas de clientes, proveedores o empresas: esos registros se quedarían sin la referencia. Si el nombre está mal escrito, edítalo en lugar de borrarlo y crearlo de nuevo.

## Ver también

- [Divisas](https://facturascripts.com/publicaciones/divisas-773)
- [Empresas](https://facturascripts.com/publicaciones/empresas-524)
- [Error: Tabla de ciudades no encontrada](https://facturascripts.com/publicaciones/error-tabla-ciudades-no-encontrada)