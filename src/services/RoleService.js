const { Role, Permission, Privilege } = require('../models/roles');

class RoleService {
  // Obtener todos los roles
  static async getAllRoles() {
    try {
      const roles = await Role.findAll({
        include: [
          {
            model: Permission,
            through: { attributes: [] },
            as: 'permisos'
          },
          {
            model: Privilege,
            through: { attributes: [] },
            as: 'privilegios'
          }
        ]
      });
      return roles;
    } catch (error) {
      throw new Error(`Error al obtener roles: ${error.message}`);
    }
  }

  // Obtener rol por ID
  static async getRoleById(id) {
    try {
      const role = await Role.findByPk(id, {
        include: [
          {
            model: Permission,
            through: { attributes: [] },
            as: 'permisos'
          },
          {
            model: Privilege,
            through: { attributes: [] },
            as: 'privilegios'
          }
        ]
      });
      return role;
    } catch (error) {
      throw new Error(`Error al obtener rol: ${error.message}`);
    }
  }

  // Crear nuevo rol
  static async createRole(roleData) {
    try {
      const { nombre, descripcion, permisos, privilegios } = roleData;
      
      // Verificar si el rol ya existe
      const existingRole = await Role.findOne({ where: { nombre } });
      if (existingRole) {
        throw new Error('Ya existe un rol con ese nombre');
      }

      // Crear el rol
      const newRole = await Role.create({
        nombre,
        descripcion,
        estado: 'activo'
      });

      // Asignar permisos y privilegios si se proporcionan
      if (permisos && privilegios) {
        for (const permisoId of permisos) {
          for (const privilegioId of privilegios) {
            await newRole.addPermiso(permisoId);
            await newRole.addPrivilegio(privilegioId);
          }
        }
      }

      return await this.getRoleById(newRole.id_rol);
    } catch (error) {
      throw new Error(`Error al crear rol: ${error.message}`);
    }
  }

  // Actualizar rol
  static async updateRole(id, roleData) {
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        return null;
      }

      const { nombre, descripcion, permisos, privilegios } = roleData;
      
      // Verificar si el nuevo nombre ya existe en otro rol
      if (nombre && nombre !== role.nombre) {
        const existingRole = await Role.findOne({ where: { nombre } });
        if (existingRole) {
          throw new Error('Ya existe un rol con ese nombre');
        }
      }

      // Actualizar el rol
      await role.update({
        nombre: nombre || role.nombre,
        descripcion: descripcion || role.descripcion
      });

      // Actualizar permisos y privilegios si se proporcionan
      if (permisos && privilegios) {
        await role.setPermisos([]);
        await role.setPrivilegios([]);
        
        for (const permisoId of permisos) {
          for (const privilegioId of privilegios) {
            await role.addPermiso(permisoId);
            await role.addPrivilegio(privilegioId);
          }
        }
      }

      return await this.getRoleById(id);
    } catch (error) {
      throw new Error(`Error al actualizar rol: ${error.message}`);
    }
  }

  // Eliminar rol
  static async deleteRole(id) {
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        return false;
      }

      await role.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar rol: ${error.message}`);
    }
  }

  // Obtener todos los permisos
  static async getAllPermissions() {
    try {
      const permissions = await Permission.findAll();
      return permissions;
    } catch (error) {
      throw new Error(`Error al obtener permisos: ${error.message}`);
    }
  }

  // Obtener todos los privilegios
  static async getAllPrivileges() {
    try {
      const privileges = await Privilege.findAll();
      return privileges;
    } catch (error) {
      throw new Error(`Error al obtener privilegios: ${error.message}`);
    }
  }
}

module.exports = RoleService;
