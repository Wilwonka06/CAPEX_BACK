const express = require('express');
const router = express.Router();
const UserRoleController = require('../controllers/UserRoleController');
const UserRoleValidationMiddleware = require('../middlewares/UserRoleValidationMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

// Rutas para roles de usuario
router.get('/', AuthMiddleware.verifyToken, UserRoleController.getAllUserRoles);
router.get('/:id', AuthMiddleware.verifyToken, UserRoleValidationMiddleware.validateGetById, UserRoleController.getUserRoleById);
router.post('/', AuthMiddleware.verifyToken, UserRoleValidationMiddleware.validateCreate, UserRoleController.createUserRole);
router.put('/:id', AuthMiddleware.verifyToken, UserRoleValidationMiddleware.validateUpdate, UserRoleController.updateUserRole);
router.delete('/:id', AuthMiddleware.verifyToken, UserRoleValidationMiddleware.validateDelete, UserRoleController.deleteUserRole);
router.get('/usuario/:userId', AuthMiddleware.verifyToken, UserRoleController.getUserRolesByUser);
router.get('/rol/:roleId', AuthMiddleware.verifyToken, UserRoleController.getUserRolesByRole);

module.exports = router;
