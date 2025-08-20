const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Validations for creating client
const validateCreateClient = [
  body('id_user')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Address cannot exceed 50 characters'),
  
  body('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean value'),
  
  handleValidationErrors
];

// Validations for updating client
const validateUpdateClient = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Client ID must be a positive integer'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Address cannot exceed 50 characters'),
  
  body('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean value'),
  
  handleValidationErrors
];

// Validations for getting client by ID
const validateClientId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Client ID must be a positive integer'),
  
  handleValidationErrors
];

// Validations for deleting client
const validateDeleteClient = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Client ID must be a positive integer'),
  
  handleValidationErrors
];

// Validations for activating/deactivating client
const validateToggleClientStatus = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Client ID must be a positive integer'),
  
  handleValidationErrors
];

// Validations for finding client by user ID
const validateUserId = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateClient,
  validateUpdateClient,
  validateClientId,
  validateDeleteClient,
  validateToggleClientStatus,
  validateUserId,
  handleValidationErrors
};
