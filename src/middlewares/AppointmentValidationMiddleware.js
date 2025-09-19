const { body, param, query, validationResult } = require('express-validator');
const CitasService = require('../services/AppointmentService');
const { Usuario } = require('../models/User');
const Services = require('../models/Services');

// Middleware para manejar errores de validación
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

// Validaciones para crear cita
const validateCreateAppointment = [
  // Validar datos de la cita
  body('cita.id_cliente')
    .isInt({ min: 1 })
    .withMessage('ID del usuario debe ser un entero positivo')
    .custom(async (value) => {
      const usuario = await Usuario.findByPk(value);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      if (usuario.estado !== 'Activo') {
        throw new Error('Usuario debe estar activo');
      }
      return true;
    }),

  body('cita.fecha_servicio')
    .isISO8601()
    .withMessage('Fecha de servicio debe ser una fecha válida')
    .custom((value) => {
      const fechaServicio = new Date(value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaServicio < hoy) {
        throw new Error('La fecha de servicio no puede ser anterior a hoy');
      }
      return true;
    }),

  body('cita.hora_entrada')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Hora de entrada debe estar en formato HH:MM:SS'),

  body('cita.motivo')
    .isLength({ min: 1, max: 100 })
    .withMessage('El motivo debe tener entre 1 y 100 caracteres')
    .trim(),

  // Validar servicios
  body('servicios')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un servicio'),

  body('servicios.*.id_servicio')
    .isInt({ min: 1 })
    .withMessage('ID del servicio debe ser un entero positivo')
    .custom(async (value) => {
      const servicio = await Services.findByPk(value);
      if (!servicio) {
        throw new Error('Servicio no encontrado');
      }
      if (servicio.estado !== 'Activo') {
        throw new Error('Servicio debe estar activo');
      }
      return true;
    }),

  body('servicios.*.id_empleado')
    .isInt({ min: 1 })
    .withMessage('ID del empleado debe ser un entero positivo')
    .custom(async (value) => {
      const empleado = await Usuario.findByPk(value);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }
      if (empleado.estado !== 'Activo') {
        throw new Error('Empleado debe estar activo');
      }
      return true;
    }),

  body('servicios.*.cantidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un entero positivo'),

  body('servicios.*.hora_inicio')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Hora de inicio debe estar en formato HH:MM:SS'),

  body('servicios.*.observaciones')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres')
    .trim(),

  handleValidationErrors
];

// Validaciones para actualizar cita
const validateUpdateAppointment = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de la cita debe ser un entero positivo'),

  body('cita.id_cliente')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID del usuario debe ser un entero positivo')
    .custom(async (value) => {
      if (value) {
        const usuario = await Usuario.findByPk(value);
        if (!usuario) {
          throw new Error('Usuario no encontrado');
        }
        if (usuario.estado !== 'Activo') {
          throw new Error('Usuario debe estar activo');
        }
      }
      return true;
    }),

  body('cita.fecha_servicio')
    .optional()
    .isISO8601()
    .withMessage('Fecha de servicio debe ser una fecha válida')
    .custom((value) => {
      if (value) {
        const fechaServicio = new Date(value);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fechaServicio < hoy) {
          throw new Error('La fecha de servicio no puede ser anterior a hoy');
        }
      }
      return true;
    }),

  body('cita.hora_entrada')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Hora de entrada debe estar en formato HH:MM:SS'),

  body('cita.motivo')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('El motivo debe tener entre 1 y 100 caracteres')
    .trim(),

  body('cita.estado')
    .optional()
    .isIn(['Agendada', 'Confirmada', 'Reprogramada', 'En proceso', 'Finalizada', 'Pagada', 'Cancelada por el usuario', 'No asistio'])
    .withMessage('Estado inválido'),

  // Validar servicios si se proporcionan
  body('servicios')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Si se proporcionan servicios, debe incluir al menos uno'),

  body('servicios.*.id_servicio')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID del servicio debe ser un entero positivo')
    .custom(async (value) => {
      if (value) {
        const servicio = await Services.findByPk(value);
        if (!servicio) {
          throw new Error('Servicio no encontrado');
        }
        if (servicio.estado !== 'Activo') {
          throw new Error('Servicio debe estar activo');
        }
      }
      return true;
    }),

  body('servicios.*.id_empleado')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID del empleado debe ser un entero positivo')
    .custom(async (value) => {
      if (value) {
        const empleado = await Usuario.findByPk(value);
        if (!empleado) {
          throw new Error('Empleado no encontrado');
        }
        if (empleado.estado !== 'Activo') {
          throw new Error('Empleado debe estar activo');
        }
      }
      return true;
    }),

  body('servicios.*.cantidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un entero positivo'),

  body('servicios.*.hora_inicio')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Hora de inicio debe estar en formato HH:MM:SS'),

  body('servicios.*.observaciones')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres')
    .trim(),

  handleValidationErrors
];

// Validaciones para obtener cita por ID
const validateAppointmentId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de la cita debe ser un entero positivo'),
  
  handleValidationErrors
];

// Validaciones para cancelar cita
const validateCancelAppointment = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de la cita debe ser un entero positivo'),

  body('motivo')
    .optional()
    .isLength({ max: 100 })
    .withMessage('El motivo no puede exceder 100 caracteres')
    .trim(),

  handleValidationErrors
];

// Validaciones para búsqueda de citas
const validateSearchAppointments = [
  query('query')
    .isLength({ min: 1, max: 100 })
    .withMessage('El parámetro de búsqueda debe tener entre 1 y 100 caracteres')
    .trim(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un entero positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un entero entre 1 y 100'),

  handleValidationErrors
];

// Validaciones para agregar servicio a cita
const validateAddServiceToAppointment = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de la cita debe ser un entero positivo'),

  body('id_servicio')
    .isInt({ min: 1 })
    .withMessage('ID del servicio debe ser un entero positivo')
    .custom(async (value) => {
      const servicio = await Services.findByPk(value);
      if (!servicio) {
        throw new Error('Servicio no encontrado');
      }
      if (servicio.estado !== 'Activo') {
        throw new Error('Servicio debe estar activo');
      }
      return true;
    }),

  body('id_empleado')
    .isInt({ min: 1 })
    .withMessage('ID del empleado debe ser un entero positivo')
    .custom(async (value) => {
      const empleado = await Usuario.findByPk(value);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }
      if (empleado.estado !== 'Activo') {
        throw new Error('Empleado debe estar activo');
      }
      return true;
    }),

  body('cantidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un entero positivo'),

  body('hora_inicio')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Hora de inicio debe estar en formato HH:MM:SS'),

  body('observaciones')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres')
    .trim(),

  handleValidationErrors
];

// Validaciones para cancelar servicio
const validateCancelService = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de la cita debe ser un entero positivo'),

  param('detalle_id')
    .isInt({ min: 1 })
    .withMessage('ID del detalle debe ser un entero positivo'),

  handleValidationErrors
];

// Validaciones para obtener servicio por ID
const validateServiceId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de la cita debe ser un entero positivo'),

  param('detalle_id')
    .isInt({ min: 1 })
    .withMessage('ID del detalle debe ser un entero positivo'),

  handleValidationErrors
];

// Validaciones para filtros de citas
const validateAppointmentFilters = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un entero positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un entero entre 1 y 100'),

  query('estado')
    .optional()
    .isIn(['Agendada', 'Confirmada', 'Reprogramada', 'En proceso', 'Finalizada', 'Pagada', 'Cancelada por el usuario', 'No asistio'])
    .withMessage('Estado inválido'),

  query('fecha_desde')
    .optional()
    .isISO8601()
    .withMessage('Fecha desde debe ser una fecha válida'),

  query('fecha_hasta')
    .optional()
    .isISO8601()
    .withMessage('Fecha hasta debe ser una fecha válida'),

  query('id_usuario')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID del usuario debe ser un entero positivo'),

  handleValidationErrors
];

// Validaciones para obtener citas por empleado
const validateEmployeeId = [
  param('employeeId')
    .isInt({ min: 1 })
    .withMessage('ID del empleado debe ser un entero positivo'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un entero positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un entero entre 1 y 100'),

  handleValidationErrors
];

// Validaciones para obtener citas por usuario
const validateUserId = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('ID del usuario debe ser un entero positivo'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un entero positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un entero entre 1 y 100'),

  handleValidationErrors
];

// Middleware para validar que la cita no esté finalizada o cancelada
const validateAppointmentNotFinalized = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointmentResult = await CitasService.getAppointmentById(id);
    
    if (!appointmentResult.success) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    const appointment = appointmentResult.data;
    
    if (['Finalizada', 'Pagada', 'Cancelada por el usuario'].includes(appointment.estado)) {
      return res.status(403).json({
        success: false,
        message: 'No se puede modificar una cita finalizada, pagada o cancelada',
        error: 'APPOINTMENT_FINALIZED'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error validando estado de la cita',
      error: error.message
    });
  }
};

module.exports = {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateAppointmentId,
  validateCancelAppointment,
  validateSearchAppointments,
  validateAddServiceToAppointment,
  validateCancelService,
  validateServiceId,
  validateAppointmentFilters,
  validateEmployeeId,
  validateUserId,
  validateAppointmentNotFinalized,
  handleValidationErrors
};
