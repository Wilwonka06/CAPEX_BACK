const { 
  RoleService, 
  PermissionService, 
  PrivilegeService,
  RolePermissionService,
  RolePrivilegeService,
  RoleManagementService 
} = require('../../services/roles');
const { asyncHandler } = require('../../middlewares/ErrorMiddleware');

class RoleController {
  // ===== OPERACIONES BÁSICAS DE ROLES =====
  
  // Obtener todos los roles
  static getAllRoles = asyncHandler(async (req, res) => {
    const result = await RoleService.getAllRoles();
    res.json(result);
  });

  // Obtener rol por ID
  static getRoleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await RoleService.getRoleById(id);
    res.json(result);
  });

  // Crear nuevo rol
  static createRole = asyncHandler(async (req, res) => {
    const result = await RoleService.createRole(req.body);
    res.status(201).json(result);
  });

  // Actualizar rol
  static updateRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await RoleService.updateRole(id, req.body);
    res.json(result);
  });

  // Eliminar rol
  static deleteRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await RoleService.deleteRole(id);
    res.json(result);
  });

  // ===== OPERACIONES AVANZADAS DE ROLES =====

  // Crear rol con permisos y privilegios
  static createRoleWithPermissionsAndPrivileges = asyncHandler(async (req, res) => {
    const result = await RoleManagementService.createRoleWithPermissionsAndPrivileges(req.body);
    res.status(201).json(result);
  });

  // Actualizar rol con permisos y privilegios
  static updateRoleWithPermissionsAndPrivileges = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await RoleManagementService.updateRoleWithPermissionsAndPrivileges(id, req.body);
    res.json(result);
  });

  // Eliminar rol con todas sus asociaciones
  static deleteRoleWithAllAssociations = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await RoleManagementService.deleteRoleWithAllAssociations(id);
    res.json(result);
  });

  // Obtener rol con detalles completos
  static getRoleWithFullDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await RolePrivilegeService.getRoleWithFullDetails(id);
    res.json(result);
  });

  // Obtener todos los roles con detalles completos
  static getAllRolesWithDetails = asyncHandler(async (req, res) => {
    const result = await RolePrivilegeService.getAllRolesWithDetails();
    res.json(result);
  });

  // ===== OPERACIONES DE PERMISOS =====

  // Obtener permisos de un rol
  static getRolePermissions = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await RolePermissionService.getRolePermissions(id);
    res.json(result);
  });

  // Asignar permisos a un rol
  static assignPermissionsToRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { permissionIds } = req.body;
    
    if (!permissionIds || !Array.isArray(permissionIds)) {
      return res.status(400).json({
        success: false,
        message: 'Los IDs de permisos son requeridos y deben ser un array'
      });
    }

    const result = await RolePermissionService.assignPermissionsToRole(id, permissionIds);
    res.json(result);
  });

  // Remover permisos de un rol
  static removePermissionsFromRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { permissionIds } = req.body;
    
    if (!permissionIds || !Array.isArray(permissionIds)) {
      return res.status(400).json({
        success: false,
        message: 'Los IDs de permisos son requeridos y deben ser un array'
      });
    }

    const result = await RolePermissionService.removePermissionsFromRole(id, permissionIds);
    res.json(result);
  });

  // Reemplazar permisos de un rol
  static replaceRolePermissions = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { permissionIds } = req.body;
    
    const result = await RolePermissionService.replaceRolePermissions(id, permissionIds || []);
    res.json(result);
  });

  // Verificar si un rol tiene un permiso específico
  static hasPermission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { permissionName } = req.query;
    
    if (!permissionName) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del permiso es requerido'
      });
    }

    const hasPermission = await RolePermissionService.hasPermission(id, permissionName);
    res.json({
      success: true,
      data: { hasPermission }
    });
  });

  // ===== OPERACIONES DE PRIVILEGIOS =====

  // Obtener privilegios de un rol
  static getRolePrivileges = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await RolePrivilegeService.getRolePrivileges(id);
    res.json(result);
  });

  // Asignar privilegios a un rol
  static assignPrivilegesToRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { privilegeIds } = req.body;
    
    if (!privilegeIds || !Array.isArray(privilegeIds)) {
      return res.status(400).json({
        success: false,
        message: 'Los IDs de privilegios son requeridos y deben ser un array'
      });
    }

    const result = await RolePrivilegeService.assignPrivilegesToRole(id, privilegeIds);
    res.json(result);
  });

  // Remover privilegios de un rol
  static removePrivilegesFromRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { privilegeIds } = req.body;
    
    if (!privilegeIds || !Array.isArray(privilegeIds)) {
      return res.status(400).json({
        success: false,
        message: 'Los IDs de privilegios son requeridos y deben ser un array'
      });
    }

    const result = await RolePrivilegeService.removePrivilegesFromRole(id, privilegeIds);
    res.json(result);
  });

  // Reemplazar privilegios de un rol
  static replaceRolePrivileges = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { privilegeIds } = req.body;
    
    const result = await RolePrivilegeService.replaceRolePrivileges(id, privilegeIds || []);
    res.json(result);
  });

  // Verificar si un rol tiene un privilegio específico
  static hasPrivilege = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { privilegeName } = req.query;
    
    if (!privilegeName) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del privilegio es requerido'
      });
    }

    const hasPrivilege = await RolePrivilegeService.hasPrivilege(id, privilegeName);
    res.json({
      success: true,
      data: { hasPrivilege }
    });
  });

  // ===== OPERACIONES DE GESTIÓN AVANZADA =====

  // Obtener estadísticas del sistema
  static getSystemStats = asyncHandler(async (req, res) => {
    const result = await RoleManagementService.getCompleteRoleSystemStats();
    res.json(result);
  });

  // Verificar capacidades de un rol
  static checkRoleCapabilities = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { permissions, privileges } = req.body;
    
    const result = await RoleManagementService.checkRoleCapabilities(
      id, 
      permissions || [], 
      privileges || []
    );
    res.json(result);
  });

  // Clonar un rol
  static cloneRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newRoleName } = req.body;
    
    if (!newRoleName) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del nuevo rol es requerido'
      });
    }

    const result = await RoleManagementService.cloneRole(id, newRoleName);
    res.status(201).json(result);
  });

  // Obtener roles con capacidades específicas
  static getRolesWithCapabilities = asyncHandler(async (req, res) => {
    const { permissions, privileges } = req.query;
    
    const permissionArray = permissions ? permissions.split(',') : [];
    const privilegeArray = privileges ? privileges.split(',') : [];
    
    const result = await RoleManagementService.getRolesWithCapabilities(
      permissionArray, 
      privilegeArray
    );
    res.json(result);
  });

  // ===== OPERACIONES DE CONSULTA DE PERMISOS Y PRIVILEGIOS =====

  // Obtener todos los permisos (solo consulta)
  static getAllPermissions = asyncHandler(async (req, res) => {
    const result = await PermissionService.getAllPermissions();
    res.json(result);
  });

  // Obtener todos los privilegios (solo consulta)
  static getAllPrivileges = asyncHandler(async (req, res) => {
    const result = await PrivilegeService.getAllPrivileges();
    res.json(result);
  });

  // Obtener permisos disponibles para un rol
  static getAvailablePermissions = asyncHandler(async (req, res) => {
    const { roleId } = req.query;
    const result = await PermissionService.getAvailablePermissions(roleId);
    res.json(result);
  });

  // Obtener privilegios disponibles para un rol
  static getAvailablePrivileges = asyncHandler(async (req, res) => {
    const { roleId } = req.query;
    const result = await PrivilegeService.getAvailablePrivileges(roleId);
    res.json(result);
  });

  // Obtener estadísticas de uso de permisos
  static getPermissionUsageStats = asyncHandler(async (req, res) => {
    const result = await PermissionService.getPermissionUsageStats();
    res.json(result);
  });

  // Obtener estadísticas de uso de privilegios
  static getPrivilegeUsageStats = asyncHandler(async (req, res) => {
    const result = await PrivilegeService.getPrivilegeUsageStats();
    res.json(result);
  });
}

module.exports = RoleController;
