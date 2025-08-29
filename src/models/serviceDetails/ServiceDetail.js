const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ServiceDetail = sequelize.define('ServiceDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'servicios',
      key: 'id'
    }
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id'
    }
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empleados',
      key: 'id'
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // Duración en minutos
    allowNull: true,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('programado', 'confirmado', 'en_progreso', 'completado', 'cancelado', 'pagado'),
    defaultValue: 'programado',
    allowNull: false
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'parcial'),
    defaultValue: 'pendiente',
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'otro'),
    allowNull: true
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'detalles_servicio',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['serviceId']
    },
    {
      fields: ['clientId']
    },
    {
      fields: ['employeeId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['paymentStatus']
    },
    {
      fields: ['scheduledDate']
    }
  ],
  hooks: {
    beforeCreate: (serviceDetail) => {
      // Calcular precio total si no se proporciona
      if (!serviceDetail.totalPrice) {
        serviceDetail.totalPrice = serviceDetail.unitPrice * serviceDetail.quantity;
      }
    },
    beforeUpdate: (serviceDetail) => {
      // Recalcular precio total si cambian precio unitario o cantidad
      if (serviceDetail.changed('unitPrice') || serviceDetail.changed('quantity')) {
        serviceDetail.totalPrice = serviceDetail.unitPrice * serviceDetail.quantity;
      }
      
      // Calcular duración si se proporcionan tiempos de inicio y fin
      if (serviceDetail.startTime && serviceDetail.endTime) {
        const durationMs = new Date(serviceDetail.endTime) - new Date(serviceDetail.startTime);
        serviceDetail.duration = Math.round(durationMs / (1000 * 60)); // Convertir a minutos
      }
    }
  }
});

module.exports = ServiceDetail;
