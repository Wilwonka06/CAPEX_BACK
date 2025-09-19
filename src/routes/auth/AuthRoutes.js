const express = require('express');
const router = express.Router();

// Importar controladores
const AuthController = require('../../controllers/auth/AuthController');

// Importar middlewares
const AuthValidationMiddleware = require('../../middlewares/auth/AuthValidationMiddleware');
const AuthMiddleware = require('../../middlewares/auth/AuthMiddleware');

/**
 * Rutas de autenticación
 */

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', 
  AuthValidationMiddleware.validateRegister,
  AuthController.register
);

// POST /api/auth/login - Iniciar sesión
router.post('/login',
  AuthValidationMiddleware.validateLogin,
  AuthController.login
);

// POST /api/auth/verify - Verificar token
router.post('/verify',
  AuthController.verifyToken
);

// GET /api/auth/me - Obtener información del usuario actual (requiere autenticación)
router.get('/me',
  AuthMiddleware.authenticateToken,
  AuthController.getCurrentUser
);

// PUT /api/auth/profile - Editar perfil del usuario logueado (requiere autenticación)
router.put('/profile',
  AuthMiddleware.authenticateToken,
  AuthValidationMiddleware.validateEditProfile,
  AuthController.editProfile
);

// POST /api/auth/logout - Cerrar sesión (requiere autenticación)
router.post('/logout',
  AuthMiddleware.authenticateToken,
  AuthController.logout
);

module.exports = router;
