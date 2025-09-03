const express = require('express');
const router = express.Router();
const SchedulingController = require('../controllers/SchedulingController');
const { validateCreate, validateUpdate } = require('../middlewares/SchedulingMiddleware');

// POST requiere todos los campos
router.post('/', validateCreate, SchedulingController.create);

// GETs normales
router.get('/', SchedulingController.getAll);
router.get('/:id', SchedulingController.getById);

// PUT solo valida consistencia de campos enviados
router.put('/:id', validateUpdate, SchedulingController.update);

// DELETE normal
router.delete('/:id', SchedulingController.delete);

module.exports = router;
