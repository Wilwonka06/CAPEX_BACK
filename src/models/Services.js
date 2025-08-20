// src/models/Services.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Services = sequelize.define('Services', {
  id_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/i
    }
  },
  id_categoria_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  precio: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01,
      max: 9999999999999.99
    }
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    allowNull: false,
    defaultValue: 'Activo'
  },
  foto: {
    type: DataTypes.STRING(250),
    allowNull: true
  }
}, {
  tableName: 'servicios',
  timestamps: false,
  underscored: true
});

module.exports = Services;
