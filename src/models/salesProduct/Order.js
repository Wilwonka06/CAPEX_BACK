const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Pedido = sequelize.define('Pedido', {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_pedido'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'fecha'
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'),
    allowNull: false,
    defaultValue: 'Pendiente',
    validate: {
      isIn: [['Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado']]
    }
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  indexes: [
    {
      fields: ['fecha']
    },
    {
      fields: ['estado']
    },
    {
      fields: ['fecha_creacion']
    }
  ]
});

module.exports = Pedido;