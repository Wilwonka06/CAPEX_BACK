const express = require('express');
const router = express.Router();
const SchedulingController = require('../controllers/SchedulingController');
const { validateCreate, validateUpdate } = require('../middlewares/SchedulingMiddleware');

// POST requiere todos los campos
router.post('/', validateCreate, SchedulingController.create);

// GETs normales
router.get('/', SchedulingController.getAll);
// Buscar programaciones por usuario
router.get('/usuario/:id_usuario', SchedulingController.getByUser);

// Búsqueda general de programaciones
router.get('/search', SchedulingController.searchSchedulings);

router.get('/:id', SchedulingController.getById);

// PUT solo valida consistencia de campos enviados
router.put('/:id', validateUpdate, SchedulingController.update);

// DELETE normal
router.delete('/:id', SchedulingController.delete);

module.exports = router;
