const { body, param, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class SchedulingValidationMiddleware {
  // Validación para obtener programación por ID
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

  // Validación para crear programación
  static validateCreate = [
    body('employeeId')
      .isInt().withMessage('El ID del empleado debe ser un número entero')
      .notEmpty().withMessage('El ID del empleado es requerido'),
    body('scheduledDate')
      .isISO8601().withMessage('La fecha programada debe tener un formato válido')
      .notEmpty().withMessage('La fecha programada es requerida'),
    body('startTime')
      .optional()
      .isISO8601().withMessage('La hora de inicio debe tener un formato válido'),
    body('endTime')
      .optional()
      .isISO8601().withMessage('La hora de fin debe tener un formato válido'),
    body('description')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('status')
      .optional()
      .isIn(['programado', 'confirmado', 'en_progreso', 'completado', 'cancelado'])
      .withMessage('Estado inválido'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para crear múltiples programaciones
  static validateCreateMultiple = [
    body('schedules')
      .isArray().withMessage('Las programaciones deben ser un array')
      .notEmpty().withMessage('El array de programaciones no puede estar vacío'),
    body('schedules.*.employeeId')
      .isInt().withMessage('El ID del empleado debe ser un número entero')
      .notEmpty().withMessage('El ID del empleado es requerido'),
    body('schedules.*.scheduledDate')
      .isISO8601().withMessage('La fecha programada debe tener un formato válido')
      .notEmpty().withMessage('La fecha programada es requerida'),
    body('schedules.*.startTime')
      .optional()
      .isISO8601().withMessage('La hora de inicio debe tener un formato válido'),
    body('schedules.*.endTime')
      .optional()
      .isISO8601().withMessage('La hora de fin debe tener un formato válido'),
    body('schedules.*.description')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('schedules.*.status')
      .optional()
      .isIn(['programado', 'confirmado', 'en_progreso', 'completado', 'cancelado'])
      .withMessage('Estado inválido'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para actualizar programación
  static validateUpdate = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('employeeId')
      .optional()
      .isInt().withMessage('El ID del empleado debe ser un número entero'),
    body('scheduledDate')
      .optional()
      .isISO8601().withMessage('La fecha programada debe tener un formato válido'),
    body('startTime')
      .optional()
      .isISO8601().withMessage('La hora de inicio debe tener un formato válido'),
    body('endTime')
      .optional()
      .isISO8601().withMessage('La hora de fin debe tener un formato válido'),
    body('description')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('status')
      .optional()
      .isIn(['programado', 'confirmado', 'en_progreso', 'completado', 'cancelado'])
      .withMessage('Estado inválido'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para eliminar programación
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

  // Middleware para validar fechas de programación
  static validateSchedulingDates = (req, res, next) => {
    const { scheduledDate, startTime, endTime } = req.body;
    
    if (scheduledDate) {
      const scheduledDateTime = new Date(scheduledDate);
      const now = new Date();
      
      if (scheduledDateTime <= now) {
        return ResponseMiddleware.error(res, 'La fecha programada debe ser futura', null, 400);
      }
    }
    
    if (startTime && endTime) {
      const startDateTime = new Date(startTime);
      const endDateTime = new Date(endTime);
      
      if (startDateTime >= endDateTime) {
        return ResponseMiddleware.error(res, 'La hora de inicio debe ser anterior a la hora de fin', null, 400);
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
      
      const Scheduling = require('../models/Scheduling');
      const whereClause = {
        employeeId,
        scheduledDate: new Date(scheduledDate)
      };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }
      
      // Si se proporcionan horarios específicos, verificar conflictos de tiempo
      if (startTime && endTime) {
        whereClause.startTime = { [require('sequelize').Op.lt]: endTime };
        whereClause.endTime = { [require('sequelize').Op.gt]: startTime };
      }
      
      const conflictingSchedules = await Scheduling.findAll({ where: whereClause });
      
      if (conflictingSchedules.length > 0) {
        return ResponseMiddleware.error(res, 'Existe un conflicto de horario con otra programación', null, 409);
      }
      
      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar conflictos de horario', error, 500);
    }
  };

  // Middleware para verificar que la programación no esté completada antes de modificarla
  static checkNotCompleted = async (req, res, next) => {
    try {
      const { id } = req.params;
      const Scheduling = require('../models/Scheduling');
      
      const schedule = await Scheduling.findByPk(id);
      
      if (!schedule) {
        return ResponseMiddleware.error(res, 'Programación no encontrada', null, 404);
      }
      
      if (schedule.status === 'completado') {
        return ResponseMiddleware.error(res, 'No se puede modificar una programación ya completada', null, 400);
      }
      
      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar estado de la programación', error, 500);
    }
  };
}

module.exports = SchedulingValidationMiddleware;
