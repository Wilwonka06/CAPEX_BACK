const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const ProductValidationMiddleware = require('../middlewares/ProductValidationMiddleware');

// Rutas para productos
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductValidationMiddleware.validateGetById, ProductController.getProductById);
router.post('/', ProductValidationMiddleware.validateCreate, ProductController.createProduct);
router.put('/:id', ProductValidationMiddleware.validateUpdate, ProductController.updateProduct);
router.delete('/:id', ProductValidationMiddleware.validateDelete, ProductController.deleteProduct);
router.get('/categoria/:categoryId', ProductController.getProductsByCategory);

module.exports = router;
