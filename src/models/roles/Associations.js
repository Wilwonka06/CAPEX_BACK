const Role = require('./Role');
const Permission = require('./Permission');
const Privilege = require('./Privilege');
const RolePermissionPrivilege = require('./RolePermissionPrivilege');

// Definir las asociaciones
Role.belongsToMany(Permission, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_rol',
  otherKey: 'id_permiso'
});

Permission.belongsToMany(Role, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_permiso',
  otherKey: 'id_rol'
});

Role.belongsToMany(Privilege, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_rol',
  otherKey: 'id_privilegio'
});

Privilege.belongsToMany(Role, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_privilegio',
  otherKey: 'id_rol'
});

Permission.belongsToMany(Privilege, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_permiso',
  otherKey: 'id_privilegio'
});

Privilege.belongsToMany(Permission, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_privilegio',
  otherKey: 'id_permiso'
});

module.exports = {
  Role,
  Permission,
  Privilege,
  RolePermissionPrivilege
};
