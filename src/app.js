require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const initializeRoles = require('./config/initRoles');

// Import associations to ensure models are loaded
require('./models/roles/Associations');
require('./models/clients/Associations');
require('./models/serviceDetails/Associations');

const app = express();
app.use(express.json());

// Conexión a MySQL
connectDB();

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true }).then(async () => {
  console.log('Modelos sincronizados con la base de datos');
  // Inicializar roles por defecto
  await initializeRoles();
}).catch((error) => {
  console.error('Error sincronizando modelos:', error);
});

// Aquí irían tus rutas
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Role routes
const roleRoutes = require('./routes/roles/RoleRoutes');
app.use('/api/roles', roleRoutes);

// Cliente routes
const clienteRoutes = require('./routes/clientes/ClienteRoutes');
app.use('/api/clientes', clienteRoutes);

// Venta de servicios routes
const detalleServicioRoutes = require('./routes/ventas/DetalleServicioRoutes');
app.use('/api/ventas/detalles-servicios', detalleServicioRoutes);

module.exports = app; // 👈 Exportamos app para usarlo en server.js