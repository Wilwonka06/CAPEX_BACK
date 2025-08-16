const { body, query } = require('express-validator');
const { validateRequest } = require('./validationMiddleware');

// Validaciones para crear característica
const validateCreateCaracteristica = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la característica es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  validateRequest
];

// Validaciones para actualizar característica
const validateUpdateCaracteristica = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la característica no puede estar vacío')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  validateRequest
];

// Validaciones para búsqueda de características
const validateSearchCaracteristica = [
  query('nombre')
    .trim()
    .notEmpty()
    .withMessage('El parámetro nombre es requerido para la búsqueda')
    .isLength({ min: 2 })
    .withMessage('El término de búsqueda debe tener al menos 2 caracteres'),
  
  validateRequest
];

module.exports = {
  validateCreateCaracteristica,
  validateUpdateCaracteristica,
  validateSearchCaracteristica
};
