const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_pedido'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'fecha'
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      isIn: [['Pendiente','En proceso', 'Enviado', 'Entregado', 'Cancelado']]
    }
  }
}, {
  tableName: 'pedidos',
  timestamps: false,
  indexes: [
    {
      fields: ['fecha_compra']
    },
    {
      fields: ['estado']
    }
  ]
});

module.exports = Pedido;