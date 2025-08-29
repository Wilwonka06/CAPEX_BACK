const express = require('express');
const router = express.Router();
const RoleController = require('../../controllers/RoleController');
const RoleValidationMiddleware = require('../../middlewares/RoleValidationMiddleware');
const AuthMiddleware = require('../../middlewares/AuthMiddleware');

// Rutas para roles
router.get('/', AuthMiddleware.verifyToken, RoleController.getAllRoles);
router.get('/:id', AuthMiddleware.verifyToken, RoleValidationMiddleware.validateGetById, RoleController.getRoleById);
router.post('/', AuthMiddleware.verifyToken, RoleValidationMiddleware.validateCreate, RoleController.createRole);
router.put('/:id', AuthMiddleware.verifyToken, RoleValidationMiddleware.validateUpdate, RoleController.updateRole);
router.delete('/:id', AuthMiddleware.verifyToken, RoleValidationMiddleware.validateDelete, RoleController.deleteRole);
router.get('/permisos/todos', AuthMiddleware.verifyToken, RoleController.getAllPermissions);
router.get('/privilegios/todos', AuthMiddleware.verifyToken, RoleController.getAllPrivileges);

module.exports = router;
