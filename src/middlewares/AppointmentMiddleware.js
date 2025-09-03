const { body, param, query, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const { Usuario } = require('../models/User');
const Services = require('../models/Services');

// Middleware para validar los resultados de validación
const validateResults = (req, res, next) => {
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

// Validaciones para crear una cita
const validateCreateAppointment = [
  body('id_usuario')
    .isInt({ min: 1 })
    .withMessage('El ID del usuario debe ser un número entero positivo')
    .custom(async (value) => {
      const user = await Usuario.findByPk(value);
      if (!user) {
        throw new Error('El usuario especificado no existe');
      }
      if (user.estado !== 'Activo') {
        throw new Error('El usuario está inactivo');
      }
      // Verificar que el usuario tenga rol de cliente (roleId = 2, asumiendo que 2 es el rol cliente)
      if (user.roleId !== 2) {
        throw new Error('El usuario debe tener rol de cliente');
      }
      return true;
    }),

  body('id_servicio')
    .isInt({ min: 1 })
    .withMessage('El ID del servicio debe ser un número entero positivo')
    .custom(async (value) => {
      const service = await Services.findByPk(value);
      if (!service) {
        throw new Error('El servicio especificado no existe');
      }
      if (service.estado !== 'Activo') {
        throw new Error('El servicio no está activo');
      }
      return true;
    }),

  body('fecha_servicio')
    .isISO8601()
    .withMessage('La fecha del servicio debe tener un formato válido (YYYY-MM-DD)')
    .custom((value) => {
      const fecha = new Date(value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fecha <= hoy) {
        throw new Error('La fecha del servicio debe ser posterior a hoy');
      }
      return true;
    }),

  body('hora_entrada')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('La hora de entrada debe tener formato HH:MM:SS'),

  body('hora_salida')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('La hora de salida debe tener formato HH:MM:SS')
    .custom((value, { req }) => {
      if (req.body.hora_entrada && value <= req.body.hora_entrada) {
        throw new Error('La hora de salida debe ser posterior a la hora de entrada');
      }
      return true;
    }),

  body('valor_total')
    .isFloat({ min: 0.01, max: 9999999999999.99 })
    .withMessage('El valor total debe ser un número decimal entre 0.01 y 9999999999999.99'),

  body('motivo')
    .isLength({ min: 1, max: 100 })
    .withMessage('El motivo debe tener entre 1 y 100 caracteres')
    .trim()
    .escape(),

  // Validar que no haya conflictos de horario
  body().custom(async (value, { req }) => {
    const { fecha_servicio, hora_entrada, hora_salida, id_servicio } = req.body;
    
    const conflictos = await Appointment.findAll({
      where: {
        fecha_servicio,
        id_servicio,
        estado: {
          [Op.notIn]: ['Cancelada por el cliente', 'No asistio']
        },
        [Op.or]: [
          {
            hora_entrada: {
              [Op.lt]: hora_salida
            },
            hora_salida: {
              [Op.gt]: hora_entrada
            }
          }
        ]
      }
    });

    if (conflictos.length > 0) {
      throw new Error('Existe un conflicto de horario para este servicio en la fecha y hora especificadas');
    }
    
    return true;
  }),

  validateResults
];

// Validaciones para actualizar una cita
const validateUpdateAppointment = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de la cita debe ser un número entero positivo'),

  body('fecha_servicio')
    .optional()
    .isISO8601()
    .withMessage('La fecha del servicio debe tener un formato válido (YYYY-MM-DD)')
    .custom((value) => {
      const fecha = new Date(value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fecha <= hoy) {
        throw new Error('La fecha del servicio debe ser posterior a hoy');
      }
      return true;
    }),

  body('hora_entrada')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('La hora de entrada debe tener formato HH:MM:SS'),

  body('hora_salida')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('La hora de salida debe tener formato HH:MM:SS')
    .custom((value, { req }) => {
      if (req.body.hora_entrada && value <= req.body.hora_entrada) {
        throw new Error('La hora de salida debe ser posterior a la hora de entrada');
      }
      return true;
    }),

  body('estado')
    .optional()
    .isIn([
      'Agendada',
      'Confirmada',
      'Reprogramada',
      'En proceso',
      'Finalizada',
      'Pagada',
      'Cancelada por el cliente',
      'No asistio'
    ])
    .withMessage('Estado no válido'),

  body('valor_total')
    .optional()
    .isFloat({ min: 0.01, max: 9999999999999.99 })
    .withMessage('El valor total debe ser un número decimal entre 0.01 y 9999999999999.99'),

  body('motivo')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('El motivo debe tener entre 1 y 100 caracteres')
    .trim()
    .escape(),

  validateResults
];

// Validaciones para obtener citas
const validateGetAppointments = [
  query('usuario')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del usuario debe ser un número entero positivo'),

  query('servicio')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del servicio debe ser un número entero positivo'),

  query('estado')
    .optional()
    .isIn([
      'Agendada',
      'Confirmada',
      'Reprogramada',
      'En proceso',
      'Finalizada',
      'Pagada',
      'Cancelada por el cliente',
      'No asistio'
    ])
    .withMessage('Estado no válido'),

  query('fecha_inicio')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe tener formato YYYY-MM-DD'),

  query('fecha_fin')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe tener formato YYYY-MM-DD')
    .custom((value, { req }) => {
      if (req.query.fecha_inicio && value < req.query.fecha_inicio) {
        throw new Error('La fecha de fin debe ser posterior o igual a la fecha de inicio');
      }
      return true;
    }),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),

  validateResults
];

// Validaciones para obtener una cita específica
const validateGetAppointment = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de la cita debe ser un número entero positivo'),

  validateResults
];

// Validaciones para eliminar una cita
const validateDeleteAppointment = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de la cita debe ser un número entero positivo'),

  validateResults
];

// Validaciones para cambiar estado de cita
const validateChangeAppointmentStatus = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de la cita debe ser un número entero positivo'),

  body('estado')
    .isIn([
      'Agendada',
      'Confirmada',
      'Reprogramada',
      'En proceso',
      'Finalizada',
      'Pagada',
      'Cancelada por el cliente',
      'No asistio'
    ])
    .withMessage('Estado no válido'),

  body('motivo')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('El motivo debe tener entre 1 y 100 caracteres')
    .trim()
    .escape(),

  validateResults
];

module.exports = {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateGetAppointments,
  validateGetAppointment,
  validateDeleteAppointment,
  validateChangeAppointmentStatus,
  validateResults
};
