# API de Edición de Roles - Criterios de Aceptación

## Descripción
Esta API permite editar roles existentes en el sistema con validaciones específicas según los criterios de aceptación establecidos.

## Criterios de Aceptación Implementados

### 1. **El sistema toma el ID del rol seleccionado (INT)**
- ✅ Validación del parámetro `id` en la URL
- ✅ Verificación de que el ID sea un entero positivo
- ✅ Verificación de que el rol existe en la base de datos

### 2. **Se modifican los campos: nombre_rol (VARCHAR 80), descripcion, permisos+privilegios, estado_rol (BOOLEAN)**
- ✅ **nombre_rol**: Campo opcional, máximo 80 caracteres
- ✅ **descripcion**: Campo opcional, máximo 500 caracteres
- ✅ **permisos_privilegios**: Array opcional de permisos+privilegios
- ✅ **estado_rol**: Campo booleano opcional

### 3. **El sistema no debe permitir modificar el nombre del rol por uno que ya se encuentre registrado**
- ✅ Validación en middleware: `validateRoleNameUnique`
- ✅ Validación en servicio: Verificación de unicidad excluyendo el rol actual
- ✅ Código de error: `ROLE_NAME_EXISTS`

### 4. **El sistema no debe permitir modificar el rol si no hay permisos y privilegios asociados**
- ✅ Validación en middleware: `validateRolePermissions`
- ✅ Validación en servicio: Verificación de array no vacío
- ✅ Código de error: `NO_PERMISSIONS_PROVIDED`

### 5. **El sistema arroja un mensaje del estado de ejecución del editar rol**
- ✅ Respuestas estructuradas con `success`, `message` y `data`
- ✅ Mensajes específicos para cada caso de éxito o error
- ✅ Códigos de estado HTTP apropiados

## Endpoint de Edición

### Actualizar Rol
```
PUT /api/roles/:id
```

**Parámetros de URL:**
- `id` (INT): ID del rol a editar

**Body (todos los campos son opcionales):**
```json
{
  "nombre_rol": "Administrador Modificado",
  "descripcion": "Nueva descripción del rol",
  "estado_rol": true,
  "permisos_privilegios": [
    {
      "id_permiso": 1,
      "id_privilegio": 1
    },
    {
      "id_permiso": 2,
      "id_privilegio": 1
    }
  ]
}
```

## Respuestas del Sistema

### ✅ Respuesta de éxito (200)
```json
{
  "success": true,
  "message": "Rol actualizado exitosamente",
  "data": {
    "id_rol": 1,
    "nombre_rol": "Administrador Modificado",
    "descripcion": "Nueva descripción del rol",
    "estado_rol": true,
    "permisos": [...],
    "privilegios": [...]
  }
}
```

### ❌ Respuesta de error - Rol no encontrado (404)
```json
{
  "success": false,
  "message": "Rol no encontrado",
  "error": "ROLE_NOT_FOUND"
}
```

### ❌ Respuesta de error - Nombre duplicado (400)
```json
{
  "success": false,
  "message": "Ya existe un rol con ese nombre",
  "error": "ROLE_NAME_EXISTS"
}
```

### ❌ Respuesta de error - Sin permisos (400)
```json
{
  "success": false,
  "message": "El rol debe tener al menos un permiso+privilegio asociado",
  "error": "NO_PERMISSIONS_PROVIDED"
}
```

### ❌ Respuesta de error - Permisos inválidos (400)
```json
{
  "success": false,
  "message": "Cada permiso+privilegio debe tener un ID de permiso y privilegio válidos",
  "error": "INVALID_PERMISSION_PRIVILEGE"
}
```

## Validaciones Implementadas

### Validaciones de Entrada
1. **ID del rol**: Debe ser un entero positivo
2. **nombre_rol**: 
   - Opcional
   - 1-80 caracteres
   - Solo letras, espacios y caracteres acentuados
   - No puede duplicar nombres existentes
3. **descripcion**: 
   - Opcional
   - Máximo 500 caracteres
4. **estado_rol**: 
   - Opcional
   - Debe ser booleano
5. **permisos_privilegios**: 
   - Opcional
   - Si se proporciona, debe ser array con al menos un elemento
   - Cada elemento debe tener `id_permiso` e `id_privilegio` válidos

### Validaciones de Negocio
1. **Existencia del rol**: El rol debe existir en la base de datos
2. **Unicidad del nombre**: No puede duplicar nombres de otros roles
3. **Permisos obligatorios**: Si se actualizan permisos, debe haber al menos uno
4. **Integridad de datos**: Los IDs de permisos y privilegios deben ser válidos

## Códigos de Error

| Código | Descripción | HTTP Status |
|--------|-------------|-------------|
| `ROLE_NOT_FOUND` | El rol especificado no existe | 404 |
| `ROLE_NAME_EXISTS` | Ya existe un rol con ese nombre | 400 |
| `NO_PERMISSIONS_PROVIDED` | El rol debe tener al menos un permiso+privilegio | 400 |
| `INVALID_PERMISSION_PRIVILEGE` | IDs de permiso o privilegio inválidos | 400 |

## Ejemplos de Uso

### ✅ Editar solo el nombre del rol
```bash
curl -X PUT http://localhost:3000/api/roles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nombre_rol": "Nuevo Nombre de Rol"
  }'
```

### ✅ Editar solo la descripción
```bash
curl -X PUT http://localhost:3000/api/roles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "descripcion": "Nueva descripción del rol"
  }'
```

### ✅ Editar solo el estado
```bash
curl -X PUT http://localhost:3000/api/roles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "estado_rol": false
  }'
```

### ✅ Editar solo los permisos
```bash
curl -X PUT http://localhost:3000/api/roles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "permisos_privilegios": [
      {
        "id_permiso": 1,
        "id_privilegio": 1
      },
      {
        "id_permiso": 2,
        "id_privilegio": 1
      }
    ]
  }'
```

### ✅ Editar todos los campos
```bash
curl -X PUT http://localhost:3000/api/roles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nombre_rol": "Administrador Senior",
    "descripcion": "Rol con acceso completo y privilegios avanzados",
    "estado_rol": true,
    "permisos_privilegios": [
      {
        "id_permiso": 1,
        "id_privilegio": 1
      },
      {
        "id_permiso": 2,
        "id_privilegio": 1
      },
      {
        "id_permiso": 3,
        "id_privilegio": 2
      }
    ]
  }'
```

### ❌ Intentar editar con nombre duplicado (debe fallar)
```bash
curl -X PUT http://localhost:3000/api/roles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nombre_rol": "Usuario Básico"
  }'
```

### ❌ Intentar editar sin permisos (debe fallar)
```bash
curl -X PUT http://localhost:3000/api/roles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "permisos_privilegios": []
  }'
```

## Notas Técnicas

- **Transacciones**: Todas las operaciones de actualización usan transacciones de base de datos
- **Validación en capas**: Validaciones tanto en middleware como en servicio
- **Rollback automático**: Si hay errores, se revierten todos los cambios
- **Campos opcionales**: Solo se actualizan los campos proporcionados
- **Asociaciones**: Los permisos y privilegios se actualizan completamente (reemplazan los existentes)
- **Mensajes consistentes**: Todas las respuestas siguen el mismo formato
