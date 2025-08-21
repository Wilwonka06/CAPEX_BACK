# Pruebas de Validaciones de Clientes

## Instrucciones para Probar

### 1. Iniciar el Servidor
```bash
npm start
```

### 2. Probar Creación de Cliente Válido

**Endpoint:** `POST /api/clients`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**Body válido:**
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

**Resultado esperado:** Status 201, cliente creado exitosamente

### 3. Probar Validaciones de Nombres

**Casos de prueba para firstName y lastName:**

#### ✅ Válidos:
- `"Juan Carlos"`
- `"María José"`
- `"José Luis"`
- `"Ana Lucía"`

#### ❌ Inválidos:
- `"123Juan"` → Error: "Debe comenzar con una letra"
- `"Juan@Carlos"` → Error: "Solo se permiten letras y espacios"
- `"A"` → Error: "El nombre debe tener entre 2 y 50 caracteres"

### 4. Probar Validaciones de Documento

**Casos de prueba para documentNumber:**

#### ✅ Válidos:
- `"12345678"`
- `"87654321"`
- `"12345"`

#### ❌ Inválidos:
- `"123"` → Error: "El número de documento debe tener entre 5 y 20 caracteres"
- `"123abc456"` → Error: "Solo se permiten números"

### 5. Probar Validaciones de Email

**Casos de prueba para email:**

#### ✅ Válidos:
- `"juan.perez@email.com"`
- `"maria@empresa.co"`
- `"test@domain.org"`

#### ❌ Inválidos:
- `"juan.perez"` → Error: "Correo electrónico inválido"
- `"@email.com"` → Error: "Correo electrónico inválido"
- `"juan@.com"` → Error: "Correo electrónico inválido"

### 6. Probar Validaciones de Teléfono

**Casos de prueba para phone:**

#### ✅ Válidos:
- `"3001234567"`
- `"3109876543"`
- `"320123456"`

#### ❌ Inválidos:
- `"300-123-4567"` → Error: "Solo se permiten números"
- `"300123"` → Error: "El teléfono debe tener al menos 7 dígitos"
- `"300abc4567"` → Error: "Solo se permiten números"

### 7. Probar Validaciones de Contraseña

**Casos de prueba para password:**

#### ✅ Válidos:
- `"Contraseña123!"`
- `"MyP@ssw0rd"`
- `"SecureP@ss1"`

#### ❌ Inválidos:
- `"password"` → Error: "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
- `"Password123"` → Error: "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
- `"P@ss"` → Error: "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"

### 8. Probar Validación de Confirmación de Contraseña

**Casos de prueba para confirmPassword:**

#### ✅ Válido:
- `"Contraseña123!"` (cuando password es `"Contraseña123!"`)

#### ❌ Inválido:
- `"Contraseña456!"` (cuando password es `"Contraseña123!"`) → Error: "Las contraseñas no coinciden"

### 9. Probar Unicidad de Email

**Pasos:**
1. Crear un cliente con email `"test@email.com"`
2. Intentar crear otro cliente con el mismo email
3. **Resultado esperado:** Error 400 - "El correo electrónico ya está registrado"

### 10. Probar Unicidad de Documento

**Pasos:**
1. Crear un cliente con documento `"12345678"`
2. Intentar crear otro cliente con el mismo documento
3. **Resultado esperado:** Error 400 - "El número de documento ya está registrado"

### 11. Probar Actualización de Cliente

**Endpoint:** `PUT /api/clients/:id`

**Casos de prueba:**

#### ✅ Actualizar solo el nombre:
```json
{
  "firstName": "María José"
}
```

#### ✅ Actualizar solo la contraseña:
```json
{
  "password": "NuevaContraseña456!",
  "confirmPassword": "NuevaContraseña456!"
}
```

#### ✅ Actualizar solo el email (debe verificar unicidad):
```json
{
  "email": "nuevo.email@test.com"
}
```

### 12. Probar Búsqueda de Clientes

**Endpoint:** `GET /api/clients/search`

**Parámetros de consulta:**
- `searchTerm=juan` → Buscar por nombre, apellido, email o documento
- `documentType=CC` → Filtrar por tipo de documento
- `status=true` → Filtrar por estado

### 13. Probar Obtener Cliente por Email

**Endpoint:** `GET /api/clients/email/:email`

**Ejemplo:** `GET /api/clients/email/juan.perez@email.com`

### 14. Probar Obtener Cliente por Documento

**Endpoint:** `GET /api/clients/document/:documentNumber`

**Ejemplo:** `GET /api/clients/document/12345678`

### 15. Probar Eliminación de Cliente

**Endpoint:** `DELETE /api/clients/:id`

**Resultado esperado:** Cliente marcado como inactivo (soft delete)

### 16. Probar Estadísticas

**Endpoint:** `GET /api/clients/stats`

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Estadísticas de clientes obtenidas exitosamente",
  "data": {
    "total_clients": 5,
    "active_clients": 4,
    "inactive_clients": 1
  }
}
```

## Comandos curl para Pruebas Rápidas

### Crear Cliente Válido
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
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
  }'
```

### Probar Validación de Nombre Inválido
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "documentType": "CC",
    "documentNumber": "87654321",
    "firstName": "123Juan",
    "lastName": "Pérez García",
    "email": "test@email.com",
    "phone": "3001234567",
    "password": "Contraseña123!",
    "confirmPassword": "Contraseña123!"
  }'
```

### Probar Validación de Contraseña Débil
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "documentType": "CC",
    "documentNumber": "11111111",
    "firstName": "Luis",
    "lastName": "Hernández",
    "email": "luis@email.com",
    "phone": "3001234567",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

## Verificación de Funcionalidades

### ✅ Validaciones Implementadas:
- [x] Tipo de documento requerido
- [x] Nombres y apellidos con formato válido
- [x] Número de documento único y numérico
- [x] Email único y con formato válido
- [x] Teléfono numérico con mínimo 7 dígitos
- [x] Contraseña fuerte con requisitos específicos
- [x] Confirmación de contraseña
- [x] Hash automático de contraseñas
- [x] Validación de unicidad en creación y actualización
- [x] Soft delete para eliminación
- [x] Búsqueda flexible
- [x] Estadísticas de clientes

### 🔧 Características Técnicas:
- [x] Transacciones de base de datos
- [x] Validaciones en múltiples capas
- [x] Mensajes de error claros y específicos
- [x] Códigos de estado HTTP apropiados
- [x] Autenticación y autorización
- [x] Exclusión de contraseñas en respuestas
- [x] Timestamps automáticos
