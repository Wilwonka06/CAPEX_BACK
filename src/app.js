require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const characteristicRoutes = require('./routes/characteristicRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');

// Importar modelos directamente
const Product = require('./models/Product');
const Characteristic = require('./models/Characteristic');
const TechnicalSheet = require('./models/TechnicalSheet');
const Supplier = require('./models/Supplier');
const ProductCategory = require('./models/ProductCategory');

const app = express();

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

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API CAPEX Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    status: 'OK',
    endpoints: {
      productos: '/api/productos',
      caracteristicas: '/api/caracteristicas',
      proveedores: '/api/proveedores',
      categorias_productos: '/api/categorias-productos'
    }
  });
});

// Rutas de la API
app.use('/api/productos', productRoutes);
app.use('/api/caracteristicas', characteristicRoutes);
app.use('/api/proveedores', supplierRoutes);
app.use('/api/categorias-productos', productCategoryRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {   
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

module.exports = app; 