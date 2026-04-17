---
name: api-designer
description: >
  Diseña y crea endpoints REST API en FacturaScripts delegando al agente especializado
  `api-designer`. ACTIVAR SIEMPRE que el usuario pregunte o pida trabajar con: la API REST
  de FacturaScripts, endpoints de modelos (GET, POST, PUT, DELETE), endpoints personalizados
  (ApiController, Kernel::addRoute, ApiRoot::addCustomResource), autenticación por token API,
  filtros y paginación en la API, conexión entre instancias de FacturaScripts vía API, cliente
  HTTP (Http::get/post), subida/descarga de archivos por API, o creación de facturas/documentos
  vía API. Si la tarea involucra cualquier aspecto de la API REST, activa esta skill.
---

# Skill: api-designer — Diseño de API REST de FacturaScripts

Esta skill conecta las peticiones relacionadas con la API REST del usuario con el agente
`api-designer`, que tiene conocimiento profundo del sistema de API de FacturaScripts.

## Por qué usar el agente

El agente `api-designer` conoce la estructura de la API REST de FacturaScripts: endpoints
estándar de modelos (CRUD automático), endpoints personalizados (ApiController), autenticación
por token, filtros con operadores (_gt, _gte, _lt, _like), paginación, y el cliente HTTP
para conectar con APIs externas. Diseñar APIs sin este conocimiento puede resultar en
endpoints que no siguen las convenciones del framework.

## Cómo invocar el agente

```
Agente: api-designer
Tarea: [descripción exacta de lo que necesita el usuario con la API]
```

El agente:
1. Consulta la documentación de API en `./agents/docs/`
2. Analiza los endpoints existentes
3. Diseña e implementa los endpoints necesarios
4. Registra rutas en Init.php si son endpoints personalizados
5. Documenta cada endpoint con ejemplos de petición/respuesta

## Qué tareas activan esta skill

- "Necesito un endpoint personalizado para exportar datos de clientes"
- "¿Cómo creo una factura usando la API REST?"
- "Quiero conectar mi FacturaScripts con otra instancia vía API"
- "Necesito un endpoint que devuelva estadísticas de ventas"
- "¿Cómo subo un archivo usando la API?"
- "¿Cómo filtro facturas por fecha en la API?"
- "Crea un endpoint para que un sistema externo consulte stock"
- Cualquier tarea relacionada con la API REST de FacturaScripts

## Cuándo NO activar esta skill

- Controladores de interfaz web (List/Edit/Panel) → usa `fullstack-developer`
- Lógica de modelos sin API → usa `backend-developer`
- Interfaces de usuario → usa `ui-designer` o `frontend-developer`
- Extensiones → usa `extension-developer`
- Documentación general → usa `docs-expert`
