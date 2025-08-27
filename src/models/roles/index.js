const { Role } = require('./Role');
const Permission = require('./Permission');
const Privilege = require('./Privilege');
const RolePermissionPrivilege = require('./RolePermissionPrivilege');

// Definir las asociaciones entre modelos
// Relación muchos a muchos entre Role y Permission a través de RolePermissionPrivilege
Role.belongsToMany(Permission, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_rol',
  otherKey: 'id_permiso',
  as: 'permisos'
});

Permission.belongsToMany(Role, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_permiso',
  otherKey: 'id_rol',
  as: 'roles'
});

// Relación muchos a muchos entre Permission y Privilege a través de RolePermissionPrivilege
Permission.belongsToMany(Privilege, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_permiso',
  otherKey: 'id_privilegio',
  as: 'privilegios'
});

Privilege.belongsToMany(Permission, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_privilegio',
  otherKey: 'id_permiso',
  as: 'permisos'
});

// Relaciones directas con la tabla intermedia
RolePermissionPrivilege.belongsTo(Role, {
  foreignKey: 'id_rol',
  as: 'rol'
});

RolePermissionPrivilege.belongsTo(Permission, {
  foreignKey: 'id_permiso',
  as: 'permiso'
});

RolePermissionPrivilege.belongsTo(Privilege, {
  foreignKey: 'id_privilegio',
  as: 'privilegio'
});

Role.hasMany(RolePermissionPrivilege, {
  foreignKey: 'id_rol',
  as: 'rolePermissionPrivileges'
});

Permission.hasMany(RolePermissionPrivilege, {
  foreignKey: 'id_permiso',
  as: 'rolePermissionPrivileges'
});

Privilege.hasMany(RolePermissionPrivilege, {
  foreignKey: 'id_privilegio',
  as: 'rolePermissionPrivileges'
});

module.exports = {
  Role,
  Permission,
  Privilege,
  RolePermissionPrivilege
};
