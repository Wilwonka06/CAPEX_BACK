// src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      is: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/
    }
  },
  tipo_documento: {
    type: DataTypes.ENUM('Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'),
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[A-Za-z0-9]+$/
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      is: /^\+[0-9]{7,15}$/
    }
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contrasena: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;
