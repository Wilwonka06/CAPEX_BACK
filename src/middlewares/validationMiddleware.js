const { validationResult } = require('express-validator');

/**
 * Middleware de validación reutilizable
 * Este middleware valida los datos de entrada usando express-validator
 * y proporciona respuestas consistentes para otros desarrolladores
 */
class ValidationMiddleware {
  /**
   * Middleware para validar los resultados de express-validator
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static validate(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        error: 'VALIDATION_ERROR',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        })),
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }
    
    next();
  }

  /**
   * Middleware para validar IDs numéricos
   * @param {string} paramName - Nombre del parámetro a validar
   * @returns {Function} Middleware de validación
   */
  static validateId(paramName = 'id') {
    return (req, res, next) => {
      const id = req.params[paramName];
      
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return res.status(400).json({
          success: false,
          message: `El parámetro ${paramName} debe ser un ID válido`,
          error: 'INVALID_ID',
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        });
      }
      
      // Convertir a número y asignar al request
      req.params[paramName] = parseInt(id);
      next();
    };
  }

  /**
   * Middleware para validar paginación
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Function} next - Función next de Express
   */
  static validatePagination(req, res, next) {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro page debe ser un número mayor a 0',
        error: 'INVALID_PAGE',
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }
    
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro limit debe ser un número entre 1 y 100',
        error: 'INVALID_LIMIT',
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }
    
    // Asignar valores validados al request
    req.query.page = pageNum;
    req.query.limit = limitNum;
    req.query.offset = (pageNum - 1) * limitNum;
    
    next();
  }

  /**
   * Middleware para validar campos requeridos
   * @param {Array} requiredFields - Array de campos requeridos
   * @returns {Function} Middleware de validación
   */
  static validateRequiredFields(requiredFields) {
    return (req, res, next) => {
      const missingFields = [];
      
      requiredFields.forEach(field => {
        if (!req.body[field] || req.body[field].toString().trim() === '') {
          missingFields.push(field);
        }
      });
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Campos requeridos faltantes',
          error: 'MISSING_FIELDS',
          missingFields,
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        });
      }
      
      next();
    };
  }

  /**
   * Middleware para validar tipos de archivo
   * @param {Array} allowedTypes - Array de tipos MIME permitidos
   * @param {string} fieldName - Nombre del campo de archivo
   * @returns {Function} Middleware de validación
   */
  static validateFileType(allowedTypes, fieldName = 'file') {
    return (req, res, next) => {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se ha proporcionado ningún archivo',
          error: 'NO_FILE',
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        });
      }
      
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de archivo no permitido',
          error: 'INVALID_FILE_TYPE',
          allowedTypes,
          receivedType: req.file.mimetype,
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        });
      }
      
      next();
    };
  }

  /**
   * Middleware para validar tamaño de archivo
   * @param {number} maxSize - Tamaño máximo en bytes
   * @param {string} fieldName - Nombre del campo de archivo
   * @returns {Function} Middleware de validación
   */
  static validateFileSize(maxSize, fieldName = 'file') {
    return (req, res, next) => {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se ha proporcionado ningún archivo',
          error: 'NO_FILE',
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        });
      }
      
      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'El archivo excede el tamaño máximo permitido',
          error: 'FILE_TOO_LARGE',
          maxSize: maxSize,
          fileSize: req.file.size,
          timestamp: new Date().toISOString(),
          path: req.originalUrl
        });
      }
      
      next();
    };
  }
}

module.exports = ValidationMiddleware;
