const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/User');
const { Role } = require('../models/roles');
const ResponseMiddleware = require('./ResponseMiddleware');

/**
 * Middleware para verificar el token JWT
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return ResponseMiddleware.error(res, 'Token de acceso requerido', null, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await Usuario.findByPk(decoded.userId, {
      include: [
        {
          model: Role,
          as: 'rol'
        }
      ]
    });

    if (!user) {
      return ResponseMiddleware.error(res, 'Usuario no encontrado', null, 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ResponseMiddleware.error(res, 'Token inválido', null, 401);
    } else if (error.name === 'TokenExpiredError') {
      return ResponseMiddleware.error(res, 'Token expirado', null, 401);
    }
    return ResponseMiddleware.error(res, 'Error de autenticación', error, 500);
  }
};

/**
 * Middleware para verificar permisos específicos
 */
const verifyPermission = (requiredPermission, requiredPrivilege) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return ResponseMiddleware.error(res, 'Usuario no autenticado', null, 401);
      }

      // Verificar si el usuario tiene el rol requerido
      const userRole = req.user.rol;
      if (!userRole) {
        return ResponseMiddleware.error(res, 'Usuario sin rol asignado', null, 403);
      }

      // TODO: Implementar verificación de permisos específicos
      // Por ahora, permitir acceso a usuarios con rol de administrador
      if (userRole.nombre === 'Administrador') {
        return next();
      }

      // Verificar permisos específicos (implementación futura)
      const hasPermission = await checkUserPermission(req.user.id, requiredPermission, requiredPrivilege);
      
      if (!hasPermission) {
        return ResponseMiddleware.error(res, 'Permisos insuficientes', null, 403);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar permisos', error, 500);
    }
  };
};

/**
 * Función para verificar permisos específicos del usuario
 * TODO: Implementar lógica completa de verificación de permisos
 */
const checkUserPermission = async (userId, permission, privilege) => {
  try {
    // Implementación temporal - siempre retorna true
    // TODO: Implementar verificación real contra la base de datos
    return true;
  } catch (error) {
    console.error('Error verificando permisos:', error);
    return false;
  }
};

/**
 * Middleware para verificar si el usuario es administrador
 */
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return ResponseMiddleware.error(res, 'Usuario no autenticado', null, 401);
    }

    if (req.user.rol && req.user.rol.nombre === 'Administrador') {
      return next();
    }

    return ResponseMiddleware.error(res, 'Acceso restringido a administradores', null, 403);
  } catch (error) {
    return ResponseMiddleware.error(res, 'Error al verificar rol de administrador', error, 500);
  }
};

module.exports = {
  verifyToken,
  verifyPermission,
  requireAdmin,
  checkUserPermission
};
