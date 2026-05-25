---
idproject: 555
name: MoodleManagement
permalink: moodlemanagement
creationdate: 06-03-2026
lastmod: 01-04-2026
version: 1.1
betaversion: 0.9
mincore: 2025.6
maxcore: 2026.2
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/MoodleManagement
---
MoodleManagement es un Plugin para FacturaScripts que permite gestionar plataformas Moodle directamente desde el ERP. Conecta tu sistema de facturación con tu LMS mediante la API REST de Moodle.

FUNCIONALIDADES
1. Gestión de Instancias Moodle
- Conexión a múltiples instancias de Moodle simultáneamente
- Test de conexión y monitoreo de estado (activa, mantenimiento, inactiva)
- Visualización de información del sitio (versión, release, funciones WS disponibles)
- Soporte para entornos: producción, staging, desarrollo

2. Sincronización de Usuarios
- Importación masiva de usuarios desde Moodle a FacturaScripts
- Mapeo bidireccional usuario Moodle - contacto FacturaScripts
- Creación automática de clientes/contactos al importar
- Sincronización individual y masiva

3. Gestión de Cursos
- Importación y sincronización de cursos desde Moodle
- Vinculación de cursos Moodle con productos de FacturaScripts
- Creación automática de productos y familias por curso
- Duplicación de cursos directamente desde FS
- Gestión de categorías de cursos (importar, crear, sincronizar)
- Sincronización de imágenes de portada entre producto y curso

4. Contenido del Curso (Actividades y Secciones)
- Visualización en tiempo real del contenido del curso vía API
- Gestión de secciones: crear, ocultar/mostrar, mover, eliminar
- Gestión de actividades: ocultar/mostrar, duplicar, mover entre secciones, eliminar
- Modo stealth (solo enlace) para actividades
- Indentación de actividades (derecha/izquierda)
- Cambio de modo de grupo (sin grupos, grupos separados, grupos visibles)
- Acciones masivas con selección múltiple
- Modal de detalle de módulo con información completa

5. Matrículas (Enrolments)
- Gestión de matrículas por curso e instancia
- Soporte para métodos: manual, auto-matrícula, pago, cohort, meta-enlace
- Estados de matrícula: pendiente, matriculado, suspendido, desmatriculado
- Vinculación con documentos comerciales (facturas, pedidos, presupuestos)
- Meta-matrículas entre cursos
- Acciones batch: matricular, desmatricular y suspender múltiples alumnos de una vez

6. Cohorts
- Importación de cohorts desde Moodle
- Sincronización de miembros
- Gestión de membresía (agregar/eliminar miembros)

7. Roles
- Mapeo de los 8 roles estándar de Moodle por instancia
- Importación automática de roles estándar

8. Mensajería Bidireccional
- Chat individual estilo WhatsApp con usuarios Moodle desde la ficha del usuario
- Auto-refresco cada 5 segundos sin recargar la página
- Envío de mensajes rápidos desde modal en la ficha del usuario
- Envío masivo a todos los matriculados de un curso con selección de destinatarios
- Hub de Conversaciones: página central con todas las conversaciones de todas las instancias
- Semáforo visual de mensajes no leídos con badges de conteo
- Filtros: Todos, Solo No Leídos, Solo Leídos
- Icono de chat en la barra de navegación con badge de no leídos (actualización cada 30 segundos)
- Marcado automático de mensajes como leídos al abrir un chat

9. Progreso Académico
- Porcentaje de completitud por curso con barra de progreso visual
- Calificaciones obtenidas en el gradebook de cada curso
- Conteo de actividades completadas respecto al total
- Fecha de último acceso por curso
- Datos en tiempo real consultados directamente a Moodle vía API

10. Badges y Certificados
- Sincronización automática de badges al guardar un mapeo de usuario
- Sincronización masiva de badges de todos los usuarios mapeados bajo demanda
- Listado global de certificados con filtros por contacto e instancia
- Vista de detalle con datos completos: nombre, curso, fechas, hash, imagen, URLs
- Vinculación de badges con facturas de FacturaScripts

11. Dashboard e Informes
- Panel de control con 6 tarjetas KPI (instancias, usuarios, matrículas activas, pendientes, suspendidas, sin facturar)
- Gráfico de distribución por estado de matrícula (donut)
- Gráfico de tendencia mensual de matrículas de los últimos 6 meses (barras)
- Gráfico de top 5 cursos con más alumnos (barras horizontales)
- Gráfico de distribución por método de matrícula (tarta)
- Informe de matrículas sin facturar
- Informe de matrículas por estado
- Informe de matrículas por curso
- Filtros en todos los informes: instancia, contacto, estado, método de matrícula

12. Gestión de Grupos de Curso
- Visualización de grupos de un curso en tiempo real desde Moodle
- Crear y eliminar grupos directamente desde FS
- Ver miembros de cada grupo con conteo
- Agregar y eliminar miembros de grupos

13. Formación del Cliente
- Pestaña &quot;Formación&quot; en la ficha del cliente de FacturaScripts
- Resumen de actividad formativa: contactos matriculados, estados, importe facturado
- Desglose por curso con número de alumnos e importe
- Lista de matrículas filtrada por cliente

14. Automatización de Procesos
- Matrícula automática: al pagar una factura con productos vinculados a cursos, el alumno se matricula automáticamente en Moodle
- Pre-matrícula: al crear presupuestos o pedidos, se generan matrículas pendientes que se activan al facturar
- Sincronización de contactos: al modificar un contacto en FS, los datos se sincronizan automáticamente con Moodle
- Suspensión automática: al eliminar un contacto en FS, se suspende su cuenta y matrículas en Moodle
- Sincronización de badges: al guardar un mapeo de usuario, se sincronizan automáticamente sus badges desde Moodle
- Health check (cada hora): monitoreo automático del estado de todas las instancias Moodle
- Sincronización incremental (cada 6 horas): sincronización de usuarios y cursos con resolución de conflictos
- Reconciliación (diaria): verificación de integridad de mapeos de usuarios y matrículas contra Moodle
- Limpieza (diaria): eliminación automática de mapeos huérfanos (contactos eliminados)
- Control de expiración (cada 6 horas): detección de matrículas por vencer (7 días) y expiración automática

REQUISITOS
- FacturaScripts &gt;= 2025.6
- Moodle &gt;= 4.0 (recomendado 4.5+)
- PHP &gt;= 8.0 con extensión cURL