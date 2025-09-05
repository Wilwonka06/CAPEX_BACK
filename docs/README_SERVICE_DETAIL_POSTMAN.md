# 📚 CAPEX - ServiceDetail API - Colección de Postman

## 🎯 **Descripción**

Esta colección de Postman contiene todos los endpoints necesarios para probar la API del módulo **ServiceDetail** del sistema CAPEX. La colección está organizada por funcionalidades y incluye ejemplos de requests, validaciones automáticas y casos de prueba.

## 📁 **Archivos de la Colección**

- **`SERVICE_DETAIL_POSTMAN_COLLECTION.json`** - Colección principal de Postman
- **`README_SERVICE_DETAIL_POSTMAN.md`** - Este archivo de instrucciones

## 🚀 **Configuración Inicial**

### **1. Importar la Colección**

1. Abrir Postman
2. Hacer clic en **"Import"**
3. Seleccionar el archivo `SERVICE_DETAIL_POSTMAN_COLLECTION.json`
4. La colección se importará automáticamente

### **2. Configurar Variables de Entorno**

La colección incluye variables predefinidas que debes configurar:

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `base_url` | URL base de la API | `http://localhost:3000` |
| `auth_token` | Token JWT para autenticación | `{{jwt_token}}` |
| `service_client_id` | ID del servicio cliente para pruebas | `1` |
| `detail_id` | ID del detalle de servicio para pruebas | `1` |

### **3. Obtener Token JWT**

Antes de usar la colección, debes obtener un token JWT:

1. Ejecutar el endpoint **"Login para obtener JWT Token"**
2. Copiar el token de la respuesta
3. Configurar la variable `auth_token` con el valor del token

## 📋 **Estructura de la Colección**

### **🔐 Autenticación**
- **Login para obtener JWT Token** - Endpoint de autenticación

### **📋 CRUD Básico - Detalles de Servicio**
- **Crear Detalle de Servicio** - POST con empleado obligatorio
- **Crear Detalle de Producto** - POST sin empleado requerido
- **Obtener Detalle por ID** - GET con datos anidados
- **Actualizar Detalle** - PUT solo si estado es "En ejecución"
- **Cambiar Estado a Pagada** - PATCH desde "En ejecución"
- **Cambiar Estado a Anulada** - PATCH desde cualquier estado válido

### **🔄 Gestión Individual - Servicios y Productos**
- **Agregar Nuevo Servicio al Cliente** - POST para agregar servicios
- **Agregar Nuevo Producto al Cliente** - POST para agregar productos
- **Anular Servicio Específico** - DELETE (anula, NO elimina)
- **Anular Producto Específico** - DELETE (anula, NO elimina)

### **📊 Consultas y Reportes**
- **Obtener Detalles por Servicio Cliente** - GET con datos completos
- **Obtener Detalles Organizados** - GET con resumen y totales
- **Obtener Detalles con Conteo** - GET con estadísticas detalladas
- **Obtener Detalles por Producto** - GET filtrado por producto
- **Obtener Detalles por Servicio** - GET filtrado por servicio
- **Obtener Detalles por Empleado** - GET filtrado por empleado
- **Obtener Detalles por Estado** - GET filtrado por estado

### **🧮 Cálculos y Estadísticas**
- **Calcular Subtotal por Detalle** - GET con cálculo automático
- **Obtener Estadísticas Generales** - GET con resumen del sistema

### **❌ Casos de Error - Validaciones**
- **Crear Detalle sin Cliente** - Debe fallar
- **Crear Detalle sin Producto/Servicio** - Debe fallar
- **Crear Servicio sin Empleado** - Debe fallar
- **Editar Detalle Pagado** - Debe fallar
- **Editar Detalle Anulado** - Debe fallar
- **Anular Último Detalle Activo** - Debe fallar
- **Cambiar Estado Inválido** - Debe fallar

### **📝 Ejemplos de Respuestas**
- **Respuesta Exitosa** - Ejemplo de creación exitosa
- **Respuesta de Error - Validación** - Ejemplo de error de validación
- **Respuesta de Error - Regla de Negocio** - Ejemplo de error de negocio

## 🧪 **Casos de Prueba Recomendados**

### **Flujo Básico de Trabajo**
1. **Autenticarse** - Obtener JWT token
2. **Crear detalle inicial** - Servicio o producto
3. **Agregar más elementos** - Usar endpoints `add-item`
4. **Consultar detalles** - Verificar datos anidados
5. **Cambiar estados** - Probar transiciones válidas
6. **Anular elementos** - Probar anulación (NO eliminación)

### **Validaciones de Reglas de Negocio**
1. **Estado "En ejecución"** - Todas las operaciones permitidas
2. **Estado "Pagada"** - Solo lectura y anulación
3. **Estado "Anulada"** - Solo lectura
4. **Transiciones de estado** - Probar cambios válidos e inválidos

### **Casos de Error**
1. **Validaciones de entrada** - Campos obligatorios
2. **Reglas de negocio** - Estados y operaciones
3. **Integridad de datos** - Último detalle activo

## ⚙️ **Configuración de Tests Automáticos**

La colección incluye tests automáticos que se ejecutan después de cada request:

### **Tests de Respuesta**
- ✅ **Código de estado válido** (200, 201, 400, 404, 500)
- ✅ **Campos requeridos presentes** (success, message)
- ✅ **Tiempo de respuesta** (menos de 2000ms)

### **Tests Personalizados**
Puedes agregar tests específicos para cada endpoint según tus necesidades.

## 🔧 **Personalización**

### **Modificar Variables**
- Cambiar `base_url` para diferentes entornos (desarrollo, staging, producción)
- Actualizar `service_client_id` y `detail_id` según tus datos de prueba

### **Agregar Nuevos Endpoints**
- Copiar un request existente
- Modificar método, URL y body según el nuevo endpoint
- Agregar tests específicos si es necesario

### **Modificar Tests**
- Editar los scripts de test en la pestaña "Tests"
- Agregar validaciones específicas del negocio
- Personalizar mensajes de error

## 📊 **Monitoreo y Debugging**

### **Console Logs**
- Los scripts de pre-request incluyen logs en la consola
- Útil para debugging de variables y configuración

### **Response Validation**
- Tests automáticos validan estructura de respuestas
- Fácil identificación de problemas en la API

### **Performance Monitoring**
- Tests de tiempo de respuesta
- Identificación de endpoints lentos

## 🚨 **Consideraciones Importantes**

### **Autenticación**
- **Siempre** incluir el header `Authorization: Bearer {{auth_token}}`
- El token JWT expira, renovar cuando sea necesario
- Usar credenciales válidas del sistema

### **Integridad de Datos**
- **NO se eliminan registros** - solo se anulan
- Mantener al menos un detalle activo por cliente
- Respetar las reglas de negocio por estado

### **Validaciones**
- Todos los endpoints incluyen validaciones
- Los errores devuelven mensajes descriptivos
- Usar los casos de error para probar validaciones

## 📞 **Soporte**

### **Documentación Relacionada**
- **`GUIA_DETALLES_SERVICIO.md`** - Documentación completa de la API
- **`datos-prueba-service-detail.js`** - Datos de prueba y ejemplos

### **Problemas Comunes**
1. **Error 401** - Token JWT expirado o inválido
2. **Error 400** - Validación fallida, revisar body del request
3. **Error 404** - Recurso no encontrado, verificar IDs
4. **Error 500** - Error interno del servidor, revisar logs

## 🎉 **¡Listo para Probar!**

Con esta colección podrás:
- ✅ **Probar todos los endpoints** del módulo ServiceDetail
- ✅ **Validar reglas de negocio** y validaciones
- ✅ **Simular casos de uso reales** del sistema
- ✅ **Detectar problemas** de forma temprana
- ✅ **Documentar comportamiento** de la API

---

*Colección creada para el sistema CAPEX - Módulo ServiceDetail API*
