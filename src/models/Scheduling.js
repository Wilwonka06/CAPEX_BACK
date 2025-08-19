// src/models/Scheduling.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Scheduling = sequelize.define('Scheduling', {
  id_programacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,

    allowNull: false,
    validate: {
      is: /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
      isAfterStartTime(value) {
        if (this.hora_inicio && value <= this.hora_inicio) {
          throw new Error('La hora de fin debe ser posterior a la hora de inicio');
        }
      }
    }
  },
  tipo_turno: {
    type: DataTypes.ENUM('mañana', 'tarde', 'noche', 'completo'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('programado', 'en_curso', 'completado', 'cancelado'),
    defaultValue: 'programado'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'programaciones',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['fecha', 'hora_inicio', 'id_empleado']
    }
  ]
});

module.exports = Scheduling;
