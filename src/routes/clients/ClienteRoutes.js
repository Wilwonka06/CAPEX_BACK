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

// ===== SPECIFIC CLIENT OPERATIONS PRIMERO =====
router.get('/stats', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getClientStats
);

router.get('/search', 
  authenticateToken,
  requirePermission('read'),
  ClientController.searchClients
);

router.get('/email/:email', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getClientByEmail
);

router.get('/document/:documentNumber', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getClientByDocument
);

// ===== BASIC CLIENT OPERATIONS DESPUÉS =====
router.get('/', 
  authenticateToken,
  requirePermission('read'),
  ClientController.getAllClients
);

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




module.exports = router;
