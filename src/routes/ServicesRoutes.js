const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');
const ServiceValidationMiddleware = require('../middlewares/ServiceValidationMiddleware');

// Rutas para servicios
router.get('/', ServiceController.getAllServices);
router.get('/:id', ServiceValidationMiddleware.validateGetById, ServiceController.getServiceById);
router.post('/', ServiceValidationMiddleware.validateCreate, ServiceController.createService);
router.put('/:id', ServiceValidationMiddleware.validateUpdate, ServiceController.updateService);
router.delete('/:id', ServiceValidationMiddleware.validateDelete, ServiceController.deleteService);
router.get('/categoria/:categoryId', ServiceController.getServicesByCategory);

module.exports = router;
