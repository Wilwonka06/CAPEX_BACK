const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const VentaProducto = sequelize.define('VentaProducto', {
  id_venta_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_venta_producto'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'fecha'
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_cliente'
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_pedido',
    comment: 'Referencia al pedido original si la venta proviene de un pedido'
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'subtotal'
  },
  iva: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'iva'
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'total'
  },
  descuento: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    field: 'descuento'
  },
  metodo_pago: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: [['Efectivo', 'Tarjeta', 'Transferencia', 'Otro']]
    },
    field: 'metodo_pago'
  },
  estado: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'Completado',
    validate: {
      isIn: [['Completado', 'Cancelado', 'Pendiente']]
    }
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'observaciones'
  }
}, {
  tableName: 'ventas_productos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  indexes: [
    {
      fields: ['fecha']
    },
    {
      fields: ['id_cliente']
    },
    {
      fields: ['estado']
    },
    {
      fields: ['id_pedido']
    }
  ]
});

module.exports = VentaProducto;