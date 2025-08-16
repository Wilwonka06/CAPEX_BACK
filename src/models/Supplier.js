const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Proveedor = sequelize.define('Proveedor', {
  id_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_proveedor'
  },
  nit: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^[A-Za-z][0-9]+$/
    }
  },
  tipo_proveedor: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    validate: {
      isIn: [['N', 'J']]
    }
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  contacto: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^\+[0-9]{7,15}$/
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
  tableName: 'proveedores',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['nit']
    },
    {
      unique: true,
      fields: ['correo']
    }
  ]
});

module.exports = Proveedor;
