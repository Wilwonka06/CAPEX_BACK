const ClientService = require('../services/ClientService');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class ClientController {
  // Obtener todos los clientes
  static async getAllClients(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const clients = await ClientService.getAllClients(page, limit);
      return ResponseMiddleware.success(res, 'Clientes obtenidos exitosamente', clients);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener clientes', error);
    }
  }

  // Obtener cliente por ID
  static async getClientById(req, res) {
    try {
      const { id } = req.params;
      const client = await ClientService.getClientById(id);
      
      if (!client) {
        return ResponseMiddleware.error(res, 'Cliente no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Cliente obtenido exitosamente', client);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener cliente', error);
    }
  }

  // Crear nuevo cliente
  static async createClient(req, res) {
    try {
      const clientData = req.body;
      const newClient = await ClientService.createClient(clientData);
      return ResponseMiddleware.success(res, 'Cliente creado exitosamente', newClient, 201);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al crear cliente', error);
    }
  }

  // Actualizar cliente
  static async updateClient(req, res) {
    try {
      const { id } = req.params;
      const clientData = req.body;
      const updatedClient = await ClientService.updateClient(id, clientData);
      
      if (!updatedClient) {
        return ResponseMiddleware.error(res, 'Cliente no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Cliente actualizado exitosamente', updatedClient);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al actualizar cliente', error);
    }
  }

  // Eliminar cliente
  static async deleteClient(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ClientService.deleteClient(id);
      
      if (!deleted) {
        return ResponseMiddleware.error(res, 'Cliente no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Cliente eliminado exitosamente');
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al eliminar cliente', error);
    }
  }

  // Obtener estadísticas de clientes
  static async getClientStats(req, res) {
    try {
      const stats = await ClientService.getClientStats();
      return ResponseMiddleware.success(res, 'Estadísticas obtenidas exitosamente', stats);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener estadísticas', error);
    }
  }

  // Buscar clientes
  static async searchClients(req, res) {
    try {
      const { q, page = 1, limit = 10 } = req.query;
      const clients = await ClientService.searchClients(q, page, limit);
      return ResponseMiddleware.success(res, 'Búsqueda completada exitosamente', clients);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error en la búsqueda', error);
    }
  }

  // Obtener cliente por email
  static async getClientByEmail(req, res) {
    try {
      const { email } = req.params;
      const client = await ClientService.getClientByEmail(email);
      
      if (!client) {
        return ResponseMiddleware.error(res, 'Cliente no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Cliente obtenido exitosamente', client);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener cliente', error);
    }
  }

  // Obtener cliente por número de documento
  static async getClientByDocument(req, res) {
    try {
      const { documentNumber } = req.params;
      const client = await ClientService.getClientByDocument(documentNumber);
      
      if (!client) {
        return ResponseMiddleware.error(res, 'Cliente no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Cliente obtenido exitosamente', client);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener cliente', error);
    }
  }
}

module.exports = ClientController;
