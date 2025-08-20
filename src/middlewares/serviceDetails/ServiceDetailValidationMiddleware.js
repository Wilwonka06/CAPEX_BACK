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

// Validations for creating service detail
const validateCreateServiceDetail = [
  body('id_employee')
    .isInt({ min: 1 })
    .withMessage('Employee ID must be a positive integer'),
  
  body('id_service')
    .isInt({ min: 1 })
    .withMessage('Service ID must be a positive integer'),
  
  body('id_service_client')
    .isInt({ min: 1 })
    .withMessage('Service client ID must be a positive integer'),
  
  body('unit_price')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  
  body('start_time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM:SS format'),
  
  body('end_time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM:SS format'),
  
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  
  body('status')
    .optional()
    .isIn(['Agendada', 'Confirmada', 'Reprogramada', 'En proceso', 'Finalizada', 'Pagada', 'Cancelada por el cliente', 'No asistio'])
    .withMessage('Invalid status'),
  
  handleValidationErrors
];

// Validations for updating service detail
const validateUpdateServiceDetail = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Service detail ID must be a positive integer'),
  
  body('id_employee')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Employee ID must be a positive integer'),
  
  body('id_service')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Service ID must be a positive integer'),
  
  body('id_service_client')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Service client ID must be a positive integer'),
  
  body('unit_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  
  body('start_time')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM:SS format'),
  
  body('end_time')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM:SS format'),
  
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  
  body('status')
    .optional()
    .isIn(['Agendada', 'Confirmada', 'Reprogramada', 'En proceso', 'Finalizada', 'Pagada', 'Cancelada por el cliente', 'No asistio'])
    .withMessage('Invalid status'),
  
  handleValidationErrors
];

// Validations for getting service detail by ID
const validateServiceDetailId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Service detail ID must be a positive integer'),
  
  handleValidationErrors
];

// Validations for deleting service detail
const validateDeleteServiceDetail = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Service detail ID must be a positive integer'),
  
  handleValidationErrors
];

// Validations for updating service detail status
const validateUpdateStatus = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Service detail ID must be a positive integer'),
  
  body('status')
    .isIn(['Agendada', 'Confirmada', 'Reprogramada', 'En proceso', 'Finalizada', 'Pagada', 'Cancelada por el cliente', 'No asistio'])
    .withMessage('Invalid status'),
  
  handleValidationErrors
];

// Validations for getting service details by status
const validateStatus = [
  param('status')
    .isIn(['Agendada', 'Confirmada', 'Reprogramada', 'En proceso', 'Finalizada', 'Pagada', 'Cancelada por el cliente', 'No asistio'])
    .withMessage('Invalid status'),
  
  handleValidationErrors
];

// Validations for getting service details by employee
const validateEmployeeId = [
  param('employeeId')
    .isInt({ min: 1 })
    .withMessage('Employee ID must be a positive integer'),
  
  handleValidationErrors
];

// Validations for getting service details by date range
const validateDateRange = [
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  
  handleValidationErrors
];

// Validations for converting to sale
const validateConvertToSale = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Service detail ID must be a positive integer'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateServiceDetail,
  validateUpdateServiceDetail,
  validateServiceDetailId,
  validateDeleteServiceDetail,
  validateUpdateStatus,
  validateStatus,
  validateEmployeeId,
  validateDateRange,
  validateConvertToSale,
  handleValidationErrors
};
