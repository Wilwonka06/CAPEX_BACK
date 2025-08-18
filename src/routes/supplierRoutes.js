const express = require('express');
const router = express.Router();
const {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  searchProveedores,
  getProveedoresByEstado
} = require('../controllers/supplierController');
const {
  validateCreateProveedor,
  validateUpdateProveedor
} = require('../middlewares/supplierMiddleware');

// Rutas para proveedores
router.get('/', getAllProveedores);
router.get('/search', searchProveedores);
router.get('/estado/:estado', getProveedoresByEstado);
router.get('/:id', getProveedorById);
router.post('/', validateCreateProveedor, createProveedor);
router.put('/:id', validateUpdateProveedor, updateProveedor);
router.delete('/:id', deleteProveedor);

module.exports = router;
