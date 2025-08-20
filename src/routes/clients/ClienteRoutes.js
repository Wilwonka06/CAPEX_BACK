const express = require('express');
const router = express.Router();
const ClientController = require('../../controllers/clients/ClientController');
const {
  validateCreateClient,
  validateUpdateClient,
  validateClientId,
  validateDeleteClient,
  validateToggleClientStatus,
  validateUserId
} = require('../../middlewares/clients/ClientValidationMiddleware');
const {
  authenticateToken,
  requirePermission
} = require('../../middlewares/AuthMiddleware');

// ===== RUTAS BÁSICAS DE CLIENTES =====

// GET /api/clientes - Obtener todos los clientes
router.get('/', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getAllClients
);

// GET /api/clientes/:id - Obtener cliente por ID
router.get('/:id', 
  authenticateToken,
  requirePermission('read'),
  validateClientId,
  ClientController.getClientById
);

// POST /api/clientes - Crear nuevo cliente
router.post('/', 
  authenticateToken,
  requirePermission('create'),
  validateCreateClient,
  ClientController.createClient
);

// PUT /api/clientes/:id - Actualizar cliente
router.put('/:id', 
  authenticateToken,
  requirePermission('update'),
  validateUpdateClient,
  ClientController.updateClient
);

// DELETE /api/clientes/:id - Eliminar cliente
router.delete('/:id', 
  authenticateToken,
  requirePermission('delete'),
  validateDeleteClient,
  ClientController.deleteClient
);

// ===== RUTAS ESPECÍFICAS DE CLIENTES =====

// GET /api/clientes/usuario/:userId - Buscar cliente por ID de usuario
router.get('/usuario/:userId', 
  authenticateToken,
  requirePermission('read'),
  validateUserId,
  ClientController.findClientByUserId
);

// GET /api/clientes/activos - Obtener clientes activos
router.get('/activos/list', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getActiveClients
);

// GET /api/clientes/inactivos - Obtener clientes inactivos
router.get('/inactivos/list', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getInactiveClients
);

// PATCH /api/clientes/:id/activate - Activar cliente
router.patch('/:id/activate', 
  authenticateToken,
  requirePermission('update'),
  validateToggleClientStatus,
  ClientController.activateClient
);

// PATCH /api/clientes/:id/deactivate - Desactivar cliente
router.patch('/:id/deactivate', 
  authenticateToken,
  requirePermission('update'),
  validateToggleClientStatus,
  ClientController.deactivateClient
);

// GET /api/clientes/stats - Obtener estadísticas de clientes
router.get('/stats/overview', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getClientStats
);

module.exports = router;
