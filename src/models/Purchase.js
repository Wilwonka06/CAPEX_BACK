const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Compra = sequelize.define('Compra', {
  id_compra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_compra'
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_proveedor'
  },
  fecha_registro: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'fecha_registro'
  },
  fecha_compra: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'fecha_compra'
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  iva: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      isIn: [['Completada', 'Cancelada']]
    }
  }
}, {
  tableName: 'compras',
  timestamps: false,
  indexes: [
    {
      fields: ['id_proveedor']
    },
    {
      fields: ['fecha_compra']
    },
    {
      fields: ['estado']
    }
  ]
});

module.exports = Compra;