/**
 * Middleware para estandarizar las respuestas de la API
 */
class ResponseMiddleware {
  /**
   * Respuesta exitosa
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje de éxito
   * @param {*} data - Datos a enviar
   * @param {number} statusCode - Código de estado HTTP (default: 200)
   */
  static success(res, message, data = null, statusCode = 200) {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Respuesta de error
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje de error
   * @param {*} error - Detalles del error
   * @param {number} statusCode - Código de estado HTTP (default: 500)
   */
  static error(res, message, error = null, statusCode = 500) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      ...(error && { error: error.message || error })
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Agregar headers estándar a la respuesta
   * @param {Object} res - Objeto response de Express
   */
  static addStandardHeaders(res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-API-Version', '1.0.0');
    res.setHeader('X-Response-Time', Date.now());
  }
}

module.exports = ResponseMiddleware;
