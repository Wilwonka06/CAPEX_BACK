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
    allowNull: true,
    field: 'id_venta_producto'
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_producto'
  },
  id_servicios_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_servicios_cliente',
    comment: 'Referencia opcional si la venta está asociada a un servicio'
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  descuento_unitario: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    field: 'descuento_unitario'
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