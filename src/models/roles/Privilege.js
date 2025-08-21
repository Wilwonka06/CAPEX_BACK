const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Privilege = sequelize.define('Privilege', {
  id_privilegio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 50]
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
  tableName: 'privilegios',
  timestamps: false
});

module.exports = Privilege;
