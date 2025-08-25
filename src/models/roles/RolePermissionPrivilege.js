const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RolePermissionPrivilege = sequelize.define('RolePermissionPrivilege', {
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id_rol'
    }
  },
  id_permiso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'permisos',
      key: 'id_permiso'
    }
  },
  id_privilegio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'privilegios',
      key: 'id_privilegio'
    }
  }
}, {
  tableName: 'roles_permisos_privilegios',
  timestamps: false
});

module.exports = RolePermissionPrivilege;
