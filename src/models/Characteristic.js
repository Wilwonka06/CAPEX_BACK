const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Characteristic = sequelize.define('Characteristic', {
  id_caracteristica: {
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
  tipo: {
    type: DataTypes.ENUM('texto', 'numero', 'booleano', 'fecha'),
    allowNull: false,
    defaultValue: 'texto'
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'caracteristicas',
  timestamps: false
});

module.exports = Characteristic;
