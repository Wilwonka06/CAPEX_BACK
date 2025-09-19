
# CAPEX Backend API

API Backend para CAPEX construida con Node.js, Express, MySQL y Sequelize.

## 🚀 Características

- **Base de datos:** MySQL con Sequelize ORM
- **Validaciones:** Express-validator para validación de datos
- **Arquitectura:** MVC con separación de responsabilidades
- **Relaciones:** Modelos relacionados con fichas técnicas, roles, citas, etc.
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
npx sequelize db:migrate

# Ejecutar seeders (opcional)
npx sequelize db:seed:all

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
CAPEX_BACK/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── associations.js (relaciones Sequelize)
│   │   └── initRoles.js
│   ├── controllers/ (lógica HTTP)
│   ├── middlewares/ (validaciones, auth)
│   ├── models/ (modelos Sequelize: User, Role, Appointment, Service, etc.)
│   ├── routes/ (rutas API)
│   ├── services/ (lógica de negocio)
│   ├── app.js (config Express, rutas)
│   └── server.js
├── migrations/ (migraciones Sequelize)
├── scripts/ (scripts de soporte: reset-database, test-associations, etc.)
├── docs/ (documentación detallada por módulo)
├── .env (variables)
└── package.json
```

### Relaciones entre Modelos (Sequelize)

Las relaciones están definidas en `src/config/associations.js`:

- **Usuario (User)**: Central, belongsTo Role (as: 'rol'), belongsToMany Role via UserRole.
- **Role**: hasMany Usuario, belongsToMany Usuario via UserRole.
- **Appointment (Citas)**: belongsTo Usuario (as: 'usuario', foreignKey: 'id_cliente'), hasMany ServiceDetail.
- **ServiceDetail**: belongsTo Citas, belongsTo Usuario (empleado), belongsTo Usuario (usuario, foreignKey: 'id_cliente'), belongsTo Services.
- **Product**: belongsTo ProductCategory, belongsToMany Characteristic via TechnicalSheet.
- **TechnicalSheet**: belongsTo Product, belongsTo Characteristic.
- **Purchase**: belongsTo Supplier, hasMany PurchaseDetail.
- **PurchaseDetail**: belongsTo Purchase, belongsTo Product.
- **Services**: hasMany ServiceDetail.
- **Scheduling**: belongsTo Usuario (as: 'usuario').

No hay tabla/modelo 'clientes' (removido, referencias reemplazadas con Usuario).

## 🌐 Endpoints de la API

### Base URL
```
http://localhost:3000
```

### Autenticación (Auth)
- **POST /api/auth/register**: Registrar usuario (body: nombre, tipo_documento, documento, telefono, correo, contrasena). Asigna rol 'Usuario' (ID 1). Respuesta: usuario sin password.
- **POST /api/auth/login**: Login (body: correo, contrasena). Retorna token JWT (24h exp).
- **GET /api/auth/me**: Usuario actual (header: Authorization: Bearer <token>).
- **POST /api/auth/verify**: Verificar token (body: token).
- **POST /api/auth/logout**: Logout (header: Authorization).

**Validaciones Registro**: Nombre (letras/acentos, 2-100 chars), documento único (5-20 alfanum), telefono (+[0-9]{7,15}), correo único, contrasena (8+ chars, mayúsc/minúsc/número/especial).

### Usuarios (User)
- **GET /api/usuarios**: Listar todos (query: page, limit, search=query general en nombre, correo, documento, telefono, tipo_documento, id_usuario, roleId).
- **GET /api/usuarios/search**: Búsqueda avanzada (query: page, limit, search, roleId, tipo_documento, nombre, correo, documento, telefono).
- **GET /api/usuarios/:id**: Por ID.
- **POST /api/usuarios**: Crear (body: nombre, tipo_documento, documento, telefono, correo, contrasena, roleId opcional).
- **PUT /api/usuarios/:id**: Actualizar.
- **DELETE /api/usuarios/:id**: Eliminar (soft delete?).
- **PATCH /api/usuarios/:id/cambiar-estado**: Cambiar estado (body: nuevoEstado).
- **GET /api/usuarios/stats**: Estadísticas (total, por rol, tipo documento).

**Búsqueda**: Op.or en nombre, correo, documento, telefono, tipo_documento, id_usuario. Excluye contrasena.

### Roles
- **GET /api/roles**: Listar todos (query: page, limit, search=query en nombre, descripcion).
- **GET /api/roles/:id**: Por ID (incluye permisos/privilegios).
- **POST /api/roles**: Crear (body: nombre, descripcion, permisos_privilegios array con id_permiso, id_privilegio).
- **PUT /api/roles/:id**: Actualizar.
- **DELETE /api/roles/:id**: Eliminar.
- **GET /api/roles/permisos**: Listar permisos.
- **GET /api/roles/privilegios**: Listar privilegios.
- **PATCH /api/roles/:id/activate**: Activar.
- **PATCH /api/roles/:id/deactivate**: Desactivar.

**Búsqueda**: Op.or en nombre, descripcion.

### Citas (Appointment)
- **GET /api/citas**: Listar todas (query: page, limit, estado, fecha_desde, fecha_hasta, id_usuario).
- **GET /api/citas/:id**: Por ID (incluye usuario, servicios con empleado/servicio).
- **GET /api/citas/buscar?query=valor**: Búsqueda texto (Op.or en motivo, estado, usuario nombre/correo/telefono).
- **POST /api/citas**: Crear (body: cita {id_cliente, fecha_servicio, hora_entrada, motivo}, servicios array).
- **PUT /api/citas/:id**: Actualizar.
- **PATCH /api/citas/:id/cancelar**: Cancelar (body: motivo).
- **POST /api/citas/:id/servicios**: Agregar servicio.
- **GET /api/citas/:id/servicios/:detalle_id**: Servicio por ID.
- **PATCH /api/citas/:id/servicios/:detalle_id/cancelar**: Cancelar servicio.
- **GET /api/citas/usuario/:userId**: Citas por usuario.
- **GET /api/citas/empleado/:employeeId**: Citas por empleado.

**Estados**: Agendada, Confirmada, Reprogramada, En proceso, Finalizada, Pagada, Cancelada por el usuario, No asistio.

### Scheduling
- **GET /api/scheduling**: Listar todas.
- **GET /api/scheduling/:id**: Por ID.
- **GET /api/scheduling/usuario/:id_usuario**: Por usuario.
- **GET /api/scheduling/search?query=valor**: Búsqueda general (fecha_inicio, hora_entrada, hora_salida).
- **POST /api/scheduling**: Crear (body
