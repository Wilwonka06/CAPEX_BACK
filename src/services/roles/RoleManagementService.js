const RoleService = require('./RoleService');
const PermissionService = require('./PermissionService');
const PrivilegeService = require('./PrivilegeService');
const RolePermissionService = require('./RolePermissionService');
const RolePrivilegeService = require('./RolePrivilegeService');

class RoleManagementService {
  // Crear rol con permisos y privilegios
  static async createRoleWithPermissionsAndPrivileges(roleData) {
    try {
      const { nombre, permisos, privilegios } = roleData;

      // Crear el rol básico
      const roleResult = await RoleService.createRole({ nombre });
      const newRole = roleResult.data;

      // Asignar permisos si se proporcionan
      if (permisos && permisos.length > 0) {
        await RolePermissionService.assignPermissionsToRole(newRole.id_rol, permisos);
      }

      // Asignar privilegios si se proporcionan
      if (privilegios && privilegios.length > 0) {
        await RolePrivilegeService.assignPrivilegesToRole(newRole.id_rol, privilegios);
      }

      // Obtener el rol completo con sus asociaciones
      const completeRole = await RolePrivilegeService.getRoleWithFullDetails(newRole.id_rol);

      return {
        success: true,
        message: 'Rol creado exitosamente con permisos y privilegios',
        data: completeRole.data
      };
    } catch (error) {
      throw new Error(`Error al crear rol con permisos y privilegios: ${error.message}`);
    }
  }

  // Actualizar rol con permisos y privilegios
  static async updateRoleWithPermissionsAndPrivileges(roleId, roleData) {
    try {
      const { nombre, permisos, privilegios } = roleData;

      // Actualizar el rol básico
      const roleResult = await RoleService.updateRole(roleId, { nombre });

      // Actualizar permisos si se proporcionan
      if (permisos !== undefined) {
        await RolePermissionService.replaceRolePermissions(roleId, permisos);
      }

      // Actualizar privilegios si se proporcionan
      if (privilegios !== undefined) {
        await RolePrivilegeService.replaceRolePrivileges(roleId, privilegios);
      }

      // Obtener el rol completo con sus asociaciones
      const completeRole = await RolePrivilegeService.getRoleWithFullDetails(roleId);

      return {
        success: true,
        message: 'Rol actualizado exitosamente con permisos y privilegios',
        data: completeRole.data
      };
    } catch (error) {
      throw new Error(`Error al actualizar rol con permisos y privilegios: ${error.message}`);
    }
  }

  // Eliminar rol y todas sus asociaciones
  static async deleteRoleWithAllAssociations(roleId) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      // Remover todos los permisos del rol
      await RolePermissionService.replaceRolePermissions(roleId, []);

      // Remover todos los privilegios del rol
      await RolePrivilegeService.replaceRolePrivileges(roleId, []);

      // Eliminar el rol
      const result = await RoleService.deleteRole(roleId);

      return {
        success: true,
        message: 'Rol eliminado exitosamente con todas sus asociaciones'
      };
    } catch (error) {
      throw new Error(`Error al eliminar rol con todas sus asociaciones: ${error.message}`);
    }
  }

  // Obtener estadísticas completas del sistema de roles
  static async getCompleteRoleSystemStats() {
    try {
      const [
        rolesCount,
        permissionsCount,
        privilegesCount,
        permissionStats,
        privilegeStats,
        rolePermissionStats,
        rolePrivilegeStats
      ] = await Promise.all([
        RoleService.getAllRoles(),
        PermissionService.getAllPermissions(),
        PrivilegeService.getAllPrivileges(),
        RolePermissionService.getPermissionStatsByRole(),
        RolePrivilegeService.getPrivilegeStatsByRole(),
        PrivilegeService.getPrivilegeUsageStats()
      ]);

      return {
        success: true,
        data: {
          summary: {
            total_roles: rolesCount.data.length,
            total_permissions: permissionsCount.data.length,
            total_privileges: privilegesCount.data.length
          },
          roles: rolesCount.data,
          permissions: permissionsCount.data,
          privileges: privilegesCount.data,
          role_permission_stats: rolePermissionStats.data,
          role_privilege_stats: privilegeStats.data,
          privilege_usage_stats: rolePrivilegeStats.data
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas del sistema: ${error.message}`);
    }
  }

  // Verificar permisos y privilegios de un rol
  static async checkRoleCapabilities(roleId, requiredPermissions = [], requiredPrivileges = []) {
    try {
      const results = {};

      // Verificar permisos
      if (requiredPermissions.length > 0) {
        const permissionResults = await RolePermissionService.hasPermissions(roleId, requiredPermissions);
        results.permissions = permissionResults;
      }

      // Verificar privilegios
      if (requiredPrivileges.length > 0) {
        const privilegeResults = await RolePrivilegeService.hasPrivileges(roleId, requiredPrivileges);
        results.privileges = privilegeResults;
      }

      // Determinar si el rol tiene todas las capacidades requeridas
      const hasAllCapabilities = 
        (!requiredPermissions.length || results.permissions?.hasAllPermissions) &&
        (!requiredPrivileges.length || results.privileges?.hasAllPrivileges);

      return {
        success: true,
        data: {
          role_id: roleId,
          has_all_capabilities: hasAllCapabilities,
          ...results
        }
      };
    } catch (error) {
      throw new Error(`Error al verificar capacidades del rol: ${error.message}`);
    }
  }

  // Clonar un rol con sus permisos y privilegios
  static async cloneRole(roleId, newRoleName) {
    try {
      // Obtener el rol original con todos sus detalles
      const originalRole = await RolePrivilegeService.getRoleWithFullDetails(roleId);
      
      if (!originalRole.data) {
        throw new Error('Rol original no encontrado');
      }

      // Crear el nuevo rol
      const newRoleResult = await RoleService.createRole({ nombre: newRoleName });
      const newRole = newRoleResult.data;

      // Obtener IDs de permisos y privilegios del rol original
      const permissionIds = originalRole.data.Permissions?.map(p => p.id_permiso) || [];
      const privilegeIds = originalRole.data.Privileges?.map(p => p.id_privilegio) || [];

      // Asignar permisos al nuevo rol
      if (permissionIds.length > 0) {
        await RolePermissionService.assignPermissionsToRole(newRole.id_rol, permissionIds);
      }

      // Asignar privilegios al nuevo rol
      if (privilegeIds.length > 0) {
        await RolePrivilegeService.assignPrivilegesToRole(newRole.id_rol, privilegeIds);
      }

      // Obtener el nuevo rol completo
      const completeNewRole = await RolePrivilegeService.getRoleWithFullDetails(newRole.id_rol);

      return {
        success: true,
        message: 'Rol clonado exitosamente',
        data: {
          original_role: originalRole.data,
          new_role: completeNewRole.data
        }
      };
    } catch (error) {
      throw new Error(`Error al clonar rol: ${error.message}`);
    }
  }

  // Obtener roles con capacidades específicas
  static async getRolesWithCapabilities(requiredPermissions = [], requiredPrivileges = []) {
    try {
      const allRoles = await RolePrivilegeService.getAllRolesWithDetails();
      const matchingRoles = [];

      for (const role of allRoles.data) {
        const capabilities = await this.checkRoleCapabilities(
          role.id_rol, 
          requiredPermissions, 
          requiredPrivileges
        );

        if (capabilities.data.has_all_capabilities) {
          matchingRoles.push(role);
        }
      }

      return {
        success: true,
        data: {
          required_permissions: requiredPermissions,
          required_privileges: requiredPrivileges,
          matching_roles: matchingRoles,
          total_matches: matchingRoles.length
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener roles con capacidades: ${error.message}`);
    }
  }
}

module.exports = RoleManagementService;
