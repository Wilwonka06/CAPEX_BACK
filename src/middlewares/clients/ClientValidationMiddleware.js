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
  // Datos del usuario (requeridos)
  body('tipo_documento')
    .isIn(['Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'])
    .withMessage('El tipo de documento debe ser: Pasaporte, Cedula de ciudadania, o Cedula de extranjeria'),
  
  body('documento')
    .isString()
    .isLength({ min: 1, max: 20 })
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('El número de documento debe tener entre 1 y 20 caracteres alfanuméricos'),
  
  body('primer_nombre')
    .isString()
    .isLength({ min: 1, max: 50 })
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage('El primer nombre debe tener entre 1 y 50 caracteres y solo letras'),
  
  body('apellido')
    .isString()
    .isLength({ min: 1, max: 50 })
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage('El apellido debe tener entre 1 y 50 caracteres y solo letras'),
  
  body('correo')
    .isEmail()
    .withMessage('El correo electrónico debe ser válido'),
  
  body('telefono')
    .matches(/^\+[0-9]{7,15}$/)
    .withMessage('El teléfono debe tener formato internacional (+1234567890)'),
  
  body('contrasena')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/)
    .withMessage('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales'),
  
  // Datos del cliente (opcionales)
  body('direccion')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),
  
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
  
  // Datos del usuario (opcionales)
  body('tipo_documento')
    .optional()
    .isIn(['Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'])
    .withMessage('El tipo de documento debe ser: Pasaporte, Cedula de ciudadania, o Cedula de extranjeria'),
  
  body('documento')
    .optional()
    .isString()
    .isLength({ min: 1, max: 20 })
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('El número de documento debe tener entre 1 y 20 caracteres alfanuméricos'),
  
  body('primer_nombre')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage('El primer nombre debe tener entre 1 y 50 caracteres y solo letras'),
  
  body('apellido')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage('El apellido debe tener entre 1 y 50 caracteres y solo letras'),
  
  body('correo')
    .optional()
    .isEmail()
    .withMessage('El correo electrónico debe ser válido'),
  
  body('telefono')
    .optional()
    .matches(/^\+[0-9]{7,15}$/)
    .withMessage('El teléfono debe tener formato internacional (+1234567890)'),
  
  body('contrasena')
    .optional()
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/)
    .withMessage('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales'),
  
  // Datos del cliente (opcionales)
  body('direccion')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),
  
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

// Validations for getting client by user ID
const validateUserId = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('ID del usuario debe ser un entero positivo'),
  
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