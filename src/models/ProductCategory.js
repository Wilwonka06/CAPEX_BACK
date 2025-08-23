const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductCategory = sequelize.define('ProductCategory', {
  id_categoria_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'categorias_productos',
  timestamps: false
});

module.exports = ProductCategory;
