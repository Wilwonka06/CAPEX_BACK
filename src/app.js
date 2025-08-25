require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const productRoutes = require('./routes/ProductRoutes');
const characteristicRoutes = require('./routes/CharacteristicRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const usersRoutes = require('./routes/UsersRoutes');
const schedulingRoutes = require('./routes/SchedulingRoutes');
const employeeRoutes = require('./routes/EmployeeRoutes');
const serviceCategoryRoutes = require('./routes/ServiceCategoryRoutes');
const servicesRoutes = require('./routes/ServicesRoutes');
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
const User = require('./models/User');
const Client = require('./models/clients/Client');
const { Role, Permission, Privilege, RolePermissionPrivilege } = require('./models/roles');

// Importar middleware de errores directamente
const ErrorMiddleware = require('./middlewares/ErrorMiddleware');

// Importar función de inicialización de roles
const { initializeRoles } = require('./config/initRoles');
const app = express();
app.use(express.json());

// Conectar a la base de datos
connectDB();
initializeRoles();

// Definir relaciones entre modelos

// Establecer relación Usuario-Cliente
User.hasOne(Client, {
  foreignKey: 'id_usuario',
  as: 'cliente'
});

Client.belongsTo(User, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

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
app.use(ErrorMiddleware.handleGeneralError);

module.exports = app;
