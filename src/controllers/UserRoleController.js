const UserRoleService = require('../services/UserRoleService');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class UserRoleController {
  /**
   * Asignar un rol a un usuario
   */
  static async asignarRol(req, res) {
    try {
      const { idUsuario, idRol } = req.body;

      if (!idUsuario || !idRol) {
        return ResponseMiddleware.sendErrorResponse(res, 400, 'Se requiere idUsuario e idRol');
      }

      const resultado = await UserRoleService.asignarRolAUsuario(idUsuario, idRol);
      return ResponseMiddleware.sendSuccessResponse(res, 201, resultado.message, resultado.data);
    } catch (error) {
      return ResponseMiddleware.sendErrorResponse(res, 400, error.message);
    }
  }

  /**
   * Remover un rol de un usuario
   */
  static async removerRol(req, res) {
    try {
      const { idUsuario, idRol } = req.body;

      if (!idUsuario || !idRol) {
        return ResponseMiddleware.sendErrorResponse(res, 400, 'Se requiere idUsuario e idRol');
      }

      const resultado = await UserRoleService.removerRolDeUsuario(idUsuario, idRol);
      return ResponseMiddleware.sendSuccessResponse(res, 200, resultado.message);
    } catch (error) {
      return ResponseMiddleware.sendErrorResponse(res, 400, error.message);
    }
  }

  /**
   * Obtener todos los roles de un usuario
   */
  static async obtenerRolesDeUsuario(req, res) {
    try {
      const { idUsuario } = req.params;

      if (!idUsuario) {
        return ResponseMiddleware.sendErrorResponse(res, 400, 'Se requiere idUsuario');
      }

      const resultado = await UserRoleService.obtenerRolesDeUsuario(idUsuario);
      return ResponseMiddleware.sendSuccessResponse(res, 200, 'Roles obtenidos correctamente', resultado.data);
    } catch (error) {
      return ResponseMiddleware.sendErrorResponse(res, 400, error.message);
    }
  }

  /**
   * Obtener todos los usuarios de un rol
   */
  static async obtenerUsuariosDeRol(req, res) {
    try {
      const { idRol } = req.params;

      if (!idRol) {
        return ResponseMiddleware.sendErrorResponse(res, 400, 'Se requiere idRol');
      }

      const resultado = await UserRoleService.obtenerUsuariosDeRol(idRol);
      return ResponseMiddleware.sendSuccessResponse(res, 200, 'Usuarios obtenidos correctamente', resultado.data);
    } catch (error) {
      return ResponseMiddleware.sendErrorResponse(res, 400, error.message);
    }
  }

  /**
   * Obtener todas las asignaciones activas
   */
  static async obtenerTodasLasAsignaciones(req, res) {
    try {
      const resultado = await UserRoleService.obtenerTodasLasAsignaciones();
      return ResponseMiddleware.sendSuccessResponse(res, 200, 'Asignaciones obtenidas correctamente', resultado.data);
    } catch (error) {
      return ResponseMiddleware.sendErrorResponse(res, 500, error.message);
    }
  }

  /**
   * Verificar si un usuario tiene un rol específico
   */
  static async verificarRol(req, res) {
    try {
      const { idUsuario } = req.params;
      const { nombreRol } = req.query;

      if (!idUsuario || !nombreRol) {
        return ResponseMiddleware.sendErrorResponse(res, 400, 'Se requiere idUsuario y nombreRol');
      }

      const resultado = await UserRoleService.usuarioTieneRol(idUsuario, nombreRol);
      return ResponseMiddleware.sendSuccessResponse(res, 200, 'Verificación completada', resultado);
    } catch (error) {
      return ResponseMiddleware.sendErrorResponse(res, 400, error.message);
    }
  }

  /**
   * Obtener usuarios con sus roles
   */
  static async obtenerUsuariosConRoles(req, res) {
    try {
      const resultado = await UserRoleService.obtenerUsuariosConRoles();
      return ResponseMiddleware.sendSuccessResponse(res, 200, 'Usuarios con roles obtenidos correctamente', resultado.data);
    } catch (error) {
      return ResponseMiddleware.sendErrorResponse(res, 500, error.message);
    }
  }
}

module.exports = UserRoleController;
