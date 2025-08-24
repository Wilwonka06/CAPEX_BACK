const express = require('express');
const router = express.Router();
const ClientController = require('../../controllers/clients/ClientController');
const {
  validateCreateClient,
  validateUpdateClient,
  validateClientId,
  validateDeleteClient,
  validateClientEmailUnique,
  validateClientDocumentUnique,
  hashPassword
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

// POST /api/clients - Crear nuevo cliente
router.post('/', 
  authenticateToken,
  requirePermission('create'),
  validateCreateClient,
  validateClientEmailUnique,
  validateClientDocumentUnique,
  hashPassword,
  ClientController.createClient
);

// PUT /api/clients/:id - Actualizar cliente
router.put('/:id', 
  authenticateToken,
  requirePermission('update'),
  validateClientId,
  validateUpdateClient,
  validateClientEmailUnique,
  validateClientDocumentUnique,
  hashPassword,
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

// ===== SPECIFIC CLIENT OPERATIONS =====

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

// GET /api/clients/email/:email - Obtener cliente por email
router.get('/email/:email', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getClientByEmail
);

// GET /api/clients/document/:documentNumber - Obtener cliente por número de documento
router.get('/document/:documentNumber', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getClientByDocument
);

module.exports = router;
