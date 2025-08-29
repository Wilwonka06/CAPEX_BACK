const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserRole = sequelize.define('UserRole', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id_rol'
    }
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: false,
    defaultValue: 'activo'
  }
}, {
  tableName: 'usuarios_roles',
  timestamps: false,
  indexes: [
    {
      fields: ['id_usuario']
    },
    {
      fields: ['id_rol']
    },
    {
      fields: ['estado']
    }
  ]
});

module.exports = UserRole;
