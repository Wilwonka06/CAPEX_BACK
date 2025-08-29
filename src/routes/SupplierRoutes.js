const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/SupplierController');
const SupplierValidationMiddleware = require('../middlewares/SupplierValidationMiddleware');

// Rutas para proveedores
router.get('/', SupplierController.getAllSuppliers);
router.get('/:id', SupplierValidationMiddleware.validateGetById, SupplierController.getSupplierById);
router.post('/', SupplierValidationMiddleware.validateCreate, SupplierController.createSupplier);
router.put('/:id', SupplierValidationMiddleware.validateUpdate, SupplierController.updateSupplier);
router.delete('/:id', SupplierValidationMiddleware.validateDelete, SupplierController.deleteSupplier);

module.exports = router;
