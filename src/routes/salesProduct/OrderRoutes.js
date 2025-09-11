const express = require('express');
const router = express.Router();
const {
  getAllPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
  searchPedidos,
  getPedidosByEstado,
  cambiarEstadoPedido,
  getEstadisticas,
  getPedidosByFechas
} = require('../../controllers/salesProduct/OrderController');
const {
  validateCreatePedido,
  validateUpdatePedido,
  validateCambiarEstado,
  validateSearchPedidos,
  validateEstadoParam,
  validateFechasQuery,
  validatePagination
} = require('../../middlewares/salesProduct/OrderMiddleware');

// Rutas específicas (deben ir antes de las rutas con parámetros)
router.get('/search', validateSearchPedidos, searchPedidos);
router.get('/estadisticas', getEstadisticas);
router.get('/fechas', validateFechasQuery, getPedidosByFechas);
router.get('/estado/:estado', validateEstadoParam, validatePagination, getPedidosByEstado);

// Rutas generales
router.get('/', validatePagination, getAllPedidos);
router.get('/:id', getPedidoById);
router.post('/', validateCreatePedido, createPedido);
router.put('/:id', validateUpdatePedido, updatePedido);
router.patch('/:id/estado', validateCambiarEstado, cambiarEstadoPedido);
router.delete('/:id', deletePedido);

module.exports = router;