const { body, param, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class ServiceDetailValidationMiddleware {
  // Validación para obtener detalle de servicio por ID
  static validateGetById = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para crear detalle de servicio
  static validateCreate = [
    body('serviceId')
      .isInt().withMessage('El ID del servicio debe ser un número entero')
      .notEmpty().withMessage('El ID del servicio es requerido'),
    body('clientId')
      .isInt().withMessage('El ID del cliente debe ser un número entero')
      .notEmpty().withMessage('El ID del cliente es requerido'),
    body('employeeId')
      .isInt().withMessage('El ID del empleado debe ser un número entero')
      .notEmpty().withMessage('El ID del empleado es requerido'),
    body('unitPrice')
      .isFloat({ min: 0 }).withMessage('El precio unitario debe ser un número mayor o igual a 0')
      .notEmpty().withMessage('El precio unitario es requerido'),
    body('quantity')
      .optional()
      .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
    body('scheduledDate')
      .optional()
      .isISO8601().withMessage('La fecha programada debe tener un formato válido'),
    body('notes')
      .optional()
      .isLength({ max: 1000 }).withMessage('Las notas no pueden exceder 1000 caracteres'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para actualizar detalle de servicio
  static validateUpdate = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('serviceId')
      .optional()
      .isInt().withMessage('El ID del servicio debe ser un número entero'),
    body('clientId')
      .optional()
      .isInt().withMessage('El ID del cliente debe ser un número entero'),
    body('employeeId')
      .optional()
      .isInt().withMessage('El ID del empleado debe ser un número entero'),
    body('unitPrice')
      .optional()
      .isFloat({ min: 0 }).withMessage('El precio unitario debe ser un número mayor o igual a 0'),
    body('quantity')
      .optional()
      .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
    body('scheduledDate')
      .optional()
      .isISO8601().withMessage('La fecha programada debe tener un formato válido'),
    body('notes')
      .optional()
      .isLength({ max: 1000 }).withMessage('Las notas no pueden exceder 1000 caracteres'),
    body('paymentMethod')
      .optional()
      .isIn(['efectivo', 'tarjeta', 'transferencia', 'otro']).withMessage('Método de pago inválido'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para eliminar detalle de servicio
  static validateDelete = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para cambiar estado del detalle de servicio
  static validateStatusChange = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('status')
      .isIn(['programado', 'confirmado', 'en_progreso', 'completado', 'cancelado', 'pagado'])
      .withMessage('Estado inválido')
      .notEmpty().withMessage('El estado es requerido'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Middleware para verificar que el servicio no esté pagado antes de modificarlo
  static checkNotPaid = async (req, res, next) => {
    try {
      const { id } = req.params;
      const ServiceDetail = require('../models/serviceDetails/ServiceDetail');
      
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return ResponseMiddleware.error(res, 'Detalle de servicio no encontrado', null, 404);
      }
      
      if (serviceDetail.status === 'pagado') {
        return ResponseMiddleware.error(res, 'No se puede modificar un servicio ya pagado', null, 400);
      }
      
      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar estado del servicio', error, 500);
    }
  };

  // Middleware para verificar que el servicio no esté pagado antes de cambiar estado
  static checkNotPaidForStatusChange = async (req, res, next) => {
    try {
      const { id } = req.params;
      const ServiceDetail = require('../models/serviceDetails/ServiceDetail');
      
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return ResponseMiddleware.error(res, 'Detalle de servicio no encontrado', null, 404);
      }
      
      if (serviceDetail.status === 'pagado') {
        return ResponseMiddleware.error(res, 'No se puede cambiar el estado de un servicio ya pagado', null, 400);
      }
      
      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar estado del servicio', error, 500);
    }
  };

  // Middleware para validar fechas de programación
  static validateSchedulingDates = (req, res, next) => {
    const { scheduledDate } = req.body;
    
    if (scheduledDate) {
      const scheduledDateTime = new Date(scheduledDate);
      const now = new Date();
      
      if (scheduledDateTime <= now) {
        return ResponseMiddleware.error(res, 'La fecha programada debe ser futura', null, 400);
      }
    }
    
    next();
  };

  // Middleware para validar conflictos de horario
  static checkScheduleConflict = async (req, res, next) => {
    try {
      const { employeeId, scheduledDate, startTime, endTime } = req.body;
      const { id } = req.params;
      
      if (!employeeId || !scheduledDate) {
        return next(); // No hay suficientes datos para verificar conflicto
      }
      
      const ServiceDetail = require('../models/serviceDetails/ServiceDetail');
      const whereClause = {
        employeeId,
        scheduledDate: new Date(scheduledDate),
        status: ['programado', 'confirmado', 'en_progreso']
      };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }
      
      const conflictingServices = await ServiceDetail.findAll({ where: whereClause });
      
      if (conflictingServices.length > 0) {
        return ResponseMiddleware.error(res, 'Existe un conflicto de horario con otro servicio', null, 409);
      }
      
      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar conflictos de horario', error, 500);
    }
  };
}

module.exports = ServiceDetailValidationMiddleware;
