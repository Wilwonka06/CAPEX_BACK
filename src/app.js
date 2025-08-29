require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const setupAssociations = require('./config/associations');
const initializeRoles = require('./config/initRoles');

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const characteristicRoutes = require('./routes/CharacteristicRoutes');
const supplierRoutes = require('./routes/SupplierRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const usersRoutes = require('./routes/UsersRoutes');
const schedulingRoutes = require('./routes/SchedulingRoutes');
const employeeRoutes = require('./routes/EmployeeRoutes');
const serviceCategoryRoutes = require('./routes/ServiceCategoryRoutes');
const servicesRoutes = require('./routes/ServicesRoutes');
const roleRoutes = require('./routes/roles/RoleRoutes');
const userRoleRoutes = require('./routes/UserRoleRoutes');
const clientRoutes = require('./routes/clients/ClientRoutes');
const serviceDetailRoutes = require('./routes/ventas/DetalleServicioRoutes');

// Importar middleware de errores
const ErrorMiddleware = require('./middlewares/ErrorMiddleware');

const app = express();

// Middlewares de parsing (DEBEN IR PRIMERO)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
connectDB();

// Inicializar roles por defecto
initializeRoles();

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

// Configurar asociaciones entre modelos (después de conectar a la BD)
setupAssociations();

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
app.use('/api/roles', roleRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/detalles-servicio', serviceDetailRoutes);

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
