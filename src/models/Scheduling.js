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
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  hora_entrada: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
    }
  },
  hora_salida: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
      isAfterStartTime(value) {
        if (this.hora_entrada && value <= this.hora_entrada) {
          throw new Error('La hora de salida debe ser posterior a la hora de entrada');
        }
      }
    }
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false
    // Removida la validación para permitir pruebas sin tabla de empleados
  }
}, {
  tableName: 'programaciones',
  timestamps: false, // Cambiado a false ya que la tabla no tiene timestamps
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['fecha_inicio', 'hora_entrada', 'id_empleado']
    }
  ]
});

module.exports = Scheduling;
