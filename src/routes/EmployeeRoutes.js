// src/routes/EmployeeRoutes.js
const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/EmployeeController');
const { validateEmployeeData, validateEmployeeUpdate } = require('../middlewares/EmployeeMiddleware');

// Crear nuevo empleado
router.post('/', validateEmployeeData, EmployeeController.create);

// Obtener todos los empleados
router.get('/', EmployeeController.getAll);

// Obtener empleados activos
router.get('/active', EmployeeController.getActive);

// Obtener empleados por estado
router.get('/status/:status', EmployeeController.getByStatus);

// Buscar empleados
router.get('/search', EmployeeController.search);

// Obtener un empleado por ID
router.get('/:id', EmployeeController.getById);

// Actualizar un empleado por ID
router.put('/:id', validateEmployeeUpdate, EmployeeController.update);

// Cambiar estado de un empleado
router.patch('/:id/status', EmployeeController.changeStatus);

// Eliminar un empleado por ID
router.delete('/:id', EmployeeController.delete);

module.exports = router;
