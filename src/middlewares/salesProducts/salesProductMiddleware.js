const { body, query } = require('express-validator');
const ValidationMiddleware = require('./ValidationMiddleware');

// Validaciones para crear venta de producto
const validateCreateVentaProducto = [
  body('fecha')
    .notEmpty()
    .withMessage('La fecha es requerida')
    .isISO8601()
    .withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
  
  body('id_cliente')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del cliente debe ser un número entero positivo'),
  
  body('estado')
    .optional()
    .trim()
    .isIn(['Completado', 'Cancelado', 'Pendiente'])
    .withMessage('El estado debe ser: Completado, Cancelado o Pendiente'),
  
  body('detalles')
    .isArray({ min: 1 })
    .withMessage('Se requiere al menos un detalle de venta'),
  
  body('detalles.*.id_producto')
    .isInt({ min: 1 })
    .withMessage('El ID del producto es requerido y debe ser un número entero positivo'),
  
  body('detalles.*.cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad es requerida y debe ser un número entero positivo'),
  
  body('detalles.*.precio_unitario')
    .isFloat({ min: 0.01 })
    .withMessage('El precio unitario es requerido y debe ser un número positivo'),
  
  ValidationMiddleware.validate
];

// Validaciones para actualizar venta de producto
const validateUpdateVentaProducto = [
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
  
  body('id_cliente')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del cliente debe ser un número entero positivo'),
  
  body('estado')
    .optional()
    .trim()
    .isIn(['Completado', 'Cancelado', 'Pendiente'])
    .withMessage('El estado debe ser: Completado, Cancelado o Pendiente'),
  
  body('total')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El total debe ser un número no negativo'),
  
  body('detalles')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Los detalles deben ser un array con al menos un elemento'),
  
  body('detalles.*.id_producto')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del producto debe ser un número entero positivo'),
  
  body('detalles.*.cantidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  
  body('detalles.*.precio_unitario')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El precio unitario debe ser un número positivo'),
  
  ValidationMiddleware.validate
];

// Validaciones para búsqueda global de ventas
const validateSearchVentas = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('El parámetro de búsqueda "q" es requerido')
    .isLength({ min: 1 })
    .withMessage('El término de búsqueda debe tener al menos 1 caracter'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100'),
  
  ValidationMiddleware.validate
];

// Validaciones para filtros de fechas
const validateFechasFilter = [
  query('inicio')
    .notEmpty()
    .withMessage('La fecha de inicio es requerida')
    .isISO8601()
    .withMessage('La fecha de inicio debe tener un formato válido (YYYY-MM-DD)'),
  
  query('fin')
    .notEmpty()
    .withMessage('La fecha de fin es requerida')
    .isISO8601()
    .withMessage('La fecha de fin debe tener un formato válido (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (req.query.inicio && new Date(value) < new Date(req.query.inicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100'),
  
  ValidationMiddleware.validate
];

// Validaciones para paginación estándar
const validatePaginacion = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100'),
  
  ValidationMiddleware.validate
];

// Validaciones para límite de productos más vendidos
const validateProductosMasVendidos = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('El límite debe ser un número entero entre 1 y 50'),
  
  ValidationMiddleware.validate
];

// Validaciones para parámetros de ID
const validateIdParam = [
  ValidationMiddleware.validateIdParam,
  ValidationMiddleware.validate
];

module.exports = {
  validateCreateVentaProducto,
  validateUpdateVentaProducto,
  validateSearchVentas,
  validateFechasFilter,
  validatePaginacion,
  validateProductosMasVendidos,
  validateIdParam
};