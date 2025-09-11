# API de Autenticación - CAPEX Backend

## Descripción
Este módulo maneja la autenticación y autorización de usuarios en el sistema CAPEX.

## Endpoints

### 1. Registro de Usuario
**POST** `/api/auth/register`

Registra un nuevo usuario como cliente en el sistema.

#### Campos requeridos:
- `nombre` (string): Nombre completo del usuario (solo letras y espacios)
- `tipo_documento` (string): Tipo de documento ('Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria')
- `documento` (string): Número de documento (5-20 caracteres, solo letras y números)
- `telefono` (string): Número de teléfono (formato: +1234567890)
- `correo` (string): Correo electrónico válido
- `contrasena` (string): Contraseña (mínimo 8 caracteres, debe contener mayúscula, minúscula, número y carácter especial)

#### Ejemplo de request:
```json
{
  "nombre": "Juan Pérez",
  "tipo_documento": "Cedula de ciudadania",
  "documento": "12345678",
  "telefono": "+573001234567",
  "correo": "juan.perez@email.com",
  "contrasena": "Password123!"
}
```

#### Respuesta exitosa (201):
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente como cliente",
  "data": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "tipo_documento": "Cedula de ciudadania",
    "documento": "12345678",
    "telefono": "+573001234567",
    "correo": "juan.perez@email.com",
    "roleId": 3,
    "cliente": {
      "id_cliente": 1,
      "direccion": null,
      "estado": true,
      "fecha_creacion": "2024-01-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Errores posibles:
- `400`: Datos de validación incorrectos
- `409`: Correo o documento ya registrado

---

### 2. Inicio de Sesión
**POST** `/api/auth/login`

Autentica un usuario y retorna un token JWT.

#### Campos requeridos:
- `correo` (string): Correo electrónico del usuario
- `contrasena` (string): Contraseña del usuario

#### Ejemplo de request:
```json
{
  "correo": "juan.perez@email.com",
  "contrasena": "Password123!"
}
```

#### Respuesta exitosa (200):
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id_usuario": 1,
      "nombre": "Juan Pérez",
      "tipo_documento": "Cedula de ciudadania",
      "documento": "12345678",
      "telefono": "+573001234567",
      "correo": "juan.perez@email.com",
      "roleId": 3,
      "role": {
        "id_rol": 3,
        "nombre": "Cliente",
        "descripcion": "Rol para clientes del sistema"
      },
      "cliente": {
        "id_cliente": 1,
        "direccion": null,
        "estado": true
      }
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Errores posibles:
- `400`: Datos de validación incorrectos
- `401`: Credenciales inválidas

---

### 3. Obtener Usuario Actual
**GET** `/api/auth/me`

Obtiene la información del usuario autenticado.

#### Headers requeridos:
- `Authorization: Bearer <token>`

#### Respuesta exitosa (200):
```json
{
  "success": true,
  "message": "Información del usuario obtenida exitosamente",
  "data": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "tipo_documento": "Cedula de ciudadania",
    "documento": "12345678",
    "telefono": "+573001234567",
    "correo": "juan.perez@email.com",
    "roleId": 3,
    "role": {
      "id_rol": 3,
      "nombre": "Cliente",
      "descripcion": "Rol para clientes del sistema"
    },
    "cliente": {
      "id_cliente": 1,
      "direccion": null,
      "estado": true
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Errores posibles:
- `401`: Token no válido o expirado
- `404`: Usuario no encontrado

---

### 4. Verificar Token
**POST** `/api/auth/verify`

Verifica si un token JWT es válido.

#### Campos requeridos:
- `token` (string): Token JWT a verificar

#### Ejemplo de request:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Respuesta exitosa (200):
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "id_usuario": 1,
    "correo": "juan.perez@email.com",
    "roleId": 3,
    "roleName": "Cliente",
    "iat": 1705312200,
    "exp": 1705398600
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Errores posibles:
- `400`: Token no proporcionado
- `401`: Token inválido o expirado

---

### 5. Cerrar Sesión
**POST** `/api/auth/logout`

Cierra la sesión del usuario (token se invalida en el cliente).

#### Headers requeridos:
- `Authorization: Bearer <token>`

#### Respuesta exitosa (200):
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Características del Sistema

### Validaciones de Registro:
- **Nombre**: Solo letras y espacios, 2-100 caracteres
- **Tipo de documento**: Solo valores permitidos
- **Documento**: Solo letras y números, 5-20 caracteres, único
- **Teléfono**: Formato internacional (+1234567890)
- **Correo**: Formato válido de email, único
- **Contraseña**: Mínimo 8 caracteres, debe contener mayúscula, minúscula, número y carácter especial

### Seguridad:
- Contraseñas encriptadas con bcrypt (10 salt rounds)
- Tokens JWT con expiración de 24 horas
- Validación de duplicados (correo y documento)
- Transacciones de base de datos para consistencia

### Roles Automáticos:
- Los usuarios registrados se asignan automáticamente al rol "Cliente"
- Se crea automáticamente un registro en la tabla `clientes`
- El sistema busca el rol "Cliente" o usa el rol por defecto (ID 1)

### Uso de Tokens:
Para acceder a rutas protegidas, incluir el header:
```
Authorization: Bearer <token_jwt>
```

## Notas Importantes:
1. El sistema no permite registro si el documento ya existe
2. El sistema no permite registro si el correo ya existe
3. Los usuarios registrados se crean automáticamente como clientes
4. Los tokens JWT expiran en 24 horas
5. Las contraseñas se encriptan antes de guardar en la base de datos
