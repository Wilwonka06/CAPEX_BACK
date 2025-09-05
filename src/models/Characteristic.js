const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Characteristic = sequelize.define('Characteristic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_caracteristica'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  tipo: {
    type: DataTypes.ENUM('texto', 'numero', 'booleano', 'fecha', 'lista'),
    allowNull: false,
    defaultValue: 'texto'
  },
  valores: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array de valores predefinidos para características de tipo lista'
  },
  requerido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  tableName: 'caracteristicas',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  indexes: [
    {
      unique: true,
      fields: ['nombre']
    },
    {
      fields: ['tipo']
    },
    {
      fields: ['estado']
    }
  ]
});

module.exports = Characteristic;
