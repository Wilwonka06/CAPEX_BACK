const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Client = sequelize.define('Client', {
  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
}, {
  tableName: 'clientes',
  timestamps: false
});

module.exports = Client;
