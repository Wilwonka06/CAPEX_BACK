# Refactorización del Modelo de Usuarios

## Resumen de Cambios

Este documento describe los cambios realizados para consolidar la gestión de usuarios, clientes y empleados en un solo modelo `Usuario`, eliminando las tablas y modelos separados.

## Cambios Realizados

### 1. Modelo de Usuario (`src/models/User.js`)

- **Estados simplificados**: Cambiado de `['Activo', 'Inactivo', 'Suspendido']` a `['Activo', 'Inactivo']`
- **Nuevo campo**: Agregado `concepto_estado` (TEXT, opcional) para explicar el estado del usuario
- **Validaciones actualizadas**: Los estados ahora solo permiten "Activo" o "Inactivo"
- **Campo opcional**: `concepto_estado` es opcional para clientes, pero se recomienda para empleados

### 2. Migraciones

#### `20250101000000-update-users-estado-and-add-concepto.js`
- Agrega el campo `concepto_estado` (opcional) a la tabla `usuarios`
- Convierte usuarios con estado "Suspendido" a "Inactivo"
- Actualiza el ENUM del campo `estado` para solo permitir "Activo" e "Inactivo"
- Compatible con PostgreSQL, MySQL y SQLite

#### `20250101000001-remove-client-table.js`
- Elimina la tabla `clientes` completamente
- Incluye rollback para recrear la tabla si es necesario

### 3. Asociaciones (`src/config/associations.js`)

- **Eliminadas**: Todas las asociaciones con el modelo `Client`
- **Mantenidas**: Asociaciones entre `Usuario` y otros modelos (roles, appointments, etc.)
- **Simplificadas**: Los clientes y empleados ahora se identifican únicamente por su `roleId`

### 4. Servicios Actualizados

#### `ClientService.js`
- **Eliminada**: Dependencia del modelo `Client`
- **Funcionalidad**: Ahora trabaja directamente con usuarios que tienen `roleId: 1` (rol de cliente)
- **Operaciones**: CRUD completo para clientes usando solo el modelo `Usuario`
- **Estados**: Usa los nuevos estados "Activo" e "Inactivo"
- **Campo opcional**: `concepto_estado` no es requerido para clientes

#### `AuthService.js`
- **Eliminada**: Dependencia del modelo `Client`
- **Simplificada**: Registro y autenticación trabajan solo con usuarios
- **Perfil**: Edición de perfil incluye todos los campos del usuario
- **Campo opcional**: `concepto_estado` no es requerido al registrar usuarios

### 5. Middleware de Validación

#### `ClientValidationMiddleware.js`
- **Estados**: Validación actualizada para solo permitir "Activo" e "Inactivo"
- **Campos**: Validación opcional para `concepto_estado`
- **Dirección**: Límite aumentado a 1000 caracteres (consistente con el modelo Usuario)

#### `EmployeeValidationMiddleware.js` (NUEVO)
- **Validaciones específicas**: Para empleados con validaciones apropiadas
- **Campo requerido**: `concepto_estado` es requerido cuando se cambia el estado de un empleado
- **Validación de estado**: Incluye validación específica para cambios de estado de empleados

### 6. Rutas

#### `ClienteRoutes.js`
- **Validaciones**: Actualizadas para usar las nuevas validaciones
- **Funcionalidad**: Mantiene todas las operaciones CRUD para clientes

## Beneficios de la Refactorización

### 1. **Simplicidad**
- Un solo modelo para gestionar todos los tipos de usuarios
- Eliminación de tablas redundantes
- Reducción de complejidad en las consultas

### 2. **Consistencia**
- Estados unificados para todos los usuarios
- Campos comunes (dirección, foto, etc.) en un solo lugar
- Validaciones consistentes

### 3. **Mantenibilidad**
- Menos código duplicado
- Cambios centralizados en un solo modelo
- Migraciones más simples

### 4. **Escalabilidad**
- Fácil agregar nuevos tipos de usuarios (roles)
- Campos adicionales se agregan una sola vez
- Consultas más eficientes

## Estructura de Roles y Campos

### Rol ID 1: Cliente
- Usuarios con `roleId: 1` son considerados clientes
- Acceso a funcionalidades de cliente
- Estados: "Activo" o "Inactivo"
- **Campo opcional**: `concepto_estado` no es requerido

### Rol ID 2: Empleado
- Usuarios con `roleId: 2` son considerados empleados
- Acceso a funcionalidades de empleado
- Estados: "Activo" o "Inactivo"
- **Campo requerido**: `concepto_estado` es requerido cuando se cambia el estado

### Otros Roles
- Se pueden agregar nuevos roles según sea necesario
- Cada rol define las funcionalidades disponibles
- `concepto_estado` se puede usar según las necesidades del rol

## Reglas de Validación del Campo `concepto_estado`

### Para Clientes
- **Opcional**: No se requiere al crear o actualizar
- **Uso**: Se puede usar para explicar cambios de estado si es necesario
- **Validación**: Máximo 1000 caracteres si se proporciona

### Para Empleados
- **Opcional**: No se requiere al crear o actualizar datos básicos
- **Requerido**: Es obligatorio cuando se cambia el estado del empleado
- **Validación**: Máximo 1000 caracteres
- **Propósito**: Explicar la razón del cambio de estado (vacaciones, licencia, etc.)

## Migración de Datos

### Usuarios Existentes
- Los usuarios con estado "Suspendido" se convierten automáticamente a "Inactivo"
- Se agrega `concepto_estado: 'Usuario suspendido - migrado automáticamente'`

### Clientes Existentes
- Los datos de la tabla `clientes` se pierden
- Se recomienda hacer backup antes de ejecutar las migraciones
- Los usuarios mantienen su información básica

## Consideraciones de Seguridad

### 1. **Validación de Roles**
- Verificar `roleId` antes de permitir operaciones
- Middleware de autenticación debe validar permisos por rol

### 2. **Estados de Usuario**
- Solo usuarios "Activos" pueden autenticarse
- Cambios de estado requieren permisos especiales
- Para empleados, cambios de estado requieren justificación (`concepto_estado`)

### 3. **Campos Sensibles**
- Contraseñas siempre se encriptan
- Información personal protegida por validaciones

## Próximos Pasos

### 1. **Testing**
- Ejecutar todas las migraciones en entorno de desarrollo
- Probar funcionalidades de cliente y empleado
- Verificar que las validaciones funcionen correctamente
- Probar la validación del campo `concepto_estado` para empleados

### 2. **Documentación**
- Actualizar documentación de API
- Documentar nuevos campos y validaciones
- Crear ejemplos de uso para clientes y empleados

### 3. **Monitoreo**
- Verificar que no haya errores en producción
- Monitorear el rendimiento de las consultas
- Validar que los usuarios existentes funcionen correctamente

## Rollback

Si es necesario revertir los cambios:

1. **Ejecutar migración down**: `npx sequelize-cli db:migrate:undo --name 20250101000001-remove-client-table.js`
2. **Ejecutar migración down**: `npx sequelize-cli db:migrate:undo --name 20250101000000-update-users-estado-and-add-concepto.js`
3. **Restaurar archivos**: Revertir cambios en los archivos de código

## Conclusión

Esta refactorización simplifica significativamente la arquitectura del sistema, consolidando la gestión de usuarios en un solo modelo. Los beneficios incluyen mayor simplicidad, consistencia y mantenibilidad, mientras se mantiene toda la funcionalidad existente.

El campo `concepto_estado` proporciona flexibilidad para diferentes tipos de usuarios:
- **Clientes**: Campo opcional para explicar cambios de estado si es necesario
- **Empleados**: Campo requerido para justificar cambios de estado, mejorando la trazabilidad y control
