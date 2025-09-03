# Módulo de Citas (Appointments)

## Descripción

El módulo de citas permite gestionar las citas de servicios para usuarios con rol de cliente en el sistema CAPEX. Cada cita está asociada a un usuario específico y un servicio, con fechas, horarios y estados de seguimiento.

## Características Principales

- ✅ **Gestión completa de citas**: Crear, leer, actualizar y eliminar citas
- ✅ **Validación de horarios**: Verificación automática de conflictos de horario
- ✅ **Estados de seguimiento**: Flujo de trabajo con transiciones controladas
- ✅ **Filtros avanzados**: Búsqueda por cliente, servicio, estado y fechas

- ✅ **Paginación**: Soporte para grandes volúmenes de datos
- ✅ **Relaciones**: Integración con clientes y servicios existentes

## Estructura del Módulo

```
src/
├── models/
│   └── Appointment.js              # Modelo de datos
├── controllers/
│   └── AppointmentController.js    # Controlador HTTP
├── services/
│   └── AppointmentService.js       # Lógica de negocio
├── middlewares/
│   └── AppointmentMiddleware.js    # Validaciones
├── routes/
│   └── appointmentRoutes.js        # Rutas de la API
└── config/
    └── associations.js             # Asociaciones (actualizado)
```

## Instalación

### 1. Ejecutar la Migración

```bash
# Ejecutar la migración para crear la tabla
npx sequelize-cli db:migrate
```

### 2. Verificar Asociaciones

El módulo se integra automáticamente con las asociaciones existentes. Las relaciones se configuran en `src/config/associations.js`:

- **Usuario** ↔ **Cita**: Un usuario puede tener muchas citas
- **Servicio** ↔ **Cita**: Un servicio puede estar en muchas citas

### 3. Reiniciar el Servidor

```bash
npm start
```

## Estados de Cita

El sistema maneja 8 estados diferentes con transiciones controladas:

```
Agendada
├── Confirmada
├── Reprogramada
└── Cancelada por el cliente

Confirmada
├── En proceso
├── Reprogramada
└── Cancelada por el cliente

Reprogramada
├── Confirmada
└── Cancelada por el cliente

En proceso
├── Finalizada
└── Cancelada por el cliente

Finalizada
└── Pagada

Pagada (estado final)
Cancelada por el cliente (estado final)
No asistio (estado final)
```

## Endpoints Disponibles

### Operaciones CRUD Básicas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/appointments` | Crear nueva cita |
| GET | `/api/appointments` | Obtener citas con filtros |
| GET | `/api/appointments/:id` | Obtener cita por ID |
| PUT | `/api/appointments/:id` | Actualizar cita |
| DELETE | `/api/appointments/:id` | Eliminar cita |

### Operaciones Especializadas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| PATCH | `/api/appointments/:id/status` | Cambiar estado de cita |
| GET | `/api/appointments/conflicts` | Verificar conflictos de horario |
| GET | `/api/appointments/user/:userId` | Citas por usuario |
| GET | `/api/appointments/service/:serviceId` | Citas por servicio |

## Ejemplos de Uso

### Crear una Cita

```javascript
const appointmentData = {
  id_usuario: 1,
  id_servicio: 1,
  fecha_servicio: '2024-02-15',
  hora_entrada: '09:00:00',
  hora_salida: '10:00:00',
  valor_total: 150.00,
  motivo: 'Corte de cabello y peinado'
};

const response = await fetch('/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(appointmentData)
});
```

### Obtener Citas con Filtros

```javascript
const params = new URLSearchParams({
  estado: 'Agendada',
  fecha_inicio: '2024-01-01',
  page: 1,
  limit: 10
});

const response = await fetch(`/api/appointments?${params}`);
```

### Cambiar Estado de Cita

```javascript
const statusData = {
  estado: 'Confirmada',
  motivo: 'Cliente confirmó asistencia'
};

const response = await fetch('/api/appointments/1/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(statusData)
});
```

## Validaciones

### Validaciones de Entrada

- **Usuario**: Debe existir, estar activo y tener rol de cliente
- **Servicio**: Debe existir y estar activo
- **Fecha**: Debe ser posterior a hoy
- **Horarios**: Formato HH:MM:SS, hora_salida > hora_entrada
- **Valor**: Entre 0.01 y 9999999999999.99
- **Motivo**: Entre 1 y 100 caracteres

### Validaciones de Negocio

- **Conflictos de horario**: No se permiten citas solapadas para el mismo servicio
- **Transiciones de estado**: Solo se permiten ciertas transiciones
- **Eliminación**: Solo citas en estados específicos pueden ser eliminadas

## Pruebas

### Ejecutar Pruebas Automatizadas

```bash
# Ejecutar el script de pruebas
node scripts/test-appointments.js
```

### Pruebas Manuales con Postman

1. Importar la colección de Postman (si está disponible)
2. Configurar variables de entorno:
   - `base_url`: http://localhost:3000/api

### Casos de Prueba Principales

1. **Crear cita válida**
2. **Crear cita con conflicto de horario**
3. **Cambiar estados válidos**
4. **Cambiar estado inválido**
5. **Eliminar cita permitida**
6. **Eliminar cita no permitida**
7. **Filtros de búsqueda**

## Configuración de Base de Datos

### Tabla `servicios_clientes`

```sql
CREATE TABLE servicios_clientes (
    id_servicio_cliente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_servicio INT NOT NULL,
    fecha_servicio DATE NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Agendada', 'Confirmada', 'Reprogramada', 'En proceso', 'Finalizada', 'Pagada', 'Cancelada por el cliente', 'No asistio')),
    valor_total DECIMAL(15,2) NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    CHECK (hora_salida > hora_entrada),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
);
```

### Índices

- `id_usuario`
- `id_servicio`
- `fecha_servicio`
- `estado`
- `id_usuario, fecha_servicio` (compuesto)

## Integración con Otros Módulos

### Usuarios
- Las citas están vinculadas a usuarios con rol de cliente
- Se incluye información completa del usuario (nombre, correo, teléfono, estado, roleId)

### Servicios
- Las citas están vinculadas a servicios activos
- Se incluye información completa del servicio



## Monitoreo y Logs

### Logs de Actividad

El sistema registra:
- Creación de citas
- Cambios de estado
- Conflictos de horario
- Errores de validación

### Métricas Disponibles

- Conflictos de horario detectados
- Tiempo promedio de servicio

## Troubleshooting

### Problemas Comunes

1. **Error de conflicto de horario**
   - Verificar que no existan citas solapadas
   - Usar el endpoint `/conflicts` para verificar

2. **Error de transición de estado**
   - Verificar las transiciones permitidas
   - Consultar la documentación de estados

3. **Error de validación**
   - Verificar formato de fechas (YYYY-MM-DD)
   - Verificar formato de horas (HH:MM:SS)
   - Verificar que cliente y servicio existan

### Debug

```bash
# Habilitar logs detallados
DEBUG=app:appointments npm start

# Verificar conexión a base de datos
npx sequelize-cli db:migrate:status
```

## Contribución

### Estándares de Código

- Usar ESLint y Prettier
- Seguir convenciones de nombres
- Documentar funciones complejas
- Agregar pruebas para nuevas funcionalidades

### Flujo de Desarrollo

1. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Implementar cambios
3. Ejecutar pruebas: `npm test`
4. Crear pull request
5. Revisión de código
6. Merge a main

## Licencia

Este módulo es parte del proyecto CAPEX y sigue las mismas políticas de licencia.

## Soporte

Para soporte técnico o preguntas sobre el módulo de citas:

- Crear issue en el repositorio
- Consultar la documentación de la API
- Revisar los logs del servidor
