const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CategoriaProducto = sequelize.define('CategoriaProducto', {
  id_categoria_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_categoria_producto'
  },
  nombre: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  estado: {
    type: DataTypes.STRING(10),
    defaultValue: 'Activo',
    validate: {
      isIn: [['Activo', 'Inactivo']]
    }
  }
}, {
  tableName: 'categorias_productos',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['nombre']
    }
  ]
});

module.exports = CategoriaProducto;