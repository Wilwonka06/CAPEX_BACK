/**
 * Middleware para manejo centralizado de errores
 */
class ErrorMiddleware {
  /**
   * Middleware para manejar errores generales
   * @param {Error} error - Error capturado
   * @param {Request} req - Objeto request de Express
   * @param {Response} res - Objeto response de Express
   * @param {Function} next - Función next de Express
   */
  static handleGeneralError(error, req, res, next) {
    console.error('Error no manejado:', error);

    // Determinar el tipo de error y el código de estado apropiado
    let statusCode = 500;
    let message = 'Error interno del servidor';

    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Error de validación';
    } else if (error.name === 'SequelizeValidationError') {
      statusCode = 400;
      message = 'Error de validación de datos';
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      statusCode = 409;
      message = 'Conflicto: el recurso ya existe';
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      statusCode = 400;
      message = 'Error de referencia: recurso relacionado no encontrado';
    } else if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Token inválido';
    } else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expirado';
    } else if (error.code === 'ENOTFOUND') {
      statusCode = 503;
      message = 'Servicio no disponible';
    } else if (error.code === 'ECONNREFUSED') {
      statusCode = 503;
      message = 'Error de conexión con la base de datos';
    }

    // Enviar respuesta de error
    res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });
  }

  /**
   * Middleware para manejar rutas no encontradas
   * @param {Request} req - Objeto request de Express
   * @param {Response} res - Objeto response de Express
   */
  static handleNotFound(req, res) {
    res.status(404).json({
      success: false,
      message: 'Ruta no encontrada',
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Middleware para manejar errores de validación
   * @param {Array} errors - Array de errores de validación
   * @param {Request} req - Objeto request de Express
   * @param {Response} res - Objeto response de Express
   * @param {Function} next - Función next de Express
   */
  static handleValidationError(errors, req, res, next) {
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });
  }

  /**
   * Middleware para manejar errores de autenticación
   * @param {Request} req - Objeto request de Express
   * @param {Response} res - Objeto response de Express
   * @param {Function} next - Función next de Express
   */
  static handleAuthenticationError(req, res, next) {
    res.status(401).json({
      success: false,
      message: 'No autorizado',
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });
  }

  /**
   * Middleware para manejar errores de autorización
   * @param {Request} req - Objeto request de Express
   * @param {Response} res - Objeto response de Express
   * @param {Function} next - Función next de Express
   */
  static handleAuthorizationError(req, res, next) {
    res.status(403).json({
      success: false,
      message: 'Acceso prohibido',
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });
  }
}

module.exports = ErrorMiddleware;
