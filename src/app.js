require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');


// Importar solo lo necesario
const { ErrorMiddleware, commonMiddleware } = require('./middlewares');

// Importar rutas
const usersRoutes = require('./routes/UsersRoutes');
app.use('/api/scheduling', require('./routes/SchedulingRoutes'));

const app = express();

// Conexión a MySQL
connectDB();

// Middleware básico de Express
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Aplicar middlewares globales básicos
app.use(commonMiddleware.basic);

// Ruta principal simple
app.get('/', (req, res) => {
  res.json({ 
    message: 'CAPEX API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/users', usersRoutes);

// Middleware de manejo de errores (solo lo esencial)
app.use(ErrorMiddleware.handleGeneralError);
app.use(ErrorMiddleware.handleNotFound);

module.exports = app;
