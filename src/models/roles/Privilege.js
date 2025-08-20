const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Privilege = sequelize.define('Privilege', {
  id_privilegio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_privilegio'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'nombre'
  }
}, {
  tableName: 'privilegios',
  timestamps: false
});

module.exports = Privilege;
