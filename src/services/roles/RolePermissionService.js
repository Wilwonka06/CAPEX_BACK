const { Role, Permission } = require('../../models/roles/Associations');
const RoleService = require('./RoleService');
const PermissionService = require('./PermissionService');

class RolePermissionService {
  // Obtener todos los permisos de un rol
  static async getRolePermissions(roleId) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      const role = await Role.findByPk(roleId, {
        include: [{
          model: Permission,
          through: { attributes: [] }
        }]
      });

      return {
        success: true,
        data: role.Permissions || []
      };
    } catch (error) {
      throw new Error(`Error al obtener permisos del rol: ${error.message}`);
    }
  }

  // Asignar permisos a un rol
  static async assignPermissionsToRole(roleId, permissionIds) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      // Verificar si todos los permisos existen
      const permissionsValid = await PermissionService.validatePermissionIds(permissionIds);
      if (!permissionsValid) {
        throw new Error('Algunos permisos no existen');
      }

      const role = await Role.findByPk(roleId);
      const permissions = await Permission.findAll({
        where: { id_permiso: permissionIds }
      });

      // Asignar permisos al rol
      await role.addPermissions(permissions);

      return {
        success: true,
        message: 'Permisos asignados exitosamente al rol'
      };
    } catch (error) {
      throw new Error(`Error al asignar permisos al rol: ${error.message}`);
    }
  }

  // Remover permisos de un rol
  static async removePermissionsFromRole(roleId, permissionIds) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      const role = await Role.findByPk(roleId);
      const permissions = await Permission.findAll({
        where: { id_permiso: permissionIds }
      });

      // Remover permisos del rol
      await role.removePermissions(permissions);

      return {
        success: true,
        message: 'Permisos removidos exitosamente del rol'
      };
    } catch (error) {
      throw new Error(`Error al remover permisos del rol: ${error.message}`);
    }
  }

  // Reemplazar todos los permisos de un rol
  static async replaceRolePermissions(roleId, permissionIds) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      // Verificar si todos los permisos existen (si se proporcionan)
      if (permissionIds && permissionIds.length > 0) {
        const permissionsValid = await PermissionService.validatePermissionIds(permissionIds);
        if (!permissionsValid) {
          throw new Error('Algunos permisos no existen');
        }
      }

      const role = await Role.findByPk(roleId);

      if (permissionIds && permissionIds.length > 0) {
        const permissions = await Permission.findAll({
          where: { id_permiso: permissionIds }
        });
        
        // Reemplazar todos los permisos
        await role.setPermissions(permissions);
      } else {
        // Remover todos los permisos
        await role.setPermissions([]);
      }

      return {
        success: true,
        message: 'Permisos del rol actualizados exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al actualizar permisos del rol: ${error.message}`);
    }
  }

  // Verificar si un rol tiene un permiso específico
  static async hasPermission(roleId, permissionName) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      const role = await Role.findByPk(roleId, {
        include: [{
          model: Permission,
          where: { nombre: permissionName },
          through: { attributes: [] }
        }]
      });

      return role && role.Permissions && role.Permissions.length > 0;
    } catch (error) {
      throw new Error(`Error al verificar permiso: ${error.message}`);
    }
  }

  // Verificar si un rol tiene múltiples permisos
  static async hasPermissions(roleId, permissionNames) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      const role = await Role.findByPk(roleId, {
        include: [{
          model: Permission,
          where: { nombre: permissionNames },
          through: { attributes: [] }
        }]
      });

      const hasAllPermissions = role && role.Permissions && role.Permissions.length === permissionNames.length;
      
      return {
        hasAllPermissions,
        foundPermissions: role ? role.Permissions.map(p => p.nombre) : [],
        missingPermissions: permissionNames.filter(name => 
          !role.Permissions.some(p => p.nombre === name)
        )
      };
    } catch (error) {
      throw new Error(`Error al verificar permisos: ${error.message}`);
    }
  }

  // Obtener roles que tienen un permiso específico
  static async getRolesWithPermission(permissionName) {
    try {
      const roles = await Role.findAll({
        include: [{
          model: Permission,
          where: { nombre: permissionName },
          through: { attributes: [] }
        }]
      });

      return {
        success: true,
        data: roles
      };
    } catch (error) {
      throw new Error(`Error al obtener roles con permiso: ${error.message}`);
    }
  }

  // Obtener estadísticas de permisos por rol
  static async getPermissionStatsByRole() {
    try {
      const roles = await Role.findAll({
        include: [{
          model: Permission,
          through: { attributes: [] }
        }]
      });

      const stats = roles.map(role => ({
        id_rol: role.id_rol,
        nombre: role.nombre,
        permissions_count: role.Permissions ? role.Permissions.length : 0,
        permissions: role.Permissions ? role.Permissions.map(p => p.nombre) : []
      }));

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de permisos: ${error.message}`);
    }
  }
}

module.exports = RolePermissionService;
