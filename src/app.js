require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const initializeRoles = require('./config/initRoles');

// Import associations to ensure models are loaded
require('./models/roles/Associations');
require('./models/clients/Associations');
require('./models/serviceDetails/Associations');

// Import models
const Role = require('./models/roles/Role');
const Permission = require('./models/roles/Permission');
const Privilege = require('./models/roles/Privilege');
const RolePermissionPrivilege = require('./models/roles/RolePermissionPrivilege');
const Client = require('./models/clients/Client');
const ServiceDetail = require('./models/serviceDetails/ServiceDetail');

// Import routes
const productRoutes = require('./routes/ProductRoutes');
const characteristicRoutes = require('./routes/CharacteristicRoutes');
const supplierRoutes = require('./routes/SupplierRoutes');
const productCategoryRoutes = require('./routes/ProductCategoryRoutes');
const usersRoutes = require('./routes/UsersRoutes');
const schedulingRoutes = require('./routes/SchedulingRoutes');
const employeeRoutes = require('./routes/EmployeeRoutes');
const serviceCategoryRoutes = require('./routes/ServiceCategoryRoutes');
const servicesRoutes = require('./routes/ServicesRoutes');
const serviceDetailRoutes = require('./routes/ventas/DetalleServicioRoutes');

// Import models for associations
const Product = require('./models/Product');
const Characteristic = require('./models/Characteristic');
const TechnicalSheet = require('./models/TechnicalSheet');
const Supplier = require('./models/Supplier');
const ProductCategory = require('./models/ProductCategory');
const Employee = require('./models/Employee');

// Import middleware
const ErrorMiddleware = require('./middlewares/ErrorMiddleware');

// Define Role associations
Role.belongsToMany(Permission, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_rol',
  otherKey: 'id_permiso'
});

Permission.belongsToMany(Role, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_permiso',
  otherKey: 'id_rol'
});

Role.belongsToMany(Privilege, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_rol',
  otherKey: 'id_privilegio'
});

Privilege.belongsToMany(Role, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_privilegio',
  otherKey: 'id_rol'
});

Permission.belongsToMany(Privilege, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_permiso',
  otherKey: 'id_privilegio'
});

Privilege.belongsToMany(Permission, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_privilegio',
  otherKey: 'id_permiso'
});

// Note: Client associations with User and ServiceDetail associations with Employee, Service, and ServiceClient
// are commented out as these models were referenced but not found in the current project structure.
// Uncomment and adjust these associations when these models are available.

/*
// Client associations
Client.belongsTo(User, {
  foreignKey: 'id_user',
  as: 'user'
});

User.hasOne(Client, {
  foreignKey: 'id_user',
  as: 'client'
});

// ServiceDetail associations
ServiceDetail.belongsTo(Employee, {
  foreignKey: 'id_employee',
  as: 'employee'
});

ServiceDetail.belongsTo(Service, {
  foreignKey: 'id_service',
  as: 'service'
});

ServiceDetail.belongsTo(ServiceClient, {
  foreignKey: 'id_service_client',
  as: 'serviceClient'
});

Employee.hasMany(ServiceDetail, {
  foreignKey: 'id_employee',
  as: 'serviceDetails'
});

Service.hasMany(ServiceDetail, {
  foreignKey: 'id_service',
  as: 'serviceDetails'
});

ServiceClient.hasMany(ServiceDetail, {
  foreignKey: 'id_service_client',
  as: 'serviceDetails'
});

ServiceClient.belongsTo(Client, {
  foreignKey: 'id_client',
  as: 'client'
});

Client.hasMany(ServiceClient, {
  foreignKey: 'id_client',
  as: 'serviceClients'
});
*/

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
connectDB();

// Initialize roles and permissions
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
app.use('/api/productos', productRoutes);
app.use('/api/caracteristicas', characteristicRoutes);
app.use('/api/proveedores', supplierRoutes);
app.use('/api/categorias-productos', productCategoryRoutes);
app.use('/api/usuarios', usersRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/empleados', employeeRoutes);
app.use('/api/categorias-servicios', serviceCategoryRoutes);
app.use('/api/servicios', servicesRoutes);
app.use('/api/ventas/detalles-servicios', serviceDetailRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {   
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware para manejar errores (debe ir al final)
app.use(ErrorMiddleware.handleGeneralError);

module.exports = app;

