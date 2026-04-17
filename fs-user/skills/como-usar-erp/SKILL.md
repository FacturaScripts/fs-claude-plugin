---
name: como-usar-erp
description: Asistente para aprender y resolver dudas sobre cómo usar FacturaScripts
---

## Descripción

Un skill de ayuda general que te guía en cómo hacer operaciones en FacturaScripts.

Puedes preguntar cualquier cosa sobre:
- Cómo crear una factura
- Dónde está el botón de...
- Qué significa este campo
- Cómo gestionar clientes
- Cómo registrar un pago
- Cómo hacer devoluciones
- Y mucho más

El skill consulta la documentación interna y te da respuestas paso a paso.

## Cómo usar

1. Activa el skill: `/como-usar-erp`
2. Haz tu pregunta en lenguaje natural:
   - "¿Cómo creo una factura?"
   - "¿Dónde registro un pago de cliente?"
   - "Necesito crear un cliente nuevo"
   - "¿Qué significa 'forma de pago'?"
   - "¿Cómo veo qué debe un cliente?"

3. El skill te responde con pasos claros y explicaciones

## Ejemplos de preguntas

### Operaciones de venta
- "¿Cómo creo una factura?"
- "¿Qué diferencia hay entre presupuesto, pedido y albarán?"
- "¿Cómo registro un pago de un cliente?"
- "¿Cómo hago una devolución?"
- "¿Cómo veo el histórico de un cliente?"

### Clientes
- "¿Cómo creo un nuevo cliente?"
- "¿Dónde veo qué clientes deben dinero?"
- "¿Cómo agrego un contacto a un cliente?"
- "¿Cómo cambio los datos de un cliente?"

### Inventario
- "¿Cómo creo un producto?"
- "¿Cómo veo el stock disponible?"
- "¿Qué es una variante?"
- "¿Cómo configuro el stock mínimo?"

### Compras
- "¿Cómo creo un pedido a un proveedor?"
- "¿Cómo registro un albarán de entrada?"
- "¿Cómo pago una factura de proveedor?"

### Contabilidad
- "¿Qué es un asiento contable?"
- "¿Cómo veo mis números de ventas?"
- "¿Cómo se genera automáticamente la contabilidad?"

### Reportes
- "¿Cómo veo el total de ventas?"
- "¿Cómo sé si voy ganando dinero?"
- "¿Cómo genero un informe para el contable?"

## Tipos de respuesta

### Procedimiento paso a paso
Para operaciones específicas:
```
Para crear una factura, sigue estos pasos:

1. Ve a **Ventas > Facturas de clientes**
2. Haz clic en **+ Nuevo**
3. Selecciona el cliente
...
```

### Explicación de concepto
Para entender términos:
```
Una "serie" es un grupo de numeración independiente.
Por ejemplo:
- Serie "A" para ventas normales: A-001, A-002...
- Serie "B" para ventas especiales: B-001, B-002...
...
```

### Comparación
Para diferencias:
```
Presupuesto: Propuesta sin compromiso
Pedido: Confirmación de compra
Albarán: Comprobante de entrega
Factura: Documento fiscal definitivo
...
```

## Lo que necesita

- Conexión a FacturaScripts (para contexto)
- Tu experiencia/nivel (principiante, intermedio, avanzado)

## Temas cubiertos

### Módulo de Facturación
✓ Crear facturas de cliente
✓ Crear presupuestos
✓ Crear pedidos
✓ Crear albaranes
✓ Registrar cobros y recibos
✓ Gestionar devoluciones
✓ Series y numeración

### Módulo de Clientes
✓ Crear clientes
✓ Editar datos de clientes
✓ Crear contactos
✓ Asignar agentes
✓ Ver histórico de cliente
✓ Grupos de clientes

### Módulo de Inventario
✓ Crear productos
✓ Crear familias
✓ Crear atributos y variantes
✓ Gestionar almacenes
✓ Ver stock disponible
✓ Configurar alertas de stock
✓ Tarifas y precios especiales

### Módulo de Compras
✓ Crear proveedores
✓ Hacer pedidos a proveedores
✓ Crear albaranes de entrada
✓ Registrar facturas de proveedor
✓ Hacer devoluciones a proveedores
✓ Registrar pagos

### Módulo de Contabilidad
✓ Entender plan contable
✓ Cómo se crean asientos automáticos
✓ Conciliación bancaria
✓ Cómo se calcula IVA
✓ Fin de ejercicio

## Limitaciones

- No enseña programación/desarrollo
- No ayuda con instalación o configuración técnica
- No trata errores/bugs técnicos (ver agente fs-dev)
- No sustituye a soporte técnico oficial

## Consejos

💡 **Se específico:** Mejor "¿Cómo registro el vencimiento de una factura?" que "¿Cómo hago una factura?"

💡 **Describe tu situación:** "Tengo 3 clientes que deben dinero, ¿cómo veo cuándo vence?" es más específico.

💡 **Aprende mientras usas:** Lee las explicaciones para entender el "por qué"

💡 **Kombina con otros skills:**
- `/analizar-ventas` para análisis
- `/clientes-morosos` para gestión de cobros
- `/crear-informe` para reportes

## Acceso a documentación

El skill consulta automáticamente:
- `/agents/docs/guia-facturacion.md`
- `/agents/docs/guia-clientes.md`
- `/agents/docs/guia-inventario.md`
- `/agents/docs/guia-compras.md`
- `/agents/docs/guia-contabilidad.md`

Si necesitas información detallada, accede directamente a estas guías.

## Para principiantes

Si es tu primer día con FacturaScripts:
1. Empieza por: "¿Cuál es el flujo básico de venta?"
2. Luego: "¿Cómo creo mi primer cliente?"
3. Después: "¿Cómo creo mi primera factura?"
4. Finalmente: "¿Cómo veo si gané dinero?"

## Para administradores

Si configuras FacturaScripts para tu empresa:
1. Consulta: "¿Cómo configuro el plan contable?"
2. Luego: "¿Cómo creo usuarios?"
3. Después: "¿Cómo configuro alertas?"

## Atención al cliente

Si tienes dudas que el skill no pueda resolver:
- Contacta al soporte oficial de FacturaScripts
- Consulta la documentación oficial en facturascripts.com
- Habla con tu administrador de sistemas
