const express = require('express');
const router = express.Router();
const SchedulingController = require('../controllers/SchedulingController');
const SchedulingValidationMiddleware = require('../middlewares/SchedulingValidationMiddleware');

// Rutas para programación
router.get('/', SchedulingController.getAllSchedules);
router.get('/:id', SchedulingValidationMiddleware.validateGetById, SchedulingController.getScheduleById);
router.post('/', SchedulingValidationMiddleware.validateCreate, SchedulingController.createSchedule);
router.post('/multiple', SchedulingValidationMiddleware.validateCreateMultiple, SchedulingController.createMultipleSchedules);
router.put('/:id', SchedulingValidationMiddleware.validateUpdate, SchedulingController.updateSchedule);
router.delete('/:id', SchedulingValidationMiddleware.validateDelete, SchedulingController.deleteSchedule);
router.get('/empleado/:employeeId', SchedulingController.getSchedulesByEmployee);
router.post('/verificar-conflicto', SchedulingController.checkScheduleConflict);

module.exports = router;
