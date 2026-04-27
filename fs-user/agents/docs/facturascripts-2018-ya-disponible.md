---
id: 34
permalink: facturascripts-2018-ya-disponible
title: FacturaScripts 2018 ya disponible
creationdate: 01-04-2019 17:05:50
lastmod: 22-09-2019
url: https://facturascripts.com/publicaciones/facturascripts-2018-ya-disponible
---

Tras solucionar los problemas detectados en la [Real Candidate](https://facturascripts.com/publicaciones/real-candidate-de-facturascripts-2018-ya-disponible), hoy hemos lanzado la versión estable de FacturaScripts 2018.

## Un largo camino
Comenzamos a mediados de 2017 con un prototipo prometedor que resolvía las limitaciones de la versión anterior:
- Herencia de cualquier modelo.
- Herencia de cualquier controlador.
- Herencia de plantillas.
- Extraer de los controladores muchas funcionalidades que no deberían estar ahí.

Pero rápidamente encontramos nuevos problemas a solucionar:
- Nuevos controladores estándar para listados y edición (hasta entonces no teníamos).
- Personalización de listados (por parte del usuario).
- Imprimir/exportar cualquier listado.
- Nuevo panel de control personalizable.

## Abandono de compatibilidad con Eneboo
Hasta la versión 2017 hemos mantenido cierta compatibilidad con la base de datos de Eneboo. Esto ha tenido una parte positiva, que nos ahorramos diseñar desde cero. Pero también ha tenido una parte muy negativa: heredar todos los problemas de diseño de Eneboo.

Al comenzar con FacturaScripts 2018 nos planteamos olvidar la compatibilidad con Eneboo y solucionar los problemas de diseño de base de datos más urgentes:
- Rediseño de toda la parte de artículos: productos, variantes, stock, etc...
- Rediseño de la parte de contabilidad.
- Rediseño de contactos...

## Un núcleo más completo
Otro de los cambios que nos propusimos fue fortalecer FacturaScripts con funciones que hasta ahora solamente estaban en plugins, como por ejemplo **editar facturas**, gestión de **recibos** y gestión de **contactos**. Esto parece una tontería, pero el plugin de [editar_facturas](https://facturascripts.com/plugin/editar_facturas) supone una buena parte de los ingresos del proyecto...

## Una nueva web
No sólo necesitábamos una nueva web, sino que necesitábamos separar las funcionalidades en plugins para que fuesen más versátiles. La anterior web era un plugin monolítico y privado. Esta nueva web está construida sobre los plugins [webportal](https://facturascripts.com/plugins/webportal), [Community](https://facturascripts.com/plugins/Community), [ecommerce](https://facturascripts.com/plugins/ecommerce) y elearning. Plugins que no solamente sirven para esta web, sino que pretendemos que sean usados por más clientes en más proyectos.

## Siguientes pasos
Tras este tocho de justificación de por qué lanzamos FacturaScripts 2018 en el 2019, lo que interesa ahora es saber cuáles son los siguientes pasos que daremos.

### Lanzamientos para Abril
- Plugin de **migración** de 2017 a 2018.
- Curso básico de **usuario** (versión 2018).
- Curso básico de **programación** (versión 2018).
