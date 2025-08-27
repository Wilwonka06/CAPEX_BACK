const { Role } = require('../models/roles');
const ResponseMiddleware = require('./ResponseMiddleware');

/**
 * Middleware para validar roles en peticiones de usuarios
 */
class UserRoleValidationMiddleware {

  /**
   * Validar que un roleId existe antes de crear o actualizar un usuario
   */
  static async validateRoleId(req, res, next) {
    try {
      const { roleId } = req.body;

      // Si no se proporciona roleId, continuar (se asignará el por defecto)
      if (!roleId) {
        return next();
      }

      // Validar que el roleId sea un número válido
      if (isNaN(roleId) || roleId <= 0) {
        return ResponseMiddleware.sendError(res, 400, 'El ID del rol debe ser un número válido mayor a 0', 'ROLE_VALIDATION_ERROR');
      }

      // Verificar que el rol existe en la base de datos
      const roleExists = await Role.findByPk(roleId);
      if (!roleExists) {
        return ResponseMiddleware.sendError(res, 400, `El rol con ID ${roleId} no existe en el sistema. Por favor, verifique el ID del rol e intente nuevamente.`, 'ROLE_VALIDATION_ERROR');
      }

      // Si el rol existe, continuar
      next();

    } catch (error) {
      return ResponseMiddleware.sendError(res, 500, `Error al validar el rol: ${error.message}`, 'INTERNAL_ERROR');
    }
  }

  /**
   * Validar que un roleId existe en parámetros de consulta
   */
  static async validateRoleIdInQuery(req, res, next) {
    try {
      const { roleId } = req.query;

      // Si no se proporciona roleId, continuar
      if (!roleId) {
        return next();
      }

      // Validar que el roleId sea un número válido
      if (isNaN(roleId) || roleId <= 0) {
        return ResponseMiddleware.sendError(res, 400, 'El ID del rol debe ser un número válido mayor a 0', 'ROLE_VALIDATION_ERROR');
      }

      // Verificar que el rol existe en la base de datos
      const roleExists = await Role.findByPk(roleId);
      if (!roleExists) {
        return ResponseMiddleware.sendError(res, 400, `El rol con ID ${roleId} no existe en el sistema. Por favor, verifique el ID del rol e intente nuevamente.`, 'ROLE_VALIDATION_ERROR');
      }

      // Si el rol existe, continuar
      next();

    } catch (error) {
      return ResponseMiddleware.sendError(res, 500, `Error al validar el rol: ${error.message}`, 'INTERNAL_ERROR');
    }
  }

  /**
   * Obtener información del rol para incluir en la respuesta
   */
  static async getRoleInfo(req, res, next) {
    try {
      const { roleId } = req.body;

      if (!roleId) {
        return next();
      }

      const role = await Role.findByPk(roleId);
      if (role) {
        req.roleInfo = {
          id: role.id_rol,
          nombre: role.nombre,
          descripcion: role.descripcion
        };
      }

      next();

    } catch (error) {
      // Si hay error al obtener info del rol, continuar sin ella
      next();
    }
  }
}

module.exports = UserRoleValidationMiddleware;
