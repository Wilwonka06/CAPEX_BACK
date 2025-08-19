const express = require('express');
const router = express.Router();
const {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  searchProductos
} = require('../controllers/productController');
const {
  validateCreateProducto,
  validateUpdateProducto
} = require('../middlewares/productMiddleware');

// Rutas para productos
router.get('/', getAllProductos);
router.get('/search', searchProductos);
router.get('/:id', getProductoById);
router.post('/', validateCreateProducto, createProducto);
router.put('/:id', validateUpdateProducto, updateProducto);
router.delete('/:id', deleteProducto);

module.exports = router;
