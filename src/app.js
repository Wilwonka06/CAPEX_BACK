require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
// Solo importamos las rutas que existen en la estructura actual
const serviceDetailRoutes = require('./routes/ventas/DetalleServicioRoutes');
const roleRoutes = require('./routes/roles/RoleRoutes');
const clientRoutes = require('./routes/clients/ClienteRoutes');

// Importar modelos directamente
const Product = require('./models/Product');
const Characteristic = require('./models/Characteristic');
const TechnicalSheet = require('./models/TechnicalSheet');
const Supplier = require('./models/Supplier');
const ProductCategory = require('./models/ProductCategory');
const Employee = require('./models/Employee');

// Importar modelos de roles
const Role = require('./models/roles/Role');
const Permission = require('./models/roles/Permission');
const Privilege = require('./models/roles/Privilege');
const RolePermissionPrivilege = require('./models/roles/RolePermissionPrivilege');

// Middleware de errores personalizado
const handleGeneralError = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

// Importar función de inicialización de roles
const { initializeRoles } = require('./config/initRoles');

const app = express();
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Inicializar roles por defecto
initializeRoles();

// Definir relaciones entre modelos
// Un producto puede tener muchas fichas técnicas
Product.hasMany(TechnicalSheet, {
  foreignKey: 'id_producto',
  as: 'fichasTecnicas'
});

// Una ficha técnica pertenece a un producto
TechnicalSheet.belongsTo(Product, {
  foreignKey: 'id_producto',
  as: 'producto'
});

// Una característica puede estar en muchas fichas técnicas
Characteristic.hasMany(TechnicalSheet, {
  foreignKey: 'id_caracteristica',
  as: 'fichasTecnicas'
});

// Una ficha técnica pertenece a una característica
TechnicalSheet.belongsTo(Characteristic, {
  foreignKey: 'id_caracteristica',
  as: 'caracteristica'
});

// Relación muchos a muchos entre Product y Characteristic a través de TechnicalSheet
Product.belongsToMany(Characteristic, {
  through: TechnicalSheet,
  foreignKey: 'id_producto',
  otherKey: 'id_caracteristica',
  as: 'caracteristicas'
});

Characteristic.belongsToMany(Product, {
  through: TechnicalSheet,
  foreignKey: 'id_caracteristica',
  otherKey: 'id_producto',
  as: 'productos'
});

// Relación entre ProductCategory y Product
ProductCategory.hasMany(Product, {
  foreignKey: 'id_categoria_producto',
  as: 'productos'
});

Product.belongsTo(ProductCategory, {
  foreignKey: 'id_categoria_producto',
  as: 'categoria'
});

// ===== ASOCIACIONES DE ROLES =====

// Role tiene muchos Permission a través de RolePermissionPrivilege
Role.belongsToMany(Permission, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_rol',
  otherKey: 'id_permiso',
  as: 'permisos'
});

// Permission pertenece a muchos Role a través de RolePermissionPrivilege
Permission.belongsToMany(Role, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_permiso',
  otherKey: 'id_rol',
  as: 'roles'
});

// Role tiene muchos Privilege a través de RolePermissionPrivilege
Role.belongsToMany(Privilege, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_rol',
  otherKey: 'id_privilegio',
  as: 'privilegios'
});

// Privilege pertenece a muchos Role a través de RolePermissionPrivilege
Privilege.belongsToMany(Role, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_privilegio',
  otherKey: 'id_rol',
  as: 'roles'
});

// Permission tiene muchos Privilege a través de RolePermissionPrivilege
Permission.belongsToMany(Privilege, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_permiso',
  otherKey: 'id_privilegio',
  as: 'privilegios'
});

// Privilege pertenece a muchos Permission a través de RolePermissionPrivilege
Privilege.belongsToMany(Permission, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_privilegio',
  otherKey: 'id_permiso',
  as: 'permisos'
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para CORS (opcional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rutas de la API
app.use('/api/ventas/detalles-servicios', serviceDetailRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/clients', clientRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {   
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware para manejar errores (debe ir al final)
app.use(handleGeneralError);

module.exports = app;
