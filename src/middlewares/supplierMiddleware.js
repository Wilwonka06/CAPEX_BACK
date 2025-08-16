const { body, query, param } = require('express-validator');
const { validateRequest } = require('./validationMiddleware');

// Validaciones para crear proveedor
const validateCreateProveedor = [
  body('nit')
    .trim()
    .notEmpty()
    .withMessage('El NIT es requerido')
    .isLength({ min: 2, max: 20 })
    .withMessage('El NIT debe tener entre 2 y 20 caracteres')
    .matches(/^[A-Za-z][0-9]+$/)
    .withMessage('El NIT debe comenzar con una letra seguida de números'),
  
  body('tipo_proveedor')
    .trim()
    .notEmpty()
    .withMessage('El tipo de proveedor es requerido')
    .isIn(['N', 'J'])
    .withMessage('El tipo de proveedor debe ser N (Natural) o J (Jurídico)'),
  
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del proveedor es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  
  body('contacto')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El contacto no puede exceder 255 caracteres'),
  
  body('direccion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La dirección no puede exceder 255 caracteres'),
  
  body('correo')
    .optional()
    .trim()
    .isEmail()
    .withMessage('El correo debe tener un formato válido')
    .isLength({ max: 255 })
    .withMessage('El correo no puede exceder 255 caracteres'),
  
  body('telefono')
    .optional()
    .trim()
    .matches(/^\+[0-9]{7,15}$/)
    .withMessage('El teléfono debe tener formato internacional (+1234567890)'),
  
  body('estado')
    .optional()
    .trim()
    .isIn(['Activo', 'Inactivo'])
    .withMessage('El estado debe ser Activo o Inactivo'),
  
  validateRequest
];

// Validaciones para actualizar proveedor
const validateUpdateProveedor = [
  body('nit')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El NIT no puede estar vacío')
    .isLength({ min: 2, max: 20 })
    .withMessage('El NIT debe tener entre 2 y 20 caracteres')
    .matches(/^[A-Za-z][0-9]+$/)
    .withMessage('El NIT debe comenzar con una letra seguida de números'),
  
  body('tipo_proveedor')
    .optional()
    .trim()
    .isIn(['N', 'J'])
    .withMessage('El tipo de proveedor debe ser N (Natural) o J (Jurídico)'),
  
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre del proveedor no puede estar vacío')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  
  body('contacto')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El contacto no puede exceder 255 caracteres'),
  
  body('direccion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La dirección no puede exceder 255 caracteres'),
  
  body('correo')
    .optional()
    .trim()
    .isEmail()
    .withMessage('El correo debe tener un formato válido')
    .isLength({ max: 255 })
    .withMessage('El correo no puede exceder 255 caracteres'),
  
  body('telefono')
    .optional()
    .trim()
    .matches(/^\+[0-9]{7,15}$/)
    .withMessage('El teléfono debe tener formato internacional (+1234567890)'),
  
  body('estado')
    .optional()
    .trim()
    .isIn(['Activo', 'Inactivo'])
    .withMessage('El estado debe ser Activo o Inactivo'),
  
  validateRequest
];

// Validaciones para búsqueda de proveedores
const validateSearchProveedor = [
  query('nombre')
    .trim()
    .notEmpty()
    .withMessage('El parámetro nombre es requerido para la búsqueda')
    .isLength({ min: 2 })
    .withMessage('El término de búsqueda debe tener al menos 2 caracteres'),
  
  validateRequest
];

// Validaciones para filtro por estado
const validateEstadoProveedor = [
  param('estado')
    .trim()
    .isIn(['Activo', 'Inactivo'])
    .withMessage('El estado debe ser Activo o Inactivo'),
  
  validateRequest
];

// Validaciones para filtros adicionales
const validateFilterProveedor = [
  query('tipo_proveedor')
    .optional()
    .trim()
    .isIn(['N', 'J'])
    .withMessage('El tipo de proveedor debe ser N o J'),
  
  query('estado')
    .optional()
    .trim()
    .isIn(['Activo', 'Inactivo'])
    .withMessage('El estado debe ser Activo o Inactivo'),
  
  validateRequest
];

module.exports = {
  validateCreateProveedor,
  validateUpdateProveedor,
  validateSearchProveedor,
  validateEstadoProveedor,
  validateFilterProveedor
};
