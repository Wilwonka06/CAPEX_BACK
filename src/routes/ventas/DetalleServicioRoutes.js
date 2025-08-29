const express = require('express');
const router = express.Router();
const ServiceDetailController = require('../../controllers/ServiceDetailController');
const ServiceDetailValidationMiddleware = require('../../middlewares/ServiceDetailValidationMiddleware');
const AuthMiddleware = require('../../middlewares/AuthMiddleware');

// Rutas para detalles de servicio
router.get('/', AuthMiddleware.verifyToken, ServiceDetailController.getAllServiceDetails);
router.get('/:id', AuthMiddleware.verifyToken, ServiceDetailValidationMiddleware.validateGetById, ServiceDetailController.getServiceDetailById);
router.post('/', AuthMiddleware.verifyToken, ServiceDetailValidationMiddleware.validateCreate, ServiceDetailController.createServiceDetail);
router.put('/:id', AuthMiddleware.verifyToken, ServiceDetailValidationMiddleware.validateUpdate, ServiceDetailController.updateServiceDetail);
router.delete('/:id', AuthMiddleware.verifyToken, ServiceDetailValidationMiddleware.validateDelete, ServiceDetailController.deleteServiceDetail);
router.put('/:id/estado', AuthMiddleware.verifyToken, ServiceDetailValidationMiddleware.validateStatusChange, ServiceDetailController.changeServiceDetailStatus);
router.get('/cliente/:clientId', AuthMiddleware.verifyToken, ServiceDetailController.getServiceDetailsByClient);
router.get('/empleado/:employeeId', AuthMiddleware.verifyToken, ServiceDetailController.getServiceDetailsByEmployee);
router.post('/iniciar/:id', AuthMiddleware.verifyToken, ServiceDetailController.startService);
router.post('/completar/:id', AuthMiddleware.verifyToken, ServiceDetailController.completeService);
router.get('/programados', AuthMiddleware.verifyToken, ServiceDetailController.getScheduledServices);
router.post('/confirmar-programado/:id', AuthMiddleware.verifyToken, ServiceDetailController.confirmScheduledService);
router.put('/reprogramar/:id', AuthMiddleware.verifyToken, ServiceDetailController.rescheduleService);
router.get('/ventas/detalles', AuthMiddleware.verifyToken, ServiceDetailController.getServiceDetailsForSales);

module.exports = router;
