require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');

const app = express();
app.use(express.json());

// Conexión a MySQL
connectDB();

// Rutas
app.use('/api/scheduling', require('./routes/SchedulingRoutes'));
app.use('/api/employees', require('./routes/EmployeeRoutes'));
app.use('/api/service-categories', require('./routes/ServiceCategoryRoutes'));
app.use('/api/users', require('./routes/UsersRoutes'));

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'CAPEX API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
