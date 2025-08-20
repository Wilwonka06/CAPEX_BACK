const { Permission } = require('../../models/roles/Associations');

class PermissionService {
  // Obtener todos los permisos
  static async getAllPermissions() {
    try {
      const permissions = await Permission.findAll({
        order: [['nombre', 'ASC']]
      });

      return {
        success: true,
        data: permissions
      };
    } catch (error) {
      throw new Error(`Error al obtener permisos: ${error.message}`);
    }
  }

  // Obtener permiso por ID
  static async getPermissionById(id) {
    try {
      const permission = await Permission.findByPk(id);

      if (!permission) {
        throw new Error('Permiso no encontrado');
      }

      return {
        success: true,
        data: permission
      };
    } catch (error) {
      throw new Error(`Error al obtener permiso: ${error.message}`);
    }
  }

  // Verificar si un permiso existe
  static async permissionExists(id) {
    try {
      const permission = await Permission.findByPk(id);
      return !!permission;
    } catch (error) {
      throw new Error(`Error al verificar existencia del permiso: ${error.message}`);
    }
  }

  // Buscar permiso por nombre
  static async findPermissionByName(nombre) {
    try {
      const permission = await Permission.findOne({ where: { nombre } });
      return permission;
    } catch (error) {
      throw new Error(`Error al buscar permiso por nombre: ${error.message}`);
    }
  }

  // Obtener permisos por IDs
  static async getPermissionsByIds(ids) {
    try {
      const permissions = await Permission.findAll({
        where: { id_permiso: ids }
      });

      return {
        success: true,
        data: permissions
      };
    } catch (error) {
      throw new Error(`Error al obtener permisos por IDs: ${error.message}`);
    }
  }

  // Verificar si todos los permisos existen
  static async validatePermissionIds(ids) {
    try {
      const permissions = await Permission.findAll({
        where: { id_permiso: ids }
      });

      return permissions.length === ids.length;
    } catch (error) {
      throw new Error(`Error al validar IDs de permisos: ${error.message}`);
    }
  }

  // Obtener permisos disponibles (no asignados a un rol específico)
  static async getAvailablePermissions(roleId = null) {
    try {
      let whereClause = {};
      
      if (roleId) {
        // Obtener permisos que NO están asignados al rol
        const role = await require('../../models/roles/Associations').Role.findByPk(roleId, {
          include: [{
            model: Permission,
            through: { attributes: [] }
          }]
        });

        if (role && role.Permissions.length > 0) {
          const assignedPermissionIds = role.Permissions.map(p => p.id_permiso);
          whereClause = {
            id_permiso: {
              [require('sequelize').Op.notIn]: assignedPermissionIds
            }
          };
        }
      }

      const permissions = await Permission.findAll({
        where: whereClause,
        order: [['nombre', 'ASC']]
      });

      return {
        success: true,
        data: permissions
      };
    } catch (error) {
      throw new Error(`Error al obtener permisos disponibles: ${error.message}`);
    }
  }

  // Obtener estadísticas de uso de permisos
  static async getPermissionUsageStats() {
    try {
      const permissions = await Permission.findAll({
        include: [{
          model: require('../../models/roles/Associations').Role,
          through: { attributes: [] }
        }]
      });

      const stats = permissions.map(permission => ({
        id_permiso: permission.id_permiso,
        nombre: permission.nombre,
        roles_count: permission.Roles ? permission.Roles.length : 0
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

module.exports = PermissionService;
