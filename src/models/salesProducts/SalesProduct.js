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
    validate: {
      notEmpty: true,
      isDate: true
    }
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  estado: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: 'Pendiente',
    validate: {
      isIn: [['Completado', 'Cancelado', 'Pendiente']]
    }
  }
}, {
  tableName: 'ventas_productos',
  timestamps: false,
  indexes: [
    {
      fields: ['fecha']
    },
    {
      fields: ['id_cliente']
    },
    {
      fields: ['estado']
    }
  ]
});

module.exports = VentaProducto;