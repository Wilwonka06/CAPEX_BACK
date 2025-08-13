require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');

const app = express();
app.use(express.json());

// Conexión a MySQL
connectDB();

// Aquí irían tus rutas
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

module.exports = app; // 👈 Exportamos app para usarlo en server.js
