const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const UserValidationMiddleware = require('../middlewares/UserValidationMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

// Rutas para usuarios
router.get('/', AuthMiddleware.verifyToken, UserController.getAllUsers);
router.get('/:id', AuthMiddleware.verifyToken, UserValidationMiddleware.validateGetById, UserController.getUserById);
router.post('/', AuthMiddleware.verifyToken, UserValidationMiddleware.validateCreate, UserController.createUser);
router.put('/:id', AuthMiddleware.verifyToken, UserValidationMiddleware.validateUpdate, UserController.updateUser);
router.delete('/:id', AuthMiddleware.verifyToken, UserValidationMiddleware.validateDelete, UserController.deleteUser);
router.post('/login', UserValidationMiddleware.validateLogin, UserController.login);
router.post('/logout', UserController.logout);
router.get('/perfil', AuthMiddleware.verifyToken, UserController.getProfile);
router.put('/perfil', AuthMiddleware.verifyToken, UserController.updateProfile);
router.put('/cambiar-password', AuthMiddleware.verifyToken, UserValidationMiddleware.validateChangePassword, UserController.changePassword);

module.exports = router;
