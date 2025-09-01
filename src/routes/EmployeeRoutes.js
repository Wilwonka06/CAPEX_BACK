// src/routes/EmployeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');
const { isEmployee } = require('../middlewares/EmployeeMiddleware');

// CRUD de empleados
router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployee);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

// Ejemplo de ruta protegida solo para empleados autenticados
router.get('/me/protected', isEmployee, (req, res) => {
  res.json({ message: 'Ruta protegida para empleados' });
});

module.exports = router;
