# 🧪 **Guía para Probar la API CAPEX**

## 📋 **Prerequisitos**

- ✅ MySQL instalado y funcionando
- ✅ Base de datos creada
- ✅ Archivo `.env` configurado con credenciales de BD
- ✅ Node.js y npm instalados

## 🗄️ **Paso 1: Crear la Base de Datos**

```sql
CREATE DATABASE capex_db;
USE capex_db;
```

## 🔄 **Paso 2: Ejecutar Migraciones**

```bash
# Crear la tabla Users
npm run db:migrate

# Si quieres revertir:
# npm run db:migrate:undo
```

## 🌱 **Paso 3: Insertar Datos de Prueba**

```bash
# Insertar usuarios de prueba
npm run db:seed

# Si quieres revertir:
# npm run db:seed:undo
```

## 🚀 **Paso 4: Iniciar el Servidor**

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## 📡 **Paso 5: Probar los Endpoints**

### **🌐 Ruta Principal**
```bash
GET http://localhost:3000/
```
**Respuesta esperada:**
```json
{
  "message": "CAPEX API funcionando correctamente",
  "timestamp": "2025-08-14T22:45:00.000Z"
}
```

### **👥 Endpoints de Usuarios**

#### **1. Crear Usuario**
```bash
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "Test User",
  "documentType": "CC",
  "documentNumber": "99999999",
  "email": "test@example.com",
  "password": "test123"
}
```

#### **2. Obtener Todos los Usuarios**
```bash
GET http://localhost:3000/api/users
GET http://localhost:3000/api/users?page=1&limit=5
GET http://localhost:3000/api/users?search=juan
GET http://localhost:3000/api/users?roleId=1
```

#### **3. Obtener Usuario por ID**
```bash
GET http://localhost:3000/api/users/1
```

#### **4. Obtener Usuario por Email**
```bash
GET http://localhost:3000/api/users/email/admin@demo.com
```

#### **5. Obtener Usuario por Documento**
```bash
GET http://localhost:3000/api/users/document/CC/12345678
```

#### **6. Actualizar Usuario**
```bash
PUT http://localhost:3000/api/users/1
Content-Type: application/json

{
  "name": "Admin Actualizado",
  "phone": 3009999999
}
```

#### **7. Cambiar Contraseña**
```bash
PATCH http://localhost:3000/api/users/1/password
Content-Type: application/json

{
  "newPassword": "nuevaPassword123"
}
```

#### **8. Eliminar Usuario**
```bash
DELETE http://localhost:3000/api/users/1
```

#### **9. Estadísticas de Usuarios**
```bash
GET http://localhost:3000/api/users/stats
```

## 🛠️ **Herramientas para Probar**

### **Option 1: Postman/Insomnia**
- Importa la colección de endpoints
- Configura variables de entorno
- Ejecuta requests automáticamente

### **Option 2: cURL (Terminal)**
```bash
# Ejemplo: Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario cURL",
    "documentType": "CC",
    "documentNumber": "88888888",
    "email": "curl@test.com",
    "password": "curl123"
  }'

# Ejemplo: Obtener usuarios
curl http://localhost:3000/api/users
```

### **Option 3: Thunder Client (VS Code)**
- Extensión gratuita
- Interfaz simple
- Integrado en VS Code

## 📊 **Datos de Prueba Disponibles**

Después de ejecutar `npm run db:seed`, tendrás estos usuarios:

| Email | Password | Nombre |
|-------|----------|---------|
| admin@demo.com | admin123 | Administrador Demo |
| juan@demo.com | juan123 | Juan Pérez |
| maria@demo.com | maria123 | María García |
| carlos@demo.com | carlos123 | Carlos López |
| ana@demo.com | ana123 | Ana Rodríguez |

## 🔍 **Casos de Prueba Recomendados**

### **✅ Casos Exitosos:**
1. Crear usuario con datos válidos
2. Obtener lista de usuarios con paginación
3. Buscar usuario por diferentes criterios
4. Actualizar información de usuario
5. Cambiar contraseña

### **❌ Casos de Error:**
1. Crear usuario con email duplicado
2. Crear usuario con documento duplicado
3. Buscar usuario inexistente
4. Actualizar usuario inexistente
5. Enviar datos incompletos

## 🚨 **Solución de Problemas**

### **Error: "ECONNREFUSED"**
- Verifica que MySQL esté corriendo
- Revisa credenciales en `.env`
- Confirma que la base de datos existe

### **Error: "Table doesn't exist"**
- Ejecuta `npm run db:migrate`
- Verifica que la migración se ejecutó correctamente

### **Error: "Validation failed"**
- Revisa que todos los campos requeridos estén presentes
- Verifica formato de email
- Confirma que password tenga al menos 6 caracteres

### **Error: "Duplicate entry"**
- El email o documento ya existe
- Usa `npm run db:seed:undo` y luego `npm run db:seed` para resetear

## 🔄 **Comandos Útiles**

```bash
# Reset completo de base de datos
npm run db:reset

# Solo migraciones
npm run db:migrate

# Solo datos de prueba
npm run db:seed

# Ver logs del servidor
npm run dev

# Verificar estado de la API
curl http://localhost:3000/
```

## 📝 **Notas Importantes**

- 🔒 **roleId**: Se asigna automáticamente como 1 (temporal)
- 📧 **Email único**: No se pueden duplicar emails
- 🆔 **Documento único**: No se pueden duplicar documentos
- 🔑 **Password**: Nunca se retorna en las respuestas
- 📊 **Paginación**: Por defecto 10 usuarios por página
- 🔍 **Búsqueda**: Funciona por nombre, email y documento

## 🎯 **Próximos Pasos**

1. ✅ **Probar todos los endpoints**
2. 🔐 **Implementar autenticación**
3. 📝 **Agregar logging**
4. 🧪 **Crear tests automatizados**
5. 📚 **Documentar con Swagger/OpenAPI**

---

## 🚀 **¡Listo para Probar!**

Ejecuta estos comandos en orden:
```bash
npm run db:migrate    # Crear tabla
npm run db:seed       # Insertar datos de prueba
npm run dev           # Iniciar servidor
```

¡Y comienza a probar tu API! 🎉
