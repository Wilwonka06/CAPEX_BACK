# API de Editar Perfil de Usuario

## Descripción
Esta API permite a los usuarios editar su información de perfil, incluyendo datos personales y contraseña (opcional).

## Endpoint

### PUT /api/users/:id/profile

**Descripción:** Actualiza la información del perfil de un usuario específico.

**Parámetros de URL:**
- `id` (number, requerido): ID del usuario a actualizar

**Campos del Body (JSON):**
Todos los campos son opcionales, pero al menos uno debe ser proporcionado:

- `nombre` (string, opcional): Nombre completo del usuario
  - Longitud: 2-100 caracteres
  - Solo letras, espacios y caracteres especiales del español (á, é, í, ó, ú, ñ)
  
- `tipo_documento` (string, opcional): Tipo de documento de identidad
  - Valores permitidos: "Pasaporte", "Cedula de ciudadania", "Cedula de extranjeria"
  
- `documento` (string, opcional): Número de documento
  - Longitud: 5-20 caracteres
  - Solo letras y números
  
- `telefono` (string, opcional): Número de teléfono
  - Formato: Debe comenzar con + y tener entre 7 y 15 dígitos
  - Ejemplo: "+573001234567"
  
- `correo` (string, opcional): Dirección de correo electrónico
  - Debe ser un formato de email válido
  
- `foto` (string, opcional): URL de la foto de perfil
  - Debe ser una URL válida que comience con http:// o https://
  - Ejemplo: "https://ejemplo.com/foto.jpg"
  
- `direccion` (string, opcional): Dirección del usuario
  - Máximo 1000 caracteres
  
- `contrasena` (string, opcional): Nueva contraseña
  - Longitud: 8-100 caracteres
  - Debe contener al menos:
    - Una letra mayúscula (incluye Á, É, Í, Ó, Ú, Ñ)
    - Una letra minúscula (incluye á, é, í, ó, ú, ñ)
    - Un número
    - Un carácter especial (@$!%?&)

## Respuestas

### Respuesta Exitosa (200 OK)
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "tipo_documento": "Cedula de ciudadania",
    "documento": "12345678",
    "telefono": "+573001234567",
    "correo": "juan.perez@ejemplo.com",
    "roleId": 1,
    "foto": "https://ejemplo.com/foto.jpg",
    "estado": "Activo",
    "direccion": "Calle 123 #45-67, Bogotá"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Respuesta de Error (400 Bad Request)
```json
{
  "success": false,
  "message": "El correo ya está registrado por otro usuario",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Respuesta de Error (404 Not Found)
```json
{
  "success": false,
  "message": "Usuario no encontrado",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Ejemplos de Uso

### Ejemplo 1: Actualizar solo el nombre
```bash
curl -X PUT http://localhost:3000/api/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María González"
  }'
```

### Ejemplo 2: Actualizar múltiples campos
```bash
curl -X PUT http://localhost:3000/api/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos Rodríguez",
    "telefono": "+573001234568",
    "correo": "carlos.rodriguez@ejemplo.com"
  }'
```

### Ejemplo 3: Actualizar contraseña
```bash
curl -X PUT http://localhost:3000/api/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{
    "contrasena": "NuevaContraseña123!"
  }'
```

### Ejemplo 4: Actualizar foto y dirección
```bash
curl -X PUT http://localhost:3000/api/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{
    "foto": "https://ejemplo.com/nueva-foto.jpg",
    "direccion": "Calle 456 #78-90, Medellín"
  }'
```

### Ejemplo 5: Actualizar todo el perfil
```bash
curl -X PUT http://localhost:3000/api/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana Martínez",
    "tipo_documento": "Cedula de ciudadania",
    "documento": "87654321",
    "telefono": "+573001234569",
    "correo": "ana.martinez@ejemplo.com",
    "foto": "https://ejemplo.com/foto-perfil.jpg",
    "direccion": "Carrera 789 #12-34, Cali",
    "contrasena": "NuevaContraseña456!"
  }'
```

## Validaciones

### Validaciones de Campos
1. **nombre**: Solo letras, espacios y caracteres especiales del español
2. **tipo_documento**: Debe ser uno de los valores permitidos
3. **documento**: Solo letras y números, longitud 5-20 caracteres
4. **telefono**: Formato internacional con +, 7-15 dígitos
5. **correo**: Formato de email válido
6. **foto**: URL válida que comience con http:// o https://
7. **direccion**: Máximo 1000 caracteres
8. **contrasena**: Complejidad requerida (mayúscula, minúscula, número, carácter especial) - incluye caracteres especiales del español

### Validaciones de Negocio
1. **Unicidad de correo**: No puede existir otro usuario con el mismo correo
2. **Unicidad de documento**: No puede existir otro usuario con el mismo tipo y número de documento
3. **Existencia de usuario**: El usuario debe existir en el sistema

## Códigos de Estado HTTP

- **200 OK**: Perfil actualizado exitosamente
- **400 Bad Request**: Datos inválidos o errores de validación
- **404 Not Found**: Usuario no encontrado
- **500 Internal Server Error**: Error interno del servidor

## Notas Importantes

1. **Campos opcionales**: Todos los campos son opcionales, pero al menos uno debe ser proporcionado
2. **Contraseña opcional**: La contraseña es completamente opcional y solo se actualiza si se proporciona
3. **Validaciones estrictas**: Se aplican las mismas validaciones que en la creación de usuarios
4. **Seguridad**: La contraseña se valida y encripta antes de guardarse
5. **Respuesta**: Siempre se retorna el usuario actualizado sin incluir la contraseña en la respuesta
6. **Foto**: Debe ser una URL válida de imagen
7. **Dirección**: Permite texto libre hasta 1000 caracteres
