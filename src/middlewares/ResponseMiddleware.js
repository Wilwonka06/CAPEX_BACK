/**
 * Middleware para estandarizar respuestas de la API
 * Este middleware proporciona métodos consistentes para enviar respuestas
 * que otros desarrolladores puedan consumir de manera predecible
 */
class ResponseMiddleware {
  /**
   * Middleware para estandarizar respuestas exitosas
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static standardizeResponse(req, res, next) {
    // Método para respuestas exitosas
    res.success = (data = null, message = 'Operación exitosa', statusCode = 200) => {
      const response = {
        success: true,
        message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      };

      if (data !== null) {
        response.data = data;
      }

      return res.status(statusCode).json(response);
    };

    // Método para respuestas de creación exitosa
    res.created = (data = null, message = 'Recurso creado exitosamente') => {
      return res.success(data, message, 201);
    };

    // Método para respuestas de actualización exitosa
    res.updated = (data = null, message = 'Recurso actualizado exitosamente') => {
      return res.success(data, message, 200);
    };

    // Método para respuestas de eliminación exitosa
    res.deleted = (message = 'Recurso eliminado exitosamente') => {
      return res.success(null, message, 200);
    };

    // Método para respuestas de lista paginada
    res.paginated = (data, page, limit, total, message = 'Lista obtenida exitosamente') => {
      const response = {
        success: true,
        message,
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        },
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      };

      return res.status(200).json(response);
    };

    // Método para respuestas de error
    res.error = (message, errorCode = 'ERROR', statusCode = 400) => {
      const response = {
        success: false,
        message,
        error: errorCode,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      };

      return res.status(statusCode).json(response);
    };

    // Método para respuestas de error de validación
    res.validationError = (errors, message = 'Error de validación') => {
      const response = {
        success: false,
        message,
        error: 'VALIDATION_ERROR',
        errors,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      };

      return res.status(400).json(response);
    };

    // Método para respuestas de error de autenticación
    res.unauthorized = (message = 'No autorizado') => {
      return res.error(message, 'UNAUTHORIZED', 401);
    };

    // Método para respuestas de error de autorización
    res.forbidden = (message = 'Acceso prohibido') => {
      return res.error(message, 'FORBIDDEN', 403);
    };

    // Método para respuestas de recurso no encontrado
    res.notFound = (message = 'Recurso no encontrado') => {
      return res.error(message, 'NOT_FOUND', 404);
    };

    // Método para respuestas de conflicto
    res.conflict = (message = 'Conflicto con el estado actual del recurso') => {
      return res.error(message, 'CONFLICT', 409);
    };

    // Método para respuestas de error interno del servidor
    res.internalError = (message = 'Error interno del servidor') => {
      return res.error(message, 'INTERNAL_ERROR', 500);
    };

    // Método para respuestas de servicio no disponible
    res.serviceUnavailable = (message = 'Servicio no disponible') => {
      return res.error(message, 'SERVICE_UNAVAILABLE', 503);
    };

    next();
  }

  /**
   * Método estático para enviar errores desde middlewares
   */
  static sendError(res, statusCode, message, errorCode = 'ERROR') {
    const response = {
      success: false,
      message,
      error: errorCode,
      timestamp: new Date().toISOString()
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Middleware para agregar headers de respuesta estándar
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static addStandardHeaders(req, res, next) {
    // Headers de seguridad
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Headers de información de la API
    res.setHeader('X-API-Version', '1.0.0');
    res.setHeader('X-Request-ID', req.headers['x-request-id'] || generateRequestId());
    
    // Headers de CORS (se pueden configurar según necesidades)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    next();
  }

  /**
   * Middleware para agregar información de rate limiting
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static addRateLimitInfo(req, res, next) {
    // Este middleware se puede usar en conjunto con un sistema de rate limiting
    // Por ahora solo agregamos headers informativos
    res.setHeader('X-RateLimit-Limit', '100');
    res.setHeader('X-RateLimit-Remaining', '99'); // Se actualizaría dinámicamente
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + 3600000).toISOString());
    
    next();
  }
}

/**
 * Genera un ID único para cada request
 * @returns {string} ID único del request
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = ResponseMiddleware;
