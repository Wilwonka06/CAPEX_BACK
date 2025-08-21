const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const RolePermissionPrivilege = sequelize.define('RolePermissionPrivilege', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id_rol'
    }
  },
  id_permiso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'permisos',
      key: 'id_permiso'
    }
  },
  id_privilegio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'privilegios',
      key: 'id_privilegio'
    }
  }
}, {
  tableName: 'roles_permisos_privilegios',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_rol', 'id_permiso', 'id_privilegio']
    }
  ]
});

module.exports = RolePermissionPrivilege;
