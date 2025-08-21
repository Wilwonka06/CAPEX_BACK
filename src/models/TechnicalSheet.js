const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TechnicalSheet = sequelize.define('TechnicalSheet', {
  id_ficha_tecnica: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id_producto'
    }
  },
  id_caracteristica: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'fichas_tecnicas',
  timestamps: false
});

module.exports = TechnicalSheet;
