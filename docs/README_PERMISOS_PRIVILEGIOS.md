# Sistema de Permisos y Privilegios

## Descripción
Este documento describe la configuración del sistema de permisos y privilegios implementado en el backend. El sistema utiliza un modelo de tres niveles: **Roles**, **Permisos** y **Privilegios**.

## Estructura del Sistema

### 📋 **Permisos (Permissions)**
Los permisos representan los **MÓDULOS DEL SISTEMA**:

| ID | Nombre | Descripción |
|----|--------|-------------|
| 1 | `Compras` | Módulo de gestión de compras |
| 2 | `Servicios` | Módulo de gestión de servicios |
| 3 | `Venta` | Módulo de gestión de ventas |
| 4 | `Configuración` | Módulo de configuración del sistema |
| 5 | `Usuarios` | Módulo de gestión de usuarios |

### 🔧 **Privilegios (Privileges)**
Los privilegios representan las **ACCIONES** que se pueden realizar:

| ID | Nombre | Descripción |
|----|--------|-------------|
| 1 | `Create` | Crear nuevos registros |
| 2 | `Read` | Leer/consultar registros |
| 3 | `Edit` | Editar/modificar registros |
| 4 | `Delete` | Eliminar registros |

### 👥 **Roles (Roles)**
Los roles son las **COMBINACIONES** de permisos y privilegios asignados a usuarios:

| ID | Nombre | Descripción | Estado |
|----|--------|-------------|--------|
| 1 | `Administrador` | Acceso completo al sistema | ✅ Activo |
| 2 | `Empleado` | Acceso limitado para operaciones diarias | ✅ Activo |
| 3 | `Cliente` | Acceso muy limitado | ✅ Activo |

## Matriz de Permisos y Privilegios

### 🎯 **Administrador**
El administrador tiene **acceso completo** a todo el sistema:

| Permiso | Create | Read | Edit | Delete |
|---------|--------|------|------|--------|
| **Compras** | ✅ | ✅ | ✅ | ✅ |
| **Servicios** | ✅ | ✅ | ✅ | ✅ |
| **Venta** | ✅ | ✅ | ✅ | ✅ |
| **Configuración** | ✅ | ✅ | ✅ | ✅ |
| **Usuarios** | ✅ | ✅ | ✅ | ✅ |

**Total de combinaciones:** 20 (5 permisos × 4 privilegios)

### 👨‍💼 **Empleado**
El empleado tiene **acceso limitado**:

| Permiso | Create | Read | Edit | Delete |
|---------|--------|------|------|--------|
| **Compras** | ✅ | ✅ | ✅ | ❌ |
| **Servicios** | ✅ | ✅ | ✅ | ❌ |
| **Venta** | ✅ | ✅ | ✅ | ❌ |
| **Configuración** | ❌ | ❌ | ❌ | ❌ |
| **Usuarios** | ❌ | ❌ | ❌ | ❌ |

**Total de combinaciones:** 9 (3 permisos × 3 privilegios)

### 👤 **Cliente**
El cliente tiene **acceso muy limitado**:

| Permiso | Create | Read | Edit | Delete |
|---------|--------|------|------|--------|
| **Compras** | ❌ | ❌ | ❌ | ❌ |
| **Servicios** | ❌ | ✅ | ❌ | ❌ |
| **Venta** | ❌ | ✅ | ❌ | ❌ |
| **Configuración** | ❌ | ❌ | ❌ | ❌ |
| **Usuarios** | ❌ | ❌ | ❌ | ❌ |

**Total de combinaciones:** 2 (2 permisos × 1 privilegio)

## Tabla de Relaciones (RolePermissionPrivilege)

La tabla `RolePermissionPrivilege` almacena todas las combinaciones permitidas:

### Administrador (ID: 1)
```sql
-- Todas las combinaciones (20 registros)
id_rol: 1, id_permiso: 1, id_privilegio: 1  -- Compras + Create
id_rol: 1, id_permiso: 1, id_privilegio: 2  -- Compras + Read
id_rol: 1, id_permiso: 1, id_privilegio: 3  -- Compras + Edit
id_rol: 1, id_permiso: 1, id_privilegio: 4  -- Compras + Delete
id_rol: 1, id_permiso: 2, id_privilegio: 1  -- Servicios + Create
id_rol: 1, id_permiso: 2, id_privilegio: 2  -- Servicios + Read
id_rol: 1, id_permiso: 2, id_privilegio: 3  -- Servicios + Edit
id_rol: 1, id_permiso: 2, id_privilegio: 4  -- Servicios + Delete
id_rol: 1, id_permiso: 3, id_privilegio: 1  -- Venta + Create
id_rol: 1, id_permiso: 3, id_privilegio: 2  -- Venta + Read
id_rol: 1, id_permiso: 3, id_privilegio: 3  -- Venta + Edit
id_rol: 1, id_permiso: 3, id_privilegio: 4  -- Venta + Delete
id_rol: 1, id_permiso: 4, id_privilegio: 1  -- Configuración + Create
id_rol: 1, id_permiso: 4, id_privilegio: 2  -- Configuración + Read
id_rol: 1, id_permiso: 4, id_privilegio: 3  -- Configuración + Edit
id_rol: 1, id_permiso: 4, id_privilegio: 4  -- Configuración + Delete
id_rol: 1, id_permiso: 5, id_privilegio: 1  -- Usuarios + Create
id_rol: 1, id_permiso: 5, id_privilegio: 2  -- Usuarios + Read
id_rol: 1, id_permiso: 5, id_privilegio: 3  -- Usuarios + Edit
id_rol: 1, id_permiso: 5, id_privilegio: 4  -- Usuarios + Delete
```

### Empleado (ID: 2)
```sql
-- Combinaciones limitadas (9 registros)
id_rol: 2, id_permiso: 1, id_privilegio: 1  -- Compras + Create
id_rol: 2, id_permiso: 1, id_privilegio: 2  -- Compras + Read
id_rol: 2, id_permiso: 1, id_privilegio: 3  -- Compras + Edit
id_rol: 2, id_permiso: 2, id_privilegio: 1  -- Servicios + Create
id_rol: 2, id_permiso: 2, id_privilegio: 2  -- Servicios + Read
id_rol: 2, id_permiso: 2, id_privilegio: 3  -- Servicios + Edit
id_rol: 2, id_permiso: 3, id_privilegio: 1  -- Venta + Create
id_rol: 2, id_permiso: 3, id_privilegio: 2  -- Venta + Read
id_rol: 2, id_permiso: 3, id_privilegio: 3  -- Venta + Edit
```

### Cliente (ID: 3)
```sql
-- Combinaciones muy limitadas (2 registros)
id_rol: 3, id_permiso: 2, id_privilegio: 2  -- Servicios + Read
id_rol: 3, id_permiso: 3, id_privilegio: 2  -- Venta + Read
```

## Inicialización Automática

Los permisos y privilegios se crean automáticamente al iniciar la aplicación:

```javascript
// En src/config/initRoles.js
const initializeRoles = async () => {
  // 1. Crear permisos: Compras, Servicios, Venta, Configuración, Usuarios
  // 2. Crear privilegios: Create, Read, Edit, Delete
  // 3. Crear roles: Administrador, Empleado, Cliente
  // 4. Asignar combinaciones de permisos y privilegios
};
```

### Comandos para Reinicializar

Si necesitas reinicializar los datos:

```bash
# Opción 1: Eliminar y recrear la base de datos
npm run db:reset

# Opción 2: Ejecutar script de inicialización manualmente
node -e "require('./src/config/initRoles').initializeRoles()"
```

## Consultas Útiles

### Obtener todos los permisos
```sql
SELECT * FROM permissions;
```

### Obtener todos los privilegios
```sql
SELECT * FROM privileges;
```

### Obtener todos los roles
```sql
SELECT * FROM roles;
```

### Obtener permisos y privilegios de un rol específico
```sql
SELECT 
  r.nombre_rol,
  p.nombre as permiso,
  pr.nombre as privilegio
FROM roles r
JOIN role_permission_privileges rpp ON r.id_rol = rpp.id_rol
JOIN permissions p ON rpp.id_permiso = p.id_permiso
JOIN privileges pr ON rpp.id_privilegio = pr.id_privilegio
WHERE r.nombre_rol = 'Administrador';
```

### Contar combinaciones por rol
```sql
SELECT 
  r.nombre_rol,
  COUNT(*) as total_combinaciones
FROM roles r
JOIN role_permission_privileges rpp ON r.id_rol = rpp.id_rol
GROUP BY r.id_rol, r.nombre_rol;
```

## Uso en el Código

### Verificar permisos en middleware
```javascript
const requirePermission = (permission, privilege) => {
  return async (req, res, next) => {
    const userRole = req.user.role;
    
    // Verificar si el rol tiene el permiso y privilegio
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

### Ejemplo de uso en rutas
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

## Resumen de Accesos

| Rol | Permisos | Privilegios | Total Combinaciones |
|-----|----------|-------------|-------------------|
| **Administrador** | Compras, Servicios, Venta, Configuración, Usuarios | Create, Read, Edit, Delete | 20 |
| **Empleado** | Compras, Servicios, Venta | Create, Read, Edit | 9 |
| **Cliente** | Servicios, Venta | Read | 2 |

## Notas Importantes

1. **Sin CRUD**: Los permisos y privilegios se crean automáticamente, no hay endpoints para crearlos manualmente
2. **Inmutabilidad**: Una vez creados, los permisos y privilegios base no se pueden modificar
3. **Flexibilidad**: Se pueden crear nuevos roles con combinaciones específicas usando la API de roles
4. **Seguridad**: Todas las operaciones requieren verificación de permisos
5. **Auditoría**: Todas las asignaciones quedan registradas en la tabla de relaciones

## Próximos Pasos

1. **Implementar middleware de verificación** de permisos
2. **Crear endpoints de consulta** para ver permisos por rol
3. **Implementar auditoría** de cambios de permisos
4. **Crear interfaz de administración** para gestionar roles
