const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_producto'
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      is: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/
    }
  },
  id_categoria_producto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  costo: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: 0.01,
      max: 9999999.99
    }
  },
  iva: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 40
    }
  },
  precio_venta: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01,
      max: 9999999.99
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  fecha_registro: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  url_foto: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'productos',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['nombre']
    }
  ]
});

module.exports = Producto;
