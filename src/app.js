require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');

const app = express();
app.use(express.json());

// Conexión a MySQL
connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log(`El servidor está corriendo en el puerto: ${process.env.PORT || 3000}`);
});