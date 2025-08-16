const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const productoRoutes = require('./routes/productoRoutes');
const caracteristicaRoutes = require('./routes/caracteristicaRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const categoriaProductoRoutes = require('./routes/categoriaProductoRoutes');

// Importar modelos directamente
const Producto = require('./models/Producto');
const Caracteristica = require('./models/Caracteristica');
const FichaTecnica = require('./models/FichaTecnica');
const Proveedor = require('./models/Proveedor');
const CategoriaProducto = require('./models/CategoriaProducto');

const app = express();

// Conectar a la base de datos
connectDB();

// Definir relaciones entre modelos
// Un producto puede tener muchas fichas técnicas
Producto.hasMany(FichaTecnica, {
  foreignKey: 'id_producto',
  as: 'fichasTecnicas'
});

// Una ficha técnica pertenece a un producto
FichaTecnica.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto'
});

// Una característica puede estar en muchas fichas técnicas
Caracteristica.hasMany(FichaTecnica, {
  foreignKey: 'id_caracteristica',
  as: 'fichasTecnicas'
});

// Una ficha técnica pertenece a una característica
FichaTecnica.belongsTo(Caracteristica, {
  foreignKey: 'id_caracteristica',
  as: 'caracteristica'
});

// Relación muchos a muchos entre Producto y Caracteristica a través de FichaTecnica
Producto.belongsToMany(Caracteristica, {
  through: FichaTecnica,
  foreignKey: 'id_producto',
  otherKey: 'id_caracteristica',
  as: 'caracteristicas'
});

Caracteristica.belongsToMany(Producto, {
  through: FichaTecnica,
  foreignKey: 'id_caracteristica',
  otherKey: 'id_producto',
  as: 'productos'
});

// Relación entre CategoriaProducto y Producto
CategoriaProducto.hasMany(Producto, {
  foreignKey: 'id_categoria_producto',
  as: 'productos'
});

Producto.belongsTo(CategoriaProducto, {
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
app.use('/api/productos', productoRoutes);
app.use('/api/caracteristicas', caracteristicaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/categorias-productos', categoriaProductoRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {   // sin '*'
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

module.exports = app;