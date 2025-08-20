const { Role, Privilege } = require('../../models/roles/Associations');
const RoleService = require('./RoleService');
const PrivilegeService = require('./PrivilegeService');

class RolePrivilegeService {
  // Obtener todos los privilegios de un rol
  static async getRolePrivileges(roleId) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      const role = await Role.findByPk(roleId, {
        include: [{
          model: Privilege,
          through: { attributes: [] }
        }]
      });

      return {
        success: true,
        data: role.Privileges || []
      };
    } catch (error) {
      throw new Error(`Error al obtener privilegios del rol: ${error.message}`);
    }
  }

  // Asignar privilegios a un rol
  static async assignPrivilegesToRole(roleId, privilegeIds) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      // Verificar si todos los privilegios existen
      const privilegesValid = await PrivilegeService.validatePrivilegeIds(privilegeIds);
      if (!privilegesValid) {
        throw new Error('Algunos privilegios no existen');
      }

      const role = await Role.findByPk(roleId);
      const privileges = await Privilege.findAll({
        where: { id_privilegio: privilegeIds }
      });

      // Asignar privilegios al rol
      await role.addPrivileges(privileges);

      return {
        success: true,
        message: 'Privilegios asignados exitosamente al rol'
      };
    } catch (error) {
      throw new Error(`Error al asignar privilegios al rol: ${error.message}`);
    }
  }

  // Remover privilegios de un rol
  static async removePrivilegesFromRole(roleId, privilegeIds) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      const role = await Role.findByPk(roleId);
      const privileges = await Privilege.findAll({
        where: { id_privilegio: privilegeIds }
      });

      // Remover privilegios del rol
      await role.removePrivileges(privileges);

      return {
        success: true,
        message: 'Privilegios removidos exitosamente del rol'
      };
    } catch (error) {
      throw new Error(`Error al remover privilegios del rol: ${error.message}`);
    }
  }

  // Reemplazar todos los privilegios de un rol
  static async replaceRolePrivileges(roleId, privilegeIds) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      // Verificar si todos los privilegios existen (si se proporcionan)
      if (privilegeIds && privilegeIds.length > 0) {
        const privilegesValid = await PrivilegeService.validatePrivilegeIds(privilegeIds);
        if (!privilegesValid) {
          throw new Error('Algunos privilegios no existen');
        }
      }

      const role = await Role.findByPk(roleId);

      if (privilegeIds && privilegeIds.length > 0) {
        const privileges = await Privilege.findAll({
          where: { id_privilegio: privilegeIds }
        });
        
        // Reemplazar todos los privilegios
        await role.setPrivileges(privileges);
      } else {
        // Remover todos los privilegios
        await role.setPrivileges([]);
      }

      return {
        success: true,
        message: 'Privilegios del rol actualizados exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al actualizar privilegios del rol: ${error.message}`);
    }
  }

  // Verificar si un rol tiene un privilegio específico
  static async hasPrivilege(roleId, privilegeName) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      const role = await Role.findByPk(roleId, {
        include: [{
          model: Privilege,
          where: { nombre: privilegeName },
          through: { attributes: [] }
        }]
      });

      return role && role.Privileges && role.Privileges.length > 0;
    } catch (error) {
      throw new Error(`Error al verificar privilegio: ${error.message}`);
    }
  }

  // Verificar si un rol tiene múltiples privilegios
  static async hasPrivileges(roleId, privilegeNames) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      const role = await Role.findByPk(roleId, {
        include: [{
          model: Privilege,
          where: { nombre: privilegeNames },
          through: { attributes: [] }
        }]
      });

      const hasAllPrivileges = role && role.Privileges && role.Privileges.length === privilegeNames.length;
      
      return {
        hasAllPrivileges,
        foundPrivileges: role ? role.Privileges.map(p => p.nombre) : [],
        missingPrivileges: privilegeNames.filter(name => 
          !role.Privileges.some(p => p.nombre === name)
        )
      };
    } catch (error) {
      throw new Error(`Error al verificar privilegios: ${error.message}`);
    }
  }

  // Obtener roles que tienen un privilegio específico
  static async getRolesWithPrivilege(privilegeName) {
    try {
      const roles = await Role.findAll({
        include: [{
          model: Privilege,
          where: { nombre: privilegeName },
          through: { attributes: [] }
        }]
      });

      return {
        success: true,
        data: roles
      };
    } catch (error) {
      throw new Error(`Error al obtener roles con privilegio: ${error.message}`);
    }
  }

  // Obtener estadísticas de privilegios por rol
  static async getPrivilegeStatsByRole() {
    try {
      const roles = await Role.findAll({
        include: [{
          model: Privilege,
          through: { attributes: [] }
        }]
      });

      const stats = roles.map(role => ({
        id_rol: role.id_rol,
        nombre: role.nombre,
        privileges_count: role.Privileges ? role.Privileges.length : 0,
        privileges: role.Privileges ? role.Privileges.map(p => p.nombre) : []
      }));

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de privilegios: ${error.message}`);
    }
  }

  // Obtener roles con sus permisos y privilegios completos
  static async getRoleWithFullDetails(roleId) {
    try {
      // Verificar si el rol existe
      const roleExists = await RoleService.roleExists(roleId);
      if (!roleExists) {
        throw new Error('Rol no encontrado');
      }

      const role = await Role.findByPk(roleId, {
        include: [
          {
            model: require('../../models/roles/Associations').Permission,
            through: { attributes: [] }
          },
          {
            model: Privilege,
            through: { attributes: [] }
          }
        ]
      });

      return {
        success: true,
        data: role
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles completos del rol: ${error.message}`);
    }
  }

  // Obtener todos los roles con sus permisos y privilegios
  static async getAllRolesWithDetails() {
    try {
      const roles = await Role.findAll({
        include: [
          {
            model: require('../../models/roles/Associations').Permission,
            through: { attributes: [] }
          },
          {
            model: Privilege,
            through: { attributes: [] }
          }
        ],
        order: [['nombre', 'ASC']]
      });

      return {
        success: true,
        data: roles
      };
    } catch (error) {
      throw new Error(`Error al obtener roles con detalles: ${error.message}`);
    }
  }
}

module.exports = RolePrivilegeService;
