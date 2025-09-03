const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const DetalleVentaProducto = sequelize.define('DetalleVentaProducto', {
  id_detalle_venta_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_detalle_venta_producto'
  },
  id_venta_producto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_servicios_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'detalles_ventas_productos',
  timestamps: false,
  indexes: [
    {
      fields: ['id_venta_producto']
    },
    {
      fields: ['id_producto']
    },
    {
      fields: ['id_servicios_cliente']
    }
  ]
});

module.exports = DetalleVentaProducto;