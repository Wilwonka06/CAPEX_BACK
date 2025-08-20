const ClientService = require('../../services/clients/ClientService');
const { asyncHandler } = require('../../middlewares/ErrorMiddleware');

class ClientController {
  // ===== BASIC CLIENT OPERATIONS =====
  
  // Get all clients
  static getAllClients = asyncHandler(async (req, res) => {
    const result = await ClientService.getAllClients();
    res.json(result);
  });

  // Get client by ID
  static getClientById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ClientService.getClientById(id);
    res.json(result);
  });

  // Create new client
  static createClient = asyncHandler(async (req, res) => {
    const result = await ClientService.createClient(req.body);
    res.status(201).json(result);
  });

  // Update client
  static updateClient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ClientService.updateClient(id, req.body);
    res.json(result);
  });

  // Delete client
  static deleteClient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ClientService.deleteClient(id);
    res.json(result);
  });

  // ===== SPECIFIC CLIENT OPERATIONS =====

  // Find client by user ID
  static findClientByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const client = await ClientService.findClientByUserId(userId);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found for this user'
      });
    }

    res.json({
      success: true,
      data: client
    });
  });

  // Get active clients
  static getActiveClients = asyncHandler(async (req, res) => {
    const result = await ClientService.getActiveClients();
    res.json(result);
  });

  // Get inactive clients
  static getInactiveClients = asyncHandler(async (req, res) => {
    const result = await ClientService.getInactiveClients();
    res.json(result);
  });

  // Activate client
  static activateClient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ClientService.activateClient(id);
    res.json(result);
  });

  // Deactivate client
  static deactivateClient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ClientService.deactivateClient(id);
    res.json(result);
  });

  // Get client statistics
  static getClientStats = asyncHandler(async (req, res) => {
    const result = await ClientService.getClientStats();
    res.json(result);
  });
}

module.exports = ClientController;
