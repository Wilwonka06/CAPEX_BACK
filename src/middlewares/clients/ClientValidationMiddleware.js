const { body, param, validationResult } = require('express-validator');
// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validations for creating client
const validateCreateClient = [
  body('id_usuario')
    .isInt({ min: 1 })
    .withMessage('El ID de usuario debe ser un entero positivo'),  

  // Dirección (opcional)
  body('direccion')
    .optional()
    .isLength({ max: 50 })
    .withMessage('La dirección no puede exceder 50 caracteres'),
  
  // Estado (opcional)
  body('estado')
    .optional()
    .isBoolean()
    .withMessage('El estado debe ser un valor booleano'),  
  handleValidationErrors
];

// Validations for updating client
const validateUpdateClient = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID del cliente debe ser un entero positivo'),
    
  // Dirección (opcional)
  body('direccion')
    .optional()
    .isLength({ max: 50 })
    .withMessage('La dirección no puede exceder 50 caracteres'),
  
  // Estado (opcional)
  body('estado')
    .optional()
    .isBoolean()
    .withMessage('El estado debe ser un valor booleano'),  
  handleValidationErrors
];

// Validations for getting client by ID
const validateClientId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID del cliente debe ser un entero positivo'),
  
  handleValidationErrors
];

// Validations for deleting client
const validateDeleteClient = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID del cliente debe ser un entero positivo'),
  
  handleValidationErrors
];

// Validations for creating user and client (for future use)
const validateCreateUserAndClient = [
  // User data validations (will be implemented when User model is available)
  body('userData')
    .isObject()
    .withMessage('Los datos del usuario son requeridos'),
  
  // Client data validations
  body('clientData.direccion')
    .optional()
    .isLength({ max: 50 })
    .withMessage('La dirección no puede exceder 50 caracteres'),
  
  body('clientData.estado')
    .optional()
    .isBoolean()
    .withMessage('El estado debe ser un valor booleano'),
  
  handleValidationErrors
];
module.exports = {
  validateCreateClient,
  validateUpdateClient,
  validateClientId,
  validateUserId,
  validateDeleteClient,
  validateCreateUserAndClient,
  handleValidationErrors
};