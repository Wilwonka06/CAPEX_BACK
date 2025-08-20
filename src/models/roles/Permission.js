const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Permission = sequelize.define('Permission', {
  id_permiso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_permiso'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'nombre'
  }
}, {
  tableName: 'permisos',
  timestamps: false
});

module.exports = Permission;
