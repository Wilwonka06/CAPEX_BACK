# Guía de Detalles de Servicio Cliente

## Descripción
Este módulo permite crear órdenes de servicio detalladas donde puedes agregar múltiples servicios y productos a un cliente, cada uno con su empleado asignado y cantidad específica.

## Características Principales

### ✅ Precio Automático
- **Servicios**: El precio se obtiene automáticamente del catálogo de servicios
- **Productos**: El precio se obtiene automáticamente del catálogo de productos
- **Precio Personalizado**: Puedes sobrescribir el precio si es necesario

### ✅ Cálculo Automático
- **Subtotal**: Se calcula automáticamente (precio unitario × cantidad)
- **Validaciones**: Verifica que existan los servicios, productos y empleados

### ✅ Asignación de Empleados
- Cada detalle puede tener un empleado específico asignado
- Permite distribuir el trabajo entre diferentes empleados

## Estructura de Datos

### Campos Requeridos
```json
{
  "serviceClientId": 1,    // ID del servicio cliente (OBLIGATORIO)
  "empleadoId": 8,         // ID del empleado (OBLIGATORIO)
  "quantity": 1,           // Cantidad (OBLIGATORIO, mínimo 1)
  "serviceId": 3,          // ID del servicio (OBLIGATORIO si no hay producto)
  "productId": 5           // ID del producto (OBLIGATORIO si no hay servicio)
}
```

### Campos Opcionales
```json
{
  "unitPrice": 120.00,     // Precio personalizado (opcional)
  "status": "En ejecución" // Estado por defecto
}
```

## Ejemplos de Uso

### 1. Crear Detalle con Servicio (Precio Automático)

**POST** `/api/detalles-servicio`

```json
{
  "serviceClientId": 1,
  "serviceId": 3,          // Coloración - $120.00
  "empleadoId": 8,
  "quantity": 1
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "serviceClientId": 1,
    "serviceId": 3,
    "productId": null,
    "empleadoId": 8,
    "quantity": 1,
    "unitPrice": 120.00,    // Obtenido automáticamente del servicio
    "subtotal": 120.00,     // Calculado automáticamente
    "status": "En ejecución"
  },
  "message": "Orden de servicio creada exitosamente"
}
```

### 2. Crear Detalle con Producto (Precio Automático)

```json
{
  "serviceClientId": 1,
  "productId": 5,           // Shampoo - $25.00
  "empleadoId": 8,
  "quantity": 2
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "serviceClientId": 1,
    "serviceId": null,
    "productId": 5,
    "empleadoId": 8,
    "quantity": 2,
    "unitPrice": 25.00,     // Obtenido automáticamente del producto
    "subtotal": 50.00,      // Calculado automáticamente
    "status": "En ejecución"
  }
}
```

### 3. Crear Detalle con Precio Personalizado

```json
{
  "serviceClientId": 1,
  "serviceId": 2,           // Peinado - $45.00
  "empleadoId": 8,
  "quantity": 1,
  "unitPrice": 50.00        // Precio personalizado
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "serviceClientId": 1,
    "serviceId": 2,
    "productId": null,
    "empleadoId": 8,
    "quantity": 1,
    "unitPrice": 50.00,     // Precio personalizado
    "subtotal": 50.00,      // Calculado con precio personalizado
    "status": "En ejecución"
  }
}
```

## 🛍️ Ejemplos Específicos de Productos

### Productos Disponibles (Datos de Prueba)

| ID | Producto | Precio | Categoría |
|----|----------|--------|-----------|
| 5 | Shampoo Profesional | $25.00 | Cuidado Capilar |
| 6 | Acondicionador | $30.00 | Cuidado Capilar |
| 7 | Mascarilla Capilar | $45.00 | Cuidado Capilar |
| 8 | Aceite Capilar | $35.00 | Cuidado Capilar |
| 9 | Tinte Profesional | $55.00 | Coloración |
| 10 | Decolorante | $40.00 | Coloración |
| 11 | Oxidante | $20.00 | Coloración |
| 12 | Gel para Cabello | $15.00 | Peinado |
| 13 | Laca para Cabello | $18.00 | Peinado |
| 14 | Cera Modeladora | $22.00 | Peinado |

### Ejemplo 1: Agregar un Solo Producto

```json
{
  "serviceClientId": 1,
  "productId": 5,           // Shampoo - $25.00
  "empleadoId": 8,
  "quantity": 2             // 2 shampoos
}
```

**Resultado:**
- Precio unitario: $25.00 (automático)
- Subtotal: $50.00 (2 × $25.00)

### Ejemplo 2: Agregar Múltiples Productos Diferentes

```javascript
// Producto 1: Shampoo
{
  "serviceClientId": 1,
  "productId": 5,           // Shampoo - $25.00
  "empleadoId": 8,
  "quantity": 1
}

// Producto 2: Acondicionador
{
  "serviceClientId": 1,
  "productId": 6,           // Acondicionador - $30.00
  "empleadoId": 8,
  "quantity": 1
}

// Producto 3: Mascarilla
{
  "serviceClientId": 1,
  "productId": 7,           // Mascarilla - $45.00
  "empleadoId": 9,
  "quantity": 1
}
```

**Resultado:**
- Shampoo: $25.00
- Acondicionador: $30.00
- Mascarilla: $45.00
- **Total: $100.00**

### Ejemplo 3: Productos con Cantidades Variables

```javascript
// Tinte (2 unidades)
{
  "serviceClientId": 1,
  "productId": 9,           // Tinte - $55.00
  "empleadoId": 8,
  "quantity": 2
}

// Oxidante (3 unidades)
{
  "serviceClientId": 1,
  "productId": 11,          // Oxidante - $20.00
  "empleadoId": 8,
  "quantity": 3
}

// Gel (1 unidad)
{
  "serviceClientId": 1,
  "productId": 12,          // Gel - $15.00
  "empleadoId": 9,
  "quantity": 1
}
```

**Resultado:**
- Tinte (2x): $110.00
- Oxidante (3x): $60.00
- Gel (1x): $15.00
- **Total: $185.00**

### Ejemplo 4: Producto con Precio Personalizado

```json
{
  "serviceClientId": 1,
  "productId": 5,           // Shampoo - $25.00 (precio original)
  "empleadoId": 8,
  "quantity": 1,
  "unitPrice": 30.00        // Precio personalizado
}
```

**Resultado:**
- Precio original: $25.00
- Precio personalizado: $30.00
- Subtotal: $30.00

## Endpoints Disponibles

### Crear Detalle de Servicio
- **POST** `/api/detalles-servicio`
- Crea un nuevo detalle con validaciones automáticas

### Obtener Detalles por Servicio Cliente
- **GET** `/api/detalles-servicio/service-client/:serviceClientId`
- Obtiene todos los detalles de un servicio cliente específico

### Calcular Subtotal
- **GET** `/api/detalles-servicio/:id/subtotal`
- Calcula el subtotal de un detalle específico

### Cambiar Estado
- **PATCH** `/api/detalles-servicio/:id/status`
- Cambia el estado de un detalle (En ejecución, Pagada)

### Obtener por Empleado
- **GET** `/api/detalles-servicio/employee/:empleadoId`
- Obtiene todos los detalles asignados a un empleado

### Obtener por Producto
- **GET** `/api/detalles-servicio/product/:productId`
- Obtiene todos los detalles de un producto específico

## Validaciones Automáticas

### ✅ Validaciones de Entrada
- Debe especificar al menos un servicio o producto
- Debe especificar un cliente asociado (serviceClientId)
- Debe especificar un empleado
- Debe especificar una cantidad válida (mínimo 1)

### ✅ Validaciones de Existencia
- Verifica que el servicio existe en el catálogo
- Verifica que el producto existe en el catálogo
- Verifica que el empleado existe

### ✅ Validaciones de Precio
- Si no se proporciona precio, lo obtiene automáticamente
- Valida que el precio sea mayor a 0
- Calcula automáticamente el subtotal

## Flujo de Trabajo Típico

### 1. Crear Servicio Cliente
Primero debes crear un servicio cliente que represente la orden general.

### 2. Agregar Detalles
Luego agregas múltiples detalles, cada uno con:
- Un servicio o producto específico
- Un empleado asignado
- Una cantidad
- Precio (automático o personalizado)

### 3. Gestionar Estados
- **En ejecución**: Detalle activo
- **Pagada**: Detalle completado y pagado

### 4. Calcular Totales
El sistema calcula automáticamente:
- Subtotal por detalle
- Total del servicio cliente

## Ejemplo Completo con Productos

```javascript
// 1. Crear detalle con servicio de coloración
const detalle1 = {
  serviceClientId: 1,
  serviceId: 3,        // Coloración - $120.00
  empleadoId: 8,
  quantity: 1
};

// 2. Crear detalle con producto shampoo
const detalle2 = {
  serviceClientId: 1,
  productId: 5,        // Shampoo - $25.00
  empleadoId: 8,
  quantity: 2
};

// 3. Crear detalle con producto tinte
const detalle3 = {
  serviceClientId: 1,
  productId: 9,        // Tinte - $55.00
  empleadoId: 8,
  quantity: 1
};

// 4. Crear detalle con producto oxidante
const detalle4 = {
  serviceClientId: 1,
  productId: 11,       // Oxidante - $20.00
  empleadoId: 9,
  quantity: 3
};

// Resultado: Servicio cliente con 4 detalles
// - Coloración: $120.00
// - Shampoo (2x): $50.00
// - Tinte (1x): $55.00
// - Oxidante (3x): $60.00
// Total: $285.00
```

## Códigos de Error Comunes

### 400 - Datos Inválidos
```json
{
  "success": false,
  "message": "Debe especificar al menos un producto o servicio"
}
```

### 400 - Producto No Encontrado
```json
{
  "success": false,
  "message": "El producto especificado no existe"
}
```

### 400 - Empleado Requerido
```json
{
  "success": false,
  "message": "Debe especificar un empleado para el servicio"
}
```

### 400 - Cantidad Inválida
```json
{
  "success": false,
  "message": "Debe especificar una cantidad válida (mínimo 1)"
}
```

## Scripts de Ejemplo

### Script General
Puedes usar el script `scripts/ejemplo-crear-detalle-servicio.js` para probar todas las funcionalidades:

```bash
node scripts/ejemplo-crear-detalle-servicio.js
```

### Script Específico de Productos
Para ejemplos específicos de productos, usa `scripts/ejemplo-productos-detalle-servicio.js`:

```bash
node scripts/ejemplo-productos-detalle-servicio.js
```

Este script incluye ejemplos de:
- Agregar un solo producto
- Agregar múltiples productos diferentes
- Agregar productos con cantidades variables
- Agregar productos con precios personalizados
- Obtener productos por servicio cliente
- Obtener productos por empleado

## Notas Importantes

1. **Precio Automático**: Si no especificas `unitPrice`, el sistema lo obtiene automáticamente del servicio o producto
2. **Subtotal Automático**: El subtotal se calcula automáticamente (precio × cantidad)
3. **Validaciones**: El sistema valida que existan todos los elementos referenciados
4. **Estados**: Los detalles comienzan en "En ejecución" por defecto
5. **Empleados**: Cada detalle puede tener un empleado diferente asignado
6. **Flexibilidad**: Puedes mezclar servicios y productos en la misma orden
7. **Productos**: Puedes agregar tantos productos como necesites, cada uno con su cantidad específica
8. **Cantidades**: Cada producto puede tener una cantidad diferente (mínimo 1)
