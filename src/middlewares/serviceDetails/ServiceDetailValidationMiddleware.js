const { body, param, validationResult } = require('express-validator');

class ServiceDetailValidationMiddleware {
  // Validación para crear un detalle de servicio
  static validateCreate() {
    return [
      body('id_servicio_cliente')
        .isInt({ min: 1 })
        .withMessage('El ID del servicio cliente debe ser un número entero positivo'),
      
      body('id_servicio')
        .isInt({ min: 1 })
        .withMessage('El ID del servicio debe ser un número entero positivo'),
      
      body('id_empleado')
        .isInt({ min: 1 })
        .withMessage('El ID del empleado debe ser un número entero positivo'),
      
      body('precio_unitario')
        .isFloat({ min: 0 })
        .withMessage('El precio unitario debe ser un número positivo'),
      
      body('cantidad')
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un número entero mayor a 0'),
      
      body('hora_inicio')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('La hora de inicio debe tener formato HH:MM:SS'),
      
      body('hora_finalizacion')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('La hora de finalización debe tener formato HH:MM:SS'),
      
      body('duracion')
        .isInt({ min: 1 })
        .withMessage('La duración debe ser un número entero mayor a 0'),
      
      body('estado')
        .optional()
        .isIn(['En ejecución', 'Pagado'])
        .withMessage('El estado debe ser "En ejecución" o "Pagado"'),
      
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
          });
        }
        next();
      }
    ];
  }

  // Validación para actualizar un detalle de servicio
  static validateUpdate() {
    return [
      param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo'),
      
      body('id_servicio_cliente')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID del servicio cliente debe ser un número entero positivo'),
      
      body('id_servicio')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID del servicio debe ser un número entero positivo'),
      
      body('id_empleado')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID del empleado debe ser un número entero positivo'),
      
      body('precio_unitario')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio unitario debe ser un número positivo'),
      
      body('cantidad')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un número entero mayor a 0'),
      
      body('hora_inicio')
        .optional()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('La hora de inicio debe tener formato HH:MM:SS'),
      
      body('hora_finalizacion')
        .optional()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('La hora de finalización debe tener formato HH:MM:SS'),
      
      body('duracion')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La duración debe ser un número entero mayor a 0'),
      
      body('estado')
        .optional()
        .isIn(['En ejecución', 'Pagado'])
        .withMessage('El estado debe ser "En ejecución" o "Pagado"'),
      
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
          });
        }
        next();
      }
    ];
  }

  // Validación para obtener por ID
  static validateGetById() {
    return [
      param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo'),
      
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
          });
        }
        next();
      }
    ];
  }

  // Validación para eliminar
  static validateDelete() {
    return [
      param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo'),
      
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
          });
        }
        next();
      }
    ];
  }

  // Validación para cambiar estado
  static validateChangeStatus() {
    return [
      param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo'),
      
      body('estado')
        .isIn(['En ejecución', 'Pagado'])
        .withMessage('El estado debe ser "En ejecución" o "Pagado"'),
      
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
          });
        }
        next();
      }
    ];
  }

  // Validación para obtener por servicio cliente
  static validateGetByServiceClient() {
    return [
      param('serviceClientId')
        .isInt({ min: 1 })
        .withMessage('El ID del servicio cliente debe ser un número entero positivo'),
      
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
          });
        }
        next();
      }
    ];
  }

  // Validación para obtener por empleado
  static validateGetByEmployee() {
    return [
      param('employeeId')
        .isInt({ min: 1 })
        .withMessage('El ID del empleado debe ser un número entero positivo'),
      
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
          });
        }
        next();
      }
    ];
  }
}

module.exports = ServiceDetailValidationMiddleware;
