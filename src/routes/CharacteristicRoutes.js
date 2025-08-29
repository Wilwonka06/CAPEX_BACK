const express = require('express');
const router = express.Router();
const CharacteristicController = require('../controllers/CharacteristicController');
const CharacteristicValidationMiddleware = require('../middlewares/CharacteristicValidationMiddleware');

// Rutas para características
router.get('/', CharacteristicController.getAllCharacteristics);
router.get('/:id', CharacteristicValidationMiddleware.validateGetById, CharacteristicController.getCharacteristicById);
router.post('/', CharacteristicValidationMiddleware.validateCreate, CharacteristicController.createCharacteristic);
router.put('/:id', CharacteristicValidationMiddleware.validateUpdate, CharacteristicController.updateCharacteristic);
router.delete('/:id', CharacteristicValidationMiddleware.validateDelete, CharacteristicController.deleteCharacteristic);

module.exports = router;
