/**
 * Archivo índice para todos los middlewares de la API
 * Versión simplificada - solo lo esencial
 */

// Middlewares básicos
const ErrorMiddleware = require('./ErrorMiddleware');
const ValidationMiddleware = require('./ValidationMiddleware');
const ResponseMiddleware = require('./ResponseMiddleware');
const SecurityMiddleware = require('./SecurityMiddleware');

// Exportar middlewares individuales
module.exports = {
  ErrorMiddleware,
  ValidationMiddleware,
  ResponseMiddleware,
  SecurityMiddleware
};

// Configuraciones básicas predefinidas
module.exports.commonMiddleware = {
  // Middleware básico para todas las rutas
  basic: [
    ResponseMiddleware.standardizeResponse,
    ResponseMiddleware.addStandardHeaders,
    SecurityMiddleware.preventContentInjection,
    SecurityMiddleware.sanitizeQueryParams,
    SecurityMiddleware.sanitizeUrlParams
  ],

  // Middleware para rutas que requieren validación
  withValidation: [
    ResponseMiddleware.standardizeResponse,
    ResponseMiddleware.addStandardHeaders,
    SecurityMiddleware.preventContentInjection,
    SecurityMiddleware.sanitizeQueryParams,
    SecurityMiddleware.sanitizeUrlParams,
    SecurityMiddleware.validatePayloadSize(1024 * 1024), // 1MB
    ValidationMiddleware.validate
  ]
};
