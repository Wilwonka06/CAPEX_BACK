const { body, query, param } = require('express-validator');
const ValidationMiddleware = require('./ValidationMiddleware');

// Validaciones para crear compra
const validateCreateCompra = [
  body('id_proveedor')
    .isInt({ min: 1 })
    .withMessage('El ID del proveedor es requerido y debe ser un número entero positivo'),
  
  body('fecha_compra')
    .isDate()
    .withMessage('La fecha de compra debe ser una fecha válida (YYYY-MM-DD)'),
  
  body('observaciones')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden exceder 1000 caracteres'),
  
  body('detalles')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un detalle de compra'),
  
  body('detalles.*.id_producto')
    .isInt({ min: 1 })
    .withMessage('El ID del producto es requerido y debe ser un número entero positivo'),
  
  body('detalles.*.cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  
  body('detalles.*.precio_unitario')
    .isFloat({ min: 0.01, max: 9999999.99 })
    .withMessage('El precio unitario debe ser un número entre 0.01 y 9,999,999.99'),
  
  ValidationMiddleware.validate
];

// Validaciones para parámetros de ID
const validateCompraId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de la compra debe ser un número entero positivo'),
  
  ValidationMiddleware.validate
];

// Validaciones para filtros por proveedor
const validateProveedorId = [
  param('idProveedor')
    .isInt({ min: 1 })
    .withMessage('El ID del proveedor debe ser un número entero positivo'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  
  ValidationMiddleware.validate
];

// Validaciones para filtros por fecha
const validateFechaFilter = [
  query('fecha_inicio')
    .optional()
    .isDate()
    .withMessage('La fecha de inicio debe ser una fecha válida (YYYY-MM-DD)'),
  
  query('fecha_fin')
    .optional()
    .isDate()
    .withMessage('La fecha de fin debe ser una fecha válida (YYYY-MM-DD)'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  
  ValidationMiddleware.validate
];

// Validaciones para paginación
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  
  query('includeDetalles')
    .optional()
    .isBoolean()
    .withMessage('includeDetalles debe ser true o false'),
  
  ValidationMiddleware.validate
];

module.exports = {
  validateCreateCompra,
  validateCompraId,
  validateProveedorId,
  validateFechaFilter,
  validatePagination
};