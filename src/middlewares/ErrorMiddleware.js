/**
 * Middleware para manejo global de errores
 * Este middleware captura todos los errores no manejados y los formatea de manera consistente
 * para que otros desarrolladores puedan consumir la API de manera predecible
 */

class ErrorMiddleware {
  /**
   * Middleware para manejar errores de validación
   * @param {Error} err - Error de validación
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static handleValidationError(err, req, res, next) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: err.errors,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }
    next(err);
  }

  /**
   * Middleware para manejar errores de base de datos
   * @param {Error} err - Error de base de datos
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static handleDatabaseError(err, req, res, next) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'El recurso ya existe',
        error: 'DUPLICATE_ENTRY',
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        message: 'Referencia inválida',
        error: 'INVALID_REFERENCE',
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }

    if (err.code && err.code.startsWith('ER_')) {
      return res.status(500).json({
        success: false,
        message: 'Error de base de datos',
        error: 'DATABASE_ERROR',
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }

    next(err);
  }

  /**
   * Middleware para manejar errores de sintaxis JSON
   * @param {Error} err - Error de sintaxis JSON
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static handleJsonError(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        success: false,
        message: 'JSON inválido en el cuerpo de la solicitud',
        error: 'INVALID_JSON',
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }
    next(err);
  }

  /**
   * Middleware para manejar errores 404 (Not Found)
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   */
  static handleNotFound(req, res) {
    res.status(404).json({
      success: false,
      message: 'Endpoint no encontrado',
      error: 'NOT_FOUND',
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    });
  }

  /**
   * Middleware para manejo general de errores
   * @param {Error} err - Error general
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static handleGeneralError(err, req, res, next) {
    // Log del error para debugging (se puede configurar con un sistema de logging)
    console.error('Error no manejado:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    // Determinar el código de estado apropiado
    const statusCode = err.statusCode || err.status || 500;
    
    // Respuesta al cliente
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Error interno del servidor',
      error: err.name || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  /**
   * Middleware para manejar errores de timeout
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   */
  static handleTimeout(req, res) {
    res.status(408).json({
      success: false,
      message: 'La solicitud ha excedido el tiempo límite',
      error: 'REQUEST_TIMEOUT',
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });
  }
}

module.exports = ErrorMiddleware;
