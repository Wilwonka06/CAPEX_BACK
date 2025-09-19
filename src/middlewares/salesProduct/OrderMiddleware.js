const { body, query, param } = require('express-validator');
const ValidationMiddleware = require('../ValidationMiddleware');

// Validaciones para crear pedido
const validateCreatePedido = [
  body('fecha')
    .isDate()
    .withMessage('La fecha debe ser una fecha válida')
    .notEmpty()
    .withMessage('La fecha es requerida'),
  
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
  
  ValidationMiddleware.validate
];

// Validaciones para actualizar pedido
const validateUpdatePedido = [
  body('fecha')
    .optional()
    .isDate()
    .withMessage('La fecha debe ser una fecha válida'),
  
  body('estado')
    .optional()
    .isIn(['Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'])
    .withMessage('El estado debe ser: Pendiente, En proceso, Enviado, Entregado o Cancelado'),
  
  body('productos')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Si se incluyen productos, debe haber al menos uno'),
  
  body('productos.*.id_producto')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del producto debe ser un número entero positivo'),
  
  body('productos.*.cantidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
  
  body('productos.*.precio_unitario')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El precio unitario debe ser un número mayor a 0.01'),
  
  ValidationMiddleware.validate
];

// Validaciones para cambiar estado
const validateCambiarEstado = [
  body('estado')
    .isIn(['Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'])
    .withMessage('El estado debe ser: Pendiente, En proceso, Enviado, Entregado o Cancelado'),
  
  ValidationMiddleware.validate
];

// Validaciones para búsqueda global
const validateSearchPedidos = [
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

// Validaciones para filtrar por estado
const validateEstadoParam = [
  param('estado')
    .isIn(['Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'])
    .withMessage('El estado debe ser: Pendiente, En proceso, Enviado, Entregado o Cancelado'),
  
  ValidationMiddleware.validate
];

// Validaciones para filtrar por fechas
const validateFechasQuery = [
  query('fecha_inicio')
    .isDate()
    .withMessage('La fecha de inicio debe ser una fecha válida'),
  
  query('fecha_fin')
    .isDate()
    .withMessage('La fecha de fin debe ser una fecha válida'),
  
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
  validateCreatePedido,
  validateUpdatePedido,
  validateCambiarEstado,
  validateSearchPedidos,
  validateEstadoParam,
  validateFechasQuery,
  validatePagination
};