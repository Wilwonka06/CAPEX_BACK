# 📋 GUÍA COMPLETA DEL MÓDULO DETALLES DE SERVICIO CLIENTE

## 🎯 **Descripción General**
El módulo `ServiceDetail` (detalles de servicio cliente) permite gestionar los productos y servicios asociados a cada cita o servicio cliente. Cada detalle puede contener un producto, un servicio, o ambos, y mantiene un estado que controla las operaciones permitidas.

## 🏗️ **Estructura de la Base de Datos**

### Tabla: `detalle_servicio_cliente`
```sql
CREATE TABLE detalle_servicio_cliente (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_servicio_cliente INT NOT NULL,
  id_producto INT NULL,
  id_servicio INT NULL,
  id_empleado INT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('En ejecución', 'Pagada', 'Anulada')) DEFAULT 'En ejecución',
  FOREIGN KEY (id_servicio_cliente) REFERENCES servicios_clientes(id_servicio_cliente),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
  FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio),
  FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);
```

## 🔐 **Reglas de Negocio por Estado**

### 📊 **Matriz de Operaciones Permitidas**

| Estado | ✅ Leer | ✅ Editar | ✅ Eliminar | ✅ Anular |
|--------|---------|-----------|-------------|-----------|
| **"En ejecución"** | ✅ | ✅ | ✅ | ✅ |
| **"Pagada"** | ✅ | ❌ | ❌ | ✅ |
| **"Anulada"** | ✅ | ❌ | ❌ | ❌ |

### 📝 **Detalle de Reglas**

#### 🟢 **Estado: "En ejecución"**
- **Operaciones permitidas**: Todas las operaciones
- **Descripción**: Estado inicial y más flexible
- **Uso**: Para detalles recién creados o en proceso

#### 🟡 **Estado: "Pagada"**
- **Operaciones permitidas**: Solo lectura y anulación
- **Operaciones bloqueadas**: Edición y eliminación
- **Mensaje de error**: *"No se puede editar un detalle de servicio que ya está pagado. Solo se permite anular."*
- **Uso**: Para detalles que ya han sido pagados por el cliente

#### 🔴 **Estado: "Anulada"**
- **Operaciones permitidas**: Solo lectura
- **Operaciones bloqueadas**: Edición, eliminación y cambio de estado
- **Mensaje de error**: *"No se puede editar un detalle de servicio anulado."*
- **Uso**: Para detalles que han sido cancelados o anulados

### 🔄 **Transiciones de Estado Permitidas**

```
"En ejecución" → "Pagada" ✅
"En ejecución" → "Anulada" ✅
"Pagada" → "Anulada" ✅
"Pagada" → "En ejecución" ❌
"Anulada" → "En ejecución" ❌
"Anulada" → "Pagada" ❌
"Anulada" → "Anulada" ❌
```

## 🚀 **Endpoints de la API**

### **1. Crear Detalle de Servicio**
```http
POST /api/detalles-servicio
```

**Criterios de Aceptación:**
- ✅ Debe haber cliente asociado (`serviceClientId`)
- ✅ Debe haber al menos un producto (`productId`) o servicio (`serviceId`)
- ✅ `empleadoId` es obligatorio SOLO cuando hay servicio
- ✅ Se asigna automáticamente estado "En ejecución"
- ✅ Se calcula automáticamente el subtotal

**Ejemplo de Request:**
```json
{
  "serviceClientId": 1,
  "productId": 1,
  "quantity": 2,
  "unitPrice": 45.00
}
```

**Ejemplo de Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "serviceClientId": 1,
    "productId": 1,
    "serviceId": null,
    "empleadoId": null,
    "quantity": 2,
    "unitPrice": "45.00",
    "subtotal": "90.00",
    "status": "En ejecución",
    "producto": {
      "id": 1,
      "nombre": "Shampoo Profesional",
      "precio": "45.00",
      "descripcion": "Shampoo para todo tipo de cabello"
    },
    "servicio": null,
    "empleado": null
  },
  "message": "Orden de servicio creada exitosamente"
}
```

### **2. Obtener Detalle por ID**
```http
GET /api/detalles-servicio/:id
```

**Operación**: ✅ Siempre permitida (leer)

### **3. Actualizar Detalle**
```http
PUT /api/detalles-servicio/:id
```

**Restricciones por Estado:**
- ✅ **"En ejecución"**: Permitida
- ❌ **"Pagada"**: Bloqueada con mensaje específico
- ❌ **"Anulada"**: Bloqueada con mensaje específico

**Ejemplo de Error (Estado "Pagada"):**
```json
{
  "success": false,
  "message": "No se puede editar un detalle de servicio que ya está pagado. Solo se permite anular."
}
```

### **4. Eliminar Detalle**
```http
DELETE /api/detalles-servicio/:id
```

**Restricciones por Estado:**
- ✅ **"En ejecución"**: Permitida
- ❌ **"Pagada"**: Bloqueada con mensaje específico
- ❌ **"Anulada"**: Bloqueada con mensaje específico

### **5. Cambiar Estado**
```http
PATCH /api/detalles-servicio/:id/status
```

**Restricciones de Transición:**
- ✅ **"En ejecución" → "Pagada"**
- ✅ **"En ejecución" → "Anulada"**
- ✅ **"Pagada" → "Anulada"**
- ❌ **"Pagada" → "En ejecución"** (bloqueado)
- ❌ **"Anulada" → "En ejecución"** (bloqueado)
- ❌ **"Anulada" → "Pagada"** (bloqueado)

**Ejemplo de Request:**
```json
{
  "estado": "Pagada"
}
```

**Ejemplo de Error (Transición inválida):**
```json
{
  "success": false,
  "message": "No se puede cambiar el estado a \"En ejecución\" desde \"Pagada\""
}
```

### **6. Obtener Detalles Organizados**
```http
GET /api/detalles-servicio/service-client/:serviceClientId/organized
```

**Operación**: ✅ Siempre permitida (leer)

**Response Organizado:**
```json
{
  "success": true,
  "data": {
    "serviceClientId": 1,
    "resumen": {
      "totalDetalles": 4,
      "totalServicios": 2,
      "totalProductos": 2,
      "subtotalServicios": "155.00",
      "subtotalProductos": "166.00",
      "totalGeneral": "321.00"
    },
    "servicios": [...],
    "productos": [...]
  },
  "message": "Detalles organizados obtenidos exitosamente"
}
```

### **7. Anular Servicio o Producto Específico del Detalle**
```http
DELETE /api/detalles-servicio/:id/remove-item
```

**Operación**: ✅ Permitida si estado es "En ejecución" o "Pagada"

**Request Body:**
```json
{
  "serviceId": 1
}
```
o
```json
{
  "productId": 2
}
```

**Restricciones:**
- ✅ **"En ejecución"**: Permitida
- ✅ **"Pagada"**: Permitida
- ❌ **"Anulada"**: Bloqueada (ya está anulado)
- ❌ **No se puede anular el último detalle activo** del cliente

**Ejemplo de Response:**
```json
{
  "success": true,
  "message": "Servicio/Producto anulado exitosamente del detalle (mantenido para integridad de ventas)"
}
```

**Ejemplo de Error (Ya anulado):**
```json
{
  "success": false,
  "message": "El detalle de servicio ya está anulado"
}
```

**Ejemplo de Error (Último detalle activo):**
```json
{
  "success": false,
  "message": "No se puede anular el último servicio/producto del cliente. Debe mantener al menos un detalle activo."
}
```

## 🗑️ **Gestión de Servicios y Productos Individuales**

### **Concepto:**
Cada `detalle_servicio_cliente` puede contener múltiples servicios y productos individuales. Cada uno se gestiona de forma independiente, permitiendo:

- ✅ **Anular servicios/productos específicos** del detalle (NO ELIMINAR)
- ✅ **Agregar nuevos servicios/productos** al detalle existente
- ✅ **Mantener múltiples detalles** por cliente
- ✅ **Gestionar cada detalle individualmente**
- 🔒 **Mantener integridad de ventas** - los registros nunca se eliminan

### **Flujo de Trabajo:**
1. **Crear detalle inicial** con un servicio o producto
2. **Agregar más servicios/productos** usando el endpoint `add-item`
3. **Anular servicios/productos específicos** usando el endpoint `remove-item`
4. **Mantener al menos un detalle activo** por cliente

### **Ejemplo de Uso:**
```javascript
// 1. Crear detalle inicial
POST /api/detalles-servicio
{
  "serviceClientId": 1,
  "serviceId": 1,
  "empleadoId": 1,
  "quantity": 1,
  "unitPrice": 35.00
}

// 2. Agregar producto al mismo cliente
POST /api/detalles-servicio/service-client/1/add-item
{
  "productId": 1,
  "quantity": 2,
  "unitPrice": 45.00
}

// 3. Agregar otro servicio
POST /api/detalles-servicio/service-client/1/add-item
{
  "serviceId": 5,
  "empleadoId": 5,
  "quantity": 1,
  "unitPrice": 80.00
}

// 4. ANULAR el primer servicio (NO ELIMINAR)
DELETE /api/detalles-servicio/1/remove-item
{
  "serviceId": 1
}
```

### **Restricciones de Anulación:**
- ❌ **No se puede anular el último detalle activo** del cliente
- ❌ **No se puede anular si ya está anulado**
- ✅ **Se puede anular si el estado es "En ejecución" o "Pagada"**
- 🔒 **Los registros se mantienen** para integridad de ventas

### **Ventajas del Sistema:**
- 🔄 **Flexibilidad**: Agregar/quitar servicios según necesidades del cliente
- 📊 **Control granular**: Cada servicio/producto se gestiona independientemente
- 💰 **Precios individuales**: Cada detalle puede tener su propio precio
- 👥 **Empleados específicos**: Cada servicio puede tener un empleado diferente
- 📈 **Escalabilidad**: Agregar tantos servicios/productos como sea necesario
- 🛡️ **Integridad de datos**: Los registros nunca se eliminan, solo se anulan
- 📋 **Auditoría completa**: Historial completo de todas las transacciones
- 💼 **Cumplimiento contable**: Cumple con estándares de facturación

## 🔍 **Validaciones Implementadas**

### **Validaciones de Creación:**
- ✅ Cliente asociado obligatorio
- ✅ Al menos un producto o servicio
- ✅ Empleado obligatorio solo para servicios
- ✅ Cantidad y precio unitario válidos

### **Validaciones de Estado:**
- ✅ Solo estados válidos: "En ejecución", "Pagada", "Anulada"
- ✅ Transiciones de estado controladas
- ✅ Operaciones bloqueadas según estado actual

### **Validaciones de Negocio:**
- ✅ No editar detalles pagados (solo anular)
- ✅ No editar detalles anulados
- ✅ No eliminar detalles pagados o anulados
- ✅ No cambiar estado de anulados

## 📊 **Estados y Flujo de Trabajo**

### **Flujo Típico:**
1. **Crear** → Estado: "En ejecución"
2. **Editar** → Solo si está "En ejecución"
3. **Marcar como Pagada** → Estado: "Pagada"
4. **Anular** → Estado: "Anulada" (desde cualquier estado excepto ya anulado)

### **Casos de Uso:**
- **Cliente solicita cambios**: Solo si está "En ejecución"
- **Cliente paga**: Cambiar a "Pagada" (bloquea ediciones)
- **Cliente cancela**: Cambiar a "Anulada" (bloquea todo)
- **Error en facturación**: Anular desde "Pagada"

## 🚨 **Mensajes de Error Comunes**

### **Errores de Estado:**
```json
{
  "success": false,
  "message": "No se puede editar un detalle de servicio que ya está pagado. Solo se permite anular."
}
```

```json
{
  "success": false,
  "message": "No se puede cambiar el estado a \"En ejecución\" desde \"Pagada\""
}
```

```json
{
  "success": false,
  "message": "El detalle de servicio ya está anulado"
}
```

### **Errores de Validación:**
```json
{
  "success": false,
  "message": "Debe especificar al menos un producto o servicio"
}
```

```json
{
  "success": false,
  "message": "El empleado es obligatorio cuando se especifica un servicio"
}
```

## 🔧 **Configuración y Dependencias**

### **Asociaciones de Base de Datos:**
- `ServiceDetail` → `Service` (servicios)
- `ServiceDetail` → `Product` (productos)
- `ServiceDetail` → `Employee` (empleados)
- `ServiceDetail` → `ServiceClient` (servicios cliente)

### **Middleware Requerido:**
- `AuthMiddleware.verifyToken` - Autenticación JWT
- `ServiceDetailValidationMiddleware` - Validaciones específicas

### **Hooks Automáticos:**
- Cálculo automático de subtotal
- Asignación automática de estado por defecto

## 📝 **Notas de Implementación**

### **Seguridad:**
- Todas las operaciones requieren autenticación JWT
- Validaciones de estado en capa de servicio
- Mensajes de error descriptivos para el usuario

### **Performance:**
- Respuestas incluyen datos anidados en una sola consulta
- Índices en campos de búsqueda frecuente
- Paginación disponible para listas grandes

### **Mantenibilidad:**
- Reglas de negocio centralizadas en el servicio
- Validaciones consistentes en middleware
- Mensajes de error estandarizados

---

## 🎉 **Resumen de Características**

✅ **Gestión completa de estados** con reglas de negocio  
✅ **Validaciones robustas** por estado y operación  
✅ **Respuestas anidadas** con datos completos  
✅ **Respuestas organizadas** por servicios y productos  
✅ **Control de transiciones** de estado  
✅ **Mensajes de error descriptivos**  
✅ **Autenticación JWT** en todos los endpoints  
✅ **Hooks automáticos** para cálculos y asignaciones  
✅ **Gestión granular** de servicios y productos individuales  
✅ **Eliminación y adición** de elementos del detalle  

---

*Documentación actualizada para incluir la gestión de servicios y productos individuales del módulo ServiceDetail.*
