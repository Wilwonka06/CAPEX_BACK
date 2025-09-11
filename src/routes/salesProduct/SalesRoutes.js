const express = require('express');
const router = express.Router();
const {
  getAllSales,
  getSaleById,
  createSale,
  createSaleFromOrder,
  cancelSale,
  searchSales,
  getSalesByStatus,
  getSalesByClient,
  getSalesByDateRange,
  getSalesStatistics,
  updatePaymentMethod
} = require('../../controllers/salesProduct/SalesController');
const {
  validateCreateSale,
  validateCreateSaleFromOrder,
  validateUpdatePaymentMethod,
  validateSaleId,
  validateStatusParam,
  validateClientParam,
  validateSearchSales,
  validateDateRangeQuery,
  validatePagination
} = require('../../middlewares/salesProduct/SalesMiddleware');

// Rutas específicas (deben ir antes de las rutas con parámetros)
router.get('/buscar', validateSearchSales, searchSales);
router.get('/estadisticas', getSalesStatistics);
router.get('/fechas', validateDateRangeQuery, getSalesByDateRange);
router.get('/estado/:estado', validateStatusParam, validatePagination, getSalesByStatus);
router.get('/cliente/:clienteId', validateClientParam, validatePagination, getSalesByClient);

// Rutas para crear ventas
router.post('/desde-pedido', validateCreateSaleFromOrder, createSaleFromOrder);

// Rutas generales
router.get('/', validatePagination, getAllSales);
router.get('/:id', validateSaleId, getSaleById);
router.post('/', validateCreateSale, createSale);
router.patch('/:id/cancelar', validateSaleId, cancelSale);
router.patch('/:id/metodo-pago', validateUpdatePaymentMethod, updatePaymentMethod);

module.exports = router;