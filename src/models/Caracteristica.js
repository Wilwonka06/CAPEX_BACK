const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Caracteristica = sequelize.define('Caracteristica', {
  id_caracteristica: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_caracteristica'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
}, {
  tableName: 'caracteristicas',
  timestamps: false
});

module.exports = Caracteristica;
