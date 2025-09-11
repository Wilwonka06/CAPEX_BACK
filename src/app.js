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
const userRoleRoutes = require('./routes/UserRoleRoutes');
const purchaseRoutes = require('./routes/PurchaseRoutes');
const authRoutes = require('./routes/auth/AuthRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Nuevas rutas para módulos de ventas
const orderRoutes = require('./routes/salesProduct/OrderRoutes');
const salesRoutes = require('./routes/salesProduct/SalesRoutes');

// Importar middleware de errores directamente
const ErrorMiddleware = require('./middlewares/errorMiddleware');

// Importar función de inicialización de roles
const { initializeRoles } = require('./config/initRoles');

// Importar función de configuración de asociaciones
const { setupAssociations } = require('./config/associations');

const app = express();

// Middlewares de parsing (DEBEN IR PRIMERO)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
connectDB();

// Configurar asociaciones entre modelos (después de conectar a la BD)
setupAssociations();

// Inicializar roles después de definir todas las asociaciones
initializeRoles();

// Middleware para CORS (opcional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
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
app.use('/api/clientes', clientRoutes);
app.use('/api/usuario-roles', userRoleRoutes);
app.use('/api/compras', purchaseRoutes);
app.use('/api/appointments', appointmentRoutes);

// Nuevas rutas para módulos de ventas
app.use('/api/pedidos', orderRoutes);
app.use('/api/ventas-productos', salesRoutes);

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