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

// Validations for creating employee
const validateCreateEmployee = [
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
  
  // Datos del empleado (opcionales)
  body('direccion')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La dirección no puede exceder 1000 caracteres'),
  
  body('estado')
    .optional()
    .isIn(['Activo', 'Inactivo'])
    .withMessage('El estado debe ser Activo o Inactivo'),
  
  // Para empleados, el concepto_estado es requerido cuando se cambia el estado
  body('concepto_estado')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('El concepto del estado no puede exceder 1000 caracteres'),
  
  handleValidationErrors
];

// Validations for updating employee
const validateUpdateEmployee = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID del empleado debe ser un entero positivo'),
  
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
  
  body('foto')
    .optional()
    .isURL()
    .withMessage('La foto debe ser una URL válida'),
  
  body('direccion')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La dirección no puede exceder 1000 caracteres'),
  
  body('estado')
    .optional()
    .isIn(['Activo', 'Inactivo'])
    .withMessage('El estado debe ser Activo o Inactivo'),
  
  // Para empleados, el concepto_estado es requerido cuando se cambia el estado
  body('concepto_estado')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('El concepto del estado no puede exceder 1000 caracteres'),
  
  handleValidationErrors
];

// Validations for deleting employee
const validateDeleteEmployee = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID del empleado debe ser un entero positivo'),
  
  handleValidationErrors
];

// Validations for changing employee status
const validateChangeEmployeeStatus = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID del empleado debe ser un entero positivo'),
  
  body('estado')
    .isIn(['Activo', 'Inactivo'])
    .withMessage('El estado debe ser Activo o Inactivo'),
  
  // El concepto_estado es requerido cuando se cambia el estado de un empleado
  body('concepto_estado')
    .notEmpty()
    .withMessage('El concepto del estado es requerido para empleados')
    .isLength({ max: 1000 })
    .withMessage('El concepto del estado no puede exceder 1000 caracteres'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateDeleteEmployee,
  validateChangeEmployeeStatus
};
