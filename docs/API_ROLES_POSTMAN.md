# API de Roles - Documentación para Postman

## Configuración Base

**Base URL:** `http://localhost:3000`

**Headers:**
```
Content-Type: application/json
```

## Endpoints Disponibles

### 1. Obtener Todos los Roles

**GET** `/api/roles`

**Descripción:** Obtiene todos los roles con sus permisos y privilegios asociados.

**URL:** `http://localhost:3000/api/roles`

**Headers:**
```
Content-Type: application/json
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Roles obtenidos exitosamente",
  "data": [
    {
      "id_rol": 1,
      "nombre": "Administrador",
      "descripcion": null,
      "permisos": [
        {
          "id_permiso": 1,
          "nombre": "Compras",
          "privilegios": [
            {
              "id_privilegio": 1,
              "nombre": "Create"
            },
            {
              "id_privilegio": 2,
              "nombre": "Read"
            },
            {
              "id_privilegio": 3,
              "nombre": "Edit"
            },
            {
              "id_privilegio": 4,
              "nombre": "Delete"
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 2. Obtener Rol por ID

**GET** `/api/roles/:id`

**Descripción:** Obtiene un rol específico por su ID.

**URL:** `http://localhost:3000/api/roles/1`

**Parámetros de URL:**
- `id` (number): ID del rol

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Rol obtenido exitosamente",
  "data": {
    "id_rol": 1,
    "nombre": "Administrador",
    "descripcion": null,
    "permisos": [
      {
        "id_permiso": 1,
        "nombre": "Compras",
        "privilegios": [
          {
            "id_privilegio": 1,
            "nombre": "Create"
          },
          {
            "id_privilegio": 2,
            "nombre": "Read"
          }
        ]
      }
    ]
  }
}
```

**Respuesta de Error (404):**
```json
{
  "success": false,
  "message": "Rol no encontrado"
}
```

---

### 3. Crear Nuevo Rol

**POST** `/api/roles`

**Descripción:** Crea un nuevo rol con permisos y privilegios asociados.

**URL:** `http://localhost:3000/api/roles`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Supervisor",
  "descripcion": "Rol de supervisor con acceso limitado",
  "permisos_privilegios": [
    {
      "id_permiso": 1,
      "id_privilegio": 2
    },
    {
      "id_permiso": 1,
      "id_privilegio": 3
    },
    {
      "id_permiso": 2,
      "id_privilegio": 1
    },
    {
      "id_permiso": 2,
      "id_privilegio": 2
    }
  ]
}
```

**Campos del Body:**
- `nombre` (string, required): Nombre del rol
- `descripcion` (string, optional): Descripción del rol
- `permisos_privilegios` (array, required): Array de objetos con `id_permiso` e `id_privilegio`

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Rol creado exitosamente",
  "data": {
    "id_rol": 4,
    "nombre": "Supervisor",
    "descripcion": "Rol de supervisor con acceso limitado",
    "permisos": [
      {
        "id_permiso": 1,
        "nombre": "Compras",
        "privilegios": [
          {
            "id_privilegio": 2,
            "nombre": "Read"
          },
          {
            "id_privilegio": 3,
            "nombre": "Edit"
          }
        ]
      }
    ]
  }
}
```

**Respuesta de Error (400):**
```json
{
  "success": false,
  "message": "Ya existe un rol con ese nombre",
  "error": "ROLE_NAME_EXISTS"
}
```

---

### 4. Actualizar Rol

**PUT** `/api/roles/:id`

**Descripción:** Actualiza un rol existente.

**URL:** `http://localhost:3000/api/roles/1`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Administrador Principal",
  "descripcion": "Rol de administrador con acceso completo al sistema",
  "permisos_privilegios": [
    {
      "id_permiso": 1,
      "id_privilegio": 1
    },
    {
      "id_permiso": 1,
      "id_privilegio": 2
    },
    {
      "id_permiso": 1,
      "id_privilegio": 3
    },
    {
      "id_permiso": 1,
      "id_privilegio": 4
    }
  ]
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Rol actualizado exitosamente",
  "data": {
    "id_rol": 1,
    "nombre": "Administrador Principal",
    "descripcion": "Rol de administrador con acceso completo al sistema",
    "permisos": [
      {
        "id_permiso": 1,
        "nombre": "Compras",
        "privilegios": [
          {
            "id_privilegio": 1,
            "nombre": "Create"
          },
          {
            "id_privilegio": 2,
            "nombre": "Read"
          }
        ]
      }
    ]
  }
}
```

---

### 5. Eliminar Rol

**DELETE** `/api/roles/:id`

**Descripción:** Elimina un rol y todas sus relaciones.

**URL:** `http://localhost:3000/api/roles/4`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Rol eliminado exitosamente"
}
```

**Respuesta de Error (404):**
```json
{
  "success": false,
  "message": "Rol no encontrado"
}
```

---

### 6. Obtener Todos los Permisos

**GET** `/api/roles/permisos`

**Descripción:** Obtiene todos los permisos disponibles.

**URL:** `http://localhost:3000/api/roles/permisos`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Permisos obtenidos exitosamente",
  "data": [
    {
      "id_permiso": 1,
      "nombre": "Compras"
    },
    {
      "id_permiso": 2,
      "nombre": "Servicios"
    },
    {
      "id_permiso": 3,
      "nombre": "Venta"
    },
    {
      "id_permiso": 4,
      "nombre": "Configuración"
    },
    {
      "id_permiso": 5,
      "nombre": "Usuarios"
    }
  ]
}
```

---

### 7. Obtener Todos los Privilegios

**GET** `/api/roles/privilegios`

**Descripción:** Obtiene todos los privilegios disponibles.

**URL:** `http://localhost:3000/api/roles/privilegios`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Privilegios obtenidos exitosamente",
  "data": [
    {
      "id_privilegio": 1,
      "nombre": "Create"
    },
    {
      "id_privilegio": 2,
      "nombre": "Read"
    },
    {
      "id_privilegio": 3,
      "nombre": "Edit"
    },
    {
      "id_privilegio": 4,
      "nombre": "Delete"
    }
  ]
}
```

---

## Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

## Ejemplos de Uso en Postman

### 1. Crear una Colección

1. Abre Postman
2. Crea una nueva colección llamada "CAPEX Roles API"
3. Configura la variable de entorno:
   - Variable: `base_url`
   - Valor: `http://localhost:3000`

### 2. Configurar Headers Globales

En la colección, ve a "Variables" y agrega:
```
Content-Type: application/json
```

### 3. Ejemplos de Requests

#### GET - Obtener Todos los Roles
```
Method: GET
URL: {{base_url}}/api/roles
```

#### POST - Crear Nuevo Rol
```
Method: POST
URL: {{base_url}}/api/roles
Body (raw JSON):
{
  "nombre": "Editor",
  "descripcion": "Rol para editar contenido",
  "permisos_privilegios": [
    {
      "id_permiso": 1,
      "id_privilegio": 2
    },
    {
      "id_permiso": 1,
      "id_privilegio": 3
    }
  ]
}
```

#### PUT - Actualizar Rol
```
Method: PUT
URL: {{base_url}}/api/roles/1
Body (raw JSON):
{
  "nombre": "Administrador Modificado",
  "descripcion": "Descripción actualizada"
}
```

#### DELETE - Eliminar Rol
```
Method: DELETE
URL: {{base_url}}/api/roles/4
```

## Notas Importantes

1. **Estructura de Datos:** Los privilegios están anidados dentro de cada permiso
2. **Validaciones:** 
   - El nombre del rol debe ser único
   - Cada rol debe tener al menos un permiso+privilegio
   - Los IDs de permisos y privilegios deben existir
3. **Transacciones:** Todas las operaciones de escritura usan transacciones para garantizar consistencia
4. **Eliminación:** La eliminación es permanente (hard delete)

## Datos de Prueba Disponibles

### Roles Existentes:
- **Administrador** (ID: 1) - Acceso completo
- **Empleado** (ID: 2) - Acceso limitado
- **Cliente** (ID: 3) - Acceso muy limitado

### Permisos Disponibles:
- **Compras** (ID: 1)
- **Servicios** (ID: 2)
- **Venta** (ID: 3)
- **Configuración** (ID: 4)
- **Usuarios** (ID: 5)

### Privilegios Disponibles:
- **Create** (ID: 1)
- **Read** (ID: 2)
- **Edit** (ID: 3)
- **Delete** (ID: 4)
