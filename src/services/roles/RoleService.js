const { Role } = require('../../models/roles/Associations');

class RoleService {
  // Obtener todos los roles
  static async getAllRoles() {
    try {
      const roles = await Role.findAll({
        order: [['nombre', 'ASC']]
      });

      return {
        success: true,
        data: roles
      };
    } catch (error) {
      throw new Error(`Error al obtener roles: ${error.message}`);
    }
  }

  // Obtener rol por ID
  static async getRoleById(id) {
    try {
      const role = await Role.findByPk(id);

      if (!role) {
        throw new Error('Rol no encontrado');
      }

      return {
        success: true,
        data: role
      };
    } catch (error) {
      throw new Error(`Error al obtener rol: ${error.message}`);
    }
  }

  // Crear nuevo rol
  static async createRole(roleData) {
    try {
      const { nombre } = roleData;

      // Verificar si el rol ya existe
      const existingRole = await Role.findOne({ where: { nombre } });
      if (existingRole) {
        throw new Error('Ya existe un rol con ese nombre');
      }

      // Crear el rol
      const newRole = await Role.create({ nombre });

      return {
        success: true,
        message: 'Rol creado exitosamente',
        data: newRole
      };
    } catch (error) {
      throw new Error(`Error al crear rol: ${error.message}`);
    }
  }

  // Actualizar rol
  static async updateRole(id, roleData) {
    try {
      const { nombre } = roleData;

      // Verificar si el rol existe
      const role = await Role.findByPk(id);
      if (!role) {
        throw new Error('Rol no encontrado');
      }

      // Verificar si el nuevo nombre ya existe (si se está cambiando)
      if (nombre && nombre !== role.nombre) {
        const existingRole = await Role.findOne({ where: { nombre } });
        if (existingRole) {
          throw new Error('Ya existe un rol con ese nombre');
        }
      }

      // Actualizar nombre si se proporciona
      if (nombre) {
        await role.update({ nombre });
      }

      return {
        success: true,
        message: 'Rol actualizado exitosamente',
        data: role
      };
    } catch (error) {
      throw new Error(`Error al actualizar rol: ${error.message}`);
    }
  }

  // Eliminar rol
  static async deleteRole(id) {
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        throw new Error('Rol no encontrado');
      }

      // Eliminar el rol
      await role.destroy();

      return {
        success: true,
        message: 'Rol eliminado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al eliminar rol: ${error.message}`);
    }
  }

  // Verificar si un rol existe
  static async roleExists(id) {
    try {
      const role = await Role.findByPk(id);
      return !!role;
    } catch (error) {
      throw new Error(`Error al verificar existencia del rol: ${error.message}`);
    }
  }

  // Buscar rol por nombre
  static async findRoleByName(nombre) {
    try {
      const role = await Role.findOne({ where: { nombre } });
      return role;
    } catch (error) {
      throw new Error(`Error al buscar rol por nombre: ${error.message}`);
    }
  }
}

module.exports = RoleService;
