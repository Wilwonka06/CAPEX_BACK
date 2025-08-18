# Servicios de la API CAPEX

Este directorio contiene los servicios que manejan la lógica de negocio de la aplicación.

## 📁 Estructura

```
services/
├── UsersService.js    # Servicio para gestión de usuarios
└── README.md         # Esta documentación
```

## 🔧 UsersService

### **Descripción**
Servicio que maneja toda la lógica de negocio relacionada con usuarios, incluyendo operaciones CRUD, validaciones y consultas complejas.

### **Funcionalidades Principales**

#### **1. Crear Usuario**
```javascript
const UsersService = require('../services/UsersService');

const newUser = await UsersService.createUser({
  name: 'Juan Pérez',
  documentType: 'CC',
  documentNumber: '12345678',
  // roleId: 1, // Opcional - se asigna automáticamente como 1
  email: 'juan@example.com',
  password: 'password123'
});
```

#### **2. Obtener Usuarios con Paginación**
```javascript
const result = await UsersService.getAllUsers({
  page: 1,
  limit: 10,
  search: 'juan',
  roleId: 1,
  documentType: 'CC'
});

// Resultado incluye:
// - users: Array de usuarios
// - pagination: Metadatos de paginación
```

#### **3. Buscar Usuario por ID**
```javascript
const user = await UsersService.getUserById(1);
```

#### **4. Buscar Usuario por Email**
```javascript
const user = await UsersService.getUserByEmail('juan@example.com');
```

#### **5. Buscar Usuario por Documento**
```javascript
const user = await UsersService.getUserByDocument('CC', '12345678');
```

#### **6. Actualizar Usuario**
```javascript
const updatedUser = await UsersService.updateUser(1, {
  name: 'Juan Carlos Pérez',
  phone: 3001234567
});
```

#### **7. Eliminar Usuario**
```javascript
await UsersService.deleteUser(1);
```

#### **8. Cambiar Contraseña**
```javascript
await UsersService.changePassword(1, 'nuevaPassword123');
```

#### **9. Estadísticas de Usuarios**
```javascript
const stats = await UsersService.getUserStats();
// Retorna: totalUsers, documentTypeStats, roleStats
```

### **Validaciones Automáticas**

El servicio incluye validaciones automáticas para:

- ✅ **Email único**: No permite emails duplicados
- ✅ **Documento único**: No permite documentos duplicados
- ✅ **Existencia de usuario**: Verifica que el usuario existe antes de operaciones
- ✅ **Campos requeridos**: Valida que los campos obligatorios estén presentes

### **Notas Temporales**

- ⏳ **roleId**: Campo opcional por ahora. Se asigna automáticamente como 1
- ⏳ **Roles**: El módulo de Roles se implementará posteriormente
- ⏳ **Cuando implementes Roles**: Solo cambiarás la validación y el valor por defecto

### **Seguridad**

- 🔒 **Password excluido**: Nunca retorna contraseñas en las consultas
- 🔒 **Validación de datos**: Valida todos los datos de entrada
- 🔒 **Manejo de errores**: Captura y maneja errores de manera segura

### **Uso en Controladores**

```javascript
// En UsersController.js
static async createUser(req, res) {
  try {
    const userData = req.body;
    const newUser = await UsersService.createUser(userData);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
```

### **Manejo de Errores**

El servicio lanza errores descriptivos que incluyen:

- ❌ **Email ya registrado**
- ❌ **Documento ya registrado**
- ❌ **Usuario no encontrado**
- ❌ **Campos requeridos faltantes**

### **Performance**

- 🚀 **Consultas optimizadas**: Usa Sequelize de manera eficiente
- 🚀 **Paginación**: Implementa paginación para listas grandes
- 🚀 **Búsquedas**: Permite búsquedas por múltiples criterios
- 🚀 **Índices**: Optimizado para consultas por ID, email y documento

### **Extensibilidad**

El servicio está diseñado para ser fácilmente extensible:

- ➕ **Nuevos métodos**: Fácil agregar nuevas funcionalidades
- ➕ **Nuevas validaciones**: Estructura clara para agregar validaciones
- ➕ **Nuevos campos**: Fácil agregar nuevos campos al modelo
- ➕ **Nuevas consultas**: Estructura para consultas complejas

## 📝 Notas de Implementación

1. **Base de datos**: Requiere conexión a MySQL con Sequelize
2. **Modelo User**: Depende del modelo User.js en `/models`
3. **Operadores Sequelize**: Usa `Op` para consultas complejas
4. **Transacciones**: Se pueden agregar transacciones para operaciones críticas
5. **Logging**: Se puede agregar logging para debugging

## 🔮 Futuras Mejoras

- **Cache**: Implementar cache para consultas frecuentes
- **Auditoría**: Log de cambios en usuarios
- **Soft Delete**: Eliminación lógica en lugar de física
- **Bulk Operations**: Operaciones en lote para múltiples usuarios
- **Validaciones Avanzadas**: Validaciones más complejas de datos
