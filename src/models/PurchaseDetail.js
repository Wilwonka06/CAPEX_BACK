const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleCompra = sequelize.define('DetalleCompra', {
  id_detalle_compra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_detalle_compra'
  },
  id_compra: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_compra'
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_producto'
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  }
}, {
  tableName: 'detalles_compras',
  timestamps: false,
  indexes: [
    {
      fields: ['id_compra']
    },
    {
      fields: ['id_producto']
    }
  ]
});

module.exports = DetalleCompra;