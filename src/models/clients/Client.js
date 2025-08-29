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
    type: DataTypes.STRING(200),
    allowNull: true
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'clientes',
  timestamps: false,
  // Deshabilitar la sincronización automática con la base de datos
  freezeTableName: true,
  // No crear la tabla automáticamente
  sync: false
});

module.exports = Client;
