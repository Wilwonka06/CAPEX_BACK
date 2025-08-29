const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Scheduling = sequelize.define('Scheduling', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empleados',
      key: 'id'
    }
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('programado', 'confirmado', 'en_progreso', 'completado', 'cancelado'),
    defaultValue: 'programado',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('baja', 'media', 'alta', 'urgente'),
    defaultValue: 'media',
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  recurrencePattern: {
    type: DataTypes.ENUM('diario', 'semanal', 'mensual', 'anual'),
    allowNull: true
  },
  recurrenceEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'programaciones',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['employeeId']
    },
    {
      fields: ['scheduledDate']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['isRecurring']
    }
  ],
  hooks: {
    beforeCreate: (scheduling) => {
      // Validar que la fecha programada sea futura
      if (scheduling.scheduledDate && new Date(scheduling.scheduledDate) <= new Date()) {
        throw new Error('La fecha programada debe ser futura');
      }
      
      // Validar que la hora de inicio sea anterior a la hora de fin
      if (scheduling.startTime && scheduling.endTime) {
        const startTime = new Date(`2000-01-01 ${scheduling.startTime}`);
        const endTime = new Date(`2000-01-01 ${scheduling.endTime}`);
        
        if (startTime >= endTime) {
          throw new Error('La hora de inicio debe ser anterior a la hora de fin');
        }
      }
    },
    beforeUpdate: (scheduling) => {
      // Validar que la fecha programada sea futura
      if (scheduling.changed('scheduledDate') && scheduling.scheduledDate) {
        if (new Date(scheduling.scheduledDate) <= new Date()) {
          throw new Error('La fecha programada debe ser futura');
        }
      }
      
      // Validar que la hora de inicio sea anterior a la hora de fin
      if ((scheduling.changed('startTime') || scheduling.changed('endTime')) && 
          scheduling.startTime && scheduling.endTime) {
        const startTime = new Date(`2000-01-01 ${scheduling.startTime}`);
        const endTime = new Date(`2000-01-01 ${scheduling.endTime}`);
        
        if (startTime >= endTime) {
          throw new Error('La hora de inicio debe ser anterior a la hora de fin');
        }
      }
    }
  }
});

module.exports = Scheduling;
