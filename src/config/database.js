const { Sequelize } = require('sequelize');
const config = require('../../config/config.json');

// Configuración de la base de datos
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port || 3306,
    dialect: dbConfig.dialect,
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
    
  // No sincronizar modelos automáticamente, usar solo migraciones
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };