// src/models/ServiceCategory.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ServiceCategory = sequelize.define('ServiceCategory', {
  id_categoria_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/
    }
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    allowNull: false,
    defaultValue: 'Activo'
  }
}, {
  tableName: 'categorias_servicios',
  timestamps: false,
  underscored: true
});

module.exports = ServiceCategory;
