// src/routes/ServiceCategoryRoutes.js
const express = require('express');
const router = express.Router();

const ServiceCategoryController = require('../controllers/ServiceCategoryController');
const { validateServiceCategoryData, validateServiceCategoryUpdate } = require('../middlewares/ServiceCategoryMiddleware');

// Crear nueva categoría
router.post('/', validateServiceCategoryData, ServiceCategoryController.create);

// Obtener todas las categorías
router.get('/', ServiceCategoryController.getAll);

// Obtener categorías activas
router.get('/active', ServiceCategoryController.getActive);

// Obtener categorías por estado
router.get('/status/:status', ServiceCategoryController.getByStatus);

// Buscar categorías
router.get('/search', ServiceCategoryController.search);

// Obtener una categoría por ID
router.get('/:id', ServiceCategoryController.getById);

// Actualizar una categoría por ID
router.put('/:id', validateServiceCategoryUpdate, ServiceCategoryController.update);

// Cambiar estado de una categoría
router.patch('/:id/status', ServiceCategoryController.changeStatus);

// Eliminar una categoría por ID
router.delete('/:id', ServiceCategoryController.delete);

module.exports = router;
