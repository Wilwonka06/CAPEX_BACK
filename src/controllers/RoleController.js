const RoleService = require('../services/RoleService');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class RoleController {
  // Obtener todos los roles
  static async getAllRoles(req, res) {
    try {
      const roles = await RoleService.getAllRoles();
      return ResponseMiddleware.success(res, 'Roles obtenidos exitosamente', roles);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener roles', error);
    }
  }

  // Obtener rol por ID
  static async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await RoleService.getRoleById(id);
      
      if (!role) {
        return ResponseMiddleware.error(res, 'Rol no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Rol obtenido exitosamente', role);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener rol', error);
    }
  }

  // Crear nuevo rol
  static async createRole(req, res) {
    try {
      const roleData = req.body;
      const newRole = await RoleService.createRole(roleData);
      return ResponseMiddleware.success(res, 'Rol creado exitosamente', newRole, 201);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al crear rol', error);
    }
  }

  // Actualizar rol
  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const roleData = req.body;
      const updatedRole = await RoleService.updateRole(id, roleData);
      
      if (!updatedRole) {
        return ResponseMiddleware.error(res, 'Rol no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Rol actualizado exitosamente', updatedRole);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al actualizar rol', error);
    }
  }

  // Eliminar rol
  static async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const deleted = await RoleService.deleteRole(id);
      
      if (!deleted) {
        return ResponseMiddleware.error(res, 'Rol no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Rol eliminado exitosamente');
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al eliminar rol', error);
    }
  }

  // Obtener todos los permisos
  static async getAllPermissions(req, res) {
    try {
      const permissions = await RoleService.getAllPermissions();
      return ResponseMiddleware.success(res, 'Permisos obtenidos exitosamente', permissions);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener permisos', error);
    }
  }

  // Obtener todos los privilegios
  static async getAllPrivileges(req, res) {
    try {
      const privileges = await RoleService.getAllPrivileges();
      return ResponseMiddleware.success(res, 'Privilegios obtenidos exitosamente', privileges);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener privilegios', error);
    }
  }
}

module.exports = RoleController;
