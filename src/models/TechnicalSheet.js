const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FichaTecnica = sequelize.define('FichaTecnica', {
  id_ficha_tecnica: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_ficha_tecnica'
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_producto'
  },
  id_caracteristica: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_caracteristica'
  },
  valor: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  tableName: 'fichas_tecnicas',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_producto', 'id_caracteristica']
    }
  ]
});

module.exports = FichaTecnica;
