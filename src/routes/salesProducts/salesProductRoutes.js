const express = require('express');
const router = express.Router();
const {
  getAllVentas,
  searchVentas,
  getVentaById,
  createVenta,
  updateVenta,
  cancelarVenta,
  getVentasByCliente,
  getVentasByFechas
} = require('../controllers/salesProducts/SalesProductController');
const {
  validateCreateVentaProducto,
  validateUpdateVentaProducto,
  validateSearchVentas,
  validateFechasFilter,
  validatePaginacion,
  validateIdParam
} = require('../middlewares/salesProducts/SalesProductMiddleware');

// Rutas de búsqueda y filtros
router.get('/search', validateSearchVentas, searchVentas);
router.get('/fechas', validateFechasFilter, getVentasByFechas);
router.get('/cliente/:id', validateIdParam, validatePaginacion, getVentasByCliente);

// Rutas CRUD principales
router.get('/', validatePaginacion, getAllVentas);
router.get('/:id', validateIdParam, getVentaById);
router.post('/', validateCreateVentaProducto, createVenta);
router.put('/:id', validateIdParam, validateUpdateVentaProducto, updateVenta);
router.delete('/:id', validateIdParam, cancelarVenta);

module.exports = router;