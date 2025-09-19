require('dotenv').config();

module.exports = {
  development: {
    username: "avnadmin",
    password: process.env.DB_PASSWORD,
    database: "capex",
    host: "despliegue-db-01-heieihei183-17a5.g.aivencloud.com",
    port: 26570,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  test: {
    username: "avnadmin",
    password: process.env.DB_PASSWORD,
    database: "capex_test",
    host: "despliegue-db-01-heieihei183-17a5.g.aivencloud.com",
    port: 26570,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    username: "avnadmin",
    password: process.env.DB_PASSWORD,
    database: "capex",
    host: "despliegue-db-01-heieihei183-17a5.g.aivencloud.com",
    port: 26570,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
