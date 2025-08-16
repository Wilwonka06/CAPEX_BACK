const express = require('express');
const router = express.Router();
const {
  getAllCaracteristicas,
  getCaracteristicaById,
  createCaracteristica,
  updateCaracteristica,
  deleteCaracteristica
} = require('../controllers/caracteristicaController');

// Rutas para características
router.get('/', getAllCaracteristicas);
router.get('/:id', getCaracteristicaById);
router.post('/', createCaracteristica);
router.put('/:id', updateCaracteristica);
router.delete('/:id', deleteCaracteristica);

module.exports = router;
