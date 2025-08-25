const Client = require('../../models/clients/Client');
const Usuario = require('../../models/User');
const { sequelize } = require('../../config/database');

class ClientService {
  // Get all clients with user data
  static async getAllClients() {
    try {
      const clients = await Client.findAll({
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['contrasena'] }
        }],
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
      const client = await Client.findByPk(id, {
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['contrasena'] }
        }]
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
        include: [{
          model: Usuario,
          as: 'usuario',
          where: { correo: email },
          attributes: { exclude: ['contrasena'] }
        }]
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
        include: [{
          model: Usuario,
          as: 'usuario',
          where: { documento: documentNumber },
          attributes: { exclude: ['contrasena'] }
        }]
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

      // Mapear los campos del request a los campos del modelo Usuario
      const nombre_completo = `${firstName} ${lastName}`;
      
      // Create user first
      const newUser = await Usuario.create({
        nombre: nombre_completo,
        tipo_documento: documentType,
        documento: documentNumber,
        correo: email,
        telefono: phone,
        contrasena: password // Ya viene hasheado del middleware
      }, { transaction });

      // Then create client
      const newClient = await Client.create({
        id_usuario: newUser.id_usuario,
        direccion: address || null,
        estado: status !== undefined ? status : true
      }, { transaction });

      await transaction.commit();

      // Get the complete client data
      const createdClient = await this.getClientById(newClient.id_cliente);

      return {
        success: true,
        message: 'Cliente creado exitosamente',
        data: createdClient.data
      };
    } catch (error) {
      await transaction.rollback();
      
      // Handle specific database errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields.correo) {
          return {
            success: false,
            message: 'El correo electrónico ya está registrado',
            error: 'EMAIL_EXISTS'
          };
        }
        if (error.fields.documento) {
          return {
            success: false,
            message: 'El número de documento ya está registrado',
            error: 'DOCUMENT_EXISTS'
          };
        }
      }
      
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

      // Find the client with user data
      const existingClient = await Client.findByPk(id, {
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      });

      if (!existingClient) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Cliente no encontrado',
          error: 'CLIENT_NOT_FOUND'
        };
      }

      // Update user data if provided
      const userUpdateData = {};
      if (firstName && lastName) userUpdateData.nombre = `${firstName} ${lastName}`;
      if (documentType) userUpdateData.tipo_documento = documentType;
      if (documentNumber) userUpdateData.documento = documentNumber;
      if (email) userUpdateData.correo = email;
      if (phone) userUpdateData.telefono = phone;
      if (password) userUpdateData.contrasena = password;

      if (Object.keys(userUpdateData).length > 0) {
        await existingClient.usuario.update(userUpdateData, { transaction });
      }

      // Update client-specific data
      const clientUpdateData = {};
      if (address !== undefined) clientUpdateData.direccion = address;
      if (status !== undefined) clientUpdateData.estado = status;

      if (Object.keys(clientUpdateData).length > 0) {
        await existingClient.update(clientUpdateData, { transaction });
      }

      await transaction.commit();

      // Get the updated client
      const updatedClient = await this.getClientById(id);

      return {
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: updatedClient.data
      };
    } catch (error) {
      await transaction.rollback();
      
      // Handle specific database errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields.correo) {
          return {
            success: false,
            message: 'El correo electrónico ya está registrado',
            error: 'EMAIL_EXISTS'
          };
        }
        if (error.fields.documento) {
          return {
            success: false,
            message: 'El número de documento ya está registrado',
            error: 'DOCUMENT_EXISTS'
          };
        }
      }
      
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  // Delete client (soft delete)
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

  // Search clients
  static async searchClients(criteria) {
    try {
      const { searchTerm, documentType, status } = criteria;
      
      const whereClause = {};
      const userWhereClause = {};
      
      if (searchTerm) {
        userWhereClause[sequelize.Op.or] = [
          { nombre: { [sequelize.Op.iLike]: `%${searchTerm}%` } },
          { correo: { [sequelize.Op.iLike]: `%${searchTerm}%` } },
          { documento: { [sequelize.Op.iLike]: `%${searchTerm}%` } }
        ];
      }
      
      if (documentType) {
        userWhereClause.tipo_documento = documentType;
      }
      
      if (status !== undefined) {
        whereClause.estado = status;
      }

      const clients = await Client.findAll({
        where: whereClause,
        include: [{
          model: Usuario,
          as: 'usuario',
          where: userWhereClause,
          attributes: { exclude: ['contrasena'] }
        }],
        order: [[{ model: Usuario, as: 'usuario' }, 'nombre', 'ASC']]
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