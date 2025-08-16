const express = require('express');
const router = express.Router();
const {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  searchCategorias,
  getCategoriasByEstado
} = require('../controllers/categoriaProductoController');
const {
  validateCreateCategoriaProducto,
  validateUpdateCategoriaProducto,
  validateSearchCategoriaProducto
} = require('../middlewares/categoriaProductoMiddleware');

// Rutas para categorías de productos
router.get('/', getAllCategorias);
router.get('/search', validateSearchCategoriaProducto, searchCategorias);
router.get('/estado/:estado', getCategoriasByEstado);
router.get('/:id', getCategoriaById);
router.post('/', validateCreateCategoriaProducto, createCategoria);
router.put('/:id', validateUpdateCategoriaProducto, updateCategoria);
router.delete('/:id', deleteCategoria);

module.exports = router;