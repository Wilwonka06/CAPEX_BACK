const Client = require('../../models/clients/Client');
const { sequelize } = require('../../config/database');

class ClientService {
  // Get all clients
  static async getAllClients() {
    try {
      const clients = await Client.findAll({
        where: { status: true },
        attributes: { exclude: ['password'] } // Exclude password from response
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
      const client = await Client.findByPk(id, {
        attributes: { exclude: ['password'] } // Exclude password from response
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
      throw new Error(`Error al obtener cliente: ${error.message}`);
    }
  }

  // Get client by email
  static async getClientByEmail(email) {
    try {
      const client = await Client.findOne({
        where: { email },
        attributes: { exclude: ['password'] } // Exclude password from response
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
      throw new Error(`Error al obtener cliente por email: ${error.message}`);
    }
  }

  // Get client by document number
  static async getClientByDocument(documentNumber) {
    try {
      const client = await Client.findOne({
        where: { documentNumber },
        attributes: { exclude: ['password'] } // Exclude password from response
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
      throw new Error(`Error al obtener cliente por documento: ${error.message}`);
    }
  }

  // Create new client
  static async createClient(clientData) {
    const transaction = await sequelize.transaction();
    
    try {
      const {
        documentType,
        documentNumber,
        firstName,
        lastName,
        email,
        phone,
        password,
        address,
        status
      } = clientData;

      // Check if email already exists
      const existingEmail = await Client.findOne({ where: { email } });
      if (existingEmail) {
        await transaction.rollback();
        return {
          success: false,
          message: 'El correo electrónico ya está registrado',
          error: 'EMAIL_EXISTS'
        };
      }

      // Check if document number already exists
      const existingDocument = await Client.findOne({ where: { documentNumber } });
      if (existingDocument) {
        await transaction.rollback();
        return {
          success: false,
          message: 'El número de documento ya está registrado',
          error: 'DOCUMENT_EXISTS'
        };
      }

      // Create the client
      const newClient = await Client.create({
        documentType,
        documentNumber,
        firstName,
        lastName,
        email,
        phone,
        password, // This should already be hashed by middleware
        address: address || null,
        status: status !== undefined ? status : true
      }, { transaction });

      await transaction.commit();

      // Get the created client without password
      const createdClient = await this.getClientById(newClient.id_client);

      return {
        success: true,
        message: 'Cliente creado exitosamente',
        data: createdClient.data
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
        documentType,
        documentNumber,
        firstName,
        lastName,
        email,
        phone,
        password,
        address,
        status
      } = clientData;

      // Check if client exists
      const existingClient = await Client.findByPk(id);
      if (!existingClient) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Cliente no encontrado',
          error: 'CLIENT_NOT_FOUND'
        };
      }

      // Check if new email already exists (if email is being updated)
      if (email && email !== existingClient.email) {
        const clientWithSameEmail = await Client.findOne({ 
          where: { 
            email,
            id_client: { [sequelize.Op.ne]: id } // Exclude current client from check
          } 
        });
        if (clientWithSameEmail) {
          await transaction.rollback();
          return {
            success: false,
            message: 'El correo electrónico ya está registrado',
            error: 'EMAIL_EXISTS'
          };
        }
      }

      // Check if new document number already exists (if document is being updated)
      if (documentNumber && documentNumber !== existingClient.documentNumber) {
        const clientWithSameDocument = await Client.findOne({ 
          where: { 
            documentNumber,
            id_client: { [sequelize.Op.ne]: id } // Exclude current client from check
          } 
        });
        if (clientWithSameDocument) {
          await transaction.rollback();
          return {
            success: false,
            message: 'El número de documento ya está registrado',
            error: 'DOCUMENT_EXISTS'
          };
        }
      }

      // Update client data
      const updateData = {};
      if (documentType !== undefined) updateData.documentType = documentType;
      if (documentNumber !== undefined) updateData.documentNumber = documentNumber;
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (password !== undefined) updateData.password = password; // This should already be hashed by middleware
      if (address !== undefined) updateData.address = address;
      if (status !== undefined) updateData.status = status;

      await existingClient.update(updateData, { transaction });

      await transaction.commit();

      // Get the updated client without password
      const updatedClient = await this.getClientById(id);

      return {
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: updatedClient.data
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  // Delete client (soft delete by setting status to false)
  static async deleteClient(id) {
    const transaction = await sequelize.transaction();
    
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Cliente no encontrado',
          error: 'CLIENT_NOT_FOUND'
        };
      }

      // Soft delete by setting status to false
      await client.update({ status: false }, { transaction });

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
      const totalClients = await Client.count({ where: { status: true } });
      const activeClients = await Client.count({ where: { status: true } });
      const inactiveClients = await Client.count({ where: { status: false } });

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
      const { searchTerm, documentType, status } = criteria;
      
      const whereClause = {};
      
      if (searchTerm) {
        whereClause[sequelize.Op.or] = [
          { firstName: { [sequelize.Op.iLike]: `%${searchTerm}%` } },
          { lastName: { [sequelize.Op.iLike]: `%${searchTerm}%` } },
          { email: { [sequelize.Op.iLike]: `%${searchTerm}%` } },
          { documentNumber: { [sequelize.Op.iLike]: `%${searchTerm}%` } }
        ];
      }
      
      if (documentType) {
        whereClause.documentType = documentType;
      }
      
      if (status !== undefined) {
        whereClause.status = status;
      }

      const clients = await Client.findAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        order: [['firstName', 'ASC']]
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
}

module.exports = ClientService;
