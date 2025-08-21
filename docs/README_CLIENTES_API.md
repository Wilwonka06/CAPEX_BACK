# API de Clientes - Validaciones Completas

## Descripción
Esta API permite gestionar clientes en el sistema con validaciones robustas basadas en los criterios especificados. Todas las validaciones se aplican tanto en el frontend como en el backend para garantizar la integridad de los datos.

## Validaciones Implementadas

### 1. **Tipo de Documento**
- ✅ Campo requerido
- ✅ Validación de no estar vacío

### 2. **Nombres y Apellidos**
- ✅ Campos requeridos
- ✅ Mínimo 2 caracteres, máximo 50 caracteres
- ✅ Solo letras, espacios y caracteres acentuados (á, é, í, ó, ú, ñ)
- ✅ Debe comenzar con una letra
- ✅ Validación de formato: `/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/`

### 3. **Número de Documento**
- ✅ Campo requerido
- ✅ Mínimo 5 caracteres, máximo 20 caracteres
- ✅ Solo números permitidos
- ✅ Debe ser único en el sistema
- ✅ Validación de formato: `/^\d+$/`

### 4. **Correo Electrónico**
- ✅ Campo requerido
- ✅ Formato de email válido
- ✅ Debe ser único en el sistema
- ✅ Normalización automática del email

### 5. **Teléfono**
- ✅ Campo requerido
- ✅ Solo números permitidos
- ✅ Mínimo 7 dígitos
- ✅ Validación de formato: `/^\d+$/`

### 6. **Contraseña**
- ✅ Campo requerido para crear cliente
- ✅ Campo opcional para actualizar cliente
- ✅ Mínimo 8 caracteres
- ✅ Debe contener:
  - Al menos una letra mayúscula
  - Al menos una letra minúscula
  - Al menos un número
  - Al menos un símbolo (@$!%*?&)
- ✅ Validación de formato: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/`

### 7. **Confirmar Contraseña**
- ✅ Campo requerido si se proporciona contraseña
- ✅ Debe coincidir exactamente con la contraseña

### 8. **Dirección**
- ✅ Campo opcional
- ✅ Máximo 200 caracteres

### 9. **Estado**
- ✅ Campo opcional
- ✅ Debe ser booleano
- ✅ Valor por defecto: `true`

## Endpoints de la API

### Crear Cliente
```
POST /api/clients
```

**Body requerido:**
```json
{
  "documentType": "CC",
  "documentNumber": "12345678",
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "email": "juan.perez@email.com",
  "phone": "3001234567",
  "password": "Contraseña123!",
  "confirmPassword": "Contraseña123!",
  "address": "Calle 123 #45-67, Bogotá",
  "status": true
}
```

### Actualizar Cliente
```
PUT /api/clients/:id
```

**Body (todos los campos son opcionales):**
```json
{
  "documentType": "CE",
  "documentNumber": "87654321",
  "firstName": "María José",
  "lastName": "Rodríguez López",
  "email": "maria.rodriguez@email.com",
  "phone": "3109876543",
  "password": "NuevaContraseña456!",
  "confirmPassword": "NuevaContraseña456!",
  "address": "Avenida 89 #12-34, Medellín",
  "status": false
}
```

### Obtener Cliente por ID
```
GET /api/clients/:id
```

### Obtener Todos los Clientes
```
GET /api/clients
```

### Eliminar Cliente (Soft Delete)
```
DELETE /api/clients/:id
```

### Buscar Clientes
```
GET /api/clients/search?searchTerm=juan&documentType=CC&status=true
```

### Obtener Cliente por Email
```
GET /api/clients/email/:email
```

### Obtener Cliente por Documento
```
GET /api/clients/document/:documentNumber
```

### Obtener Estadísticas
```
GET /api/clients/stats
```

## Respuestas del Sistema

### ✅ Respuesta de éxito (201/200)
```json
{
  "success": true,
  "message": "Cliente creado exitosamente",
  "data": {
    "id_client": 1,
    "documentType": "CC",
    "documentNumber": "12345678",
    "firstName": "Juan Carlos",
    "lastName": "Pérez García",
    "email": "juan.perez@email.com",
    "phone": "3001234567",
    "address": "Calle 123 #45-67, Bogotá",
    "status": true,
    "fecha_creacion": "2024-01-15T10:30:00.000Z",
    "fecha_actualizacion": "2024-01-15T10:30:00.000Z"
  }
}
```

### ❌ Respuesta de error - Validación (400)
```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "type": "field",
      "value": "juan123",
      "msg": "Solo se permiten letras y espacios",
      "path": "firstName",
      "location": "body"
    },
    {
      "type": "field",
      "value": "123",
      "msg": "El teléfono debe tener al menos 7 dígitos",
      "path": "phone",
      "location": "body"
    }
  ]
}
```

### ❌ Respuesta de error - Email duplicado (400)
```json
{
  "success": false,
  "message": "El correo electrónico ya está registrado",
  "error": "EMAIL_EXISTS"
}
```

### ❌ Respuesta de error - Documento duplicado (400)
```json
{
  "success": false,
  "message": "El número de documento ya está registrado",
  "error": "DOCUMENT_EXISTS"
}
```

### ❌ Respuesta de error - Cliente no encontrado (404)
```json
{
  "success": false,
  "message": "Cliente no encontrado",
  "error": "CLIENT_NOT_FOUND"
}
```

## Códigos de Error

| Código | Descripción | HTTP Status |
|--------|-------------|-------------|
| `EMAIL_EXISTS` | El correo electrónico ya está registrado | 400 |
| `DOCUMENT_EXISTS` | El número de documento ya está registrado | 400 |
| `CLIENT_NOT_FOUND` | El cliente especificado no existe | 404 |

## Ejemplos de Uso

### ✅ Crear cliente válido
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "documentType": "CC",
    "documentNumber": "12345678",
    "firstName": "Ana María",
    "lastName": "González Silva",
    "email": "ana.gonzalez@email.com",
    "phone": "3001234567",
    "password": "Contraseña123!",
    "confirmPassword": "Contraseña123!",
    "address": "Carrera 15 #23-45, Cali",
    "status": true
  }'
```

### ✅ Actualizar solo el nombre
```bash
curl -X PUT http://localhost:3000/api/clients/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "firstName": "Ana Lucía"
  }'
```

### ✅ Actualizar solo la contraseña
```bash
curl -X PUT http://localhost:3000/api/clients/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "password": "NuevaContraseña456!",
    "confirmPassword": "NuevaContraseña456!"
  }'
```

### ❌ Intentar crear con email duplicado (debe fallar)
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "documentType": "CC",
    "documentNumber": "87654321",
    "firstName": "Pedro",
    "lastName": "López",
    "email": "ana.gonzalez@email.com",
    "phone": "3109876543",
    "password": "Contraseña123!",
    "confirmPassword": "Contraseña123!"
  }'
```

### ❌ Intentar crear con documento duplicado (debe fallar)
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "documentType": "CE",
    "documentNumber": "12345678",
    "firstName": "Carlos",
    "lastName": "Martínez",
    "email": "carlos.martinez@email.com",
    "phone": "3201234567",
    "password": "Contraseña123!",
    "confirmPassword": "Contraseña123!"
  }'
```

### ❌ Intentar crear con contraseña débil (debe fallar)
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "documentType": "CC",
    "documentNumber": "11111111",
    "firstName": "Luis",
    "lastName": "Hernández",
    "email": "luis.hernandez@email.com",
    "phone": "3301234567",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

## Validaciones Específicas

### Validaciones de Nombres y Apellidos
- **Formato permitido**: Solo letras, espacios y caracteres acentuados
- **Longitud**: Entre 2 y 50 caracteres
- **Inicio**: Debe comenzar con una letra
- **Ejemplos válidos**:
  - `"Juan Carlos"`
  - `"María José"`
  - `"José Luis"`
  - `"Ana Lucía"`
- **Ejemplos inválidos**:
  - `"123Juan"` (comienza con números)
  - `"Juan@Carlos"` (contiene símbolos)
  - `"A"` (muy corto)

### Validaciones de Contraseña
- **Longitud mínima**: 8 caracteres
- **Requisitos**:
  - Al menos una letra mayúscula (A-Z)
  - Al menos una letra minúscula (a-z)
  - Al menos un número (0-9)
  - Al menos un símbolo (@$!%*?&)
- **Ejemplos válidos**:
  - `"Contraseña123!"`
  - `"MyP@ssw0rd"`
  - `"SecureP@ss1"`
- **Ejemplos inválidos**:
  - `"password"` (sin mayúsculas, números ni símbolos)
  - `"Password123"` (sin símbolos)
  - `"P@ss"` (muy corto)

### Validaciones de Teléfono
- **Formato**: Solo números
- **Longitud mínima**: 7 dígitos
- **Ejemplos válidos**:
  - `"3001234567"`
  - `"3109876543"`
  - `"320123456"`
- **Ejemplos inválidos**:
  - `"300-123-4567"` (contiene guiones)
  - `"300123"` (muy corto)
  - `"300abc4567"` (contiene letras)

## Características Técnicas

### Seguridad
- **Hash de contraseñas**: Todas las contraseñas se hashean con bcrypt (10 salt rounds)
- **Exclusión de contraseñas**: Las contraseñas nunca se devuelven en las respuestas
- **Validación en capas**: Validaciones tanto en middleware como en servicio
- **Transacciones**: Todas las operaciones críticas usan transacciones de base de datos

### Base de Datos
- **Soft Delete**: Los clientes se marcan como inactivos en lugar de eliminarse físicamente
- **Índices únicos**: Email y número de documento tienen índices únicos
- **Timestamps**: Registro automático de fechas de creación y actualización

### Middleware
- **Autenticación**: Todas las rutas requieren autenticación
- **Autorización**: Validación de permisos específicos para cada operación
- **Validación**: Validaciones robustas con mensajes de error claros
- **Hash automático**: Las contraseñas se hashean automáticamente antes de guardar

## Notas Importantes

1. **Campos opcionales en actualización**: Al actualizar un cliente, solo se modifican los campos proporcionados
2. **Validación de unicidad**: Email y número de documento deben ser únicos en el sistema
3. **Contraseñas opcionales**: Al actualizar, la contraseña es opcional
4. **Soft delete**: Los clientes eliminados se marcan como inactivos pero no se borran físicamente
5. **Búsqueda flexible**: La búsqueda permite filtrar por múltiples criterios
6. **Estadísticas**: Endpoint para obtener estadísticas de clientes activos/inactivos
