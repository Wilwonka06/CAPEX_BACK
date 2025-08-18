const { body, query, param } = require('express-validator');
const { validateRequest } = require('./validationMiddleware');

// Validaciones para crear categoría de producto
const validateCreateCategoriaProducto = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la categoría es requerido')
    .isLength({ min: 2, max: 250 })
    .withMessage('El nombre debe tener entre 2 y 250 caracteres'),
  
  body('estado')
    .optional()
    .trim()
    .isIn(['Activo', 'Inactivo'])
    .withMessage('El estado debe ser Activo o Inactivo'),
  
  validateRequest
];

// Validaciones para actualizar categoría de producto
const validateUpdateCategoriaProducto = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre de la categoría no puede estar vacío')
    .isLength({ min: 2, max: 250 })
    .withMessage('El nombre debe tener entre 2 y 250 caracteres'),
  
  body('estado')
    .optional()
    .trim()
    .isIn(['Activo', 'Inactivo'])
    .withMessage('El estado debe ser Activo o Inactivo'),
  
  validateRequest
];

// Validaciones para búsqueda de categorías
const validateSearchCategoriaProducto = [
  query('nombre')
    .trim()
    .notEmpty()
    .withMessage('El parámetro nombre es requerido para la búsqueda')
    .isLength({ min: 2 })
    .withMessage('El término de búsqueda debe tener al menos 2 caracteres'),
  
  validateRequest
];

module.exports = {
  validateCreateCategoriaProducto,
  validateUpdateCategoriaProducto,
  validateSearchCategoriaProducto
};