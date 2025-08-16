# CAPEX Backend API

API REST construida con Node.js, Express, MySQL y Sequelize.

## 🚀 Características

- **Base de datos**: MySQL con Sequelize ORM
- **Framework**: Express.js
- **Validación**: Express-validator
- **Variables de entorno**: dotenv
- **Desarrollo**: Nodemon para auto-reload

## 📋 Prerrequisitos

- Node.js (versión 14 o superior)
- MySQL Server
- npm o yarn

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd CAPEX_BACK
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Configuración del servidor
PORT=3000

# Configuración de MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=capex_db
DB_USER=root
DB_PASSWORD=tu_password
DB_DIALECT=mysql

# Configuración de JWT (opcional para autenticación)
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h
```

4. **Crear la base de datos**
```sql
CREATE DATABASE capex_db;
```

## 🏃‍♂️ Ejecutar el proyecto

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Endpoints de la API

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

### Ejemplos de uso

#### Crear un producto con características
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

#### Crear un proveedor
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

#### Crear una característica
```bash
curl -X POST http://localhost:3000/api/caracteristicas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Procesador"
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

## 📁 Estructura del proyecto

```
CAPEX_BACK/
├── src/
│   ├── config/
│   │   └── database.js           # Configuración de MySQL
│   ├── controllers/
│   │   ├── productoController.js # Controladores de productos
│   │   ├── caracteristicaController.js # Controladores de características
│   │   └── proveedorController.js # Controladores de proveedores
│   ├── models/
│   │   ├── Producto.js           # Modelo de producto
│   │   ├── Caracteristica.js     # Modelo de característica
│   │   ├── FichaTecnica.js       # Modelo de ficha técnica
│   │   ├── Proveedor.js          # Modelo de proveedor
│   │   └── index.js              # Relaciones entre modelos
│   ├── routes/
│   │   ├── productoRoutes.js     # Rutas de productos
│   │   ├── caracteristicaRoutes.js # Rutas de características
│   │   └── proveedorRoutes.js    # Rutas de proveedores
│   ├── middlewares/              # Middlewares personalizados
│   ├── services/                 # Lógica de negocio
│   ├── app.js                   # Configuración de Express
│   └── server.js                # Punto de entrada
├── .env                         # Variables de entorno
├── package.json
└── README.md
```

## 🔧 Configuración adicional

### Cambiar el puerto
Modifica la variable `PORT` en el archivo `.env`

### Configurar MySQL
Asegúrate de que MySQL esté corriendo y que las credenciales en `.env` sean correctas.

### Logs de SQL
Para ver las consultas SQL en la consola, cambia `logging: false` a `logging: console.log` en `src/config/database.js`

## 🛠️ Desarrollo

### Agregar nuevos modelos
1. Crea el modelo en `src/models/`
2. Crea el controlador en `src/controllers/`
3. Crea las rutas en `src/routes/`
4. Registra las rutas en `src/app.js`
5. Define las relaciones en `src/models/index.js`

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

## 📝 Notas importantes

- **Seguridad**: En producción, implementa autenticación y autorización
- **Validación**: Usa express-validator para validaciones adicionales
- **Errores**: Maneja todos los errores apropiadamente
- **Logs**: Implementa un sistema de logging para producción
- **Relaciones**: Las fichas técnicas se eliminan automáticamente al eliminar un producto

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
