# Instrucciones para Configurar Permisos y Privilegios

## 🎯 **Resumen de lo que se ha creado**

### **Permisos (Módulos del Sistema):**
- ✅ **Compras** - Módulo de gestión de compras
- ✅ **Servicios** - Módulo de gestión de servicios
- ✅ **Venta** - Módulo de gestión de ventas
- ✅ **Configuración** - Módulo de configuración del sistema
- ✅ **Usuarios** - Módulo de gestión de usuarios

### **Privilegios (Acciones):**
- ✅ **Create** - Crear nuevos registros
- ✅ **Read** - Leer/consultar registros
- ✅ **Edit** - Editar/modificar registros
- ✅ **Delete** - Eliminar registros

### **Roles (Combinaciones):**
- ✅ **Administrador** - Acceso completo (20 combinaciones)
- ✅ **Empleado** - Acceso limitado (9 combinaciones)
- ✅ **Cliente** - Acceso muy limitado (2 combinaciones)

## 🚀 **Cómo Inicializar los Permisos**

### **Opción 1: Inicialización Automática (Recomendada)**
Los permisos se crean automáticamente al iniciar la aplicación:

```bash
# Iniciar el servidor
npm start
```

Verás en la consola:
```
✅ Permisos por defecto creados exitosamente: Compras, Servicios, Venta, Configuración, Usuarios
✅ Privilegios por defecto creados exitosamente: Create, Read, Edit, Delete
✅ Roles por defecto creados exitosamente: Administrador, Empleado, Cliente
✅ Permisos y privilegios asignados al Administrador
✅ Permisos y privilegios asignados al Empleado
✅ Permisos y privilegios asignados al Cliente
🎉 Inicialización de roles, permisos y privilegios completada exitosamente
```

### **Opción 2: Verificar la Configuración**
Para verificar que todo esté configurado correctamente:

```bash
# Ejecutar script de verificación
node scripts/verificar-permisos.js
```

**Salida esperada:**
```
🔍 Verificando configuración de permisos y privilegios...

📋 PERMISOS CREADOS:
  ✅ ID: 1 | Nombre: Compras
  ✅ ID: 2 | Nombre: Servicios
  ✅ ID: 3 | Nombre: Venta
  ✅ ID: 4 | Nombre: Configuración
  ✅ ID: 5 | Nombre: Usuarios

🔧 PRIVILEGIOS CREADOS:
  ✅ ID: 1 | Nombre: Create
  ✅ ID: 2 | Nombre: Read
  ✅ ID: 3 | Nombre: Edit
  ✅ ID: 4 | Nombre: Delete

👥 ROLES CREADOS:
  ✅ ID: 1 | Nombre: Administrador | Estado: Activo
  ✅ ID: 2 | Nombre: Empleado | Estado: Activo
  ✅ ID: 3 | Nombre: Cliente | Estado: Activo

🔗 COMBINACIONES DE PERMISOS Y PRIVILEGIOS:

🎯 ROL: Administrador (ID: 1)
  📊 Total combinaciones: 20
    📋 Compras: Create, Read, Edit, Delete
    📋 Servicios: Create, Read, Edit, Delete
    📋 Venta: Create, Read, Edit, Delete
    📋 Configuración: Create, Read, Edit, Delete
    📋 Usuarios: Create, Read, Edit, Delete

🎯 ROL: Empleado (ID: 2)
  📊 Total combinaciones: 9
    📋 Compras: Create, Read, Edit
    📋 Servicios: Create, Read, Edit
    📋 Venta: Create, Read, Edit

🎯 ROL: Cliente (ID: 3)
  📊 Total combinaciones: 2
    📋 Servicios: Read
    📋 Venta: Read

📊 RESUMEN ESTADÍSTICO:
  📋 Total Permisos: 5
  🔧 Total Privilegios: 4
  👥 Total Roles: 3
  🔗 Total Combinaciones: 31
  📈 Combinaciones posibles: 60

🔍 VERIFICACIÓN DE INTEGRIDAD:
  ✅ El rol "Administrador" tiene 20 combinaciones
  ✅ El rol "Empleado" tiene 9 combinaciones
  ✅ El rol "Cliente" tiene 2 combinaciones
  ✅ No hay combinaciones huérfanas

🎉 Verificación completada exitosamente!
```

### **Opción 3: Reinicializar desde Cero**
Si necesitas reinicializar completamente los permisos:

```bash
# Ejecutar script de reinicialización
node scripts/reinicializar-permisos.js
```

**⚠️ ADVERTENCIA:** Este script elimina todos los datos existentes y los recrea desde cero.

## 📊 **Matriz de Permisos Detallada**

### **👑 Administrador - Acceso Completo**
| Permiso | Create | Read | Edit | Delete |
|---------|--------|------|------|--------|
| **Compras** | ✅ | ✅ | ✅ | ✅ |
| **Servicios** | ✅ | ✅ | ✅ | ✅ |
| **Venta** | ✅ | ✅ | ✅ | ✅ |
| **Configuración** | ✅ | ✅ | ✅ | ✅ |
| **Usuarios** | ✅ | ✅ | ✅ | ✅ |

**Total:** 20 combinaciones

### **👨‍💼 Empleado - Acceso Limitado**
| Permiso | Create | Read | Edit | Delete |
|---------|--------|------|------|--------|
| **Compras** | ✅ | ✅ | ✅ | ❌ |
| **Servicios** | ✅ | ✅ | ✅ | ❌ |
| **Venta** | ✅ | ✅ | ✅ | ❌ |
| **Configuración** | ❌ | ❌ | ❌ | ❌ |
| **Usuarios** | ❌ | ❌ | ❌ | ❌ |

**Total:** 9 combinaciones

### **👤 Cliente - Acceso Muy Limitado**
| Permiso | Create | Read | Edit | Delete |
|---------|--------|------|------|--------|
| **Compras** | ❌ | ❌ | ❌ | ❌ |
| **Servicios** | ❌ | ✅ | ❌ | ❌ |
| **Venta** | ❌ | ✅ | ❌ | ❌ |
| **Configuración** | ❌ | ❌ | ❌ | ❌ |
| **Usuarios** | ❌ | ❌ | ❌ | ❌ |

**Total:** 2 combinaciones

## 🔍 **Consultas SQL Útiles**

### **Ver todos los permisos:**
```sql
SELECT * FROM permissions ORDER BY id_permiso;
```

### **Ver todos los privilegios:**
```sql
SELECT * FROM privileges ORDER BY id_privilegio;
```

### **Ver todos los roles:**
```sql
SELECT * FROM roles ORDER BY id_rol;
```

### **Ver combinaciones de un rol específico:**
```sql
SELECT 
  r.nombre_rol,
  p.nombre as permiso,
  pr.nombre as privilegio
FROM roles r
JOIN role_permission_privileges rpp ON r.id_rol = rpp.id_rol
JOIN permissions p ON rpp.id_permiso = p.id_permiso
JOIN privileges pr ON rpp.id_privilegio = pr.id_privilegio
WHERE r.nombre_rol = 'Administrador'
ORDER BY p.nombre, pr.nombre;
```

### **Contar combinaciones por rol:**
```sql
SELECT 
  r.nombre_rol,
  COUNT(*) as total_combinaciones
FROM roles r
JOIN role_permission_privileges rpp ON r.id_rol = rpp.id_rol
GROUP BY r.id_rol, r.nombre_rol
ORDER BY r.id_rol;
```

## 🛠️ **Uso en el Código**

### **Middleware de Verificación de Permisos:**
```javascript
const requirePermission = (permission, privilege) => {
  return async (req, res, next) => {
    const userRole = req.user.role;
    
    const hasPermission = await RolePermissionPrivilege.findOne({
      where: {
        id_rol: userRole.id_rol,
        id_permiso: permission,
        id_privilegio: privilege
      }
    });
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }
    
    next();
  };
};
```

### **Ejemplos de Uso en Rutas:**
```javascript
// Solo administradores pueden eliminar usuarios
router.delete('/usuarios/:id', 
  authenticateToken, 
  requirePermission('Usuarios', 'Delete'),
  deleteController
);

// Empleados pueden crear y editar servicios
router.post('/servicios', 
  authenticateToken, 
  requirePermission('Servicios', 'Create'),
  createController
);

// Clientes solo pueden leer servicios
router.get('/servicios/:id', 
  authenticateToken, 
  requirePermission('Servicios', 'Read'),
  getController
);
```

## 📝 **Notas Importantes**

1. **Sin CRUD Manual**: Los permisos y privilegios se crean automáticamente, no hay endpoints para crearlos manualmente
2. **Inmutabilidad**: Una vez creados, los permisos y privilegios base no se pueden modificar
3. **Flexibilidad**: Se pueden crear nuevos roles con combinaciones específicas usando la API de roles
4. **Seguridad**: Todas las operaciones requieren verificación de permisos
5. **Auditoría**: Todas las asignaciones quedan registradas en la tabla de relaciones

## 🎯 **Próximos Pasos**

1. **Implementar middleware de verificación** de permisos en las rutas
2. **Crear endpoints de consulta** para ver permisos por rol
3. **Implementar auditoría** de cambios de permisos
4. **Crear interfaz de administración** para gestionar roles

## 🆘 **Solución de Problemas**

### **Si los permisos no se crean automáticamente:**
```bash
# Verificar que la base de datos esté conectada
npm start

# Si hay errores, ejecutar reinicialización manual
node scripts/reinicializar-permisos.js
```

### **Si hay errores de importación:**
```bash
# Verificar que los modelos estén correctamente importados
node -e "console.log(require('./src/models/roles'))"
```

### **Si necesitas verificar la base de datos:**
```bash
# Conectar a MySQL y verificar tablas
mysql -u usuario -p nombre_base_datos
SHOW TABLES;
DESCRIBE permissions;
DESCRIBE privileges;
DESCRIBE roles;
DESCRIBE role_permission_privileges;
```

¡Los permisos y privilegios están configurados y listos para usar! 🎉
