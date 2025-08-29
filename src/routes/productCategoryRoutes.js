const express = require('express');
const router = express.Router();
const ProductCategoryController = require('../controllers/ProductCategoryController');
const ProductCategoryValidationMiddleware = require('../middlewares/ProductCategoryValidationMiddleware');

// Rutas para categorías de productos
router.get('/', ProductCategoryController.getAllProductCategories);
router.get('/:id', ProductCategoryValidationMiddleware.validateGetById, ProductCategoryController.getProductCategoryById);
router.post('/', ProductCategoryValidationMiddleware.validateCreate, ProductCategoryController.createProductCategory);
router.put('/:id', ProductCategoryValidationMiddleware.validateUpdate, ProductCategoryController.updateProductCategory);
router.delete('/:id', ProductCategoryValidationMiddleware.validateDelete, ProductCategoryController.deleteProductCategory);

module.exports = router;