// src/models/Employee.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Employee = sequelize.define('Employee', {
  id_empleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo', 'Suspendido', 'Enfermo', 'Incapacitado', 'Luto', 'Fallecido'),
    allowNull: false,
    defaultValue: 'Activo'
  }
}, {
  tableName: 'empleados',
  timestamps: false,
  underscored: true
});

module.exports = Employee;
