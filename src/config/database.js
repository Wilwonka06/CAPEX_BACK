const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre BD
  process.env.DB_USER, // Usuario
  process.env.DB_PASS, // Contraseña
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Desactiva logs SQL
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a MySQL con Sequelize');
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };