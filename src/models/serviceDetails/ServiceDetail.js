const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ServiceDetail = sequelize.define('ServiceDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_detalle'
  },
  serviceClientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_servicio_cliente',
    references: {
      model: 'servicios_clientes',
      key: 'id_servicio_cliente'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_producto',
    references: {
      model: 'productos',
      key: 'id_producto'
    }
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_servicio',
    references: {
      model: 'servicios',
      key: 'id_servicio'
    }
  },
  empleadoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_empleado',
    references: {
      model: 'empleados',
      key: 'id_empleado'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'cantidad',
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'precio_unitario',
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'subtotal',
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('En ejecución', 'Pagada', 'Anulada'),
    defaultValue: 'En ejecución',
    allowNull: false,
    field: 'estado'
  }
}, {
  tableName: 'detalle_servicio_cliente',
  timestamps: false,
  indexes: [
    {
      fields: ['id_servicio_cliente']
    },
    {
      fields: ['id_producto']
    },
    {
      fields: ['id_servicio']
    },
    {
      fields: ['id_empleado']
    },
    {
      fields: ['estado']
    }
  ],
  hooks: {
    beforeCreate: (serviceDetail) => {
      // Calcular subtotal si no se proporciona
      if (!serviceDetail.subtotal) {
        serviceDetail.subtotal = serviceDetail.unitPrice * serviceDetail.quantity;
      }
    },
    beforeUpdate: (serviceDetail) => {
      // Recalcular subtotal si cambian precio unitario o cantidad
      if (serviceDetail.changed('unitPrice') || serviceDetail.changed('quantity')) {
        serviceDetail.subtotal = serviceDetail.unitPrice * serviceDetail.quantity;
      }
    }
  }
});

module.exports = ServiceDetail;
