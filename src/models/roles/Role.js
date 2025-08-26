const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Role = sequelize.define('Role', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_rol'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'nombre',
    validate: {
      notEmpty: {
        msg: 'El nombre del rol no puede estar vacío'
      },
      len: {
        args: [1, 50],
        msg: 'El nombre del rol debe tener entre 1 y 50 caracteres'
      }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion'
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = { Role };
