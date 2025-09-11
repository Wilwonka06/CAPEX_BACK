const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id_servicio_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'servicios',
      key: 'id_servicio'
    }
  },
  fecha_servicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterToday(value) {
        if (new Date(value) <= new Date()) {
          throw new Error('La fecha del servicio debe ser posterior a hoy');
        }
      }
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
      is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      horaSalidaDespuesEntrada(value) {
        if (this.hora_entrada && value <= this.hora_entrada) {
          throw new Error('La hora de salida debe ser posterior a la hora de entrada');
        }
      }
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
    defaultValue: 'Agendada'
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
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  }
}, {
  tableName: 'servicios_clientes',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      fields: ['id_cliente']
    },
    {
      fields: ['id_servicio']
    },
    {
      fields: ['fecha_servicio']
    },
    {
      fields: ['estado']
    }
  ]
});

module.exports = Appointment;
