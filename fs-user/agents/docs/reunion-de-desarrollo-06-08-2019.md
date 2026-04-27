---
id: 87
permalink: reunion-de-desarrollo-06-08-2019
title: Reunión de desarrollo (06-08-2019)
creationdate: 06-08-2019 11:14:26
lastmod: 06-08-2019
url: https://facturascripts.com/publicaciones/reunion-de-desarrollo-06-08-2019
---

En esta reunión hemos comentado los cambios a implementar en la siguiente actualización de FacturaScripts:

## Desarrollo ya completado
Se ha implementado una nueva clase para el envío de emails ([Core/Lib/NewMail](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Lib/Email/NewMail.php)) mucho más sencilla y potente:
- Permite añadir bloques.
- Cuenta (por ahora) con 3 tipos de bloques: texto, botones y tablas.
- Se puede extender desde los plugins y añadir más información a los emails que se envían.
- Incluye automáticamente la firma definida en las preferencias de la aplicación.

## Tareas pendientes
Si quieres encargarte de cualquiera de estas tareas, solamente tienes que pedirlo en el chat o en la sección contacto:
- [Modificar los test de los modelos user, role, almacen, etc... para verificar que no permiten comillas en su clave primaria](https://facturascripts.com/EditTask?code=215).
- [Añadir función pública setCustomValue($value) a baseWidget para poder establecer un valor desde el controlador](https://facturascripts.com/EditTask?code=36).
- [Crear archivo de ciudades para México, con todas las ciudades y su respectiva provincia](https://facturascripts.com/EditTask?code=231).
- [Modificar el modelo impuestos para añadir un selector de tipo: porcentaje, valor fijo](https://facturascripts.com/EditTask?code=248).
- [Crear archivo de ciudades para Costa Rica](https://facturascripts.com/EditTask?code=249).
- [Modificar la clase /Core/Base/DivisaTools para añadir el método transform($amount, $coddivisa1, $coddivisa2)](https://facturascripts.com/EditTask?code=251).
- [Añadir validación de RFC (México) a la clase Core/Lib/FiscalNumberValitator](https://facturascripts.com/EditTask?code=256).
- [Añadir validación de RUC (Ecuador) a la clase Core/Lib/FiscalNumberValitator](https://facturascripts.com/EditTask?code=257).
- [Eliminar los métodos alert(), debug(), emergency() y notice() de la clase Core/Base/MiniLog](https://facturascripts.com/EditTask?code=254).
- [Añadir validación de NIT (Colombia) a la clase Core/Lib/FiscalNumberValitator](https://facturascripts.com/EditTask?code=255).
- [Ampliar el método de exportación de la clase gridview para poder exportar (imprimir) también el detalle (las líneas)](https://facturascripts.com/EditTask?code=208).
- [Crear archivo de ciudades para Rep. Dominicana](https://facturascripts.com/EditTask?code=258).
- [Añadir validación de RNC (Rep. Dominicana) a la clase Core/Lib/FiscalNumberValitator](https://facturascripts.com/EditTask?code=259).
- [Añadir codagente al modelo User. Al crear un nuevo documento de venta, usar ese agente](https://facturascripts.com/EditTask?code=239).

## Próxima reunión
El equipo de desarrollo se reúne **todos los martes** a las **10:30** (hora española) en el canal de FacturaScripts en jitsi. Y **de nuevo a las 18:30** (hora española) para los que no han podido acudir a la primera reunión.
https://meet.jit.si/facturascripts

### Chat para programadores
También podéis comentar lo que queráis (sobre FacturaScripts) en nuestro [chat para programadores](https://join.slack.com/t/facturascripts/shared_invite/enQtMjk5OTA0NjA2MjQ0LTAxMDAyY2VjYTQ1YjNkNWFlNjMxNTM3NzcxYzE5N2M0YTMwNGIwY2I1ODlmN2RmNDkwNDNkZjZlZGNkNDYxYzE).
