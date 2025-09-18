# API de Citas - Documentación

## Descripción General

El módulo de citas permite gestionar las citas de un salón de belleza, incluyendo la programación de servicios, asignación de empleados y seguimiento del estado de las citas.

## Estructura de Base de Datos

### Tabla `citas`
- `id_cita`: Identificador único de la cita
- `id_cliente`: Referencia al cliente (usuario)
- `fecha_servicio`: Fecha del servicio
- `hora_entrada`: Hora de inicio de la cita
- `hora_salida`: Hora de finalización (calculada automáticamente)
- `estado`: Estado actual de la cita
- `valor_total`: Valor total de todos los servicios (calculado automáticamente)
- `motivo`: Motivo o descripción de la cita
- `fecha_creacion`: Fecha de creación del registro
- `fecha_actualizacion`: Fecha de última actualización

### Tabla `detalles_servicios_clientes`
- `id_detalle_servicio_cliente`: Identificador único del detalle
- `id_empleado`: Referencia al empleado asignado
- `id_servicio`: Referencia al servicio
- `id_cita`: Referencia a la cita (opcional)
- `id_cliente`: Referencia al cliente (opcional)
- `precio_unitario`: Precio unitario del servicio
- `cantidad`: Cantidad del servicio
- `hora_inicio`: Hora de inicio del servicio
- `hora_finalizacion`: Hora de finalización del servicio
- `duracion`: Duración en minutos
- `fecha_programada`: Fecha programada del servicio
- `estado`: Estado del servicio individual
- `observaciones`: Observaciones adicionales

## Endpoints Disponibles

### 1. Obtener todas las citas
```
GET /api/citas
```

**Parámetros de consulta:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `estado`: Filtrar por estado
- `fecha_desde`: Filtrar desde fecha
- `fecha_hasta`: Filtrar hasta fecha
- `id_cliente`: Filtrar por cliente

**Respuesta:**
```json
{
  "success": true,
  "message": "Citas obtenidas exitosamente",
  "data": {
    "citas": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 2. Crear nueva cita
```
POST /api/citas
```

**Cuerpo de la petición:**
```json
{
  "cita": {
    "id_cliente": 15,
    "fecha_servicio": "2025-09-15",
    "hora_entrada": "09:00:00",
    "motivo": "Corte y tinte completo"
  },
  "servicios": [
    {
      "id_servicio": 1,
      "id_empleado": 3,
      "cantidad": 1,
      "hora_inicio": "09:00:00",
      "observaciones": "Cliente prefiere corte en capas"
    }
  ]
}
```

### 3. Obtener cita por ID
```
GET /api/citas/:id
```

### 4. Actualizar cita
```
PUT /api/citas/:id
```

### 5. Cancelar cita
```
PATCH /api/citas/:id/cancelar
```

**Cuerpo de la petición:**
```json
{
  "motivo": "Cliente canceló por motivos personales"
}
```

### 6. Buscar citas
```
GET /api/citas/buscar?query=valor
```

### 7. Agregar servicio a cita
```
POST /api/citas/:id/servicios
```

**Cuerpo de la petición:**
```json
{
  "id_servicio": 2,
  "id_empleado": 4,
  "cantidad": 1,
  "hora_inicio": "10:30:00",
  "observaciones": "Servicio adicional"
}
```

### 8. Obtener servicio por ID
```
GET /api/citas/:id/servicios/:detalle_id
```

### 9. Cancelar servicio específico
```
PATCH /api/citas/:id/servicios/:detalle_id/cancelar
```

### 10. Obtener citas por empleado
```
GET /api/citas/empleado/:employeeId
```

### 11. Obtener citas por cliente
```
GET /api/citas/cliente/:clientId
```

### 12. Obtener estadísticas
```
GET /api/citas/estadisticas
```

## Estados de Citas

- `Agendada`: Cita programada, pendiente de confirmación
- `Confirmada`: Cita confirmada por el cliente
- `Reprogramada`: Cita que ha sido reprogramada
- `En proceso`: Cita en ejecución
- `Finalizada`: Cita completada
- `Pagada`: Cita pagada (bloqueada para modificaciones)
- `Cancelada por el cliente`: Cita cancelada por el cliente
- `No asistio`: Cliente no se presentó

## Reglas de Negocio

### Validaciones de Empleados
- Debe existir en la tabla `usuarios` con rol empleado
- Debe estar activo
- No debe tener conflictos de horario (validado contra tabla `programaciones`)

### Validaciones de Servicios
- Debe existir y estar activo
- Duración y precio se toman de la tabla `servicios`

### Cálculos Automáticos
- `hora_salida`: Se calcula como MAX(hora_finalizacion) de todos los servicios
- `valor_total`: Se calcula como SUM(precio_unitario * cantidad) de todos los servicios

### Restricciones de Modificación
- No se pueden modificar citas con estado `Finalizada`, `Pagada` o `Cancelada por el cliente`
- Los servicios pagados están bloqueados para modificaciones

## Ejemplos de Uso

### Crear una cita completa
```bash
curl -X POST http://localhost:3000/api/citas \
  -H "Content-Type: application/json" \
  -d '{
    "cita": {
      "id_cliente": 1,
      "fecha_servicio": "2025-01-15",
      "hora_entrada": "10:00:00",
      "motivo": "Corte y peinado"
    },
    "servicios": [
      {
        "id_servicio": 1,
        "id_empleado": 2,
        "cantidad": 1,
        "hora_inicio": "10:00:00"
      },
      {
        "id_servicio": 2,
        "id_empleado": 3,
        "cantidad": 1,
        "hora_inicio": "11:00:00"
      }
    ]
  }'
```

### Buscar citas por cliente
```bash
curl "http://localhost:3000/api/citas?id_cliente=1&page=1&limit=5"
```

### Cancelar una cita
```bash
curl -X PATCH http://localhost:3000/api/citas/1/cancelar \
  -H "Content-Type: application/json" \
  -d '{"motivo": "Cliente canceló por emergencia familiar"}'
```

## Códigos de Error

- `400`: Datos de entrada inválidos
- `403`: No se puede modificar (cita finalizada/pagada)
- `404`: Recurso no encontrado
- `409`: Conflicto de disponibilidad
- `500`: Error interno del servidor

## Notas Importantes

1. **Transacciones**: Las operaciones complejas (crear/actualizar citas) se ejecutan en transacciones para mantener la integridad de los datos.

2. **Validación de Disponibilidad**: El sistema valida automáticamente que los empleados estén disponibles en los horarios asignados.

3. **Cálculos Automáticos**: Los totales y horarios se calculan automáticamente basándose en los servicios incluidos.

4. **Compatibilidad**: El módulo es compatible con el sistema existente de ServiceDetail, permitiendo migración gradual.

5. **Auditoría**: Se mantienen registros de creación y actualización para auditoría.
