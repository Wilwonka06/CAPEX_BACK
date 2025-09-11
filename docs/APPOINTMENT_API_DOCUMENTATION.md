# API de Citas (Appointments) - Documentación

## Descripción General

El módulo de citas permite gestionar las citas de servicios para usuarios con rol de cliente. Cada cita está asociada a un usuario específico y un servicio, con fechas, horarios y estados de seguimiento.

## Estructura de la Base de Datos

### Tabla: `servicios_clientes`

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id_servicio_cliente` | INT | ID único de la cita | AUTO_INCREMENT, PRIMARY KEY |
| `id_usuario` | INT | ID del usuario (con rol cliente) | NOT NULL, FOREIGN KEY |
| `id_servicio` | INT | ID del servicio | NOT NULL, FOREIGN KEY |
| `fecha_servicio` | DATE | Fecha del servicio | NOT NULL |
| `hora_entrada` | TIME | Hora de inicio | NOT NULL |
| `hora_salida` | TIME | Hora de finalización | NOT NULL |
| `estado` | ENUM | Estado de la cita | NOT NULL, valores permitidos |
| `valor_total` | DECIMAL(15,2) | Valor total del servicio | NOT NULL |
| `motivo` | VARCHAR(100) | Motivo de la cita | NOT NULL |

### Estados de Cita

- `Agendada`: Cita programada pero no confirmada
- `Confirmada`: Cita confirmada por el cliente
- `Reprogramada`: Cita que ha sido reprogramada
- `En proceso`: Servicio en ejecución
- `Finalizada`: Servicio completado
- `Pagada`: Servicio pagado
- `Cancelada por el cliente`: Cancelada por el cliente
- `No asistio`: Cliente no asistió

## Endpoints

### Base URL
```
http://localhost:3000/api/appointments
```



---

## 1. Crear Cita

### POST `/api/appointments`

Crea una nueva cita para un usuario con rol de cliente.

#### Request Body
```json
{
  "id_usuario": 1,
  "id_servicio": 1,
  "fecha_servicio": "2024-01-15",
  "hora_entrada": "09:00:00",
  "hora_salida": "10:00:00",
  "valor_total": 150.00,
  "motivo": "Corte de cabello y peinado"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Cita creada exitosamente",
  "data": {
    "id_servicio_cliente": 1,
    "id_usuario": 1,
    "id_servicio": 1,
    "fecha_servicio": "2024-01-15",
    "hora_entrada": "09:00:00",
    "hora_salida": "10:00:00",
    "estado": "Agendada",
    "valor_total": "150.00",
    "motivo": "Corte de cabello y peinado",
    "usuario": {
      "id_usuario": 1,
      "nombre": "Juan Pérez",
      "correo": "juan@example.com",
      "telefono": "+573001234567",
      "estado": "Activo",
      "roleId": 2
    },
    "servicio": {
      "id_servicio": 1,
      "nombre": "Corte de Cabello",
      "descripcion": "Corte y peinado profesional",
      "duracion": 60,
      "precio": "150.00"
    }
  }
}
```

#### Validaciones
- `id_usuario`: Debe existir, estar activo y tener rol de cliente
- `id_servicio`: Debe existir y estar activo
- `fecha_servicio`: Debe ser posterior a hoy
- `hora_entrada` y `hora_salida`: Formato HH:MM:SS
- `hora_salida`: Debe ser posterior a `hora_entrada`
- `valor_total`: Entre 0.01 y 9999999999999.99
- `motivo`: Entre 1 y 100 caracteres
- No debe haber conflictos de horario

---

## 2. Obtener Citas

### GET `/api/appointments`

Obtiene todas las citas con filtros opcionales.

#### Query Parameters
| Parámetro | Tipo | Descripción | Opcional |
|-----------|------|-------------|----------|
| `usuario` | INT | Filtrar por ID de usuario | Sí |
| `servicio` | INT | Filtrar por ID de servicio | Sí |
| `estado` | STRING | Filtrar por estado | Sí |
| `fecha_inicio` | DATE | Fecha de inicio (YYYY-MM-DD) | Sí |
| `fecha_fin` | DATE | Fecha de fin (YYYY-MM-DD) | Sí |
| `page` | INT | Número de página | Sí (default: 1) |
| `limit` | INT | Elementos por página | Sí (default: 10) |

#### Ejemplo de Request
```
GET /api/appointments?estado=Agendada&fecha_inicio=2024-01-01&page=1&limit=5
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Citas obtenidas exitosamente",
  "data": [
    {
      "id_servicio_cliente": 1,
      "id_usuario": 1,
      "id_servicio": 1,
      "fecha_servicio": "2024-01-15",
      "hora_entrada": "09:00:00",
      "hora_salida": "10:00:00",
      "estado": "Agendada",
      "valor_total": "150.00",
      "motivo": "Corte de cabello y peinado",
      "usuario": {
        "id_usuario": 1,
        "nombre": "Juan Pérez",
        "correo": "juan@example.com",
        "telefono": "+573001234567",
        "estado": "Activo",
        "roleId": 2
      },
      "servicio": {
        "id_servicio": 1,
        "nombre": "Corte de Cabello",
        "descripcion": "Corte y peinado profesional",
        "duracion": 60,
        "precio": "150.00"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

## 3. Obtener Cita por ID

### GET `/api/appointments/:id`

Obtiene una cita específica por su ID.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Cita obtenida exitosamente",
  "data": {
    "id_servicio_cliente": 1,
    "id_usuario": 1,
    "id_servicio": 1,
    "fecha_servicio": "2024-01-15",
    "hora_entrada": "09:00:00",
    "hora_salida": "10:00:00",
    "estado": "Agendada",
    "valor_total": "150.00",
    "motivo": "Corte de cabello y peinado",
    "usuario": {
      "id_usuario": 1,
      "nombre": "Juan Pérez",
      "correo": "juan@example.com",
      "telefono": "+573001234567",
      "estado": "Activo",
      "roleId": 2
    },
    "servicio": {
      "id_servicio": 1,
      "nombre": "Corte de Cabello",
      "descripcion": "Corte y peinado profesional",
      "duracion": 60,
      "precio": "150.00"
    }
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Cita no encontrada"
}
```

---

## 4. Actualizar Cita

### PUT `/api/appointments/:id`

Actualiza una cita existente.

#### Request Body (campos opcionales)
```json
{
  "fecha_servicio": "2024-01-16",
  "hora_entrada": "10:00:00",
  "hora_salida": "11:00:00",
  "estado": "Confirmada",
  "valor_total": 160.00,
  "motivo": "Corte de cabello y peinado con cambio de fecha"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Cita actualizada exitosamente",
  "data": {
    // Datos actualizados de la cita
  }
}
```

---

## 5. Eliminar Cita

### DELETE `/api/appointments/:id`

Elimina una cita (solo si está en estado 'Agendada' o 'Cancelada por el cliente').

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Cita eliminada correctamente"
}
```

#### Response (400 Bad Request)
```json
{
  "success": false,
  "message": "No se puede eliminar una cita que no esté en estado Agendada o Cancelada por el cliente"
}
```

---

## 6. Cambiar Estado de Cita

### PATCH `/api/appointments/:id/status`

Cambia el estado de una cita siguiendo las transiciones permitidas.

#### Request Body
```json
{
  "estado": "Confirmada",
  "motivo": "Cliente confirmó asistencia"
}
```

#### Transiciones de Estado Permitidas
- `Agendada` → `Confirmada`, `Reprogramada`, `Cancelada por el cliente`
- `Confirmada` → `En proceso`, `Reprogramada`, `Cancelada por el cliente`
- `Reprogramada` → `Confirmada`, `Cancelada por el cliente`
- `En proceso` → `Finalizada`, `Cancelada por el cliente`
- `Finalizada` → `Pagada`
- `Pagada` → (sin transiciones)
- `Cancelada por el cliente` → (sin transiciones)
- `No asistio` → (sin transiciones)

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Estado de cita actualizado exitosamente",
  "data": {
    // Datos de la cita con estado actualizado
  }
}
```

---



## 8. Verificar Conflictos de Horario

### GET `/api/appointments/conflicts`

Verifica si existen conflictos de horario para una fecha, hora y servicio específicos.

#### Query Parameters
| Parámetro | Tipo | Descripción | Requerido |
|-----------|------|-------------|-----------|
| `fecha` | DATE | Fecha a verificar | Sí |
| `hora_entrada` | TIME | Hora de entrada | Sí |
| `hora_salida` | TIME | Hora de salida | Sí |
| `id_servicio` | INT | ID del servicio | Sí |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Verificación de conflictos completada",
  "data": {
    "tieneConflictos": true,
    "conflictos": [
      {
        "id_servicio_cliente": 2,
        "hora_entrada": "09:30:00",
        "hora_salida": "10:30:00",
        "usuario": {
          "id_usuario": 2,
          "nombre": "María García",
          "correo": "maria@example.com"
        }
      }
    ]
  }
}
```

---

## 9. Obtener Citas por Usuario

### GET `/api/appointments/user/:userId`

Obtiene todas las citas de un usuario específico.

#### Query Parameters
| Parámetro | Tipo | Descripción | Opcional |
|-----------|------|-------------|----------|
| `page` | INT | Número de página | Sí (default: 1) |
| `limit` | INT | Elementos por página | Sí (default: 10) |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Citas del usuario obtenidas exitosamente",
  "data": [
    // Lista de citas del usuario
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 10. Obtener Citas por Servicio

### GET `/api/appointments/service/:serviceId`

Obtiene todas las citas de un servicio específico.

#### Query Parameters
| Parámetro | Tipo | Descripción | Opcional |
|-----------|------|-------------|----------|
| `page` | INT | Número de página | Sí (default: 1) |
| `limit` | INT | Elementos por página | Sí (default: 10) |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Citas del servicio obtenidas exitosamente",
  "data": [
    // Lista de citas del servicio
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

## Códigos de Error

### 400 Bad Request
- Datos de entrada inválidos
- Conflictos de validación
- Transiciones de estado no permitidas



### 404 Not Found
- Cita no encontrada
- Usuario o servicio no encontrado

### 500 Internal Server Error
- Errores del servidor

## Ejemplos de Uso

### Crear una cita
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 1,
    "id_servicio": 1,
    "fecha_servicio": "2024-01-15",
    "hora_entrada": "09:00:00",
    "hora_salida": "10:00:00",
    "valor_total": 150.00,
    "motivo": "Corte de cabello y peinado"
  }'
```

### Obtener citas con filtros
```bash
curl -X GET "http://localhost:3000/api/appointments?estado=Agendada&fecha_inicio=2024-01-01&page=1&limit=5"
```

### Cambiar estado de cita
```bash
curl -X PATCH http://localhost:3000/api/appointments/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "Confirmada",
    "motivo": "Cliente confirmó asistencia"
  }'
```

## Notas Importantes

1. **Validación de Horarios**: El sistema verifica automáticamente conflictos de horario al crear o actualizar citas.

2. **Transiciones de Estado**: Solo se permiten ciertas transiciones de estado para mantener la integridad del flujo de trabajo.

3. **Eliminación Restringida**: Solo se pueden eliminar citas en estados específicos para evitar pérdida de datos importantes.

4. **Paginación**: Todos los endpoints que retornan listas incluyen paginación para mejor rendimiento.

5. **Relaciones**: Las citas están relacionadas con usuarios (con rol cliente) y servicios, por lo que se incluye información completa en las respuestas.

6. **Validación de Rol**: Solo se permiten citas para usuarios que tengan el rol de cliente (roleId = 2).

7. **Autenticación**: La autenticación se maneja desde otro módulo del sistema.
