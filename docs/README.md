# 📚 Documentación del Sistema CAPEX

## 📋 Índice de Documentación

Esta carpeta contiene toda la documentación del sistema CAPEX organizada por módulos y funcionalidades.

---

## 🔐 **Sistema de Permisos y Privilegios**

### 📖 Documentación Principal
- **[README_PERMISOS_PRIVILEGIOS.md](./README_PERMISOS_PRIVILEGIOS.md)** - Documentación completa del sistema de permisos y privilegios
- **[INSTRUCCIONES_PERMISOS.md](./INSTRUCCIONES_PERMISOS.md)** - Instrucciones paso a paso para configurar permisos

### 🛠️ Scripts de Gestión
- **`scripts/verificar-permisos.js`** - Script para verificar la configuración de permisos
- **`scripts/reinicializar-permisos.js`** - Script para reinicializar permisos desde cero

### 📊 Resumen del Sistema
- **Permisos (Módulos):** Compras, Servicios, Venta, Configuración, Usuarios
- **Privilegios (Acciones):** Create, Read, Edit, Delete
- **Roles:** Administrador, Empleado, Cliente

---

## 👥 **Gestión de Roles**

### 📖 Documentación de API
- **[README_ROLES_API.md](./README_ROLES_API.md)** - Documentación completa de la API de creación de roles
- **[README_EDITAR_ROLES_API.md](./README_EDITAR_ROLES_API.md)** - Documentación de la API de edición de roles

### 🎯 Funcionalidades
- Creación de roles con validaciones
- Edición de roles con verificaciones
- Asignación de permisos y privilegios
- Validaciones de unicidad y integridad

---

## 👤 **Gestión de Clientes**

### 📖 Documentación de API
- **[README_CLIENTES_API.md](./README_CLIENTES_API.md)** - Documentación completa de la API de clientes con validaciones

### 🧪 Pruebas y Testing
- **[TEST_CLIENTES.md](./TEST_CLIENTES.md)** - Guía completa de pruebas para validaciones de clientes

### 🔒 Validaciones Implementadas
- **Datos Personales:** Nombres, apellidos, documento, email
- **Seguridad:** Contraseñas fuertes, hash automático
- **Unicidad:** Email y documento únicos
- **Formato:** Validaciones de formato y longitud

---

## 🚀 **Cómo Usar la Documentación**

### 1. **Sistema de Permisos**
```bash
# Verificar configuración actual
node scripts/verificar-permisos.js

# Reinicializar si es necesario
node scripts/reinicializar-permisos.js
```

### 2. **API de Clientes**
```bash
# Probar creación de cliente
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
    "confirmPassword": "Contraseña123!"
  }'
```

### 3. **API de Roles**
```bash
# Crear nuevo rol
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nombre_rol": "Supervisor",
    "descripcion": "Rol de supervisor de área",
    "estado_rol": true,
    "permisos_privilegios": [
      {
        "id_permiso": 1,
        "id_privilegio": 1
      }
    ]
  }'
```

---

## 📁 **Estructura de Archivos**

```
docs/
├── README.md                           # Este archivo (índice principal)
├── README_PERMISOS_PRIVILEGIOS.md     # Sistema de permisos y privilegios
├── INSTRUCCIONES_PERMISOS.md          # Instrucciones de configuración
├── README_CLIENTES_API.md             # API de gestión de clientes
├── TEST_CLIENTES.md                   # Pruebas de validaciones de clientes
├── README_ROLES_API.md                # API de creación de roles
└── README_EDITAR_ROLES_API.md         # API de edición de roles
```

---

## 🔧 **Configuración del Sistema**

### **Inicialización Automática**
Los permisos y privilegios se crean automáticamente al iniciar la aplicación:

```bash
npm start
```

### **Verificación Manual**
```bash
# Verificar permisos
node scripts/verificar-permisos.js

# Verificar base de datos
mysql -u usuario -p nombre_base_datos
```

---

## 📞 **Soporte y Ayuda**

### **Problemas Comunes**
1. **Permisos no se crean automáticamente** → Ejecutar `node scripts/reinicializar-permisos.js`
2. **Errores de validación** → Revisar `TEST_CLIENTES.md` para casos de prueba
3. **Errores de importación** → Verificar que los modelos estén correctamente importados

### **Consultas SQL Útiles**
```sql
-- Ver todos los permisos
SELECT * FROM permissions ORDER BY id_permiso;

-- Ver combinaciones por rol
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

---

## 🎯 **Próximos Pasos**

1. **Implementar middleware de verificación** de permisos en las rutas
2. **Crear endpoints de consulta** para ver permisos por rol
3. **Implementar auditoría** de cambios de permisos
4. **Crear interfaz de administración** para gestionar roles
5. **Documentar APIs adicionales** del sistema

---

## 📝 **Notas Importantes**

- **Sin CRUD Manual:** Los permisos y privilegios se crean automáticamente
- **Inmutabilidad:** Los permisos y privilegios base no se pueden modificar
- **Flexibilidad:** Se pueden crear nuevos roles con combinaciones específicas
- **Seguridad:** Todas las operaciones requieren verificación de permisos
- **Auditoría:** Todas las asignaciones quedan registradas

---

**¡La documentación está organizada y lista para usar! 🎉**
