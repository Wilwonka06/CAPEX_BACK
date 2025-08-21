const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Role = sequelize.define('Role', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_rol'
  },
  nombre_rol: {
    type: DataTypes.STRING(80),
    allowNull: false,
    unique: true,
    field: 'nombre_rol',
    validate: {
      notEmpty: {
        msg: 'El nombre del rol no puede estar vacío'
      },
      len: {
        args: [1, 80],
        msg: 'El nombre del rol debe tener entre 1 y 80 caracteres'
      }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion'
  },
  estado_rol: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'estado_rol'
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Role;
