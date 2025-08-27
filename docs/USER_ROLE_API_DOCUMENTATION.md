# API de Asignación de Roles a Usuarios

Esta API permite gestionar la asignación de roles a usuarios en el sistema.

## Endpoints

### 1. Asignar Rol a Usuario

**POST** `/api/usuario-roles/asignar`

Asigna un rol específico a un usuario.

**Body:**
```json
{
  "idUsuario": 1,
  "idRol": 2
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Rol asignado correctamente",
     "data": {
     "id_usuario": 1,
     "id_rol": 2,
     "fecha_asignacion": "2024-01-15T10:30:00.000Z",
     "estado": "Activo"
   }
}
```

### 2. Remover Rol de Usuario

**DELETE** `/api/usuario-roles/remover`

Remueve un rol específico de un usuario (marca como inactivo).

**Body:**
```json
{
  "idUsuario": 1,
  "idRol": 2
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Rol removido correctamente"
}
```

### 3. Obtener Roles de un Usuario

**GET** `/api/usuario-roles/usuario/:idUsuario/roles`

Obtiene todos los roles asignados a un usuario específico.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Roles obtenidos correctamente",
  "data": [
    {
      "id_rol": 1,
      "nombre": "Administrador",
      "descripcion": "Rol con acceso completo al sistema",
      "usuario_roles": {
        "fecha_asignacion": "2024-01-15T10:30:00.000Z",
        "estado": "Activo"
      }
    }
  ]
}
```

### 4. Obtener Usuarios de un Rol

**GET** `/api/usuario-roles/rol/:idRol/usuarios`

Obtiene todos los usuarios que tienen asignado un rol específico.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuarios obtenidos correctamente",
  "data": [
    {
      "id_usuario": 1,
      "nombre": "Juan Pérez",
      "correo": "juan@ejemplo.com",
      "usuario_roles": {
        "fecha_asignacion": "2024-01-15T10:30:00.000Z",
        "estado": "Activo"
      }
    }
  ]
}
```

### 5. Obtener Todas las Asignaciones

**GET** `/api/usuario-roles/asignaciones`

Obtiene todas las asignaciones activas de roles a usuarios.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Asignaciones obtenidas correctamente",
  "data": [
    {
      "id_usuario": 1,
      "id_rol": 2,
      "fecha_asignacion": "2024-01-15T10:30:00.000Z",
      "estado": "Activo",
      "usuario": {
        "id_usuario": 1,
        "nombre": "Juan Pérez",
        "correo": "juan@ejemplo.com"
      },
      "rol": {
        "id_rol": 2,
        "nombre": "Editor",
        "descripcion": "Puede editar contenido"
      }
    }
  ]
}
```

### 6. Verificar Rol de Usuario

**GET** `/api/usuario-roles/usuario/:idUsuario/verificar?nombreRol=Administrador`

Verifica si un usuario tiene un rol específico.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Verificación completada",
  "data": {
    "tieneRol": true
  }
}
```

### 7. Obtener Usuarios con Roles

**GET** `/api/usuario-roles/usuarios-con-roles`

Obtiene todos los usuarios con sus roles asignados.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuarios con roles obtenidos correctamente",
  "data": [
    {
      "id_usuario": 1,
      "nombre": "Juan Pérez",
      "correo": "juan@ejemplo.com",
      "roles": [
        {
          "id_rol": 1,
          "nombre": "Administrador",
          "descripcion": "Rol con acceso completo al sistema",
          "usuario_roles": {
            "fecha_asignacion": "2024-01-15T10:30:00.000Z",
            "estado": "Activo"
          }
        }
      ]
    }
  ]
}
```

## Códigos de Error

- **400**: Error de validación o datos faltantes
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Ejemplos de Uso

### Asignar múltiples roles a un usuario
```javascript
// Asignar rol de Administrador
await fetch('/api/usuario-roles/asignar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idUsuario: 1, idRol: 1 })
});

// Asignar rol de Editor
await fetch('/api/usuario-roles/asignar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idUsuario: 1, idRol: 2 })
});
```

### Verificar permisos antes de una acción
```javascript
// Verificar si el usuario es administrador
const response = await fetch('/api/usuario-roles/usuario/1/verificar?nombreRol=Administrador');
const { data } = await response.json();

if (data.tieneRol) {
  // Permitir acción administrativa
} else {
  // Denegar acceso
}
```

## Notas Importantes

1. **Soft Delete**: Al remover un rol, se marca como inactivo en lugar de eliminar el registro.
2. **Validaciones**: El sistema verifica que tanto el usuario como el rol existan antes de crear la asignación.
3. **Duplicados**: No se permite asignar el mismo rol a un usuario más de una vez.
4. **Relaciones**: Las consultas incluyen información de las relaciones para facilitar el uso en el frontend.
