const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');  // 👈 asegúrate de que User.js exporta un modelo real

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
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'programaciones',
  timestamps: false,
  underscored: true
});

// 🔗 Asociación con User
if (User && User.associations !== undefined) {
  Scheduling.belongsTo(User, { foreignKey: 'id_usuario', as: 'usuario' });
}

module.exports = Scheduling;
