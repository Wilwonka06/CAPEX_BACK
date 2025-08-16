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

// Aquí irían tus rutas
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

module.exports = app; // 👈 Exportamos app para usarlo en server.js