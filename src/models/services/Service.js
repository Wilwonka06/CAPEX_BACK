const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Service = sequelize.define('Service', {
  id_service: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_servicio'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion'
  },
  base_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'precio_base',
    validate: {
      min: 0
    }
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'duracion_minutos',
    validate: {
      min: 1
    }
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'categoria'
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'estado'
  }
}, {
  tableName: 'servicios',
  timestamps: false
});

module.exports = Service;
