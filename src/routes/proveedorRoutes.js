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
} = require('../controllers/proveedorController');

// Rutas para proveedores
router.get('/', getAllProveedores);
router.get('/search', searchProveedores);
router.get('/estado/:estado', getProveedoresByEstado);
router.get('/:id', getProveedorById);
router.post('/', createProveedor);
router.put('/:id', updateProveedor);
router.delete('/:id', deleteProveedor);

module.exports = router;
