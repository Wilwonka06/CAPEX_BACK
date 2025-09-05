const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TechnicalSheet = sequelize.define('TechnicalSheet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_ficha_tecnica'
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_producto',
    references: {
      model: 'productos',
      key: 'id_producto'
    }
  },
  caracteristica_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_caracteristica',
    references: {
      model: 'caracteristicas',
      key: 'id_caracteristica'
    }
  },
  valor: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: false,
    defaultValue: 'activo'
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
  tableName: 'fichas_tecnicas',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  indexes: [
    {
      fields: ['producto_id']
    },
    {
      fields: ['caracteristica_id']
    },
    {
      fields: ['estado']
    }
  ]
});

module.exports = TechnicalSheet;
