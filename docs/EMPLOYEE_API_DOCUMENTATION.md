# Documentación de la API de Empleados

## Descripción
Esta API maneja la gestión completa de empleados, incluyendo la creación de usuarios y la gestión de estados de empleados.

## Endpoints

### 1. Crear Empleado
**POST** `/api/employees`

Crea un nuevo empleado con su usuario asociado.

**Body:**
```json
{
  "nombre": "Juan Carlos",
  "tipo_documento": "Cedula de ciudadania",
  "documento": "12345678",
  "telefono": "+573001234567",
  "correo": "juan.carlos@empresa.com",
  "contrasena": "Contraseña123!",
  "estado": "Activo"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id_empleado": 1,
    "id_usuario": 1,
    "estado": "Activo",
    "usuario": {
      "nombre": "Juan Carlos",
      "tipo_documento": "Cedula de ciudadania",
      "documento": "12345678",
      "telefono": "+573001234567",
      "correo": "juan.carlos@empresa.com"
    }
  },
  "message": "Empleado creado correctamente"
}
```

### 2. Obtener Todos los Empleados
**GET** `/api/employees`

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### 3. Obtener Empleados Activos
**GET** `/api/employees/active`

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 3
}
```

### 4. Obtener Empleados por Estado
**GET** `/api/employees/status/:status`

**Ejemplo:** `/api/employees/status/Activo`

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 2
}
```

### 5. Buscar Empleados
**GET** `/api/employees/search?q=Juan`

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 1
}
```

### 6. Obtener Empleado por ID
**GET** `/api/employees/:id`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id_empleado": 1,
    "id_usuario": 1,
    "estado": "Activo",
    "usuario": {
      "nombre": "Juan Carlos",
      "tipo_documento": "Cedula de ciudadania",
      "documento": "12345678",
      "telefono": "+573001234567",
      "correo": "juan.carlos@empresa.com"
    }
  }
}
```

### 7. Actualizar Empleado
**PUT** `/api/employees/:id`

**Body:** (campos opcionales)
```json
{
  "nombre": "Juan Carlos Pérez",
  "telefono": "+573001234568",
  "estado": "Inactivo"
}
```

### 8. Cambiar Estado de Empleado
**PATCH** `/api/employees/:id/status`

**Body:**
```json
{
  "estado": "Suspendido"
}
```

### 9. Eliminar Empleado
**DELETE** `/api/employees/:id`

**Respuesta:**
```json
{
  "success": true,
  "message": "Empleado eliminado correctamente"
}
```

## Validaciones

### Campos Obligatorios para Creación
- `nombre`: Solo letras y espacios (incluye acentos)
- `tipo_documento`: "Pasaporte", "Cedula de ciudadania", "Cedula de extranjeria"
- `documento`: Solo alfanumérico, único
- `telefono`: Formato + seguido de 7-15 dígitos
- `correo`: Formato de email válido, único
- `contrasena`: Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial

### Estados Válidos
- "Activo"
- "Inactivo"
- "Suspendido"
- "Enfermo"
- "Incapacitado"
- "Luto"
- "Fallecido"

## Ejemplos de Uso

### Crear empleado
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María González",
    "tipo_documento": "Cedula de ciudadania",
    "documento": "87654321",
    "telefono": "+573001234569",
    "correo": "maria.gonzalez@empresa.com",
    "contrasena": "Contraseña456!",
    "estado": "Activo"
  }'
```

### Buscar empleados
```bash
curl -X GET "http://localhost:3000/api/employees/search?q=María"
```

### Cambiar estado
```bash
curl -X PATCH http://localhost:3000/api/employees/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "Inactivo"
  }'
```

## Notas Importantes

1. **Creación**: Al crear un empleado, se crea automáticamente un usuario asociado
2. **Eliminación**: Al eliminar un empleado, solo se elimina el registro de empleado, no el usuario
3. **Búsqueda**: Busca por nombre, documento o correo
4. **Estados**: El estado por defecto es "Activo"
5. **Validaciones**: Todas las validaciones están basadas en las restricciones de la base de datos
