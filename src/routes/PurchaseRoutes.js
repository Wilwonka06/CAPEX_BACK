const express = require('express');
const router = express.Router();
const {
  getAllCompras,
  getCompraById,
  createCompra,
  cancelarCompra,
  getComprasByProveedor,
  getComprasByFecha,
  getEstadisticasCompras
} = require('../controllers/PurchaseController');
const {
  validateCreateCompra,
  validateCompraId,
  validateProveedorId,
  validateFechaFilter,
  validatePagination
} = require('../middlewares/PurchaseMiddleware');

// Rutas para compras
router.get('/', validatePagination, getAllCompras);
router.get('/estadisticas', getEstadisticasCompras);
router.get('/proveedor/:idProveedor', validateProveedorId, getComprasByProveedor);
router.get('/fecha', validateFechaFilter, getComprasByFecha);
router.get('/:id', validateCompraId, getCompraById);
router.post('/', validateCreateCompra, createCompra);
router.patch('/:id/cancelar', validateCompraId, cancelarCompra);

module.exports = router;