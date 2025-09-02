const express = require('express');
const ServiceDetailController = require('../../controllers/serviceDetails/ServiceDetailController');
const ServiceDetailValidationMiddleware = require('../../middlewares/serviceDetails/ServiceDetailValidationMiddleware');
const AuthMiddleware = require('../../middlewares/AuthMiddleware');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(AuthMiddleware.verifyToken);

// Rutas para detalles de servicio
router.get('/', ServiceDetailController.getAllServiceDetails);

router.get('/statistics/overview', ServiceDetailController.getStatistics);

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

router.patch('/:id/status', 
  ServiceDetailValidationMiddleware.validateChangeStatus,
  ServiceDetailController.changeStatus
);

// Rutas para obtener detalles por diferentes criterios
router.get('/service-client/:serviceClientId', 
  ServiceDetailValidationMiddleware.validateGetByServiceClient,
  ServiceDetailController.getByServiceClient
);

// Nueva ruta para obtener detalles organizados
router.get('/service-client/:serviceClientId/organized', 
  ServiceDetailValidationMiddleware.validateGetByServiceClient,
  ServiceDetailController.getDetailsOrganized
);

router.get('/product/:productId', 
  ServiceDetailValidationMiddleware.validateGetByProduct,
  ServiceDetailController.getByProduct
);

router.get('/service/:serviceId', 
  ServiceDetailValidationMiddleware.validateGetByService,
  ServiceDetailController.getByService
);

router.get('/employee/:empleadoId', 
  ServiceDetailValidationMiddleware.validateGetByEmployee,
  ServiceDetailController.getByEmployee
);

router.get('/status/:status', 
  ServiceDetailController.getByStatus
);

router.get('/:id/subtotal', 
  ServiceDetailValidationMiddleware.validateGetById,
  ServiceDetailController.calculateSubtotal
);

module.exports = router;
