# API de Roles - Criterios de Aceptación

## Descripción
Esta API permite gestionar roles en el sistema con validaciones específicas según los criterios de aceptación establecidos.

## Criterios de Aceptación Implementados

### 1. Campos Requeridos
- **nombre_rol** (VARCHAR 80): Nombre del rol (obligatorio)
- **descripcion** (TEXT): Descripción del rol (opcional)
- **permisos_privilegios** (Array): Lista de permisos+privilegios asociados (obligatorio)
- **estado_rol** (BOOLEAN): Estado del rol (opcional, por defecto true)

### 2. Validaciones Implementadas

#### ✅ El sistema no permite crear un rol si al menos no tiene un permiso+privilegio asociado
- Validación en middleware: `validateRolePermissions`
- Validación en servicio: Verificación de array no vacío
- Código de error: `NO_PERMISSIONS_PROVIDED`

#### ✅ El sistema no permite crear un rol con un nombre ya existente
- Validación en middleware: `validateRoleNameUnique`
- Validación en servicio: Verificación de unicidad
- Código de error: `ROLE_NAME_EXISTS`

#### ✅ El sistema arroja mensaje del estado de ejecución de crear el rol
- Respuestas estructuradas con `success`, `message` y `data`
- Mensajes específicos para cada caso de éxito o error

## Endpoints Disponibles

### Crear Rol
```
POST /api/roles
```

**Body:**
```json
{
  "nombre_rol": "Administrador",
  "descripcion": "Rol con acceso completo al sistema",
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

**Respuesta de éxito (201):**
```json
{
  "success": true,
  "message": "Rol creado exitosamente",
  "data": {
    "id_rol": 1,
    "nombre_rol": "Administrador",
    "descripcion": "Rol con acceso completo al sistema",
    "estado_rol": true,
    "permisos": [...],
    "privilegios": [...]
  }
}
```

**Respuesta de error - Nombre duplicado (400):**
```json
{
  "success": false,
  "message": "Ya existe un rol con ese nombre",
  "error": "ROLE_NAME_EXISTS"
}
```

**Respuesta de error - Sin permisos (400):**
```json
{
  "success": false,
  "message": "El rol debe tener al menos un permiso+privilegio asociado",
  "error": "NO_PERMISSIONS_PROVIDED"
}
```

### Obtener Todos los Roles
```
GET /api/roles
```

### Obtener Rol por ID
```
GET /api/roles/:id
```

### Actualizar Rol
```
PUT /api/roles/:id
```

### Eliminar Rol (Soft Delete)
```
DELETE /api/roles/:id
```

### Obtener Permisos Disponibles
```
GET /api/roles/permisos/list
```

### Obtener Privilegios Disponibles
```
GET /api/roles/privilegios/list
```

## Validaciones de Entrada

### Validaciones de nombre_rol
- Longitud: 1-80 caracteres
- Solo letras, espacios y caracteres acentuados
- No puede estar vacío
- Debe ser único en el sistema

### Validaciones de descripcion
- Máximo 500 caracteres
- Opcional

### Validaciones de estado_rol
- Debe ser un valor booleano
- Opcional (por defecto true)

### Validaciones de permisos_privilegios
- Debe ser un array con al menos un elemento
- Cada elemento debe tener `id_permiso` e `id_privilegio`
- Los IDs deben ser enteros positivos

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| `ROLE_NAME_EXISTS` | Ya existe un rol con ese nombre |
| `NO_PERMISSIONS_PROVIDED` | El rol debe tener al menos un permiso+privilegio |
| `INVALID_PERMISSION_PRIVILEGE` | IDs de permiso o privilegio inválidos |

## Ejemplos de Uso

### Crear un rol básico
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nombre_rol": "Usuario Básico",
    "descripcion": "Rol para usuarios con acceso limitado",
    "permisos_privilegios": [
      {
        "id_permiso": 1,
        "id_privilegio": 2
      }
    ]
  }'
```

### Crear un rol sin permisos (debe fallar)
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nombre_rol": "Rol Sin Permisos",
    "descripcion": "Este rol no debería crearse",
    "permisos_privilegios": []
  }'
```

### Crear un rol con nombre duplicado (debe fallar)
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nombre_rol": "Administrador",
    "descripcion": "Intento de crear rol duplicado",
    "permisos_privilegios": [
      {
        "id_permiso": 1,
        "id_privilegio": 1
      }
    ]
  }'
```

## Notas Técnicas

- Los roles se eliminan de forma lógica (soft delete) cambiando `estado_rol` a `false`
- Las validaciones se ejecutan tanto en el middleware como en el servicio para mayor seguridad
- Todas las respuestas siguen un formato consistente con `success`, `message` y `data`
- Los permisos y privilegios se asocian a través de una tabla intermedia `roles_permisos_privilegios`
