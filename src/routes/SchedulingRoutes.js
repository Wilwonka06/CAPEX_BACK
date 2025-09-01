const express = require('express');
const router = express.Router();
const SchedulingController = require('../controllers/SchedulingController');
const { validateScheduling } = require('../middlewares/SchedulingMiddleware');

// CRUD
router.post('/', validateScheduling, SchedulingController.create);
router.get('/', SchedulingController.getAll);
router.get('/:id', SchedulingController.getById);
router.put('/:id', validateScheduling, SchedulingController.update);
router.delete('/:id', SchedulingController.delete);

module.exports = router;
