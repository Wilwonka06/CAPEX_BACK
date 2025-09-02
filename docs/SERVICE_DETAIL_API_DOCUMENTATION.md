# API de Detalles de Servicio Cliente

## Descripción
Este módulo maneja los detalles de servicios para clientes, permitiendo gestionar productos y servicios asociados a un servicio cliente específico.

## Estructura de la Base de Datos

### Tabla: `detalle_servicio_cliente`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_detalle` | INT | Clave primaria, autoincremental |
| `id_servicio_cliente` | INT | Referencia a servicios_clientes (NOT NULL) |
| `id_producto` | INT | Referencia a productos (NULL) |
| `id_servicio` | INT | Referencia a servicios (NULL) |
| `cantidad` | INT | Cantidad del producto/servicio (default: 1) |
| `precio_unitario` | DECIMAL(10,2) | Precio por unidad (NOT NULL) |
| `subtotal` | DECIMAL(10,2) | Precio total (NOT NULL) |
| `estado` | VARCHAR(20) | Estado: 'En ejecución', 'Pagada', 'Anulada' |

## Endpoints

### Base URL
```
/api/detalles-servicio
```

### 1. Obtener todos los detalles de servicios

**GET** `/api/detalles-servicio`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "serviceClientId": 1,
      "productId": 5,
      "serviceId": null,
      "quantity": 2,
      "unitPrice": 150.00,
      "subtotal": 300.00,
      "status": "En ejecución"
    }
  ],
  "message": "Detalles de servicios obtenidos exitosamente"
}
```

### 2. Obtener detalle por ID

**GET** `/api/detalles-servicio/:id`

**Parámetros:**
- `id` (number): ID del detalle de servicio

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "serviceClientId": 1,
    "productId": 5,
    "serviceId": null,
    "quantity": 2,
    "unitPrice": 150.00,
    "subtotal": 300.00,
    "status": "En ejecución"
  },
  "message": "Detalle de servicio obtenido exitosamente"
}
```

### 3. Crear nuevo detalle de servicio

**POST** `/api/detalles-servicio`

**Body:**
```json
{
  "serviceClientId": 1,
  "productId": 5,
  "serviceId": null,
  "quantity": 2,
  "unitPrice": 150.00,
  "status": "En ejecución"
}
```

**Campos requeridos:**
- `serviceClientId` (number): ID del servicio cliente
- `quantity` (number): Cantidad (mínimo 1)
- `unitPrice` (number): Precio unitario (mínimo 0)

**Campos opcionales:**
- `productId` (number): ID del producto
- `serviceId` (number): ID del servicio
- `subtotal` (number): Subtotal calculado automáticamente
- `status` (string): Estado ('En ejecución', 'Pagada', 'Anulada')

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "serviceClientId": 1,
    "productId": 5,
    "serviceId": null,
    "quantity": 2,
    "unitPrice": 150.00,
    "subtotal": 300.00,
    "status": "En ejecución"
  },
  "message": "Detalle de servicio creado exitosamente"
}
```

### 4. Actualizar detalle de servicio

**PUT** `/api/detalles-servicio/:id`

**Parámetros:**
- `id` (number): ID del detalle de servicio

**Body:** (todos los campos son opcionales)
```json
{
  "quantity": 3,
  "unitPrice": 160.00,
  "status": "Pagada"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "serviceClientId": 1,
    "productId": 5,
    "serviceId": null,
    "quantity": 3,
    "unitPrice": 160.00,
    "subtotal": 480.00,
    "status": "Pagada"
  },
  "message": "Detalle de servicio actualizado exitosamente"
}
```

### 5. Eliminar detalle de servicio

**DELETE** `/api/detalles-servicio/:id`

**Parámetros:**
- `id` (number): ID del detalle de servicio

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Detalle de servicio eliminado exitosamente"
}
```

### 6. Cambiar estado del detalle

**PATCH** `/api/detalles-servicio/:id/status`

**Parámetros:**
- `id` (number): ID del detalle de servicio

**Body:**
```json
{
  "estado": "Pagada"
}
```

**Estados válidos:**
- `"En ejecución"`
- `"Pagada"`
- `"Anulada"`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "Pagada"
  },
  "message": "Estado del detalle de servicio actualizado exitosamente"
}
```

### 7. Obtener detalles por servicio cliente

**GET** `/api/detalles-servicio/service-client/:serviceClientId`

**Parámetros:**
- `serviceClientId` (number): ID del servicio cliente

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "serviceClientId": 1,
      "productId": 5,
      "quantity": 2,
      "unitPrice": 150.00,
      "subtotal": 300.00,
      "status": "En ejecución"
    }
  ],
  "message": "Detalles de servicio cliente obtenidos exitosamente"
}
```

### 8. Obtener detalles por producto

**GET** `/api/detalles-servicio/product/:productId`

**Parámetros:**
- `productId` (number): ID del producto

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "serviceClientId": 1,
      "productId": 5,
      "quantity": 2,
      "unitPrice": 150.00,
      "subtotal": 300.00,
      "status": "En ejecución"
    }
  ],
  "message": "Detalles por producto obtenidos exitosamente"
}
```

### 9. Obtener detalles por servicio

**GET** `/api/detalles-servicio/service/:serviceId`

**Parámetros:**
- `serviceId` (number): ID del servicio

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "serviceClientId": 1,
      "serviceId": 3,
      "quantity": 1,
      "unitPrice": 200.00,
      "subtotal": 200.00,
      "status": "En ejecución"
    }
  ],
  "message": "Detalles por servicio obtenidos exitosamente"
}
```

### 10. Obtener detalles por estado

**GET** `/api/detalles-servicio/status/:status`

**Parámetros:**
- `status` (string): Estado a filtrar

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "serviceClientId": 1,
      "productId": 5,
      "quantity": 2,
      "unitPrice": 150.00,
      "subtotal": 300.00,
      "status": "En ejecución"
    }
  ],
  "message": "Detalles por estado obtenidos exitosamente"
}
```

### 11. Calcular subtotal

**GET** `/api/detalles-servicio/:id/subtotal`

**Parámetros:**
- `id` (number): ID del detalle de servicio

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "unitPrice": 150.00,
    "quantity": 2,
    "subtotal": 300.00
  },
  "message": "Subtotal calculado exitosamente"
}
```

### 12. Obtener estadísticas

**GET** `/api/detalles-servicio/statistics/overview`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "totalDetails": 50,
    "enEjecucion": 20,
    "pagadas": 25,
    "anuladas": 5,
    "totalVentas": "15000.00"
  },
  "message": "Estadísticas obtenidas exitosamente"
}
```

## Códigos de Error

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Datos de validación incorrectos",
  "errors": [
    {
      "field": "quantity",
      "message": "La cantidad debe ser un número entero positivo"
    }
  ]
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Detalle de servicio no encontrado"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": "Error description"
}
```

## Características Especiales

### Cálculo Automático de Subtotal
- El subtotal se calcula automáticamente como `unitPrice * quantity`
- Se recalcula automáticamente cuando se actualizan precio o cantidad

### Validaciones
- Cantidad mínima: 1
- Precio unitario mínimo: 0
- Estados válidos: 'En ejecución', 'Pagada', 'Anulada'
- IDs deben ser números enteros positivos

### Autenticación
- Todos los endpoints requieren autenticación
- Se debe incluir el token JWT en el header `Authorization`

## Ejemplos de Uso

### Crear un detalle con producto
```bash
curl -X POST /api/detalles-servicio \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceClientId": 1,
    "productId": 5,
    "quantity": 2,
    "unitPrice": 150.00
  }'
```

### Crear un detalle con servicio
```bash
curl -X POST /api/detalles-servicio \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceClientId": 1,
    "serviceId": 3,
    "quantity": 1,
    "unitPrice": 200.00
  }'
```

### Cambiar estado a pagado
```bash
curl -X PATCH /api/detalles-servicio/1/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "Pagada"
  }'
```
