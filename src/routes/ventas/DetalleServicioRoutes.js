const express = require('express');
const router = express.Router();
const ServiceDetailController = require('../../controllers/serviceDetails/ServiceDetailController');
const ServiceDetailValidationMiddleware = require('../../middlewares/serviceDetails/ServiceDetailValidationMiddleware');
const AuthMiddleware = require('../../middlewares/AuthMiddleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(AuthMiddleware.authenticate);

// Rutas para detalles de servicios
router.get('/', ServiceDetailController.getAllServiceDetails);

router.get('/:id', 
  ServiceDetailValidationMiddleware.validateGetById,
  ServiceDetailController.getServiceDetailById
);

router.post('/', 
  ServiceDetailValidationMiddleware.validateCreate,
  ServiceDetailController.createServiceDetail
);

router.put('/:id', 
  ServiceDetailValidationMiddleware.validateUpdate,
  ServiceDetailController.updateServiceDetail
);

router.delete('/:id', 
  ServiceDetailValidationMiddleware.validateDelete,
  ServiceDetailController.deleteServiceDetail
);

// Rutas específicas
router.patch('/:id/status', 
  ServiceDetailValidationMiddleware.validateChangeStatus,
  ServiceDetailController.changeStatus
);

router.get('/service-client/:serviceClientId', 
  ServiceDetailValidationMiddleware.validateGetByServiceClient,
  ServiceDetailController.getByServiceClient
);

router.get('/employee/:employeeId', 
  ServiceDetailValidationMiddleware.validateGetByEmployee,
  ServiceDetailController.getByEmployee
);

router.get('/status/:status', 
  ServiceDetailController.getByStatus
);

router.get('/:id/total-price', 
  ServiceDetailValidationMiddleware.validateGetById,
  ServiceDetailController.calculateTotalPrice
);

router.get('/statistics/overview', 
  ServiceDetailController.getStatistics
);

module.exports = router;
