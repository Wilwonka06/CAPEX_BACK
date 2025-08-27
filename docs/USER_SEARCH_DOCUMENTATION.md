# Documentación de Búsqueda Avanzada de Usuarios

## Descripción General

El módulo de usuarios ahora incluye una funcionalidad de búsqueda avanzada que permite buscar por todos los campos disponibles, tanto de forma general como específica por campo.

## Campos Disponibles para Búsqueda

### Campos Principales
- **id_usuario**: ID único del usuario (búsqueda exacta)
- **nombre**: Nombre completo del usuario
- **correo**: Dirección de correo electrónico
- **documento**: Número de documento de identidad
- **telefono**: Número de teléfono
- **tipo_documento**: Tipo de documento (Pasaporte, Cédula de ciudadanía, Cédula de extranjería)
- **roleId**: ID del rol asignado

## Endpoints Disponibles

### 1. Búsqueda General
```
GET /api/users
```

**Parámetros de consulta:**
- `search`: Búsqueda general en todos los campos
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `roleId`: Filtrar por ID de rol específico
- `tipo_documento`: Filtrar por tipo de documento
- `nombre`: Búsqueda específica por nombre
- `correo`: Búsqueda específica por correo
- `documento`: Búsqueda específica por documento
- `telefono`: Búsqueda específica por teléfono

**Ejemplo:**
```
GET /api/users?search=juan&page=1&limit=5
```

### 2. Búsqueda Avanzada
```
GET /api/users/search
```

**Parámetros de consulta:**
- `search`: Búsqueda general en todos los campos
- `nombre`: Búsqueda específica por nombre
- `correo`: Búsqueda específica por correo
- `documento`: Búsqueda específica por documento
- `telefono`: Búsqueda específica por teléfono
- `tipo_documento`: Filtrar por tipo de documento
- `roleId`: Filtrar por ID de rol
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

### 3. Obtener Usuario por ID
```
GET /api/users/:id
```

**Nota:** Los endpoints específicos para buscar por email y documento han sido eliminados ya que la funcionalidad de búsqueda avanzada incluye estas capacidades.

## Ejemplos de Uso

### Búsqueda General

#### Buscar por nombre
```
GET /api/users?search=Juan
```
**Resultado:** Busca "Juan" en todos los campos (nombre, correo, documento, teléfono, etc.)

#### Buscar por correo
```
GET /api/users?search=juan@empresa.com
```
**Resultado:** Encuentra usuarios con ese correo o que contengan "juan@empresa.com" en cualquier campo

#### Buscar por documento
```
GET /api/users?search=12345678
```
**Resultado:** Busca usuarios con ese número de documento o que contengan "12345678" en cualquier campo

#### Buscar por teléfono
```
GET /api/users?search=+573001234567
```
**Resultado:** Busca usuarios con ese teléfono o que contengan el número en cualquier campo

#### Buscar por ID de usuario
```
GET /api/users?search=5
```
**Resultado:** Busca el usuario con ID 5 o que contenga "5" en cualquier campo

### Búsqueda Avanzada

#### Búsqueda específica por nombre
```
GET /api/users/search?nombre=Juan
```
**Resultado:** Solo busca en el campo nombre

#### Búsqueda específica por correo
```
GET /api/users/search?correo=juan@empresa.com
```
**Resultado:** Solo busca en el campo correo

#### Búsqueda combinada
```
GET /api/users/search?nombre=Juan&tipo_documento=Cedula de ciudadania&roleId=1
```
**Resultado:** Busca usuarios llamados "Juan", con cédula de ciudadanía y rol ID 1

#### Búsqueda con paginación
```
GET /api/users/search?search=juan&page=2&limit=5
```
**Resultado:** Busca "juan" en todos los campos, página 2, 5 resultados por página

## Respuesta de la API

### Estructura de Respuesta
```json
{
  "success": true,
  "message": "Búsqueda de usuarios completada exitosamente",
  "data": [
    {
      "id_usuario": 1,
      "nombre": "Juan Pérez",
      "correo": "juan.perez@empresa.com",
      "documento": "12345678",
      "telefono": "+573001234567",
      "tipo_documento": "Cedula de ciudadania",
      "roleId": 1,
      "rol": {
        "id_rol": 1,
        "nombre": "Administrador",
        "descripcion": "Rol con acceso completo al sistema"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "search": "juan",
    "page": 1,
    "limit": 10
  },
  "searchInfo": {
    "totalResults": 25,
    "searchTerm": "juan",
    "appliedFilters": ["search"]
  },
  "timestamp": "2025-08-26T23:15:30.123Z"
}
```

### Campos de la Respuesta

#### `data`
Array de usuarios encontrados con información del rol incluida

#### `pagination`
Información de paginación:
- `page`: Página actual
- `limit`: Elementos por página
- `total`: Total de resultados
- `totalPages`: Total de páginas
- `hasNext`: Si hay página siguiente
- `hasPrev`: Si hay página anterior

#### `filters`
Filtros aplicados en la búsqueda

#### `searchInfo`
Información adicional de la búsqueda:
- `totalResults`: Total de resultados encontrados
- `searchTerm`: Término de búsqueda utilizado
- `appliedFilters`: Filtros específicos aplicados

## Características de la Búsqueda

### 1. Búsqueda Insensible a Mayúsculas
La búsqueda no distingue entre mayúsculas y minúsculas.

### 2. Búsqueda Parcial
Utiliza `LIKE` con `%` para búsquedas parciales.

### 3. Búsqueda en Múltiples Campos
El parámetro `search` busca en todos los campos disponibles.

### 4. Filtros Combinados
Puedes combinar múltiples filtros para búsquedas más específicas.

### 5. Información del Rol
Incluye automáticamente la información del rol asociado a cada usuario.

### 6. Paginación
Soporte completo para paginación con metadatos.

### 7. Mensajes Específicos para Resultados Vacíos
Cuando no se encuentran usuarios que coincidan con los criterios de búsqueda, la API devuelve mensajes específicos que indican exactamente qué filtros se aplicaron.

#### Ejemplos de Mensajes:
- **Búsqueda general:** `"No se encontraron usuarios que coincidan con los criterios de búsqueda: "Juan"."`
- **Filtros específicos:** `"No se encontraron usuarios que coincidan con los filtros aplicados: nombre "Juan", tipo de documento "Pasaporte"."`
- **Sin usuarios:** `"No hay usuarios registrados en el sistema."`

## Casos de Uso Comunes

### 1. Búsqueda de Usuario por Nombre
```
GET /api/users?search=María
```

### 2. Búsqueda de Usuario por Correo
```
GET /api/users?search=maria@empresa.com
```

### 3. Búsqueda de Usuarios por Rol
```
GET /api/users?roleId=2
```

### 4. Búsqueda de Usuarios por Tipo de Documento
```
GET /api/users?tipo_documento=Pasaporte
```

### 5. Búsqueda Combinada
```
GET /api/users/search?nombre=Juan&tipo_documento=Cedula de ciudadania&roleId=1
```

### 6. Búsqueda con Paginación
```
GET /api/users?search=admin&page=1&limit=20
```

## Mejoras Implementadas

### 1. Búsqueda en Todos los Campos
- ✅ Búsqueda en `id_usuario`, `nombre`, `correo`, `documento`, `telefono`, `tipo_documento`
- ✅ Búsqueda inteligente por ID (solo si es número)

### 2. Filtros Específicos
- ✅ Búsqueda por campo específico
- ✅ Combinación de múltiples filtros
- ✅ Filtros por rol y tipo de documento

### 3. Información Enriquecida
- ✅ Inclusión automática de información del rol
- ✅ Metadatos de búsqueda
- ✅ Información de filtros aplicados

### 4. Paginación Mejorada
- ✅ Metadatos completos de paginación
- ✅ Navegación fácil entre páginas

### 5. Optimización de Endpoints
- ✅ Eliminación de endpoints redundantes (email y documento específicos)
- ✅ Consolidación de funcionalidad en endpoints principales
- ✅ Reducción de duplicación de código

## Próximas Mejoras

1. **Búsqueda por Fecha**: Agregar filtros por fecha de creación
2. **Ordenamiento**: Permitir ordenar por diferentes campos
3. **Búsqueda Fuzzy**: Implementar búsqueda con tolerancia a errores
4. **Filtros Avanzados**: Agregar filtros por rango de fechas, estados, etc.
5. **Exportación**: Permitir exportar resultados de búsqueda
