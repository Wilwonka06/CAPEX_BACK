const express = require('express');
const ejemploRoutes = require('./routes/ejemploRoutes');

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api', ejemploRoutes);

module.exports = app;