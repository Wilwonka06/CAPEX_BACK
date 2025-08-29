# Documentación de Validación de Roles en Usuarios

## Descripción General

El sistema ahora incluye una validación robusta para asegurar que solo se puedan asignar roles válidos a los usuarios. Esto previene errores de foreign key constraint y proporciona mensajes de error claros y específicos.

## Características Implementadas

### 1. Validación Preventiva
- **Middleware de Validación**: Se valida la existencia del rol antes de procesar la petición
- **Verificación en Servicio**: Doble validación en el servicio para mayor seguridad
- **Manejo de Errores**: Mensajes específicos para errores relacionados con roles

### 2. Mensajes de Error Mejorados
- **Error Específico**: "El rol con ID X no existe en el sistema"
- **Error de Foreign Key**: "El rol especificado no existe en el sistema. Por favor, verifique el ID del rol e intente nuevamente."
- **Tipo de Error**: Se incluye `errorType: 'ROLE_VALIDATION_ERROR'` para facilitar el manejo en el frontend

### 3. Endpoint de Consulta de Roles
- **GET /api/users/available-roles**: Obtiene todos los roles disponibles para asignar

## Endpoints Actualizados

### Crear Usuario
```
POST /api/users
```

**Validación de Rol:**
- Si se proporciona `roleId`, se valida que el rol existe
- Si no se proporciona, se asigna el rol por defecto (ID: 1)

**Ejemplo de Error:**
```json
{
  "success": false,
  "message": "El rol con ID 6 no existe en el sistema",
  "errorType": "ROLE_VALIDATION_ERROR",
  "timestamp": "2025-08-26T12:14:52.705Z"
}
```

### Actualizar Usuario
```
PUT /api/users/:id
```

**Validación de Rol:**
- Si se incluye `roleId` en el body, se valida que el rol existe
- Si el rol no existe, se devuelve un error específico

**Ejemplo de Error:**
```json
{
  "success": false,
  "message": "El rol especificado no existe en el sistema. Por favor, verifique el ID del rol e intente nuevamente.",
  "errorType": "ROLE_VALIDATION_ERROR",
  "timestamp": "2025-08-26T12:14:52.705Z"
}
```

### Obtener Roles Disponibles
```
GET /api/users/available-roles
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Roles disponibles obtenidos exitosamente",
  "data": [
    {
      "id_rol": 1,
      "nombre": "Administrador",
      "descripcion": "Rol con acceso completo al sistema"
    },
    {
      "id_rol": 2,
      "nombre": "Usuario",
      "descripcion": "Rol de usuario estándar"
    }
  ],
  "timestamp": "2025-08-26T12:14:52.705Z"
}
```

## Middleware Implementado

### UserRoleValidationMiddleware

#### `validateRoleId(req, res, next)`
- Valida que el `roleId` en el body de la petición sea válido
- Verifica que el rol existe en la base de datos
- Se aplica en rutas POST y PUT de usuarios

#### `validateRoleIdInQuery(req, res, next)`
- Valida que el `roleId` en los parámetros de consulta sea válido
- Se aplica en rutas GET con filtros por rol

#### `getRoleInfo(req, res, next)`
- Obtiene información del rol para incluir en la respuesta
- Opcional, para enriquecer las respuestas

## Flujo de Validación

1. **Petición HTTP** llega al endpoint
2. **Middleware de Validación** verifica la existencia del rol
3. **Si el rol no existe**: Se devuelve error inmediatamente
4. **Si el rol existe**: Se continúa al controlador
5. **Servicio** realiza validación adicional
6. **Base de datos** ejecuta la operación
7. **Respuesta** se devuelve al cliente

## Beneficios

### Para Desarrolladores
- **Mensajes Claros**: Errores específicos y descriptivos
- **Validación Temprana**: Se detectan errores antes de llegar a la base de datos
- **Tipo de Error**: Facilita el manejo en el frontend

### Para Usuarios
- **Experiencia Mejorada**: Mensajes comprensibles
- **Información Útil**: Se indica qué rol no existe
- **Sugerencias**: Se sugiere verificar el ID del rol

### Para el Sistema
- **Integridad de Datos**: Previene errores de foreign key constraint
- **Rendimiento**: Validación temprana evita operaciones innecesarias
- **Mantenibilidad**: Código organizado y reutilizable

## Casos de Uso

### Caso 1: Asignar Rol Existente
```json
PUT /api/users/2
{
  "roleId": 1,
  "telefono": "+573001234567",
  "correo": "juan.perez@empresa.com"
}
```
**Resultado:** ✅ Usuario actualizado exitosamente

### Caso 2: Asignar Rol Inexistente
```json
PUT /api/users/2
{
  "roleId": 999,
  "telefono": "+573001234567",
  "correo": "juan.perez@empresa.com"
}
```
**Resultado:** ❌ Error específico sobre rol inexistente

### Caso 3: Consultar Roles Disponibles
```
GET /api/users/available-roles
```
**Resultado:** ✅ Lista de roles disponibles para asignar

## Implementación Técnica

### Archivos Modificados
- `src/services/UsersService.js`: Validación en servicio
- `src/controllers/UsersController.js`: Manejo de errores específicos
- `src/routes/UsersRoutes.js`: Aplicación de middleware
- `src/middlewares/UserRoleValidationMiddleware.js`: Nuevo middleware

### Dependencias
- `src/models/roles/Role.js`: Modelo de roles para validación
- `src/middlewares/ResponseMiddleware.js`: Utilidades de respuesta

## Próximos Pasos

1. **Frontend Integration**: Implementar manejo de `errorType` en el frontend
2. **Logging**: Agregar logs para errores de validación de roles
3. **Testing**: Crear tests unitarios para el middleware
4. **Documentation**: Actualizar documentación de API
5. **Monitoring**: Implementar métricas de errores de validación
