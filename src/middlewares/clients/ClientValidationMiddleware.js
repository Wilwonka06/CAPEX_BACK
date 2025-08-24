const { body, param, validationResult } = require('express-validator');
const ClientService = require('../../services/clients/ClientService');
const bcrypt = require('bcryptjs');

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

// Helper functions for validation
const isValidAlphaOnly = (value) => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
};

const startsWithAlpha = (value) => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(value);
};

const isNumeric = (value) => {
  return /^\d+$/.test(value);
};

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const isValidPassword = (value) => {
  // Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
};

// Validations for creating client
const validateCreateClient = [
  // Tipo de documento
  body('documentType')
    .trim()
    .notEmpty()
    .withMessage('El tipo de documento es requerido'),
  
  // Nombres
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .custom((value) => {
      if (!isValidAlphaOnly(value)) {
        throw new Error('Solo se permiten letras y espacios');
      }
      if (!startsWithAlpha(value)) {
        throw new Error('Debe comenzar con una letra');
      }
      return true;
    }),
  
  // Apellidos
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .custom((value) => {
      if (!isValidAlphaOnly(value)) {
        throw new Error('Solo se permiten letras y espacios');
      }
      if (!startsWithAlpha(value)) {
        throw new Error('Debe comenzar con una letra');
      }
      return true;
    }),
  
  // Número de documento
  body('documentNumber')
    .trim()
    .notEmpty()
    .withMessage('El número de documento es requerido')
    .isLength({ min: 5, max: 20 })
    .withMessage('El número de documento debe tener entre 5 y 20 caracteres')
    .custom((value) => {
      if (!isNumeric(value)) {
        throw new Error('Solo se permiten números');
      }
      return true;
    }),
  
  // Email
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo electrónico es requerido')
    .isEmail()
    .withMessage('Correo electrónico inválido')
    .normalizeEmail(),
  
  // Teléfono
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .custom((value) => {
      if (!isNumeric(value)) {
        throw new Error('Solo se permiten números');
      }
      if (value.length < 7) {
        throw new Error('El teléfono debe tener al menos 7 dígitos');
      }
      return true;
    }),
  
  // Contraseña (requerida para crear)
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .custom((value) => {
      if (!isValidPassword(value)) {
        throw new Error('La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo');
      }
      return true;
    }),
  
  // Confirmar contraseña
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirma la contraseña')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
  
  // Dirección (opcional)
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),
  
  // Estado (opcional)
  body('status')
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
  
  // Tipo de documento (opcional)
  body('documentType')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El tipo de documento es requerido'),
  
  // Nombres (opcional)
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .custom((value) => {
      if (!isValidAlphaOnly(value)) {
        throw new Error('Solo se permiten letras y espacios');
      }
      if (!startsWithAlpha(value)) {
        throw new Error('Debe comenzar con una letra');
      }
      return true;
    }),
  
  // Apellidos (opcional)
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .custom((value) => {
      if (!isValidAlphaOnly(value)) {
        throw new Error('Solo se permiten letras y espacios');
      }
      if (!startsWithAlpha(value)) {
        throw new Error('Debe comenzar con una letra');
      }
      return true;
    }),
  
  // Número de documento (opcional)
  body('documentNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El número de documento es requerido')
    .isLength({ min: 5, max: 20 })
    .withMessage('El número de documento debe tener entre 5 y 20 caracteres')
    .custom((value) => {
      if (!isNumeric(value)) {
        throw new Error('Solo se permiten números');
      }
      return true;
    }),
  
  // Email (opcional)
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El correo electrónico es requerido')
    .isEmail()
    .withMessage('Correo electrónico inválido')
    .normalizeEmail(),
  
  // Teléfono (opcional)
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .custom((value) => {
      if (!isNumeric(value)) {
        throw new Error('Solo se permiten números');
      }
      if (value.length < 7) {
        throw new Error('El teléfono debe tener al menos 7 dígitos');
      }
      return true;
    }),
  
  // Contraseña (opcional para actualizar)
  body('password')
    .optional()
    .custom((value) => {
      if (value && !isValidPassword(value)) {
        throw new Error('La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo');
      }
      return true;
    }),
  
  // Confirmar contraseña (opcional)
  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
  
  // Dirección (opcional)
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres'),
  
  // Estado (opcional)
  body('status')
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

// Middleware to check if client email already exists
const validateClientEmailUnique = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { id } = req.params; // For updates
    
    if (!email) {
      return next();
    }
    
    // Check if client email already exists
    const existingClient = await ClientService.getClientByEmail(email);
    
    if (existingClient.success) {
      // If updating, check if it's the same client
      if (id && existingClient.data.id_client === parseInt(id)) {
        return next();
      }
      
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado',
        error: 'EMAIL_EXISTS'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al validar el correo electrónico',
      error: error.message
    });
  }
};

// Middleware to check if client document number already exists
const validateClientDocumentUnique = async (req, res, next) => {
  try {
    const { documentNumber } = req.body;
    const { id } = req.params; // For updates
    
    if (!documentNumber) {
      return next();
    }
    
    // Check if client document number already exists
    const existingClient = await ClientService.getClientByDocument(documentNumber);
    
    if (existingClient.success) {
      // If updating, check if it's the same client
      if (id && existingClient.data.id_client === parseInt(id)) {
        return next();
      }
      
      return res.status(400).json({
        success: false,
        message: 'El número de documento ya está registrado',
        error: 'DOCUMENT_EXISTS'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al validar el número de documento',
      error: error.message
    });
  }
};

// Middleware to hash password before saving
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      req.body.password = hashedPassword;
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la contraseña',
      error: error.message
    });
  }
};

module.exports = {
  validateCreateClient,
  validateUpdateClient,
  validateClientId,
  validateDeleteClient,
  validateClientEmailUnique,
  validateClientDocumentUnique,
  hashPassword,
  handleValidationErrors
};
