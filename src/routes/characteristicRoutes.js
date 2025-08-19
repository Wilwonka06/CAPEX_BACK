const express = require('express');
const router = express.Router();
const {
  getAllCaracteristicas,
  getCaracteristicaById,
  createCaracteristica,
  updateCaracteristica,
  deleteCaracteristica
} = require('../controllers/characteristicController');
const {
  validateCreateCaracteristica,
  validateUpdateCaracteristica
} = require('../middlewares/characteristicMiddleware');

// Rutas para características
router.get('/', getAllCaracteristicas);
router.get('/:id', getCaracteristicaById);
router.post('/', validateCreateCaracteristica, createCaracteristica);
router.put('/:id', validateUpdateCaracteristica, updateCaracteristica);
router.delete('/:id', deleteCaracteristica);

module.exports = router;
