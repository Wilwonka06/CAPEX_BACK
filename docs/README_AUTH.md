# 🔐 Módulo de Autenticación - CAPEX Backend

## 📋 Resumen

El módulo de autenticación está completamente implementado y funcional. Permite a los usuarios registrarse como clientes y autenticarse en el sistema usando JWT (JSON Web Tokens).

## ✅ Funcionalidades Implementadas

### 1. Registro de Usuarios
- ✅ Campos obligatorios: Nombre, Tipo de documento, Documento, Teléfono, Correo, Contraseña
- ✅ Validación de documento único (no permite duplicados)
- ✅ Validación de correo único (no permite duplicados)
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Creación automática de registro en tabla `clientes`
- ✅ Asignación automática de rol de cliente

### 2. Autenticación (Login)
- ✅ Validación de credenciales
- ✅ Generación de tokens JWT
- ✅ Expiración de tokens (24 horas)
- ✅ Retorno de información del usuario y cliente

### 3. Gestión de Sesiones
- ✅ Verificación de tokens
- ✅ Obtención de información del usuario actual
- ✅ Cierre de sesión
- ✅ Middlewares de autenticación

### 4. Validaciones de Seguridad
- ✅ Validación de formato de email
- ✅ Validación de contraseñas seguras
- ✅ Validación de formato de teléfono
- ✅ Validación de tipos de documento
- ✅ Prevención de registros duplicados

## 🚀 Endpoints Disponibles

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/verify` | Verificar token | No |
| GET | `/api/auth/me` | Obtener usuario actual | Sí |
| POST | `/api/auth/logout` | Cerrar sesión | Sí |

## 📁 Estructura de Archivos

```
src/
├── routes/auth/
│   └── AuthRoutes.js          # Rutas de autenticación
├── controllers/auth/
│   └── AuthController.js      # Controlador de autenticación
├── services/auth/
│   └── AuthService.js         # Lógica de negocio
├── middlewares/auth/
│   ├── AuthMiddleware.js      # Middleware de autenticación
│   └── AuthValidationMiddleware.js  # Validaciones
└── models/
    ├── User.js                # Modelo de usuario
    ├── clients/Client.js      # Modelo de cliente
    └── roles/Role.js          # Modelo de rol
```

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=capex_db

# JWT (IMPORTANTE: Generar un secreto seguro)
JWT_SECRET=mi_secreto_super_seguro_y_unico_123456789_abcdefghijklmnop
JWT_EXPIRES_IN=24h

# API
API_URL=http://localhost:3000
NODE_ENV=development
```

### Generar JWT_SECRET Seguro

Para generar un JWT_SECRET seguro, ejecuta:

```bash
npm run generate:jwt-secret
```

Esto generará un secreto único y seguro que puedes copiar a tu archivo `.env`.

### Instalación de Dependencias

```bash
# Instalar dependencias
npm install

# Instalar axios para pruebas (si no está instalado)
npm install axios --save-dev
```

## 🧪 Pruebas

### Ejecutar Pruebas del Módulo de Autenticación

```bash
# Asegúrate de que el servidor esté corriendo
npm run dev

# En otra terminal, ejecuta las pruebas
npm run test:auth
```

### Pruebas Manuales con cURL

#### 1. Registrar un usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "tipo_documento": "Cedula de ciudadania",
    "documento": "1234567890",
    "telefono": "+573001234567",
    "correo": "juan.perez@email.com",
    "contrasena": "Password123!"
  }'
```

#### 2. Iniciar sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "juan.perez@email.com",
    "contrasena": "Password123!"
  }'
```

#### 3. Obtener usuario actual (con token)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 📊 Base de Datos

### Tabla `usuarios`
```sql
CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  tipo_documento ENUM('Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria') NOT NULL,
  documento VARCHAR(20) NOT NULL UNIQUE,
  telefono VARCHAR(20) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(100) NOT NULL,
  roleId INT DEFAULT 1,
  FOREIGN KEY (roleId) REFERENCES roles(id_rol)
);
```

### Tabla `clientes`
```sql
CREATE TABLE clientes (
  id_cliente INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  direccion VARCHAR(200),
  estado BOOLEAN DEFAULT TRUE,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
```

## 🔒 Seguridad

### Validaciones Implementadas

1. **Contraseñas**: Mínimo 8 caracteres, debe contener:
   - Al menos una mayúscula
   - Al menos una minúscula
   - Al menos un número
   - Al menos un carácter especial (@$!%?&)

2. **Emails**: Formato válido y único en el sistema

3. **Documentos**: Formato válido y único en el sistema

4. **Teléfonos**: Formato internacional (+573001234567)

5. **Nombres**: Solo letras y espacios

### Encriptación
- Contraseñas encriptadas con bcrypt (10 salt rounds)
- Tokens JWT con expiración de 24 horas

## 🛠️ Middlewares Disponibles

### AuthMiddleware.authenticateToken
Verifica que el token sea válido y agrega la información del usuario a `req.user`

```javascript
router.get('/protected', 
  AuthMiddleware.authenticateToken,
  (req, res) => {
    // req.user contiene la información del usuario
    res.json({ user: req.user });
  }
);
```

### AuthMiddleware.requireRole(allowedRoles)
Verifica que el usuario tenga uno de los roles permitidos

```javascript
router.post('/admin/users', 
  AuthMiddleware.authenticateToken,
  AuthMiddleware.requireRole('Administrador'),
  UserController.createUser
);
```

### AuthMiddleware.requireOwnershipOrAdmin(resourceIdParam)
Verifica que el usuario sea propietario del recurso o tenga rol de administrador

```javascript
router.put('/users/:id', 
  AuthMiddleware.authenticateToken,
  AuthMiddleware.requireOwnershipOrAdmin('id'),
  UserController.updateUser
);
```

## 📝 Ejemplos de Uso

### Frontend (JavaScript)

```javascript
// Registrar usuario
const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Usuario registrado:', data.data);
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Iniciar sesión
const loginUser = async (credentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Guardar token en localStorage
      localStorage.setItem('token', data.data.token);
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Obtener usuario actual
const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};
```

## 🚨 Manejo de Errores

### Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error de validación
- **401**: No autenticado
- **403**: No autorizado
- **409**: Conflicto (documento/correo duplicado)
- **500**: Error interno del servidor

### Formato de Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "errorType": "TIPO_DE_ERROR",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔄 Flujo de Registro

1. **Validación de datos**: Se validan todos los campos requeridos
2. **Verificación de duplicados**: Se verifica que el documento y correo no existan
3. **Encriptación**: La contraseña se encripta con bcrypt
4. **Creación de usuario**: Se crea el registro en la tabla `usuarios`
5. **Asignación de rol**: Se asigna el rol de cliente
6. **Creación de cliente**: Se crea el registro en la tabla `clientes`
7. **Respuesta**: Se retorna la información del usuario creado

## 🔄 Flujo de Autenticación

1. **Validación de credenciales**: Se verifica el formato del email y contraseña
2. **Búsqueda de usuario**: Se busca el usuario por email
3. **Verificación de contraseña**: Se compara la contraseña encriptada
4. **Generación de token**: Se genera un token JWT
5. **Respuesta**: Se retorna el token y la información del usuario

## 📚 Documentación Adicional

Para más detalles, consulta el archivo `docs/AUTH_MODULE.md` que contiene la documentación completa del módulo.

## 🤝 Contribución

Para contribuir al módulo de autenticación:

1. Asegúrate de que todas las pruebas pasen
2. Sigue las convenciones de código existentes
3. Documenta cualquier cambio nuevo
4. Actualiza este README si es necesario

## 📞 Soporte

Si tienes problemas con el módulo de autenticación:

1. Revisa los logs del servidor
2. Ejecuta las pruebas: `npm run test:auth`
3. Verifica la configuración de la base de datos
4. Asegúrate de que todas las variables de entorno estén configuradas
