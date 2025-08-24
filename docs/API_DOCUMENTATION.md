# Documentación de la API de Programaciones

## Descripción
Esta API maneja la gestión de programaciones de empleados, permitiendo crear, consultar, actualizar y eliminar programaciones individuales y múltiples.

## Endpoints

### 1. Crear Programación Individual
**POST** `/api/scheduling`

Crea una programación individual para un empleado.

**Body:**
```json
{
  "fecha_inicio": "2024-01-15",
  "hora_entrada": "08:00:00",
  "hora_salida": "17:00:00",
  "id_empleado": 1
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id_programacion": 1,
    "fecha_inicio": "2024-01-15",
    "hora_entrada": "08:00:00",
    "hora_salida": "17:00:00",
    "id_empleado": 1
  },
  "message": "Programación creada correctamente"
}
```

### 2. Crear Múltiples Programaciones
**POST** `/api/scheduling/multiple`

Crea múltiples programaciones para un rango de fechas y días específicos.

**Body:**
```json
{
  "startDate": "2024-01-15",
  "endDate": "2024-01-31",
  "selectedDays": [1, 2, 3, 4, 5],
  "startTime": "08:00:00",
  "endTime": "17:00:00",
  "employeeId": 1
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [...],
  "message": "15 programaciones creadas correctamente"
}
```

### 3. Obtener Todas las Programaciones
**GET** `/api/scheduling`

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 25
}
```

### 4. Obtener Programaciones por Empleado
**GET** `/api/scheduling/employee/:employeeId`

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### 5. Obtener Programación por ID
**GET** `/api/scheduling/:id`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id_programacion": 1,
    "fecha_inicio": "2024-01-15",
    "hora_entrada": "08:00:00",
    "hora_salida": "17:00:00",
    "id_empleado": 1
  }
}
```

### 6. Actualizar Programación
**PUT** `/api/scheduling/:id`

**Body:** (mismos campos que crear)
```json
{
  "fecha_inicio": "2024-01-16",
  "hora_entrada": "09:00:00",
  "hora_salida": "18:00:00",
  "id_empleado": 1
}
```

### 7. Eliminar Programación
**DELETE** `/api/scheduling/:id`

**Respuesta:**
```json
{
  "success": true,
  "message": "Programación eliminada correctamente"
}
```

### 8. Verificar Conflictos de Horarios
**POST** `/api/scheduling/check-conflicts`

**Body:**
```json
{
  "employeeId": 1,
  "fecha_inicio": "2024-01-15",
  "hora_entrada": "08:00:00",
  "hora_salida": "17:00:00",
  "excludeId": null
}
```

**Respuesta:**
```json
{
  "success": true,
  "hasConflicts": false,
  "message": "No hay conflictos de horarios"
}
```

## Validaciones

### Programación Individual
- `fecha_inicio`: Formato YYYY-MM-DD, no puede ser anterior a hoy
- `hora_entrada`: Formato HH:MM o HH:MM:SS
- `hora_salida`: Formato HH:MM o HH:MM:SS, debe ser posterior a hora_entrada
- `id_empleado`: Número entero positivo

### Programación Múltiple
- `startDate` y `endDate`: Formato YYYY-MM-DD
- `selectedDays`: Array con días de la semana (0=Dom, 6=Sáb)
- `startTime` y `endTime`: Formato HH:MM o HH:MM:SS
- `employeeId`: Número entero positivo

## Restricciones de la Base de Datos
- Combinación única de `fecha_inicio`, `hora_entrada` e `id_empleado`
- `hora_salida` debe ser mayor que `hora_entrada`
- `id_empleado` debe existir en la tabla `empleados`

## Códigos de Error
- **400**: Datos inválidos o conflictos de horarios
- **404**: Programación no encontrada
- **500**: Error interno del servidor

## Ejemplos de Uso

### Crear programación para un día específico
```bash
curl -X POST http://localhost:3000/api/scheduling \
  -H "Content-Type: application/json" \
  -d '{
    "fecha_inicio": "2024-01-15",
    "hora_entrada": "08:00:00",
    "hora_salida": "17:00:00",
    "id_empleado": 1
  }'
```

### Crear programaciones para toda una semana
```bash
curl -X POST http://localhost:3000/api/scheduling/multiple \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-01-15",
    "endDate": "2024-01-19",
    "selectedDays": [1, 2, 3, 4, 5],
    "startTime": "08:00:00",
    "endTime": "17:00:00",
    "employeeId": 1
  }'
```
