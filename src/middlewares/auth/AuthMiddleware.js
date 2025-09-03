const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');
const ResponseMiddleware = require('../ResponseMiddleware');

/**
 * Middleware de autenticación JWT
 */
class AuthMiddleware {

  /**
   * Verificar token JWT y agregar información del usuario a req.user
   */
  static authenticateToken(req, res, next) {
    try {
      // Obtener el token del header Authorization
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        return ResponseMiddleware.sendError(res, 401, 'Token de acceso requerido');
      }

      // Verificar el token
      jwt.verify(token, jwtConfig.secret, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return ResponseMiddleware.sendError(res, 401, 'Token expirado');
          } else if (err.name === 'JsonWebTokenError') {
            return ResponseMiddleware.sendError(res, 401, 'Token inválido');
          } else {
            return ResponseMiddleware.sendError(res, 401, 'Error en la verificación del token');
          }
        }

        // Agregar información del usuario decodificado a req.user
        req.user = decoded;
        next();
      });

    } catch (error) {
      console.error('Error en middleware de autenticación:', error);
      return ResponseMiddleware.sendError(res, 500, 'Error interno del servidor');
    }
  }

  /**
   * Verificar que el usuario tenga un rol específico
   * @param {string|Array} allowedRoles - Rol o roles permitidos
   */
  static requireRole(allowedRoles) {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return ResponseMiddleware.sendError(res, 401, 'Usuario no autenticado');
        }

        const userRole = req.user.roleName || req.user.role;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!roles.includes(userRole)) {
          return ResponseMiddleware.sendError(res, 403, 'No tienes permisos para acceder a este recurso');
        }

        next();
      } catch (error) {
        console.error('Error en verificación de rol:', error);
        return ResponseMiddleware.sendError(res, 500, 'Error interno del servidor');
      }
    };
  }

  /**
   * Verificar que el usuario sea el propietario del recurso o tenga rol de administrador
   * @param {string} resourceIdParam - Nombre del parámetro que contiene el ID del recurso
   */
  static requireOwnershipOrAdmin(resourceIdParam = 'id') {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return ResponseMiddleware.sendError(res, 401, 'Usuario no autenticado');
        }

        const userId = req.user.id_usuario;
        const userRole = req.user.roleName || req.user.role;
        const resourceId = req.params[resourceIdParam];

        // Si es administrador, permitir acceso
        if (userRole === 'Administrador' || userRole === 'Admin') {
          return next();
        }

        // Si no es administrador, verificar que sea el propietario
        if (parseInt(userId) !== parseInt(resourceId)) {
          return ResponseMiddleware.sendError(res, 403, 'No tienes permisos para acceder a este recurso');
        }

        next();
      } catch (error) {
        console.error('Error en verificación de propiedad:', error);
        return ResponseMiddleware.sendError(res, 500, 'Error interno del servidor');
      }
    };
  }

  /**
   * Middleware opcional de autenticación (no falla si no hay token)
   */
  static optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        jwt.verify(token, jwtConfig.secret, (err, decoded) => {
          if (!err) {
            req.user = decoded;
          }
          next();
        });
      } else {
        next();
      }
    } catch (error) {
      // Si hay error, continuar sin autenticación
      next();
    }
  }
}

module.exports = AuthMiddleware;
