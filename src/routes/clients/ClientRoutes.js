const express = require('express');
const router = express.Router();
const ClientController = require('../../controllers/ClientController');
const ClientValidationMiddleware = require('../../middlewares/ClientValidationMiddleware');
const AuthMiddleware = require('../../middlewares/AuthMiddleware');

// Rutas para clientes
router.get('/', AuthMiddleware.verifyToken, ClientController.getAllClients);
router.get('/:id', AuthMiddleware.verifyToken, ClientValidationMiddleware.validateGetById, ClientController.getClientById);
router.post('/', AuthMiddleware.verifyToken, ClientValidationMiddleware.validateCreate, ClientController.createClient);
router.put('/:id', AuthMiddleware.verifyToken, ClientValidationMiddleware.validateUpdate, ClientController.updateClient);
router.delete('/:id', AuthMiddleware.verifyToken, ClientValidationMiddleware.validateDelete, ClientController.deleteClient);
router.get('/estadisticas', AuthMiddleware.verifyToken, ClientController.getClientStats);
router.get('/buscar', AuthMiddleware.verifyToken, ClientController.searchClients);
router.get('/email/:email', AuthMiddleware.verifyToken, ClientController.getClientByEmail);
router.get('/documento/:documentNumber', AuthMiddleware.verifyToken, ClientController.getClientByDocument);

module.exports = router;
