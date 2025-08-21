const ClientService = require('../../services/clients/ClientService');

class ClientController {
  // Get all clients
  static async getAllClients(req, res) {
    try {
      const result = await ClientService.getAllClients();
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Get client by ID
  static async getClientById(req, res) {
    try {
      const { id } = req.params;
      const result = await ClientService.getClientById(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Create new client
  static async createClient(req, res) {
    try {
      const clientData = req.body;
      const result = await ClientService.createClient(clientData);
      
      if (!result.success) {
        let statusCode = 400;
        
        // Determine appropriate status code based on error type
        if (result.error === 'EMAIL_EXISTS' || result.error === 'DOCUMENT_EXISTS') {
          statusCode = 400;
        } else {
          statusCode = 500;
        }
        
        return res.status(statusCode).json(result);
      }
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Update client
  static async updateClient(req, res) {
    try {
      const { id } = req.params;
      const clientData = req.body;
      const result = await ClientService.updateClient(id, clientData);
      
      if (!result.success) {
        let statusCode = 404;
        
        // Determine appropriate status code based on error type
        if (result.error === 'EMAIL_EXISTS' || result.error === 'DOCUMENT_EXISTS') {
          statusCode = 400;
        } else if (result.error === 'CLIENT_NOT_FOUND') {
          statusCode = 404;
        } else {
          statusCode = 500;
        }
        
        return res.status(statusCode).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Delete client
  static async deleteClient(req, res) {
    try {
      const { id } = req.params;
      const result = await ClientService.deleteClient(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Get client statistics
  static async getClientStats(req, res) {
    try {
      const result = await ClientService.getClientStats();
      
      if (!result.success) {
        return res.status(500).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Search clients
  static async searchClients(req, res) {
    try {
      const criteria = req.query;
      const result = await ClientService.searchClients(criteria);
      
      if (!result.success) {
        return res.status(500).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Get client by email
  static async getClientByEmail(req, res) {
    try {
      const { email } = req.params;
      const result = await ClientService.getClientByEmail(email);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Get client by document number
  static async getClientByDocument(req, res) {
    try {
      const { documentNumber } = req.params;
      const result = await ClientService.getClientByDocument(documentNumber);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

module.exports = ClientController;
