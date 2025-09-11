# CAPEX Backend API

API Backend para CAPEX construida con Node.js, Express, MySQL y Sequelize.

## 🚀 Características

- **Base de datos:** MySQL con Sequelize ORM
- **Validaciones:** Express-validator para validación de datos
- **Arquitectura:** MVC con separación de responsabilidades
- **Relaciones:** Modelos relacionados con fichas técnicas
- **Middleware:** Manejo global de errores y validaciones
- **CORS:** Configurado para desarrollo
- **Documentación:** API documentada con ejemplos

## 📋 Prerrequisitos

- Node.js (versión 14 o superior)
- MySQL Server
- npm o yarn

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd CAPEX_BACK

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# Ejecutar migraciones
npx sequelize-cli db:migrate

# Ejecutar seeders (opcional)
npx sequelize-cli db:seed:all

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 🌐 Endpoints de la API

### Base URL

```
http://localhost:3000
```

### Endpoints disponibles
- **Productos:** `/api/productos`
- **Características:** `/api/caracteristicas`
- **Proveedores:** `/api/proveedores`
- **Categorías:** `/api/categorias-productos`
- **Usuarios:** `/api/usuarios`
- **Agendamiento:** `/api/scheduling`
- **Editar Perfil:** `/api/users/:id/profile`

## 📚 Documentación de Endpoints

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Obtener todos los productos |
| GET | `/api/productos/search?nombre=valor` | Buscar productos por nombre |
| GET | `/api/productos/:id` | Obtener producto por ID |
| POST | `/api/productos` | Crear nuevo producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto |

### Características

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/caracteristicas` | Obtener todas las características |
| GET | `/api/caracteristicas/:id` | Obtener característica por ID |
| POST | `/api/caracteristicas` | Crear nueva característica |
| PUT | `/api/caracteristicas/:id` | Actualizar característica |
| DELETE | `/api/caracteristicas/:id` | Eliminar característica |

### Proveedores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/proveedores` | Obtener todos los proveedores |
| GET | `/api/proveedores/search?nombre=valor` | Buscar proveedores por nombre |
| GET | `/api/proveedores/estado/:estado` | Obtener proveedores por estado |
| GET | `/api/proveedores/:id` | Obtener proveedor por ID |
| POST | `/api/proveedores` | Crear nuevo proveedor |
| PUT | `/api/proveedores/:id` | Actualizar proveedor |
| DELETE | `/api/proveedores/:id` | Eliminar proveedor |

### Editar Perfil de Usuario

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| PUT | `/api/users/:id/profile` | Editar perfil de usuario |

**Campos editables:**
- `nombre` (opcional): Nombre completo del usuario
- `tipo_documento` (opcional): Tipo de documento de identidad
- `documento` (opcional): Número de documento
- `telefono` (opcional): Número de teléfono
- `correo` (opcional): Dirección de correo electrónico
- `foto` (opcional): URL de la foto de perfil
- `direccion` (opcional): Dirección del usuario
- `contrasena` (opcional): Nueva contraseña

**Ejemplo de uso:**
```bash
curl -X PUT http://localhost:3000/api/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María González",
    "telefono": "+573001234567",
    "correo": "maria.gonzalez@ejemplo.com"
  }'
```

**Documentación completa:** Ver [EDIT_PROFILE_API.md](docs/EDIT_PROFILE_API.md)

### Categorías de Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categorias-productos` | Obtener todas las categorías |
| GET | `/api/categorias-productos/:id` | Obtener categoría por ID |
| POST | `/api/categorias-productos` | Crear nueva categoría |
| PUT | `/api/categorias-productos/:id` | Actualizar categoría |
| DELETE | `/api/categorias-productos/:id` | Eliminar categoría |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Obtener todos los usuarios |
| GET | `/api/usuarios/:id` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear nuevo usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |

### Agendamiento

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/scheduling` | Obtener todos los agendamientos |
| GET | `/api/scheduling/:id` | Obtener agendamiento por ID |
| POST | `/api/scheduling` | Crear nuevo agendamiento |
| PUT | `/api/scheduling/:id` | Actualizar agendamiento |
| DELETE | `/api/scheduling/:id` | Eliminar agendamiento |

## 💡 Ejemplos de uso

### Crear un producto con características
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop HP Pavilion",
    "id_categoria_producto": 1,
    "costo": 800000,
    "iva": 19,
    "precio_venta": 950000,
    "stock": 10,
    "url_foto": "https://ejemplo.com/foto.jpg",
    "caracteristicas": [
      {
        "id_caracteristica": 1,
        "valor": "Intel i7"
      },
      {
        "id_caracteristica": 2,
        "valor": "16GB RAM"
      }
    ]
  }'
```

### Crear un proveedor
```bash
curl -X POST http://localhost:3000/api/proveedores \
  -H "Content-Type: application/json" \
  -d '{
    "nit": "A123456789",
    "tipo_proveedor": "J",
    "nombre": "Tecnología Avanzada S.A.",
    "contacto": "Juan Pérez",
    "direccion": "Calle 123 #45-67",
    "correo": "contacto@tecnologia.com",
    "telefono": "+573001234567",
    "estado": "Activo"
  }'
```

### Crear una característica
```bash
curl -X POST http://localhost:3000/api/caracteristicas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Procesador"
  }'
```

### Crear un usuario
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "password": "password123",
    "rol": "admin"
  }'
```

## 🗄️ Estructura de la base de datos

### Tabla: productos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_producto | INT | ID único (auto-increment) |
| nombre | VARCHAR(255) | Nombre del producto (único) |
| id_categoria_producto | INT | ID de la categoría |
| costo | DECIMAL(15,2) | Costo del producto |
| iva | DECIMAL(5,2) | Porcentaje de IVA |
| precio_venta | DECIMAL(15,2) | Precio de venta |
| stock | INT | Cantidad en stock |
| fecha_registro | DATE | Fecha de registro |
| url_foto | VARCHAR(255) | URL de la foto |

### Tabla: caracteristicas
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_caracteristica | INT | ID único (auto-increment) |
| nombre | VARCHAR(100) | Nombre de la característica (único) |

### Tabla: fichas_tecnicas
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_ficha_tecnica | INT | ID único (auto-increment) |
| id_producto | INT | ID del producto |
| id_caracteristica | INT | ID de la característica |
| valor | VARCHAR(255) | Valor de la característica |

### Tabla: proveedores
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_proveedor | INT | ID único (auto-increment) |
| nit | VARCHAR(20) | NIT del proveedor (único) |
| tipo_proveedor | CHAR(1) | N (Natural) o J (Jurídico) |
| nombre | VARCHAR(255) | Nombre del proveedor |
| contacto | VARCHAR(255) | Persona de contacto |
| direccion | VARCHAR(255) | Dirección |
| correo | VARCHAR(255) | Correo electrónico (único) |
| telefono | VARCHAR(20) | Teléfono |
| estado | VARCHAR(10) | Activo o Inactivo |

### Tabla: usuarios
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_usuario | INT | ID único (auto-increment) |
| nombre | VARCHAR(255) | Nombre del usuario |
| email | VARCHAR(255) | Email (único) |
| password | VARCHAR(255) | Contraseña encriptada |
| rol | VARCHAR(50) | Rol del usuario |
| fecha_registro | TIMESTAMP | Fecha de registro |

### Tabla: scheduling
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_scheduling | INT | ID único (auto-increment) |
| titulo | VARCHAR(255) | Título del agendamiento |
| descripcion | TEXT | Descripción |
| fecha_inicio | DATETIME | Fecha y hora de inicio |
| fecha_fin | DATETIME | Fecha y hora de fin |
| estado | VARCHAR(50) | Estado del agendamiento |

## 📁 Estructura del proyecto

```
CAPEX_BACK/
├── src/
│   ├── config/
│   │   └── database.js              # Configuración de MySQL
│   ├── controllers/
│   │   ├── productController.js     # Controladores de productos
│   │   ├── characteristicController.js # Controladores de características
│   │   ├── supplierController.js    # Controladores de proveedores
│   │   ├── productCategoryController.js # Controladores de categorías
│   │   ├── UsersController.js       # Controladores de usuarios
│   │   └── SchedulingController.js  # Controladores de agendamiento
│   ├── models/
│   │   ├── Product.js               # Modelo de producto
│   │   ├── Characteristic.js        # Modelo de característica
│   │   ├── TechnicalSheet.js        # Modelo de ficha técnica
│   │   ├── Supplier.js              # Modelo de proveedor
│   │   ├── ProductCategory.js       # Modelo de categoría
│   │   ├── User.js                  # Modelo de usuario
│   │   └── Scheduling.js            # Modelo de agendamiento
│   ├── routes/
│   │   ├── ProductRoutes.js         # Rutas de productos
│   │   ├── CharacteristicRoutes.js  # Rutas de características
│   │   ├── SupplierRoutes.js        # Rutas de proveedores
│   │   ├── ProductCategoryRoutes.js # Rutas de categorías
│   │   ├── UsersRoutes.js           # Rutas de usuarios
│   │   └── SchedulingRoutes.js      # Rutas de agendamiento
│   ├── middlewares/
│   │   ├── ErrorMiddleware.js       # Middleware de errores
│   │   ├── ValidationMiddleware.js  # Middleware de validación
│   │   ├── productMiddleware.js     # Validaciones de productos
│   │   ├── characteristicMiddleware.js # Validaciones de características
│   │   ├── supplierMiddleware.js    # Validaciones de proveedores
│   │   ├── productCategoryMiddleware.js # Validaciones de categorías
│   │   ├── UsersMiddleware.js       # Validaciones de usuarios
│   │   └── SchedulingMiddleware.js  # Validaciones de agendamiento
│   ├── services/
│   │   ├── productService.js        # Lógica de negocio de productos
│   │   ├── characteristicService.js # Lógica de negocio de características
│   │   ├── supplierService.js       # Lógica de negocio de proveedores
│   │   ├── productCategoryService.js # Lógica de negocio de categorías
│   │   ├── UsersService.js          # Lógica de negocio de usuarios
│   │   └── SchedulingService.js     # Lógica de negocio de agendamiento
│   ├── app.js                      # Configuración de Express
│   └── server.js                   # Punto de entrada
├── migrations/                     # Migraciones de Sequelize
├── seeders/                       # Seeders de Sequelize
├── config/                        # Configuración adicional
├── .env                           # Variables de entorno
├── .env.example                   # Ejemplo de variables de entorno
├── package.json
└── README.md
```

## 🔧 Configuración

### Variables de entorno (.env)
```env
# Puerto del servidor
PORT=3000

# Configuración de MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=capex_db
DB_USER=root
DB_PASSWORD=tu_password

# Configuración de Sequelize
NODE_ENV=development
```

### Cambiar el puerto
Modifica la variable `PORT` en el archivo `.env`

### Configurar MySQL
Asegúrate de que MySQL esté corriendo y que las credenciales en `.env` sean correctas.

### Logs de SQL
Para ver las consultas SQL en la consola, cambia `logging: false` a `logging: console.log` en `src/config/database.js`

## 🛠️ Desarrollo

### Comandos útiles
```bash
# Ejecutar en modo desarrollo con nodemon
npm run dev

# Ejecutar migraciones
npx sequelize-cli db:migrate

# Revertir migración
npx sequelize-cli db:migrate:undo

# Ejecutar seeders
npx sequelize-cli db:seed:all

# Crear nueva migración
npx sequelize-cli migration:generate --name nombre-migracion

# Crear nuevo seeder
npx sequelize-cli seed:generate --name nombre-seeder
```

### Agregar nuevos modelos
1. Crea el modelo en `src/models/`
2. Crea el controlador en `src/controllers/`
3. Crea las rutas en `src/routes/`
4. Registra las rutas en `src/app.js`
5. Define las relaciones en `src/app.js`
6. Crea la migración correspondiente

### Validaciones implementadas

#### Productos
- Nombre único y solo letras (incluyendo acentos)
- Costo y precio de venta positivos
- IVA entre 0 y 40%
- Stock no negativo

#### Proveedores
- NIT único con formato letra + números
- Tipo de proveedor: N o J
- Correo único con formato válido
- Teléfono con formato internacional
- Estado: Activo o Inactivo

#### Características
- Nombre único y no vacío

#### Usuarios
- Email único y formato válido
- Contraseña con mínimo 6 caracteres
- Rol válido

## 📝 Notas importantes

- **Seguridad**: En producción, implementa autenticación y autorización
- **Validación**: Usa express-validator para validaciones adicionales
- **Errores**: Maneja todos los errores apropiadamente
- **Logs**: Implementa un sistema de logging para producción
- **Relaciones**: Las fichas técnicas se eliminan automáticamente al eliminar un producto
- **Base de datos**: Asegúrate de crear la base de datos antes de ejecutar las migraciones

## 🐛 Solución de problemas

### Error de conexión a MySQL
- Verifica que MySQL esté corriendo
- Confirma las credenciales en `.env`
- Asegúrate de que la base de datos exista

### Error de módulo no encontrado
- Ejecuta `npm install` para instalar dependencias
- Verifica que los nombres de archivos coincidan con las importaciones

### Error de migración
- Verifica que la base de datos exista
- Confirma que las credenciales sean correctas
- Revisa los logs de error para más detalles

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
