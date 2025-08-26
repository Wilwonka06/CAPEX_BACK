const Client = require('../../models/clients/Client');
const { sequelize } = require('../../config/database');

class ClientService {
  // Get all clients
  static async getAllClients() {
    try {
      const clients = await Client.findAll({
        where: { estado: true }
      });

      return {
        success: true,
        message: 'Clientes obtenidos exitosamente',
        data: clients
      };
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${error.message}`);
    }
  }

  // Get client by ID
  static async getClientById(id) {
    try {
      const client = await Client.findByPk(id);

      if (!client) {
        return {
          success: false,
          message: 'Cliente no encontrado'
        };
      }

      return {
        success: true,
        message: 'Cliente obtenido exitosamente',
        data: client
      };
    } catch (error) {
      throw new Error(`Error al obtener cliente: ${error.message}`);
    }
  }

  // Get client by user ID
  static async getClientByUserId(userId) {
    try {
      const client = await Client.findOne({
        where: { id_usuario: userId }
      });

      if (!client) {
        return {
          success: false,
          message: 'Cliente no encontrado'
        };
      }

      return {
        success: true,
        message: 'Cliente obtenido exitosamente',
        data: client
      };
    } catch (error) {
      throw new Error(`Error al obtener cliente por ID de usuario: ${error.message}`);
    }
  }

  // Create new client (this will be called after user creation)
  static async createClient(clientData) {
    const transaction = await sequelize.transaction();
    
    try {
      const {
        id_usuario,
        direccion,
        estado
      } = clientData;

      // Check if client already exists for this user
      const existingClient = await Client.findOne({ 
        where: { id_usuario },
        transaction 
      });
      
      if (existingClient) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Ya existe un cliente para este usuario',
          error: 'CLIENT_EXISTS'
        };
      }

      // Create the client
      const newClient = await Client.create({
        id_usuario,
        direccion: direccion || null,
        estado: estado !== undefined ? estado : true
      }, { transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Cliente creado exitosamente',
        data: newClient
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al crear cliente: ${error.message}`);
    }
  }

  // Update client
  static async updateClient(id, clientData) {
    const transaction = await sequelize.transaction();
    
    try {
      const {
        direccion,
        estado
      } = clientData;

      // Check if client exists
      const existingClient = await Client.findByPk(id, { transaction });
      if (!existingClient) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Cliente no encontrado',
          error: 'CLIENT_NOT_FOUND'
        };
      }

      // Update client data
      const updateData = {};
      if (direccion !== undefined) updateData.direccion = direccion;
      if (estado !== undefined) updateData.estado = estado;

      await existingClient.update(updateData, { transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: existingClient
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  // Delete client (soft delete by setting estado to false)
  static async deleteClient(id) {
    const transaction = await sequelize.transaction();
    
    try {
      const client = await Client.findByPk(id, { transaction });
      if (!client) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Cliente no encontrado',
          error: 'CLIENT_NOT_FOUND'
        };
      }

      // Soft delete by setting estado to false
      await client.update({ estado: false }, { transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Cliente eliminado exitosamente'
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
  }

  // Get client statistics
  static async getClientStats() {
    try {
      const totalClients = await Client.count();
      const activeClients = await Client.count({ where: { estado: true } });
      const inactiveClients = await Client.count({ where: { estado: false } });

      return {
        success: true,
        message: 'Estadísticas de clientes obtenidas exitosamente',
        data: {
          total_clients: totalClients,
          active_clients: activeClients,
          inactive_clients: inactiveClients
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de clientes: ${error.message}`);
    }
  }

  // Search clients by criteria
  static async searchClients(criteria) {
    try {
      const { estado } = criteria;
      
      const whereClause = {};
      
      if (estado !== undefined) {
        whereClause.estado = estado;
      }

      const clients = await Client.findAll({
        where: whereClause,
        order: [['id_cliente', 'ASC']]
      });

      return {
        success: true,
        message: 'Búsqueda de clientes completada exitosamente',
        data: clients
      };
    } catch (error) {
      throw new Error(`Error al buscar clientes: ${error.message}`);
    }
  }

  // Create user and client in one transaction (prepared for future integration)
  static async createUserAndClient(userData, clientData) {
    const transaction = await sequelize.transaction();
    
    try {
      // TODO: When User model is available, implement this logic:
      // 1. Create user in usuarios table
      // 2. Assign 'Cliente' role in usuarios_roles table
      // 3. Create client record in clientes table
      
      // For now, this is a placeholder that will be implemented later
      throw new Error('Función createUserAndClient no implementada aún. Los modelos de usuario deben ser proporcionados primero.');
      
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al crear usuario y cliente: ${error.message}`);
    }
  }
}

module.exports = ClientService;
