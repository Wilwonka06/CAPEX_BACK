// src/routes/SchedulingRoutes.js
const express = require('express');
const router = express.Router();

const SchedulingController = require('../controllers/SchedulingController');
const { validateSchedulingData, validateMultipleSchedulingData } = require('../middlewares/SchedulingMiddleware');

// Crear programación individual
router.post('/', validateSchedulingData, SchedulingController.create);

// Crear múltiples programaciones
router.post('/multiple', validateMultipleSchedulingData, SchedulingController.createMultiple);

// Obtener todas las programaciones
router.get('/', SchedulingController.getAll);

// Obtener programaciones por empleado
router.get('/employee/:employeeId', SchedulingController.getByEmployee);

// Obtener una programación por ID
router.get('/:id', SchedulingController.getById);

// Actualizar una programación por ID
router.put('/:id', validateSchedulingData, SchedulingController.update);

// Eliminar una programación por ID
router.delete('/:id', SchedulingController.delete);

// Verificar conflictos de horarios
router.post('/check-conflicts', SchedulingController.checkConflicts);

module.exports = router;
