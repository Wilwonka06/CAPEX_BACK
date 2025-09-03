/* const { Sequelize } = require('sequelize');
const config = require('../../config/config.json');

// Obtener configuración según el entorno
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Configuración de la base de datos
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

module.exports = { sequelize, connectDB }; */

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a MySQL en Railway');
  } catch (error) {
    console.error('Error al conectar a MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
