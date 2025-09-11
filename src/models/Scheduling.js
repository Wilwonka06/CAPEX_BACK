// src/models/Scheduling.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Usuario } = require('./User');

const Scheduling = sequelize.define('Scheduling', {
  id_programacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'programaciones',
  timestamps: false
});

// ✅ Definir asociación con alias correcto
if (Usuario && Usuario.associations !== undefined) {
  Scheduling.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
}

module.exports = Scheduling;
