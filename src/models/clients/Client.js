const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Client = sequelize.define('Client', {
  id_client: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_cliente'
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario',
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  address: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'direccion'
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    field: 'estado'
  }
}, {
  tableName: 'clientes',
  timestamps: false
});

module.exports = Client;
