const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const DetallePedido = sequelize.define('DetallePedido', {
  id_detalle_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_detalle_pedido'
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_pedido'
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_producto'
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      isInt: true
    }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  }
}, {
  tableName: 'detalles_pedidos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false,
  indexes: [
    {
      fields: ['id_pedido']
    },
    {
      fields: ['id_producto']
    }
  ]
});

module.exports = DetallePedido;