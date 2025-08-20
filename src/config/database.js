const { Sequelize } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME || 'capex_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false, // Cambiar a console.log para ver las consultas SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida correctamente.');

  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };