# API de Detalles de Servicios Clientes

Esta API maneja los detalles de servicios para clientes, permitiendo gestionar los servicios específicos que se realizan en cada cita.

## Base URL
```
/api/ventas/detalles-servicios
```

## Autenticación
Todas las rutas requieren autenticación mediante token JWT en el header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Obtener todos los detalles de servicios
**GET** `/api/ventas/detalles-servicios`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_detalle_servicio_cliente": 1,
      "id_servicio_cliente": 1,
      "id_servicio": 1,
      "id_empleado": 1,
      "precio_unitario": 50.00,
      "cantidad": 2,
      "hora_inicio": "09:00:00",
      "hora_finalizacion": "10:30:00",
      "duracion": 90,
      "estado": "En ejecución"
    }
  ],
  "message": "Detalles de servicios obtenidos exitosamente"
}
```

### 2. Obtener detalle de servicio por ID
**GET** `/api/ventas/detalles-servicios/:id`

**Parámetros:**
- `id` (integer): ID del detalle de servicio

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id_detalle_servicio_cliente": 1,
    "id_servicio_cliente": 1,
    "id_servicio": 1,
    "id_empleado": 1,
    "precio_unitario": 50.00,
    "cantidad": 2,
    "hora_inicio": "09:00:00",
    "hora_finalizacion": "10:30:00",
    "duracion": 90,
    "estado": "En ejecución"
  },
  "message": "Detalle de servicio obtenido exitosamente"
}
```

### 3. Crear nuevo detalle de servicio
**POST** `/api/ventas/detalles-servicios`

**Body:**
```json
{
  "id_servicio_cliente": 1,
  "id_servicio": 1,
  "id_empleado": 1,
  "precio_unitario": 50.00,
  "cantidad": 2,
  "hora_inicio": "09:00:00",
  "hora_finalizacion": "10:30:00",
  "duracion": 90,
  "estado": "En ejecución"
}
```

**Campos requeridos:**
- `id_servicio_cliente` (integer): ID del servicio cliente
- `id_servicio` (integer): ID del servicio
- `id_empleado` (integer): ID del empleado
- `precio_unitario` (decimal): Precio por unidad
- `cantidad` (integer): Cantidad de servicios
- `hora_inicio` (time): Hora de inicio (formato HH:MM:SS)
- `hora_finalizacion` (time): Hora de finalización (formato HH:MM:SS)
- `duracion` (integer): Duración en minutos

**Campos opcionales:**
- `estado` (string): "En ejecución" o "Pagado" (por defecto: "En ejecución")

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id_detalle_servicio_cliente": 1,
    "id_servicio_cliente": 1,
    "id_servicio": 1,
    "id_empleado": 1,
    "precio_unitario": 50.00,
    "cantidad": 2,
    "hora_inicio": "09:00:00",
    "hora_finalizacion": "10:30:00",
    "duracion": 90,
    "estado": "En ejecución"
  },
  "message": "Detalle de servicio creado exitosamente"
}
```

### 4. Actualizar detalle de servicio
**PUT** `/api/ventas/detalles-servicios/:id`

**Parámetros:**
- `id` (integer): ID del detalle de servicio

**Body:** (todos los campos son opcionales)
```json
{
  "precio_unitario": 60.00,
  "cantidad": 3,
  "hora_inicio": "10:00:00",
  "hora_finalizacion": "11:30:00",
  "duracion": 90,
  "estado": "Pagado"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id_detalle_servicio_cliente": 1,
    "id_servicio_cliente": 1,
    "id_servicio": 1,
    "id_empleado": 1,
    "precio_unitario": 60.00,
    "cantidad": 3,
    "hora_inicio": "10:00:00",
    "hora_finalizacion": "11:30:00",
    "duracion": 90,
    "estado": "Pagado"
  },
  "message": "Detalle de servicio actualizado exitosamente"
}
```

### 5. Eliminar detalle de servicio
**DELETE** `/api/ventas/detalles-servicios/:id`

**Parámetros:**
- `id` (integer): ID del detalle de servicio

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Detalle de servicio eliminado exitosamente"
}
```

### 6. Cambiar estado del detalle de servicio
**PATCH** `/api/ventas/detalles-servicios/:id/status`

**Parámetros:**
- `id` (integer): ID del detalle de servicio

**Body:**
```json
{
  "estado": "Pagado"
}
```

**Estados válidos:**
- "En ejecución"
- "Pagado"

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id_detalle_servicio_cliente": 1,
    "estado": "Pagado"
  },
  "message": "Estado del detalle de servicio actualizado exitosamente"
}
```

### 7. Obtener detalles por servicio cliente
**GET** `/api/ventas/detalles-servicios/service-client/:serviceClientId`

**Parámetros:**
- `serviceClientId` (integer): ID del servicio cliente

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_detalle_servicio_cliente": 1,
      "id_servicio_cliente": 1,
      "id_servicio": 1,
      "id_empleado": 1,
      "precio_unitario": 50.00,
      "cantidad": 2,
      "hora_inicio": "09:00:00",
      "hora_finalizacion": "10:30:00",
      "duracion": 90,
      "estado": "En ejecución"
    }
  ],
  "message": "Detalles de servicio cliente obtenidos exitosamente"
}
```

### 8. Obtener detalles por empleado
**GET** `/api/ventas/detalles-servicios/employee/:employeeId`

**Parámetros:**
- `employeeId` (integer): ID del empleado

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_detalle_servicio_cliente": 1,
      "id_servicio_cliente": 1,
      "id_servicio": 1,
      "id_empleado": 1,
      "precio_unitario": 50.00,
      "cantidad": 2,
      "hora_inicio": "09:00:00",
      "hora_finalizacion": "10:30:00",
      "duracion": 90,
      "estado": "En ejecución"
    }
  ],
  "message": "Detalles de empleado obtenidos exitosamente"
}
```

### 9. Obtener detalles por estado
**GET** `/api/ventas/detalles-servicios/status/:status`

**Parámetros:**
- `status` (string): Estado a filtrar ("En ejecución" o "Pagado")

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_detalle_servicio_cliente": 1,
      "estado": "En ejecución"
    }
  ],
  "message": "Detalles con estado \"En ejecución\" obtenidos exitosamente"
}
```

### 10. Calcular precio total
**GET** `/api/ventas/detalles-servicios/:id/total-price`

**Parámetros:**
- `id` (integer): ID del detalle de servicio

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id_detalle_servicio_cliente": 1,
    "precio_unitario": 50.00,
    "cantidad": 2,
    "precio_total": 100.00
  },
  "message": "Precio total calculado exitosamente"
}
```

### 11. Obtener estadísticas
**GET** `/api/ventas/detalles-servicios/statistics/overview`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total_detalles": 100,
    "en_ejecucion": 75,
    "pagados": 25,
    "precio_total_general": 5000.00
  },
  "message": "Estadísticas obtenidas exitosamente"
}
```

## Códigos de Error

### 400 - Error de Validación
```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "field": "hora_inicio",
      "message": "La hora de inicio debe tener formato HH:MM:SS"
    }
  ]
}
```

### 404 - No Encontrado
```json
{
  "success": false,
  "message": "Detalle de servicio no encontrado"
}
```

### 500 - Error Interno del Servidor
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": "Mensaje de error específico"
}
```

## Validaciones

### Validaciones de Campos
- `id_servicio_cliente`: Debe ser un entero positivo
- `id_servicio`: Debe ser un entero positivo
- `id_empleado`: Debe ser un entero positivo
- `precio_unitario`: Debe ser un número positivo
- `cantidad`: Debe ser un entero mayor a 0
- `hora_inicio`: Debe tener formato HH:MM:SS
- `hora_finalizacion`: Debe tener formato HH:MM:SS y ser mayor que hora_inicio
- `duracion`: Debe ser un entero mayor a 0
- `estado`: Debe ser "En ejecución" o "Pagado"

### Validaciones de Negocio
- La hora de finalización debe ser mayor que la hora de inicio
- El estado por defecto es "En ejecución"
- La duración se calcula automáticamente basada en las horas de inicio y finalización
