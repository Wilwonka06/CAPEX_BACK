// src/models/Scheduling.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Scheduling = sequelize.define('Scheduling', {
  id_programacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora_entrada: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_salida: {
    type: DataTypes.TIME,
    allowNull: false
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'programaciones',
  timestamps: true,
  underscored: true
});

module.exports = Scheduling;
