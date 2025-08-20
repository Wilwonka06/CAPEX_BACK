const { body, param, validationResult } = require('express-validator');
const ServiceDetailService = require('../../services/serviceDetails/ServiceDetailService');

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

// Middleware to validate that paid services cannot be modified
const validatePaidServiceModification = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get the service detail to check its status
    const serviceDetailResult = await ServiceDetailService.getServiceDetailById(id);
    
    if (!serviceDetailResult.success) {
      return res.status(404).json({
        success: false,
        message: 'Service detail not found'
      });
    }
    
    const serviceDetail = serviceDetailResult.data;
    
    // Check if the service is in "Pagada" status
    if (serviceDetail.status === 'Pagada') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify, delete, or change status of a paid service. Paid services are locked for data integrity.',
        error: 'PAID_SERVICE_LOCKED'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error validating service detail status',
      error: error.message
    });
  }
};

// Middleware to validate that paid services cannot have their status changed
const validatePaidServiceStatusChange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Get the service detail to check its current status
    const serviceDetailResult = await ServiceDetailService.getServiceDetailById(id);
    
    if (!serviceDetailResult.success) {
      return res.status(404).json({
        success: false,
        message: 'Service detail not found'
      });
    }
    
    const serviceDetail = serviceDetailResult.data;
    
    // Check if the service is currently in "Pagada" status
    if (serviceDetail.status === 'Pagada') {
      return res.status(403).json({
        success: false,
        message: 'Cannot change the status of a paid service. Paid services are locked for data integrity.',
        error: 'PAID_SERVICE_LOCKED'
      });
    }
    
    // Check if trying to change to "Pagada" status (this should be done through the convertToSale endpoint)
    if (status === 'Pagada') {
      return res.status(403).json({
        success: false,
        message: 'To convert a service to paid status, use the dedicated convert-to-sale endpoint.',
        error: 'USE_CONVERT_TO_SALE_ENDPOINT'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error validating service detail status change',
      error: error.message
    });
  }
};

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
  validatePaidServiceModification,
  validatePaidServiceStatusChange,
  handleValidationErrors
};
