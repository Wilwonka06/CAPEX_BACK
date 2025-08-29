# Documentación de la API de Categorías de Servicios

## Descripción
Esta API maneja la gestión de categorías de servicios, permitiendo crear, consultar, actualizar y eliminar categorías.

## Endpoints

### 1. Crear Categoría
**POST** `/api/service-categories`

Crea una nueva categoría de servicio.

**Body:**
```json
{
  "nombre": "Limpieza",
  "descripcion": "Servicios de limpieza y aseo",
  "estado": "Activo"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id_categoria_servicio": 1,
    "nombre": "Limpieza",
    "descripcion": "Servicios de limpieza y aseo",
    "estado": "Activo"
  },
  "message": "Categoría creada correctamente"
}
```

### 2. Obtener Todas las Categorías
**GET** `/api/service-categories`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id_categoria_servicio": 1,
      "nombre": "Limpieza",
      "descripcion": "Servicios de limpieza y aseo",
      "estado": "Activo"
    }
  ],
  "count": 1
}
```

### 3. Obtener Categorías Activas
**GET** `/api/service-categories/active`

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 3
}
```

### 4. Obtener Categorías por Estado
**GET** `/api/service-categories/status/:status`

**Ejemplo:** `/api/service-categories/status/Activo`

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 2
}
```

### 5. Buscar Categorías
**GET** `/api/service-categories/search?q=Limpieza`

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 1
}
```

### 6. Obtener Categoría por ID
**GET** `/api/service-categories/:id`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id_categoria_servicio": 1,
    "nombre": "Limpieza",
    "descripcion": "Servicios de limpieza y aseo",
    "estado": "Activo"
  }
}
```

### 7. Actualizar Categoría
**PUT** `/api/service-categories/:id`

**Body:** (campos opcionales)
```json
{
  "nombre": "LimpiezaGeneral",
  "descripcion": "Servicios de limpieza general y mantenimiento",
  "estado": "Inactivo"
}
```

### 8. Cambiar Estado de Categoría
**PATCH** `/api/service-categories/:id/status`

**Body:**
```json
{
  "estado": "Inactivo"
}
```

### 9. Eliminar Categoría
**DELETE** `/api/service-categories/:id`

**Respuesta:**
```json
{
  "success": true,
  "message": "Categoría eliminada correctamente"
}
```

## Validaciones

### Campos Obligatorios para Creación
- `nombre`: Solo letras (incluyendo acentos), máximo 20 caracteres, único
- `descripcion`: Opcional, máximo 100 caracteres
- `estado`: Opcional, "Activo" o "Inactivo" (por defecto "Activo")

### Estados Válidos
- "Activo"
- "Inactivo"

## Ejemplos de Uso

### Crear categoría
```bash
curl -X POST http://localhost:3000/api/service-categories \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mantenimiento",
    "descripcion": "Servicios de mantenimiento y reparación",
    "estado": "Activo"
  }'
```

### Buscar categorías
```bash
curl -X GET "http://localhost:3000/api/service-categories/search?q=Mantenimiento"
```

### Cambiar estado
```bash
curl -X PATCH http://localhost:3000/api/service-categories/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "Inactivo"
  }'
```

## JSONs para Probar

### 1. Crear Categoría Básica
```json
{
  "nombre": "Limpieza",
  "estado": "Activo"
}
```

### 2. Crear Categoría Completa
```json
{
  "nombre": "Mantenimiento",
  "descripcion": "Servicios de mantenimiento y reparación de equipos",
  "estado": "Activo"
}
```

### 3. Crear Categoría con Acentos
```json
{
  "nombre": "Construcción",
  "descripcion": "Servicios de construcción y remodelación",
  "estado": "Activo"
}
```

### 4. Actualizar Categoría
```json
{
  "nombre": "LimpiezaEspecializada",
  "descripcion": "Servicios de limpieza especializada para oficinas"
}
```

### 5. Cambiar Estado
```json
{
  "estado": "Inactivo"
}
```

## Notas Importantes

1. **Nombre único**: No pueden existir dos categorías con el mismo nombre
2. **Validación de caracteres**: El nombre solo acepta letras (incluyendo acentos)
3. **Longitudes**: Nombre máximo 20 caracteres, descripción máximo 100 caracteres
4. **Estados**: Solo "Activo" e "Inactivo" son válidos
5. **Búsqueda**: Busca tanto en nombre como en descripción
