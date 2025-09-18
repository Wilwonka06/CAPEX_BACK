const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');
const {
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
  validateClientId,
  validateAppointmentNotFinalized
} = require('../middlewares/AppointmentValidationMiddleware');

// Rutas principales de citas

// GET /api/citas - Obtener todas las citas con paginación y filtros
router.get('/', validateAppointmentFilters, AppointmentController.getAllAppointments);

// GET /api/citas/buscar - Buscar citas por texto
router.get('/buscar', validateSearchAppointments, AppointmentController.searchAppointments);

// GET /api/citas/:id - Obtener cita por ID
router.get('/:id', validateAppointmentId, AppointmentController.getAppointmentById);

// POST /api/citas - Crear nueva cita con servicios
router.post('/', validateCreateAppointment, AppointmentController.createAppointment);

// PUT /api/citas/:id - Editar cita completa
router.put('/:id', 
  validateAppointmentId, 
  validateAppointmentNotFinalized, 
  validateUpdateAppointment, 
  AppointmentController.updateAppointment
);

// PATCH /api/citas/:id/cancelar - Cancelar cita
router.patch('/:id/cancelar', 
  validateAppointmentId, 
  validateCancelAppointment, 
  AppointmentController.cancelAppointment
);

// Rutas de servicios dentro de citas

// POST /api/citas/:id/servicios - Agregar servicio a cita existente
router.post('/:id/servicios', 
  validateAppointmentId, 
  validateAppointmentNotFinalized, 
  validateAddServiceToAppointment, 
  AppointmentController.addServiceToAppointment
);

// GET /api/citas/:id/servicios/:detalle_id - Obtener servicio por ID
router.get('/:id/servicios/:detalle_id', 
  validateServiceId, 
  AppointmentController.getServiceById
);

// PATCH /api/citas/:id/servicios/:detalle_id/cancelar - Cancelar servicio específico
router.patch('/:id/servicios/:detalle_id/cancelar', 
  validateCancelService, 
  AppointmentController.cancelService
);

// Rutas adicionales

// GET /api/citas/empleado/:employeeId - Obtener citas por empleado
router.get('/empleado/:employeeId', 
  validateEmployeeId, 
  AppointmentController.getAppointmentsByEmployee
);

// GET /api/citas/cliente/:clientId - Obtener citas por cliente
router.get('/cliente/:clientId', 
  validateClientId, 
  AppointmentController.getAppointmentsByClient
);

// GET /api/citas/estadisticas - Obtener estadísticas de citas
router.get('/estadisticas', AppointmentController.getAppointmentStats);

module.exports = router;
