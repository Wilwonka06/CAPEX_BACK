const { Client, User } = require('../../models/clients/Associations');

class ClientService {
  // Get all clients with user information
  static async getAllClients() {
    try {
      const clients = await Client.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['id_user', 'name', 'email', 'phone', 'registration_date', 'status']
        }],
        order: [['id_client', 'ASC']]
      });

      return {
        success: true,
        data: clients
      };
    } catch (error) {
      throw new Error(`Error getting clients: ${error.message}`);
    }
  }

  // Get client by ID with user information
  static async getClientById(id) {
    try {
      const client = await Client.findByPk(id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id_user', 'name', 'email', 'phone', 'registration_date', 'status']
        }]
      });

      if (!client) {
        throw new Error('Client not found');
      }

      return {
        success: true,
        data: client
      };
    } catch (error) {
      throw new Error(`Error getting client: ${error.message}`);
    }
  }

  // Create new client
  static async createClient(clientData) {
    try {
      const { id_user, address, status } = clientData;

      // Check if user exists
      const user = await User.findByPk(id_user);
      if (!user) {
        throw new Error('Specified user does not exist');
      }

      // Check if client already exists for this user
      const existingClient = await Client.findOne({ where: { id_user } });
      if (existingClient) {
        throw new Error('Client already exists for this user');
      }

      // Create client
      const newClient = await Client.create({
        id_user,
        address: address || null,
        status: status !== undefined ? status : true
      });

      // Get client with user information
      const clientWithUser = await this.getClientById(newClient.id_client);

      return {
        success: true,
        message: 'Client created successfully',
        data: clientWithUser.data
      };
    } catch (error) {
      throw new Error(`Error creating client: ${error.message}`);
    }
  }

  // Update client
  static async updateClient(id, clientData) {
    try {
      const { address, status } = clientData;

      // Check if client exists
      const client = await Client.findByPk(id);
      if (!client) {
        throw new Error('Client not found');
      }

      // Update fields if provided
      if (address !== undefined) {
        client.address = address;
      }
      if (status !== undefined) {
        client.status = status;
      }

      await client.save();

      // Get updated client with user information
      const updatedClient = await this.getClientById(id);

      return {
        success: true,
        message: 'Client updated successfully',
        data: updatedClient.data
      };
    } catch (error) {
      throw new Error(`Error updating client: ${error.message}`);
    }
  }

  // Delete client
  static async deleteClient(id) {
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        throw new Error('Client not found');
      }

      await client.destroy();

      return {
        success: true,
        message: 'Client deleted successfully'
      };
    } catch (error) {
      throw new Error(`Error deleting client: ${error.message}`);
    }
  }

  // Check if client exists
  static async clientExists(id) {
    try {
      const client = await Client.findByPk(id);
      return !!client;
    } catch (error) {
      throw new Error(`Error checking client existence: ${error.message}`);
    }
  }

  // Find client by user ID
  static async findClientByUserId(userId) {
    try {
      const client = await Client.findOne({
        where: { id_user: userId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id_user', 'name', 'email', 'phone', 'registration_date', 'status']
        }]
      });

      return client;
    } catch (error) {
      throw new Error(`Error finding client by user ID: ${error.message}`);
    }
  }

  // Get active clients
  static async getActiveClients() {
    try {
      const clients = await Client.findAll({
        where: { status: true },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id_user', 'name', 'email', 'phone', 'registration_date', 'status']
        }],
        order: [['id_client', 'ASC']]
      });

      return {
        success: true,
        data: clients
      };
    } catch (error) {
      throw new Error(`Error getting active clients: ${error.message}`);
    }
  }

  // Get inactive clients
  static async getInactiveClients() {
    try {
      const clients = await Client.findAll({
        where: { status: false },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id_user', 'name', 'email', 'phone', 'registration_date', 'status']
        }],
        order: [['id_client', 'ASC']]
      });

      return {
        success: true,
        data: clients
      };
    } catch (error) {
      throw new Error(`Error getting inactive clients: ${error.message}`);
    }
  }

  // Activate client
  static async activateClient(id) {
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        throw new Error('Client not found');
      }

      client.status = true;
      await client.save();

      return {
        success: true,
        message: 'Client activated successfully'
      };
    } catch (error) {
      throw new Error(`Error activating client: ${error.message}`);
    }
  }

  // Deactivate client
  static async deactivateClient(id) {
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        throw new Error('Client not found');
      }

      client.status = false;
      await client.save();

      return {
        success: true,
        message: 'Client deactivated successfully'
      };
    } catch (error) {
      throw new Error(`Error deactivating client: ${error.message}`);
    }
  }

  // Get client statistics
  static async getClientStats() {
    try {
      const totalClients = await Client.count();
      const activeClients = await Client.count({ where: { status: true } });
      const inactiveClients = await Client.count({ where: { status: false } });

      return {
        success: true,
        data: {
          total_clients: totalClients,
          active_clients: activeClients,
          inactive_clients: inactiveClients
        }
      };
    } catch (error) {
      throw new Error(`Error getting client statistics: ${error.message}`);
    }
  }
}

module.exports = ClientService;
