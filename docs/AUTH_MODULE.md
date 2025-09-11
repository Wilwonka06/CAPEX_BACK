# Módulo de Autenticación - CAPEX Backend

## Descripción General

El módulo de autenticación permite a los usuarios registrarse como clientes y autenticarse en el sistema. Todos los usuarios registrados se guardan tanto en la tabla `usuarios` como en la tabla `clientes`.

## Endpoints Disponibles

### 1. Registro de Usuario
**POST** `/api/auth/register`

Registra un nuevo usuario como cliente en el sistema.

#### Campos Requeridos:
- `nombre` (string): Nombre completo del usuario (solo letras y espacios)
- `tipo_documento` (enum): Tipo de documento ('Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria')
- `documento` (string): Número de documento (letras y números, 5-20 caracteres)
- `telefono` (string): Número de teléfono (formato: +573001234567)
- `correo` (string): Correo electrónico válido
- `contrasena` (string): Contraseña (mínimo 8 caracteres, debe contener mayúscula, minúscula, número y carácter especial)

#### Ejemplo de Request:
```json
{
  "nombre": "Juan Pérez",
  "tipo_documento": "Cedula de ciudadania",
  "documento": "1234567890",
  "telefono": "+573001234567",
  "correo": "juan.perez@email.com",
  "contrasena": "Password123!"
}
```

#### Respuesta Exitosa (201):
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente como cliente",
  "data": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "tipo_documento": "Cedula de ciudadania",
    "documento": "1234567890",
    "telefono": "+573001234567",
    "correo": "juan.perez@email.com",
    "roleId": 2,
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

#### Errores Posibles:
- **400**: Datos de validación incorrectos
- **409**: Documento o correo ya registrado

### 2. Inicio de Sesión
**POST** `/api/auth/login`

Autentica un usuario y retorna un token JWT.

#### Campos Requeridos:
- `correo` (string): Correo electrónico del usuario
- `contrasena` (string): Contraseña del usuario

#### Ejemplo de Request:
```json
{
  "correo": "juan.perez@email.com",
  "contrasena": "Password123!"
}
```

#### Respuesta Exitosa (200):
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id_usuario": 1,
      "nombre": "Juan Pérez",
      "correo": "juan.perez@email.com",
      "roleId": 2,
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

### 3. Verificar Token
**POST** `/api/auth/verify`

Verifica la validez de un token JWT.

#### Campos Requeridos:
- `token` (string): Token JWT a verificar

#### Respuesta Exitosa (200):
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "id_usuario": 1,
    "correo": "juan.perez@email.com",
    "roleId": 2,
    "roleName": "Cliente",
    "iat": 1642234567,
    "exp": 1642320967
  }
}
```

### 4. Obtener Usuario Actual
**GET** `/api/auth/me`

Obtiene la información del usuario autenticado.

#### Headers Requeridos:
- `Authorization: Bearer <token>`

#### Respuesta Exitosa (200):
```json
{
  "success": true,
  "message": "Información del usuario obtenida exitosamente",
  "data": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@email.com",
    "roleId": 2,
    "cliente": {
      "id_cliente": 1,
      "direccion": null,
      "estado": true
    }
  }
}
```

### 5. Cerrar Sesión
**POST** `/api/auth/logout`

Cierra la sesión del usuario (invalida el token).

#### Headers Requeridos:
- `Authorization: Bearer <token>`

#### Respuesta Exitosa (200):
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Validaciones Implementadas

### Registro:
- **Nombre**: Solo letras y espacios, 2-100 caracteres
- **Tipo de documento**: Valores permitidos: 'Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'
- **Documento**: Solo letras y números, 5-20 caracteres, único en el sistema
- **Teléfono**: Formato internacional (+573001234567), 7-15 dígitos
- **Correo**: Formato válido de email, único en el sistema
- **Contraseña**: Mínimo 8 caracteres, debe contener mayúscula, minúscula, número y carácter especial (@$!%?&)

### Login:
- **Correo**: Formato válido de email
- **Contraseña**: No puede estar vacía

## Características de Seguridad

1. **Encriptación de contraseñas**: Se usa bcrypt con 10 salt rounds
2. **Tokens JWT**: Expiración de 24 horas
3. **Validación de documentos únicos**: No permite duplicados
4. **Validación de correos únicos**: No permite duplicados
5. **Transacciones de base de datos**: Garantiza consistencia en el registro

## Estructura de Base de Datos

### Tabla `usuarios`:
- `id_usuario` (PK, autoincrement)
- `nombre` (varchar 100)
- `tipo_documento` (enum)
- `documento` (varchar 20, unique)
- `telefono` (varchar 20)
- `correo` (varchar 100, unique)
- `contrasena` (varchar 100, encriptada)
- `roleId` (FK a roles)

### Tabla `clientes`:
- `id_cliente` (PK, autoincrement)
- `id_usuario` (FK a usuarios)
- `direccion` (varchar 200, nullable)
- `estado` (boolean, default true)
- `fecha_creacion` (datetime)
- `fecha_actualizacion` (datetime)

## Uso del Token JWT

Para acceder a endpoints protegidos, incluir el token en el header:

```
Authorization: Bearer <token_jwt>
```

El token contiene la siguiente información:
- `id_usuario`: ID del usuario
- `correo`: Correo del usuario
- `roleId`: ID del rol
- `roleName`: Nombre del rol
- `iat`: Timestamp de emisión
- `exp`: Timestamp de expiración

## Middlewares Disponibles

### AuthMiddleware.authenticateToken
Verifica que el token sea válido y agrega la información del usuario a `req.user`

### AuthMiddleware.requireRole(allowedRoles)
Verifica que el usuario tenga uno de los roles permitidos

### AuthMiddleware.requireOwnershipOrAdmin(resourceIdParam)
Verifica que el usuario sea propietario del recurso o tenga rol de administrador

### AuthMiddleware.optionalAuth
Autenticación opcional (no falla si no hay token)

## Ejemplos de Uso

### Proteger una ruta con autenticación:
```javascript
router.get('/perfil', 
  AuthMiddleware.authenticateToken,
  UserController.getProfile
);
```

### Proteger una ruta con rol específico:
```javascript
router.post('/admin/users', 
  AuthMiddleware.authenticateToken,
  AuthMiddleware.requireRole('Administrador'),
  UserController.createUser
);
```

### Proteger una ruta con propiedad o rol de admin:
```javascript
router.put('/users/:id', 
  AuthMiddleware.authenticateToken,
  AuthMiddleware.requireOwnershipOrAdmin('id'),
  UserController.updateUser
);
```
