const { body, query, param } = require('express-validator');
const ValidationMiddleware = require('../ValidationMiddleware');

// Validaciones para crear venta
const validateCreateSale = [
  body('id_cliente')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del cliente debe ser un número entero positivo'),
  
  body('productos')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un producto'),
  
  body('productos.*.id_producto')
    .isInt({ min: 1 })
    .withMessage('El ID del producto debe ser un número entero positivo'),
  
  body('productos.*.cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
  
  body('productos.*.precio_unitario')
    .isFloat({ min: 0.01 })
    .withMessage('El precio unitario debe ser un número mayor a 0.01'),
  
  body('productos.*.descuento_unitario')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El descuento unitario debe ser un número no negativo'),
  
  body('metodo_pago')
    .optional()
    .isIn(['Efectivo', 'Tarjeta', 'Transferencia', 'Otro'])
    .withMessage('El método de pago debe ser: Efectivo, Tarjeta, Transferencia u Otro'),
  
  body('descuento')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El descuento debe ser un número no negativo'),
  
  body('observaciones')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden exceder 1000 caracteres'),
  
  ValidationMiddleware.validate
];

// Validaciones para crear venta desde pedido
const validateCreateSaleFromOrder = [
  body('pedidoId')
    .isInt({ min: 1 })
    .withMessage('El ID del pedido es requerido y debe ser un número entero positivo'),
  
  ValidationMiddleware.validate
];

// Validaciones para actualizar método de pago
const validateUpdatePaymentMethod = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de la venta debe ser un número entero positivo'),
  
  body('metodo_pago')
    .isIn(['Efectivo', 'Tarjeta', 'Transferencia', 'Otro'])
    .withMessage('El método de pago debe ser: Efectivo, Tarjeta, Transferencia u Otro'),
  
  ValidationMiddleware.validate
];

// Validaciones para parámetros de ID
const validateSaleId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de la venta debe ser un número entero positivo'),
  
  ValidationMiddleware.validate
];

// Validaciones para filtrar por estado
const validateStatusParam = [
  param('estado')
    .isIn(['Completado', 'Cancelado', 'Pendiente'])
    .withMessage('El estado debe ser: Completado, Cancelado o Pendiente'),
  
  ValidationMiddleware.validate
];

// Validaciones para filtrar por cliente
const validateClientParam = [
  param('clienteId')
    .isInt({ min: 1 })
    .withMessage('El ID del cliente debe ser un número entero positivo'),
  
  ValidationMiddleware.validate
];

// Validaciones para búsqueda global
const validateSearchSales = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('El parámetro de búsqueda "q" es requerido')
    .isLength({ min: 1 })
    .withMessage('El término de búsqueda debe tener al menos 1 carácter'),
  
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

// Validaciones para filtrar por fechas
const validateDateRangeQuery = [
  query('fecha_inicio')
    .isDate()
    .withMessage('La fecha de inicio debe ser una fecha válida (YYYY-MM-DD)'),
  
  query('fecha_fin')
    .isDate()
    .withMessage('La fecha de fin debe ser una fecha válida (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.query.fecha_inicio)) {
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
  
  ValidationMiddleware.validate
];

module.exports = {
  validateCreateSale,
  validateCreateSaleFromOrder,
  validateUpdatePaymentMethod,
  validateSaleId,
  validateStatusParam,
  validateClientParam,
  validateSearchSales,
  validateDateRangeQuery,
  validatePagination
};