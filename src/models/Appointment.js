// src/models/Appointment.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Citas = sequelize.define('Citas', {
  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  fecha_servicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfter: new Date().toISOString().split('T')[0]
    }
  },
  hora_entrada: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
    }
  },
  hora_salida: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
    }
  },
  estado: {
    type: DataTypes.ENUM(
      'Agendada', 
      'Confirmada', 
      'Reprogramada', 
      'En proceso', 
      'Finalizada', 
      'Pagada', 
      'Cancelada por el cliente', 
      'No asistio'
    ),
    allowNull: false,
    defaultValue: 'Agendada',
    validate: {
      isIn: {
        args: [['Agendada', 'Confirmada', 'Reprogramada', 'En proceso', 'Finalizada', 'Pagada', 'Cancelada por el cliente', 'No asistio']],
        msg: 'Estado inválido'
      }
    }
  },
  valor_total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01,
      max: 9999999999999.99
    }
  },
  motivo: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [1, 100],
        msg: 'El motivo debe tener entre 1 y 100 caracteres'
      }
    }
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'citas',
  timestamps: false,
  indexes: [
    {
      fields: ['id_cliente']
    },
    {
      fields: ['fecha_servicio']
    },
    {
      fields: ['estado']
    },
    {
      fields: ['fecha_servicio', 'hora_entrada']
    }
  ]
});

module.exports = Citas;
