const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Privilege = sequelize.define('Privilege', {
  id_privilegio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  }
}, {
  tableName: 'privilegios',
  timestamps: false
});

module.exports = Privilege;
