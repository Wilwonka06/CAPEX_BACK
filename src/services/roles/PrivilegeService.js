const { Privilege } = require('../../models/roles/Associations');

class PrivilegeService {
  // Obtener todos los privilegios
  static async getAllPrivileges() {
    try {
      const privileges = await Privilege.findAll({
        order: [['nombre', 'ASC']]
      });

      return {
        success: true,
        data: privileges
      };
    } catch (error) {
      throw new Error(`Error al obtener privilegios: ${error.message}`);
    }
  }

  // Obtener privilegio por ID
  static async getPrivilegeById(id) {
    try {
      const privilege = await Privilege.findByPk(id);

      if (!privilege) {
        throw new Error('Privilegio no encontrado');
      }

      return {
        success: true,
        data: privilege
      };
    } catch (error) {
      throw new Error(`Error al obtener privilegio: ${error.message}`);
    }
  }

  // Verificar si un privilegio existe
  static async privilegeExists(id) {
    try {
      const privilege = await Privilege.findByPk(id);
      return !!privilege;
    } catch (error) {
      throw new Error(`Error al verificar existencia del privilegio: ${error.message}`);
    }
  }

  // Buscar privilegio por nombre
  static async findPrivilegeByName(nombre) {
    try {
      const privilege = await Privilege.findOne({ where: { nombre } });
      return privilege;
    } catch (error) {
      throw new Error(`Error al buscar privilegio por nombre: ${error.message}`);
    }
  }

  // Obtener privilegios por IDs
  static async getPrivilegesByIds(ids) {
    try {
      const privileges = await Privilege.findAll({
        where: { id_privilegio: ids }
      });

      return {
        success: true,
        data: privileges
      };
    } catch (error) {
      throw new Error(`Error al obtener privilegios por IDs: ${error.message}`);
    }
  }

  // Verificar si todos los privilegios existen
  static async validatePrivilegeIds(ids) {
    try {
      const privileges = await Privilege.findAll({
        where: { id_privilegio: ids }
      });

      return privileges.length === ids.length;
    } catch (error) {
      throw new Error(`Error al validar IDs de privilegios: ${error.message}`);
    }
  }

  // Obtener privilegios disponibles (no asignados a un rol específico)
  static async getAvailablePrivileges(roleId = null) {
    try {
      let whereClause = {};
      
      if (roleId) {
        // Obtener privilegios que NO están asignados al rol
        const role = await require('../../models/roles/Associations').Role.findByPk(roleId, {
          include: [{
            model: Privilege,
            through: { attributes: [] }
          }]
        });

        if (role && role.Privileges.length > 0) {
          const assignedPrivilegeIds = role.Privileges.map(p => p.id_privilegio);
          whereClause = {
            id_privilegio: {
              [require('sequelize').Op.notIn]: assignedPrivilegeIds
            }
          };
        }
      }

      const privileges = await Privilege.findAll({
        where: whereClause,
        order: [['nombre', 'ASC']]
      });

      return {
        success: true,
        data: privileges
      };
    } catch (error) {
      throw new Error(`Error al obtener privilegios disponibles: ${error.message}`);
    }
  }

  // Obtener estadísticas de uso de privilegios
  static async getPrivilegeUsageStats() {
    try {
      const privileges = await Privilege.findAll({
        include: [{
          model: require('../../models/roles/Associations').Role,
          through: { attributes: [] }
        }]
      });

      const stats = privileges.map(privilege => ({
        id_privilegio: privilege.id_privilegio,
        nombre: privilege.nombre,
        roles_count: privilege.Roles ? privilege.Roles.length : 0
      }));

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de privilegios: ${error.message}`);
    }
  }
}

module.exports = PrivilegeService;
