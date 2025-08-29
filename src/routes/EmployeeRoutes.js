const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/EmployeeController');
const EmployeeValidationMiddleware = require('../middlewares/EmployeeValidationMiddleware');

// Rutas para empleados
router.get('/', EmployeeController.getAllEmployees);
router.get('/:id', EmployeeValidationMiddleware.validateGetById, EmployeeController.getEmployeeById);
router.post('/', EmployeeValidationMiddleware.validateCreate, EmployeeController.createEmployee);
router.put('/:id', EmployeeValidationMiddleware.validateUpdate, EmployeeController.updateEmployee);
router.delete('/:id', EmployeeValidationMiddleware.validateDelete, EmployeeController.deleteEmployee);
router.get('/estadisticas', EmployeeController.getEmployeeStats);
router.get('/buscar', EmployeeController.searchEmployees);

module.exports = router;
