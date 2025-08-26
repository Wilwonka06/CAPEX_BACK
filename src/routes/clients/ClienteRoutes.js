const express = require('express');
const router = express.Router();
const ClientController = require('../../controllers/clients/ClientController');
const {
  validateCreateClient,
  validateUpdateClient,
  validateClientId,
  validateUserId,
  validateDeleteClient,
  validateCreateUserAndClient
} = require('../../middlewares/clients/ClientValidationMiddleware');
const {
  authenticateToken,
  requirePermission
} = require('../../middlewares/AuthMiddleware');

// ===== BASIC CLIENT OPERATIONS =====

// GET /api/clients - Obtener todos los clientes
router.get('/', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getAllClients
);

// GET /api/clients/:id - Obtener cliente por ID
router.get('/:id', 
  authenticateToken,
  requirePermission('read'),
  validateClientId,
  ClientController.getClientById
);

// GET /api/clients/user/:userId - Obtener cliente por ID de usuario
router.get('/user/:userId', 
  authenticateToken,
  requirePermission('read'),
  validateUserId,
  ClientController.getClientByUserId
);

// POST /api/clients - Crear nuevo cliente (requiere id_usuario)
router.post('/', 
  authenticateToken,
  requirePermission('create'),
  validateCreateClient,
  ClientController.createClient
);

// POST /api/clients/user-client - Crear usuario y cliente en una transacción (para uso futuro)
router.post('/user-client', 
  authenticateToken,
  requirePermission('create'),
  validateCreateUserAndClient,
  ClientController.createUserAndClient
);

// PUT /api/clients/:id - Actualizar cliente
router.put('/:id', 
  authenticateToken,
  requirePermission('update'),
  validateClientId,
  validateUpdateClient,
  ClientController.updateClient
);

// DELETE /api/clients/:id - Eliminar cliente
router.delete('/:id', 
  authenticateToken,
  requirePermission('delete'),
  validateClientId,
  validateDeleteClient,
  ClientController.deleteClient
);

// ===== STATISTICS AND SEARCH =====

// GET /api/clients/stats - Obtener estadísticas de clientes
router.get('/stats', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getClientStats
);

// GET /api/clients/search - Buscar clientes por criterios
router.get('/search', 
  authenticateToken,
  requirePermission('read'),
  ClientController.searchClients
);

module.exports = router;
