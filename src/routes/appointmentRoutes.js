const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');
const {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateGetAppointments,
  validateGetAppointment,
  validateDeleteAppointment,
  validateChangeAppointmentStatus
} = require('../middlewares/AppointmentMiddleware');

/**
 * @route POST /api/appointments
 * @desc Crear una nueva cita
 * @access Private
 */
router.post('/', validateCreateAppointment, AppointmentController.createAppointment);

/**
 * @route GET /api/appointments
 * @desc Obtener todas las citas con filtros opcionales
 * @access Private
 */
router.get('/', validateGetAppointments, AppointmentController.getAppointments);



/**
 * @route GET /api/appointments/conflicts
 * @desc Verificar conflictos de horario
 * @access Private
 */
router.get('/conflicts', AppointmentController.checkScheduleConflicts);

/**
 * @route GET /api/appointments/:id
 * @desc Obtener una cita específica por ID
 * @access Private
 */
router.get('/:id', validateGetAppointment, AppointmentController.getAppointmentById);

/**
 * @route PUT /api/appointments/:id
 * @desc Actualizar una cita
 * @access Private
 */
router.put('/:id', validateUpdateAppointment, AppointmentController.updateAppointment);

/**
 * @route DELETE /api/appointments/:id
 * @desc Eliminar una cita
 * @access Private
 */
router.delete('/:id', validateDeleteAppointment, AppointmentController.deleteAppointment);

/**
 * @route PATCH /api/appointments/:id/status
 * @desc Cambiar el estado de una cita
 * @access Private
 */
router.patch('/:id/status', validateChangeAppointmentStatus, AppointmentController.changeAppointmentStatus);

/**
 * @route GET /api/appointments/user/:userId
 * @desc Obtener citas por usuario
 * @access Private
 */
router.get('/user/:userId', validateGetAppointments, AppointmentController.getAppointmentsByUser);

/**
 * @route GET /api/appointments/service/:serviceId
 * @desc Obtener citas por servicio
 * @access Private
 */
router.get('/service/:serviceId', validateGetAppointments, AppointmentController.getAppointmentsByService);

module.exports = router;
