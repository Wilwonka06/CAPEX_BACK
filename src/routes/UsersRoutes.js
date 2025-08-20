const express = require('express');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

/**
 * Rutas para gestión de usuarios
 * Todas las rutas comienzan con /api/users
 */

// POST /api/users - Crear nuevo usuario
router.post('/', UsersController.createUser);

// GET /api/users - Obtener todos los usuarios (con paginación y filtros)
router.get('/', UsersController.getAllUsers);

// GET /api/users/stats - Obtener estadísticas de usuarios
router.get('/stats', UsersController.getUserStats);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', UsersController.getUserById);

// GET /api/users/email/:email - Obtener usuario por email
router.get('/email/:email', UsersController.getUserByEmail);

// GET /api/users/document/:documentType/:documentNumber - Obtener usuario por documento
router.get('/document/:documentType/:documentNumber', UsersController.getUserByDocument);

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', UsersController.updateUser);

// PATCH /api/users/:id/password - Cambiar contraseña
router.patch('/:id/password', UsersController.changePassword);

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', UsersController.deleteUser);

module.exports = router;
