const express = require('express');
const router = express.Router();
const ServiceCategoryController = require('../controllers/ServiceCategoryController');
const ServiceCategoryValidationMiddleware = require('../middlewares/ServiceCategoryValidationMiddleware');

// Rutas para categorías de servicios
router.get('/', ServiceCategoryController.getAllServiceCategories);
router.get('/:id', ServiceCategoryValidationMiddleware.validateGetById, ServiceCategoryController.getServiceCategoryById);
router.post('/', ServiceCategoryValidationMiddleware.validateCreate, ServiceCategoryController.createServiceCategory);
router.put('/:id', ServiceCategoryValidationMiddleware.validateUpdate, ServiceCategoryController.updateServiceCategory);
router.delete('/:id', ServiceCategoryValidationMiddleware.validateDelete, ServiceCategoryController.deleteServiceCategory);

module.exports = router;
