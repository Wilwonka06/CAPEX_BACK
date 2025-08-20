// Servicios básicos de entidades
const RoleService = require('./RoleService');
const PermissionService = require('./PermissionService');
const PrivilegeService = require('./PrivilegeService');

// Servicios de relaciones
const RolePermissionService = require('./RolePermissionService');
const RolePrivilegeService = require('./RolePrivilegeService');

// Servicio principal de gestión
const RoleManagementService = require('./RoleManagementService');

module.exports = {
  // Servicios básicos
  RoleService,
  PermissionService,
  PrivilegeService,
  
  // Servicios de relaciones
  RolePermissionService,
  RolePrivilegeService,
  
  // Servicio principal
  RoleManagementService
};
