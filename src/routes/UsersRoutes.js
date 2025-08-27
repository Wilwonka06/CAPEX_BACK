const express = require('express');
const UsersController = require('../controllers/UsersController');
const UsersMiddleware = require('../middlewares/UsersMiddleware');
const UserRoleValidationMiddleware = require('../middlewares/UserRoleValidationMiddleware');

const router = express.Router();

/**
 * Rutas para gestión de usuarios
 * Todas las rutas comienzan con /api/users
 */

// POST /api/users - Crear nuevo usuario
router.post('/', UsersMiddleware.validateCreateUser, UserRoleValidationMiddleware.validateRoleId, UsersController.createUser);

// GET /api/users - Obtener todos los usuarios (con paginación y filtros)
router.get('/', UsersMiddleware.validateSearchParams, UserRoleValidationMiddleware.validateRoleIdInQuery, UsersController.getAllUsers);

// GET /api/users/search - Búsqueda avanzada de usuarios
router.get('/search', UsersMiddleware.validateSearchParams, UserRoleValidationMiddleware.validateRoleIdInQuery, UsersController.searchUsers);

// GET /api/users/stats - Obtener estadísticas de usuarios
router.get('/stats', UsersController.getUserStats);

// GET /api/users/available-roles - Obtener roles disponibles
router.get('/available-roles', UsersController.getAvailableRoles);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', UsersMiddleware.validateUserId, UsersController.getUserById);

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', UsersMiddleware.validateUpdateUser, UserRoleValidationMiddleware.validateRoleId, UsersController.updateUser);

// PATCH /api/users/:id/password - Cambiar contraseña
router.patch('/:id/password', UsersMiddleware.validateChangePassword, UsersController.changePassword);

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', UsersMiddleware.validateUserId, UsersController.deleteUser);

module.exports = router;
