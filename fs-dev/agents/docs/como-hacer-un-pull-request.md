---
id: 2076
permalink: como-hacer-un-pull-request
title: Cómo hacer un pull request
creationdate: 17-03-2025 13:32:47
lastmod: 18-03-2025
url: https://facturascripts.com/como-hacer-un-pull-request
---
En esta sección vamos a comentar como realizar un pull request a facturascripts. Vamos a seguir los siguientes pasos sólidos:

- hacemos un fork del repositorio
- clonamos el repositorio
- realizamos nuestros cambios en una rama aparte
- juntamos las ramas y hacemos un pull
- lo subimos a nuestro repositorio y solicitamos pull request
- se discuten y arreglan las incongruencias y colaboramos en el proyecto

### Fork del repositorio

Este primer paso, es sencillo. Vamos a github, en concreto al repositorio al que queremos colaborar y hacemos un fork. Para ello pulsamos en fork:

![](https://i.imgur.com/u86C2Nm.png)

Después confirmamos.

![](https://i.imgur.com/hhhj0fp.png)

### Realización de cambios

Ahora lo que vamos a hacer es descargar o clonar ese repositorio al que le hemos hecho fork. Simplemente hacemos un `git clone` de mi repositorio y ya lo tendría.

Después de clonarlo creamos una nueva rama con `git branch` y realizamos los cambios que queremos en esa rama para mantener la rama principal limpia (`git checkout` es para cambiar de rama).

&gt; Consejo: Seguir las [directrices convencionales de commits](https://www.conventionalcommits.org/) para que esté todavía más claro y realizar cambios atómicos o pequeños y específicos para que esté claro que se ha modificado en cada paso.

Cuando terminemos de realizar nuestros cambios podemos hacer un `git merge` de la nueva rama para agregar los cambios que hemos introducido en la rama principal.

Finalmente subimos los cambios a nuestro repositorio

![](https://i.imgur.com/ICHjs80.png)

### Solicitar pull request

Una vez hemos subido los cambios a nuestro repositorio, github nos da la opción de solicitar un pull request, para así mostrar y debatir los cambios que queremos aplicar.

En la siguiente imagen podemos observar tres cosas:

- Github nos comunica que estamos un commit por encima del repositorio original.
- Disponemos de un botón para contribuir.
- Si pulsamos el boton, nos ofrece la posibilidad de solicitar pull request.

![](https://i.imgur.com/7f0tikg.png)

Una vez iniciada la solicitud del pull request, debes colocar una descripción y un título a la pull request.

![](https://i.imgur.com/H6aL3DY.png)

Como se puede observer, en este caso ya viene automáticamente rellenada la descripción con que pautas tenemos que seguír para colaborar en facturascripts. Es importante seguir las pautas que menciona para que tu pull request sea aceptada.

![](https://i.imgur.com/0CphPOv.png)

Una vez has terminado de seguir las pautas correctamente tal y como se indica en la descripción, es momento de solicitar la pull.

### Discutir cambios

Hay un paso extra, una vez hecha la pull request no acaba ahí, se abre un hilo en el que puedes realizar varias acciones:

- Puedes agregar más commits subiendo los cambios a tu repositorio (en el que has subido los cambios).
- Puedes agregar comentarios a tus commits actuales.
  

Aquí en la imagen puedes observar como se visualiza.

![](https://i.imgur.com/Rmv5Eg1.png)

Una vez hecho el pull request debemos esperar a que los encargados revisen el commit y nos den feedback para cambiar alguna cosa que está incorrecta o aceptar la pull request o rechazarla. Github suele notificarte por correo electrónico de ello.

![](https://i.imgur.com/g0GoJ6Z.png)

En este caso la pull request ha sido aceptada sin ningun problema porque estaba todo correcto y no había nada que mejorar.
