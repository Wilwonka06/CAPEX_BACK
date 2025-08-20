require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const productRoutes = require('./routes/ProductRoutes');
const characteristicRoutes = require('./routes/CharacteristicRoutes');
const supplierRoutes = require('./routes/SupplierRoutes');
const productCategoryRoutes = require('./routes/ProductCategoryRoutes');
const usersRoutes = require('./routes/UsersRoutes');
const schedulingRoutes = require('./routes/SchedulingRoutes');
const employeeRoutes = require('./routes/EmployeeRoutes');
const serviceCategoryRoutes = require('./routes/ServiceCategoryRoutes');
const servicesRoutes = require('./routes/ServicesRoutes');


// Importar modelos directamente
const Product = require('./models/Product');
const Characteristic = require('./models/Characteristic');
const TechnicalSheet = require('./models/TechnicalSheet');
const Supplier = require('./models/Supplier');
const ProductCategory = require('./models/ProductCategory');
const Employee = require('./models/Employee');

// Importar middleware de errores directamente
const ErrorMiddleware = require('./middlewares/ErrorMiddleware');


const app = express();
app.use(express.json());

// Conectar a la base de datos
connectDB();

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
